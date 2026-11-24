import { test, expect, request } from '@playwright/test';
import { BACKEND, route, shot } from './helpers';

const COURSE_ID = 12;
let original: any;

test.describe('Edit course dialog (form + save)', () => {
  test.beforeEach(async () => {
    const api = await request.newContext();
    original = await (await api.get(`${BACKEND}/api/courses/${COURSE_ID}`)).json();
    await api.dispose();
  });

  test.afterEach(async () => {
    const api = await request.newContext();
    await api.put(`${BACKEND}/api/courses/${COURSE_ID}`, { data: { titles: original.titles } });
    await api.dispose();
  });

  test('EDIT opens a dialog prefilled with the course', async ({ page }) => {
    await page.goto(route('/'));
    await page.locator('mat-card').first().getByRole('button', { name: 'EDIT' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Angular Testing Course' })).toBeVisible();
    await expect(dialog.getByPlaceholder('Course Description')).toHaveValue('Angular Testing Course');
    await expect(dialog.locator('mat-select')).toContainText('Beginner');
    await expect(dialog.getByPlaceholder('Description', { exact: true })).toHaveValue('In-depth guide to Unit Testing and E2E Testing of Angular Applications');
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeEnabled();
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeEnabled();
    await shot(page, test.info(), 'edit-dialog');
  });

  test('clearing a required field marks it invalid', async ({ page }) => {
    await page.goto(route('/'));
    await page.locator('mat-card').first().getByRole('button', { name: 'EDIT' }).click();
    const dialog = page.getByRole('dialog');
    const description = dialog.getByPlaceholder('Course Description');
    await description.fill('');
    await description.blur();
    await expect(description).toHaveClass(/ng-invalid/);
    await expect(dialog.locator('mat-form-field.mat-form-field-invalid')).toHaveCount(1);
    await shot(page, test.info(), 'edit-dialog-invalid');
  });

  test('Close dismisses the dialog without saving', async ({ page }) => {
    await page.goto(route('/'));
    await page.locator('mat-card').first().getByRole('button', { name: 'EDIT' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByPlaceholder('Course Description').fill(`Not saved ${Date.now()}`);
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('mat-card-title').first()).toHaveText('Angular Testing Course');
  });

  test('Save persists the new title and refreshes the list', async ({ page }) => {
    const newTitle = `Angular Testing Course ${test.info().project.name} ${Date.now()}`;
    await page.goto(route('/'));
    await page.locator('mat-card').first().getByRole('button', { name: 'EDIT' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByPlaceholder('Course Description').fill(newTitle);
    await dialog.getByRole('button', { name: 'Save' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('mat-card-title').first()).toHaveText(newTitle);
    await page.reload();
    await expect(page.locator('mat-card-title').first()).toHaveText(newTitle);
  });
});
