import { http, HttpResponse } from 'msw';
import { COURSES, LESSONS, findCourseById } from '../../../server/db-data';
import type { Course } from '../courses/model/course';
import type { Lesson } from '../courses/model/lesson';

/**
 * Default MSW handlers mirroring the Express mock API in server/ (without the 1 s lessons delay).
 * Override per test with `server.use(...)`.
 */
export const handlers = [
  http.get('/api/courses', () => HttpResponse.json({ payload: Object.values(COURSES) as Course[] })),

  http.get('/api/courses/:id', ({ params }) => {
    const course = (Object.values(COURSES) as Course[]).find((c) => c.id === Number(params.id));
    return course ? HttpResponse.json(course) : new HttpResponse(null, { status: 200 });
  }),

  http.put('/api/courses/:id', async ({ params, request }) => {
    const changes = (await request.json()) as Partial<Course>;
    const course = findCourseById(Number(params.id)) as Course;
    return HttpResponse.json({ ...course, titles: changes.titles });
  }),

  http.get('/api/lessons', ({ request }) => {
    const query = new URL(request.url).searchParams;
    const courseId = Number(query.get('courseId'));
    const filter = query.get('filter') ?? '';
    const sortOrder = query.get('sortOrder');
    const pageNumber = parseInt(query.get('pageNumber') ?? '', 10) || 0;
    const pageSize = parseInt(query.get('pageSize') ?? '', 10);

    let lessons = (Object.values(LESSONS) as Lesson[])
      .filter((lesson) => lesson.courseId === courseId)
      .sort((l1, l2) => l1.id - l2.id);
    if (filter) {
      lessons = lessons.filter((lesson) => lesson.description.trim().toLowerCase().includes(filter.toLowerCase()));
    }
    if (sortOrder === 'desc') {
      lessons = lessons.reverse();
    }
    const initialPos = pageNumber * pageSize;
    return HttpResponse.json({ payload: lessons.slice(initialPos, initialPos + pageSize) });
  }),
];
