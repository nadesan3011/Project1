export interface DashboardFilters {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  cardType: string;
  transactionType: string;
}

export interface TransactionData {
  date: string;
  volume: number;
}

export interface CardTypeData {
  type: string;
  count: number;
}

export interface FraudAlertData {
  date: string;
  alerts: number;
}

export interface TransactionTypeData {
  type: string;
  count: number;
}

export interface DashboardData {
  transactionVolume: TransactionData[];
  cardTypeDistribution: CardTypeData[];
  fraudAlerts: FraudAlertData[];
  transactionTypes: TransactionTypeData[];
}

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export interface FilterPanelProps {
  filters: DashboardFilters;
  onFilterChange: (filters: DashboardFilters) => void;
  onRefresh: () => void;
}
