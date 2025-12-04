import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '../../pages/LandingPage';
import { PricingPlan } from '../../types';

const mockPricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    tier: 'free',
    price: 0,
    features: ['1 free interview', 'Basic feedback'],
    interviewsIncluded: 1,
  },
  {
    id: 'pay-per-use',
    name: 'Pay Per Interview',
    tier: 'pay-per-use',
    price: 2,
    features: ['$2 per interview', 'AI-powered feedback'],
    interviewsIncluded: 1,
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    tier: 'monthly',
    price: 10,
    features: ['Unlimited interviews', 'Priority support'],
    interviewsIncluded: 'unlimited',
  },
];

describe('LandingPage Component', () => {
  const mockOnStartInterview = jest.fn();
  const mockOnViewPricing = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero section with main heading', () => {
    render(
      <LandingPage
        onStartInterview={mockOnStartInterview}
        onViewPricing={mockOnViewPricing}
        pricingPlans={mockPricingPlans}
      />
    );
    expect(screen.getByText('Ace Your Next Interview')).toBeInTheDocument();
  });

  it('renders stats section', () => {
    render(
      <LandingPage
        onStartInterview={mockOnStartInterview}
        onViewPricing={mockOnViewPricing}
        pricingPlans={mockPricingPlans}
      />
    );
    expect(screen.getByText('1,500+')).toBeInTheDocument();
    expect(screen.getByText('Interviews Completed')).toBeInTheDocument();
  });

  it('renders features section', () => {
    render(
      <LandingPage
        onStartInterview={mockOnStartInterview}
        onViewPricing={mockOnViewPricing}
        pricingPlans={mockPricingPlans}
      />
    );
    expect(screen.getByText('AI-Powered Feedback')).toBeInTheDocument();
    expect(screen.getByText('Resume-Tailored Questions')).toBeInTheDocument();
    expect(screen.getByText('Detailed Reports')).toBeInTheDocument();
    expect(screen.getByText('Multiple Job Types')).toBeInTheDocument();
  });

  it('renders how it works section', () => {
    render(
      <LandingPage
        onStartInterview={mockOnStartInterview}
        onViewPricing={mockOnViewPricing}
        pricingPlans={mockPricingPlans}
      />
    );
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Upload Resume (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Practice Interview')).toBeInTheDocument();
    expect(screen.getByText('Get Feedback & Improve')).toBeInTheDocument();
  });

  it('renders pricing plans', () => {
    render(
      <LandingPage
        onStartInterview={mockOnStartInterview}
        onViewPricing={mockOnViewPricing}
        pricingPlans={mockPricingPlans}
      />
    );
    expect(screen.getByText('Free Trial')).toBeInTheDocument();
    expect(screen.getByText('Pay Per Interview')).toBeInTheDocument();
    expect(screen.getByText('Pro Monthly')).toBeInTheDocument();
  });

  it('calls onStartInterview when Start Free Interview button is clicked', () => {
    render(
      <LandingPage
        onStartInterview={mockOnStartInterview}
        onViewPricing={mockOnViewPricing}
        pricingPlans={mockPricingPlans}
      />
    );
    fireEvent.click(screen.getByText('Start Free Interview'));
    expect(mockOnStartInterview).toHaveBeenCalledTimes(1);
  });

  it('calls onViewPricing when View Pricing button is clicked', () => {
    render(
      <LandingPage
        onStartInterview={mockOnStartInterview}
        onViewPricing={mockOnViewPricing}
        pricingPlans={mockPricingPlans}
      />
    );
    fireEvent.click(screen.getByText('View Pricing'));
    expect(mockOnViewPricing).toHaveBeenCalledTimes(1);
  });

  it('renders testimonial section', () => {
    render(
      <LandingPage
        onStartInterview={mockOnStartInterview}
        onViewPricing={mockOnViewPricing}
        pricingPlans={mockPricingPlans}
      />
    );
    expect(screen.getByText('What Users Say')).toBeInTheDocument();
    expect(screen.getByText('- Sarah K., Software Engineer')).toBeInTheDocument();
  });
});
