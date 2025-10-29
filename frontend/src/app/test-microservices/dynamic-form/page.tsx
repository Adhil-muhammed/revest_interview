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
import DynamicForm from '../../../components/DynamicForm';

export default function DynamicFormPage() {
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
        <Typography color="text.primary">Dynamic Forms</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dynamic Form Builder
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          JSON-driven form generation with dynamic field types and validation
        </Typography>
      </Box>

      {/* Dynamic Form Component */}
      <Paper sx={{ p: 3 }}>
        <DynamicForm onNotification={showNotification} />
      </Paper>

      {/* Feature Information */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Dynamic Form Features
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Supported Field Types:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li><strong>Text Fields</strong> - Single line text input with validation</li>
          <li><strong>Email Fields</strong> - Email input with email validation</li>
          <li><strong>Number Fields</strong> - Numeric input with min/max constraints</li>
          <li><strong>Radio Buttons</strong> - Single selection from predefined options</li>
          <li><strong>Select Lists</strong> - Dropdown selection with multiple options</li>
          <li><strong>Checkboxes</strong> - Boolean input fields</li>
          <li><strong>Text Areas</strong> - Multi-line text input</li>
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Validation Features:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>Required field validation</li>
          <li>Minimum and maximum length constraints</li>
          <li>Email format validation</li>
          <li>Numeric range validation</li>
          <li>Custom error messages</li>
          <li>Real-time validation feedback</li>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Dynamic Configuration:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>JSON-driven field configuration</li>
          <li>Runtime field type changes</li>
          <li>Dynamic label and placeholder updates</li>
          <li>Conditional field visibility</li>
          <li>Default value management</li>
        </Box>
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Link href="/test-microservices" passHref>
          <Button variant="outlined">
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/test-microservices/signup" passHref>
          <Button variant="contained">
            Go to User Signup
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
