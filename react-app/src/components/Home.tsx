import { useCallback, useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import type { Course } from '../model/course';
import { findAllCourses } from '../services/coursesService';
import { sortCoursesBySeqNo } from '../utils/sortCoursesBySeqNo';
import CoursesCardList from './CoursesCardList';

export default function Home() {
  const [beginnerCourses, setBeginnerCourses] = useState<Course[]>([]);
  const [advancedCourses, setAdvancedCourses] = useState<Course[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const reloadCourses = useCallback(async () => {
    const courses = await findAllCourses();
    setBeginnerCourses(
      courses.filter((c) => c.category === 'BEGINNER').sort(sortCoursesBySeqNo),
    );
    setAdvancedCourses(
      courses.filter((c) => c.category === 'ADVANCED').sort(sortCoursesBySeqNo),
    );
  }, []);

  useEffect(() => {
    reloadCourses();
  }, [reloadCourses]);

  const showBeginners = beginnerCourses.length > 0;
  const showAdvanced = advancedCourses.length > 0;

  const tabs: { label: string; courses: Course[] }[] = [];
  if (showBeginners) tabs.push({ label: 'Beginners', courses: beginnerCourses });
  if (showAdvanced) tabs.push({ label: 'Advanced', courses: advancedCourses });

  const active = tabs[selectedTab];

  return (
    <div className="container">
      <h3>All Courses</h3>

      <Tabs
        value={Math.min(selectedTab, Math.max(tabs.length - 1, 0))}
        onChange={(_, value) => setSelectedTab(value)}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
      >
        {tabs.map((tab) => (
          <Tab key={tab.label} label={tab.label} />
        ))}
      </Tabs>

      {active && (
        <CoursesCardList courses={active.courses} onCourseEdited={reloadCourses} />
      )}
    </div>
  );
}
