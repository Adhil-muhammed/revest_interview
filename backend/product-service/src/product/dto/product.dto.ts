import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

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
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;
}
