import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lesson } from '../model/lesson';
import { useCoursesService, type SortOrder } from '../services';

export interface UseLessonsResult {
  lessons: Lesson[];
  loading: boolean;
  loadLessons: (courseId: number, filter: string, sortDirection: SortOrder, pageIndex: number, pageSize: number) => void;
}

/**
 * Port of `LessonsDataSource` (src/app/courses/services/lessons.datasource.ts).
 * Errors resolve to an empty page (legacy `catchError(() => of([]))`).
 * Intentional deviation: a newer `loadLessons` call aborts the previous request and its
 * (possibly out-of-order) response is ignored, so `loading` only clears once the latest request settles.
 */
export function useLessons(): UseLessonsResult {
  const coursesService = useCoursesService();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const loadLessons = useCallback<UseLessonsResult['loadLessons']>(
    (courseId, filter, sortDirection, pageIndex, pageSize) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setLoading(true);

      coursesService
        .findLessons(courseId, filter, sortDirection, pageIndex, pageSize, { signal: controller.signal })
        .catch((): Lesson[] => [])
        .then((page) => {
          if (controller.signal.aborted) return;
          setLessons(page ?? []);
          setLoading(false);
        });
    },
    [coursesService],
  );

  return { lessons, loading, loadLessons };
}
