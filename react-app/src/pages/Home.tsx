import { useEffect, useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Course } from '../models/course';
import { findAllCourses } from '../services/api';
import CoursesCardList from '../components/CoursesCardList';

function sortBySeqNo(c1: Course, c2: Course): number {
  return c1.seqNo - c2.seqNo;
}

function Home() {
  const [beginnerCourses, setBeginnerCourses] = useState<Course[]>([]);
  const [advancedCourses, setAdvancedCourses] = useState<Course[]>([]);
  const [tabValue, setTabValue] = useState<'beginners' | 'advanced'>('beginners');

  const loadCourses = useCallback(async () => {
    const courses = await findAllCourses();
    setBeginnerCourses(
      courses.filter((c) => c.category === 'BEGINNER').sort(sortBySeqNo)
    );
    setAdvancedCourses(
      courses.filter((c) => c.category === 'ADVANCED').sort(sortBySeqNo)
    );
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'beginners' | 'advanced') => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
        All Courses
      </Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
      >
        <Tab label="Beginners" value="beginners" />
        <Tab label="Advanced" value="advanced" />
      </Tabs>
      {tabValue === 'beginners' && (
        <CoursesCardList courses={beginnerCourses} onCourseEdited={loadCourses} />
      )}
      {tabValue === 'advanced' && (
        <CoursesCardList courses={advancedCourses} onCourseEdited={loadCourses} />
      )}
    </Box>
  );
}

export default Home;
