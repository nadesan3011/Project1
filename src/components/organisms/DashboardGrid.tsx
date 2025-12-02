import React from 'react';
import { Grid, CircularProgress, Box, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { ChartCard } from '../molecules';
import { DashboardData } from '../../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardGridProps {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

/**
 * DashboardGrid component - Organism
 * Single Responsibility: Layout and display all dashboard charts
 * Open/Closed Principle: Can add new charts without modifying existing ones
 */
// eslint-disable-next-line max-lines-per-function
const DashboardGrid: React.FC<DashboardGridProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6">No data available</Typography>
      </Box>
    );
  }

  // Transaction Volume Chart Data
  const transactionVolumeData = {
    labels: data.transactionVolume.map((item) => item.date),
    datasets: [
      {
        label: 'Transaction Volume',
        data: data.transactionVolume.map((item) => item.volume),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Card Type Distribution Chart Data
  const cardTypeData = {
    labels: data.cardTypeDistribution.map((item) => item.type),
    datasets: [
      {
        label: 'Card Type Distribution',
        data: data.cardTypeDistribution.map((item) => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Fraud Alerts Chart Data
  const fraudAlertsData = {
    labels: data.fraudAlerts.map((item) => item.date),
    datasets: [
      {
        label: 'Fraud Alerts',
        data: data.fraudAlerts.map((item) => item.alerts),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Transaction Types Chart Data
  const transactionTypesData = {
    labels: data.transactionTypes.map((item) => item.type),
    datasets: [
      {
        label: 'Transaction Types',
        data: data.transactionTypes.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="Transaction Volume">
          <div style={{ height: '300px' }}>
            <Bar data={transactionVolumeData} options={chartOptions} />
          </div>
        </ChartCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="Card Type Distribution">
          <div style={{ height: '300px' }}>
            <Pie data={cardTypeData} options={chartOptions} />
          </div>
        </ChartCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="Fraud Alerts">
          <div style={{ height: '300px' }}>
            <Line data={fraudAlertsData} options={chartOptions} />
          </div>
        </ChartCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="Transaction Types">
          <div style={{ height: '300px' }}>
            <Bar data={transactionTypesData} options={chartOptions} />
          </div>
        </ChartCard>
      </Grid>
    </Grid>
  );
};

export default DashboardGrid;
