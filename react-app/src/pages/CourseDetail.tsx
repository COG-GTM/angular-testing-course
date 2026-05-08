import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { Course } from '../models/course';
import { Lesson } from '../models/lesson';
import { findCourseById, findLessons } from '../services/api';

function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadLessons = useCallback(
    async (
      courseId: number,
      filter: string,
      sort: string,
      pageNum: number,
      size: number
    ) => {
      setLoading(true);
      try {
        const data = await findLessons(courseId, filter, sort, pageNum, size);
        setLessons(data);
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

  const handleSortChange = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setPage(0);
    if (course) {
      loadLessons(
        course.id,
        searchRef.current?.value || '',
        newDirection,
        0,
        pageSize
      );
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
    if (course) {
      loadLessons(
        course.id,
        searchRef.current?.value || '',
        sortDirection,
        newPage,
        pageSize
      );
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(0);
    if (course) {
      loadLessons(
        course.id,
        searchRef.current?.value || '',
        sortDirection,
        0,
        newSize
      );
    }
  };

  const handleSearchKeyUp = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      if (course) {
        loadLessons(
          course.id,
          searchRef.current?.value || '',
          sortDirection,
          0,
          pageSize
        );
      }
    }, 150);
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
        maxWidth: 390,
        margin: '0 auto',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
        {course.titles.description}
      </Typography>
      <Box
        component="img"
        src={course.iconUrl}
        alt={course.titles.description}
        sx={{
          width: 150,
          margin: '20px auto',
          display: 'block',
        }}
      />
      <TextField
        fullWidth
        label="Search lessons"
        variant="outlined"
        size="small"
        inputRef={searchRef}
        onKeyUp={handleSearchKeyUp}
        sx={{ mb: 2 }}
      />
      {loading && (
        <Box
          sx={{
            height: 360,
            width: 390,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Paper
        elevation={8}
        sx={{ paddingBottom: '5px' }}
      >
        <TableContainer>
          <Table
            sx={{ minHeight: 360 }}
            size="small"
          >
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
                  <TableCell
                    sx={{ textAlign: 'left', padding: '10px 0' }}
                  >
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
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[3, 5, 10]}
          sx={{ marginBottom: '10px' }}
        />
      </Paper>
    </Box>
  );
}

export default CourseDetail;
