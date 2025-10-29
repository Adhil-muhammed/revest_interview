import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Product response interface for consistency
export interface ProductResponse {
  id: string;
  _id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  inStock: boolean;
  imageUrl?: string;
  sku?: string;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

// gRPC request interfaces
export interface GetProductRequest {
  id: string;
}

export interface GetProductsRequest {
  ids: string[];
}

export interface GetProductsResponse {
  products: ProductResponse[];
}

export class CreateProductDto {
  @IsString()
  @Length(1, 200, { message: 'Product name must be between 1 and 200 characters' })
  name: string;

  @IsNumber({}, { message: 'Price must be a valid number' })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @Min(0, { message: 'Price must be positive' })
  @Max(999999, { message: 'Price cannot exceed $999,999' })
  price: number;

  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, { message: 'Category must not exceed 100 characters' })
  category?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true' || value === '1';
    }
    return Boolean(value);
  })
  inStock?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Image URL must not exceed 500 characters' })
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50, { message: 'SKU must not exceed 50 characters' })
  sku?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Stock quantity must be a valid number' })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @Min(0, { message: 'Stock quantity must be positive' })
  @Max(999999, { message: 'Stock quantity cannot exceed 999,999' })
  stockQuantity?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(1, 200, { message: 'Product name must be between 1 and 200 characters' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @Min(0, { message: 'Price must be positive' })
  @Max(999999, { message: 'Price cannot exceed $999,999' })
  price?: number;

  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, { message: 'Category must not exceed 100 characters' })
  category?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true' || value === '1';
    }
    return Boolean(value);
  })
  inStock?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Image URL must not exceed 500 characters' })
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50, { message: 'SKU must not exceed 50 characters' })
  sku?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Stock quantity must be a valid number' })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @Min(0, { message: 'Stock quantity must be positive' })
  @Max(999999, { message: 'Stock quantity cannot exceed 999,999' })
  stockQuantity?: number;
}
