import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CoursesCardListProps } from '../courses-card-list';
import type { Course } from '../model/course';
import { click, createCoursesServiceSpy, renderWithProviders } from '../common/testUtils';
import { setupCourses } from '../common/setupTestData';
import { Home } from './Home';

// Stub of the card list (owned by W2-B) that renders one card title per course.
vi.mock('../courses-card-list', () => ({
  CoursesCardList: ({ courses, onCourseEdited }: CoursesCardListProps) => (
    <div>
      <ul aria-label="course cards">
        {courses.map((course) => (
          <li key={course.id}>{course.titles.description}</li>
        ))}
      </ul>
      <button type="button" onClick={() => onCourseEdited?.()}>
        stub edit
      </button>
    </div>
  ),
}));

function activeCardTitles(): string[] {
  const panel = screen.getByRole('tabpanel');
  return within(panel)
    .getAllByRole('listitem')
    .map((item) => item.textContent ?? '');
}

describe('Home', () => {
  let coursesService: ReturnType<typeof createCoursesServiceSpy>;

  const beginnerCourses = setupCourses().filter((course) => course.category == 'BEGINNER');

  const advancedCourses = setupCourses().filter((course) => course.category == 'ADVANCED');

  function renderHome() {
    return renderWithProviders(<Home />, { coursesService });
  }

  beforeEach(() => {
    coursesService = createCoursesServiceSpy();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create the component', async () => {
    coursesService.findAllCourses.mockResolvedValue([]);

    renderHome();

    expect(screen.getByRole('heading', { name: 'All Courses', level: 3 })).toBeInTheDocument();
    await waitFor(() => expect(coursesService.findAllCourses).toHaveBeenCalledTimes(1));
  });

  it('should display only beginner courses', async () => {
    coursesService.findAllCourses.mockResolvedValue(beginnerCourses);

    renderHome();

    const tabs = await screen.findAllByRole('tab');
    expect(tabs, 'Unexpected number of tabs found').toHaveLength(1);
    expect(tabs[0]).toHaveTextContent('Beginners');
  });

  it('should display only advanced courses', async () => {
    coursesService.findAllCourses.mockResolvedValue(advancedCourses);

    renderHome();

    const tabs = await screen.findAllByRole('tab');
    expect(tabs, 'Unexpected number of tabs found').toHaveLength(1);
    expect(tabs[0]).toHaveTextContent('Advanced');
  });

  it('should display both tabs', async () => {
    coursesService.findAllCourses.mockResolvedValue(setupCourses());

    renderHome();

    const tabs = await screen.findAllByRole('tab');
    expect(tabs, 'Expected to find 2 tabs').toHaveLength(2);
    expect(tabs.map((tab) => tab.textContent)).toEqual(['Beginners', 'Advanced']);
  });

  it('should display advanced courses when tab clicked - fakeAsync', async () => {
    vi.useFakeTimers();
    coursesService.findAllCourses.mockResolvedValue(setupCourses());

    renderHome();
    // flushMicrotasks(): resolve the findAllCourses() promise.
    await act(async () => {});

    const tabs = screen.getAllByRole('tab');

    act(() => click(tabs[1]));

    // flush()
    act(() => {
      vi.runAllTimers();
    });

    const cardTitles = activeCardTitles();

    expect(cardTitles.length, 'Could not find card titles').toBeGreaterThan(0);

    expect(cardTitles[0]).toContain('Angular Security Course');
  });

  it('should display advanced courses when tab clicked - async', async () => {
    const user = userEvent.setup();
    coursesService.findAllCourses.mockResolvedValue(setupCourses());

    renderHome();

    const tabs = await screen.findAllByRole('tab');

    await user.click(tabs[1]);

    // whenStable()
    await waitFor(() => {
      const cardTitles = activeCardTitles();

      expect(cardTitles.length, 'Could not find card titles').toBeGreaterThan(0);

      expect(cardTitles[0]).toContain('Angular Security Course');
    });
  });

  // Additional coverage (not in the Angular spec).

  it('selects the Beginners tab first and lists its courses sorted by seqNo', async () => {
    coursesService.findAllCourses.mockResolvedValue([...beginnerCourses].reverse());

    renderHome();

    const tab = await screen.findByRole('tab', { name: 'Beginners' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(activeCardTitles()).toEqual(beginnerCourses.map((course) => course.titles.description));
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Beginners');
  });

  it('never shows INTERMEDIATE courses', async () => {
    const intermediate: Course = { ...beginnerCourses[0], id: 99, category: 'INTERMEDIATE' };
    coursesService.findAllCourses.mockResolvedValue([intermediate]);

    renderHome();

    await waitFor(() => expect(coursesService.findAllCourses).toHaveBeenCalled());
    await act(async () => {});
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });

  it('reloads the courses when a course is edited', async () => {
    const user = userEvent.setup();
    coursesService.findAllCourses.mockResolvedValueOnce(setupCourses());
    const renamed = setupCourses().map((course) =>
      course.id === beginnerCourses[0].id ? { ...course, titles: { ...course.titles, description: 'Renamed' } } : course,
    );
    coursesService.findAllCourses.mockResolvedValueOnce(renamed);

    renderHome();
    await screen.findAllByRole('tab');

    await user.click(screen.getByRole('button', { name: 'stub edit' }));

    await waitFor(() => expect(activeCardTitles()[0]).toBe('Renamed'));
    expect(coursesService.findAllCourses).toHaveBeenCalledTimes(2);
  });

  it('keeps the selected tab when the reloaded courses still contain it', async () => {
    const user = userEvent.setup();
    coursesService.findAllCourses.mockResolvedValueOnce(setupCourses()).mockResolvedValueOnce(advancedCourses);

    renderHome();
    await user.click(await screen.findByRole('tab', { name: 'Advanced' }));
    await user.click(screen.getByRole('button', { name: 'stub edit' }));

    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(1));
    expect(screen.getByRole('tab', { name: 'Advanced' })).toHaveAttribute('aria-selected', 'true');
    expect(activeCardTitles()[0]).toContain('Angular Security Course');
  });

  it('ignores a stale response that resolves after a newer reload', async () => {
    const user = userEvent.setup();
    let resolveStale!: (courses: Course[]) => void;
    coursesService.findAllCourses
      .mockResolvedValueOnce(setupCourses())
      .mockImplementationOnce(() => new Promise((resolve) => (resolveStale = resolve)))
      .mockResolvedValueOnce(advancedCourses);

    renderHome();
    await screen.findAllByRole('tab');

    const edit = screen.getByRole('button', { name: 'stub edit' });
    await user.click(edit);
    await user.click(edit);
    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(1));

    await act(async () => resolveStale(beginnerCourses));

    expect(screen.getAllByRole('tab')).toHaveLength(1);
    expect(screen.getByRole('tab', { name: 'Advanced' })).toBeInTheDocument();
    expect(coursesService.findAllCourses.mock.calls[1][0]?.signal?.aborted).toBe(true);
  });

  it('fetches GET /api/courses through the real service', async () => {
    renderWithProviders(<Home />);

    expect(await screen.findByRole('tab', { name: 'Beginners' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Advanced' })).toBeInTheDocument();
    expect(activeCardTitles()[0]).toBe('Angular Testing Course');
  });
});
