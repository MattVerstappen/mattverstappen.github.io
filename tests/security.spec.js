// @ts-check
const { test, expect } = require('@playwright/test');
const { collectPageErrors } = require('./utils');

// A battery of XSS / injection payloads thrown at the real escaping helpers
// and at the rendering pipeline.
const XSS_PAYLOADS = [
  `<script>window.__xss=1</script>`,
  `<img src=x onerror="window.__xss=1">`,
  `"><img src=x onerror="window.__xss=1">`,
  `'><svg/onload="window.__xss=1">`,
  `javascript:window.__xss=1`,
  `<iframe src="javascript:window.__xss=1">`,
  `</textarea><script>window.__xss=1</script>`,
];

test.describe('Security — escaping helpers (real production code)', () => {
  test('escHtml neutralises every angle bracket and quote', async ({ page }) => {
    await page.goto('/work.html');
    const results = await page.evaluate((payloads) => {
      // @ts-ignore - escHtml is a global from projects.js
      return payloads.map((p) => window.escHtml(p));
    }, XSS_PAYLOADS);

    for (const out of results) {
      expect(out).not.toMatch(/<script/i);
      expect(out).not.toMatch(/<img/i);
      expect(out).not.toMatch(/<svg/i);
      expect(out).not.toContain('<');
      expect(out).not.toContain('>');
      expect(out).not.toContain('"'); // quotes entity-encoded -> cannot break attributes
    }
  });

  test('safePdfPath cannot traverse out of projects/', async ({ page }) => {
    await page.goto('/project.html?slug=__none__');
    const cases = await page.evaluate(() => {
      // @ts-ignore
      const f = window.safePdfPath;
      return {
        traversal: f('../../etc', '../../../etc/passwd'),
        slash: f('a', 'sub/dir/passwd.pdf'),
        semi: f('a;rm -rf', 'b`whoami`.pdf'),
        ok: f('my-project', 'Paper 2024.pdf'),
      };
    });
    // Real safety property: no path-separator traversal survives.
    expect(cases.traversal).not.toMatch(/\.\.[\\/]/); // no ../ or ..\
    expect(cases.traversal.startsWith('projects/')).toBe(true);
    // Slashes inside the filename are stripped -> only the 2 separators remain.
    expect((cases.slash.match(/\//g) || []).length).toBe(2);
    expect(cases.semi).not.toMatch(/[;`]/);
    // Legitimate names (including spaces) survive intact.
    expect(cases.ok).toBe('projects/my-project/Paper 2024.pdf');
  });

  test('assetPath encodes separators so segments cannot traverse', async ({ page }) => {
    await page.goto('/work.html');
    const out = await page.evaluate(() => {
      // @ts-ignore
      return window.assetPath('../../secret', '../../../etc/passwd');
    });
    expect(out).not.toContain('../');   // no raw traversal sequence
    expect(out).toContain('%2F');       // injected slashes are percent-encoded
    expect(out.startsWith('projects/')).toBe(true);
  });
});

test.describe('Security — injection through attacker-controlled project data', () => {
  test('a fully malicious project.json cannot execute script', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', async (d) => { dialogFired = true; await d.dismiss(); });

    await page.route('**/projects/xss-probe/project.json', async (route) => {
      const evil = `<img src=x onerror="window.__xss=1">`;
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          title: `<script>window.__xss=1</script>`,
          type: 'game',
          status: 'completed',
          summary: evil,
          event: evil, genre: evil, date: evil,
          awards: [evil, `"><script>window.__xss=1</script>`],
          tags: [evil], stack: [evil],
          articles: [{ title: evil, url: 'https://example.com', source: evil }],
        }),
      });
    });

    await page.goto('/project.html?slug=xss-probe');
    await expect(page.locator('#heroTitle')).toHaveText(/\S/, { timeout: 10_000 });
    await page.waitForTimeout(600); // give any onerror a chance to fire

    expect(dialogFired, 'a dialog should never open').toBe(false);
    expect(await page.evaluate(() => (window).__xss)).toBeFalsy();
    expect(await page.locator('#projContent script').count()).toBe(0);
    expect(await page.locator('#projContent img[onerror]').count()).toBe(0);
    // The payload survives as visible *text*, proving it was escaped not parsed.
    await expect(page.locator('#heroTitle')).toHaveText(/<script>/);
  });
});

test.describe('Security — URL parameter validation', () => {
  test('malicious ?slug= is encoded and yields Not Found (no reflection)', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', async (d) => { dialogFired = true; await d.dismiss(); });

    for (const slug of [
      '../../../../etc/passwd',
      '<img src=x onerror=alert(1)>',
      '"><script>alert(1)</script>',
      '%2e%2e%2f%2e%2e%2fwork.html',
    ]) {
      await page.goto('/project.html?slug=' + encodeURIComponent(slug));
      await expect(page.locator('.notfound-state')).toBeVisible({ timeout: 10_000 });
      expect(await page.locator('#projContent script').count()).toBe(0);
    }
    expect(dialogFired).toBe(false);
  });

  test('invalid ?lang= falls back to English (allowlist enforced)', async ({ page }) => {
    for (const lang of ['<script>', '" onerror=1', 'zz', 'en-US-x', 'eng']) {
      await page.goto('/?lang=' + encodeURIComponent(lang));
      await expect(page.locator('#langBtn')).toContainText('English');
    }
    await page.goto('/?lang=fr');
    await expect(page.locator('#langBtn')).toContainText('Français');
  });
});

test.describe('Security — Content-Security-Policy present on every page', () => {
  const paths = ['/', '/about.html', '/work.html', '/research.html',
    '/achievements.html', '/contact.html', '/project.html'];
  for (const p of paths) {
    test(`CSP meta locks default-src to self on ${p}`, async ({ page }) => {
      await page.goto(p);
      const csp = await page.getAttribute(
        'meta[http-equiv="Content-Security-Policy"]', 'content');
      expect(csp, `no CSP on ${p}`).toBeTruthy();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain('form-action');
      expect(csp).toContain('frame-src');
    });
  }
});
