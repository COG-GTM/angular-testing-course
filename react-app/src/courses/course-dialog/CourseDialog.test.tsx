import { fireEvent, render } from '@testing-library/react';
import { CourseDialog } from './CourseDialog';
import { setupCourses } from '../common/setupTestData';
import { CoursesService } from '../services/CoursesService';
import { CoursesServiceProvider } from '../services/CoursesServiceContext';

describe('CourseDialog', () => {
  const course = setupCourses()[0];

  const renderDialog = (onClose: (result?: unknown) => void, service: CoursesService) =>
    render(
      <CoursesServiceProvider service={service}>
        <CourseDialog course={course} open onClose={onClose} />
      </CoursesServiceProvider>,
    );

  it('should save changed course description and close with the form value', async () => {
    const service = {
      saveCourse: vi.fn().mockResolvedValue(course),
    } as unknown as CoursesService;
    const onClose = vi.fn();
    const { getByRole } = renderDialog(onClose, service);

    fireEvent.change(getByRole('textbox', { name: /Course Description/ }), {
      target: { value: 'Updated course description' },
    });
    fireEvent.click(getByRole('button', { name: 'Save' }));

    await vi.waitFor(() => expect(service.saveCourse).toHaveBeenCalledTimes(1));
    expect(service.saveCourse).toHaveBeenCalledWith(course.id, {
      titles: {
        description: 'Updated course description',
        longDescription: course.titles.longDescription,
      },
    });
    expect(onClose).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Updated course description' }),
    );
  });

  it('should close without a result when Close is clicked', () => {
    const service = {
      saveCourse: vi.fn(),
    } as unknown as CoursesService;
    const onClose = vi.fn();
    const { getByRole } = renderDialog(onClose, service);

    fireEvent.click(getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledWith();
    expect(service.saveCourse).not.toHaveBeenCalled();
  });
});
