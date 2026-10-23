import { expect, test } from '@playwright/test';
import { mockApi } from './mockApi';

test.describe('Edit course dialog', () => {
  test('EDIT → Save sends the new titles (non-ASCII intact) and reloads the list', async ({ page }) => {
    const saves: { id: number; body: unknown }[] = [];
    await mockApi(page, { onSave: (id, body) => saves.push({ id, body }) });
    let listRequests = 0;
    page.on('request', (r) => {
      if (new URL(r.url()).pathname === '/api/courses' && r.method() === 'GET') listRequests++;
    });

    await page.goto('/');
    const card = page.getByRole('region', { name: 'Angular Testing Course' });
    await card.getByRole('button', { name: 'EDIT' }).click();

    const dialog = page.getByRole('dialog');
    const description = dialog.getByRole('textbox', { name: 'Course Description' });
    await expect(description).toBeFocused();
    await expect(description).toHaveValue('Angular Testing Course');
    await description.fill('Testing — résumé ✓');
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden();
    await expect(page.getByRole('region', { name: 'Testing — résumé ✓' })).toBeVisible();
    expect(saves).toEqual([
      {
        id: 12,
        body: {
          titles: {
            description: 'Testing — résumé ✓',
            longDescription: 'In-depth guide to Unit Testing and E2E Testing of Angular Applications',
          },
        },
      },
    ]);
    expect(listRequests).toBe(2);
  });

  test('Close leaves the course unchanged and does not save', async ({ page }) => {
    const saves: unknown[] = [];
    await mockApi(page, { onSave: (_id, body) => saves.push(body) });
    await page.goto('/');
    await page.getByRole('region', { name: 'Angular Testing Course' }).getByRole('button', { name: 'EDIT' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('textbox', { name: 'Course Description' }).fill('Discarded');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('region', { name: 'Angular Testing Course' })).toBeVisible();
    expect(saves).toEqual([]);
  });
});
