import { CoursesService } from './CoursesService';

describe('CoursesService', () => {
  const service = new CoursesService();
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

  it('should retrieve all courses from payload', async () => {
    fetchMock.mockReturnValue(ok({ payload: [{ id: 12 }] }));
    const courses = await service.findAllCourses();
    expect(courses).toEqual([{ id: 12 }]);
    expect(fetchMock).toHaveBeenCalledWith('/api/courses', undefined);
  });

  it('should save the course data with PUT', async () => {
    fetchMock.mockReturnValue(ok({ id: 12 }));
    await service.saveCourse(12, { titles: { description: 'Testing Course' } });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/courses/12');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body as string)).toEqual({ titles: { description: 'Testing Course' } });
  });

  it('should find lessons with query params', async () => {
    fetchMock.mockReturnValue(ok({ payload: [] }));
    await service.findLessons(12);
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe('/api/lessons?courseId=12&filter=&sortOrder=asc&pageNumber=0&pageSize=3');
  });

  it('should throw on HTTP error', async () => {
    fetchMock.mockReturnValue(Promise.resolve(new Response('', { status: 500 })));
    await expect(service.findAllCourses()).rejects.toThrow('HTTP 500');
  });
});
