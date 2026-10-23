import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import type { Course } from '../model/course';
import { CourseDialog, type CourseDialogResult } from '../course-dialog';
import { raisedButtonSx } from '../course-dialog/matStyles';
import './CoursesCardList.css';

export interface CoursesCardListProps {
  courses: Course[];
  /** Called after the edit dialog closed with a saved result (Angular: `courseEdited` output). */
  onCourseEdited?: () => void;
}

interface EditState {
  course: Course;
  open: boolean;
  /** Bumped on every EDIT so each opening gets a fresh form (Angular creates a new dialog component). */
  instance: number;
}

/** Port of courses-card-list.component.{ts,html,css}. */
export function CoursesCardList({ courses, onCourseEdited }: CoursesCardListProps) {
  const navigate = useNavigate();
  const [edit, setEdit] = useState<EditState | null>(null);

  const editCourse = (course: Course) => {
    setEdit((prev) => ({ course, open: true, instance: (prev?.instance ?? 0) + 1 }));
  };

  const handleClose = (result?: CourseDialogResult) => {
    setEdit((prev) => (prev ? { ...prev, open: false } : prev));
    if (result) {
      onCourseEdited?.();
    }
  };

  return (
    <>
      {courses.map((course) => (
        <Card
          key={course.id}
          component="section"
          className="course-card mat-elevation-z10"
          sx={{ color: '#000' }}
          aria-label={course.titles.description}
        >
          <div className="course-card-header">
            <div className="course-card-title">{course.titles.description}</div>
          </div>

          {/* Decorative: the card title above already names the course. */}
          <img className="course-card-image" src={course.iconUrl} alt="" />

          <div className="course-card-content">
            <p>{course.titles.longDescription}</p>
          </div>

          <div className="course-actions">
            <Button variant="contained" color="primary" sx={raisedButtonSx} onClick={() => navigate(`/courses/${course.id}`)}>
              VIEW COURSE
            </Button>

            <Button variant="contained" color="secondary" sx={raisedButtonSx} onClick={() => editCourse(course)}>
              EDIT
            </Button>
          </div>
        </Card>
      ))}

      {edit && <CourseDialog key={edit.instance} open={edit.open} course={edit.course} onClose={handleClose} />}
    </>
  );
}
