import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  TextareaAutosize,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import formConfig from '../data/formConfig.json';

interface FormField {
  id: number;
  name: string;
  fieldType: string;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  required: boolean;
  listOfValues1?: string[];
}

interface FormData {
  [key: string]: any;
}

const SignupForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [savedData, setSavedData] = useState<FormData[]>([]);

  // Build dynamic validation schema
  const buildValidationSchema = () => {
    const schemaFields: any = {};
    
    (formConfig.data as FormField[]).forEach((field: FormField) => {
      let validator: any = yup.string();
      
      if (field.fieldType === 'EMAIL' || (field.fieldType === 'TEXT' && field.name.toLowerCase().includes('email'))) {
        validator = validator.email('Please enter a valid email address');
      }
      
      if (field.fieldType === 'NUMBER') {
        validator = yup.number().typeError('Must be a number');
      }
      
      if (field.required) {
        validator = validator.required(`${field.name} is required`);
      }
      
      if (field.minLength) {
        validator = validator.min(field.minLength, `${field.name} must be at least ${field.minLength} characters`);
      }
      
      if (field.maxLength) {
        validator = validator.max(field.maxLength, `${field.name} must be no more than ${field.maxLength} characters`);
      }
      
      schemaFields[field.id] = validator;
    });
    
    return yup.object().shape(schemaFields);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(buildValidationSchema()),
    defaultValues: (formConfig.data as FormField[]).reduce((acc, field) => {
      acc[field.id] = field.defaultValue || '';
      return acc;
    }, {} as any),
  });

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('signupFormData');
    if (saved) {
      setSavedData(JSON.parse(saved));
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Transform data with field names
      const transformedData = (formConfig.data as FormField[]).reduce((acc, field) => {
        acc[field.name] = data[field.id];
        return acc;
      }, {} as any);
      
      // Add timestamp
      transformedData.submittedAt = new Date().toISOString();
      
      // Save to localStorage
      const updatedSavedData = [...savedData, transformedData];
      setSavedData(updatedSavedData);
      localStorage.setItem('signupFormData', JSON.stringify(updatedSavedData));
      
      setSubmitSuccess(true);
      reset();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldName = field.id.toString();
    
    switch (field.fieldType) {
      case 'TEXT':
      case 'EMAIL':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                fullWidth
                label={field.name}
                type={field.fieldType === 'EMAIL' || field.name.toLowerCase().includes('email') ? 'email' : 'text'}
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message as string}
                required={field.required}
                variant="outlined"
                margin="normal"
              />
            )}
          />
        );
        
      case 'NUMBER':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                fullWidth
                label={field.name}
                type="number"
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message as string}
                required={field.required}
                variant="outlined"
                margin="normal"
              />
            )}
          />
        );
        
      case 'RADIO':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <FormControl 
                component="fieldset" 
                margin="normal" 
                error={!!errors[fieldName]}
                fullWidth
              >
                <FormLabel component="legend" required={field.required}>
                  {field.name}
                </FormLabel>
                <RadioGroup {...controllerField} row>
                  {field.listOfValues1?.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
                {errors[fieldName] && (
                  <Typography variant="caption" color="error">
                    {errors[fieldName]?.message as string}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );
        
      case 'LIST':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <FormControl 
                fullWidth 
                margin="normal" 
                error={!!errors[fieldName]}
              >
                <FormLabel required={field.required}>{field.name}</FormLabel>
                <Select {...controllerField} displayEmpty>
                  <MenuItem value="">
                    <em>Select {field.name}</em>
                  </MenuItem>
                  {field.listOfValues1?.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors[fieldName] && (
                  <Typography variant="caption" color="error">
                    {errors[fieldName]?.message as string}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );
        
      case 'CHECKBOX':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...controllerField}
                    checked={controllerField.value}
                  />
                }
                label={field.name}
              />
            )}
          />
        );
        
      case 'TEXTAREA':
        return (
          <Controller
            key={field.id}
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                fullWidth
                label={field.name}
                multiline
                rows={4}
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message as string}
                required={field.required}
                variant="outlined"
                margin="normal"
              />
            )}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Dynamic Signup Form
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
          Form with 3 main fields: Full Name, Email, Gender + Additional Dynamic Fields
        </Typography>
        
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Your data has been saved.
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {(formConfig.data as FormField[]).map(renderField)}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ minWidth: 150 }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {savedData.length > 0 && (
        <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Saved Registrations ({savedData.length})
          </Typography>
          {savedData.map((data, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">
                Registration #{index + 1} - {new Date(data.submittedAt).toLocaleString()}
              </Typography>
              {Object.entries(data).map(([key, value]) => {
                if (key === 'submittedAt') return null;
                return (
                  <Typography key={key} variant="body2">
                    <strong>{key}:</strong> {value}
                  </Typography>
                );
              })}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default SignupForm;
