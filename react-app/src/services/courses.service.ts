import { Course } from '../models/course';
import { Lesson } from '../models/lesson';

const API_BASE = '/api';

export async function findAllCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE}/courses`);
  if (!response.ok) throw new Error(`Failed to fetch courses: ${response.status}`);
  const data = await response.json();
  return data.payload as Course[];
}

export async function findCourseById(courseId: number): Promise<Course> {
  const response = await fetch(`${API_BASE}/courses/${courseId}`);
  if (!response.ok) throw new Error(`Failed to fetch course ${courseId}: ${response.status}`);
  return response.json() as Promise<Course>;
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
  const response = await fetch(`${API_BASE}/lessons?${params}`);
  if (!response.ok) throw new Error(`Failed to fetch lessons: ${response.status}`);
  const data = await response.json();
  return data.payload as Lesson[];
}

export async function saveCourse(courseId: number, changes: Partial<Course>): Promise<Course> {
  const response = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!response.ok) throw new Error(`Failed to save course ${courseId}: ${response.status}`);
  return response.json() as Promise<Course>;
}
