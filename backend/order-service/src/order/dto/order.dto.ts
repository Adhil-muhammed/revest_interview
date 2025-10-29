import { IsString, IsNumber, IsOptional, IsEnum, IsEmail, Min, Max, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';
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
  @Length(1, 50, { message: 'Product ID must be between 1 and 50 characters' })
  productId: string;

  @IsNumber({}, { message: 'Quantity must be a valid number' })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(1000, { message: 'Quantity cannot exceed 1000' })
  quantity: number;

  @IsString()
  @Length(2, 100, { message: 'Customer name must be between 2 and 100 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  customerName: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  customerEmail?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20, { message: 'Phone number must not exceed 20 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\s+/g, '') : value)
  customerPhone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Shipping address must not exceed 500 characters' })
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Product ID must be between 1 and 50 characters' })
  productId?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a valid number' })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(1000, { message: 'Quantity cannot exceed 1000' })
  quantity?: number;

  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'Customer name must be between 2 and 100 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  customerName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  customerEmail?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20, { message: 'Phone number must not exceed 20 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\s+/g, '') : value)
  customerPhone?: string;

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  status?: OrderStatus;

  @IsOptional()
  @IsNumber({}, { message: 'Total amount must be a valid number' })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @Min(0, { message: 'Total amount must be positive' })
  totalAmount?: number;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Shipping address must not exceed 500 characters' })
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}
