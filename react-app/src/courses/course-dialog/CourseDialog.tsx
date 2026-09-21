import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Course } from '../model/course';
import { useCoursesService } from '../services/CoursesServiceContext';
import './CourseDialog.css';

export interface CourseDialogProps {
  course: Course;
  open: boolean;
  onClose: (result?: unknown) => void;
}

export interface CourseDialogFormValue {
  description: string;
  category: string;
  releasedAt: string;
  longDescription: string;
}

export const CourseDialog = ({ course, open, onClose }: CourseDialogProps) => {
  const coursesService = useCoursesService();
  const [form, setForm] = useState<CourseDialogFormValue>({
    description: course.titles.description,
    category: course.category,
    releasedAt: new Date().toISOString().slice(0, 10),
    longDescription: course.titles.longDescription ?? '',
  });

  const save = async () => {
    await coursesService.saveCourse(course.id, {
      titles: {
        description: form.description,
        longDescription: form.longDescription,
      },
    });
    onClose(form);
  };

  return (
    <Dialog open={open} className="course-dialog" disableEscapeKeyDown onClose={() => {}}>
      <DialogTitle>{course.titles.description}</DialogTitle>
      <DialogContent>
        <TextField
          className="course-dialog-field"
          label="Course Description"
          required
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControl className="course-dialog-field" fullWidth margin="normal">
          <InputLabel id="course-category-label">Select category</InputLabel>
          <Select
            labelId="course-category-label"
            label="Select category"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            <MenuItem value="BEGINNER">Beginner</MenuItem>
            <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
            <MenuItem value="ADVANCED">Advanced</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className="course-dialog-field"
          type="date"
          label="Released at"
          InputLabelProps={{ shrink: true }}
          value={form.releasedAt}
          onChange={(event) => setForm({ ...form, releasedAt: event.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          className="course-dialog-field"
          multiline
          minRows={4}
          label="Description"
          value={form.longDescription}
          onChange={(event) => setForm({ ...form, longDescription: event.target.value })}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => onClose()}>
          Close
        </Button>
        <Button variant="contained" color="primary" onClick={save}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
