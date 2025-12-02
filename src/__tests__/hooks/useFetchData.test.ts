import { renderHook, waitFor } from '@testing-library/react';
import type { DashboardFilters } from '../../types';

// Mock the apiService - must be before imports
const mockFetchDashboardData = jest.fn();

jest.mock('../../services/api', () => ({
  apiService: {
    fetchDashboardData: (...args: any[]) => mockFetchDashboardData(...args),
  },
}));

import useFetchData from '../../hooks/useFetchData';

describe('useFetchData Hook', () => {
  const mockFilters: DashboardFilters = {
    dateRange: {
      startDate: null,
      endDate: null,
    },
    cardType: 'all',
    transactionType: 'all',
  };

  const mockData = {
    transactionVolume: [{ date: 'Mon', volume: 1000 }],
    cardTypeDistribution: [{ type: 'Credit', count: 500 }],
    fraudAlerts: [{ date: 'Mon', alerts: 5 }],
    transactionTypes: [{ type: 'Purchase', count: 800 }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('fetches data on mount', async () => {
    mockFetchDashboardData.mockResolvedValue(mockData);

    const { result } = renderHook(() => useFetchData(mockFilters, 0));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch errors', async () => {
    const errorMessage = 'Failed to fetch';
    mockFetchDashboardData.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchData(mockFilters, 0));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toBeNull();
  });

  it('refetches data when refetch is called', async () => {
    mockFetchDashboardData.mockResolvedValue(mockData);

    const { result } = renderHook(() => useFetchData(mockFilters, 0));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchDashboardData).toHaveBeenCalledTimes(1);

    result.current.refetch();

    await waitFor(() => {
      expect(mockFetchDashboardData).toHaveBeenCalledTimes(2);
    });
  });

  it('fetches data with updated filters', async () => {
    mockFetchDashboardData.mockResolvedValue(mockData);

    const { rerender } = renderHook(
      ({ filters }) => useFetchData(filters, 0),
      { initialProps: { filters: mockFilters } }
    );

    await waitFor(() => {
      expect(mockFetchDashboardData).toHaveBeenCalledWith(mockFilters);
    });

    const newFilters: DashboardFilters = {
      ...mockFilters,
      cardType: 'credit',
    };

    rerender({ filters: newFilters });

    await waitFor(() => {
      expect(mockFetchDashboardData).toHaveBeenCalledWith(newFilters);
    });
  });

  it('sets up auto-refresh interval', async () => {
    mockFetchDashboardData.mockResolvedValue(mockData);

    renderHook(() => useFetchData(mockFilters, 1000));

    await waitFor(() => {
      expect(mockFetchDashboardData).toHaveBeenCalledTimes(1);
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockFetchDashboardData).toHaveBeenCalledTimes(2);
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockFetchDashboardData).toHaveBeenCalledTimes(3);
    });
  });

  it('cleans up interval on unmount', async () => {
    mockFetchDashboardData.mockResolvedValue(mockData);

    const { unmount } = renderHook(() => useFetchData(mockFilters, 1000));

    await waitFor(() => {
      expect(mockFetchDashboardData).toHaveBeenCalledTimes(1);
    });

    unmount();

    jest.advanceTimersByTime(1000);

    // Should not call again after unmount
    expect(mockFetchDashboardData).toHaveBeenCalledTimes(1);
  });

  it('does not set interval when autoRefreshInterval is 0', async () => {
    mockFetchDashboardData.mockResolvedValue(mockData);

    renderHook(() => useFetchData(mockFilters, 0));

    await waitFor(() => {
      expect(mockFetchDashboardData).toHaveBeenCalledTimes(1);
    });

    jest.advanceTimersByTime(5000);

    // Should still be 1, no auto-refresh
    expect(mockFetchDashboardData).toHaveBeenCalledTimes(1);
  });
});
