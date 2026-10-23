import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

// Fixtures ported from the legacy Cypress suite.
const fixturesDir = fileURLToPath(new URL('./fixtures/', import.meta.url));

export function fixture(name: string): unknown {
  return JSON.parse(readFileSync(`${fixturesDir}${name}`, 'utf8'));
}

/** Mocks every `/api/**` call (the preview server has no proxy). Register before `page.goto`. */
export async function mockApi(page: Page): Promise<void> {
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/courses') {
      return route.fulfill({ json: fixture('courses.json') });
    }
    if (url.pathname === '/api/courses/12') {
      return route.fulfill({ json: fixture('testing-course.json') });
    }
    if (url.pathname === '/api/lessons') {
      const page = Number(url.searchParams.get('pageNumber') ?? 0);
      return route.fulfill({ json: fixture(page === 1 ? 'testing-lessons-page-2.json' : 'testing-lessons-page-1.json') });
    }
    return route.fulfill({ status: 404, body: 'Not mocked' });
  });
}
