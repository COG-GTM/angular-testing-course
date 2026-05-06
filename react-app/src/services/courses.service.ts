import type { Course } from '../models/course';
import type { Lesson } from '../models/lesson';

const API_BASE = '/api';

export async function findAllCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`);
  const data = await res.json();
  return data.payload;
}

export async function findCourseById(courseId: number): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses/${courseId}`);
  return res.json();
}

export async function saveCourse(courseId: number, changes: Partial<Course>): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses/${courseId}`, {
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
  pageSize = 3
): Promise<Lesson[]> {
  const params = new URLSearchParams({
    courseId: courseId.toString(),
    filter,
    sortOrder,
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });
  const res = await fetch(`${API_BASE}/lessons?${params}`);
  const data = await res.json();
  return data.payload;
}
