import { useCallback, useEffect, useState } from 'react';
import type { Course } from '../types/course';
import { coursesService } from '../services/courses.service';
import { sortCoursesBySeqNo } from '../utils/sort-course-by-seq';
import CoursesCardList from '../components/CoursesCardList';

function filterByCategory(courses: Course[], category: string): Course[] {
  return courses
    .filter((course) => course.category === category)
    .sort(sortCoursesBySeqNo);
}

export default function HomePage() {
  const [beginnerCourses, setBeginnerCourses] = useState<Course[]>([]);
  const [advancedCourses, setAdvancedCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const reloadCourses = useCallback((signal?: AbortSignal) => {
    coursesService
      .findAllCourses(signal)
      .then((courses) => {
        setBeginnerCourses(filterByCategory(courses, 'BEGINNER'));
        setAdvancedCourses(filterByCategory(courses, 'ADVANCED'));
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          console.error(err);
        }
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    reloadCourses(controller.signal);
    return () => controller.abort();
  }, [reloadCourses]);

  const tabs: { label: string; courses: Course[] }[] = [];
  if (beginnerCourses.length > 0) {
    tabs.push({ label: 'Beginners', courses: beginnerCourses });
  }
  if (advancedCourses.length > 0) {
    tabs.push({ label: 'Advanced', courses: advancedCourses });
  }

  const current = Math.min(activeTab, Math.max(tabs.length - 1, 0));

  return (
    <div className="container">
      <h3>All Courses</h3>

      <div className="mat-tab-group">
        <div className="mat-tab-header" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              role="tab"
              className={`mat-tab-label${index === current ? ' active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tabs.length > 0 && (
          <div className="mat-tab-body">
            <CoursesCardList
              courses={tabs[current].courses}
              onCourseEdited={() => reloadCourses()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
