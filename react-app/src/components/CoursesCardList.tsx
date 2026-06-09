import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types/course';
import CourseDialog from './CourseDialog';
import './CoursesCardList.css';

interface CoursesCardListProps {
  courses: Course[];
  onCourseEdited: () => void;
}

export default function CoursesCardList({
  courses,
  onCourseEdited,
}: CoursesCardListProps) {
  const [editing, setEditing] = useState<Course | null>(null);

  const handleClose = (saved?: boolean) => {
    setEditing(null);
    if (saved) {
      onCourseEdited();
    }
  };

  return (
    <>
      {courses.map((course) => (
        <div key={course.id} className="mat-card course-card mat-elevation-z10">
          <div className="mat-card-header">
            <div className="mat-card-title">{course.titles.description}</div>
          </div>

          <img className="mat-card-image" src={course.iconUrl} alt="" />

          <div className="mat-card-content">
            <p>{course.titles.longDescription}</p>
          </div>

          <div className="mat-card-actions course-actions">
            <Link
              className="mat-raised-button primary"
              to={`/courses/${course.id}`}
            >
              VIEW COURSE
            </Link>

            <button
              className="mat-raised-button accent"
              onClick={() => setEditing(course)}
            >
              EDIT
            </button>
          </div>
        </div>
      ))}

      {editing && <CourseDialog course={editing} onClose={handleClose} />}
    </>
  );
}
