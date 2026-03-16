import { useState, useEffect } from 'react';
import { Lesson } from '../models/lesson';
import { findLessons } from '../services/courses-service';

interface UseLessonsResult {
  lessons: Lesson[];
  loading: boolean;
}

export function useLessons(
  courseId: number,
  filter: string,
  sortDirection: string,
  pageIndex: number,
  pageSize: number
): UseLessonsResult {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    findLessons(courseId, filter, sortDirection, pageIndex, pageSize)
      .then((data) => {
        if (!cancelled) {
          setLessons(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLessons([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [courseId, filter, sortDirection, pageIndex, pageSize]);

  return { lessons, loading };
}
