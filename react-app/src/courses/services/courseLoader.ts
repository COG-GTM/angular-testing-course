import { LoaderFunctionArgs } from 'react-router-dom';
import { Course } from '../model/course';
import { coursesService } from './CoursesService';

// Port of ../src/app/courses/services/course.resolver.ts. Consumers read it via useLoaderData<Course>().
export function courseLoader({ params }: LoaderFunctionArgs): Promise<Course> {
  return coursesService.findCourseById(Number(params.id));
}
