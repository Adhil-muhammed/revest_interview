# Revest Solutions - Microservices Full Stack Application

This project demonstrates a microservices architecture with NestJS backend services and a Next.js frontend application.

## Project Structure

```
revest_interview/
├── backend/
│   ├── product-service/          # Product management microservice
│   ├── order-service/            # Order management microservice
│   └── api-gateway/              # API Gateway (optional)
├── frontend/                     # Next.js frontend application
└── docker-compose.yml            # Docker setup for services
```

## Backend Services

### Product Service
- **Port**: 3001
- **Features**: CRUD operations for products
- **Database**: MongoDB (via Docker)
- **Communication**: REST API and gRPC

### Order Service
- **Port**: 3002
- **Features**: CRUD operations for orders, communicates with Product Service
- **Database**: MongoDB (via Docker)
- **Communication**: REST API and gRPC

## Frontend Application

### Next.js App
- **Port**: 3000
- **Features**: 
  - Dynamic form builder based on JSON configuration
  - Material-UI components
  - TypeScript support
  - Form validation with React Hook Form
  - Local storage for data persistence

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- pnpm or npm

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd revest_interview

# Install backend dependencies
cd backend/product-service && npm install && cd ../..
cd backend/order-service && npm install && cd ../..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Start MongoDB with Docker

```bash
docker-compose up -d mongodb
```

### 3. Start Backend Services

```bash
# Terminal 1 - Product Service
cd backend/product-service
npm run start:dev

# Terminal 2 - Order Service
cd backend/order-service
npm run start:dev
```

### 4. Start Frontend Application

```bash
# Terminal 3 - Frontend
cd frontend
npm run dev
```

### 5. Access Applications

- **Frontend**: http://localhost:3000
- **Product Service**: http://localhost:3001
- **Order Service**: http://localhost:3002

## API Endpoints

### Product Service (Port 3001)
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Order Service (Port 3002)
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `GET /orders/with-products` - Get orders with product details
- `POST /orders` - Create order
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

## Frontend Features

### Dynamic Form Builder
The frontend includes a dynamic form that renders based on JSON configuration:

#### Supported Field Types:
- **TEXT**: Input fields with validation
- **LIST**: Dropdown/Select components
- **RADIO**: Radio button groups

#### Features:
- Material-UI styling
- React Hook Form validation
- Responsive design
- Local storage persistence
- Dynamic field rendering based on JSON

### Example Form Configuration

```json
{
  "data": [
    {
      "id": 1,
      "name": "Full Name",
      "fieldType": "TEXT",
      "minLength": 1,
      "maxLength": 100,
      "defaultValue": "John Doe",
      "required": true
    },
    {
      "id": 2,
      "name": "Email",
      "fieldType": "TEXT",
      "minLength": 1,
      "maxLength": 50,
      "defaultValue": "hello@mail.com",
      "required": true
    },
    {
      "id": 6,
      "name": "Gender",
      "fieldType": "LIST",
      "defaultValue": "1",
      "required": true,
      "listOfValues1": ["Male", "Female", "Others"]
    },
    {
      "id": 7,
      "name": "Love React?",
      "fieldType": "RADIO",
      "defaultValue": "1",
      "required": true,
      "listOfValues1": ["Yes", "No"]
    }
  ]
}
```

## Testing the Application

### Backend Testing
```bash
# Product Service
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99, "description": "Gaming Laptop"}'

# Order Service
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{"productId": "PRODUCT_ID_HERE", "quantity": 1, "customerName": "John Doe"}'

# Get orders with products
curl http://localhost:3002/orders/with-products
```

### Frontend Testing
1. Navigate to http://localhost:3000
2. Fill out the dynamic form
3. Submit and check local storage for persistence
4. Modify the JSON configuration to see dynamic field changes

## Technologies Used

### Backend
- **NestJS**: Node.js framework for building efficient server-side applications
- **MongoDB**: NoSQL database for data persistence
- **Mongoose**: MongoDB object modeling tool
- **gRPC**: High-performance RPC framework for service communication
- **Docker**: Containerization for MongoDB

### Frontend
- **Next.js**: React framework for production
- **TypeScript**: Typed superset of JavaScript
- **Material-UI**: React components for faster development
- **React Hook Form**: Forms with easy validation
- **Local Storage**: Client-side data persistence

## Development Notes

### Microservices Communication
The services communicate via:
1. **REST APIs**: For external communication
2. **gRPC**: For inter-service communication (Product → Order)

### Database Schema

#### Product Schema
```javascript
{
  name: String (required),
  price: Number (required),
  description: String,
  category: String,
  inStock: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Schema
```javascript
{
  productId: String (required),
  quantity: Number (required),
  customerName: String (required),
  customerEmail: String,
  status: String (enum: ['pending', 'confirmed', 'shipped', 'delivered']),
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is for demonstration purposes as part of the Revest Solutions technical assessment.
