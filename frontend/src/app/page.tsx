'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Grid,
  Divider,
} from '@mui/material';
import { Settings, Dashboard } from '@mui/icons-material';
import SignupForm from '../components/SignupForm';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Revest Solutions
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Dynamic Component Builder Application
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
          Create a responsive application using Next.js and TypeScript that allows users to create and add their custom
          components with dynamic form fields based on JSON configuration.
        </Typography>
      </Box>

      {/* Quick Access to Microservices */}
      <Paper sx={{ p: 3, mb: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Microservices Demo Application
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Access the complete microservices architecture with Product & Order management
        </Typography>
        <Link href="/test-microservices" passHref>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<Dashboard />}
            sx={{ mr: 2 }}
          >
            Test Microservices Dashboard
          </Button>
        </Link>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Main Application - Dynamic Signup Form */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Dynamic Signup Form Builder
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Form fields are dynamically rendered based on JSON configuration with proper validation using React Hook Forms
        </Typography>
      </Box>

      {/* Signup Form */}
      <SignupForm />


      {/* Navigation Footer */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Built with Next.js, TypeScript, Material-UI, and React Hook Form
        </Typography>
      </Box>
    </Container>
  );
}
