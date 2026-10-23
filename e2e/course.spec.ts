import { expect, test, type Page } from '@playwright/test';
import { fixture, mockApi, type FixtureLesson } from './mockApi';

const page1 = fixture<{ payload: FixtureLesson[] }>('testing-lessons-page-1.json').payload;
const page2 = fixture<{ payload: FixtureLesson[] }>('testing-lessons-page-2.json').payload;

const lessonRows = (page: Page) => page.getByRole('table').getByRole('row').filter({ has: page.getByRole('cell') });
const seqNos = async (page: Page) => (await lessonRows(page).locator('[role="cell"]:first-child').allTextContents()).map(Number);

test.describe('Course page', () => {
  test('Home → VIEW COURSE opens the course with its first lessons page', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    await page.getByRole('region', { name: 'Angular Testing Course' }).getByRole('button', { name: 'VIEW COURSE' }).click();
    await expect(page).toHaveURL(/\/courses\/12$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Angular Testing Course' })).toBeVisible();
    await expect(lessonRows(page)).toHaveText(page1.map((l) => new RegExp(`${l.seqNo}\\s*${l.description}\\s*${l.duration}`)));
    await expect(page.getByText('1 – 3 of 10')).toBeVisible();
  });

  test('shows the spinner while lessons load', async ({ page }) => {
    await mockApi(page, { lessonsDelayMs: 1000 });
    await page.goto('/courses/12');
    await expect(page.getByRole('progressbar', { name: 'Loading lessons' })).toBeVisible();
    await expect(page.getByText(page1[0].description)).toBeVisible();
    await expect(page.getByRole('progressbar')).toHaveCount(0);
  });

  test('pages forward and back', async ({ page }) => {
    await mockApi(page);
    await page.goto('/courses/12');
    await expect(page.getByText(page1[0].description)).toBeVisible();

    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByText('4 – 6 of 10')).toBeVisible();
    await expect(lessonRows(page).locator('.description-cell')).toHaveText(page2.map((l) => l.description));

    await page.getByRole('button', { name: 'Previous page' }).click();
    await expect(page.getByText('1 – 3 of 10')).toBeVisible();
    await expect(lessonRows(page).locator('.description-cell')).toHaveText(page1.map((l) => l.description));
  });

  test('changes the page size', async ({ page }) => {
    await mockApi(page);
    await page.goto('/courses/12');
    await expect(lessonRows(page)).toHaveCount(3);
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: '10' }).click();
    await expect(page.getByText('1 – 10 of 10')).toBeVisible();
    await expect(lessonRows(page)).toHaveCount(10);
  });

  test('sorts by # (asc ↔ desc) and resets to the first page', async ({ page }) => {
    await mockApi(page);
    await page.goto('/courses/12');
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByText('4 – 6 of 10')).toBeVisible();

    await page.getByRole('columnheader', { name: '#' }).getByRole('button').click();
    await expect(page.getByRole('columnheader', { name: '#' })).toHaveAttribute('aria-sort', 'descending');
    await expect(page.getByText('1 – 3 of 10')).toBeVisible();
    await expect.poll(() => seqNos(page)).toEqual([10, 9, 8]);

    await page.getByRole('columnheader', { name: '#' }).getByRole('button').click();
    await expect(page.getByRole('columnheader', { name: '#' })).toHaveAttribute('aria-sort', 'ascending');
    await expect.poll(() => seqNos(page)).toEqual([1, 2, 3]);
  });

  test('searches lessons and resets to the first page', async ({ page }) => {
    await mockApi(page);
    await page.goto('/courses/12');
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByText('4 – 6 of 10')).toBeVisible();

    await page.getByPlaceholder('Search lessons').pressSequentially('component');
    await expect(page.getByText('1 – 3 of 10')).toBeVisible();
    await expect(lessonRows(page).locator('.description-cell')).toHaveText([
      'Introduction to Angular Component Testing',
      'Testing Angular Components without the DOM',
      'Testing Angular Components with the DOM',
    ]);
  });
});
