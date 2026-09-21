import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './App';
import { Home } from './courses/home/Home';
import { About } from './about/About';
import { Course } from './courses/course/Course';
import { courseLoader } from './courses/services/courseLoader';

// Mirrors ../src/app/app-routing.module.ts
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'courses/:id', element: <Course />, loader: courseLoader },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
