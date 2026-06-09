import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Course } from '../types/course';
import type { Lesson } from '../types/lesson';
import { coursesService } from '../services/courses.service';
import './CoursePage.css';

const PAGE_SIZE_OPTIONS = [3, 5, 10];

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  // Resolver equivalent: pre-fetch the course before showing the page content.
  useEffect(() => {
    const controller = new AbortController();
    coursesService
      .findCourseById(courseId, controller.signal)
      .then(setCourse)
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          console.error(err);
        }
      });
    return () => controller.abort();
  }, [courseId]);

  // Debounce the search box (150ms, matches the Angular debounceTime).
  useEffect(() => {
    const handle = setTimeout(() => {
      setFilter(searchInput);
      setPageIndex(0);
    }, 150);
    return () => clearTimeout(handle);
  }, [searchInput]);

  // Load lessons whenever the query parameters change.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    coursesService
      .findLessons(
        courseId,
        filter,
        sortDirection,
        pageIndex,
        pageSize,
        controller.signal,
      )
      .then((result) => setLessons(result))
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          setLessons([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [courseId, filter, sortDirection, pageIndex, pageSize]);

  const totalPages = useMemo(() => {
    const count = course?.lessonsCount ?? 0;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [course, pageSize]);

  const toggleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPageIndex(0);
  };

  return (
    <div className="course">
      <h2>{course?.titles?.description}</h2>

      <img className="course-thumbnail" src={course?.iconUrl} alt="" />

      <div className="mat-form-field">
        <input
          placeholder="Search lessons"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {loading && (
        <div className="spinner-container">
          <div className="mat-spinner" role="progressbar" aria-label="Loading" />
        </div>
      )}

      <div className="mat-elevation-z8">
        <div className="mat-table lessons-table" role="table">
          <div className="mat-header-row" role="row">
            <div
              className="mat-header-cell sortable"
              role="columnheader"
              onClick={toggleSort}
            >
              #
              <span className="sort-arrow">
                {sortDirection === 'asc' ? '▲' : '▼'}
              </span>
            </div>
            <div className="mat-header-cell" role="columnheader">
              Description
            </div>
            <div className="mat-header-cell" role="columnheader">
              Duration
            </div>
          </div>

          {lessons.map((lesson) => (
            <div className="mat-row" role="row" key={lesson.id}>
              <div className="mat-cell" role="cell">
                {lesson.seqNo}
              </div>
              <div className="mat-cell description-cell" role="cell">
                {lesson.description}
              </div>
              <div className="mat-cell duration-cell" role="cell">
                {lesson.duration}
              </div>
            </div>
          ))}
        </div>

        <div className="mat-paginator">
          <span>Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            aria-label="Items per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <span>
            Page {pageIndex + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            aria-label="Previous page"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setPageIndex((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={pageIndex >= totalPages - 1}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
