// MongoDB initialization script
db = db.getSiblingDB('revest_db');

// Create collections
db.createCollection('products');
db.createCollection('orders');

// Insert sample data
db.products.insertMany([
  {
    name: 'Gaming Laptop',
    price: 1299.99,
    description: 'High-performance gaming laptop with RTX 4060',
    category: 'Electronics',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Wireless Headphones',
    price: 299.99,
    description: 'Premium noise-cancelling wireless headphones',
    category: 'Audio',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Smartphone',
    price: 899.99,
    description: 'Latest flagship smartphone with AI camera',
    category: 'Mobile',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized with sample data');
