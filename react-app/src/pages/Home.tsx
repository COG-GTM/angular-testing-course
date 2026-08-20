import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Course } from '../types/course';
import { useCoursesService } from '../context/CoursesServiceContext';
import { sortCoursesBySeqNo } from '../utils/sort-course-by-seq';
import { CoursesCardList } from '../components/CoursesCardList';

function filterByCategory(courses: Course[], category: string) {
  return courses.filter((course) => course.category === category).sort(sortCoursesBySeqNo);
}

export function Home() {
  const coursesService = useCoursesService();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const reloadCourses = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const allCourses = await coursesService.findAllCourses(signal);
        if (!signal?.aborted) {
          setCourses(allCourses);
        }
      } catch {
        if (!signal?.aborted) {
          setCourses([]);
        }
      }
    },
    [coursesService],
  );

  useEffect(() => {
    const controller = new AbortController();
    void reloadCourses(controller.signal);
    return () => controller.abort();
  }, [reloadCourses]);

  const tabs = useMemo(() => {
    const beginnerCourses = filterByCategory(courses, 'BEGINNER');
    const advancedCourses = filterByCategory(courses, 'ADVANCED');

    return [
      { label: 'Beginners', courses: beginnerCourses },
      { label: 'Advanced', courses: advancedCourses },
    ].filter((tab) => tab.courses.length > 0);
  }, [courses]);

  const selectedTab = tabs[activeTab] ?? tabs[0];

  return (
    <div className="container">
      <h3>All Courses</h3>

      <div className="tab-group">
        <div className="tab-header" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={selectedTab === tab}
              className={`tab-label${selectedTab === tab ? ' tab-label-active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {selectedTab && (
          <div className="tab-body tab-body-active" role="tabpanel">
            <CoursesCardList
              courses={selectedTab.courses}
              onCourseEdited={() => void reloadCourses()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
