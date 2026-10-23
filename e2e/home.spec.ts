import { expect, test } from '@playwright/test';
import { fixture } from './mockApi';

// Port of the legacy cypress/integration/home.test.js (same case names, courses.json fixture).
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/courses', (route) => route.fulfill({ json: fixture('courses.json') }));
    await page.goto('/');
  });

  test('should display a list of courses', async ({ page }) => {
    await expect(page.getByText('All Courses')).toBeVisible();
    await expect(page.locator('.course-card')).toHaveCount(9);
  });

  test('should display the advanced courses', async ({ page }) => {
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(2);
    await tabs.last().click();
    const titles = page.getByRole('tabpanel').locator('.course-card-title');
    expect(await titles.count()).toBeGreaterThan(1);
    await expect(titles.first()).toContainText('Angular Security Course');
  });
});
