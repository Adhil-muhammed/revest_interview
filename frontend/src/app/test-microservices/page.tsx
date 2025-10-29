'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import Link from 'next/link';
import { ShoppingCart, Inventory, DynamicForm, Person } from '@mui/icons-material';

export default function TestMicroservicesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Microservices Testing Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Test individual microservices and their functionalities
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Product Management Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Inventory sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Product Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage products, inventory, and product catalog. CRUD operations with gRPC communication.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Link href="/test-microservices/products" passHref>
                <Button variant="contained" size="large">
                  Manage Products
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>

        {/* Order Management Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <ShoppingCart sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Order Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create and manage orders, view order history with product details via gRPC.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Link href="/test-microservices/orders" passHref>
                <Button variant="contained" size="large" color="success">
                  Manage Orders
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* API Endpoints Documentation */}
      <Paper sx={{ mt: 6, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          API Endpoints
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Product Service (Port 3001)
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>GET /products - List all products</li>
              <li>POST /products - Create new product</li>
              <li>GET /products/:id - Get product by ID</li>
              <li>PATCH /products/:id - Update product</li>
              <li>DELETE /products/:id - Delete product</li>
              <li>PATCH /products/:id/stock - Update stock</li>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="success.main">
              Order Service (Port 3002)
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>GET /orders - List all orders</li>
              <li>POST /orders - Create new order</li>
              <li>GET /orders/:id - Get order by ID</li>
              <li>GET /orders/with-products - Orders with product details</li>
              <li>GET /orders/summary - Order analytics</li>
              <li>PATCH /orders/:id - Update order</li>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Back to Home */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Link href="/" passHref>
          <Button variant="outlined" size="large">
            Back to Home
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
