/** Port of Angular Material's default `MatPaginatorIntl.getRangeLabel`. */
export function getRangeLabel(page: number, pageSize: number, length: number): string {
  if (length === 0 || pageSize === 0) {
    return `0 of ${length}`;
  }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  return `${startIndex + 1} – ${endIndex} of ${length}`;
}

/** Port of `MatPaginator.getNumberOfPages`. */
export function getNumberOfPages(pageSize: number, length: number): number {
  return pageSize ? Math.ceil(length / pageSize) : 0;
}

/** Port of `MatPaginator._changePageSize`: keep the first item of the current page visible. */
export function pageIndexForNewPageSize(pageIndex: number, pageSize: number, newPageSize: number): number {
  return Math.floor((pageIndex * pageSize) / newPageSize) || 0;
}
