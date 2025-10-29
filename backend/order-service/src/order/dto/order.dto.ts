import { IsString, IsNumber, IsOptional, IsEnum, IsEmail, Min } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

// Product interface for gRPC responses
export interface ProductResponse {
  id: string;
  _id?: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  imageUrl: string;
  sku: string;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

// gRPC service interface
export interface ProductService {
  getProduct(data: { id: string }): import('rxjs').Observable<ProductResponse>;
  getProducts(data: { ids: string[] }): import('rxjs').Observable<{ products: ProductResponse[] }>;
}

// Order with product details interface
export interface OrderWithProduct {
  _id: string;
  productId: string;
  quantity: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  product?: ProductResponse | null;
}

export class CreateOrderDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
