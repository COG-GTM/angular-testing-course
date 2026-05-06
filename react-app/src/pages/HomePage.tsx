import { useEffect, useState, useMemo, useCallback } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import type { Course } from '../models/course';
import { findAllCourses } from '../services/courses.service';
import { CoursesCardList } from '../components/CoursesCardList';

function sortCoursesBySeqNo(c1: Course, c2: Course): number {
  return c1.seqNo - c2.seqNo;
}

interface CategoryTab {
  key: string;
  label: string;
  courses: Course[];
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

  const tabs = useMemo<CategoryTab[]>(() => {
    const result: CategoryTab[] = [];
    if (beginnerCourses.length > 0) result.push({ key: 'BEGINNER', label: 'Beginners', courses: beginnerCourses });
    if (advancedCourses.length > 0) result.push({ key: 'ADVANCED', label: 'Advanced', courses: advancedCourses });
    return result;
  }, [beginnerCourses, advancedCourses]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const activeTab = tabs[tabIndex];

  return (
    <div className="container">
      <h3>All Courses</h3>
      <Box>
        <Tabs
          value={tabs.length > 0 ? tabIndex : false}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': { color: 'rgba(0, 0, 0, 0.6)' },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.key} label={tab.label} sx={{ textTransform: 'none', letterSpacing: '1.25px' }} />
          ))}
        </Tabs>
      </Box>
      {activeTab && (
        <CoursesCardList courses={activeTab.courses} onCourseEdited={loadCourses} />
      )}
    </div>
  );
}
