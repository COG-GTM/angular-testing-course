import { useEffect, useState } from 'react';
import type { Course } from '../types/course';
import { useCoursesService } from '../context/CoursesServiceContext';

/**
 * React equivalent of the Angular courseResolver: resolves the course for a
 * route before its content is rendered.
 */
export function useCourse(courseId: number) {
  const coursesService = useCoursesService();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    coursesService
      .findCourseById(courseId, controller.signal)
      .then((resolved) => {
        if (!controller.signal.aborted) {
          setCourse(resolved);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCourse(null);
        }
      });

    return () => controller.abort();
  }, [coursesService, courseId]);

  return course;
}
