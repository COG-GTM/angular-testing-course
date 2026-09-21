import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { CoursesService } from '../services/CoursesService';
import { CoursesServiceProvider } from '../services/CoursesServiceContext';
import { setupCourses } from '../common/setupTestData';
import { Course } from '../model/course';

// Port of src/app/courses/home/home.component.spec.ts
describe('Home', () => {
  const beginnerCourses = setupCourses().filter((course) => course.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter((course) => course.category === 'ADVANCED');

  let coursesService: CoursesService;
  let findAllCourses: ReturnType<typeof vi.fn<() => Promise<Course[]>>>;

  beforeEach(() => {
    findAllCourses = vi.fn<() => Promise<Course[]>>();
    coursesService = { findAllCourses } as unknown as CoursesService;
  });

  const renderHome = async () => {
    let result: ReturnType<typeof render> | undefined;
    await act(async () => {
      result = render(
        <MemoryRouter>
          <CoursesServiceProvider service={coursesService}>
            <Home />
          </CoursesServiceProvider>
        </MemoryRouter>,
      );
    });
    return result!;
  };

  it('should create the component', async () => {
    findAllCourses.mockResolvedValue([]);
    const { container } = await renderHome();
    expect(container.querySelector('.container')).toBeTruthy();
    expect(screen.getByText('All Courses')).toBeInTheDocument();
  });

  it('should display only beginner courses', async () => {
    findAllCourses.mockResolvedValue(beginnerCourses);
    await renderHome();
    const tabs = await screen.findAllByRole('tab');
    expect(tabs, 'Unexpected number of tabs found').toHaveLength(1);
    expect(tabs[0]).toHaveTextContent('Beginners');
  });

  it('should display only advanced courses', async () => {
    findAllCourses.mockResolvedValue(advancedCourses);
    await renderHome();
    const tabs = await screen.findAllByRole('tab');
    expect(tabs, 'Unexpected number of tabs found').toHaveLength(1);
    expect(tabs[0]).toHaveTextContent('Advanced');
  });

  it('should display both tabs', async () => {
    findAllCourses.mockResolvedValue(setupCourses());
    await renderHome();
    const tabs = await screen.findAllByRole('tab');
    expect(tabs, 'Expected to find 2 tabs').toHaveLength(2);
  });

  // Equivalent of the fakeAsync test: advance through the click and settle with waitFor.
  it('should display advanced courses when tab clicked - fakeAsync', async () => {
    findAllCourses.mockResolvedValue(setupCourses());
    const { container } = await renderHome();
    const tabs = await screen.findAllByRole('tab');

    fireEvent.click(tabs[1]);

    await waitFor(() => {
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });
    const activeBody = container.querySelector('.tab-body-active');
    expect(activeBody, 'Could not find active tab body').toBeTruthy();
    expect(activeBody).not.toHaveAttribute('hidden');
    expect(activeBody).toHaveAttribute('aria-labelledby', 'home-tab-Advanced');
  });

  // Equivalent of the waitForAsync test: await the pending promises after the click.
  it('should display advanced courses when tab clicked - async', async () => {
    findAllCourses.mockResolvedValue(setupCourses());
    const { container } = await renderHome();
    const tabs = await screen.findAllByRole('tab');

    await act(async () => {
      fireEvent.click(tabs[1]);
    });

    const activeBody = container.querySelector('.tab-body-active');
    expect(activeBody, 'Could not find active tab body').toBeTruthy();
    expect(activeBody).toHaveAttribute('aria-labelledby', 'home-tab-Advanced');
    expect(container.querySelectorAll('[role="tabpanel"]:not([hidden])')).toHaveLength(1);
  });
});
