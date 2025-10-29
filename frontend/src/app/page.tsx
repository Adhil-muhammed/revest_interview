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
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Signup form with 3 Fields: Full Name, Email, Gender + Additional Dynamic Fields
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Form fields are dynamically rendered based on JSON configuration with proper validation using React Hook Forms
        </Typography>
      </Box>

      {/* Signup Form */}
      <SignupForm />

      {/* Feature Highlights */}
      <Paper sx={{ mt: 6, p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Application Requirements & Features
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              1️⃣ Creating Components - Signup Form
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li><strong>Full Name</strong> - Text field with validation</li>
              <li><strong>Email</strong> - Email field with format validation</li>
              <li><strong>Gender</strong> - Dynamic LIST/RADIO selection</li>
              <li><strong>Love React?</strong> - Radio button field</li>
              <li>All fields rendered from JSON configuration</li>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="success.main">
              2️⃣ Form Validation (React Hook Forms)
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Required field validation</li>
              <li>Min/Max length constraints</li>
              <li>Email format validation</li>
              <li>Real-time error feedback</li>
              <li>Custom error messages per field</li>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="info.main">
              3️⃣ Dynamic JSON-Based Fields
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Fields generated from JSON data</li>
              <li>Dynamic field type switching (TEXT ↔ LIST ↔ RADIO)</li>
              <li>Label changes reflect instantly</li>
              <li>Required/optional field toggling</li>
              <li>Default values from JSON configuration</li>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="warning.main">
              4️⃣ Responsive Design & Data Persistence
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Material-UI responsive components</li>
              <li>Mobile-friendly interface</li>
              <li>Local storage data persistence</li>
              <li>Form submission history</li>
              <li>Visually appealing user interface</li>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* JSON Configuration Example */}
      <Paper sx={{ mt: 4, p: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          JSON Configuration - Dynamic Field Examples
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          The form fields are dynamically generated based on this JSON configuration. 
          Change "fieldType" from "TEXT" to "LIST" or "RADIO" to see instant updates:
        </Typography>
        <Box 
          component="pre" 
          sx={{ 
            bgcolor: 'grey.900', 
            color: 'white', 
            p: 2, 
            borderRadius: 1, 
            overflow: 'auto',
            fontSize: '0.875rem'
          }}
        >
{`{
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
      "fieldType": "LIST", // Change to "RADIO" for radio buttons
      "defaultValue": "1",
      "required": true,
      "listOfValues1": ["Male", "Female", "Others"]
    },
    {
      "id": 7,
      "name": "Love React?",
      "fieldType": "RADIO", // Change to "LIST" for dropdown
      "defaultValue": "1",
      "required": true,
      "listOfValues1": ["Yes", "No"]
    }
  ]
}`}
        </Box>
        <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
          ✨ <strong>Try changing:</strong> fieldType "LIST" ↔ "RADIO", field names, or required values to see real-time updates!
        </Typography>
      </Paper>

      {/* Navigation Footer */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Built with Next.js, TypeScript, Material-UI, and React Hook Form
        </Typography>
      </Box>
    </Container>
  );
}
