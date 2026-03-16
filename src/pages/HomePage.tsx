import { useState, useEffect, useCallback } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Course } from '../models/course';
import { findAllCourses } from '../services/courses-service';
import { sortCoursesBySeqNo } from '../utils/sort-course-by-seq';
import CoursesCardList from '../components/CoursesCardList';

function HomePage() {
  const [beginnerCourses, setBeginnerCourses] = useState<Course[]>([]);
  const [advancedCourses, setAdvancedCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const loadCourses = useCallback(async () => {
    try {
      const courses = await findAllCourses();
      const sorted = courses.sort(sortCoursesBySeqNo);
      setBeginnerCourses(sorted.filter((c) => c.category === 'BEGINNER'));
      setAdvancedCourses(sorted.filter((c) => c.category === 'ADVANCED'));
    } catch (err) {
      console.error('Failed to load courses', err);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const reloadCourses = () => {
    loadCourses();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const showBeginnerTab = beginnerCourses.length > 0;
  const showAdvancedTab = advancedCourses.length > 0;

  const tabs: { label: string; courses: Course[] }[] = [];
  if (showBeginnerTab) {
    tabs.push({ label: 'Beginners', courses: beginnerCourses });
  }
  if (showAdvancedTab) {
    tabs.push({ label: 'Advanced', courses: advancedCourses });
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        All Courses
      </Typography>
      {tabs.length > 0 && (
        <>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {tabs.map((tab) => (
              <Tab key={tab.label} label={tab.label} />
            ))}
          </Tabs>
          {tabs.map((tab, index) => (
            <div
              key={tab.label}
              role="tabpanel"
              hidden={activeTab !== index}
              className={activeTab === index ? 'mat-mdc-tab-body-active' : ''}
            >
              {activeTab === index && (
                <CoursesCardList
                  courses={tab.courses}
                  onCourseEdited={reloadCourses}
                />
              )}
            </div>
          ))}
        </>
      )}
    </Box>
  );
}

export default HomePage;
