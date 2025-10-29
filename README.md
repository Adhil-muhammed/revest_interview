# Dynamic Component Builder Application

This project demonstrates a responsive application using Next.js and TypeScript that allows users to create and add their custom components with dynamic form fields based on JSON configuration, along with a complete microservices architecture backend.

## 🌟 Key Features

### ✨ Dynamic Signup Form Builder
- **3 Main Fields**: Full Name, Email, Gender + Additional Dynamic Fields
- **Real-time JSON Editing**: Live form updates when JSON configuration changes
- **Field Type Switching**: Dynamic rendering (TEXT ↔ LIST ↔ RADIO ↔ CHECKBOX)
- **Comprehensive Validation**: React Hook Forms with proper validation
- **Material-UI Design**: Responsive and visually appealing interface
- **Data Persistence**: Local storage for form submissions and history

### 🏗️ Microservices Architecture
- **Product Service**: Complete CRUD operations for products
- **Order Service**: Order management with product integration
- **Frontend Dashboard**: Comprehensive testing interface for all services

## 📁 Project Structure

```
revest_interview/
├── backend/
│   ├── product-service/          # Product management microservice (Port 3001)
│   └── order-service/            # Order management microservice (Port 3002)
├── frontend/                     # Next.js application (Port 3000)
│   ├── src/
│   │   ├── app/                  # Next.js app router
│   │   ├── components/           # Reusable components
│   │   │   ├── SignupForm.tsx    # 🎯 Main dynamic form component
│   │   │   ├── DynamicForm.tsx   # Additional dynamic form features
│   │   │   ├── ProductManager.tsx # Product management UI
│   │   │   └── OrderManager.tsx  # Order management UI
│   │   ├── data/
│   │   │   └── formConfig.json   # 📝 Dynamic form configuration
│   │   └── utils/
│   └── package.json
├── docker-compose.yml            # MongoDB setup
├── init-mongo.js                 # Database initialization
└── README.md                     # This file
```

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker & Docker Compose**
- **npm** or **yarn**

### 1. Clone Repository

```bash
git clone https://github.com/Adhil-muhammed/revest_interview.git
cd revest_interview
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend/product-service && npm install && cd ../..
cd backend/order-service && npm install && cd ../..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Start MongoDB with Docker

```bash
# Start MongoDB container
docker-compose up -d mongodb

# Wait for MongoDB to be ready (about 10-15 seconds)
```

### 4. Start All Services
<!-- 
**Option A: Start all services simultaneously**
```bash
# Make the setup script executable and run it
chmod +x setup.sh
./setup.sh
``` -->

**Start services individually**
```bash
# Terminal 1 - Product Service
cd backend/product-service
npm run start:dev

# Terminal 2 - Order Service  
cd backend/order-service
npm run start:dev

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### 5. Access Applications

- **🎯 Main Application (Dynamic Form)**: http://localhost:3000
- **📊 Microservices Dashboard**: http://localhost:3000/test-microservices
- **📦 Product Service API**: http://localhost:3001
- **📋 Order Service API**: http://localhost:3002

## 🎯 Main Application Features

### Dynamic Signup Form Builder

The main application (`/`) showcases a dynamic signup form that demonstrates all the requirements:

#### ✅ 1. Signup Form with 3 Main Fields
- **Full Name**: Text field with validation (1-100 characters)
- **Email**: Email field with format validation (1-50 characters)  
- **Gender**: Dynamic LIST selection (Male/Female/Others)
- **Love React?**: Additional RADIO field (Yes/No)

#### ✅ 2. React Hook Forms Validation
- **Required field validation**
- **Email format validation**
- **Min/Max length constraints**
- **Real-time error feedback**
- **Custom error messages per field**

#### ✅ 3. Dynamic JSON-Based Fields
- **Live JSON editor** with syntax validation
- **Real-time form updates** when JSON changes
- **Field type switching**: Change `fieldType` from "TEXT" to "LIST" or "RADIO"
- **Dynamic labels**: Change field names instantly
- **Required/Optional toggling**: Change `required` property
- **Default values**: Set initial field values

