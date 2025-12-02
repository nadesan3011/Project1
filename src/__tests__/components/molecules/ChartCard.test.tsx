import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartCard from '../../../components/molecules/ChartCard';

describe('ChartCard Component', () => {
  it('renders card with title', () => {
    render(
      <ChartCard title="Test Chart">
        <div>Chart Content</div>
      </ChartCard>
    );
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <ChartCard title="Test Chart">
        <div data-testid="chart-content">Chart Content</div>
      </ChartCard>
    );
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('applies correct Material UI card styling', () => {
    const { container } = render(
      <ChartCard title="Test Chart">
        <div>Content</div>
      </ChartCard>
    );
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('renders title as heading level 2', () => {
    render(
      <ChartCard title="Dashboard Chart">
        <div>Content</div>
      </ChartCard>
    );
    const heading = screen.getByRole('heading', { level: 2, name: /dashboard chart/i });
    expect(heading).toBeInTheDocument();
  });
});
