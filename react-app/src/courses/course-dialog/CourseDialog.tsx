import { useRef, useState, type FocusEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import type { Course } from '../model/course';
import { useCoursesService } from '../services';
import { defaultRaisedButtonSx, matFormFieldSx } from './matStyles';

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

const CATEGORIES = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
] as const;

type Field = 'description' | 'category' | 'releasedAt' | 'longDescription';

/**
 * Port of course-dialog.component.{ts,html,css}.
 * Opened with MatDialog `disableClose: true` + `autoFocus: true`: no backdrop/Escape close, first field focused.
 */
export function CourseDialog({ open, course, onClose }: CourseDialogProps) {
  const coursesService = useCoursesService();

  const [description, setDescription] = useState(course.titles.description);
  const [category, setCategory] = useState(course.category);
  const [releasedAt, setReleasedAt] = useState<Dayjs | null>(() => dayjs());
  const [longDescription, setLongDescription] = useState(course.titles.longDescription ?? '');
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  // Validators.required: shown in the error colour once the control was touched (Angular's default ErrorStateMatcher).
  const invalid: Record<Field, boolean> = {
    description: !description,
    category: !category,
    releasedAt: !releasedAt || !releasedAt.isValid(),
    longDescription: !longDescription,
  };
  const showError = (field: Field) => !!touched[field] && invalid[field];
  const touch = (field: Field) => (_e?: FocusEvent) => setTouched((t) => (t[field] ? t : { ...t, [field]: true }));

  const save = async () => {
    // Legacy parity: Save is not blocked by an invalid form and only titles are persisted.
    const value: CourseDialogResult = {
      description,
      category,
      releasedAt: releasedAt?.isValid() ? releasedAt.toISOString() : '',
      longDescription,
    };
    try {
      await coursesService.saveCourse(course.id, { titles: { description, longDescription } });
    } catch (error) {
      // Angular subscribed without an error handler: the dialog simply stays open.
      console.error(error);
      return;
    }
    onClose(value);
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth={false}
      aria-labelledby="course-dialog-title"
      slotProps={{
        paper: { className: 'course-dialog', sx: { m: 0, maxWidth: '80vw', borderRadius: '4px' } },
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.32)' } },
        // MatDialog `autoFocus: true`: the focus trap focuses the dialog paper on open, so move focus to the first field.
        transition: { onEntered: () => descriptionRef.current?.focus() },
      }}
    >
      <DialogTitle
        id="course-dialog-title"
        sx={{ p: '17px 24px 9px', mb: '1px', fontSize: 20, fontWeight: 400, lineHeight: '32px', letterSpacing: '0.0125em' }}
      >
        {course.titles.description}
      </DialogTitle>

      <DialogContent sx={{ p: '0 24px 20px', maxHeight: '65vh' }}>
        <TextField
          variant="filled"
          hiddenLabel
          fullWidth
          required
          autoFocus
          inputRef={descriptionRef}
          placeholder="Course Description"
          value={description}
          error={showError('description')}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={touch('description')}
          sx={matFormFieldSx}
          slotProps={{ htmlInput: { 'aria-label': 'Course Description' } }}
        />

        <TextField
          select
          variant="filled"
          hiddenLabel
          fullWidth
          required
          value={category}
          error={showError('category')}
          onChange={(e) => setCategory(e.target.value)}
          onBlur={touch('category')}
          sx={matFormFieldSx}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (v) =>
                CATEGORIES.find((c) => c.value === v)?.label ?? <span className="placeholder">Select category</span>,
              SelectDisplayProps: { 'aria-label': 'Select category' } as object,
            },
          }}
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>

        <DesktopDatePicker
          value={releasedAt}
          onChange={(v) => setReleasedAt(v)}
          format="M/D/YYYY"
          dayOfWeekFormatter={(day) => day.format('dd')}
          enableAccessibleFieldDOMStructure={false}
          slotProps={{
            textField: {
              variant: 'filled',
              hiddenLabel: true,
              fullWidth: true,
              required: true,
              error: showError('releasedAt'),
              onBlur: touch('releasedAt'),
              sx: matFormFieldSx,
              inputProps: { 'aria-label': 'Release date' },
            },
            openPickerButton: { 'aria-label': 'Open calendar' },
            calendarHeader: { format: 'MMM YYYY', sx: { textTransform: 'uppercase' } },
          }}
        />

        <TextField
          variant="filled"
          hiddenLabel
          fullWidth
          required
          multiline
          rows={2}
          placeholder="Description"
          value={longDescription}
          error={showError('longDescription')}
          onChange={(e) => setLongDescription(e.target.value)}
          onBlur={touch('longDescription')}
          sx={matFormFieldSx}
          slotProps={{
            // The legacy `textarea { height: 100px }` rule loses to Angular Material's own textarea styles, so legacy
            // renders the default 2 rows (48px); keep that rendering and its vertical resize handle.
            htmlInput: { 'aria-label': 'Description' },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-start', p: '8px', minHeight: 52, boxSizing: 'border-box', '& > :not(style) ~ :not(style)': { ml: '8px' } }}>
        <Button variant="contained" sx={defaultRaisedButtonSx} onClick={() => onClose()}>
          Close
        </Button>

        {/* Legacy template uses `primary="primary"` (not `color`), so Save is a default-coloured raised button. */}
        <Button variant="contained" sx={defaultRaisedButtonSx} onClick={save}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
