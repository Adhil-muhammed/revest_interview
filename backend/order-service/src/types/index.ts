// Re-export all interfaces and types from DTOs for easy import
export * from '../order/dto/order.dto';
export * from '../order/schemas/order.schema';

// Additional utility types if needed
export type OrderId = string;
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
