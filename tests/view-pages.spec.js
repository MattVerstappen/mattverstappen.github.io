// @ts-check
const { test, expect } = require('@playwright/test');

// Interactive "creative coding" demo pages. These pull Prism from a CDN for
// syntax highlighting, so we don't assert a clean console (CDN may be offline);
// we assert the first-party demo renders and the code viewer is present.
const VIEW_PAGES = [
  { path: '/projects/binary-rain/binary-rain-view.html', h1: /Binary Rain/, canvas: '#rainCanvas' },
  { path: '/projects/lightning/lightning-view.html', h1: /Lightning/, canvas: 'canvas' },
  { path: '/projects/meteor-shower/meteor-shower-view.html', h1: /Meteor/, canvas: 'canvas' },
  { path: '/projects/blackhole/blackhole-view.html', h1: /Black ?Hole/, canvas: null },
  { path: '/projects/atmosphere/atmosphere-view.html', h1: /Atmosphere/, canvas: null },
];

test.describe('Creative-coding view pages', () => {
  for (const { path, h1, canvas } of VIEW_PAGES) {
    test(`${path} renders its demo and code viewer`, async ({ page }) => {
      const resp = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(resp.status()).toBe(200);

      await expect(page.locator('h1').first()).toHaveText(h1);
      await expect(page.locator('.demo-section, .demo-frame').first()).toBeVisible();
      await expect(page.locator('.code-viewer').first()).toBeVisible();

      if (canvas) {
        await expect(page.locator(canvas).first()).toBeAttached();
      }
    });
  }

  test('code viewer renders code and supports tab switching (binary-rain)', async ({ page }) => {
    await page.goto('/projects/binary-rain/binary-rain-view.html');

    // A multi-file viewer keeps its tab bar; single-file viewers (.cv-single)
    // intentionally hide it, so target a multi-file one.
    const viewer = page.locator('.code-viewer:not(.cv-single)').first();
    await expect(viewer).toBeVisible();
    await expect(viewer.locator('.cv-copy-btn')).toBeVisible();

    // Code body populates (inline or fetched from same-origin) — not the spinner.
    const code = viewer.locator('.cv-code');
    await expect(code).not.toBeEmpty();
    await expect(code).not.toHaveText(/^Loading\.\.\.$/);

    // Tab switching updates the active tab.
    const tabs = viewer.locator('.cv-tab');
    expect(await tabs.count()).toBeGreaterThan(1);
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveClass(/on/);
  });
});
