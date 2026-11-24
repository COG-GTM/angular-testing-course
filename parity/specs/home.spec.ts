import { test, expect } from '@playwright/test';
import { ADVANCED_TITLES, BEGINNER_TITLES, cardTitles, route, shot } from './helpers';

test.describe('Home page (course catalogue)', () => {
  test('shows the toolbar, heading and both category tabs', async ({ page }) => {
    await page.goto(route('/'));
    await expect(page).toHaveTitle('Angular Testing Course');
    await expect(page.getByRole('heading', { name: 'All Courses' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'COURSES' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ABOUT' })).toBeVisible();
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveText(['Beginners', 'Advanced']);
    await expect(page.getByRole('tab', { name: 'Beginners' })).toHaveAttribute('aria-selected', 'true');
    await shot(page, test.info(), 'home-beginners');
  });

  test('Beginners tab lists the beginner courses sorted by seqNo', async ({ page }) => {
    await page.goto(route('/'));
    await expect(page.locator('mat-card')).toHaveCount(BEGINNER_TITLES.length);
    expect(await cardTitles(page)).toEqual(BEGINNER_TITLES);
    const first = page.locator('mat-card').first();
    await expect(first.getByRole('button', { name: 'VIEW COURSE' })).toBeEnabled();
    await expect(first.getByRole('button', { name: 'EDIT' })).toBeEnabled();
    await expect(first.locator('img')).toHaveAttribute('src', /angular-testing/);
  });

  test('Advanced tab lists the advanced courses', async ({ page }) => {
    await page.goto(route('/'));
    await page.getByRole('tab', { name: 'Advanced' }).click();
    await expect(page.getByRole('tab', { name: 'Advanced' })).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => cardTitles(page)).toEqual(ADVANCED_TITLES);
    await shot(page, test.info(), 'home-advanced');
  });
});
