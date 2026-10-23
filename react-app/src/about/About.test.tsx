import { render, screen } from '@testing-library/react';
import { About, ABOUT_IMAGE_URL } from './About';

describe('About', () => {
  it('renders the welcome heading and text', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 1, name: 'Welcome!' })).toBeInTheDocument();
    expect(screen.getByText('Welcome to the Angular Testing Course')).toBeInTheDocument();
  });

  it('renders the course image with the classes the legacy template actually applies', () => {
    render(<About />);

    const img = screen.getByRole('img', { name: 'Angular Testing Course' });
    expect(img).toHaveAttribute('src', ABOUT_IMAGE_URL);
    expect(img.className).toBe('course-image mat-elevation-z10');
    expect(img).not.toHaveClass('course-logo');
  });

  it('wraps the content in the shared .container', () => {
    const { container } = render(<About />);

    expect(container.firstElementChild).toHaveClass('container');
  });
});
