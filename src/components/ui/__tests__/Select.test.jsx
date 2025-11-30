import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Select } from '../Select';

describe('Select', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  test('renders with label and options', () => {
    render(<Select label="Test Select" options={options} />);
    
    // Check if label is rendered
    expect(screen.getByText('Test Select')).toBeInTheDocument();
    
    // Check if options are rendered
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    // Check if placeholder is shown
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    
    // Check if options are rendered
    options.forEach(option => {
      const optionElement = screen.getByRole('option', { name: option.label });
      expect(optionElement).toBeInTheDocument();
      
      // Check if disabled state is applied
      if (option.disabled) {
        expect(optionElement).toBeDisabled();
      }
    });
  });

  test('handles selection change', () => {
    const handleChange = jest.fn();
    
    render(
      <Select 
        label="Test Select" 
        options={options} 
        onChange={handleChange} 
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select.value).toBe('option2');
  });

  test('shows error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    
    render(
      <Select 
        label="Test Select" 
        options={options} 
        error={errorMessage}
      />
    );
    
    // Check if error message is shown
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    
    // Check if error styling is applied
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-300');
  });

  test('shows helper text when provided', () => {
    const helperText = 'Please select an option';
    
    render(
      <Select 
        label="Test Select" 
        options={options} 
        helperText={helperText}
      />
    );
    
    // Check if helper text is shown
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const customClass = 'custom-select';
    
    render(
      <Select 
        label="Test Select" 
        options={options} 
        className={customClass}
      />
    );
    
    // Check if custom class is applied
    const select = screen.getByRole('combobox');
    expect(select.closest('div')).toHaveClass(customClass);
  });

  test('renders with fullWidth prop', () => {
    render(
      <Select 
        label="Test Select" 
        options={options} 
        fullWidth
      />
    );
    
    // Check if full width class is applied
    const container = screen.getByText('Test Select').parentElement;
    expect(container).toHaveClass('w-full');
  });

  test('renders with custom placeholder', () => {
    const placeholder = 'Choose an option';
    
    render(
      <Select 
        label="Test Select" 
        options={options} 
        placeholder={placeholder}
      />
    );
    
    // Check if custom placeholder is shown
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });
});
