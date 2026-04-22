import type { Course } from '../types/course';
import type { Lesson } from '../types/lesson';

interface CoursesResponse {
  payload: Course[];
}

interface LessonsResponse {
  payload: Lesson[];
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function findAllCourses(signal?: AbortSignal): Promise<Course[]> {
  const res = await fetch('/api/courses', { signal });
  const data = await handleResponse<CoursesResponse>(res);
  return data.payload;
}

export async function findCourseById(
  courseId: number | string,
  signal?: AbortSignal,
): Promise<Course> {
  const res = await fetch(`/api/courses/${courseId}`, { signal });
  return handleResponse<Course>(res);
}

export async function saveCourse(
  courseId: number | string,
  changes: Partial<Course>,
  signal?: AbortSignal,
): Promise<Course> {
  const res = await fetch(`/api/courses/${courseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
    signal,
  });
  return handleResponse<Course>(res);
}

export interface FindLessonsOptions {
  filter?: string;
  sortOrder?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

export async function findLessons(
  courseId: number | string,
  {
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 3,
    signal,
  }: FindLessonsOptions = {},
): Promise<Lesson[]> {
  const params = new URLSearchParams({
    courseId: String(courseId),
    filter,
    sortOrder,
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });
  const res = await fetch(`/api/lessons?${params.toString()}`, { signal });
  const data = await handleResponse<LessonsResponse>(res);
  return data.payload;
}
