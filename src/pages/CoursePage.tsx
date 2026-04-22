import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import type { Course } from '../types/course';
import type { Lesson } from '../types/lesson';
import { findCourseById, findLessons } from '../services/coursesApi';

const PAGE_SIZE_OPTIONS = [3, 5, 10];

export function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [courseError, setCourseError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const [debouncedFilter, setDebouncedFilter] = useState('');

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    findCourseById(id, controller.signal)
      .then(setCourse)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setCourseError(
          err instanceof Error ? err.message : 'Failed to load course',
        );
      });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setDebouncedFilter(filter);
      setPage(0);
    }, 150);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [filter]);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoadingLessons(true);
    findLessons(id, {
      filter: debouncedFilter,
      sortOrder,
      pageNumber: page,
      pageSize,
      signal: controller.signal,
    })
      .then((result) => {
        setLessons(result);
        setLoadingLessons(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setLoadingLessons(false);
      });
    return () => controller.abort();
  }, [id, debouncedFilter, sortOrder, page, pageSize]);

  const handleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPage(0);
  };

  const pageIndicatorLength = useMemo(
    () => page * pageSize + lessons.length + (lessons.length === pageSize ? 1 : 0),
    [page, pageSize, lessons.length],
  );

  if (courseError) {
    return <Box sx={{ p: 4, color: 'error.main' }}>{courseError}</Box>;
  }

  if (!course) {
    return (
      <div className="spinner-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <div className="course-header">
        {course.uploadedImageUrl && (
          <img
            className="course-thumbnail"
            src={course.uploadedImageUrl}
            alt={course.titles.description}
          />
        )}
        <h2>{course.titles.description}</h2>
      </div>
      <TextField
        className="search-field"
        label="Search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
        variant="standard"
      />
      <TableContainer component={Paper} className="lessons-table" sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active
                  direction={sortOrder}
                  onClick={handleSort}
                >
                  #
                </TableSortLabel>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingLessons ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson) => (
                <TableRow key={lesson.id} hover>
                  <TableCell>{lesson.seqNo}</TableCell>
                  <TableCell>{lesson.description}</TableCell>
                  <TableCell align="right">{lesson.duration}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pageIndicatorLength}
          page={page}
          onPageChange={(_, newPage: number) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        />
      </TableContainer>
    </Box>
  );
}
