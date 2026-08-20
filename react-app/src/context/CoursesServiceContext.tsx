import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { CoursesService, coursesService } from '../services/courses.service';

const CoursesServiceContext = createContext<CoursesService>(coursesService);

export function CoursesServiceProvider({
  service = coursesService,
  children,
}: {
  service?: CoursesService;
  children: ReactNode;
}) {
  return (
    <CoursesServiceContext.Provider value={service}>{children}</CoursesServiceContext.Provider>
  );
}

export function useCoursesService(): CoursesService {
  return useContext(CoursesServiceContext);
}
