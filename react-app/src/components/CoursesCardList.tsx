import { Link } from 'react-router-dom';
import { Course } from '../models/course';

interface Props {
  courses: Course[];
}

function CoursesCardList({ courses }: Props) {
  return (
    <div className="courses-card-list">
      {courses.map((course) => (
        <div key={course.id} className="mat-card course-card">
          <div className="mat-card-header">
            <img src={course.iconUrl} alt={course.titles.description} className="course-icon" />
            <div className="mat-card-header-text">
              <div className="mat-card-title">
                <Link to={`/courses/${course.id}`}>{course.titles.description}</Link>
              </div>
            </div>
          </div>
          <div className="mat-card-content">
            {course.titles.longDescription && <p>{course.titles.longDescription}</p>}
          </div>
          <div className="mat-card-actions">
            <Link to={`/courses/${course.id}`} className="mat-button">
              VIEW COURSE
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CoursesCardList;
