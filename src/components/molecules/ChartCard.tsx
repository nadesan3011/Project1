import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ChartCardProps } from '../../types';

/**
 * ChartCard component - Molecule
 * Single Responsibility: Wrapper for chart components with consistent styling
 * Open/Closed Principle: Can be extended with new chart types without modification
 */
const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
