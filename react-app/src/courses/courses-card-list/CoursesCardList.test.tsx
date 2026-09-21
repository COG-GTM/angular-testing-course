import { fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CoursesCardList } from './CoursesCardList';
import { setupCourses } from '../common/setupTestData';
import { CoursesService } from '../services/CoursesService';
import { CoursesServiceProvider } from '../services/CoursesServiceContext';

describe('CoursesCardList', () => {
  const renderCourses = (
    courses: ReturnType<typeof setupCourses>,
    onCourseEdited?: () => void,
  ) =>
    render(
      <MemoryRouter>
        <CoursesCardList courses={courses} onCourseEdited={onCourseEdited} />
      </MemoryRouter>,
    );

  it('should create the component', () => {
    const { container } = renderCourses([]);

    expect(container).toBeTruthy();
  });

  it('should display the course list', () => {
    const { container } = renderCourses(setupCourses());

    expect(container.querySelectorAll('.course-card')).toHaveLength(12);
  });

  it('should display the first course', () => {
    const courses = setupCourses();
    const { container } = renderCourses(courses);
    const firstCard = container.querySelector('.course-card:first-child');

    expect(firstCard?.querySelector('.mat-card-title')).toHaveTextContent(
      courses[0].titles.description,
    );
    expect(firstCard?.querySelector('img')).toHaveAttribute('src', courses[0].iconUrl);
  });

  it('should open the course dialog on EDIT and emit onCourseEdited when saved', async () => {
    const courses = setupCourses();
    const mock = {
      saveCourse: vi.fn().mockResolvedValue(courses[0]),
    } as unknown as CoursesService;
    const onCourseEdited = vi.fn();
    const { getAllByRole, getByRole } = render(
      <CoursesServiceProvider service={mock}>
        <MemoryRouter>
          <CoursesCardList courses={courses} onCourseEdited={onCourseEdited} />
        </MemoryRouter>
      </CoursesServiceProvider>,
    );

    fireEvent.click(getAllByRole('button', { name: 'EDIT' })[0]);
    expect(getByRole('dialog')).toHaveTextContent(courses[0].titles.description);
    fireEvent.click(getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onCourseEdited).toHaveBeenCalledTimes(1));
    expect(mock.saveCourse).toHaveBeenCalledWith(courses[0].id, {
      titles: {
        description: courses[0].titles.description,
        longDescription: courses[0].titles.longDescription,
      },
    });
  });

  it('should not emit onCourseEdited when the dialog is closed', () => {
    const courses = setupCourses();
    const mock = {
      saveCourse: vi.fn(),
    } as unknown as CoursesService;
    const onCourseEdited = vi.fn();
    const { getAllByRole, getByRole } = render(
      <CoursesServiceProvider service={mock}>
        <MemoryRouter>
          <CoursesCardList courses={courses} onCourseEdited={onCourseEdited} />
        </MemoryRouter>
      </CoursesServiceProvider>,
    );

    fireEvent.click(getAllByRole('button', { name: 'EDIT' })[0]);
    fireEvent.click(getByRole('button', { name: 'Close' }));

    expect(onCourseEdited).not.toHaveBeenCalled();
  });
});
