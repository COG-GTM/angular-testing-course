import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Course } from '../models/course';
import { saveCourse } from '../services/courses-service';

interface CourseDialogProps {
  open: boolean;
  course: Course;
  onClose: () => void;
  onSave: () => void;
}

interface FormValues {
  description: string;
  category: string;
  releasedAt: Dayjs;
  longDescription: string;
}

function CourseDialog({ open, course, onClose, onSave }: CourseDialogProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      description: course.titles.description,
      category: course.category,
      releasedAt: dayjs(),
      longDescription: course.titles.longDescription || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await saveCourse(course.id, {
        titles: {
          description: data.description,
          longDescription: data.longDescription,
        },
      });
      onSave();
    } catch (err) {
      console.error('Failed to save course', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown maxWidth="sm" fullWidth>
      <DialogTitle>{course.titles.description}</DialogTitle>
      <DialogContent>
        <form id="course-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Course Description"
                fullWidth
                margin="normal"
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select {...field} label="Category">
                  <MenuItem value="BEGINNER">Beginner</MenuItem>
                  <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem value="ADVANCED">Advanced</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="releasedAt"
            control={control}
            rules={{ required: 'Release date is required' }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Release Date"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'normal',
                      error: !!errors.releasedAt,
                      helperText: errors.releasedAt?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
          <Controller
            name="longDescription"
            control={control}
            rules={{ required: 'Long description is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                error={!!errors.longDescription}
                helperText={errors.longDescription?.message}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
        <Button type="submit" form="course-form" variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CourseDialog;
