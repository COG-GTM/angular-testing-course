import { useState, useEffect, useCallback } from 'react';
import { Course } from '../model/course';
import { sortCoursesBySeqNo } from './sort-course-by-seq';

/**
 * Props for the React HomeComponent.
 *
 * fetchAllCourses: a function that returns a Promise resolving to Course[].
 *   This replaces the Angular CoursesService.findAllCourses() dependency.
 *
 * TODO: CoursesCardListComponent — the Angular child component <courses-card-list>
 *   needs a React equivalent. For now, we accept a render prop or use a placeholder.
 */
interface HomeComponentProps {
  fetchAllCourses: () => Promise<Course[]>;
  /** Optional callback when a course is edited (mirrors Angular's (courseEdited) event) */
  onCourseEdited?: () => void;
}

/**
 * React equivalent of the Angular HomeComponent.
 *
 * Displays categorized course listings, separating them into
 * beginner and advanced courses — matching the Angular version 1:1.
 */
export const HomeComponent: React.FC<HomeComponentProps> = ({
  fetchAllCourses,
  onCourseEdited,
}) => {
  const [beginnerCourses, setBeginnerCourses] = useState<Course[]>([]);
  const [advancedCourses, setAdvancedCourses] = useState<Course[]>([]);

  /**
   * Mirrors Angular's filterByCategory method.
   * Filters courses by category and sorts by seqNo.
   */
  const filterByCategory = useCallback(
    (courses: Course[], category: string): Course[] => {
      return courses
        .filter((course) => course.category === category)
        .sort(sortCoursesBySeqNo);
    },
    []
  );

  /**
   * Mirrors Angular's reloadCourses method.
   * Fetches all courses and categorizes them into BEGINNER and ADVANCED.
   * Called on mount (ngOnInit equivalent) and when courses are edited.
   */
  const reloadCourses = useCallback(async () => {
    const courses = await fetchAllCourses();
    setBeginnerCourses(filterByCategory(courses, 'BEGINNER'));
    setAdvancedCourses(filterByCategory(courses, 'ADVANCED'));
  }, [fetchAllCourses, filterByCategory]);

  /**
   * ngOnInit equivalent: fetch and categorize courses on mount.
   */
  useEffect(() => {
    reloadCourses();
  }, [reloadCourses]);

  /**
   * Handler for when a course is edited in a child component.
   * Reloads courses (mirrors Angular template's (courseEdited)="reloadCourses()").
   */
  const handleCourseEdited = useCallback(() => {
    reloadCourses();
    if (onCourseEdited) {
      onCourseEdited();
    }
  }, [reloadCourses, onCourseEdited]);

  return (
    <div className="container">
      <h3>All Courses</h3>

      {/* TODO: Replace with Material UI Tabs or equivalent React tab component.
          Angular original uses <mat-tab-group> and <mat-tab> from @angular/material. */}
      <div>
        {/* Beginner Courses Tab — mirrors *ngIf="(beginnerCourses$ | async) as beginnerCourses" */}
        {beginnerCourses.length > 0 && (
          <div>
            <h4>Beginners</h4>
            {/* TODO: Replace with React version of CoursesCardListComponent.
                Angular original: <courses-card-list [courses]="beginnerCourses"
                                                     (courseEdited)="reloadCourses()"> */}
            <div data-testid="beginner-courses">
              {beginnerCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <span>{course.titles.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Courses Tab — mirrors *ngIf="(advancedCourses$ | async) as advancedCourses" */}
        {advancedCourses.length > 0 && (
          <div>
            <h4>Advanced</h4>
            {/* TODO: Replace with React version of CoursesCardListComponent.
                Angular original: <courses-card-list [courses]="advancedCourses"
                                                     (courseEdited)="reloadCourses()"> */}
            <div data-testid="advanced-courses">
              {advancedCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <span>{course.titles.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
