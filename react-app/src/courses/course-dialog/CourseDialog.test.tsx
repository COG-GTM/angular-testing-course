import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../common/testUtils';
import { setupCourses } from '../common/setupTestData';
import { CourseDialog } from './CourseDialog';

// Placeholder test; W2-B replaces it.
describe('CourseDialog (placeholder)', () => {
  it('closes without a result', async () => {
    const onClose = vi.fn();
    const course = setupCourses()[0];
    renderWithProviders(<CourseDialog open course={course} onClose={onClose} />);

    expect(screen.getByRole('dialog')).toHaveTextContent(course.titles.description);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledWith();
  });
});
