import { useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';
import FilledInput from '@mui/material/FilledInput';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import type { Course } from '../model/course';
import type { SortOrder } from '../services';
import { LessonsPaginator, type PageEvent } from './LessonsPaginator';
import { useLessons } from './useLessons';
import './CoursePage.css';

export const SEARCH_DEBOUNCE_MS = 150;
const PAGE_SIZE_OPTIONS = [3, 5, 10];

interface LessonsQuery {
  sortDirection: SortOrder;
  pageIndex: number;
  pageSize: number;
}

const searchInputSx = {
  width: 212,
  backgroundColor: '#f5f5f5',
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  fontFamily: 'Roboto, sans-serif',
  fontSize: 16,
  letterSpacing: '0.5px',
  lineHeight: '24px',
  color: 'rgba(0, 0, 0, 0.87)',
  '&:hover': { backgroundColor: '#ebebeb' },
  '&.Mui-focused': { backgroundColor: '#e1e1e1' },
  '&::before': { borderBottomColor: 'rgba(0, 0, 0, 0.42)' },
  '& .MuiFilledInput-input': {
    padding: '16px',
    height: 24,
    lineHeight: '24px',
    '&::placeholder': { color: 'rgba(0, 0, 0, 0.6)', opacity: 1 },
  },
} as const;

const sortLabelSx = {
  color: 'rgba(0, 0, 0, 0.87)',
  '&.Mui-active': { color: 'rgba(0, 0, 0, 0.87)' },
  '&:hover, &:focus': { color: 'rgba(0, 0, 0, 0.87)' },
  '& .MuiTableSortLabel-icon': {
    fontSize: 16,
    margin: '0 0 0 6px',
    color: '#757575 !important',
    strokeWidth: 0.6,
    stroke: 'currentColor',
    opacity: 1,
  },
} as const;

/** Port of course.component.{ts,html,css}: course header, lessons search, sortable + paginated lessons table. */
export function CoursePage() {
  const course = useLoaderData() as Course;
  return <CourseLessons key={course.id} course={course} />;
}

function CourseLessons({ course }: { course: Course }) {
  const { lessons, loading, loadLessons } = useLessons();
  const [query, setQuery] = useState<LessonsQuery>({ sortDirection: 'asc', pageIndex: 0, pageSize: 3 });
  const queryRef = useRef(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    loadLessons(course.id, '', 'asc', 0, 3);
  }, [course.id, loadLessons]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // Port of `loadLessonsPage()`: the filter is always the input's current value.
  const loadLessonsPage = (changes: Partial<LessonsQuery>) => {
    const next = { ...queryRef.current, ...changes };
    queryRef.current = next;
    setQuery(next);
    loadLessons(course.id, inputRef.current?.value ?? '', next.sortDirection, next.pageIndex, next.pageSize);
  };

  // keyup -> debounceTime(150) -> page 0 + reload. Legacy `distinctUntilChanged()` compares KeyboardEvent
  // objects, which are always distinct, so every debounced keyup reloads even when the value is unchanged.
  const onSearchKeyUp = () => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadLessonsPage({ pageIndex: 0 }), SEARCH_DEBOUNCE_MS);
  };

  // matSortDisableClear: the active column only toggles asc <-> desc; a sort change resets to page 0.
  const onSortChange = () => {
    loadLessonsPage({ sortDirection: queryRef.current.sortDirection === 'asc' ? 'desc' : 'asc', pageIndex: 0 });
  };

  const onPage = ({ pageIndex, pageSize }: PageEvent) => loadLessonsPage({ pageIndex, pageSize });

  return (
    <div className="course course-page">
      <h2>{course?.titles?.description}</h2>

      <img className="course-thumbnail" src={course?.iconUrl} alt="" />

      <div className="search-field">
        <FilledInput inputRef={inputRef} placeholder="Search lessons" hiddenLabel sx={searchInputSx} onKeyUp={onSearchKeyUp} />
      </div>

      {loading && (
        <div className="spinner-container">
          <CircularProgress className="lessons-spinner" size={100} thickness={4.4} aria-label="Loading lessons" />
        </div>
      )}

      <Paper className="mat-elevation-z8" elevation={8} square>
        <div className="lessons-table" role="table" aria-busy={loading}>
          <div className="lessons-header-row" role="row">
            <div
              className="lessons-header-cell"
              role="columnheader"
              aria-sort={query.sortDirection === 'asc' ? 'ascending' : 'descending'}
            >
              <TableSortLabel active direction={query.sortDirection} onClick={onSortChange} sx={sortLabelSx}>
                #
              </TableSortLabel>
            </div>
            <div className="lessons-header-cell" role="columnheader">
              Description
            </div>
            <div className="lessons-header-cell" role="columnheader">
              Duration
            </div>
          </div>

          {lessons.map((lesson) => (
            <div className="lessons-row" role="row" key={lesson.id}>
              <div className="lessons-cell" role="cell">
                {lesson.seqNo}
              </div>
              <div className="lessons-cell description-cell" role="cell">
                {lesson.description}
              </div>
              <div className="lessons-cell duration-cell" role="cell">
                {lesson.duration}
              </div>
            </div>
          ))}
        </div>

        <LessonsPaginator
          length={course?.lessonsCount ?? 0}
          pageIndex={query.pageIndex}
          pageSize={query.pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPage={onPage}
        />
      </Paper>
    </div>
  );
}
