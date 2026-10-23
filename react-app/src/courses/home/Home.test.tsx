import { screen } from '@testing-library/react';
import { renderWithProviders } from '../common/testUtils';
import { Home } from './Home';

// Placeholder test; W2-A replaces it.
describe('Home (placeholder)', () => {
  it('renders the page title', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('All Courses')).toBeInTheDocument();
  });
});
