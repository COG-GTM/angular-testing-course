import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';

const renderApp = (initialPath = '/') => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <div>Home page</div> },
          { path: 'about', element: <div>About page</div> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );
  return render(<RouterProvider router={router} />);
};

describe('App', () => {
  it('should render the toolbar with COURSES and ABOUT links', () => {
    renderApp();

    expect(screen.getByRole('link', { name: 'COURSES' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveAttribute('href', '/about');
  });

  it('should render the routed child in the outlet', () => {
    renderApp('/about');

    expect(screen.getByText('About page')).toBeInTheDocument();
    expect(screen.queryByText('Home page')).not.toBeInTheDocument();
  });
});
