import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  CircularProgress,
  Paper,
} from '@mui/material';
import type { Course } from '../models/course';
import type { Lesson } from '../models/lesson';
import { findCourseById, findLessons } from '../services/courses.service';
import './CoursePage.css';

export function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadLessons = useCallback(
    async (
      courseId: number,
      filterVal: string,
      sortDir: string,
      pageNum: number,
      pageSz: number
    ) => {
      setLoading(true);
      try {
        const data = await findLessons(courseId, filterVal, sortDir, pageNum, pageSz);
        setLessons(data);
      } catch {
        setLessons([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!id) return;
    const courseId = parseInt(id, 10);
    findCourseById(courseId).then((c) => {
      setCourse(c);
      loadLessons(courseId, '', 'asc', 0, 3);
    });
  }, [id, loadLessons]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilter(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (course) {
        setPage(0);
        loadLessons(course.id, val, sortDirection, 0, pageSize);
      }
    }, 150);
  };

  const handleSortChange = () => {
    const newDir = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDir);
    setPage(0);
    if (course) {
      loadLessons(course.id, filter, newDir, 0, pageSize);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
    if (course) {
      loadLessons(course.id, filter, sortDirection, newPage, pageSize);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setPage(0);
    if (course) {
      loadLessons(course.id, filter, sortDirection, 0, newSize);
    }
  };

  if (!course) return null;

  return (
    <div className="course">
      <h2>{course.titles.description}</h2>
      <img className="course-thumbnail" src={course.iconUrl} alt={course.titles.description} />

      <TextField
        placeholder="Search lessons"
        variant="standard"
        value={filter}
        onChange={handleFilterChange}
        sx={{ mb: 2 }}
      />

      {loading && (
        <div className="spinner-container">
          <CircularProgress />
        </div>
      )}

      <Paper className="mat-elevation-z8" elevation={8}>
        <TableContainer>
          <Table className="lessons-table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active
                    direction={sortDirection}
                    onClick={handleSortChange}
                  >
                    #
                  </TableSortLabel>
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>{lesson.seqNo}</TableCell>
                  <TableCell className="description-cell">{lesson.description}</TableCell>
                  <TableCell className="duration-cell">{lesson.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={course.lessonsCount}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[3, 5, 10]}
          labelRowsPerPage="Items per page:"
        />
      </Paper>
    </div>
  );
}
