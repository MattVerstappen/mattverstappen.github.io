// @ts-check
const { test, expect } = require('@playwright/test');
const { collectPageErrors, PAGES } = require('./utils');

test.describe('Core pages load and are well-formed', () => {
  for (const { path, title } of PAGES) {
    test(`${path} loads with 200, correct title, nav, footer, one h1`, async ({ page }) => {
      const errors = collectPageErrors(page);

      const resp = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(resp, `no response for ${path}`).toBeTruthy();
      expect(resp.status(), `${path} HTTP status`).toBe(200);

      await expect(page).toHaveTitle(title);

      // Structural landmarks
      await expect(page.locator('nav').first()).toBeVisible();
      await expect(page.locator('footer').first()).toBeVisible();
      await expect(page.locator('#main, main')).toHaveCount(1);

      // Exactly one visible h1
      await expect(page.locator('h1')).toHaveCount(1);

      // Skip link for keyboard users
      await expect(page.locator('a.skip-link')).toHaveCount(1);

      // Language should be declared
      await expect(page.locator('html')).toHaveAttribute('lang', /.+/);

      await page.waitForTimeout(400); // let deferred scripts run
      expect(errors.list, `console/page errors on ${path}`).toEqual([]);
    });
  }

  test('every internal nav link points to a real page (no 404s)', async ({ page, baseURL }) => {
    await page.goto('/');
    const hrefs = await page.$$eval('#navLinks a[href]', (as) =>
      as.map((a) => a.getAttribute('href')).filter((h) => h && !h.startsWith('#'))
    );
    expect(hrefs.length).toBeGreaterThan(3);
    for (const href of hrefs) {
      const url = new URL(href, baseURL).toString();
      const res = await page.request.get(url);
      expect(res.status(), `${href} should not 404`).toBeLessThan(400);
    }
  });

  test('favicon, sitemap and robots are served', async ({ page, baseURL }) => {
    for (const p of ['/assets/favicon/favicon.ico', '/sitemap.xml', '/robots.txt', '/projects/manifest.json']) {
      const res = await page.request.get(new URL(p, baseURL).toString());
      expect(res.status(), `${p}`).toBe(200);
    }
  });
});
