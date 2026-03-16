import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
} from '@mui/material';
import { Course } from '../models/course';
import CourseDialog from './CourseDialog';

interface CoursesCardListProps {
  courses: Course[];
  onCourseEdited: () => void;
}

function CoursesCardList({ courses, onCourseEdited }: CoursesCardListProps) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const editCourse = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleDialogSave = () => {
    setDialogOpen(false);
    setSelectedCourse(null);
    onCourseEdited();
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card
              data-testid="course-card"
              elevation={10}
              sx={{ margin: '10px' }}
            >
              <CardHeader
                title={course.titles.description}
                titleTypographyProps={{ className: 'mat-mdc-card-title' }}
              />
              <CardMedia
                component="img"
                image={course.iconUrl}
                alt={course.titles.description}
              />
              <CardContent>
                <Typography variant="body2">
                  {course.titles.longDescription}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  VIEW COURSE
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => editCourse(course)}
                >
                  EDIT
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedCourse && (
        <CourseDialog
          open={dialogOpen}
          course={selectedCourse}
          onClose={handleDialogClose}
          onSave={handleDialogSave}
        />
      )}
    </>
  );
}

export default CoursesCardList;
