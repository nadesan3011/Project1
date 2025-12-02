import axios, { AxiosInstance } from 'axios';
import { DashboardData, DashboardFilters } from '../types';

/**
 * API Service - Single Responsibility Principle
 * Handles all API communications
 */
class ApiService {
  private client: AxiosInstance;
  private mockDataEnabled: boolean;

  constructor(baseURL: string = 'https://api.example.com', useMock: boolean = true) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.mockDataEnabled = useMock;
  }

  /**
   * Generate mock data for demonstration
   */
  private generateMockData(filters: DashboardFilters): DashboardData {
    const today = new Date();
    const daysToShow = 7;

    // Generate transaction volume data
    const transactionVolume = Array.from({ length: daysToShow }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (daysToShow - 1 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: Math.floor(Math.random() * 5000) + 1000,
      };
    });

    // Generate card type distribution
    const cardTypeDistribution = [
      { type: 'Credit Card', count: Math.floor(Math.random() * 1000) + 500 },
      { type: 'Debit Card', count: Math.floor(Math.random() * 1000) + 500 },
      { type: 'Prepaid Card', count: Math.floor(Math.random() * 500) + 200 },
    ];

    // Apply filters
    if (filters.cardType !== 'all') {
      const filterMap: { [key: string]: string } = {
        credit: 'Credit Card',
        debit: 'Debit Card',
        prepaid: 'Prepaid Card',
      };
      const filtered = cardTypeDistribution.filter(
        (item) => item.type === filterMap[filters.cardType]
      );
      if (filtered.length > 0) {
        cardTypeDistribution.length = 0;
        cardTypeDistribution.push(...filtered);
      }
    }

    // Generate fraud alerts
    const fraudAlerts = Array.from({ length: daysToShow }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (daysToShow - 1 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        alerts: Math.floor(Math.random() * 20) + 1,
      };
    });

    // Generate transaction types
    const transactionTypes = [
      { type: 'Purchase', count: Math.floor(Math.random() * 2000) + 1000 },
      { type: 'Withdrawal', count: Math.floor(Math.random() * 1500) + 500 },
      { type: 'Refund', count: Math.floor(Math.random() * 500) + 100 },
      { type: 'Transfer', count: Math.floor(Math.random() * 1000) + 300 },
    ];

    // Apply transaction type filter
    if (filters.transactionType !== 'all') {
      const filterMap: { [key: string]: string } = {
        purchase: 'Purchase',
        withdrawal: 'Withdrawal',
        refund: 'Refund',
        transfer: 'Transfer',
      };
      const filtered = transactionTypes.filter(
        (item) => item.type === filterMap[filters.transactionType]
      );
      if (filtered.length > 0) {
        transactionTypes.length = 0;
        transactionTypes.push(...filtered);
      }
    }

    return {
      transactionVolume,
      cardTypeDistribution,
      fraudAlerts,
      transactionTypes,
    };
  }

  /**
   * Fetch dashboard data with filters
   */
  async fetchDashboardData(filters: DashboardFilters): Promise<DashboardData> {
    if (this.mockDataEnabled) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return this.generateMockData(filters);
    }

    try {
      const response = await this.client.post<DashboardData>('/dashboard/data', {
        filters,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  /**
   * Enable or disable mock data
   */
  setMockDataEnabled(enabled: boolean): void {
    this.mockDataEnabled = enabled;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default ApiService;
