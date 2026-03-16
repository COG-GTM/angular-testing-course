import axios from 'axios';
import { Course } from '../models/course';
import { Lesson } from '../models/lesson';

export async function findAllCourses(): Promise<Course[]> {
  const response = await axios.get('/api/courses');
  return response.data.payload;
}

export async function findCourseById(courseId: number): Promise<Course> {
  const response = await axios.get<Course>(`/api/courses/${courseId}`);
  return response.data;
}

export async function saveCourse(
  courseId: number,
  changes: Partial<Course>
): Promise<Course> {
  const response = await axios.put<Course>(`/api/courses/${courseId}`, changes);
  return response.data;
}

export async function findLessons(
  courseId: number,
  filter = '',
  sortOrder = 'asc',
  pageNumber = 0,
  pageSize = 3
): Promise<Lesson[]> {
  const response = await axios.get('/api/lessons', {
    params: {
      courseId: courseId.toString(),
      filter,
      sortOrder,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    },
  });
  return response.data.payload;
}
