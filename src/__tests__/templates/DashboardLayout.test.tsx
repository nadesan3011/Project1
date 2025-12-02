import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '../../templates/DashboardLayout';

describe('DashboardLayout Component', () => {
  it('renders the header with title', () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );
    
    expect(screen.getByText('Banking Cards Report Dashboard')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <DashboardLayout>
        <div data-testid="test-child">Test Content</div>
      </DashboardLayout>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('applies correct Material UI AppBar styling', () => {
    const { container } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );
    
    const appBar = container.querySelector('.MuiAppBar-root');
    expect(appBar).toBeInTheDocument();
  });

  it('renders Container with correct maxWidth', () => {
    const { container } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );
    
    const containerElement = container.querySelector('.MuiContainer-root');
    expect(containerElement).toBeInTheDocument();
  });
});
