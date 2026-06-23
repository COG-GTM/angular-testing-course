import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import type { Course } from '../model/course';
import CourseDialog from './CourseDialog';
import './CoursesCardList.css';

interface CoursesCardListProps {
  courses: Course[];
  onCourseEdited: () => void;
}

export default function CoursesCardList({
  courses,
  onCourseEdited,
}: CoursesCardListProps) {
  const [editing, setEditing] = useState<Course | null>(null);

  const handleClose = (saved: boolean) => {
    setEditing(null);
    if (saved) {
      onCourseEdited();
    }
  };

  return (
    <>
      {courses.map((course) => (
        <Card key={course.id} className="course-card mat-elevation-z10">
          <CardHeader
            title={course.titles.description}
            titleTypographyProps={{ variant: 'h6' }}
          />

          <CardMedia component="img" image={course.iconUrl} />

          <CardContent>
            <p>{course.titles.longDescription}</p>
          </CardContent>

          <CardActions className="course-actions">
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={`/courses/${course.id}`}
            >
              VIEW COURSE
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => setEditing(course)}
            >
              EDIT
            </Button>
          </CardActions>
        </Card>
      ))}

      {editing && <CourseDialog course={editing} onClose={handleClose} />}
    </>
  );
}
