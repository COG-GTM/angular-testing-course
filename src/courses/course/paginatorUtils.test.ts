import { getNumberOfPages, getRangeLabel, pageIndexForNewPageSize } from './paginatorUtils';

describe('paginatorUtils (MatPaginator parity)', () => {
  it('should format the range label like MatPaginatorIntl', () => {
    expect(getRangeLabel(0, 3, 10)).toBe('1 – 3 of 10');
    expect(getRangeLabel(3, 3, 10)).toBe('10 – 10 of 10');
    expect(getRangeLabel(0, 10, 10)).toBe('1 – 10 of 10');
    expect(getRangeLabel(0, 3, 0)).toBe('0 of 0');
    expect(getRangeLabel(5, 3, 10)).toBe('16 – 18 of 10');
  });

  it('should count pages', () => {
    expect(getNumberOfPages(3, 10)).toBe(4);
    expect(getNumberOfPages(5, 10)).toBe(2);
    expect(getNumberOfPages(0, 10)).toBe(0);
  });

  it('should keep the first item visible when the page size changes', () => {
    expect(pageIndexForNewPageSize(2, 3, 5)).toBe(1);
    expect(pageIndexForNewPageSize(3, 3, 10)).toBe(0);
    expect(pageIndexForNewPageSize(1, 5, 3)).toBe(1);
  });
});
