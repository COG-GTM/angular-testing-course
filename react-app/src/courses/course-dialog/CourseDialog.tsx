import { Course } from '../model/course';

export interface CourseDialogProps {
  course: Course;
  open: boolean;
  onClose: (result?: unknown) => void;
}

export const CourseDialog = (props: CourseDialogProps) => {
  void props;
  return null;
};
