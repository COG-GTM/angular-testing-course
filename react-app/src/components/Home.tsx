import { useEffect, useState } from 'react';
import { Course } from '../models/course';
import { findAllCourses } from '../services/courses.service';
import CoursesCardList from './CoursesCardList';

function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'BEGINNER' | 'ADVANCED'>('BEGINNER');

  useEffect(() => {
    findAllCourses()
      .then((data) => setCourses(data))
      .catch((err) => console.error('Failed to load courses:', err));
  }, []);

  const beginnerCourses = courses
    .filter((c) => c.category === 'BEGINNER')
    .sort((a, b) => a.seqNo - b.seqNo);

  const advancedCourses = courses
    .filter((c) => c.category === 'ADVANCED')
    .sort((a, b) => a.seqNo - b.seqNo);

  return (
    <div className="home-container">
      <h3>All Courses</h3>
      <div className="mat-tab-group">
        <div className="mat-tab-labels">
          <button
            className={`mat-tab-label ${activeTab === 'BEGINNER' ? 'active' : ''}`}
            onClick={() => setActiveTab('BEGINNER')}
          >
            Beginners
          </button>
          <button
            className={`mat-tab-label ${activeTab === 'ADVANCED' ? 'active' : ''}`}
            onClick={() => setActiveTab('ADVANCED')}
          >
            Advanced
          </button>
        </div>
        <div className="mat-tab-body">
          {activeTab === 'BEGINNER' && <CoursesCardList courses={beginnerCourses} />}
          {activeTab === 'ADVANCED' && <CoursesCardList courses={advancedCourses} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
