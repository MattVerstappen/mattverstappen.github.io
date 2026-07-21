// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation & responsive behaviour', () => {
  test('mobile hamburger opens and closes the menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const ham = page.locator('#hamburger');
    const links = page.locator('#navLinks');
    await expect(ham).toBeVisible();

    await ham.click();
    await expect(links).toHaveClass(/open/);
    await expect(ham).toHaveAttribute('aria-expanded', 'true');

    // Selecting a destination closes the menu
    await links.locator('a[href="about.html"]').click();
    await expect(page).toHaveURL(/about\.html$/);
  });

  test('skip link targets an existing main region', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('a.skip-link');
    const target = await skip.getAttribute('href');
    expect(target).toBe('#main');
    await expect(page.locator(target)).toHaveCount(1);
  });

  test('nav logo returns to home from an inner page', async ({ page }) => {
    await page.goto('/about.html');
    await page.locator('.nav-logo').click();
    await expect(page).toHaveURL(/\/$|index\.html$/);
    await expect(page.locator('.hero-name')).toBeVisible();
  });

  test('language dropdown closes on outside click and Escape', async ({ page }) => {
    await page.goto('/');
    const dropdown = page.locator('.lang-dropdown');

    await page.locator('#langBtn').click();
    await expect(dropdown).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(dropdown).not.toHaveClass(/open/);

    await page.locator('#langBtn').click();
    await expect(dropdown).toHaveClass(/open/);
    await page.locator('h1').first().click(); // outside click
    await expect(dropdown).not.toHaveClass(/open/);
  });
});
