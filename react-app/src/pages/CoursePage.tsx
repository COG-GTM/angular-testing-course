import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import { useLessons } from '../hooks/useLessons';
import { Paginator } from '../components/Paginator';
import { Spinner } from '../components/Spinner';
import './CoursePage.scss';

const DEBOUNCE_MS = 150;

export function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);
  const course = useCourse(courseId);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter(search);
      setPageIndex(0);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [search]);

  const { lessons, loading } = useLessons({
    courseId,
    filter,
    sortDirection,
    pageIndex,
    pageSize,
  });

  const toggleSort = () => {
    setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    setPageIndex(0);
  };

  return (
    <div className="course">
      <h2>{course?.titles?.description}</h2>

      {course && <img className="course-thumbnail" src={course.iconUrl} alt={course.titles.description} />}

      <div className="form-field">
        <label htmlFor="search-lessons">Search lessons</label>
        <input
          id="search-lessons"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && (
        <div className="spinner-container">
          <Spinner />
        </div>
      )}

      <div className="elevation-z8">
        <div className="table lessons-table">
          <div className="header-row">
            <div className="header-cell">
              <button type="button" className="sort-header" onClick={toggleSort}>
                #<span className="sort-arrow">{sortDirection === 'asc' ? '▲' : '▼'}</span>
              </button>
            </div>
            <div className="header-cell">Description</div>
            <div className="header-cell">Duration</div>
          </div>

          {lessons.map((lesson) => (
            <div className="row" key={lesson.id}>
              <div className="cell">{lesson.seqNo}</div>
              <div className="cell description-cell">{lesson.description}</div>
              <div className="cell duration-cell">{lesson.duration}</div>
            </div>
          ))}
        </div>

        <Paginator
          length={course?.lessonsCount ?? 0}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageSizeOptions={[3, 5, 10]}
          onPageChange={(nextPageIndex, nextPageSize) => {
            setPageIndex(nextPageIndex);
            setPageSize(nextPageSize);
          }}
        />
      </div>
    </div>
  );
}
