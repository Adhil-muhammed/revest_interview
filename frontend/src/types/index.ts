export interface FormField {
  id: number;
  name: string;
  fieldType: 'TEXT' | 'LIST' | 'RADIO';
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  required: boolean;
  listOfValues1?: string[];
}

export interface DynamicFormData {
  data: FormField[];
}

export interface Product {
  _id: string;
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

export interface Order {
  _id: string;
  productId: string;
  quantity: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface CreateProductDto {
  name: string;
  price: number;
  description?: string;
  category?: string;
  inStock?: boolean;
  imageUrl?: string;
  sku?: string;
  stockQuantity?: number;
}

export interface CreateOrderDto {
  productId: string;
  quantity: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  notes?: string;
}
