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
  const [tabIndex, setTabIndex] = useState(0);

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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 1, ml: 1 }}>
        All Courses
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        {beginnerCourses.length > 0 && <Tab label="Beginners" />}
        {advancedCourses.length > 0 && <Tab label="Advanced" />}
      </Tabs>
      {tabIndex === 0 && beginnerCourses.length > 0 && (
        <CoursesCardList courses={beginnerCourses} onCourseEdited={loadCourses} />
      )}
      {tabIndex === 1 && advancedCourses.length > 0 && (
        <CoursesCardList courses={advancedCourses} onCourseEdited={loadCourses} />
      )}
    </Box>
  );
}

export default Home;
