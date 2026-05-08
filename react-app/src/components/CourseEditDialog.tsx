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
      category,
    });
    onClose(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={() => onClose(false)} disableEscapeKeyDown maxWidth="xs" fullWidth slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.32)' } } }}>
        <DialogTitle>{course.titles.description}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            InputProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.04)', borderTopLeftRadius: 4, borderTopRightRadius: 4, px: 1.5, pt: 1 } }}
          />
          <FormControl fullWidth margin="normal" variant="standard">
            <Select
              value={category}
              displayEmpty
              onChange={(e) => setCategory(e.target.value)}
              sx={{ backgroundColor: 'rgba(0,0,0,0.04)', borderTopLeftRadius: 4, borderTopRightRadius: 4, px: 1.5, pt: 1 }}
            >
              <MenuItem value="BEGINNER">Beginner</MenuItem>
              <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
              <MenuItem value="ADVANCED">Advanced</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            value={releasedAt}
            onChange={(val) => setReleasedAt(val)}
            format="M/D/YYYY"
            slotProps={{
              textField: { fullWidth: true, margin: 'normal', variant: 'standard', InputProps: { sx: { backgroundColor: 'rgba(0,0,0,0.04)', borderTopLeftRadius: 4, borderTopRightRadius: 4, px: 1.5, pt: 1 } } },
            }}
          />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Description"
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            InputProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.04)', borderTopLeftRadius: 4, borderTopRightRadius: 4, px: 1.5, pt: 1 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={() => onClose(false)}>
            Close
          </Button>
          <Button variant="contained" color="inherit" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default CourseEditDialog;
