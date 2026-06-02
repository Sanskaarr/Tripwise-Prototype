import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ValidationErrors from '../ValidationErrors';

describe('ValidationErrors Component', () => {
  it('renders null when there are no errors', () => {
    const { container } = render(<ValidationErrors errors={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correct header and count of errors', () => {
    const errors = {
      email: 'Email is invalid',
      password: 'Password must be at least 8 characters',
    };
    render(<ValidationErrors errors={errors} />);

    expect(screen.getByText('Validation Errors')).toBeInTheDocument();
    expect(screen.getByText('2 errors found')).toBeInTheDocument();
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('calls onDismiss with "all" when the top dismiss button is clicked', () => {
    const errors = { email: 'Email is invalid' };
    const mockDismiss = vi.fn();
    render(<ValidationErrors errors={errors} onDismiss={mockDismiss} />);

    const dismissAllBtn = screen.getByTitle('Dismiss all errors');
    fireEvent.click(dismissAllBtn);

    expect(mockDismiss).toHaveBeenCalledWith('all');
  });

  it('calls onDismiss with specific field when individual close button is clicked', () => {
    const errors = { email: 'Email is invalid' };
    const mockDismiss = vi.fn();
    render(<ValidationErrors errors={errors} onDismiss={mockDismiss} />);

    const dismissFieldBtn = screen.getByTitle('Dismiss email error');
    fireEvent.click(dismissFieldBtn);

    expect(mockDismiss).toHaveBeenCalledWith('email');
  });

  it('shows a "Dismiss All Errors" button below the list when there are more than 3 errors', () => {
    const errors = {
      field1: 'Error 1',
      field2: 'Error 2',
      field3: 'Error 3',
      field4: 'Error 4',
    };
    const mockDismiss = vi.fn();
    render(<ValidationErrors errors={errors} onDismiss={mockDismiss} />);

    const dismissAllBtn = screen.getByText('Dismiss All Errors');
    expect(dismissAllBtn).toBeInTheDocument();

    fireEvent.click(dismissAllBtn);
    expect(mockDismiss).toHaveBeenCalledWith('all');
  });
});
