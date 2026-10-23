import { expect, test } from '@playwright/test';
import { mockApi } from './mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('home renders inside the toolbar layout', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'COURSES' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'ABOUT' })).toBeVisible();
  await expect(page.getByText('All Courses')).toBeVisible();
});

test('toolbar navigates to about', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'ABOUT' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
});

test('course page resolves the course before rendering', async ({ page }) => {
  await page.goto('/courses/12');
  await expect(page.getByRole('heading', { name: 'Angular Testing Course' })).toBeVisible();
});

test('unknown routes redirect to /', async ({ page }) => {
  await page.goto('/nope');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('All Courses')).toBeVisible();
});
