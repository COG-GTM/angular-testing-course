import { http, HttpResponse } from 'msw';
import { server } from '../../test/server';
import { COURSES, findLessonsForCourse } from '../../../server/db-data';
import type { Course } from '../model/course';
import { coursesService, HttpError } from './coursesService';

// Port of src/app/courses/services/courses.services.spec.ts.
// MSW plays the role of HttpTestingController: each test records the requests it receives
// (expectOne + request assertions) and answers with `req.flush(...)`'s payload.
describe('CoursesService', () => {
  let requests: Request[];

  beforeEach(() => {
    requests = [];
    server.events.on('request:start', ({ request }) => {
      requests.push(request.clone());
    });
  });

  afterEach(() => {
    server.events.removeAllListeners();
  });

  function expectOne(predicate: (url: URL) => boolean): Request {
    const matches = requests.filter((r) => predicate(new URL(r.url)));
    expect(matches, 'expected exactly one matching request').toHaveLength(1);
    return matches[0];
  }

  it('should retrieve all courses', async () => {
    server.use(http.get('/api/courses', () => HttpResponse.json({ payload: Object.values(COURSES) })));

    const courses = await coursesService.findAllCourses();

    expect(courses, 'No courses returned').toBeTruthy();
    expect(courses.length, 'incorrect number of courses').toBe(12);
    const course = courses.find((c) => c.id == 12);
    expect(course?.titles.description).toBe('Angular Testing Course');

    const req = expectOne((url) => url.pathname === '/api/courses');
    expect(req.method).toEqual('GET');
  });

  it('should find a course by id', async () => {
    server.use(http.get('/api/courses/12', () => HttpResponse.json(COURSES[12])));

    const course = await coursesService.findCourseById(12);

    expect(course).toBeTruthy();
    expect(course?.id).toBe(12);

    const req = expectOne((url) => url.pathname === '/api/courses/12');
    expect(req.method).toEqual('GET');
  });

  it('should resolve null for an unknown course (empty 200 body)', async () => {
    server.use(http.get('/api/courses/999', () => new HttpResponse(null, { status: 200 })));

    expect(await coursesService.findCourseById(999)).toBeNull();
  });

  it('should save the course data', async () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } };
    server.use(http.put('/api/courses/12', () => HttpResponse.json({ ...COURSES[12], ...changes })));

    const course = await coursesService.saveCourse(12, changes);

    expect(course?.id).toBe(12);

    const req = expectOne((url) => url.pathname === '/api/courses/12');
    expect(req.method).toEqual('PUT');
    const body = (await req.json()) as Partial<Course>;
    expect(body.titles?.description).toEqual(changes.titles?.description);
  });

  it('should give an error if save course fails', async () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } };
    server.use(
      http.put(
        '/api/courses/12',
        () => new HttpResponse('Save course failed', { status: 500, statusText: 'Internal Server Error' }),
      ),
    );

    const error = await coursesService.saveCourse(12, changes).then(
      () => expect.fail('the save course operation should have failed'),
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(500);

    const req = expectOne((url) => url.pathname === '/api/courses/12');
    expect(req.method).toEqual('PUT');
  });

  it('should find a list of lessons', async () => {
    server.use(
      http.get('/api/lessons', () => HttpResponse.json({ payload: findLessonsForCourse(12).slice(0, 3) })),
    );

    const lessons = await coursesService.findLessons(12);

    expect(lessons).toBeTruthy();
    expect(lessons.length).toBe(3);

    const req = expectOne((url) => url.pathname === '/api/lessons');
    expect(req.method).toEqual('GET');
    const params = new URL(req.url).searchParams;
    expect(params.get('courseId')).toEqual('12');
    expect(params.get('filter')).toEqual('');
    expect(params.get('sortOrder')).toEqual('asc');
    expect(params.get('pageNumber')).toEqual('0');
    expect(params.get('pageSize')).toEqual('3');
  });
});
