import { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Course } from '../types/course';
import { CourseDialog } from './CourseDialog';

interface CoursesCardListProps {
  courses: Course[];
  onCourseEdited: () => void;
}

export function CoursesCardList({
  courses,
  onCourseEdited,
}: CoursesCardListProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleEdit = (course: Course) => setEditingCourse(course);

  const handleClose = (saved: boolean) => {
    setEditingCourse(null);
    if (saved) {
      onCourseEdited();
    }
  };

  return (
    <div>
      {courses.map((course) => (
        <Card
          key={course.id}
          className="course-card mat-elevation-z4"
          sx={{ mb: 2 }}
        >
          <CardHeader title={course.titles.description} />
          {course.iconUrl && (
            <CardMedia
              component="img"
              image={course.iconUrl}
              alt={course.titles.description}
              sx={{ maxHeight: 200, objectFit: 'contain', p: 2 }}
            />
          )}
          <CardContent>
            <p>{course.titles.longDescription}</p>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to={`/courses/${course.id}`}
              size="small"
              color="primary"
            >
              VIEW COURSE
            </Button>
            <Button
              size="small"
              color="primary"
              onClick={() => handleEdit(course)}
            >
              EDIT
            </Button>
          </CardActions>
        </Card>
      ))}
      {editingCourse && (
        <CourseDialog course={editingCourse} onClose={handleClose} />
      )}
    </div>
  );
}
