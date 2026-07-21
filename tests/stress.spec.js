// @ts-check
const { test, expect } = require('@playwright/test');
const { collectPageErrors } = require('./utils');

test.describe('Stress — resilience under repeated interaction', () => {
  test('rapid navigation across all pages (3 laps) stays error-free', async ({ page }) => {
    const errors = collectPageErrors(page);
    const routes = ['/', '/about.html', '/work.html', '/research.html',
      '/achievements.html', '/contact.html', '/'];
    for (let lap = 0; lap < 3; lap++) {
      for (const r of routes) {
        await page.goto(r, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('h1').first()).toBeVisible();
      }
    }
    // Navigating away from work.html mid-load cancels its manifest fetch, which
    // projects.js logs as a benign "Failed to fetch". That race artifact aside,
    // no real script errors (undefined access, type errors) should occur.
    const real = errors.list.filter(
      (e) => !/failed to fetch|loadProjects failed/i.test(e));
    expect(real).toEqual([]);
  });

  test('work page survives 25 rapid tab/filter toggles', async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto('/work.html');
    await expect(page.locator('.proj-card').first()).toBeVisible({ timeout: 10_000 });

    const chipCount = await page.locator('.filter-chip').count();
    for (let i = 0; i < 25; i++) {
      await page.locator(i % 2 ? '#t-wip' : '#t-done').click();
      await page.locator('.filter-chip').nth(i % chipCount).click();
    }
    // App remains functional: reset to completed + All shows cards again
    await page.locator('#t-done').click();
    await page.locator('.filter-chip').first().click();
    await expect(page.locator('.proj-card').first()).toBeVisible();
    expect(errors.list).toEqual([]);
  });

  test('cycling through all 8 languages persists the last choice', async ({ page }) => {
    const errors = collectPageErrors(page);
    // Skip the one-time "save preference to a file" modal so we test switching,
    // not the File System Access prompt.
    await page.addInitScript(() => {
      localStorage.setItem('mdr-lang-prompted', 'true');
      localStorage.setItem('mdr-fs-declined', 'true');
    });
    await page.goto('/');
    const codes = ['zh', 'hi', 'es', 'fr', 'ar', 'af', 'ja', 'en'];
    for (const c of codes) {
      // Call the real global switcher repeatedly
      await page.evaluate((code) => (window).selectLang(code), c);
    }
    const stored = await page.evaluate(() => localStorage.getItem('mdr-lang'));
    expect(stored).toBe('en');
    await expect(page.locator('#langBtn')).toContainText('English');
    expect(errors.list).toEqual([]);
  });

  test('lightbox endures rapid open / arrow-wrap / close cycles', async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto('/project.html?slug=cancer-crusher');
    await expect(page.locator('.content-block').first()).toBeVisible({ timeout: 10_000 });

    const gallery = page.locator('.gal-item');
    const n = await gallery.count();
    test.skip(n === 0, 'project has no screenshot gallery to exercise');

    for (let cycle = 0; cycle < 3; cycle++) {
      await gallery.first().click();
      await expect(page.locator('#lightbox')).toHaveClass(/open/);
      // Arrow well past the number of images to test index wrap-around
      for (let i = 0; i < n + 5; i++) await page.keyboard.press('ArrowRight');
      for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('Escape');
      await expect(page.locator('#lightbox')).not.toHaveClass(/open/);
    }
    expect(errors.list).toEqual([]);
  });

  test('static host serves many concurrent asset requests', async ({ page, baseURL }) => {
    await page.goto('/');
    const result = await page.evaluate(async () => {
      const manifest = await (await fetch('/projects/manifest.json')).json();
      // Fire every project.json 3x concurrently (~90 requests)
      const urls = [];
      for (let k = 0; k < 3; k++)
        for (const slug of manifest) urls.push('/projects/' + slug + '/project.json');
      const res = await Promise.all(urls.map((u) => fetch(u).then((r) => r.status)));
      return { total: res.length, ok: res.filter((s) => s === 200).length };
    });
    expect(result.total).toBeGreaterThan(50);
    expect(result.ok).toBe(result.total); // every concurrent request succeeded
  });

  test('malformed manifest is handled gracefully (no crash)', async ({ page }) => {
    const errors = collectPageErrors(page);
    // Force the manifest fetch to fail; the grid must show a friendly message.
    await page.route('**/projects/manifest.json', (r) => r.fulfill({ status: 500, body: 'boom' }));
    await page.goto('/work.html');
    await expect(page.locator('.proj-empty')).toBeVisible({ timeout: 10_000 });
    // console.error from the handler is expected; assert the page didn't throw
    // an *uncaught* pageerror (those are captured separately as bare messages).
    const uncaught = errors.list.filter((e) => /is not|undefined|cannot read/i.test(e));
    expect(uncaught).toEqual([]);
  });
});
