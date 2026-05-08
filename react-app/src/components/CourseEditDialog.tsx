import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Course } from '../models/course';
import { saveCourse } from '../services/api';

interface CourseEditDialogProps {
  course: Course;
  open: boolean;
  onClose: (saved: boolean) => void;
}

function CourseEditDialog({ course, open, onClose }: CourseEditDialogProps) {
  const [description, setDescription] = useState(course.titles.description);
  const [category, setCategory] = useState(course.category);
  const [releasedAt, setReleasedAt] = useState<Dayjs | null>(dayjs());
  const [longDescription, setLongDescription] = useState(
    course.titles.longDescription || ''
  );

  const handleSave = async () => {
    await saveCourse(course.id, {
      titles: { description, longDescription },
    });
    onClose(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={() => onClose(false)} disableEscapeKeyDown>
        <DialogTitle>{course.titles.description}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Select category</InputLabel>
            <Select
              value={category}
              label="Select category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="BEGINNER">Beginner</MenuItem>
              <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
              <MenuItem value="ADVANCED">Advanced</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            value={releasedAt}
            onChange={(val) => setReleasedAt(val)}
            slotProps={{
              textField: { fullWidth: true, margin: 'normal' },
            }}
          />
          <TextField
            fullWidth
            label="Description"
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => onClose(false)}>
            Close
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default CourseEditDialog;
