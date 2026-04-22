import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';
import type { Course } from '../types/course';
import { findAllCourses } from '../services/coursesApi';
import { sortCoursesBySeqNo } from '../utils/sortCoursesBySeqNo';
import { CoursesCardList } from '../components/CoursesCardList';

export function HomePage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCourses(null);
    setError(null);
    findAllCourses(controller.signal)
      .then((data) => setCourses(data))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      });
    return () => controller.abort();
  }, [reloadCount]);

  const filterByCategory = useCallback(
    (category: string): Course[] =>
      (courses ?? [])
        .filter((course) => course.category === category)
        .sort(sortCoursesBySeqNo),
    [courses],
  );

  const beginnerCourses = useMemo(
    () => filterByCategory('BEGINNER'),
    [filterByCategory],
  );
  const advancedCourses = useMemo(
    () => filterByCategory('ADVANCED'),
    [filterByCategory],
  );

  const handleCourseEdited = useCallback(() => {
    setReloadCount((n) => n + 1);
  }, []);

  if (error) {
    return <Box sx={{ p: 4, color: 'error.main' }}>{error}</Box>;
  }

  if (!courses) {
    return (
      <div className="spinner-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tab}
        onChange={(_, newValue: number) => setTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Beginners" />
        <Tab label="Advanced" />
      </Tabs>
      <Box className="courses-panel" role="tabpanel" sx={{ p: 2 }}>
        {tab === 0 && (
          <CoursesCardList
            courses={beginnerCourses}
            onCourseEdited={handleCourseEdited}
          />
        )}
        {tab === 1 && (
          <CoursesCardList
            courses={advancedCourses}
            onCourseEdited={handleCourseEdited}
          />
        )}
      </Box>
    </Box>
  );
}
