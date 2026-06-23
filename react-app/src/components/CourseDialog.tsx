import { useState } from 'react';
import type { Moment } from 'moment';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Course } from '../model/course';
import { saveCourse } from '../services/coursesService';
import './CourseDialog.css';

interface CourseDialogProps {
  course: Course;
  onClose: (saved: boolean) => void;
}

export default function CourseDialog({ course, onClose }: CourseDialogProps) {
  const [description, setDescription] = useState(course.titles.description);
  const [category, setCategory] = useState(course.category);
  const [releasedAt, setReleasedAt] = useState<Moment | null>(moment());
  const [longDescription, setLongDescription] = useState(
    course.titles.longDescription ?? '',
  );

  const save = async () => {
    await saveCourse(course.id, {
      titles: { description, longDescription },
    });
    onClose(true);
  };

  return (
    <Dialog
      open
      disableEscapeKeyDown
      onClose={() => undefined}
      PaperProps={{ sx: { width: 340 } }}
    >
      <DialogTitle>{course.titles.description}</DialogTitle>

      <DialogContent>
        <TextField
          className="dialog-field"
          variant="filled"
          hiddenLabel
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          className="dialog-field"
          variant="filled"
          select
          hiddenLabel
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="BEGINNER">Beginner</MenuItem>
          <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
          <MenuItem value="ADVANCED">Advanced</MenuItem>
        </TextField>

        <DatePicker
          className="dialog-field"
          value={releasedAt}
          onChange={(value) => setReleasedAt(value)}
          slotProps={{
            textField: { variant: 'filled', fullWidth: true, hiddenLabel: true },
          }}
        />

        <TextField
          className="dialog-field"
          variant="filled"
          hiddenLabel
          placeholder="Description"
          multiline
          minRows={4}
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="inherit"
          className="dialog-button"
          onClick={() => onClose(false)}
        >
          Close
        </Button>

        <Button
          variant="contained"
          color="inherit"
          className="dialog-button"
          onClick={save}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
