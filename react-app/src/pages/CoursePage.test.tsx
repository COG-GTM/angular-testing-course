import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CoursePage } from './CoursePage';
import { CoursesServiceProvider } from '../context/CoursesServiceContext';
import { CoursesService } from '../services/courses.service';
import { COURSES, findLessonsForCourse } from '../../../server/db-data';
import type { Course } from '../types/course';
import type { Lesson } from '../types/lesson';

function renderCoursePage() {
  const service = new CoursesService();
  const findCourseById = vi
    .spyOn(service, 'findCourseById')
    .mockResolvedValue(COURSES[12] as Course);
  const findLessons = vi
    .spyOn(service, 'findLessons')
    .mockResolvedValue(findLessonsForCourse(12).slice(0, 3) as Lesson[]);

  const result = render(
    <CoursesServiceProvider service={service}>
      <MemoryRouter initialEntries={['/courses/12']}>
        <Routes>
          <Route path="/courses/:id" element={<CoursePage />} />
        </Routes>
      </MemoryRouter>
    </CoursesServiceProvider>,
  );

  return { ...result, findCourseById, findLessons };
}

describe('CoursePage', () => {
  it('should display the course title once resolved', async () => {
    renderCoursePage();

    expect(await screen.findByText('Angular Testing Course')).toBeInTheDocument();
  });

  it('should display the first page of lessons', async () => {
    const { container } = renderCoursePage();

    await waitFor(() => expect(container.querySelectorAll('.row')).toHaveLength(3));

    const firstRow = container.querySelector('.row');
    expect(firstRow?.textContent).toContain('Angular Testing Course - Helicopter View');
  });

  it('should request lessons with the default page and sort order', async () => {
    const { findLessons } = renderCoursePage();

    await waitFor(() => expect(findLessons).toHaveBeenCalled());

    expect(findLessons).toHaveBeenCalledWith(12, '', 'asc', 0, 3, expect.anything());
  });
});
