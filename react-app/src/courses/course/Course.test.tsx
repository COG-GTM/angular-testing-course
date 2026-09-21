import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Course } from './Course';
import { Course as CourseModel } from '../model/course';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/CoursesService';
import { CoursesServiceProvider } from '../services/CoursesServiceContext';

const course: CourseModel = {
  id: 12,
  seqNo: 0,
  titles: { description: 'Angular Testing Course' },
  iconUrl: 'https://example.com/angular-testing-small.png',
  uploadedImageUrl: '',
  courseListIcon: '',
  category: 'BEGINNER',
  lessonsCount: 10,
};

const makeLessons = (from: number, count: number): Lesson[] =>
  Array.from({ length: count }, (_, i) => ({
    id: from + i,
    seqNo: from + i,
    courseId: 12,
    description: `Lesson ${from + i}`,
    duration: '4:17',
  }));

describe('Course', () => {
  const findLessons = vi.fn<CoursesService['findLessons']>();
  const service = { findLessons } as unknown as CoursesService;

  beforeEach(() => {
    findLessons.mockReset();
    findLessons.mockImplementation((_courseId, _filter, _sort, pageNumber = 0, pageSize = 3) =>
      Promise.resolve(makeLessons(pageNumber * pageSize + 1, pageSize)),
    );
  });

  const renderCourse = () => {
    const router = createMemoryRouter(
      [{ path: '/courses/:id', element: <Course />, loader: () => course }],
      { initialEntries: ['/courses/12'] },
    );
    return render(
      <CoursesServiceProvider service={service}>
        <RouterProvider router={router} />
      </CoursesServiceProvider>,
    );
  };

  const rows = () => within(screen.getAllByRole('rowgroup')[1]).queryAllByRole('row');

  it('should load the course and the first page of lessons', async () => {
    renderCourse();

    expect(await screen.findByRole('heading', { name: 'Angular Testing Course' })).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', course.iconUrl);

    await waitFor(() => expect(rows()).toHaveLength(3));
    expect(findLessons).toHaveBeenCalledWith(12, '', 'asc', 0, 3);
    expect(rows()[0]).toHaveTextContent('Lesson 1');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should show a spinner while loading', async () => {
    let resolve!: (lessons: Lesson[]) => void;
    findLessons.mockReturnValue(new Promise<Lesson[]>((r) => (resolve = r)));
    renderCourse();

    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    resolve(makeLessons(1, 3));
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  });

  it('should debounce the search filter and reset the page', async () => {
    renderCourse();
    await waitFor(() => expect(rows()).toHaveLength(3));

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    await waitFor(() => expect(findLessons).toHaveBeenLastCalledWith(12, '', 'asc', 1, 3));

    fireEvent.change(screen.getByLabelText('Search lessons'), { target: { value: 'Hello' } });
    expect(findLessons).toHaveBeenCalledTimes(2);

    await waitFor(() => expect(findLessons).toHaveBeenLastCalledWith(12, 'Hello', 'asc', 0, 3));
    expect(findLessons).toHaveBeenCalledTimes(3);
  });

  it('should load the next page and change the page size', async () => {
    renderCourse();
    await waitFor(() => expect(rows()).toHaveLength(3));

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    await waitFor(() => expect(rows()[0]).toHaveTextContent('Lesson 4'));
    expect(findLessons).toHaveBeenLastCalledWith(12, '', 'asc', 1, 3);

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByRole('option', { name: '5' }));
    await waitFor(() => expect(findLessons).toHaveBeenLastCalledWith(12, '', 'asc', 0, 5));
    await waitFor(() => expect(rows()).toHaveLength(5));
  });

  it('should toggle sort direction and reset the page', async () => {
    renderCourse();
    await waitFor(() => expect(rows()).toHaveLength(3));

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    await waitFor(() => expect(findLessons).toHaveBeenLastCalledWith(12, '', 'asc', 1, 3));

    fireEvent.click(screen.getByRole('button', { name: '#' }));
    await waitFor(() => expect(findLessons).toHaveBeenLastCalledWith(12, '', 'desc', 0, 3));

    fireEvent.click(screen.getByRole('button', { name: '#' }));
    await waitFor(() => expect(findLessons).toHaveBeenLastCalledWith(12, '', 'asc', 0, 3));
  });

  it('should show no lessons when the service fails', async () => {
    findLessons.mockRejectedValue(new Error('boom'));
    renderCourse();

    await screen.findByRole('heading', { name: 'Angular Testing Course' });
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(rows()).toHaveLength(0);
  });
});
