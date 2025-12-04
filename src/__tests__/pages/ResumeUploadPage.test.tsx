import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResumeUploadPage from '../../pages/ResumeUploadPage';

describe('ResumeUploadPage Component', () => {
  const mockOnStartInterview = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title', () => {
    render(
      <ResumeUploadPage
        onStartInterview={mockOnStartInterview}
        onBack={mockOnBack}
      />
    );
    expect(screen.getByText('Set Up Your Interview')).toBeInTheDocument();
  });

  it('renders interview settings section', () => {
    render(
      <ResumeUploadPage
        onStartInterview={mockOnStartInterview}
        onBack={mockOnBack}
      />
    );
    expect(screen.getByText('Interview Settings')).toBeInTheDocument();
  });

  it('renders job type dropdown with default value', () => {
    render(
      <ResumeUploadPage
        onStartInterview={mockOnStartInterview}
        onBack={mockOnBack}
      />
    );
    expect(screen.getByText('General Interview')).toBeInTheDocument();
  });

  it('renders difficulty dropdown with default value', () => {
    render(
      <ResumeUploadPage
        onStartInterview={mockOnStartInterview}
        onBack={mockOnBack}
      />
    );
    expect(screen.getByText('Mid Level')).toBeInTheDocument();
  });

  it('renders resume upload section', () => {
    render(
      <ResumeUploadPage
        onStartInterview={mockOnStartInterview}
        onBack={mockOnBack}
      />
    );
    expect(screen.getByText('Resume (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Drop your resume here or click to upload')).toBeInTheDocument();
  });

  it('renders interview tips section', () => {
    render(
      <ResumeUploadPage
        onStartInterview={mockOnStartInterview}
        onBack={mockOnBack}
      />
    );
    expect(screen.getByText('Interview Tips')).toBeInTheDocument();
    expect(screen.getByText(/Use the STAR method/)).toBeInTheDocument();
  });

  it('calls onBack when Back to Home button is clicked', () => {
    render(
      <ResumeUploadPage
        onStartInterview={mockOnStartInterview}
        onBack={mockOnBack}
      />
    );
    fireEvent.click(screen.getByText('Back to Home'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('calls onStartInterview when Start Interview button is clicked', () => {
    render(
      <ResumeUploadPage
        onStartInterview={mockOnStartInterview}
        onBack={mockOnBack}
      />
    );
    fireEvent.click(screen.getByText('Start Interview'));
    expect(mockOnStartInterview).toHaveBeenCalledWith('general', 'mid', undefined);
  });

  it('shows paste resume text option when button is clicked', () => {
    render(
      <ResumeUploadPage
        onStartInterview={mockOnStartInterview}
        onBack={mockOnBack}
      />
    );
    fireEvent.click(screen.getByText('Paste Resume Text Manually'));
    expect(screen.getByPlaceholderText('Paste your resume text here...')).toBeInTheDocument();
  });
});
