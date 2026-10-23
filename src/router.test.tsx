import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { http, HttpResponse } from 'msw';
import { AppProviders } from './AppProviders';
import { routes } from './router';
import { server } from './test/server';
import { COURSES } from '../server/db-data';
import type { Course } from './courses/model/course';

function renderAt(url: string) {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return router;
}

/** Stateful copy of the Express API so a PUT is visible to the next GET (like server/save-course.route.ts). */
function useStatefulCoursesApi() {
  const courses = structuredClone(Object.values(COURSES)) as Course[];
  const requests = { list: 0, save: [] as Partial<Course>[] };
  server.use(
    http.get('/api/courses', () => {
      requests.list++;
      return HttpResponse.json({ payload: courses });
    }),
    http.put('/api/courses/:id', async ({ params, request }) => {
      const changes = (await request.json()) as Partial<Course>;
      requests.save.push(changes);
      const course = courses.find((c) => c.id === Number(params.id))!;
      Object.assign(course, changes);
      return HttpResponse.json(course);
    }),
  );
  return requests;
}

describe('router', () => {
  it('renders the real Home page inside the toolbar layout at /', async () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'COURSES' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('heading', { name: 'All Courses' })).toBeInTheDocument();
    expect(await screen.findByRole('tab', { name: 'Beginners' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Advanced' })).toBeInTheDocument();
    expect(await screen.findByRole('region', { name: 'Angular Testing Course' })).toBeInTheDocument();
  });

  it('renders About at /about', async () => {
    renderAt('/about');
    expect(await screen.findByRole('heading', { name: 'Welcome!' })).toBeInTheDocument();
  });

  it('resolves the course with courseLoader before rendering /courses/:id', async () => {
    renderAt('/courses/12');
    expect(await screen.findByRole('heading', { name: 'Angular Testing Course' })).toBeInTheDocument();
    expect(await screen.findByText('Angular Testing Course - Helicopter View')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
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
    expect(await screen.findByRole('heading', { name: 'All Courses' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('navigates between pages with the toolbar links', async () => {
    const user = userEvent.setup();
    const router = renderAt('/');
    await user.click(screen.getByRole('link', { name: 'ABOUT' }));
    expect(await screen.findByRole('heading', { name: 'Welcome!' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'COURSES' }));
    expect(await screen.findByRole('heading', { name: 'All Courses' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });
});

describe('integration: Home → course page / edit dialog', () => {
  it('Home → VIEW COURSE → course page with its lessons', async () => {
    const user = userEvent.setup();
    const router = renderAt('/');
    const card = await screen.findByRole('region', { name: 'Angular Testing Course' });

    await user.click(within(card).getByRole('button', { name: 'VIEW COURSE' }));

    expect(await screen.findByRole('heading', { level: 2, name: 'Angular Testing Course' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/courses/12');
    expect(await screen.findByText('Angular Testing Course - Helicopter View')).toBeInTheDocument();
  });

  it('EDIT → Save persists the titles and reloads the course list', async () => {
    const requests = useStatefulCoursesApi();
    const user = userEvent.setup();
    renderAt('/');
    const card = await screen.findByRole('region', { name: 'Angular Testing Course' });
    expect(requests.list).toBe(1);

    await user.click(within(card).getByRole('button', { name: 'EDIT' }));
    const dialog = await screen.findByRole('dialog');
    const description = within(dialog).getByRole('textbox', { name: 'Course Description' });
    await user.clear(description);
    await user.type(description, 'Testing — the React way');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(await screen.findByRole('region', { name: 'Testing — the React way' })).toBeInTheDocument();
    expect(requests.list).toBe(2);
    expect(requests.save).toEqual([
      { titles: { description: 'Testing — the React way', longDescription: expect.any(String) } },
    ]);
  });
});
