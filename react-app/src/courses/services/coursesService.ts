import type { Course } from '../model/course';
import type { Lesson } from '../model/lesson';
import { HttpError } from './httpError';

export { HttpError };

export interface RequestOptions {
  signal?: AbortSignal;
}

export type SortOrder = 'asc' | 'desc';

/** Port of Angular's `CoursesService` (src/app/courses/services/courses.service.ts), Promise-based. */
export interface CoursesService {
  findCourseById(id: number, opts?: RequestOptions): Promise<Course>;
  findAllCourses(opts?: RequestOptions): Promise<Course[]>;
  saveCourse(id: number, changes: Partial<Course>, opts?: RequestOptions): Promise<Course>;
  findLessons(
    courseId: number,
    filter?: string,
    sortOrder?: SortOrder,
    pageNumber?: number,
    pageSize?: number,
    opts?: RequestOptions,
  ): Promise<Lesson[]>;
}

interface Payload<T> {
  payload: T;
}

// Relative URLs are resolved against the document so the same code works in the browser
// (Vite proxy / preview) and under Vitest + MSW, where Node's fetch rejects relative URLs.
function toAbsoluteUrl(path: string): string {
  const base = globalThis.document?.baseURI ?? globalThis.location?.href ?? 'http://localhost/';
  return new URL(path, base).toString();
}

function parseBody(text: string): unknown {
  if (text === '') return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = toAbsoluteUrl(path);
  const response = await fetch(url, init);
  const text = await response.text();
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, path, parseBody(text));
  }
  // Like Angular's HttpClient, an empty 2xx body resolves to `null`.
  return (text === '' ? null : JSON.parse(text)) as T;
}

export const coursesService: CoursesService = {
  findCourseById(id, opts = {}) {
    return request<Course>(`/api/courses/${id}`, { signal: opts.signal });
  },

  async findAllCourses(opts = {}) {
    const res = await request<Payload<Course[]>>('/api/courses', { signal: opts.signal });
    return res.payload;
  },

  saveCourse(id, changes, opts = {}) {
    return request<Course>(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
      signal: opts.signal,
    });
  },

  async findLessons(courseId, filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3, opts = {}) {
    const params = new URLSearchParams({
      courseId: courseId.toString(),
      filter,
      sortOrder,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    const res = await request<Payload<Lesson[]>>(`/api/lessons?${params}`, { signal: opts.signal });
    return res.payload;
  },
};
