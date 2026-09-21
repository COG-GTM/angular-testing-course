import { useState } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import { CourseDialog } from '../course-dialog/CourseDialog';
import { Course } from '../model/course';
import './CoursesCardList.css';

export interface CoursesCardListProps {
  courses: Course[];
  onCourseEdited?: () => void;
}

export const CoursesCardList = ({ courses, onCourseEdited }: CoursesCardListProps) => {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleDialogClose = (result?: unknown) => {
    setEditingCourse(null);
    if (result) {
      onCourseEdited?.();
    }
  };

  return (
    <>
      {courses.map((course) => (
        <Card key={course.id} className="course-card mat-elevation-z10">
          <CardHeader
            title={course.titles.description}
            titleTypographyProps={{ className: 'mat-card-title' }}
          />
          <CardMedia component="img" image={course.iconUrl} alt={course.titles.description} />
          <CardContent>
            <p>{course.titles.longDescription}</p>
          </CardContent>
          <CardActions className="course-actions">
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/courses/${course.id}`}
            >
              VIEW COURSE
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setEditingCourse(course)}
            >
              EDIT
            </Button>
          </CardActions>
        </Card>
      ))}
      {editingCourse && (
        <CourseDialog course={editingCourse} open onClose={handleDialogClose} />
      )}
    </>
  );
};
