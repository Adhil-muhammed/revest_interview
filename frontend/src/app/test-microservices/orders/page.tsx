'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Alert,
  Snackbar,
  Breadcrumbs,
} from '@mui/material';
import Link from 'next/link';
import { Home, Dashboard } from '@mui/icons-material';
import OrderManager from '../../../components/OrderManager';

export default function OrdersPage() {
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link href="/test-microservices" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <Dashboard sx={{ mr: 0.5 }} fontSize="inherit" />
          Test Microservices
        </Link>
        <Typography color="text.primary">Order Management</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Order Management System
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Create and manage orders with real-time product integration via gRPC
        </Typography>
      </Box>

      {/* Order Manager Component */}
      <Paper sx={{ p: 3 }}>
        <OrderManager onNotification={showNotification} />
      </Paper>

      {/* API Information */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Order Service API Information
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Base URL:</strong> http://localhost:3002
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>gRPC Client:</strong> Connects to Product Service on localhost:5001
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Available Endpoints:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li><strong>GET /orders</strong> - Retrieve all orders</li>
          <li><strong>POST /orders</strong> - Create a new order</li>
          <li><strong>GET /orders/:id</strong> - Get order by ID</li>
          <li><strong>GET /orders/with-products</strong> - Get orders with product details (gRPC)</li>
          <li><strong>GET /orders/summary</strong> - Get order analytics and summary</li>
          <li><strong>GET /orders/:id/with-product</strong> - Get single order with product details</li>
          <li><strong>PATCH /orders/:id</strong> - Update order details</li>
          <li><strong>DELETE /orders/:id</strong> - Delete an order</li>
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          gRPC Communication Features:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>Real-time product validation during order creation</li>
          <li>Stock quantity verification before order placement</li>
          <li>Product details fetching for order display</li>
          <li>Price calculation based on current product prices</li>
        </Box>
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Link href="/test-microservices/products" passHref>
          <Button variant="outlined">
            Go to Product Management
          </Button>
        </Link>
        <Link href="/test-microservices" passHref>
          <Button variant="contained">
            Back to Dashboard
          </Button>
        </Link>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
