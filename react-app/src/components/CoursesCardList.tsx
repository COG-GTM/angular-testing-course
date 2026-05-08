import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Course } from '../models/course';
import CourseEditDialog from './CourseEditDialog';

interface CoursesCardListProps {
  courses: Course[];
  onCourseEdited: () => void;
}

function CoursesCardList({ courses, onCourseEdited }: CoursesCardListProps) {
  const navigate = useNavigate();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleDialogClose = (saved: boolean) => {
    setEditingCourse(null);
    if (saved) {
      onCourseEdited();
    }
  };

  return (
    <>
      {courses.map((course) => (
        <Card
          key={course.id}
          sx={{
            maxWidth: 400,
            margin: '20px 10px',
            boxShadow: '0 6px 6px -3px #0003, 0 10px 14px 1px #00000024, 0 4px 18px 3px #0000001f',
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" component="div">
                {course.titles.description}
              </Typography>
            }
          />
          <CardMedia
            component="img"
            image={course.iconUrl}
            alt={course.titles.description}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {course.titles.longDescription}
            </Typography>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '5px' }}
              onClick={() => navigate(`/courses/${course.id}`)}
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
        <CourseEditDialog
          course={editingCourse}
          open={true}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
}

export default CoursesCardList;
