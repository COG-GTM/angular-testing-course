import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme } from './theme';
import { CoursesServiceProvider } from './courses/services/CoursesServiceContext';
import type { CoursesService } from './courses/services/coursesService';

export interface AppProvidersProps {
  coursesService?: CoursesService;
  children: ReactNode;
}

/** App-wide providers (Angular Material theme, MatMomentDateModule, CoursesService DI equivalents). */
export function AppProviders({ coursesService, children }: AppProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CoursesServiceProvider value={coursesService}>{children}</CoursesServiceProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
