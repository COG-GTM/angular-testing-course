import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { findAllCourses, findCourseById, saveCourse, findLessons } from '../courses-service';
import { COURSES, findLessonsForCourse } from '../../test-data/db-data';

const server = setupServer(
  http.get('/api/courses', () => {
    return HttpResponse.json({ payload: Object.values(COURSES) });
  }),
  http.get('/api/courses/:id', ({ params }) => {
    const id = params.id as string;
    return HttpResponse.json(COURSES[id]);
  }),
  http.put('/api/courses/:id', async ({ params, request }) => {
    const id = params.id as string;
    const body = await request.json();
    return HttpResponse.json({ ...COURSES[id], ...(body as object) });
  }),
  http.get('/api/lessons', ({ request }) => {
    const url = new URL(request.url);
    const courseId = Number(url.searchParams.get('courseId'));
    const pageSize = Number(url.searchParams.get('pageSize') || '3');
    const lessons = findLessonsForCourse(courseId).slice(0, pageSize);
    return HttpResponse.json({ payload: lessons });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CoursesService', () => {
  it('should retrieve all courses', async () => {
    const courses = await findAllCourses();

    expect(courses).toBeTruthy();
    expect(courses.length).toBe(12);

    const course = courses.find((c) => c.id === 12);
    expect(course?.titles.description).toBe('Angular Testing Course');
  });

  it('should find a course by id', async () => {
    const course = await findCourseById(12);

    expect(course).toBeTruthy();
    expect(course.id).toBe(12);
  });

  it('should save the course data', async () => {
    const changes = { titles: { description: 'Testing Course' } };
    const course = await saveCourse(12, changes);

    expect(course.id).toBe(12);
  });

  it('should give an error if save course fails', async () => {
    server.use(
      http.put('/api/courses/:id', () => {
        return new HttpResponse('Save course failed', { status: 500 });
      })
    );

    try {
      await saveCourse(12, { titles: { description: 'Testing Course' } });
      expect.fail('the save course operation should have failed');
    } catch (error: unknown) {
      const axiosError = error as { response?: { status: number } };
      expect(axiosError.response?.status).toBe(500);
    }
  });

  it('should find a list of lessons', async () => {
    const lessons = await findLessons(12);

    expect(lessons).toBeTruthy();
    expect(lessons.length).toBe(3);
  });
});
