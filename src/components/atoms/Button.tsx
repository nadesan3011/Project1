import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface CustomButtonProps extends MuiButtonProps {
  label: string;
}

/**
 * Reusable Button component following Atomic Design
 * Single Responsibility: Render a styled button with Material UI
 */
const Button: React.FC<CustomButtonProps> = ({ label, ...props }) => {
  return (
    <MuiButton
      variant="contained"
      color="primary"
      {...props}
    >
      {label}
    </MuiButton>
  );
};

export default Button;
