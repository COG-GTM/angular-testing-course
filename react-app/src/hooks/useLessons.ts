import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lesson } from '../types/lesson';
import { useCoursesService } from '../context/CoursesServiceContext';

export interface LessonsQuery {
  courseId: number;
  filter: string;
  sortDirection: string;
  pageIndex: number;
  pageSize: number;
}

/**
 * React equivalent of the Angular LessonsDataSource: loads a page of lessons
 * and exposes the current loading state, cancelling in-flight requests.
 */
export function useLessons(query: LessonsQuery) {
  const coursesService = useCoursesService();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { courseId, filter, sortDirection, pageIndex, pageSize } = query;

  const loadLessons = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const page = await coursesService.findLessons(
        courseId,
        filter,
        sortDirection,
        pageIndex,
        pageSize,
        controller.signal,
      );
      if (!controller.signal.aborted) {
        setLessons(page);
      }
    } catch {
      if (!controller.signal.aborted) {
        setLessons([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [coursesService, courseId, filter, sortDirection, pageIndex, pageSize]);

  useEffect(() => {
    void loadLessons();
    return () => abortRef.current?.abort();
  }, [loadLessons]);

  return { lessons, loading };
}
