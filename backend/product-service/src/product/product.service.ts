import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product, ProductDocument } from './schemas/product.schema';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductResponse,
  GetProductRequest,
  GetProductsRequest,
  GetProductsResponse
} from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return this.productRepository.findByIds(ids);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productRepository.updateById(id, updateProductDto);
    
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.productRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    const updatedStockQuantity = Math.max(0, product.stockQuantity - quantity);
    const updatedProduct = await this.productRepository.updateById(id, {
      stockQuantity: updatedStockQuantity,
      inStock: updatedStockQuantity > 0
    });
    
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return updatedProduct;
  }

  // gRPC methods
  async getProduct(data: GetProductRequest): Promise<ProductResponse> {
    const product = await this.findOne(data.id) as ProductDocument;
    return {
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      inStock: product.inStock,
      imageUrl: product.imageUrl,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      createdAt: (product as any).createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: (product as any).updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  async getProducts(data: GetProductsRequest): Promise<GetProductsResponse> {
    const products = await this.findByIds(data.ids) as ProductDocument[];
    const productResponses: ProductResponse[] = products.map(product => ({
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      inStock: product.inStock,
      imageUrl: product.imageUrl,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      createdAt: (product as any).createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: (product as any).updatedAt?.toISOString() || new Date().toISOString(),
    }));
    
    return { products: productResponses };
  }
}
