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
import ProductManager from '../../../components/ProductManager';

export default function ProductsPage() {
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
        <Typography color="text.primary">Product Management</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Product Management System
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Manage your product catalog with full CRUD operations
        </Typography>
      </Box>

      {/* Product Manager Component */}
      <Paper sx={{ p: 3 }}>
        <ProductManager onNotification={showNotification} />
      </Paper>

      {/* API Information */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Product Service API Information
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Base URL:</strong> http://localhost:3001
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>gRPC Port:</strong> localhost:5001
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Available Endpoints:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li><strong>GET /products</strong> - Retrieve all products</li>
          <li><strong>POST /products</strong> - Create a new product</li>
          <li><strong>GET /products/:id</strong> - Get product by ID</li>
          <li><strong>PATCH /products/:id</strong> - Update product details</li>
          <li><strong>DELETE /products/:id</strong> - Delete a product</li>
          <li><strong>PATCH /products/:id/stock</strong> - Update product stock quantity</li>
        </Box>
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Link href="/test-microservices" passHref>
          <Button variant="outlined">
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/test-microservices/orders" passHref>
          <Button variant="contained">
            Go to Order Management
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
