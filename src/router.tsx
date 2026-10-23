import { createBrowserRouter, isRouteErrorResponse, Outlet, redirect, useRouteError, type RouteObject } from 'react-router';
import { AppToolbar } from './app';
import { About } from './about';
import { Home } from './courses/home';
import { CoursePage } from './courses/course';
import { courseLoader } from './courses/services/courseLoader';
import { HttpError } from './courses/services/coursesService';

/** Port of app.component.html: toolbar + `<router-outlet>`. */
export function AppLayout() {
  return (
    <>
      <AppToolbar />
      <Outlet />
    </>
  );
}

export function RouteErrorBoundary() {
  const error = useRouteError();
  const status = error instanceof HttpError ? error.status : isRouteErrorResponse(error) ? error.status : undefined;
  return (
    <div className="container" role="alert">
      <h2>{status === 404 ? 'Course not found' : 'Something went wrong'}</h2>
    </div>
  );
}

/** Port of app-routing.module.ts. */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    HydrateFallback: () => null,
    children: [
      {
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: <Home /> },
          { path: 'about', element: <About /> },
          { path: 'courses/:id', element: <CoursePage />, loader: courseLoader },
          { path: '*', loader: () => redirect('/') },
        ],
      },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
