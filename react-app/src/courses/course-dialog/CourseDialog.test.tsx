import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { createCoursesServiceSpy, renderWithProviders } from '../common/testUtils';
import { setupCourses } from '../common/setupTestData';
import { CourseDialog } from './CourseDialog';

// No legacy spec exists for course-dialog.component; these cover its template and save()/close().
describe('CourseDialogComponent', () => {
  const course = setupCourses()[0];

  function setup() {
    const spy = createCoursesServiceSpy();
    const onClose = vi.fn();
    const utils = renderWithProviders(<CourseDialog open course={course} onClose={onClose} />, { coursesService: spy });
    return { spy, onClose, ...utils };
  }

  it('should create the dialog with the course title', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: course.titles.description });
    expect(within(dialog).getByRole('heading', { level: 2, name: course.titles.description })).toBeInTheDocument();
  });

  it('should prefill the form from the course', () => {
    setup();

    expect(screen.getByRole('textbox', { name: 'Course Description' })).toHaveValue(course.titles.description);
    expect(screen.getByRole('combobox', { name: 'Select category' })).toHaveTextContent('Beginner');
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(course.titles.longDescription);
    expect(screen.getByRole('textbox', { name: 'Release date' })).toHaveValue(dayjs().format('M/D/YYYY'));
  });

  it('should mark every field as required', () => {
    setup();

    expect(screen.getByRole('textbox', { name: 'Course Description' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Release date' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Description' })).toBeRequired();
    expect(document.querySelector('.MuiSelect-nativeInput')).toBeRequired();
  });

  it('should offer the three categories', async () => {
    setup();

    await userEvent.click(screen.getByRole('combobox', { name: 'Select category' }));

    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(['Beginner', 'Intermediate', 'Advanced']);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('should render a datepicker toggle that opens a calendar', async () => {
    setup();

    await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }));

    expect(await screen.findByRole('grid')).toBeInTheDocument();
  });

  it('should autofocus the course description', () => {
    setup();

    expect(screen.getByRole('textbox', { name: 'Course Description' })).toHaveFocus();
  });

  it('should close without a result on Close', async () => {
    const { spy, onClose } = setup();

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith();
    expect(spy.saveCourse).not.toHaveBeenCalled();
  });

  it('should not close on Escape (disableClose)', async () => {
    const { onClose } = setup();

    await userEvent.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should save the titles and close with the form value on Save', async () => {
    const { spy, onClose } = setup();
    spy.saveCourse.mockResolvedValue(course);

    const description = screen.getByRole('textbox', { name: 'Course Description' });
    await userEvent.clear(description);
    await userEvent.type(description, 'New title');
    await userEvent.click(screen.getByRole('combobox', { name: 'Select category' }));
    await userEvent.click(screen.getByRole('option', { name: 'Advanced' }));
    const longDescription = screen.getByRole('textbox', { name: 'Description' });
    await userEvent.clear(longDescription);
    await userEvent.type(longDescription, 'New long description');

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(spy.saveCourse).toHaveBeenCalledTimes(1);
    expect(spy.saveCourse).toHaveBeenCalledWith(course.id, {
      titles: { description: 'New title', longDescription: 'New long description' },
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    const result = onClose.mock.calls[0][0];
    expect(result).toEqual({
      description: 'New title',
      category: 'ADVANCED',
      releasedAt: expect.any(String),
      longDescription: 'New long description',
    });
    expect(dayjs(result.releasedAt).isSame(dayjs(), 'day')).toBe(true);
    expect(result.releasedAt).toBe(new Date(result.releasedAt).toISOString());
  });

  it('should only close after saveCourse resolves', async () => {
    const { spy, onClose } = setup();
    let resolve!: (c: typeof course) => void;
    spy.saveCourse.mockReturnValue(new Promise((r) => (resolve = r)));

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClose).not.toHaveBeenCalled();

    resolve(course);
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('should stay open when saveCourse fails', async () => {
    const { spy, onClose } = setup();
    const error = new Error('boom');
    spy.saveCourse.mockRejectedValue(error);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(consoleError).toHaveBeenCalledWith(error));
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // Legacy parity: Angular's save() ignores form validity.
  it('should not block Save on an invalid (empty) form', async () => {
    const { spy, onClose } = setup();
    spy.saveCourse.mockResolvedValue(course);

    await userEvent.clear(screen.getByRole('textbox', { name: 'Course Description' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(spy.saveCourse).toHaveBeenCalledWith(course.id, {
      titles: { description: '', longDescription: course.titles.longDescription },
    });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('should show the required error state once an emptied field is touched', async () => {
    setup();

    const description = screen.getByRole('textbox', { name: 'Course Description' });
    expect(description).not.toHaveAttribute('aria-invalid', 'true');
    await userEvent.clear(description);
    await userEvent.tab();

    expect(description).toHaveAttribute('aria-invalid', 'true');
  });
});
