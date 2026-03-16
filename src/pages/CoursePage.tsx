import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Course } from '../models/course';
import { findCourseById } from '../services/courses-service';
import { useLessons } from '../hooks/useLessons';
import { useDebounce } from '../hooks/useDebounce';

function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const debouncedFilter = useDebounce(filter, 150);

  const { lessons, loading } = useLessons(
    courseId,
    debouncedFilter,
    sortDirection,
    pageIndex,
    pageSize
  );

  useEffect(() => {
    findCourseById(courseId).then(setCourse).catch(console.error);
  }, [courseId]);

  const handleSortChange = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPageIndex(0);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setPageIndex(0);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPageIndex(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  if (!course) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        textAlign: 'center',
        maxWidth: 600,
        margin: '0 auto',
        padding: 2,
      }}
    >
      <Typography variant="h5">{course.titles.description}</Typography>
      <Box
        component="img"
        src={course.iconUrl}
        alt={course.titles.description}
        sx={{ width: 150, margin: '20px auto', display: 'block' }}
      />
      <TextField
        placeholder="Search lessons"
        variant="outlined"
        size="small"
        fullWidth
        value={filter}
        onChange={handleFilterChange}
        sx={{ mb: 2 }}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Paper elevation={8}>
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
                  <TableCell sx={{ textAlign: 'left', padding: '10px 0' }}>
                    {lesson.description}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {lesson.duration}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={course.lessonsCount}
          page={pageIndex}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[3, 5, 10]}
        />
      </Paper>
    </Box>
  );
}

export default CoursePage;
