'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';
import { Add, Edit, Delete, Refresh, Visibility } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Order, Product, CreateOrderDto } from '../types';

interface OrderManagerProps {
  onNotification: (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({ onNotification }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewOrdersWithProducts, setViewOrdersWithProducts] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateOrderDto>();

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const endpoint = viewOrdersWithProducts 
        ? 'http://localhost:3002/orders/with-products'
        : 'http://localhost:3002/orders';
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        onNotification('Orders loaded successfully');
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      onNotification('Failed to load orders. Make sure the order service is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      onNotification('Failed to load products for order creation', 'warning');
    }
  };

  const handleCreateOrder = async (data: CreateOrderDto) => {
    try {
      const response = await fetch('http://localhost:3002/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchOrders();
        onNotification('Order created successfully');
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      onNotification(errorMessage, 'error');
    }
  };

  const handleUpdateOrder = async (data: Partial<CreateOrderDto & { status: string }>) => {
    if (!editingOrder) return;

    try {
      const response = await fetch(`http://localhost:3002/orders/${editingOrder._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchOrders();
        onNotification('Order updated successfully');
        handleCloseDialog();
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      onNotification('Failed to update order', 'error');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`http://localhost:3002/orders/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchOrders();
        onNotification('Order deleted successfully');
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      onNotification('Failed to delete order', 'error');
    }
  };

  const handleOpenDialog = (order?: Order) => {
    setEditingOrder(order || null);
    if (order) {
      reset({
        productId: order.productId,
        quantity: order.quantity,
        customerName: order.customerName,
        customerEmail: order.customerEmail || '',
        customerPhone: order.customerPhone || '',
        shippingAddress: order.shippingAddress || '',
        notes: order.notes || '',
      });
    } else {
      reset({
        productId: '',
        quantity: 1,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingOrder(null);
    reset();
  };

  const onSubmit = (data: CreateOrderDto) => {
    if (editingOrder) {
      handleUpdateOrder(data);
    } else {
      handleCreateOrder(data);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const toggleViewMode = () => {
    setViewOrdersWithProducts(!viewOrdersWithProducts);
    // Trigger a refresh when toggling
    setTimeout(fetchOrders, 100);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Order Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={toggleViewMode}
          >
            {viewOrdersWithProducts ? 'Simple View' : 'View with Products'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchOrders}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Create Order
          </Button>
        </Box>
      </Box>

      {viewOrdersWithProducts && (
        <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <CardContent>
            <Typography variant="h6">Orders with Product Details</Typography>
            <Typography variant="body2">
              This view shows orders enriched with product information via microservice communication.
            </Typography>
          </CardContent>
        </Card>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {order._id.slice(-8)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {order.customerName}
                  </Typography>
                  {order.customerEmail && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {order.customerEmail}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {viewOrdersWithProducts && order.product ? (
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {order.product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${order.product.price} • {order.product.category}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" fontFamily="monospace">
                      {order.productId.slice(-8)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status.toUpperCase()}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(order)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteOrder(order._id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingOrder ? 'Edit Order' : 'Create New Order'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              {!editingOrder && (
                <Grid item xs={12}>
                  <Controller
                    name="productId"
                    control={control}
                    rules={{ required: 'Product selection is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.productId}>
                        <InputLabel>Product</InputLabel>
                        <Select {...field} label="Product">
                          {products.map((product) => (
                            <MenuItem key={product._id} value={product._id}>
                              {product.name} - ${product.price} ({product.inStock ? 'In Stock' : 'Out of Stock'})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{ 
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Quantity must be at least 1' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Quantity"
                      type="number"
                      fullWidth
                      required
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="customerName"
                  control={control}
                  rules={{ required: 'Customer name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Customer Name"
                      fullWidth
                      required
                      error={!!errors.customerName}
                      helperText={errors.customerName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="customerEmail"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Customer Email"
                      type="email"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="customerPhone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Customer Phone"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="shippingAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Shipping Address"
                      fullWidth
                      multiline
                      rows={2}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      fullWidth
                      multiline
                      rows={2}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingOrder ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default OrderManager;
