import { COURSES } from '../../../../server/db-data';
import { sortCoursesBySeqNo } from '../home/sortCourseBySeq';
import { Course } from '../model/course';

export function setupCourses(): Course[] {
  return Object.values(COURSES as Record<string, Course>).sort(sortCoursesBySeqNo);
}
