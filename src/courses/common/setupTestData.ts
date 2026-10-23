import type { Course } from '../model/course';
import { COURSES } from '../../../server/db-data';
import { sortCoursesBySeqNo } from './sortCoursesBySeqNo';

/** Same fixture as the Angular specs: every course from server/db-data.ts, sorted by seqNo. */
export function setupCourses(): Course[] {
  return (Object.values(COURSES) as Course[]).sort(sortCoursesBySeqNo);
}
