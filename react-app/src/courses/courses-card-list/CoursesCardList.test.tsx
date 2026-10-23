import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createCoursesServiceSpy, renderWithProviders } from '../common/testUtils';
import { setupCourses } from '../common/setupTestData';
import { CoursesCardList } from './CoursesCardList';

// Port of courses-card-list.component.spec.ts (Angular: TestBed + CoursesModule, By.css('.course-card')).
describe('CoursesCardListComponent', () => {
  it('should create the component', () => {
    const { container } = renderWithProviders(<CoursesCardList courses={[]} />);

    expect(container).toBeTruthy();
    expect(screen.queryAllByRole('region')).toHaveLength(0);
  });

  it('should display the course list', () => {
    renderWithProviders(<CoursesCardList courses={setupCourses()} />);

    const cards = screen.getAllByRole('region');

    expect(cards).toBeTruthy();
    expect(cards).toHaveLength(12);
  });

  it('should display the first course', () => {
    const courses = setupCourses();
    renderWithProviders(<CoursesCardList courses={courses} />);

    const course = courses[0];
    const card = screen.getAllByRole('region')[0];
    const title = within(card).getByText(course.titles.description);
    const image = card.querySelector('img');

    expect(card).toBeTruthy();
    expect(title.textContent).toBe(course.titles.description);
    expect(image?.src).toBe(course.iconUrl);
  });

  // Additional coverage (no legacy spec for these behaviours).
  describe('cards and actions', () => {
    it('renders the cards in input order with their long description and the mat-card classes', () => {
      const courses = setupCourses().reverse();
      renderWithProviders(<CoursesCardList courses={courses} />);

      const cards = screen.getAllByRole('region');
      expect(cards.map((c) => c.getAttribute('aria-label'))).toEqual(courses.map((c) => c.titles.description));
      cards.forEach((card, i) => {
        expect(card).toHaveClass('course-card', 'mat-elevation-z10');
        expect(within(card).getByText(courses[i].titles.longDescription!).tagName).toBe('P');
        expect(within(card).getByRole('button', { name: 'VIEW COURSE' })).toBeInTheDocument();
        expect(within(card).getByRole('button', { name: 'EDIT' })).toBeInTheDocument();
      });
    });

    it('navigates to /courses/:id on VIEW COURSE', async () => {
      const course = setupCourses()[1];
      renderWithProviders(<CoursesCardList courses={[course]} />, {
        path: '/',
        routes: [{ path: '/courses/:id', element: <div>course page</div> }],
      });

      await userEvent.click(screen.getByRole('button', { name: 'VIEW COURSE' }));

      expect(await screen.findByText('course page')).toBeInTheDocument();
    });

    it('opens the course dialog for the clicked card on EDIT', async () => {
      const course = setupCourses()[2];
      renderWithProviders(<CoursesCardList courses={setupCourses()} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await userEvent.click(within(screen.getAllByRole('region')[2]).getByRole('button', { name: 'EDIT' }));

      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByRole('heading', { name: course.titles.description })).toBeInTheDocument();
      expect(within(dialog).getByRole('textbox', { name: 'Course Description' })).toHaveValue(course.titles.description);
    });

    it('autofocuses the first field and does not close on Escape (disableClose)', async () => {
      const onCourseEdited = vi.fn();
      renderWithProviders(<CoursesCardList courses={setupCourses()} onCourseEdited={onCourseEdited} />);

      await userEvent.click(screen.getAllByRole('button', { name: 'EDIT' })[0]);
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByRole('textbox', { name: 'Course Description' })).toHaveFocus();

      await userEvent.keyboard('{Escape}');

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(onCourseEdited).not.toHaveBeenCalled();
    });

    it('does not close on a backdrop click (disableClose)', async () => {
      renderWithProviders(<CoursesCardList courses={setupCourses()} />);

      await userEvent.click(screen.getAllByRole('button', { name: 'EDIT' })[0]);
      const backdrop = document.querySelector('.MuiBackdrop-root') as HTMLElement;
      await userEvent.click(backdrop);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('EDIT → Save calls saveCourse and emits onCourseEdited', async () => {
      const course = setupCourses()[0];
      const spy = createCoursesServiceSpy();
      spy.saveCourse.mockResolvedValue(course);
      const onCourseEdited = vi.fn();
      renderWithProviders(<CoursesCardList courses={[course]} onCourseEdited={onCourseEdited} />, { coursesService: spy });

      await userEvent.click(screen.getByRole('button', { name: 'EDIT' }));
      const input = screen.getByRole('textbox', { name: 'Course Description' });
      await userEvent.clear(input);
      await userEvent.type(input, 'Edited title');
      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      expect(spy.saveCourse).toHaveBeenCalledWith(course.id, {
        titles: { description: 'Edited title', longDescription: course.titles.longDescription },
      });
      await waitFor(() => expect(onCourseEdited).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('EDIT → Save against the API (MSW PUT /api/courses/:id) emits onCourseEdited', async () => {
      const onCourseEdited = vi.fn();
      renderWithProviders(<CoursesCardList courses={setupCourses()} onCourseEdited={onCourseEdited} />);

      await userEvent.click(screen.getAllByRole('button', { name: 'EDIT' })[0]);
      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => expect(onCourseEdited).toHaveBeenCalledTimes(1));
    });

    it('EDIT → Close does not emit onCourseEdited or save', async () => {
      const spy = createCoursesServiceSpy();
      const onCourseEdited = vi.fn();
      renderWithProviders(<CoursesCardList courses={setupCourses()} onCourseEdited={onCourseEdited} />, { coursesService: spy });

      await userEvent.click(screen.getAllByRole('button', { name: 'EDIT' })[0]);
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(onCourseEdited).not.toHaveBeenCalled();
      expect(spy.saveCourse).not.toHaveBeenCalled();
    });

    it('re-opening EDIT starts from a fresh form (new dialog instance)', async () => {
      const course = setupCourses()[0];
      renderWithProviders(<CoursesCardList courses={[course]} />);

      await userEvent.click(screen.getByRole('button', { name: 'EDIT' }));
      await userEvent.type(screen.getByRole('textbox', { name: 'Course Description' }), ' draft');
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

      await userEvent.click(screen.getByRole('button', { name: 'EDIT' }));
      expect(screen.getByRole('textbox', { name: 'Course Description' })).toHaveValue(course.titles.description);
    });
  });
});
