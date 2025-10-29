// API configuration and utilities
export const API_BASE_URLS = {
  PRODUCT_SERVICE: 'http://localhost:3001',
  ORDER_SERVICE: 'http://localhost:3002',
} as const;

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  ORDERS: '/orders',
  ORDERS_WITH_PRODUCTS: '/orders/with-products',
} as const;

// Utility function for handling API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

// Utility function for making API requests
export const apiRequest = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
