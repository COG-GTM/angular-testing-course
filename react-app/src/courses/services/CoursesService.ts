import { Course } from '../model/course';
import { Lesson } from '../model/lesson';

interface Payload<T> {
  payload: T;
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${input}`);
  }
  return (await res.json()) as T;
}

// Port of ../src/app/courses/services/courses.service.ts (Observables -> Promises)
export class CoursesService {
  findCourseById(courseId: number): Promise<Course> {
    return request<Course>(`/api/courses/${courseId}`);
  }

  async findAllCourses(): Promise<Course[]> {
    const res = await request<Payload<Course[]>>('/api/courses');
    return res.payload;
  }

  saveCourse(courseId: number, changes: Partial<Course>): Promise<Course> {
    return request<Course>(`/api/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });
  }

  async findLessons(
    courseId: number,
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 3,
  ): Promise<Lesson[]> {
    const params = new URLSearchParams({
      courseId: courseId.toString(),
      filter,
      sortOrder,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    const res = await request<Payload<Lesson[]>>(`/api/lessons?${params.toString()}`);
    return res.payload;
  }
}

export const coursesService = new CoursesService();
