import type { Course } from '../model/course';

export interface CoursesCardListProps {
  courses: Course[];
  /** Called after the edit dialog closed with a saved result (Angular: `courseEdited` output). */
  onCourseEdited?: () => void;
}

// Placeholder owned by W2-B: port of courses-card-list.component.html.
export function CoursesCardList({ courses }: CoursesCardListProps) {
  return (
    <ul aria-label="courses">
      {courses.map((course) => (
        <li key={course.id}>{course.titles.description}</li>
      ))}
    </ul>
  );
}
