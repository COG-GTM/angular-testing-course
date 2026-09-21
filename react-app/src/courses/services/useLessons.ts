import { useCallback, useEffect, useRef, useState } from 'react';
import { Lesson } from '../model/lesson';
import { useCoursesService } from './CoursesServiceContext';

export type SortDirection = 'asc' | 'desc';

export interface LessonsQuery {
  courseId: number;
  filter: string;
  sortDirection: SortDirection;
  pageIndex: number;
  pageSize: number;
}

export interface LessonsState {
  lessons: Lesson[];
  loading: boolean;
}

// Port of ../src/app/courses/services/lessons.datasource.ts: BehaviorSubjects -> React state.
export function useLessons(query: LessonsQuery): LessonsState {
  const coursesService = useCoursesService();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  const { courseId, filter, sortDirection, pageIndex, pageSize } = query;

  const loadLessons = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    let result: Lesson[] = [];
    try {
      result = await coursesService.findLessons(courseId, filter, sortDirection, pageIndex, pageSize);
    } catch {
      result = [];
    }
    if (id === requestId.current) {
      setLessons(result);
      setLoading(false);
    }
  }, [coursesService, courseId, filter, sortDirection, pageIndex, pageSize]);

  useEffect(() => {
    void loadLessons();
  }, [loadLessons]);

  return { lessons, loading };
}
