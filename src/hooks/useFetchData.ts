import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardData, DashboardFilters } from '../types';
import { apiService } from '../services';

interface UseFetchDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching dashboard data with auto-refresh
 * Single Responsibility: Manage data fetching state and auto-refresh logic
 * 
 * @param filters - Current dashboard filters
 * @param autoRefreshInterval - Auto-refresh interval in milliseconds (default: 5 minutes)
 */
const useFetchData = (
  filters: DashboardFilters,
  autoRefreshInterval: number = 300000 // 5 minutes
): UseFetchDataReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch data from API
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.fetchDashboardData(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Setup auto-refresh and initial fetch
   */
  useEffect(() => {
    // Initial fetch
    fetchData();

    // Setup auto-refresh interval
    if (autoRefreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, autoRefreshInterval);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchData, autoRefreshInterval]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useFetchData;
