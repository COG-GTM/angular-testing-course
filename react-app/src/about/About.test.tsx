import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from './About';

describe('About', () => {
  it('should render the welcome heading and text', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome!');
    expect(screen.getByText('Welcome to the Angular Testing Course')).toBeInTheDocument();
  });

  it('should render the course logo', () => {
    render(<About />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      'https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png',
    );
    expect(img).toHaveClass('course-logo');
  });
});
