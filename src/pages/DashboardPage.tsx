import React, { useState } from 'react';
import { DashboardLayout } from '../templates';
import { FilterPanel } from '../components/molecules';
import { DashboardGrid } from '../components/organisms';
import { useFetchData } from '../hooks';
import { DashboardFilters } from '../types';

/**
 * DashboardPage component - Page
 * Single Responsibility: Orchestrate dashboard features and state
 * Dependency Inversion: Depends on abstractions (hooks, components) not implementations
 */
const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      startDate: null,
      endDate: null,
    },
    cardType: 'all',
    transactionType: 'all',
  });

  // Use custom hook for data fetching with 5-minute auto-refresh
  const { data, loading, error, refetch } = useFetchData(filters, 300000);

  const handleFilterChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <DashboardLayout>
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
      />
      <DashboardGrid data={data} loading={loading} error={error} />
    </DashboardLayout>
  );
};

export default DashboardPage;
