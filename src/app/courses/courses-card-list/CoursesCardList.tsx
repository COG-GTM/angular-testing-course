import React, { useState, useCallback } from 'react';

interface Course {
  id: number;
  seqNo: number;
  titles: {
    description: string;
    longDescription?: string;
  };
  iconUrl: string;
  uploadedImageUrl: string;
  courseListIcon: string;
  category: string;
  lessonsCount: number;
}

interface CoursesCardListProps {
  courses: Course[];
  /** Called when a course edit dialog closes with changes. */
  onCourseEdited?: () => void;
  /**
   * Callback to open an edit dialog for a course.
   * Returns a Promise that resolves with the dialog result (or undefined if cancelled).
   * TODO: Wire up to actual dialog/modal system when integrating.
   */
  onEditCourse?: (course: Course) => Promise<unknown>;
}

/**
 * React equivalent of the Angular `CoursesCardListComponent`.
 *
 * Renders a list of course cards with a "VIEW COURSE" link
 * and an "EDIT" button that opens a dialog.
 * Uses `*ngFor` equivalent via `.map(...)`.
 * Replaces Angular Material dialog with a callback prop pattern.
 */
export const CoursesCardList: React.FC<CoursesCardListProps> = ({
  courses,
  onCourseEdited,
  onEditCourse,
}) => {
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  const handleEditCourse = useCallback(
    async (course: Course) => {
      setEditingCourseId(course.id);
      try {
        const result = await onEditCourse?.(course);
        if (result) {
          onCourseEdited?.();
        }
      } finally {
        setEditingCourseId(null);
      }
    },
    [onEditCourse, onCourseEdited],
  );

  return (
    <>
      {courses.map((course) => (
        <div key={course.id} className="course-card mat-elevation-z10">
          <div className="card-header">
            <h3 className="card-title">{course.titles.description}</h3>
          </div>

          <img className="card-image" src={course.iconUrl} alt={course.titles.description} />

          <div className="card-content">
            <p>{course.titles.longDescription}</p>
          </div>

          <div className="course-actions">
            {/* TODO: Replace <a> with React Router <Link> when routing is wired up */}
            <a href={`/courses/${course.id}`} className="btn btn-primary">
              VIEW COURSE
            </a>
            <button
              className="btn btn-accent"
              onClick={() => handleEditCourse(course)}
              disabled={editingCourseId === course.id}
            >
              EDIT
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
