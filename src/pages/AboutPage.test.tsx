import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
  it('renders the welcome heading', () => {
    render(<AboutPage />);
    expect(
      screen.getByRole('heading', { name: /welcome to the angular testing course/i }),
    ).toBeInTheDocument();
  });
});
