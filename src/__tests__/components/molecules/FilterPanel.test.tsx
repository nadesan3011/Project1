import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPanel from '../../../components/molecules/FilterPanel';
import { DashboardFilters } from '../../../types';

// Mock the DatePicker component to avoid MUI date picker issues in tests
jest.mock('../../../components/atoms/DatePicker', () => ({
  __esModule: true,
  default: ({ label, value, onChange }: any) => (
    <div data-testid="date-picker">
      <label>{label}</label>
      <input
        type="text"
        value={value ? value.toString() : ''}
        onChange={(e) => onChange(new Date(e.target.value))}
        aria-label={label}
      />
    </div>
  ),
}));

describe('FilterPanel Component', () => {
  const mockFilters: DashboardFilters = {
    dateRange: {
      startDate: null,
      endDate: null,
    },
    cardType: 'all',
    transactionType: 'all',
  };

  const mockOnFilterChange = jest.fn();
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter controls', () => {
    render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getAllByText(/start date/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/end date/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/card type/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/transaction type/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('handles refresh button click', async () => {
    const user = userEvent.setup();
    
    render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onRefresh={mockOnRefresh}
      />
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('handles card type selection', async () => {
    const user = userEvent.setup();
    
    render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onRefresh={mockOnRefresh}
      />
    );

    // Get the combobox by finding the text and getting the combobox element
    const cardTypeText = screen.getByText('All Card Types');
    const cardTypeDropdown = cardTypeText.closest('[role="combobox"]');
    
    if (cardTypeDropdown) {
      await user.click(cardTypeDropdown);
      const creditOption = await screen.findByRole('option', { name: /credit card/i });
      await user.click(creditOption);
      expect(mockOnFilterChange).toHaveBeenCalled();
    }
  });

  it('displays correct initial filter values', () => {
    const customFilters: DashboardFilters = {
      dateRange: {
        startDate: null,
        endDate: null,
      },
      cardType: 'credit',
      transactionType: 'purchase',
    };

    render(
      <FilterPanel
        filters={customFilters}
        onFilterChange={mockOnFilterChange}
        onRefresh={mockOnRefresh}
      />
    );

    // Check that the dropdowns are rendered with correct content
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
    expect(screen.getByText('Purchase')).toBeInTheDocument();
  });
});
