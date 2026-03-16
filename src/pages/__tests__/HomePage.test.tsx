import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';
import { setupCourses } from '../../test-data/db-data';

vi.mock('../../services/courses-service', () => ({
  findAllCourses: vi.fn(),
}));

import { findAllCourses } from '../../services/courses-service';

const mockFindAllCourses = vi.mocked(findAllCourses);

const allCourses = setupCourses();
const beginnerCourses = allCourses.filter((c) => c.category === 'BEGINNER');
const advancedCourses = allCourses.filter((c) => c.category === 'ADVANCED');

function renderHomePage() {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create the component', async () => {
    mockFindAllCourses.mockResolvedValue([]);
    renderHomePage();
    expect(screen.getByText('All Courses')).toBeInTheDocument();
  });

  it('should display only beginner courses', async () => {
    mockFindAllCourses.mockResolvedValue(beginnerCourses);
    renderHomePage();

    await waitFor(() => {
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);
      expect(tabs[0]).toHaveTextContent('Beginners');
    });
  });

  it('should display only advanced courses', async () => {
    mockFindAllCourses.mockResolvedValue(advancedCourses);
    renderHomePage();

    await waitFor(() => {
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);
      expect(tabs[0]).toHaveTextContent('Advanced');
    });
  });

  it('should display both tabs', async () => {
    mockFindAllCourses.mockResolvedValue(allCourses);
    renderHomePage();

    await waitFor(() => {
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);
    });
  });

  it('should display advanced courses when tab clicked', async () => {
    mockFindAllCourses.mockResolvedValue(allCourses);
    renderHomePage();

    await waitFor(() => {
      expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    const user = userEvent.setup();
    const advancedTab = screen.getByRole('tab', { name: 'Advanced' });
    await user.click(advancedTab);

    await waitFor(() => {
      const cardTitles = screen.getAllByText(/Angular Security Course/);
      expect(cardTitles.length).toBeGreaterThan(0);
    });
  });
});
