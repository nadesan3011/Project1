import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '../../../components/atoms/Dropdown';

describe('Dropdown Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders dropdown with label', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown
        label="Select Option"
        value="option1"
        options={mockOptions}
        onChange={handleChange}
      />
    );
    const labels = screen.getAllByText(/select option/i);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('displays selected value', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown
        label="Select Option"
        value="option2"
        options={mockOptions}
        onChange={handleChange}
      />
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
  });

  it('handles selection change', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Dropdown
        label="Select Option"
        value="option1"
        options={mockOptions}
        onChange={handleChange}
      />
    );

    const dropdown = screen.getByRole('combobox');
    await user.click(dropdown);
    
    const options = await screen.findAllByRole('option');
    await user.click(options[2]); // Click on option3

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders all options', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Dropdown
        label="Select Option"
        value="option1"
        options={mockOptions}
        onChange={handleChange}
      />
    );

    const dropdown = screen.getByRole('combobox');
    await user.click(dropdown);

    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(mockOptions.length);
  });
});
