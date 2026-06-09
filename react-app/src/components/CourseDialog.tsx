import { useState } from 'react';
import type { Course } from '../types/course';
import { coursesService } from '../services/courses.service';

interface CourseDialogProps {
  course: Course;
  onClose: (saved?: boolean) => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CourseDialog({ course, onClose }: CourseDialogProps) {
  const [description, setDescription] = useState(course.titles.description);
  const [category, setCategory] = useState(course.category);
  const [releasedAt, setReleasedAt] = useState(todayIso());
  const [longDescription, setLongDescription] = useState(
    course.titles.longDescription ?? '',
  );

  const save = async () => {
    await coursesService.saveCourse(course.id, {
      titles: { description, longDescription },
    });
    onClose(true);
  };

  return (
    <div
      className="mat-dialog-overlay"
      onClick={() => onClose()}
      role="presentation"
    >
      <div
        className="mat-dialog-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Edit course"
      >
        <h2 className="mat-dialog-title">{course.titles.description}</h2>

        <div className="mat-dialog-content">
          <div className="mat-form-field">
            <label htmlFor="description">Course Description</label>
            <input
              id="description"
              placeholder="Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mat-form-field">
            <label htmlFor="category">Select category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div className="mat-form-field">
            <label htmlFor="releasedAt">Released At</label>
            <input
              id="releasedAt"
              type="date"
              value={releasedAt}
              onChange={(e) => setReleasedAt(e.target.value)}
            />
          </div>

          <div className="mat-form-field">
            <label htmlFor="longDescription">Description</label>
            <textarea
              id="longDescription"
              placeholder="Description"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mat-dialog-actions">
          <button className="mat-raised-button basic" onClick={() => onClose()}>
            Close
          </button>
          <button className="mat-raised-button primary" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
