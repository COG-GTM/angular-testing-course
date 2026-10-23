import { useLoaderData } from 'react-router';
import type { Course } from '../model/course';

// Placeholder owned by W2-C: port of course.component.html (course header + paginated lessons table).
export function CoursePage() {
  const course = useLoaderData() as Course;
  return (
    <div className="container">
      <h2>{course.titles.description}</h2>
      <p>Course page placeholder</p>
    </div>
  );
}
