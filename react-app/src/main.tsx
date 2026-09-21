import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './router';
import { theme } from './theme';
import { CoursesServiceProvider } from './courses/services/CoursesServiceContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CoursesServiceProvider>
        <RouterProvider router={router} />
      </CoursesServiceProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
