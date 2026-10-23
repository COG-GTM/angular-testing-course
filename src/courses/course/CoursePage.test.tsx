import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { findLessonsForCourse } from '../../../server/db-data';
import { server } from '../../test/server';
import { createCoursesServiceSpy, renderWithProviders } from '../common/testUtils';
import { setupCourses } from '../common/setupTestData';
import type { Course } from '../model/course';
import type { Lesson } from '../model/lesson';
import type { CoursesService } from '../services';
import { CoursePage, SEARCH_DEBOUNCE_MS } from './CoursePage';

const course = setupCourses().find((c) => c.id === 12) as Course;
const allLessons = (findLessonsForCourse(12) as Lesson[]).sort((l1, l2) => l1.id - l2.id);

function renderCoursePage(coursesService?: CoursesService) {
  return renderWithProviders(<CoursePage />, {
    route: `/courses/${course.id}`,
    path: '/courses/:id',
    loader: () => course,
    coursesService,
  });
}

function lessonRows(): HTMLElement[] {
  return screen.getAllByRole('row').slice(1);
}

function rowSeqNos(): string[] {
  return lessonRows().map((row) => within(row).getAllByRole('cell')[0].textContent ?? '');
}

/** Spy whose `findLessons` paginates the course-12 lessons like the Express API (synchronously resolved). */
function createLessonsSpy() {
  const spy = createCoursesServiceSpy();
  spy.findLessons.mockImplementation(async (_courseId, filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3) => {
    let lessons = allLessons.filter((l) => l.description.toLowerCase().includes(filter.toLowerCase()));
    if (sortOrder === 'desc') lessons = [...lessons].reverse();
    return lessons.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize);
  });
  return spy;
}

function expectLastLoad(spy: ReturnType<typeof createCoursesServiceSpy>, ...args: [string, 'asc' | 'desc', number, number]) {
  expect(spy.findLessons).toHaveBeenLastCalledWith(course.id, ...args, expect.objectContaining({ signal: expect.any(AbortSignal) }));
}

async function renderLoaded(spy = createLessonsSpy()) {
  const result = renderCoursePage(spy);
  await screen.findByRole('cell', { name: allLessons[0].description });
  return { ...result, spy };
}

