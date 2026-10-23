import { createCourseLoader, courseLoader } from './courseLoader';
import { HttpError } from './coursesService';
import { createCoursesServiceSpy } from '../common/testUtils';
import { setupCourses } from '../common/setupTestData';
import type { LoaderFunctionArgs } from 'react-router';

function args(id: string): LoaderFunctionArgs {
  const request = new Request(`http://localhost/courses/${id}`);
  return { params: { id }, request, context: undefined } as unknown as LoaderFunctionArgs;
}

describe('courseLoader', () => {
  it('fetches /api/courses/:id', async () => {
    const course = await courseLoader(args('12'));
    expect(course.id).toBe(12);
  });

  it('passes the numeric id and abort signal to the service', async () => {
    const spy = createCoursesServiceSpy();
    spy.findCourseById.mockResolvedValue(setupCourses()[0]);

    await createCourseLoader(spy)(args('12'));

    expect(spy.findCourseById).toHaveBeenCalledWith(12, { signal: expect.any(AbortSignal) });
  });

  it('throws a 404 HttpError when the API returns no course', async () => {
    await expect(courseLoader(args('999'))).rejects.toMatchObject({ status: 404 });
    await expect(courseLoader(args('999'))).rejects.toBeInstanceOf(HttpError);
  });
});
