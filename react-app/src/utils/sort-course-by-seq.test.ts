import { describe, it, expect } from 'vitest';
import { sortCoursesBySeqNo } from './sort-course-by-seq';
import type { Course } from '../types/course';

function course(seqNo: number): Course {
  return {
    id: seqNo,
    seqNo,
    titles: { description: `Course ${seqNo}` },
    iconUrl: '',
    uploadedImageUrl: '',
    courseListIcon: '',
    category: 'BEGINNER',
    lessonsCount: 0,
  };
}

describe('sortCoursesBySeqNo', () => {
  it('sorts courses in ascending seqNo order', () => {
    const sorted = [course(3), course(1), course(2)].sort(sortCoursesBySeqNo);
    expect(sorted.map((c) => c.seqNo)).toEqual([1, 2, 3]);
  });
});
