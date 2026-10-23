import { screen } from '@testing-library/react';
import { renderWithProviders } from '../courses/common/testUtils';
import { AppToolbar } from './AppToolbar';

// Placeholder test; W2-D replaces it.
describe('AppToolbar (placeholder)', () => {
  it('links to COURSES and ABOUT', () => {
    renderWithProviders(<AppToolbar />);

    expect(screen.getByRole('link', { name: 'COURSES' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveAttribute('href', '/about');
  });
});
