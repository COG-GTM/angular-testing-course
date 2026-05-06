import { chromium, Page } from 'playwright';

const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 375, height: 812 };
const BASE_URL = 'http://localhost:4200';
const OUTPUT_DIR = './screenshots/source';

const DISABLE_ANIMATIONS_CSS = `
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
  }
`;

async function waitForReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
}

async function captureView(page: Page, name: string, url: string, viewportLabel: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS });
  await waitForReady(page);
  await page.screenshot({ path: `${OUTPUT_DIR}/${name}-${viewportLabel}.png`, fullPage: true });
  console.log(`Captured: ${name}-${viewportLabel}.png`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const views = [
    { name: 'home-beginners', url: `${BASE_URL}/` },
    { name: 'about', url: `${BASE_URL}/about` },
    { name: 'course-detail', url: `${BASE_URL}/courses/12` },
  ];

  for (const view of views) {
    await captureView(page, view.name, view.url, 'desktop', DESKTOP);
    await captureView(page, view.name, view.url, 'mobile', MOBILE);
  }

  // Capture Advanced tab
  await page.setViewportSize(DESKTOP);
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS });
  await waitForReady(page);
  const advancedTab = page.locator('div.mat-mdc-tab:has-text("Advanced")');
  if (await advancedTab.count() > 0) {
    await advancedTab.click();
    await page.waitForTimeout(500);
    await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS });
    await page.screenshot({ path: `${OUTPUT_DIR}/home-advanced-desktop.png`, fullPage: true });
    console.log('Captured: home-advanced-desktop.png');
  }

  await page.setViewportSize(MOBILE);
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS });
  await waitForReady(page);
  const advancedTabMobile = page.locator('div.mat-mdc-tab:has-text("Advanced")');
  if (await advancedTabMobile.count() > 0) {
    await advancedTabMobile.click();
    await page.waitForTimeout(500);
    await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS });
    await page.screenshot({ path: `${OUTPUT_DIR}/home-advanced-mobile.png`, fullPage: true });
    console.log('Captured: home-advanced-mobile.png');
  }

  await browser.close();
  console.log('All source screenshots captured!');
}

main().catch(console.error);
