import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout component - Template
 * Single Responsibility: Provide consistent layout structure
 * Dependency Inversion: Accepts children through props abstraction
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Banking Cards Report Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default DashboardLayout;
