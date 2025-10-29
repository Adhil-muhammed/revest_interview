'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Breadcrumbs,
} from '@mui/material';
import Link from 'next/link';
import { Home, Dashboard } from '@mui/icons-material';
import SignupForm from '../../../components/SignupForm';

export default function SignupPage() {
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
        <Typography color="text.primary">User Registration</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          User Registration System
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Dynamic signup form with JSON configuration and React Hook Form validation
        </Typography>
      </Box>

      {/* Signup Form Component */}
      <SignupForm />

      {/* Feature Information */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Registration Form Features
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Form Configuration:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li><strong>JSON-Driven</strong> - Form structure defined in JSON configuration</li>
          <li><strong>Dynamic Fields</strong> - Field types can be changed without code modification</li>
          <li><strong>Validation Rules</strong> - Comprehensive validation with custom messages</li>
          <li><strong>Required Fields</strong> - Configurable required/optional fields</li>
          <li><strong>Default Values</strong> - Pre-populated form values from configuration</li>
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Technical Implementation:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li><strong>React Hook Form</strong> - Form state management and validation</li>
          <li><strong>Yup Schema</strong> - Dynamic validation schema generation</li>
          <li><strong>Material-UI</strong> - Responsive and accessible UI components</li>
          <li><strong>TypeScript</strong> - Type-safe form handling</li>
          <li><strong>Local Storage</strong> - Data persistence for submitted forms</li>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Field Types Supported:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li><strong>TEXT</strong> - Standard text input fields</li>
          <li><strong>EMAIL</strong> - Email input with validation</li>
          <li><strong>RADIO</strong> - Radio button groups</li>
          <li><strong>LIST</strong> - Dropdown select lists</li>
          <li><strong>CHECKBOX</strong> - Boolean checkbox inputs</li>
          <li><strong>TEXTAREA</strong> - Multi-line text areas</li>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Data Management:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>Form submissions saved to localStorage</li>
          <li>View all previous registrations</li>
          <li>Timestamp tracking for submissions</li>
          <li>Form reset after successful submission</li>
        </Box>
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Link href="/test-microservices/dynamic-form" passHref>
          <Button variant="outlined">
            Go to Dynamic Forms
          </Button>
        </Link>
        <Link href="/test-microservices" passHref>
          <Button variant="contained">
            Back to Dashboard
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
