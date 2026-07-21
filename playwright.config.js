// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.PORT || 8099;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * Playwright configuration for the portfolio site.
 * Boots a dependency-free static server (tests/static-server.js) that mirrors
 * GitHub Pages, then runs the functional suite against it in Chromium.
 * Run with:  npm test        (headless)
 *            npm run test:ui  (interactive)
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: 'node tests/static-server.js',
    url: `${BASE_URL}/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
