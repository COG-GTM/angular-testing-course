import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types/course';
import { CourseDialog } from './CourseDialog';
import './CoursesCardList.scss';

interface CoursesCardListProps {
  courses: Course[];
  onCourseEdited?: () => void;
}

export function CoursesCardList({ courses, onCourseEdited }: CoursesCardListProps) {
  const [editedCourse, setEditedCourse] = useState<Course | null>(null);

  return (
    <>
      {courses.map((course) => (
        <div key={course.id} className="card course-card elevation-z10">
          <div className="card-header">
            <h2 className="card-title">{course.titles.description}</h2>
          </div>

          <img className="card-image" src={course.iconUrl} alt={course.titles.description} />

          <div className="card-content">
            <p>{course.titles.longDescription}</p>
          </div>

          <div className="card-actions course-actions">
            <Link className="button button-primary" to={`/courses/${course.id}`}>
              VIEW COURSE
            </Link>

            <button type="button" className="button button-accent" onClick={() => setEditedCourse(course)}>
              EDIT
            </button>
          </div>
        </div>
      ))}

      {editedCourse && (
        <CourseDialog
          course={editedCourse}
          onClose={(value) => {
            setEditedCourse(null);
            if (value) {
              onCourseEdited?.();
            }
          }}
        />
      )}
    </>
  );
}
