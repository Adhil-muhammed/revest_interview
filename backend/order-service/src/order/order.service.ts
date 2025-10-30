import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderRepository } from './order.repository';
import { Order, OrderDocument } from './schemas/order.schema';
import { 
  CreateOrderDto, 
  UpdateOrderDto, 
  ProductService, 
  ProductResponse, 
  OrderWithProduct 
} from './dto/order.dto';

@Injectable()
export class OrderService {
  private productService: ProductService;

  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject('PRODUCT_SERVICE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductService>('ProductService');
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      // Get product details from Product Service
      const product = await firstValueFrom(
        this.productService.getProduct({ id: createOrderDto.productId })
      );

      if (!product) {
        throw new NotFoundException(`Product with ID ${createOrderDto.productId} not found`);
      }

      if (!product.inStock || product.stockQuantity < createOrderDto.quantity) {
        throw new BadRequestException('Product is out of stock or insufficient quantity');
      }

      // Calculate total amount
      const totalAmount = product.price * createOrderDto.quantity;

      const orderData = {
        ...createOrderDto,
        totalAmount,
      };

      const createdOrder = await this.orderRepository.create(orderData);
      return createdOrder;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create order');
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findAllWithProducts(): Promise<OrderWithProduct[]> {
    const orders = await this.orderRepository.findAll();
    
    if (orders.length === 0) {
      return [];
    }

    const productIds = orders.map(order => order.productId);
    const uniqueProductIds = [...new Set(productIds)] as string[];

    try {
      const productsResponse = await firstValueFrom(
        this.productService.getProducts({ ids: uniqueProductIds })
      );

      const products = productsResponse.products;
      const productMap = new Map(products.map(product => [product.id || product._id, product]));

      return orders.map(order => ({
        ...order.toObject(),
        product: productMap.get(order.productId) || null,
      })) as OrderWithProduct[];
    } catch (error) {
      // Return orders without product details if service is unavailable
      return orders.map(order => ({
        ...order.toObject(),
        product: null,
      })) as OrderWithProduct[];
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderRepository.updateById(id, updateOrderDto);
    
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.orderRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async findOneWithProduct(id: string): Promise<OrderWithProduct> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    try {
      const product = await firstValueFrom(
        this.productService.getProduct({ id: order.productId })
      );

      return {
        ...order.toObject(),
        product: product || null,
      } as OrderWithProduct;
    } catch (error) {
      return {
        ...order.toObject(),
        product: null,
      } as OrderWithProduct;
    }
  }

  async findByCustomerEmail(customerEmail: string): Promise<Order[]> {
    return this.orderRepository.findByCustomerEmail(customerEmail);
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.orderRepository.findByStatus(status as any);
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const updatedOrder = await this.orderRepository.updateOrderStatus(id, status as any);
    
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return updatedOrder;
  }

  async getOrdersSummary(): Promise<any> {
    const orders = await this.orderRepository.findAll();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentOrders = orders
      .sort((a, b) => {
        const aDate = (a as any).updatedAt || (a as any).createdAt || new Date(0);
        const bDate = (b as any).updatedAt || (b as any).createdAt || new Date(0);
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .slice(0, 5);

    return {
      totalOrders,
      totalRevenue,
      statusCounts,
      recentOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }
}
