import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CoursesService } from './courses.service';

const COURSE_12 = {
  id: 12,
  seqNo: 0,
  titles: {
    description: 'Angular Testing Course',
    longDescription:
      'In-depth guide to Unit Testing and E2E Testing of Angular Applications',
  },
  iconUrl: 'https://example.com/icon.png',
  uploadedImageUrl: '',
  courseListIcon: '',
  category: 'BEGINNER',
  lessonsCount: 10,
};

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

describe('CoursesService', () => {
  let service: CoursesService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    service = new CoursesService();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should retrieve all courses', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ payload: [COURSE_12] }));

    const courses = await service.findAllCourses();

    expect(courses).toBeTruthy();
    expect(courses.length).toBe(1);
    expect(courses[0].titles.description).toBe('Angular Testing Course');
    expect(fetchMock).toHaveBeenCalledWith('/api/courses', expect.anything());
  });

  it('should find a course by id', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(COURSE_12));

    const course = await service.findCourseById(12);

    expect(course).toBeTruthy();
    expect(course.id).toBe(12);
    expect(fetchMock).toHaveBeenCalledWith('/api/courses/12', expect.anything());
  });

  it('should save the course data', async () => {
    const changes = { titles: { description: 'Testing Course' } };
    fetchMock.mockResolvedValueOnce(jsonResponse({ ...COURSE_12, ...changes }));

    const course = await service.saveCourse(12, changes);

    expect(course.id).toBe(12);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/courses/12');
    expect(options.method).toBe('PUT');
    expect(JSON.parse(options.body).titles.description).toBe('Testing Course');
  });

  it('should give an error if save course fails', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('Save course failed', {
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    await expect(
      service.saveCourse(12, { titles: { description: 'Testing Course' } }),
    ).rejects.toMatchObject({ status: 500 });
  });

  it('should find a list of lessons', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ payload: [{ id: 1 }, { id: 2 }, { id: 3 }] }),
    );

    const lessons = await service.findLessons(12);

    expect(lessons).toBeTruthy();
    expect(lessons.length).toBe(3);

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/lessons?');
    expect(calledUrl).toContain('courseId=12');
    expect(calledUrl).toContain('filter=');
    expect(calledUrl).toContain('sortOrder=asc');
    expect(calledUrl).toContain('pageNumber=0');
    expect(calledUrl).toContain('pageSize=3');
  });
});
