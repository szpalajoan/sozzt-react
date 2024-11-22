import React from 'react';
import { TextField } from '@mui/material';

export const renderTextFields = (fields, data) => {
  if (!Array.isArray(fields)) {
    console.error('fields is not an array:', fields);
    return null;
  }

  return fields.map((field) => (
    <TextField
      key={field.name}
      label={field.label}
      value={data[field.name] || ''}
      fullWidth
      margin="normal"
      InputProps={{
        readOnly: true,
      }}
    />
  ));
};