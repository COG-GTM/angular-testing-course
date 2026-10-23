import { useId } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { getNumberOfPages, getRangeLabel, pageIndexForNewPageSize } from './paginatorUtils';

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
}

export interface LessonsPaginatorProps {
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPage: (event: PageEvent) => void;
}

const navButtonSx = {
  width: 48,
  height: 48,
  padding: '12px',
  color: 'rgba(0, 0, 0, 0.54)',
  '&.Mui-disabled': { color: 'rgba(0, 0, 0, 0.12)' },
} as const;

const pageSizeSelectSx = {
  width: 84,
  fontSize: 12,
  letterSpacing: '0.5px',
  textAlign: 'left',
  color: 'rgba(0, 0, 0, 0.87)',
  '& .MuiSelect-select': {
    padding: '12px 32px 11.5px 16px',
    minHeight: 0,
    lineHeight: '18px',
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.38)' },
  '& .MuiSelect-icon': { right: 9, color: 'rgba(0, 0, 0, 0.54)' },
} as const;

/** Port of `<mat-paginator>` (no first/last buttons, Angular's default labels). */
export function LessonsPaginator({ length, pageIndex, pageSize, pageSizeOptions, onPage }: LessonsPaginatorProps) {
  const labelId = useId();
  const hasPreviousPage = pageIndex >= 1 && pageSize !== 0;
  const hasNextPage = pageSize !== 0 && pageIndex < getNumberOfPages(pageSize, length) - 1;

  return (
    <div className="lessons-paginator" role="group">
      <div className="paginator-container">
        <div className="paginator-page-size">
          <div className="paginator-page-size-label" id={labelId}>
            Items per page:
          </div>
          <Select
            className="paginator-page-size-select"
            size="small"
            value={pageSize}
            labelId={labelId}
            sx={pageSizeSelectSx}
            onChange={(e) => {
              const newPageSize = Number(e.target.value);
              if (newPageSize === pageSize) return;
              onPage({ pageIndex: pageIndexForNewPageSize(pageIndex, pageSize, newPageSize), pageSize: newPageSize });
            }}
          >
            {pageSizeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="paginator-range-actions">
          <div className="paginator-range-label" aria-live="polite">
            {getRangeLabel(pageIndex, pageSize, length)}
          </div>
          <IconButton
            aria-label="Previous page"
            title="Previous page"
            disabled={!hasPreviousPage}
            sx={navButtonSx}
            onClick={() => onPage({ pageIndex: pageIndex - 1, pageSize })}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            aria-label="Next page"
            title="Next page"
            disabled={!hasNextPage}
            sx={navButtonSx}
            onClick={() => onPage({ pageIndex: pageIndex + 1, pageSize })}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
