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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { Course } from '../models/course';
import { saveCourse } from '../services/courses.service';
import './CoursesCardList.css';

interface Props {
  courses: Course[];
  onCourseEdited: () => void;
}

export function CoursesCardList({ courses, onCourseEdited }: Props) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    longDescription: '',
  });

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      description: course.titles.description,
      category: course.category,
      longDescription: course.titles.longDescription || '',
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCourse(null);
  };

  const handleSave = async () => {
    if (!editingCourse) return;
    await saveCourse(editingCourse.id, {
      titles: {
        description: formData.description,
        longDescription: formData.longDescription,
      },
      category: formData.category,
    });
    setDialogOpen(false);
    setEditingCourse(null);
    onCourseEdited();
  };

  return (
    <>
      {courses.map((course) => (
        <Card key={course.id} className="course-card" elevation={10}>
          <CardHeader
            title={course.titles.description}
            titleTypographyProps={{ sx: { fontSize: '20px', fontWeight: 400 } }}
            sx={{ pb: 0 }}
          />
          <CardMedia
            component="img"
            image={course.iconUrl}
            alt={course.titles.description}
          />
          <CardContent>
            <Typography variant="body2">{course.titles.longDescription}</Typography>
          </CardContent>
          <CardActions className="course-actions">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              VIEW COURSE
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEdit(course)}
            >
              EDIT
            </Button>
          </CardActions>
        </Card>
      ))}

      <Dialog open={dialogOpen} onClose={() => {}}>
        {editingCourse && (
          <>
            <DialogTitle>{editingCourse.titles.description}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Course Description"
                fullWidth
                variant="standard"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <FormControl fullWidth margin="dense" variant="standard">
                <InputLabel>Select category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e: SelectChangeEvent) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <MenuItem value="BEGINNER">Beginner</MenuItem>
                  <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem value="ADVANCED">Advanced</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                variant="standard"
                multiline
                rows={4}
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={handleSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
