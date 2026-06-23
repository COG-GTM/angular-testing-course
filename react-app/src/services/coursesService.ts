import type { Course } from '../model/course';
import type { Lesson } from '../model/lesson';

// React port of the Angular CoursesService. RxJS/HttpClient is replaced with
// fetch; consumers manage results with React state. Endpoints/behavior match.

export async function findCourseById(courseId: number): Promise<Course> {
  const res = await fetch(`/api/courses/${courseId}`);
  return res.json();
}

export async function findAllCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses');
  const body = await res.json();
  return body['payload'];
}

export async function saveCourse(
  courseId: number,
  changes: Partial<Course>,
): Promise<Course> {
  const res = await fetch(`/api/courses/${courseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  return res.json();
}

export async function findLessons(
  courseId: number,
  filter = '',
  sortOrder = 'asc',
  pageNumber = 0,
  pageSize = 3,
): Promise<Lesson[]> {
  const params = new URLSearchParams({
    courseId: courseId.toString(),
    filter,
    sortOrder,
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });
  const res = await fetch(`/api/lessons?${params.toString()}`);
  const body = await res.json();
  return body['payload'];
}
