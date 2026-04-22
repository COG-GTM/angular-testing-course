import { describe, it, expect } from 'vitest';
import { sortCoursesBySeqNo } from './sortCoursesBySeqNo';
import type { Course } from '../types/course';

function makeCourse(id: number, seqNo: number): Course {
  return {
    id,
    seqNo,
    titles: { description: `c${id}` },
    iconUrl: '',
    uploadedImageUrl: '',
    courseListIcon: '',
    category: 'BEGINNER',
    lessonsCount: 0,
  };
}

describe('sortCoursesBySeqNo', () => {
  it('sorts courses ascending by seqNo', () => {
    const c1 = makeCourse(1, 3);
    const c2 = makeCourse(2, 1);
    const c3 = makeCourse(3, 2);
    const sorted = [c1, c2, c3].sort(sortCoursesBySeqNo);
    expect(sorted.map((c) => c.seqNo)).toEqual([1, 2, 3]);
  });
});
