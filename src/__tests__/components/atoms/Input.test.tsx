import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../../components/atoms/Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Test Input" />);
    expect(screen.getByLabelText(/test input/i)).toBeInTheDocument();
  });

  it('handles input change', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<Input label="Test Input" onChange={handleChange} />);
    
    const input = screen.getByLabelText(/test input/i);
    await user.type(input, 'Hello');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies fullWidth prop', () => {
    const { container } = render(<Input label="Test Input" fullWidth />);
    const textField = container.querySelector('.MuiTextField-root');
    expect(textField).toBeInTheDocument();
  });

  it('displays value correctly', () => {
    render(<Input label="Test Input" value="Test Value" onChange={() => {}} />);
    const input = screen.getByLabelText(/test input/i) as HTMLInputElement;
    expect(input.value).toBe('Test Value');
  });

  it('can be disabled', () => {
    render(<Input label="Test Input" disabled />);
    const input = screen.getByLabelText(/test input/i);
    expect(input).toBeDisabled();
  });
});
