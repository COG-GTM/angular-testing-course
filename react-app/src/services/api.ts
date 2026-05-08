import { Course } from '../models/course';
import { Lesson } from '../models/lesson';

interface CoursesResponse {
  payload: Course[];
}

interface LessonsResponse {
  payload: Lesson[];
}

export async function findAllCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses');
  const data: CoursesResponse = await res.json();
  return data.payload;
}

export async function findCourseById(courseId: number): Promise<Course> {
  const res = await fetch(`/api/courses/${courseId}`);
  const data: Course = await res.json();
  return data;
}

export async function saveCourse(
  courseId: number,
  changes: Partial<Course>
): Promise<Course> {
  const res = await fetch(`/api/courses/${courseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  const data: Course = await res.json();
  return data;
}

export async function findLessons(
  courseId: number,
  filter = '',
  sortOrder = 'asc',
  pageNumber = 0,
  pageSize = 3
): Promise<Lesson[]> {
  const params = new URLSearchParams({
    courseId: courseId.toString(),
    filter,
    sortOrder,
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });
  const res = await fetch(`/api/lessons?${params}`);
  const data: LessonsResponse = await res.json();
  return data.payload;
}
