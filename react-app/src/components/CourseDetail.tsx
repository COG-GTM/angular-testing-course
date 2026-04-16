import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Course } from '../models/course';
import { Lesson } from '../models/lesson';
import { findCourseById, findLessons } from '../services/courses.service';

function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 3;

  useEffect(() => {
    if (id) {
      findCourseById(Number(id)).then(setCourse).catch(console.error);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    if (id) {
      findLessons(Number(id), searchTerm, 'asc', page, pageSize)
        .then((data) => { if (!cancelled) setLessons(data); })
        .catch(console.error);
    }
    return () => { cancelled = true; };
  }, [id, searchTerm, page]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="course-detail">
      <div className="course-header">
        <img src={course.iconUrl} alt={course.titles.description} className="course-icon-large" />
        <div>
          <h2>{course.titles.description}</h2>
          {course.titles.longDescription && <p>{course.titles.longDescription}</p>}
        </div>
      </div>
      <div className="lessons-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search lessons"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
          />
        </div>
        <table className="mat-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td>{lesson.seqNo}</td>
                <td>{lesson.description}</td>
                <td>{lesson.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page + 1}</span>
          <button disabled={lessons.length < pageSize} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
