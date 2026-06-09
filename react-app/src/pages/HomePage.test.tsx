import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { coursesService } from '../services/courses.service';
import type { Course } from '../types/course';

function makeCourse(id: number, category: string, seqNo: number): Course {
  return {
    id,
    seqNo,
    titles: { description: `Course ${id}`, longDescription: `Long ${id}` },
    iconUrl: 'https://example.com/icon.png',
    uploadedImageUrl: '',
    courseListIcon: '',
    category,
    lessonsCount: 5,
  };
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows Beginners and Advanced tabs and lists beginner courses by default', async () => {
    vi.spyOn(coursesService, 'findAllCourses').mockResolvedValue([
      makeCourse(1, 'BEGINNER', 0),
      makeCourse(2, 'ADVANCED', 1),
      makeCourse(3, 'BEGINNER', 2),
    ]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('All Courses')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Beginners')).toBeInTheDocument();
    });
    expect(screen.getByText('Advanced')).toBeInTheDocument();

    // Default (Beginners) tab shows the two beginner courses.
    expect(screen.getByText('Course 1')).toBeInTheDocument();
    expect(screen.getByText('Course 3')).toBeInTheDocument();
  });

  it('switches to the Advanced tab when clicked', async () => {
    vi.spyOn(coursesService, 'findAllCourses').mockResolvedValue([
      makeCourse(1, 'BEGINNER', 0),
      makeCourse(2, 'ADVANCED', 1),
    ]);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await waitFor(() => screen.getByText('Advanced'));
    await user.click(screen.getByText('Advanced'));

    expect(screen.getByText('Course 2')).toBeInTheDocument();
  });
});
