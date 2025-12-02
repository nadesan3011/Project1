import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the hooks - must be hoisted before imports
jest.mock('../../hooks/useFetchData', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: {
      transactionVolume: [{ date: 'Mon', volume: 1000 }],
      cardTypeDistribution: [{ type: 'Credit', count: 500 }],
      fraudAlerts: [{ date: 'Mon', alerts: 5 }],
      transactionTypes: [{ type: 'Purchase', count: 800 }],
    },
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

import DashboardPage from '../../pages/DashboardPage';

// Mock the organisms
jest.mock('../../components/organisms/DashboardGrid', () => ({
  __esModule: true,
  default: ({ data, loading, error }: any) => (
    <div data-testid="dashboard-grid">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>Charts Rendered</div>}
    </div>
  ),
}));

// Mock the molecules
jest.mock('../../components/molecules/FilterPanel', () => ({
  __esModule: true,
  default: ({ filters, onFilterChange, onRefresh }: any) => (
    <div data-testid="filter-panel">
      <button onClick={onRefresh}>Refresh</button>
      <div>Filters Active</div>
    </div>
  ),
}));

// Mock the templates
jest.mock('../../templates/DashboardLayout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="dashboard-layout">{children}</div>,
}));

describe('DashboardPage Component', () => {
  it('renders the dashboard layout', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders the filter panel', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
  });

  it('renders the dashboard grid', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-grid')).toBeInTheDocument();
  });

  it('shows charts when data is loaded', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Charts Rendered')).toBeInTheDocument();
  });

  it('passes correct props to components', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Filters Active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });
});
