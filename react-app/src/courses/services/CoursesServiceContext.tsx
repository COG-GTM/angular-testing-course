import { createContext, ReactNode, useContext } from 'react';
import { CoursesService, coursesService } from './CoursesService';

const CoursesServiceContext = createContext<CoursesService>(coursesService);

export interface CoursesServiceProviderProps {
  service?: CoursesService;
  children: ReactNode;
}

// Equivalent of Angular DI for CoursesService; pass `service` to inject a mock in tests.
export const CoursesServiceProvider = ({ service = coursesService, children }: CoursesServiceProviderProps) => (
  <CoursesServiceContext.Provider value={service}>{children}</CoursesServiceContext.Provider>
);

export const useCoursesService = (): CoursesService => useContext(CoursesServiceContext);
