import { FormField } from '../types';

// Validation utilities for dynamic form
export const validateField = (field: FormField, value: string): string | null => {
  // Required field validation
  if (field.required && (!value || value.trim() === '')) {
    return `${field.name} is required`;
  }

  // Min length validation
  if (field.minLength && value && value.length < field.minLength) {
    return `${field.name} must be at least ${field.minLength} characters`;
  }

  // Max length validation
  if (field.maxLength && value && value.length > field.maxLength) {
    return `${field.name} must not exceed ${field.maxLength} characters`;
  }

  // Email validation for email fields
  if (field.name.toLowerCase().includes('email') && value) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
  }

  return null;
};

// Generate default values from form configuration
export const generateDefaultValues = (fields: FormField[]): Record<string, string> => {
  return fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || '';
    return acc;
  }, {} as Record<string, string>);
};

// Format submitted data for display
export const formatSubmittedData = (data: Record<string, any>): Record<string, string> => {
  const formatted = { ...data };
  delete formatted.id;
  delete formatted.timestamp;
  return formatted;
};
