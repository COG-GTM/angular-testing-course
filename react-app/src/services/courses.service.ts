import type { Course } from '../types/course';
import type { Lesson } from '../types/lesson';

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string,
  ) {
    super(message ?? statusText);
    this.name = 'HttpError';
  }
}

async function ensureOk(res: Response): Promise<Response> {
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new HttpError(res.status, res.statusText, body || res.statusText);
  }
  return res;
}

export class CoursesService {
  async findCourseById(courseId: number, signal?: AbortSignal): Promise<Course> {
    const res = await fetch(`/api/courses/${courseId}`, { signal });
    await ensureOk(res);
    return res.json();
  }

  async findAllCourses(signal?: AbortSignal): Promise<Course[]> {
    const res = await fetch('/api/courses', { signal });
    await ensureOk(res);
    const body = await res.json();
    return body['payload'];
  }

  async saveCourse(
    courseId: number,
    changes: Partial<Course>,
    signal?: AbortSignal,
  ): Promise<Course> {
    const res = await fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
      signal,
    });
    await ensureOk(res);
    return res.json();
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
    await ensureOk(res);
    const body = await res.json();
    return body['payload'];
  }
}

export const coursesService = new CoursesService();
