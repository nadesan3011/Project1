import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
}

/**
 * Reusable Input component following Atomic Design
 * Single Responsibility: Render a styled input field with Material UI
 */
const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      {...props}
    />
  );
};

export default Input;
