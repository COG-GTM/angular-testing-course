import type { Course } from '../types/course';
import type { Lesson } from '../types/lesson';

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export class CoursesService {
  async findCourseById(courseId: number, signal?: AbortSignal): Promise<Course> {
    const res = await fetch(`/api/courses/${courseId}`, { signal });
    return handle<Course>(res);
  }

  async findAllCourses(signal?: AbortSignal): Promise<Course[]> {
    const res = await fetch('/api/courses', { signal });
    const body = await handle<{ payload: Course[] }>(res);
    return body.payload;
  }

  async saveCourse(courseId: number, changes: Partial<Course>): Promise<Course> {
    const res = await fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });
    return handle<Course>(res);
  }

  async findLessons(
    courseId: number,
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 3,
    signal?: AbortSignal,
  ): Promise<Lesson[]> {
    const params = new URLSearchParams({
      courseId: courseId.toString(),
      filter,
      sortOrder,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    const res = await fetch(`/api/lessons?${params.toString()}`, { signal });
    const body = await handle<{ payload: Lesson[] }>(res);
    return body.payload;
  }
}

export const coursesService = new CoursesService();
