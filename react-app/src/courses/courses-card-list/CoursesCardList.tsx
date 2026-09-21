import { Course } from '../model/course';

export interface CoursesCardListProps {
  courses: Course[];
  onCourseEdited?: () => void;
}

export const CoursesCardList = (props: CoursesCardListProps) => {
  void props;
  return null;
};