#### ✅ 4. Material-UI Responsive Design & Data Persistence
- **Mobile-responsive interface**
- **Material-UI components** for consistent design
- **Local storage persistence** for form submissions
- **Submission history** with timestamps
- **Visually appealing user interface**

### 🔧 Live JSON Configuration Editor

The application includes a built-in JSON editor that allows you to:

1. **Edit form configuration in real-time**
2. **See instant form updates** as you change the JSON
3. **Validate JSON structure** with error feedback
4. **Reset to default configuration**
5. **Preview current field configuration**

### Example: Change Field Types Live

Try changing the JSON configuration:

```json
{
  "data": [
    {
      "id": 6,
      "name": "Gender",
      "fieldType": "RADIO",    // ← Change to "LIST" for dropdown
      "defaultValue": "1",
      "required": true,
      "listOfValues1": ["Male", "Female", "Others"]
    }
  ]
}
```

**Result**: The Gender field instantly switches from dropdown to radio buttons!

## 🏗️ Backend Services Architecture

### Product Service (Port 3001)
- **Features**: Complete CRUD operations for products
- **Database**: MongoDB with Mongoose ODM
- **Communication**: REST API + gRPC for inter-service communication
- **Endpoints**: Full product management API

### Order Service (Port 3002)  
- **Features**: Order management with product integration via gRPC
- **Database**: MongoDB with Mongoose ODM
- **Communication**: REST API + gRPC client for Product Service
- **Special Features**: Orders with product details aggregation

## 📡 API Endpoints

### Product Service (http://localhost:3001)
```bash
GET    /products              # Get all products
GET    /products/:id          # Get product by ID  
POST   /products              # Create new product
PUT    /products/:id          # Update product
DELETE /products/:id          # Delete product
```

### Order Service (http://localhost:3002)
```bash
GET    /orders                # Get all orders
GET    /orders/:id            # Get order by ID
GET    /orders/with-products  # Get orders with product details (gRPC integration)
POST   /orders                # Create new order
PUT    /orders/:id            # Update order
DELETE /orders/:id            # Delete order
```

## 🧪 Testing the Application

### 1. Test Dynamic Form Builder

1. **Navigate to main application**: http://localhost:3000
2. **Try the form**: Fill out the signup form with validation
3. **Edit JSON live**: Expand "Dynamic JSON Configuration Editor"
4. **Change field types**: Try changing `"fieldType": "LIST"` to `"fieldType": "RADIO"`
5. **Submit form**: Check local storage for persistence
6. **View history**: See saved registrations below the form

### 2. Test Microservices

**Via Frontend Dashboard**:
1. Navigate to http://localhost:3000/test-microservices
2. Use the integrated UI to test all services

**Via cURL Commands**:
```bash
# Create a product
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "price": 1299.99,
    "description": "High-performance gaming laptop",
    "category": "Electronics"
  }'

# Create an order (use product ID from above)
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID_HERE",
    "quantity": 2,
    "customerName": "John Doe",
    "customerEmail": "john@example.com"
  }'

# Get orders with product details (gRPC integration)
curl http://localhost:3002/orders/with-products
```

## 🎨 Frontend Features Deep Dive

### Dynamic Form Builder Components

#### Supported Field Types:
- **TEXT**: Input fields with min/max length validation
- **EMAIL**: Email fields with format validation  
- **NUMBER**: Numeric input fields
- **LIST**: Dropdown/Select components with options
- **RADIO**: Radio button groups with options
- **CHECKBOX**: Checkbox fields with boolean validation
- **TEXTAREA**: Multi-line text areas

#### Advanced Features:
- **Material-UI Styling**: Consistent, professional design
- **React Hook Form Integration**: Efficient form state management
- **Yup Validation**: Comprehensive validation schema
- **Responsive Design**: Mobile-first approach
- **Local Storage Persistence**: Client-side data storage
- **Real-time JSON Editing**: Live configuration updates
- **Error Handling**: User-friendly error messages
- **Form History**: Track all submissions with timestamps

