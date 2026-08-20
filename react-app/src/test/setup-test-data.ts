import { COURSES } from '../../../server/db-data';
import type { Course } from '../types/course';
import { sortCoursesBySeqNo } from '../utils/sort-course-by-seq';

export function setupCourses(): Course[] {
  return (Object.values(COURSES) as Course[]).sort(sortCoursesBySeqNo);
}
