'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Typography,
  Paper,
  Grid,
  FormHelperText,
} from '@mui/material';
import { FormField, DynamicFormData } from '../types';
import formConfigData from '../data/formConfig.json';

interface DynamicFormProps {
  onNotification: (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ onNotification }) => {
  const [formConfig, setFormConfig] = useState<DynamicFormData>(formConfigData as DynamicFormData);
  const [submittedData, setSubmittedData] = useState<any[]>([]);
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: formConfig.data.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, string>),
  });

  useEffect(() => {
    // Load submitted data from localStorage
    const savedData = localStorage.getItem('dynamicFormSubmissions');
    if (savedData) {
      setSubmittedData(JSON.parse(savedData));
    }
  }, []);

  const onSubmit = (data: Record<string, string>) => {
    const submission = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    };

    const newSubmissions = [...submittedData, submission];
    setSubmittedData(newSubmissions);
    
    // Save to localStorage
    localStorage.setItem('dynamicFormSubmissions', JSON.stringify(newSubmissions));
    
    onNotification('Form submitted successfully!', 'success');
    reset();
  };

  const renderField = (field: FormField) => {
    const fieldName = field.name;
    const isRequired = field.required;

    switch (field.fieldType) {
      case 'TEXT':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={{
              required: isRequired ? `${field.name} is required` : false,
              minLength: field.minLength ? {
                value: field.minLength,
                message: `Minimum length is ${field.minLength}`,
              } : undefined,
              maxLength: field.maxLength ? {
                value: field.maxLength,
                message: `Maximum length is ${field.maxLength}`,
              } : undefined,
              pattern: field.name.toLowerCase().includes('email') ? {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              } : undefined,
            }}
            render={({ field: formField }) => (
              <TextField
                {...formField}
                label={field.name}
                fullWidth
                required={isRequired}
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message}
                type={field.name.toLowerCase().includes('email') ? 'email' : 'text'}
              />
            )}
          />
        );

      case 'LIST':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={{
              required: isRequired ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <FormControl fullWidth error={!!errors[fieldName]}>
                <InputLabel>{field.name}</InputLabel>
                <Select
                  {...formField}
                  label={field.name}
                  required={isRequired}
                >
                  {field.listOfValues1?.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors[fieldName] && (
                  <FormHelperText>{errors[fieldName]?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      case 'RADIO':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={{
              required: isRequired ? `${field.name} is required` : false,
            }}
            render={({ field: formField }) => (
              <FormControl component="fieldset" error={!!errors[fieldName]}>
                <Typography variant="body1" component="legend">
                  {field.name} {isRequired && '*'}
                </Typography>
                <RadioGroup {...formField} row>
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
                  <FormHelperText>{errors[fieldName]?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dynamic Form Builder
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This form is dynamically generated based on JSON configuration. You can modify the field types,
        labels, validation rules, and more through the JSON data.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {formConfig.data.map((field) => (
              <Grid item xs={12} md={6} key={field.id}>
                {renderField(field)}
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button type="submit" variant="contained" size="large">
                  Submit Form
                </Button>
                <Button 
                  type="button" 
                  variant="outlined" 
                  size="large" 
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {submittedData.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Submitted Data (Local Storage)
          </Typography>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {submittedData.map((submission, index) => (
              <Paper key={submission.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Submission #{submittedData.length - index}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(submission.timestamp).toLocaleString()}
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(submission).filter(([key]) => 
                    key !== 'id' && key !== 'timestamp'
                  ).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Typography variant="body2">
                        <strong>{key}:</strong> {value as string}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default DynamicForm;
