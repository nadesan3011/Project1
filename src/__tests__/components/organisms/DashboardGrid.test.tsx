import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardGrid from '../../../components/organisms/DashboardGrid';
import { DashboardData } from '../../../types';

// Mock Chart.js components
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>,
  Line: () => <div data-testid="line-chart">Line Chart</div>,
}));

describe('DashboardGrid Component', () => {
  const mockData: DashboardData = {
    transactionVolume: [
      { date: 'Jan 1', volume: 1000 },
      { date: 'Jan 2', volume: 1500 },
    ],
    cardTypeDistribution: [
      { type: 'Credit', count: 500 },
      { type: 'Debit', count: 300 },
    ],
    fraudAlerts: [
      { date: 'Jan 1', alerts: 5 },
      { date: 'Jan 2', alerts: 3 },
    ],
    transactionTypes: [
      { type: 'Purchase', count: 1200 },
      { type: 'Withdrawal', count: 300 },
    ],
  };

  it('displays loading state', () => {
    render(<DashboardGrid data={null} loading={true} error={null} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<DashboardGrid data={null} loading={false} error="Failed to load data" />);
    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
  });

  it('displays no data message', () => {
    render(<DashboardGrid data={null} loading={false} error={null} />);
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('renders all chart cards with data', () => {
    render(<DashboardGrid data={mockData} loading={false} error={null} />);

    expect(screen.getByText('Transaction Volume')).toBeInTheDocument();
    expect(screen.getByText('Card Type Distribution')).toBeInTheDocument();
    expect(screen.getByText('Fraud Alerts')).toBeInTheDocument();
    expect(screen.getByText('Transaction Types')).toBeInTheDocument();
  });

  it('renders correct chart types', () => {
    render(<DashboardGrid data={mockData} loading={false} error={null} />);

    expect(screen.getAllByTestId('bar-chart')).toHaveLength(2); // Transaction Volume & Types
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('applies responsive grid layout', () => {
    const { container } = render(<DashboardGrid data={mockData} loading={false} error={null} />);
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
  });
});
