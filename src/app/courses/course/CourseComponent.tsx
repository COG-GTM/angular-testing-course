import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * React port of Angular CourseComponent
 *
 * Original Angular component: course.component.ts
 * - @Input: none (uses route resolver data)
 * - @Output: none
 * - Services: CoursesService (HTTP), LessonsDataSource (CDK DataSource)
 * - Lifecycle: ngOnInit, ngAfterViewInit → useEffect
 */

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

interface Lesson {
  id: number;
  description: string;
  duration: string;
  seqNo: number;
  courseId: number;
}

interface CourseComponentProps {
  /** The course data, typically from a route resolver */
  course: Course;
  /** Function to load lessons from the API */
  loadLessons: (
    courseId: number,
    filter: string,
    sortDirection: string,
    pageIndex: number,
    pageSize: number
  ) => Promise<Lesson[]>;
}

type SortDirection = 'asc' | 'desc';

export const CourseComponent: React.FC<CourseComponentProps> = ({
  course,
  loadLessons,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sortDirectionRef = useRef<SortDirection>(sortDirection);
  const pageSizeRef = useRef<number>(pageSize);
  const requestIdRef = useRef(0);

  const fetchLessons = useCallback(
    async (filter: string, sort: SortDirection, page: number, size: number) => {
      const currentRequestId = ++requestIdRef.current;
      setLoading(true);
      try {
        const data = await loadLessons(course.id, filter, sort, page, size);
        if (currentRequestId !== requestIdRef.current) return;
        setLessons(data);
      } catch {
        if (currentRequestId !== requestIdRef.current) return;
        setLessons([]);
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [course.id, loadLessons]
  );

  // Reset UI state and re-fetch when course changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setSearchFilter('');
    setSortDirection('asc');
    sortDirectionRef.current = 'asc';
    setPageIndex(0);
    setPageSize(3);
    pageSizeRef.current = 3;
    fetchLessons('', 'asc', 0, 3);
  }, [fetchLessons]);

  // Replaces ngAfterViewInit — debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchFilter(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setPageIndex(0);
      fetchLessons(value, sortDirectionRef.current, 0, pageSizeRef.current);
    }, 150);
  };

  // Cleanup debounce timer on unmount (replaces ngOnDestroy)
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleSortChange = () => {
    const newDirection: SortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    sortDirectionRef.current = newDirection;
    setPageIndex(0);
    fetchLessons(searchFilter, newDirection, 0, pageSize);
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
    fetchLessons(searchFilter, sortDirection, newPageIndex, pageSize);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    pageSizeRef.current = newSize;
    setPageIndex(0);
    fetchLessons(searchFilter, sortDirection, 0, newSize);
  };

  const totalPages = Math.ceil(course.lessonsCount / pageSize);

  return (
    <div className="course" style={{ textAlign: 'center', maxWidth: 390, margin: '0 auto' }}>
      <h2>{course.titles?.description}</h2>

      <img
        className="course-thumbnail"
        src={course.iconUrl}
        alt={course.titles?.description}
        style={{ width: 150, margin: '20px auto', display: 'block' }}
      />

      <div className="search-field" style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search lessons"
          value={searchFilter}
          onChange={handleSearchChange}
          style={{ padding: '8px 12px', width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      {loading && (
        <div className="spinner-container" style={{ height: 360, width: 390, position: 'relative' }}>
          <div style={{ margin: '130px auto 0 auto', textAlign: 'center' }}>Loading...</div>
        </div>
      )}

      <div style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)', paddingBottom: 5 }}>
        <table className="lessons-table" style={{ width: '100%', minHeight: 360, marginTop: 10, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th
                onClick={handleSortChange}
                style={{ cursor: 'pointer', padding: '8px', textAlign: 'left' }}
              >
                # {sortDirection === 'asc' ? '▲' : '▼'}
              </th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td style={{ padding: '8px' }}>{lesson.seqNo}</td>
                <td style={{ padding: '10px 0', textAlign: 'left' }}>{lesson.description}</td>
                <td style={{ textAlign: 'center' }}>{lesson.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="paginator" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', marginBottom: 10 }}>
          <span>
            Page {pageIndex + 1} of {totalPages || 1}
          </span>
          <div>
            <button
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex >= totalPages - 1}
              style={{ marginLeft: 4 }}
            >
              Next
            </button>
          </div>
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>
    </div>
  );
};
