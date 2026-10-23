import { screen } from '@testing-library/react';
import { renderWithProviders } from '../common/testUtils';
import { setupCourses } from '../common/setupTestData';
import { CoursePage } from './CoursePage';

// Placeholder test; W2-C replaces it.
describe('CoursePage (placeholder)', () => {
  it('renders the course resolved by the route loader', async () => {
    const course = setupCourses()[0];
    renderWithProviders(<CoursePage />, { route: '/courses/12', path: '/courses/:id', loader: () => course });

    expect(await screen.findByRole('heading', { name: course.titles.description })).toBeInTheDocument();
  });
});
