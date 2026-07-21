// @ts-check
const { test, expect } = require('@playwright/test');
const { collectPageErrors } = require('./utils');

test.describe('Work page — dynamic project grid', () => {
  test('grid loads project cards from the manifest', async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto('/work.html');

    // projects.js fetches manifest.json then each project.json
    await expect(page.locator('.proj-card').first()).toBeVisible({ timeout: 10_000 });
    const count = await page.locator('.proj-card').count();
    expect(count).toBeGreaterThan(0);

    // Degree filter chips are generated (at least "All" + one degree)
    await expect(page.locator('#degreeFilters .filter-chip').first()).toBeVisible();
    expect(await page.locator('.filter-chip').count()).toBeGreaterThan(1);

    await page.waitForTimeout(300);
    expect(errors.list).toEqual([]);
  });

  test('status tabs toggle between Completed and In Development', async ({ page }) => {
    await page.goto('/work.html');
    await expect(page.locator('.proj-card').first()).toBeVisible({ timeout: 10_000 });

    await page.locator('#t-wip').click();
    await expect(page.locator('#t-wip')).toHaveClass(/on/);
    await expect(page.locator('#t-done')).not.toHaveClass(/on/);

    // Grid still renders either cards or a friendly empty state
    await expect(page.locator('#projGrid')).toBeVisible();

    await page.locator('#t-done').click();
    await expect(page.locator('#t-done')).toHaveClass(/on/);
  });

  test('a degree filter narrows the grid without errors', async ({ page }) => {
    await page.goto('/work.html');
    await expect(page.locator('.proj-card').first()).toBeVisible({ timeout: 10_000 });
    const chips = page.locator('.filter-chip');
    // Click the second chip (first specific degree)
    await chips.nth(1).click();
    await expect(chips.nth(1)).toHaveClass(/on/);
    await expect(page.locator('#projGrid')).toBeVisible();
  });

  test('clicking a card cover opens its project detail page', async ({ page }) => {
    await page.goto('/work.html');
    await expect(page.locator('.proj-cover-link').first()).toBeVisible({ timeout: 10_000 });
    await page.locator('.proj-cover-link').first().click();
    await expect(page).toHaveURL(/project\.html\?slug=/);
  });
});

test.describe('Project detail page', () => {
  test('renders a known project (cancer-crusher)', async ({ page }) => {
    await page.goto('/project.html?slug=cancer-crusher');

    // Hero title is populated by project-detail.js from project.json
    await expect(page.locator('#heroTitle')).toHaveText(/\S+/, { timeout: 10_000 });
    // Document title is updated to include the project name
    await expect(page).toHaveTitle(/Cancer Crusher/);
    // At least one content block rendered
    await expect(page.locator('.content-block').first()).toBeVisible();
  });

  test('unknown slug shows a friendly "Project Not Found" state', async ({ page }) => {
    await page.goto('/project.html?slug=__definitely_not_a_real_slug__');
    await expect(page.locator('.notfound-state')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.notfound-state')).toContainText(/not found/i);
    await expect(page).toHaveTitle(/Not Found/i);
  });

  test('no slug at all falls back to Not Found', async ({ page }) => {
    await page.goto('/project.html');
    await expect(page.locator('.notfound-state')).toBeVisible({ timeout: 10_000 });
  });
});
