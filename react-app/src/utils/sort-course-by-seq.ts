import type { Course } from '../types/course';

export function sortCoursesBySeqNo(c1: Course, c2: Course): number {
  return c1.seqNo - c2.seqNo;
}
