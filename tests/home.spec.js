// @ts-check
const { test, expect } = require('@playwright/test');
const { collectPageErrors } = require('./utils');

test.describe('Home page', () => {
  test('hero, featured work, quick links and CTA render', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.hero-name')).toContainText('Matthew Derek');
    // Three featured project cards
    await expect(page.locator('.featured-card')).toHaveCount(3);
    await expect(page.locator('.quick-card')).toHaveCount(3);

    // Download CV button uses the download attribute and a real file
    const cv = page.locator('a[download][href$=".pdf"]');
    await expect(cv).toHaveCount(1);
  });

  test('"View Projects" button navigates to Work', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hero-btns a', { hasText: 'View Projects' }).click();
    await expect(page).toHaveURL(/work\.html$/);
    await expect(page.locator('#projGrid')).toBeVisible();
  });

  test('featured project link opens the project detail page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.featured-link', { hasText: 'View Project' }).first().click();
    await expect(page).toHaveURL(/project\.html\?slug=/);
  });
});

test.describe('Language switcher (i18n)', () => {
  test('dropdown lists 8 languages and switching persists + translates', async ({ page }) => {
    await page.goto('/');

    const langBtn = page.locator('#langBtn');
    await expect(langBtn).toContainText('English');

    await langBtn.click();
    await expect(page.locator('.lang-dropdown')).toHaveClass(/open/);
    await expect(page.locator('.lang-option')).toHaveCount(8);

    // Switch to Spanish
    await page.locator('.lang-option[data-lang="es"]').click();
    await expect(langBtn).toContainText('Español');

    // A translated string should have changed away from the English default.
    const nav = page.locator('#navLinks a[data-i18n="nav_about"]');
    await expect(nav).not.toHaveText('About');

    // Preference persisted to localStorage
    const stored = await page.evaluate(() => localStorage.getItem('mdr-lang'));
    expect(stored).toBe('es');

    // ...and survives a reload
    await page.reload();
    await expect(page.locator('#langBtn')).toContainText('Español');
  });

  test('language notice banner can be dismissed and stays dismissed', async ({ page }) => {
    await page.goto('/');
    const notice = page.locator('#langNotice');
    await expect(notice).toBeVisible();
    await notice.locator('.lang-notice-dismiss').click();
    await expect(notice).toBeHidden();

    const dismissed = await page.evaluate(() => localStorage.getItem('mdr-notice-dismissed'));
    expect(dismissed).toBe('true');

    await page.reload();
    await expect(page.locator('#langNotice')).toBeHidden();
  });
});
