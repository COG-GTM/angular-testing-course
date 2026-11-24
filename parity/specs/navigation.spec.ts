import { test, expect } from '@playwright/test';
import { route, shot } from './helpers';

test.describe('Navigation and About page', () => {
  test('ABOUT link opens the about page', async ({ page }) => {
    await page.goto(route('/'));
    await page.getByRole('link', { name: 'ABOUT' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
    await expect(page.getByText('Welcome to the Angular Testing Course')).toBeVisible();
    await expect(page.locator('.container img')).toBeVisible();
    await shot(page, test.info(), 'about');
  });

  test('COURSES link returns to the catalogue', async ({ page }) => {
    await page.goto(route('/about'));
    await page.getByRole('link', { name: 'COURSES' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'All Courses' })).toBeVisible();
  });

  test('unknown routes redirect to the catalogue', async ({ page }) => {
    await page.goto(route('/does-not-exist'));
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'All Courses' })).toBeVisible();
  });
});
