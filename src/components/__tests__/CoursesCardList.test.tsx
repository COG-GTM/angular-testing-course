import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CoursesCardList from '../CoursesCardList';
import { setupCourses } from '../../test-data/db-data';

vi.mock('../../services/courses-service', () => ({
  saveCourse: vi.fn(),
}));

const beginnerCourses = setupCourses().filter((c) => c.category === 'BEGINNER');

function renderComponent() {
  return render(
    <BrowserRouter>
      <CoursesCardList courses={beginnerCourses} onCourseEdited={vi.fn()} />
    </BrowserRouter>
  );
}

describe('CoursesCardList', () => {
  it('should render the correct number of cards', () => {
    renderComponent();
    const cards = screen.getAllByTestId('course-card');
    expect(cards.length).toBe(beginnerCourses.length);
  });

  it('should display the first card title', () => {
    renderComponent();
    expect(
      screen.getByText(beginnerCourses[0].titles.description)
    ).toBeInTheDocument();
  });
});