describe('CoursePage', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should display the course title and thumbnail from the route loader', async () => {
    renderCoursePage(createLessonsSpy());

    expect(await screen.findByRole('heading', { level: 2, name: 'Angular Testing Course' })).toBeInTheDocument();
    const thumbnail = document.querySelector('img.course-thumbnail');
    expect(thumbnail).toHaveAttribute('src', course.iconUrl);
  });

  it('should load the first page of lessons on init', async () => {
    const { spy } = await renderLoaded();

    expect(spy.findLessons).toHaveBeenCalledTimes(1);
    expectLastLoad(spy, '', 'asc', 0, 3);
    expect(rowSeqNos()).toEqual(['1', '2', '3']);
    const firstRow = within(lessonRows()[0]).getAllByRole('cell').map((cell) => cell.textContent);
    expect(firstRow).toEqual(['1', allLessons[0].description, allLessons[0].duration]);
  });

  it('should display the table headers and the search input', async () => {
    await renderLoaded();

    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['#', 'Description', 'Duration']);
    expect(screen.getByRole('columnheader', { name: '#' })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByPlaceholderText('Search lessons')).toBeInTheDocument();
  });

  it('should show the spinner while lessons are loading', async () => {
    let resolve!: (lessons: Lesson[]) => void;
    const spy = createCoursesServiceSpy();
    spy.findLessons.mockReturnValue(new Promise<Lesson[]>((r) => (resolve = r)));
    renderCoursePage(spy);

    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    expect(lessonRowsSafe()).toHaveLength(0);

    await act(async () => resolve(allLessons.slice(0, 3)));

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(rowSeqNos()).toEqual(['1', '2', '3']);
  });

  it('should display the paginator with the course lessons count', async () => {
    await renderLoaded();

    expect(screen.getByText('Items per page:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('3');
    expect(screen.getByText('1 – 3 of 10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
  });

  it('should load the next and previous pages', async () => {
    const user = userEvent.setup();
    const { spy } = await renderLoaded();

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expectLastLoad(spy, '', 'asc', 1, 3);
    await waitFor(() => expect(rowSeqNos()).toEqual(['4', '5', '6']));
    expect(screen.getByText('4 – 6 of 10')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expectLastLoad(spy, '', 'asc', 0, 3);
    await waitFor(() => expect(rowSeqNos()).toEqual(['1', '2', '3']));
    expect(screen.getByText('1 – 3 of 10')).toBeInTheDocument();
  });

  it('should disable next page on the last page', async () => {
    const user = userEvent.setup();
    await renderLoaded();

    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByRole('button', { name: 'Next page' }));
    }

    await waitFor(() => expect(rowSeqNos()).toEqual(['10']));
    expect(screen.getByText('10 – 10 of 10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('should reload with the selected page size', async () => {
    const user = userEvent.setup();
    const { spy } = await renderLoaded();

    await user.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['3', '5', '10']);
    await user.click(screen.getByRole('option', { name: '5' }));

    expectLastLoad(spy, '', 'asc', 0, 5);
    await waitFor(() => expect(rowSeqNos()).toEqual(['1', '2', '3', '4', '5']));
    expect(screen.getByText('1 – 5 of 10')).toBeInTheDocument();

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '10' }));

    expectLastLoad(spy, '', 'asc', 0, 10);
    await waitFor(() => expect(lessonRows()).toHaveLength(10));
    expect(screen.getByText('1 – 10 of 10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('should keep the first item of the current page visible when the page size changes', async () => {
    const user = userEvent.setup();
    const { spy } = await renderLoaded();

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expectLastLoad(spy, '', 'asc', 2, 3);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '5' }));

    // MatPaginator: floor((2 * 3) / 5) = page 1
    expectLastLoad(spy, '', 'asc', 1, 5);
    await waitFor(() => expect(screen.getByText('6 – 10 of 10')).toBeInTheDocument());
  });

  it('should sort by seqNo descending and reset to the first page', async () => {
    const user = userEvent.setup();
    const { spy } = await renderLoaded();

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expectLastLoad(spy, '', 'asc', 1, 3);

    await user.click(within(screen.getByRole('columnheader', { name: '#' })).getByRole('button'));

    expectLastLoad(spy, '', 'desc', 0, 3);
    expect(screen.getByRole('columnheader', { name: '#' })).toHaveAttribute('aria-sort', 'descending');
    await waitFor(() => expect(rowSeqNos()).toEqual(['10', '9', '8']));
    expect(screen.getByText('1 – 3 of 10')).toBeInTheDocument();
  });

  it('should toggle the sort back to ascending (no clear state)', async () => {
    const user = userEvent.setup();
    const { spy } = await renderLoaded();
    const sortButton = within(screen.getByRole('columnheader', { name: '#' })).getByRole('button');

    await user.click(sortButton);
    await user.click(sortButton);

    expectLastLoad(spy, '', 'asc', 0, 3);
    expect(screen.getByRole('columnheader', { name: '#' })).toHaveAttribute('aria-sort', 'ascending');
    await waitFor(() => expect(rowSeqNos()).toEqual(['1', '2', '3']));
  });

  it('should debounce the search by 150ms and reset to the first page', async () => {
    const { spy } = await renderLoaded();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expectLastLoad(spy, '', 'asc', 1, 3);
    spy.findLessons.mockClear();

    vi.useFakeTimers();
    const input = screen.getByPlaceholderText('Search lessons') as HTMLInputElement;
    for (const value of ['t', 'te', 'tes', 'test']) {
      typeKey(input, value);
      act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 50));
    }
    expect(spy.findLessons).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(49));
    expect(spy.findLessons).not.toHaveBeenCalled();

    await act(async () => vi.advanceTimersByTime(1));
    expect(spy.findLessons).toHaveBeenCalledTimes(1);
    expectLastLoad(spy, 'test', 'asc', 0, 3);
    expect(screen.getByText('1 – 3 of 10')).toBeInTheDocument();
    expect(rowSeqNos()).toEqual(['1', '4', '5']);
  });

  it('should reload on every debounced keyup even when the search value is unchanged (legacy parity)', async () => {
    const { spy } = await renderLoaded();
    spy.findLessons.mockClear();

    vi.useFakeTimers();
    const input = screen.getByPlaceholderText('Search lessons') as HTMLInputElement;

    typeKey(input, 'test');
    await act(async () => vi.runAllTimers());
    expect(spy.findLessons).toHaveBeenCalledTimes(1);
    expectLastLoad(spy, 'test', 'asc', 0, 3);

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expectLastLoad(spy, 'test', 'asc', 1, 3);
    await act(async () => vi.runAllTimers());
    expect(screen.getByText('4 – 6 of 10')).toBeInTheDocument();

    typeKey(input, 'test', 'ArrowLeft');
    await act(async () => vi.runAllTimers());
    expect(spy.findLessons).toHaveBeenCalledTimes(3);
    expectLastLoad(spy, 'test', 'asc', 0, 3);
    expect(screen.getByText('1 – 3 of 10')).toBeInTheDocument();

    typeKey(input, 'testx');
    act(() => vi.advanceTimersByTime(100));
    typeKey(input, 'test', 'Backspace');
    await act(async () => vi.runAllTimers());
    expect(spy.findLessons).toHaveBeenCalledTimes(4);
  });

  it('should use the current search value when paging and sorting', async () => {
    const user = userEvent.setup();
    const { spy } = await renderLoaded();

    await user.type(screen.getByPlaceholderText('Search lessons'), 'test');
    await waitFor(() => expectLastLoad(spy, 'test', 'asc', 0, 3));

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expectLastLoad(spy, 'test', 'asc', 1, 3);

    await user.click(within(screen.getByRole('columnheader', { name: '#' })).getByRole('button'));
    expectLastLoad(spy, 'test', 'desc', 0, 3);
  });

  it('should display an empty table when the search has no results', async () => {
    const user = userEvent.setup();
    await renderLoaded();

    await user.type(screen.getByPlaceholderText('Search lessons'), 'zzz');

    await waitFor(() => expect(lessonRowsSafe()).toHaveLength(0));
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(screen.getByText('1 – 3 of 10')).toBeInTheDocument();
  });

  it('should display an empty table when loading lessons fails', async () => {
    const spy = createCoursesServiceSpy();
    spy.findLessons.mockRejectedValue(new Error('boom'));
    renderCoursePage(spy);

    expect(await screen.findByRole('heading', { name: 'Angular Testing Course' })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(lessonRowsSafe()).toHaveLength(0);
  });

  it('should ignore superseded out-of-order responses (intentional deviation)', async () => {
    const pending: Array<(lessons: Lesson[]) => void> = [];
    const spy = createCoursesServiceSpy();
    spy.findLessons.mockImplementation(() => new Promise<Lesson[]>((r) => pending.push(r)));
    const user = userEvent.setup();
    renderCoursePage(spy);

    await waitFor(() => expect(spy.findLessons).toHaveBeenCalledTimes(1));
    await act(async () => pending[0](allLessons.slice(0, 3)));
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(spy.findLessons).toHaveBeenCalledTimes(3);

    await act(async () => pending[2](allLessons.slice(6, 9)));
    expect(rowSeqNos()).toEqual(['7', '8', '9']);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    await act(async () => pending[1](allLessons.slice(3, 6)));
    expect(rowSeqNos()).toEqual(['7', '8', '9']);
  });

  describe('against the HTTP API (MSW)', () => {
    it('should load and page lessons from /api/lessons', async () => {
      const requests: string[] = [];
      server.events.on('request:start', ({ request }) => {
        requests.push(new URL(request.url).search);
      });
      const user = userEvent.setup();
      renderCoursePage();

      expect(await screen.findByRole('cell', { name: allLessons[0].description })).toBeInTheDocument();
      expect(requests).toEqual(['?courseId=12&filter=&sortOrder=asc&pageNumber=0&pageSize=3']);

      await user.click(within(screen.getByRole('columnheader', { name: '#' })).getByRole('button'));
      await waitFor(() => expect(rowSeqNos()).toEqual(['10', '9', '8']));
      expect(requests.at(-1)).toBe('?courseId=12&filter=&sortOrder=desc&pageNumber=0&pageSize=3');
      server.events.removeAllListeners();
    });

    it('should show the spinner until a delayed response arrives', async () => {
      server.use(
        http.get('/api/lessons', async () => {
          await delay(50);
          return HttpResponse.json({ payload: allLessons.slice(0, 3) });
        }),
      );
      renderCoursePage();

      expect(await screen.findByRole('progressbar')).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
      expect(rowSeqNos()).toEqual(['1', '2', '3']);
    });

    it('should display an empty table on an HTTP error', async () => {
      server.use(http.get('/api/lessons', () => new HttpResponse(null, { status: 500 })));
      renderCoursePage();

      expect(await screen.findByRole('heading', { name: 'Angular Testing Course' })).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
      expect(lessonRowsSafe()).toHaveLength(0);
    });
  });
});

function lessonRowsSafe(): HTMLElement[] {
  return screen.queryAllByRole('row').slice(1);
}

/** Sets the (uncontrolled) input value and fires the `keyup` the component listens to. */
function typeKey(input: HTMLInputElement, value: string, key = value.slice(-1)) {
  input.value = value;
  fireEvent.keyUp(input, { key });
}
