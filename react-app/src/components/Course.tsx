import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import type { Course as CourseModel } from '../model/course';
import type { Lesson } from '../model/lesson';
import { findCourseById, findLessons } from '../services/coursesService';
import './Course.css';

export default function Course() {
  const { id } = useParams();
  const courseId = Number(id);

  const [course, setCourse] = useState<CourseModel | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const lastFilter = useRef('');

  useEffect(() => {
    findCourseById(courseId).then(setCourse);
  }, [courseId]);

  // Debounce the search input (150ms) and reset to the first page, mirroring
  // the Angular debounceTime(150) + distinctUntilChanged + pageIndex = 0 flow.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (filter !== lastFilter.current) {
        lastFilter.current = filter;
        setPageIndex(0);
        setDebouncedFilter(filter);
      }
    }, 150);
    return () => clearTimeout(handle);
  }, [filter]);

  const loadLessons = useCallback(async () => {
    if (!course) {
      return;
    }
    setLoading(true);
    try {
      const result = await findLessons(
        course.id,
        debouncedFilter,
        sortDirection,
        pageIndex,
        pageSize,
      );
      setLessons(result);
    } catch {
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [course, debouncedFilter, sortDirection, pageIndex, pageSize]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const handleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPageIndex(0);
  };

  return (
    <div className="course">
      <h2>{course?.titles?.description}</h2>

      <img className="course-thumbnail" src={course?.iconUrl} />

      <TextField
        className="search-field"
        variant="filled"
        label="Search lessons"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {loading && (
        <div className="spinner-container">
          <CircularProgress className="spinner" />
        </div>
      )}

      <div className="mat-elevation-z8">
        <Table className="lessons-table">
          <TableHead>
            <TableRow>
              <TableCell className="header-cell">
                <TableSortLabel active direction={sortDirection} onClick={handleSort}>
                  #
                </TableSortLabel>
              </TableCell>
              <TableCell className="header-cell">Description</TableCell>
              <TableCell className="header-cell">Duration</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {lessons.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell>{lesson.seqNo}</TableCell>
                <TableCell className="description-cell">
                  {lesson.description}
                </TableCell>
                <TableCell className="duration-cell">{lesson.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={course?.lessonsCount ?? 0}
          page={pageIndex}
          onPageChange={(_, page) => setPageIndex(page)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPageIndex(0);
          }}
          rowsPerPageOptions={[3, 5, 10]}
          labelRowsPerPage="Items per page:"
        />
      </div>
    </div>
  );
}
