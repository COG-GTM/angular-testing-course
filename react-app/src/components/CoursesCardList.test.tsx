import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CoursesCardList from './CoursesCardList';
import type { Course } from '../types/course';

function makeCourse(id: number, description: string): Course {
  return {
    id,
    seqNo: id,
    titles: { description, longDescription: `Long ${description}` },
    iconUrl: 'https://example.com/icon.png',
    uploadedImageUrl: '',
    courseListIcon: '',
    category: 'BEGINNER',
    lessonsCount: 5,
  };
}

describe('CoursesCardList', () => {
  const courses = [makeCourse(1, 'Course One'), makeCourse(2, 'Course Two')];

  it('renders one card per course', () => {
    render(
      <MemoryRouter>
        <CoursesCardList courses={courses} onCourseEdited={() => {}} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Course One')).toBeInTheDocument();
    expect(screen.getByText('Course Two')).toBeInTheDocument();
    expect(screen.getAllByText('VIEW COURSE')).toHaveLength(2);
  });

  it('opens the edit dialog when EDIT is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CoursesCardList courses={courses} onCourseEdited={vi.fn()} />
      </MemoryRouter>,
    );

    await user.click(screen.getAllByText('EDIT')[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Course Description')).toHaveValue(
      'Course One',
    );
  });
});
