import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  findAllCourses,
  findCourseById,
  findLessons,
  saveCourse,
} from './coursesApi';

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetchJson(data: unknown, ok = true, status = 200) {
  const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  } as Response);
  return spy;
}

describe('coursesApi', () => {
  it('findAllCourses unwraps the payload', async () => {
    const courses = [{ id: 1 }];
    mockFetchJson({ payload: courses });
    const result = await findAllCourses();
    expect(result).toEqual(courses);
  });

  it('findCourseById hits the right URL', async () => {
    const course = { id: 42 };
    const spy = mockFetchJson(course);
    const result = await findCourseById(42);
    expect(result).toEqual(course);
    expect(spy).toHaveBeenCalledWith('/api/courses/42', expect.any(Object));
  });

  it('saveCourse sends PUT with JSON body', async () => {
    const spy = mockFetchJson({ id: 1 });
    await saveCourse(1, { category: 'BEGINNER' });
    const call = spy.mock.calls[0];
    expect(call[0]).toBe('/api/courses/1');
    const init = call[1] as RequestInit;
    expect(init.method).toBe('PUT');
    expect(init.body).toBe(JSON.stringify({ category: 'BEGINNER' }));
  });

  it('findLessons sends all expected query params', async () => {
    const spy = mockFetchJson({ payload: [] });
    await findLessons(5, { filter: 'foo', pageNumber: 2, pageSize: 10 });
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain('courseId=5');
    expect(url).toContain('filter=foo');
    expect(url).toContain('pageNumber=2');
    expect(url).toContain('pageSize=10');
    expect(url).toContain('sortOrder=asc');
  });

  it('throws when response is not ok', async () => {
    mockFetchJson(null, false, 500);
    await expect(findAllCourses()).rejects.toThrow(/500/);
  });
});
