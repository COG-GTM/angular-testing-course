import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { CoursesServiceProvider } from '../context/CoursesServiceContext';
import { CoursesService } from '../services/courses.service';
import { setupCourses } from '../test/setup-test-data';

const beginnerCourses = setupCourses().filter((course) => course.category === 'BEGINNER');
const advancedCourses = setupCourses().filter((course) => course.category === 'ADVANCED');

function renderHome(courses: ReturnType<typeof setupCourses>) {
  const service = new CoursesService();
  vi.spyOn(service, 'findAllCourses').mockResolvedValue(courses);

  const result = render(
    <CoursesServiceProvider service={service}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </CoursesServiceProvider>,
  );

  return { ...result, service };
}

describe('Home', () => {
  it('should create the component', () => {
    const { container } = renderHome([]);

    expect(container).toBeTruthy();
  });

  it('should display only beginner courses', async () => {
    renderHome(beginnerCourses);

    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(1));
    expect(screen.getByRole('tab')).toHaveTextContent('Beginners');
  });

  it('should display only advanced courses', async () => {
    renderHome(advancedCourses);

    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(1));
    expect(screen.getByRole('tab')).toHaveTextContent('Advanced');
  });

  it('should display both tabs', async () => {
    renderHome(setupCourses());

    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(2));
  });

  it('should display advanced courses when tab clicked', async () => {
    const { container } = renderHome(setupCourses());

    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(2));

    await userEvent.click(screen.getAllByRole('tab')[1]);

    const cardTitles = container.querySelectorAll('.tab-body-active .card-title');

    expect(cardTitles.length).toBeGreaterThan(0);
    expect(cardTitles[0].textContent).toContain('Angular Security Course');
  });
});
