import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CoursesService } from './courses.service';
import { COURSES, findLessonsForCourse } from '../../../server/db-data';
import type { Course } from '../types/course';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    coursesService = new CoursesService();
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should retrieve all courses', async () => {
    fetchSpy.mockResolvedValue(jsonResponse({ payload: Object.values(COURSES) }));

    const courses = await coursesService.findAllCourses();

    expect(courses).toBeTruthy();
    expect(courses.length).toBe(12);
    expect(courses.find((course) => course.id === 12)?.titles.description).toBe(
      'Angular Testing Course',
    );
    expect(fetchSpy).toHaveBeenCalledWith('/api/courses', { signal: undefined });
  });

  it('should find a course by id', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(COURSES[12]));

    const course = await coursesService.findCourseById(12);

    expect(course).toBeTruthy();
    expect(course.id).toBe(12);
    expect(fetchSpy).toHaveBeenCalledWith('/api/courses/12', { signal: undefined });
  });

  it('should save the course data', async () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } };

    fetchSpy.mockResolvedValue(jsonResponse({ ...COURSES[12], ...changes }));

    const course = await coursesService.saveCourse(12, changes);

    expect(course.id).toBe(12);

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/courses/12');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body as string).titles.description).toBe('Testing Course');
  });

  it('should give an error if save course fails', async () => {
    fetchSpy.mockResolvedValue(jsonResponse({ message: 'Internal server error' }, 500));

    await expect(coursesService.saveCourse(12, { titles: { description: 'Testing Course' } }))
      .rejects.toThrow('Request failed with status 500');
  });

  it('should find a list of lessons', async () => {
    const lessons = findLessonsForCourse(12).slice(0, 3);

    fetchSpy.mockResolvedValue(jsonResponse({ payload: lessons }));

    const found = await coursesService.findLessons(12);

    expect(found).toBeTruthy();
    expect(found.length).toBe(3);

    const url = new URL(fetchSpy.mock.calls[0][0] as string, 'http://localhost');
    expect(url.pathname).toBe('/api/lessons');
    expect(url.searchParams.get('courseId')).toBe('12');
    expect(url.searchParams.get('filter')).toBe('');
    expect(url.searchParams.get('sortOrder')).toBe('asc');
    expect(url.searchParams.get('pageNumber')).toBe('0');
    expect(url.searchParams.get('pageSize')).toBe('3');
  });
});
