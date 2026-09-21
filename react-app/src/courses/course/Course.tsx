import { ChangeEvent, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import { Course as CourseModel } from '../model/course';
import { SortDirection, useLessons } from '../services/useLessons';
import './course.css';

const SEARCH_DEBOUNCE_MS = 150;
const PAGE_SIZE_OPTIONS = [3, 5, 10];

// Port of ../src/app/courses/course/course.component.ts
export const Course = () => {
  const course = useLoaderData() as CourseModel;

  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setFilter(searchInput);
      setPageIndex(0);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { lessons, loading } = useLessons({
    courseId: course.id,
    filter,
    sortDirection,
    pageIndex,
    pageSize,
  });

  const onSortChange = () => {
    setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    setPageIndex(0);
  };

  const onPageChange = (_event: unknown, newPage: number) => setPageIndex(newPage);

  const onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPageSize(Number(event.target.value));
    setPageIndex(0);
  };

  return (
    <div className="course">
      <h2>{course?.titles?.description}</h2>

      <img className="course-thumbnail" src={course?.iconUrl} alt={course?.titles?.description} />

      <TextField
        variant="standard"
        placeholder="Search lessons"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        inputProps={{ 'aria-label': 'Search lessons' }}
      />

      {loading && (
        <div className="spinner-container">
          <CircularProgress className="lessons-spinner" role="progressbar" />
        </div>
      )}

      <div className="mat-elevation-z8">
        <Table className="lessons-table">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortDirection}>
                <TableSortLabel active direction={sortDirection} onClick={onSortChange}>
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

        <TablePagination
          className="lessons-paginator"
          component="div"
          count={course?.lessonsCount ?? 0}
          page={pageIndex}
          rowsPerPage={pageSize}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </div>
    </div>
  );
};
