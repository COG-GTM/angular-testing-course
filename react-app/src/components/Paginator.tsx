interface PaginatorProps {
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (pageIndex: number, pageSize: number) => void;
}

export function Paginator({
  length,
  pageIndex,
  pageSize,
  pageSizeOptions,
  onPageChange,
}: PaginatorProps) {
  const lastPageIndex = Math.max(Math.ceil(length / pageSize) - 1, 0);
  const rangeStart = length === 0 ? 0 : pageIndex * pageSize + 1;
  const rangeEnd = Math.min((pageIndex + 1) * pageSize, length);

  return (
    <div className="paginator">
      <div className="paginator-page-size">
        <label htmlFor="paginator-page-size">Items per page:</label>
        <select
          id="paginator-page-size"
          value={pageSize}
          onChange={(event) => onPageChange(0, Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="paginator-range">
        {rangeStart} – {rangeEnd} of {length}
      </div>

      <div className="paginator-nav">
        <button
          type="button"
          aria-label="Previous page"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(pageIndex - 1, pageSize)}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next page"
          disabled={pageIndex >= lastPageIndex}
          onClick={() => onPageChange(pageIndex + 1, pageSize)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
