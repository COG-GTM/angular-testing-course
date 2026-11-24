import { defineConfig, devices } from '@playwright/test';

export const BACKEND = 'http://localhost:9000';

export default defineConfig({
  testDir: './specs',
  globalSetup: './global-setup.ts',
  // The REST backend is shared by both apps and keeps edits in memory, so run serially.
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['json', { outputFile: 'report/results.json' }]],
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'baseline', use: { baseURL: process.env.BASELINE_URL ?? 'http://localhost:4000' } },
    { name: 'upgraded', use: { baseURL: process.env.UPGRADED_URL ?? 'http://localhost:4200' } },
  ],
});
