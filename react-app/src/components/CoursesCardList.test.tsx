import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CoursesCardList } from './CoursesCardList';
import { setupCourses } from '../test/setup-test-data';

function renderCardList(courses = setupCourses()) {
  return render(
    <MemoryRouter>
      <CoursesCardList courses={courses} />
    </MemoryRouter>,
  );
}

describe('CoursesCardList', () => {
  it('should create the component', () => {
    const { container } = renderCardList([]);

    expect(container).toBeTruthy();
  });

  it('should display the course list', () => {
    const { container } = renderCardList();

    const cards = container.querySelectorAll('.course-card');

    expect(cards.length).toBe(12);
  });

  it('should display the first course', () => {
    const courses = setupCourses();
    const { container } = renderCardList(courses);

    const course = courses[0];
    const card = container.querySelector('.course-card');
    const title = card?.querySelector('.card-title');
    const image = card?.querySelector('img');

    expect(card).toBeTruthy();
    expect(title?.textContent).toBe(course.titles.description);
    expect(image?.getAttribute('src')).toBe(course.iconUrl);
  });

  it('should link each course to its course page', () => {
    const courses = setupCourses();
    renderCardList(courses);

    const links = screen.getAllByRole('link', { name: 'VIEW COURSE' });

    expect(links[0]).toHaveAttribute('href', `/courses/${courses[0].id}`);
  });
});
