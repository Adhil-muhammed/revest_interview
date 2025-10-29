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
  Switch,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Product, CreateProductDto } from '../types';
import { validateProductData,  } from '../utils/validation';

interface ProductManagerProps {
  onNotification: (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ onNotification }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateProductDto>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        onNotification('Products loaded successfully');
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      onNotification('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data: CreateProductDto) => {
    try {
      // Validate and convert data
      const validation = validateProductData(data);
      
      if (!validation.isValid) {
        onNotification(validation.errors.join(', '), 'error');
        return;
      }

      const response = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation.data),
      });

      if (response.ok) {
        await fetchProducts();
        onNotification('Product created successfully');
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      onNotification(errorMessage, 'error');
    }
  };

  const handleUpdateProduct = async (data: CreateProductDto) => {
    if (!editingProduct) return;

    try {
      // Validate and convert data
      const validation = validateProductData(data);
      
      if (!validation.isValid) {
        onNotification(validation.errors.join(', '), 'error');
        return;
      }

      const response = await fetch(`http://localhost:3001/products/${editingProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation.data),
      });

      if (response.ok) {
        await fetchProducts();
        onNotification('Product updated successfully');
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      onNotification(errorMessage, 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
        onNotification('Product deleted successfully');
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      onNotification('Failed to delete product', 'error');
    }
  };

  const handleOpenDialog = (product?: Product) => {
    setEditingProduct(product || null);
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        description: product.description || '',
        category: product.category || '',
        inStock: product.inStock,
        imageUrl: product.imageUrl || '',
        sku: product.sku || '',
        stockQuantity: product.stockQuantity,
      });
    } else {
      reset({
        name: '',
        price: 0,
        description: '',
        category: '',
        inStock: true,
        imageUrl: '',
        sku: '',
        stockQuantity: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = (data: CreateProductDto) => {
    if (editingProduct) {
      handleUpdateProduct(data);
    } else {
      handleCreateProduct(data);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Product Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchProducts}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {product.name}
                  </Typography>
                  {product.description && (
                    <Typography variant="caption" color="text.secondary">
                      {product.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category || 'N/A'}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>
                  <Chip
                    label={product.inStock ? 'In Stock' : 'Out of Stock'}
                    color={product.inStock ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(product)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteProduct(product._id)}
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
          {editingProduct ? 'Edit Product' : 'Create New Product'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Product name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Name"
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="price"
                  control={control}
                  rules={{ 
                    required: 'Price is required',
                    validate: (value) => {
                      const num = typeof value === 'string' ? parseFloat(value) : value;
                      if (isNaN(num)) return 'Please enter a valid number';
                      if (num < 0) return 'Price must be positive';
                      if (num > 999999) return 'Price is too high';
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Price"
                      type="number"
                      fullWidth
                      required
                      inputProps={{ step: 0.01, min: 0, max: 999999 }}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Category"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="stockQuantity"
                  control={control}
                  rules={{ 
                    validate: (value) => {
                      if (value === undefined || value === null) return true; // Optional field
                      const num = typeof value === 'string' ? parseInt(value) : value;
                      if (isNaN(num)) return 'Please enter a valid number';
                      if (num < 0) return 'Stock quantity must be positive';
                      if (num > 999999) return 'Stock quantity is too high';
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Stock Quantity"
                      type="number"
                      fullWidth
                      inputProps={{ min: 0, max: 999999, step: 1 }}
                      error={!!errors.stockQuantity}
                      helperText={errors.stockQuantity?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Image URL"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="sku"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="SKU"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="inStock"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="In Stock"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProductManager;
