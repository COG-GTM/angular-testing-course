import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import type { Course } from '../model/course';
import { useCoursesService } from '../services';
import { sortCoursesBySeqNo } from '../common/sortCoursesBySeqNo';
import { CoursesCardList } from '../courses-card-list';

interface CategoryTab {
  key: string;
  label: string;
  courses: Course[];
}

const CATEGORY_TABS = [
  { key: 'BEGINNER', label: 'Beginners' },
  { key: 'ADVANCED', label: 'Advanced' },
] as const;

interface Selection {
  key: string;
  index: number;
}

function filterByCategory(courses: Course[], category: string): Course[] {
  return courses.filter((course) => course.category === category).sort(sortCoursesBySeqNo);
}

function buildTabs(courses: Course[]): CategoryTab[] {
  return CATEGORY_TABS.map(({ key, label }) => ({ key, label, courses: filterByCategory(courses, key) })).filter(
    (tab) => tab.courses.length > 0,
  );
}

// Like MatTabGroup: keep the selected tab when the tab list changes, otherwise clamp the old index.
function reconcileSelection(prev: Selection, tabs: CategoryTab[]): Selection {
  if (tabs.length === 0) return prev;
  const keyIndex = tabs.findIndex((tab) => tab.key === prev.key);
  const index = keyIndex >= 0 ? keyIndex : Math.min(prev.index, tabs.length - 1);
  return index === prev.index && tabs[index].key === prev.key ? prev : { key: tabs[index].key, index };
}

// Angular Material 19 M2 `mat-tab-group` (stretched MDC tabs) look.
const tabsSx = {
  minHeight: 48,
  '& .MuiTabs-indicator': { height: 2 },
} as const;

const tabSx = {
  flexBasis: 'auto',
  minHeight: 48,
  minWidth: 90,
  padding: '0 24px',
  fontFamily: 'Roboto, sans-serif',
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: '1.25px',
  lineHeight: '14px',
  textTransform: 'none',
  color: 'rgba(0, 0, 0, 0.6)',
  opacity: 1,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  // MDC tab state layer (primary): 4% on hover, 12% on keyboard focus.
  '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.04)' },
  '&.Mui-focusVisible': { backgroundColor: 'rgba(0, 150, 136, 0.12)' },
  '&.Mui-selected': { color: 'primary.main' },
} as const;

/** Port of home.component.{ts,html}: "All Courses" with Beginners / Advanced tabs. */
export function Home() {
  const coursesService = useCoursesService();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [selected, setSelected] = useState<Selection>({ key: CATEGORY_TABS[0].key, index: 0 });
  const pending = useRef<AbortController | null>(null);

  const reloadCourses = useCallback(() => {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    coursesService.findAllCourses({ signal: controller.signal }).then(
      (result) => {
        if (controller.signal.aborted) return;
        setCourses(result);
        setSelected((prev) => reconcileSelection(prev, buildTabs(result)));
      },
      (error: unknown) => {
        if (!controller.signal.aborted) console.error(error);
      },
    );
  }, [coursesService]);

  useEffect(() => {
    reloadCourses();
    return () => pending.current?.abort();
  }, [reloadCourses]);

  const tabs = courses ? buildTabs(courses) : [];
  const selectedIndex = tabs.findIndex((tab) => tab.key === selected.key);
  const activeTab = tabs[selectedIndex];

  const handleChange = (_event: SyntheticEvent, index: number) => {
    setSelected({ key: tabs[index].key, index });
  };

  return (
    <div className="container">
      <h3>All Courses</h3>

      <Box>
        <Tabs value={activeTab ? selectedIndex : false} onChange={handleChange} variant="fullWidth" sx={tabsSx}>
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              label={tab.label}
              id={`home-tab-${tab.key}`}
              aria-controls={`home-tabpanel-${tab.key}`}
              sx={tabSx}
            />
          ))}
        </Tabs>

        {activeTab && (
          <div role="tabpanel" id={`home-tabpanel-${activeTab.key}`} aria-labelledby={`home-tab-${activeTab.key}`}>
            <CoursesCardList courses={activeTab.courses} onCourseEdited={reloadCourses} />
          </div>
        )}
      </Box>
    </div>
  );
}
