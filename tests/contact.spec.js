// @ts-check
const { test, expect } = require('@playwright/test');
const { collectPageErrors } = require('./utils');

test.describe('Contact page', () => {
  test('form and all fields are present and required', async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto('/contact.html');

    const form = page.locator('#contact-form');
    await expect(form).toBeVisible();

    await expect(page.locator('#cf-name')).toHaveAttribute('required', '');
    await expect(page.locator('#cf-email')).toHaveAttribute('type', 'email');
    await expect(page.locator('#cf-email')).toHaveAttribute('required', '');
    await expect(page.locator('#cf-msg')).toHaveAttribute('required', '');
    await expect(page.locator('.form-submit')).toBeVisible();

    await page.waitForTimeout(300);
    expect(errors.list).toEqual([]);
  });

  test('direct contact links (email / socials) are valid', async ({ page }) => {
    await page.goto('/contact.html');
    const mailto = page.locator('a[href^="mailto:"]').first();
    await expect(mailto).toHaveAttribute('href', /matthewderekrall@gmail\.com/);

    // External social links must open safely
    const blanks = await page.$$eval('a[target="_blank"]', (as) =>
      as.map((a) => a.getAttribute('rel') || '')
    );
    for (const rel of blanks) {
      expect(rel).toContain('noopener');
    }
  });
});
