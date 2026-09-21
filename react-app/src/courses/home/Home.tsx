import { useCallback, useEffect, useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Course } from '../model/course';
import { useCoursesService } from '../services/CoursesServiceContext';
import { CoursesCardList } from '../courses-card-list/CoursesCardList';
import { sortCoursesBySeqNo } from './sortCourseBySeq';
import './Home.css';

interface CourseTab {
  label: string;
  courses: Course[];
}

function filterByCategory(courses: Course[], category: string): Course[] {
  return courses.filter((course) => course.category === category).sort(sortCoursesBySeqNo);
}

export const Home = () => {
  const coursesService = useCoursesService();
  const [beginnerCourses, setBeginnerCourses] = useState<Course[]>([]);
  const [advancedCourses, setAdvancedCourses] = useState<Course[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const reloadCourses = useCallback(async () => {
    const courses = await coursesService.findAllCourses();
    setBeginnerCourses(filterByCategory(courses, 'BEGINNER'));
    setAdvancedCourses(filterByCategory(courses, 'ADVANCED'));
  }, [coursesService]);

  useEffect(() => {
    void reloadCourses();
  }, [reloadCourses]);

  const tabs: CourseTab[] = [
    { label: 'Beginners', courses: beginnerCourses },
    { label: 'Advanced', courses: advancedCourses },
  ].filter((tab) => tab.courses.length > 0);

  const activeTab = Math.min(selectedTab, Math.max(tabs.length - 1, 0));

  return (
    <div className="container">
      <h3>All Courses</h3>

      <Tabs value={tabs.length > 0 ? activeTab : false} onChange={(_event, value: number) => setSelectedTab(value)}>
        {tabs.map((tab) => (
          <Tab key={tab.label} label={tab.label} id={`home-tab-${tab.label}`} />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          hidden={index !== activeTab}
          aria-labelledby={`home-tab-${tab.label}`}
          className={index === activeTab ? 'tab-body-active' : undefined}
        >
          {index === activeTab && <CoursesCardList courses={tab.courses} onCourseEdited={reloadCourses} />}
        </div>
      ))}
    </div>
  );
};
