import { screen } from '@testing-library/react';
import { renderWithProviders } from '../common/testUtils';
import { setupCourses } from '../common/setupTestData';
import { CoursesCardList } from './CoursesCardList';

// Placeholder test; W2-B replaces it.
describe('CoursesCardList (placeholder)', () => {
  it('renders one entry per course', () => {
    renderWithProviders(<CoursesCardList courses={setupCourses()} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(12);
  });
});
