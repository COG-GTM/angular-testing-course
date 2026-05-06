import { useEffect, useState, useCallback } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import type { Course } from '../models/course';
import { findAllCourses } from '../services/courses.service';
import { CoursesCardList } from '../components/CoursesCardList';

function sortCoursesBySeqNo(c1: Course, c2: Course): number {
  return c1.seqNo - c2.seqNo;
}

export function HomePage() {
  const [beginnerCourses, setBeginnerCourses] = useState<Course[]>([]);
  const [advancedCourses, setAdvancedCourses] = useState<Course[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  const loadCourses = useCallback(async () => {
    const courses = await findAllCourses();
    setBeginnerCourses(
      courses.filter((c) => c.category === 'BEGINNER').sort(sortCoursesBySeqNo)
    );
    setAdvancedCourses(
      courses.filter((c) => c.category === 'ADVANCED').sort(sortCoursesBySeqNo)
    );
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className="container">
      <h3>All Courses</h3>
      <Box>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': { color: 'rgba(0, 0, 0, 0.6)' },
          }}
        >
          {beginnerCourses.length > 0 && <Tab label="Beginners" sx={{ textTransform: 'none', letterSpacing: '1.25px' }} />}
          {advancedCourses.length > 0 && <Tab label="Advanced" sx={{ textTransform: 'none', letterSpacing: '1.25px' }} />}
        </Tabs>
      </Box>
      {tabIndex === 0 && beginnerCourses.length > 0 && (
        <CoursesCardList courses={beginnerCourses} onCourseEdited={loadCourses} />
      )}
      {tabIndex === 1 && advancedCourses.length > 0 && (
        <CoursesCardList courses={advancedCourses} onCourseEdited={loadCourses} />
      )}
    </div>
  );
}
