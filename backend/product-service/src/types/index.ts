// Re-export all interfaces and types from DTOs for easy import
export * from '../product/dto/product.dto';
export * from '../product/schemas/product.schema';

// Additional utility types if needed
export type ProductId = string;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
