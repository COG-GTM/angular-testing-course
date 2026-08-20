import { useState } from 'react';
import type { Course } from '../types/course';
import { useCoursesService } from '../context/CoursesServiceContext';
import './CourseDialog.scss';

export interface CourseDialogValue {
  description: string;
  category: string;
  releasedAt: string;
  longDescription: string;
}

interface CourseDialogProps {
  course: Course;
  onClose: (value?: CourseDialogValue) => void;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function CourseDialog({ course, onClose }: CourseDialogProps) {
  const coursesService = useCoursesService();

  const [form, setForm] = useState<CourseDialogValue>({
    description: course.titles.description,
    category: course.category,
    releasedAt: today(),
    longDescription: course.titles.longDescription ?? '',
  });

  const update = (changes: Partial<CourseDialogValue>) =>
    setForm((current) => ({ ...current, ...changes }));

  const save = async () => {
    await coursesService.saveCourse(course.id, {
      titles: {
        description: form.description,
        longDescription: form.longDescription,
      },
    });

    onClose(form);
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog course-dialog" role="dialog" aria-modal="true">
        <h2 className="dialog-title">{course.titles.description}</h2>

        <div className="dialog-content">
          <div className="form-field">
            <label htmlFor="course-description">Course Description</label>
            <input
              id="course-description"
              value={form.description}
              onChange={(event) => update({ description: event.target.value })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="course-category">Select category</label>
            <select
              id="course-category"
              value={form.category}
              onChange={(event) => update({ category: event.target.value })}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="course-released-at">Released at</label>
            <input
              id="course-released-at"
              type="date"
              value={form.releasedAt}
              onChange={(event) => update({ releasedAt: event.target.value })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="course-long-description">Description</label>
            <textarea
              id="course-long-description"
              value={form.longDescription}
              onChange={(event) => update({ longDescription: event.target.value })}
            />
          </div>
        </div>

        <div className="dialog-actions">
          <button type="button" className="button" onClick={() => onClose()}>
            Close
          </button>

          <button type="button" className="button button-primary" onClick={() => void save()}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