### Complete JSON Configuration Schema

```json
{
  "data": [
    {
      "id": 1,                           // Unique field identifier
      "name": "Full Name",               // Field label
      "fieldType": "TEXT",               // Field type (TEXT|EMAIL|LIST|RADIO|CHECKBOX|TEXTAREA|NUMBER)
      "minLength": 1,                    // Minimum length (optional)
      "maxLength": 100,                  // Maximum length (optional)
      "defaultValue": "John Doe",        // Default value (optional)
      "required": true,                  // Required validation
      "listOfValues1": ["Option1", "Option2"]  // Options for LIST/RADIO (optional)
    }
  ]
}
```

### Dynamic Configuration Examples

**Example 1: Change Gender from LIST to RADIO**
```json
{
  "id": 6,
  "name": "Gender",
  "fieldType": "RADIO",        // Changed from "LIST"
  "required": true,
  "listOfValues1": ["Male", "Female", "Others"]
}
```

**Example 2: Add a new Checkbox field**
```json
{
  "id": 8,
  "name": "Subscribe to Newsletter",
  "fieldType": "CHECKBOX",
  "defaultValue": "false",
  "required": false
}
```

**Example 3: Change field name and make optional**
```json
{
  "id": 1,
  "name": "Your Name",         // Changed from "Full Name"
  "fieldType": "TEXT",
  "required": false,           // Changed from true
  "minLength": 2,
  "maxLength": 50
}
```

## 💻 Technologies Used

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Material-UI (MUI)**: React component library
- **React Hook Form**: Performant forms with easy validation
- **Yup**: Schema validation library
- **Local Storage**: Client-side data persistence

### Backend Stack  
- **NestJS**: Progressive Node.js framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **gRPC**: High-performance RPC framework
- **Docker**: Containerization for development

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting  
- **Docker Compose**: Multi-container development
- **Hot Reload**: Development server with live updates

## 📊 Database Schemas

### Product Schema
```javascript
{
  name: String (required),
  price: Number (required),
  description: String,
  category: String,
  inStock: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Order Schema
```javascript
{
  productId: String (required),
  quantity: Number (required),
  customerName: String (required),
  customerEmail: String,
  status: String (enum: ['pending', 'confirmed', 'shipped', 'delivered']),
  totalAmount: Number,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔧 Development Notes

### Microservices Communication
- **REST APIs**: External client communication
- **gRPC**: Inter-service communication (Product ↔ Order)
- **MongoDB**: Shared database with separate collections

### Form Validation Features
- **Dynamic Schema Generation**: Validation rules from JSON
- **Real-time Validation**: Immediate feedback on field changes
- **Custom Error Messages**: User-friendly validation messages
- **Cross-field Validation**: Complex validation rules support

### Performance Optimizations
- **Component Memoization**: Optimized re-renders
- **Form State Management**: Efficient form updates
- **Lazy Loading**: Code splitting for better performance
- **Material-UI Tree Shaking**: Optimized bundle size

## 🚨 Troubleshooting

### Common Issues

**MongoDB Connection Error**:
```bash
# Ensure MongoDB is running
docker-compose ps
# Restart if needed
docker-compose restart mongodb
```

**Port Already in Use**:
```bash
# Kill processes on ports
sudo lsof -ti:3000 | xargs kill -9  # Frontend
sudo lsof -ti:3001 | xargs kill -9  # Product Service  
sudo lsof -ti:3002 | xargs kill -9  # Order Service
```

**Dependencies Issues**:
```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules backend/*/node_modules
rm -rf frontend/package-lock.json backend/*/package-lock.json
# Then reinstall dependencies
```

**gRPC Connection Issues**:
- Ensure Product Service is running before Order Service
- Check logs for connection errors
- Restart services in correct order
