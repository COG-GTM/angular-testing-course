import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import type { Course } from '../types/course';
import { saveCourse } from '../services/coursesApi';

interface CourseDialogProps {
  course: Course;
  onClose: (saved: boolean) => void;
}

const CATEGORIES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export function CourseDialog({ course, onClose }: CourseDialogProps) {
  const [description, setDescription] = useState(course.titles.description);
  const [longDescription, setLongDescription] = useState(
    course.titles.longDescription ?? '',
  );
  const [category, setCategory] = useState(course.category);
  const [releasedAt, setReleasedAt] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const changes: Partial<Course> = {
        titles: {
          description,
          longDescription,
        },
        category,
      };
      await saveCourse(course.id, changes);
      onClose(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={() => onClose(false)} fullWidth maxWidth="sm">
      <DialogTitle>Edit Course</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Category"
          fullWidth
          select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Released At"
          type="date"
          fullWidth
          value={releasedAt}
          onChange={(e) => setReleasedAt(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          margin="dense"
          label="Long Description"
          fullWidth
          multiline
          minRows={3}
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={saving}>
          Close
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
