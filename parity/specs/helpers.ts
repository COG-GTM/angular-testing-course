import { Page, TestInfo, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const BACKEND = process.env.PARITY_BACKEND ?? 'http://localhost:9000';

export const BEGINNER_TITLES = [
  'Angular Testing Course',
  'Angular Core Deep Dive',
  'RxJs In Practice Course',
  'NgRx In Depth',
  'Serverless Angular with Firebase Course',
  'Angular for Beginners',
  'The Complete Typescript Course',
  'Rxjs and Reactive Patterns Angular Architecture Course',
  'Angular Material Course',
];

export const ADVANCED_TITLES = [
  'Angular Security Course - Web Security Fundamentals',
  'Angular PWA - Progressive Web Apps Course',
  'Angular Advanced Library Laboratory: Build Your Own Library',
];

/** Both apps use path routing, so a logical route maps 1:1 onto each baseURL. */
export function route(logical: string): string {
  return logical.startsWith('/') ? logical : `/${logical}`;
}

/** Wait for fonts, images and the Material ripple/animations to settle before a screenshot. */
export async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => (document as any).fonts?.ready);
  await page.waitForFunction(() =>
    Array.from(document.images).every((img) => img.complete));
  await page.waitForTimeout(400);
}

export async function shot(page: Page, testInfo: TestInfo, name: string) {
  await settle(page);
  const dir = path.join(__dirname, '..', 'report', 'shots', testInfo.project.name);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true, animations: 'disabled', caret: 'hide' });
}

export async function cardTitles(page: Page): Promise<string[]> {
  const titles = page.locator('mat-tab-body.mat-mdc-tab-body-active mat-card-title, .mat-mdc-tab-body-active mat-card-title');
  return (await titles.allInnerTexts()).map((t) => t.trim());
}

export async function lessonRows(page: Page): Promise<string[][]> {
  const rows = page.locator('mat-row');
  const n = await rows.count();
  const out: string[][] = [];
  for (let i = 0; i < n; i++) {
    out.push((await rows.nth(i).locator('mat-cell').allInnerTexts()).map((t) => t.trim()));
  }
  return out;
}

export async function waitForLessons(page: Page) {
  await expect(page.locator('.spinner-container')).toHaveCount(0, { timeout: 10_000 });
}
