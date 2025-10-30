import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';

interface GetOrderRequest {
  id: string;
}

interface GetOrdersRequest {
  customerEmail?: string;
  status?: string;
  limit?: number;
}

interface GetOrdersByCustomerRequest {
  customerEmail: string;
}

interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  shippingAddress: string;
}

interface UpdateOrderStatusRequest {
  id: string;
  status: string;
}

@Controller()
export class OrderGrpcController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrderService', 'GetOrder')
  async getOrder(request: GetOrderRequest) {
    const order = await this.orderService.findOne(request.id);
    return this.transformOrderToGrpcResponse(order);
  }

  @GrpcMethod('OrderService', 'GetOrders')
  async getOrders(request: GetOrdersRequest) {
    let orders;
    
    if (request.customerEmail) {
      orders = await this.orderService.findByCustomerEmail(request.customerEmail);
    } else if (request.status) {
      orders = await this.orderService.findByStatus(request.status as any);
    } else {
      orders = await this.orderService.findAll();
    }

    if (request.limit) {
      orders = orders.slice(0, request.limit);
    }

    return {
      orders: orders.map(order => this.transformOrderToGrpcResponse(order))
    };
  }

  @GrpcMethod('OrderService', 'GetOrdersByCustomer')
  async getOrdersByCustomer(request: GetOrdersByCustomerRequest) {
    const orders = await this.orderService.findByCustomerEmail(request.customerEmail);
    return {
      orders: orders.map(order => this.transformOrderToGrpcResponse(order))
    };
  }

  @GrpcMethod('OrderService', 'CreateOrder')
  async createOrder(request: CreateOrderRequest) {
    const order = await this.orderService.create(request);
    return this.transformOrderToGrpcResponse(order);
  }

  @GrpcMethod('OrderService', 'UpdateOrderStatus')
  async updateOrderStatus(request: UpdateOrderStatusRequest) {
    const order = await this.orderService.updateStatus(request.id, request.status as any);
    return this.transformOrderToGrpcResponse(order);
  }

  private transformOrderToGrpcResponse(order: any) {
    return {
      id: order._id?.toString() || order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      productId: order.productId,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      status: order.status,
      createdAt: order.createdAt?.toISOString() || '',
      updatedAt: order.updatedAt?.toISOString() || ''
    };
  }
}
