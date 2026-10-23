import type { LoaderFunctionArgs } from 'react-router';
import type { Course } from '../model/course';
import { coursesService, HttpError, type CoursesService } from './coursesService';

/** Builds a route loader bound to a given service (handy for tests). */
export function createCourseLoader(service: CoursesService) {
  return async function loader({ params, request }: LoaderFunctionArgs): Promise<Course> {
    const course = await service.findCourseById(Number(params.id), { signal: request.signal });
    // The Express API answers an unknown id with an empty 200 body (null).
    if (!course) {
      throw new HttpError(404, 'Not Found', `/api/courses/${params.id}`);
    }
    return course;
  };
}

/** React Router equivalent of Angular's `courseResolver`: fetches `/api/courses/:id` before rendering. */
export const courseLoader = createCourseLoader(coursesService);
