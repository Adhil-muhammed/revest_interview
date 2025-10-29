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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
} from '@mui/material';
import { ExpandMore, Edit, Refresh } from '@mui/icons-material';
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
  const [currentConfig, setCurrentConfig] = useState(formConfig);
  const [jsonEditorValue, setJsonEditorValue] = useState(JSON.stringify(formConfig, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  // Build dynamic validation schema
  const buildValidationSchema = () => {
    const schemaFields: any = {};
    
    (currentConfig.data as FormField[]).forEach((field: FormField) => {
      let validator: any = yup.string();
      
      if (field.fieldType === 'EMAIL' || 
          (field.fieldType === 'TEXT' && field.name.toLowerCase().includes('email'))) {
        validator = validator.email('Please enter a valid email address');
      }
      
      if (field.fieldType === 'NUMBER') {
        validator = yup.number().typeError('Must be a number');
      }
      
      if (field.fieldType === 'CHECKBOX') {
        validator = yup.boolean();
      }
      
      if (field.required) {
        if (field.fieldType === 'CHECKBOX') {
          validator = validator.oneOf([true], `${field.name} must be checked`);
        } else {
          validator = validator.required(`${field.name} is required`);
        }
      }
      
      if (field.minLength && field.fieldType !== 'NUMBER' && field.fieldType !== 'CHECKBOX') {
        validator = validator.min(field.minLength, `${field.name} must be at least ${field.minLength} characters`);
      }
      
      if (field.maxLength && field.fieldType !== 'NUMBER' && field.fieldType !== 'CHECKBOX') {
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
    defaultValues: (currentConfig.data as FormField[]).reduce((acc, field) => {
      if (field.fieldType === 'CHECKBOX') {
        acc[field.id] = field.defaultValue === 'true' || field.defaultValue === '1' || false;
      } else {
        acc[field.id] = field.defaultValue || '';
      }
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

  // Update form when config changes
  useEffect(() => {
    reset((currentConfig.data as FormField[]).reduce((acc, field) => {
      if (field.fieldType === 'CHECKBOX') {
        acc[field.id] = field.defaultValue === 'true' || field.defaultValue === '1' || false;
      } else {
        acc[field.id] = field.defaultValue || '';
      }
      return acc;
    }, {} as any));
  }, [currentConfig, reset]);

  const handleJsonUpdate = () => {
    try {
      const newConfig = JSON.parse(jsonEditorValue);
      
      // Validate the structure
      if (!newConfig.data || !Array.isArray(newConfig.data)) {
        throw new Error('Invalid JSON structure. Expected { "data": [...] }');
      }
      
      // Validate each field
      newConfig.data.forEach((field: any, index: number) => {
        if (!field.id || !field.name || !field.fieldType) {
          throw new Error(`Field ${index + 1} is missing required properties (id, name, fieldType)`);
        }
      });
      
      setCurrentConfig(newConfig);
      setJsonError(null);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  };

  const resetToDefault = () => {
    setCurrentConfig(formConfig);
    setJsonEditorValue(JSON.stringify(formConfig, null, 2));
    setJsonError(null);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Transform data with field names
      const transformedData = (currentConfig.data as FormField[]).reduce((acc, field) => {
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
                type={field.fieldType === 'EMAIL' || 
                     field.name.toLowerCase().includes('email') ? 'email' : 'text'}
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
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...controllerField}
                      checked={!!controllerField.value}
                      onChange={(e) => controllerField.onChange(e.target.checked)}
                    />
                  }
                  label={field.name}
                />
                {errors[fieldName] && (
                  <Typography variant="caption" color="error" display="block">
                    {errors[fieldName]?.message as string}
                  </Typography>
                )}
              </Box>
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* JSON Configuration Editor */}
      <Paper elevation={2} sx={{ mb: 4, p: 3 }}>
        <Accordion expanded={showJsonEditor} onChange={() => setShowJsonEditor(!showJsonEditor)}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Edit color="primary" />
              <Typography variant="h6">
                Dynamic JSON Configuration Editor
              </Typography>
              <Chip 
                label="Live Editing" 
                color="success" 
                size="small" 
                variant="outlined" 
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Edit JSON Configuration:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={15}
                  value={jsonEditorValue}
                  onChange={(e) => setJsonEditorValue(e.target.value)}
                  error={!!jsonError}
                  helperText={jsonError}
                  variant="outlined"
                  sx={{ 
                    fontFamily: 'monospace',
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }
                  }}
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    onClick={handleJsonUpdate}
                    disabled={!!jsonError}
                  >
                    Apply Changes
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={resetToDefault}
                    startIcon={<Refresh />}
                  >
                    Reset to Default
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Current Form Fields:
                </Typography>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, maxHeight: 400, overflow: 'auto' }}>
                  {(currentConfig.data as FormField[]).map((field, index) => (
                    <Box key={field.id} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                      <Typography variant="subtitle2" color="primary">
                        Field #{field.id}: {field.name}
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Chip label={`Type: ${field.fieldType}`} size="small" color="primary" variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                          <Chip 
                            label={field.required ? 'Required' : 'Optional'} 
                            size="small" 
                            color={field.required ? 'error' : 'default'} 
                            variant="outlined" 
                          />
                        </Grid>
                        {field.defaultValue && (
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">
                              Default: {field.defaultValue}
                            </Typography>
                          </Grid>
                        )}
                        {field.listOfValues1 && (
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">
                              Options: {field.listOfValues1.join(', ')}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  ))}
                </Box>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Try changing:</strong>
                    <br />• fieldType: "TEXT" ↔ "LIST" ↔ "RADIO" ↔ "CHECKBOX"
                    <br />• required: true ↔ false
                    <br />• field names and default values
                    <br />• listOfValues1 for LIST/RADIO fields
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Dynamic Form */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Dynamic Signup Form
        </Typography>
        <Typography variant="body2" align="center" color="primary" gutterBottom>
          ✨ Form fields update automatically based on JSON configuration above
        </Typography>
        
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Your data has been saved.
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {(currentConfig.data as FormField[]).map(renderField)}
          
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
