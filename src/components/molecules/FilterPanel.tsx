import React from 'react';
import { Box, Grid, SelectChangeEvent } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, Dropdown, DatePicker } from '../atoms';
import { FilterPanelProps } from '../../types';

/**
 * FilterPanel component - Molecule
 * Single Responsibility: Manage all filter controls
 * Dependency Inversion: Depends on abstractions (props) not concrete implementations
 */
const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onRefresh,
}) => {
  const cardTypeOptions = [
    { value: 'all', label: 'All Card Types' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'debit', label: 'Debit Card' },
    { value: 'prepaid', label: 'Prepaid Card' },
  ];

  const transactionTypeOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'refund', label: 'Refund' },
    { value: 'transfer', label: 'Transfer' },
  ];

  const handleStartDateChange = (date: Date | null) => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, startDate: date },
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, endDate: date },
    });
  };

  const handleCardTypeChange = (event: SelectChangeEvent<string>) => {
    onFilterChange({ ...filters, cardType: event.target.value });
  };

  const handleTransactionTypeChange = (event: SelectChangeEvent<string>) => {
    onFilterChange({ ...filters, transactionType: event.target.value });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <DatePicker
            label="Start Date"
            value={filters.dateRange.startDate}
            onChange={handleStartDateChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <DatePicker
            label="End Date"
            value={filters.dateRange.endDate}
            onChange={handleEndDateChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <Dropdown
            label="Card Type"
            value={filters.cardType}
            options={cardTypeOptions}
            onChange={handleCardTypeChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <Dropdown
            label="Transaction Type"
            value={filters.transactionType}
            options={transactionTypeOptions}
            onChange={handleTransactionTypeChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 2 }}>
          <Button
            label="Refresh"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterPanel;
