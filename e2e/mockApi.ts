import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Page, Route } from '@playwright/test';
import { LESSONS } from '../server/db-data';

// Fixtures ported from the legacy Cypress suite (cypress/fixtures/*.json).
const fixturesDir = fileURLToPath(new URL('./fixtures/', import.meta.url));

export function fixture<T = unknown>(name: string): T {
  return JSON.parse(readFileSync(`${fixturesDir}${name}`, 'utf8')) as T;
}

export interface FixtureLesson {
  id: number;
  description: string;
  duration: string;
  seqNo: number;
  courseId: number;
}

/** Every lesson in server/db-data.ts, the same data the Express API serves. */
const allLessons = Object.values(LESSONS) as FixtureLesson[];

/** Same filtering / sorting / paging as server/search-lessons.route.ts (without the 1 s delay unless `delayMs` is set). */
function searchLessons(url: URL): FixtureLesson[] {
  const filter = url.searchParams.get('filter') ?? '';
  const sortOrder = url.searchParams.get('sortOrder');
  const pageNumber = parseInt(url.searchParams.get('pageNumber') ?? '', 10) || 0;
  const pageSize = parseInt(url.searchParams.get('pageSize') ?? '', 10);
  let lessons = allLessons
    .filter((l) => l.courseId === Number(url.searchParams.get('courseId')))
    .sort((l1, l2) => l1.id - l2.id);
  if (filter) lessons = lessons.filter((l) => l.description.trim().toLowerCase().includes(filter.toLowerCase()));
  if (sortOrder === 'desc') lessons = [...lessons].reverse();
  return lessons.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize);
}

export interface MockApiOptions {
  /** Delay for GET /api/lessons (the Express server waits 1 s). */
  lessonsDelayMs?: number;
  /** Called for every PUT /api/courses/:id with the parsed body. */
  onSave?: (id: number, body: unknown) => void;
}

/** Mocks every `/api/**` call with page.route (the e2e preview server has no API). Register before `page.goto`. */
export async function mockApi(page: Page, { lessonsDelayMs = 0, onSave }: MockApiOptions = {}): Promise<void> {
  const courses = fixture<{ payload: { id: number; titles: object }[] }>('courses.json');
  await page.route('**/api/**', async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === '/api/courses') {
      return route.fulfill({ json: courses });
    }
    const courseMatch = url.pathname.match(/^\/api\/courses\/(\d+)$/);
    if (courseMatch && request.method() === 'PUT') {
      const id = Number(courseMatch[1]);
      const body = request.postDataJSON() as { titles: object };
      onSave?.(id, body);
      const course = courses.payload.find((c) => c.id === id)!;
      Object.assign(course, body);
      return route.fulfill({ json: course });
    }
    if (url.pathname === '/api/courses/12') {
      return route.fulfill({ json: fixture('testing-course.json') });
    }
    if (url.pathname === '/api/lessons') {
      if (lessonsDelayMs) await new Promise((resolve) => setTimeout(resolve, lessonsDelayMs));
      return route.fulfill({ json: { payload: searchLessons(url) } });
    }
    return route.fulfill({ status: 404, body: 'Not mocked' });
  });
}
