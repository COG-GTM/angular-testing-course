import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { http, HttpResponse } from 'msw';
import { AppProviders } from './AppProviders';
import { routes } from './router';
import { server } from './test/server';

// Feature barrels are mocked so wave-2 PRs replacing the placeholders don't turn this test red.
vi.mock('./app', () => ({ AppToolbar: () => <nav aria-label="toolbar stub" /> }));
vi.mock('./about', () => ({ About: () => <h1>About stub</h1> }));
vi.mock('./courses/home', () => ({ Home: () => <h1>Home stub</h1> }));
vi.mock('./courses/course', async () => {
  const { useLoaderData } = await import('react-router');
  return {
    CoursePage: () => {
      const course = useLoaderData() as { titles: { description: string } };
      return <h1>Course stub: {course.titles.description}</h1>;
    },
  };
});

function renderAt(url: string) {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return router;
}

describe('router', () => {
  it('renders Home inside the toolbar layout at /', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { name: 'Home stub' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'toolbar stub' })).toBeInTheDocument();
  });

  it('renders About at /about', async () => {
    renderAt('/about');
    expect(await screen.findByRole('heading', { name: 'About stub' })).toBeInTheDocument();
  });

  it('resolves the course with courseLoader before rendering /courses/:id', async () => {
    renderAt('/courses/12');
    expect(await screen.findByRole('heading', { name: 'Course stub: Angular Testing Course' })).toBeInTheDocument();
  });

  it('shows an error for an unknown course id', async () => {
    renderAt('/courses/999');
    expect(await screen.findByRole('alert')).toHaveTextContent('Course not found');
  });

  it('shows an error when the course request fails', async () => {
    server.use(http.get('/api/courses/:id', () => new HttpResponse(null, { status: 500 })));
    renderAt('/courses/12');
    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('redirects unknown URLs to /', async () => {
    const router = renderAt('/nope');
    expect(await screen.findByRole('heading', { name: 'Home stub' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });
});
