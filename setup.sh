#!/bin/bash

# Revest Solutions - Complete Setup Script
echo "🚀 Setting up Revest Solutions Microservices Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher)."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Start MongoDB
echo "📦 Starting MongoDB..."
docker run -d --name revest_mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=revest_db \
  mongo:6.0

echo "⏳ Waiting for MongoDB to start..."
sleep 10

# Install dependencies for Product Service
echo "📋 Installing Product Service dependencies..."
cd backend/product-service
npm install

# Install dependencies for Order Service
echo "📋 Installing Order Service dependencies..."
cd ../order-service
npm install

# Install dependencies for Frontend
echo "📋 Installing Frontend dependencies..."
cd ../../frontend
npm install

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 To start the application:"
echo "1. Start Product Service: cd backend/product-service && npm run start:dev"
echo "2. Start Order Service: cd backend/order-service && npm run start:dev"
echo "3. Start Frontend: cd frontend && npm run dev"
echo ""
echo "📍 Application URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Product Service: http://localhost:3001"
echo "- Order Service: http://localhost:3002"
echo "- MongoDB: mongodb://admin:password123@localhost:27017/revest_db"
