import type { ReactElement } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, type LoaderFunction, type RouteObject } from 'react-router';
import { AppProviders } from '../../AppProviders';
import type { CoursesService } from '../services/coursesService';

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper' | 'queries'> {
  /** Service injected through `CoursesServiceProvider` (e.g. a `vi.fn()` spy object). Defaults to the real fetch service. */
  coursesService?: CoursesService;
  /** Initial URL of the memory router. Default `'/'`. */
  route?: string;
  /** Route pattern `ui` is mounted at, e.g. `'/courses/:id'`. Default `'*'` (matches any `route`). */
  path?: string;
  /** Optional loader for the route `ui` is mounted at (e.g. `() => course` for `useLoaderData()`). */
  loader?: LoaderFunction;
  /** Extra sibling routes (e.g. `{ path: '/', element: <div>home</div> }`) to assert navigation. */
  routes?: RouteObject[];
}

export type RenderWithProvidersResult = RenderResult & {
  router: ReturnType<typeof createMemoryRouter>;
};

/**
 * TestBed equivalent: renders `ui` inside the MUI theme, the dayjs LocalizationProvider,
 * `CoursesServiceProvider` and a memory data router.
 * When a `loader` is given the first render is async, so use `findBy*` queries.
 */
export function renderWithProviders(
  ui: ReactElement,
  { coursesService, route = '/', path = '*', loader, routes = [], ...renderOptions }: RenderWithProvidersOptions = {},
): RenderWithProvidersResult {
  const router = createMemoryRouter(
    [{ path, element: ui, loader, HydrateFallback: () => null }, ...routes],
    { initialEntries: [route] },
  );
  const result = render(
    <AppProviders coursesService={coursesService}>
      <RouterProvider router={router} />
    </AppProviders>,
    renderOptions,
  );
  return { ...result, router };
}

/** Typed `vi.fn()` spy object for `CoursesService` (Angular: `jasmine.createSpyObj('CoursesService', [...])`). */
export function createCoursesServiceSpy() {
  return {
    findCourseById: vi.fn<CoursesService['findCourseById']>(),
    findAllCourses: vi.fn<CoursesService['findAllCourses']>(),
    saveCourse: vi.fn<CoursesService['saveCourse']>(),
    findLessons: vi.fn<CoursesService['findLessons']>(),
  } satisfies CoursesService;
}

export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 },
};

/** Port of the Angular `click()` test helper. Prefer `userEvent` in new tests. */
export function click(el: HTMLElement): void {
  el.click();
}
