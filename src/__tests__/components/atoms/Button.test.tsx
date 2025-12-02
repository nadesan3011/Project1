import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../../components/atoms/Button';

describe('Button Component', () => {
  it('renders button with label', () => {
    render(<Button label="Click Me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button label="Click Me" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state', () => {
    render(<Button label="Disabled Button" disabled />);
    expect(screen.getByRole('button', { name: /disabled button/i })).toBeDisabled();
  });

  it('applies custom variant', () => {
    render(<Button label="Outlined" variant="outlined" />);
    const button = screen.getByRole('button', { name: /outlined/i });
    expect(button).toHaveClass('MuiButton-outlined');
  });
});
