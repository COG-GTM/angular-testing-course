import { createContext, useContext, type ReactNode } from 'react';
import { coursesService, type CoursesService } from './coursesService';

const CoursesServiceContext = createContext<CoursesService>(coursesService);

export interface CoursesServiceProviderProps {
  value?: CoursesService;
  children: ReactNode;
}

/** DI equivalent of Angular's `providers: [{provide: CoursesService, useValue: spy}]`. */
export function CoursesServiceProvider({ value = coursesService, children }: CoursesServiceProviderProps) {
  return <CoursesServiceContext.Provider value={value}>{children}</CoursesServiceContext.Provider>;
}

export function useCoursesService(): CoursesService {
  return useContext(CoursesServiceContext);
}
