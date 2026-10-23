import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import type { Course } from '../model/course';

/** Form value the dialog closes with after a successful save (Angular: `dialogRef.close(this.form.value)`). */
export interface CourseDialogResult {
  description: string;
  category: string;
  /** ISO date string. */
  releasedAt: string;
  longDescription: string;
}

export interface CourseDialogProps {
  open: boolean;
  course: Course;
  /** Called with the form value after `saveCourse` resolves, or with no argument on Close. */
  onClose: (result?: CourseDialogResult) => void;
}

// Placeholder owned by W2-B: port of course-dialog.component.html.
export function CourseDialog({ open, course, onClose }: CourseDialogProps) {
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>{course.titles.description}</DialogTitle>
      <DialogActions>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
