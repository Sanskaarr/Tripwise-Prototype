import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders default loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom loading text', () => {
    render(<LoadingSpinner text="Fetching data..." />);
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('does not render text when text prop is empty', () => {
    const { container } = render(<LoadingSpinner text="" />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    // Verify it still renders the loader div
    expect(container.querySelector('.border-t-blue-500')).toBeInTheDocument();
  });

  it('applies correct class names for size options', () => {
    const { rerender, container } = render(<LoadingSpinner size="sm" />);
    expect(container.querySelector('.w-4.h-4')).toBeInTheDocument();

    rerender(<LoadingSpinner size="md" />);
    expect(container.querySelector('.w-6.h-6')).toBeInTheDocument();

    rerender(<LoadingSpinner size="lg" />);
    expect(container.querySelector('.w-8.h-8')).toBeInTheDocument();
  });

  it('applies custom className passed via props', () => {
    const { container } = render(<LoadingSpinner className="my-custom-class" />);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
