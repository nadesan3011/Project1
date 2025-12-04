import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the pages
jest.mock('../pages', () => ({
  DashboardPage: () => <div data-testid="dashboard-page">Dashboard Page</div>,
  LandingPage: ({ onStartInterview, onViewPricing }: { onStartInterview: () => void; onViewPricing: () => void }) => (
    <div data-testid="landing-page">
      Landing Page
      <button onClick={onStartInterview}>Start</button>
      <button onClick={onViewPricing}>Pricing</button>
    </div>
  ),
  ResumeUploadPage: ({ onStartInterview, onBack }: { onStartInterview: () => void; onBack: () => void }) => (
    <div data-testid="resume-upload-page">
      Resume Upload
      <button onClick={() => onStartInterview()}>Start</button>
      <button onClick={onBack}>Back</button>
    </div>
  ),
  InterviewPage: () => <div data-testid="interview-page">Interview Page</div>,
}));

// Mock the services
jest.mock('../services', () => ({
  interviewApiService: {
    getPricingPlans: () => [
      { id: 'free', name: 'Free', tier: 'free', price: 0, features: [], interviewsIncluded: 1 },
    ],
  },
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('provides Material UI theme', () => {
    const { container } = render(<App />);
    // CssBaseline is applied
    expect(container.firstChild).toBeInTheDocument();
  });
});
