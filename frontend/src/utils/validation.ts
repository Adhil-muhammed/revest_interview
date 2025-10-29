// Validation and data transformation utilities

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
}

/**
 * Convert and validate product data from form input
 */
export const validateProductData = (data: any): ValidationResult => {
  const errors: string[] = [];
  const validatedData: any = { ...data };

  // Validate and convert price
  if (data.price !== undefined && data.price !== null) {
    const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
    if (isNaN(price)) {
      errors.push('Price must be a valid number');
    } else if (price < 0) {
      errors.push('Price must be positive');
    } else if (price > 999999) {
      errors.push('Price is too high (maximum $999,999)');
    } else {
      validatedData.price = parseFloat(price.toFixed(2)); // Ensure 2 decimal places
    }
  }

  // Validate and convert stock quantity
  if (data.stockQuantity !== undefined && data.stockQuantity !== null && data.stockQuantity !== '') {
    const stockQuantity = typeof data.stockQuantity === 'string' ? parseInt(data.stockQuantity) : data.stockQuantity;
    if (isNaN(stockQuantity)) {
      errors.push('Stock quantity must be a valid number');
    } else if (stockQuantity < 0) {
      errors.push('Stock quantity must be positive');
    } else if (stockQuantity > 999999) {
      errors.push('Stock quantity is too high (maximum 999,999)');
    } else {
      validatedData.stockQuantity = Math.floor(stockQuantity); // Ensure integer
    }
  }

  // Validate name
  if (!data.name || data.name.trim() === '') {
    errors.push('Product name is required');
  } else if (data.name.length > 200) {
    errors.push('Product name must not exceed 200 characters');
  } else {
    validatedData.name = data.name.trim();
  }

  // Validate SKU if provided
  if (data.sku && data.sku.length > 50) {
    errors.push('SKU must not exceed 50 characters');
  } else if (data.sku) {
    validatedData.sku = data.sku.trim();
  }

  // Validate category if provided
  if (data.category && data.category.length > 100) {
    errors.push('Category must not exceed 100 characters');
  } else if (data.category) {
    validatedData.category = data.category.trim();
  }

  // Validate description if provided
  if (data.description && data.description.length > 1000) {
    errors.push('Description must not exceed 1000 characters');
  } else if (data.description) {
    validatedData.description = data.description.trim();
  }

  // Validate image URL if provided
  if (data.imageUrl && data.imageUrl.length > 500) {
    errors.push('Image URL must not exceed 500 characters');
  } else if (data.imageUrl) {
    validatedData.imageUrl = data.imageUrl.trim();
  }

  // Convert boolean values
  if (data.inStock !== undefined) {
    validatedData.inStock = Boolean(data.inStock);
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: validatedData
  };
};

/**
 * Convert and validate order data from form input
 */
export const validateOrderData = (data: any): ValidationResult => {
  const errors: string[] = [];
  const validatedData: any = { ...data };

  // Validate and convert quantity
  if (data.quantity !== undefined && data.quantity !== null) {
    const quantity = typeof data.quantity === 'string' ? parseInt(data.quantity) : data.quantity;
    if (isNaN(quantity)) {
      errors.push('Quantity must be a valid number');
    } else if (quantity < 1) {
      errors.push('Quantity must be at least 1');
    } else if (quantity > 1000) {
      errors.push('Quantity is too high (maximum 1000)');
    } else {
      validatedData.quantity = Math.floor(quantity); // Ensure integer
    }
  }

  // Validate product ID
  if (!data.productId || data.productId.trim() === '') {
    errors.push('Product selection is required');
  } else {
    validatedData.productId = data.productId.trim();
  }

  // Validate customer name
  if (!data.customerName || data.customerName.trim() === '') {
    errors.push('Customer name is required');
  } else if (data.customerName.length < 2) {
    errors.push('Customer name must be at least 2 characters');
  } else if (data.customerName.length > 100) {
    errors.push('Customer name must not exceed 100 characters');
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.customerName.trim())) {
    errors.push('Customer name can only contain letters, spaces, hyphens and apostrophes');
  } else {
    validatedData.customerName = data.customerName.trim();
  }

  // Validate customer email if provided
  if (data.customerEmail && data.customerEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customerEmail.trim())) {
      errors.push('Please provide a valid email address');
    } else {
      validatedData.customerEmail = data.customerEmail.trim().toLowerCase();
    }
  }

  // Validate customer phone if provided
  if (data.customerPhone && data.customerPhone.trim()) {
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,19}$/;
    const cleanPhone = data.customerPhone.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.push('Please provide a valid phone number');
    } else if (cleanPhone.length > 20) {
      errors.push('Phone number is too long');
    } else {
      validatedData.customerPhone = cleanPhone;
    }
  }

  // Validate shipping address if provided
  if (data.shippingAddress && data.shippingAddress.length > 500) {
    errors.push('Shipping address must not exceed 500 characters');
  } else if (data.shippingAddress) {
    validatedData.shippingAddress = data.shippingAddress.trim();
  }

  // Validate notes if provided
  if (data.notes && data.notes.length > 1000) {
    errors.push('Notes must not exceed 1000 characters');
  } else if (data.notes) {
    validatedData.notes = data.notes.trim();
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: validatedData
  };
};


