import { render, screen } from '@testing-library/react';
import { About } from './About';

// Placeholder test; W2-D replaces it.
describe('About (placeholder)', () => {
  it('renders the welcome heading', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: 'Welcome!' })).toBeInTheDocument();
  });
});
