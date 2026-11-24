import { test, expect } from '@playwright/test';
import { lessonRows, route, shot, waitForLessons } from './helpers';

const FIRST_PAGE = [
  ['1', 'Angular Testing Course - Helicopter View', '5:38'],
  ['2', 'Setting Up the Development Environment', '5:12'],
  ['3', 'Introduction to Jasmine, Spies and specs', '4:07'],
];

test.describe('Course detail page (lessons table)', () => {
  test('VIEW COURSE opens the course with the first lessons page', async ({ page }) => {
    await page.goto(route('/'));
    await page.locator('mat-card').first().getByRole('button', { name: 'VIEW COURSE' }).click();
    await expect(page).toHaveURL(/\/courses\/12$/);
    await expect(page.getByRole('heading', { name: 'Angular Testing Course' })).toBeVisible();
    await waitForLessons(page);
    await expect(page.locator('mat-header-cell')).toHaveText(['#', 'Description', 'Duration']);
    await expect.poll(() => lessonRows(page)).toEqual(FIRST_PAGE);
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(/1 – 3 of 10/);
    await shot(page, test.info(), 'course-detail');
  });

  test('paginator moves between pages and changes page size', async ({ page }) => {
    await page.goto(route('/courses/12'));
    await waitForLessons(page);
    await expect.poll(() => lessonRows(page)).toEqual(FIRST_PAGE);
    await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();

    await page.getByRole('button', { name: 'Next page' }).click();
    await waitForLessons(page);
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(/4 – 6 of 10/);
    await expect.poll(async () => (await lessonRows(page)).map((r) => r[0])).toEqual(['4', '5', '6']);
    await expect(page.getByRole('button', { name: 'Previous page' })).toBeEnabled();

    // Open the page-size select from the keyboard: the paginator's tooltip and touch-target
    // overlays sit on top of it, which makes a pointer click flaky.
    const pageSize = page.getByRole('combobox', { name: /Items per page/ });
    await expect(pageSize).toHaveText('3');
    await pageSize.focus();
    await pageSize.press('Enter');
    await page.getByRole('option', { name: '10' }).click();
    await waitForLessons(page);
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(/1 – 10 of 10/);
    await expect.poll(async () => (await lessonRows(page)).length).toBe(10);
    await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  test('sorting by # descending reverses the lessons', async ({ page }) => {
    await page.goto(route('/courses/12'));
    await waitForLessons(page);
    await expect.poll(() => lessonRows(page)).toEqual(FIRST_PAGE);
    await page.locator('mat-header-cell').filter({ hasText: '#' }).click();
    await waitForLessons(page);
    await expect.poll(async () => (await lessonRows(page)).map((r) => r[0])).toEqual(['10', '9', '8']);
  });

  test('search filters the lessons', async ({ page }) => {
    await page.goto(route('/courses/12'));
    await waitForLessons(page);
    // The component listens to keyup, so type like a user rather than fill().
    await page.getByPlaceholder('Search lessons').pressSequentially('mock');
    await expect.poll(() => lessonRows(page), { timeout: 10_000 })
      .toEqual([['6', 'Mocking Angular HTTP requests', '4:38']]);
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(/1 – 3 of 10/);
    await page.getByPlaceholder('Search lessons').clear();
    await page.getByPlaceholder('Search lessons').pressSequentially('zzz');
    await expect.poll(() => lessonRows(page), { timeout: 10_000 }).toEqual([]);
  });

  test('course without lessons shows an empty table', async ({ page }) => {
    await page.goto(route('/courses/2'));
    await expect(page.getByRole('heading', { name: 'Angular Core Deep Dive' })).toBeVisible();
    await waitForLessons(page);
    await expect.poll(() => lessonRows(page)).toEqual([]);
  });
});
