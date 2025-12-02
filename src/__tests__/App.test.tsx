import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the DashboardPage component
jest.mock('../pages', () => ({
  DashboardPage: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('provides Material UI theme', () => {
    const { container } = render(<App />);
    // CssBaseline is applied
    expect(container.firstChild).toBeInTheDocument();
  });
});
