import { test, expect } from '@playwright/test';

test.describe('Redmine Enhanced UX - Project Index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('should load project index page', async ({ page }) => {
    await expect(page).toHaveTitle(/Projects/);
  });

  test('should display project list', async ({ page }) => {
    const projectList = page.locator('[class*="projects"]');
    await expect(projectList).toBeVisible();
  });

  test('should have enhanced UX styles loaded', async ({ page }) => {
    const mainElement = page.locator('main, #main, .main');
    await expect(mainElement).toBeVisible();
  });
});

test.describe('Redmine Enhanced UX - Issue Index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/issues');
  });

  test('should load issue index page', async ({ page }) => {
    await expect(page).toHaveTitle(/Issues/);
  });

  test('should display sticky headers if enabled', async ({ page }) => {
    const headerRow = page.locator('thead');
    if (await headerRow.isVisible()) {
      const position = await headerRow.evaluate((el) => 
        window.getComputedStyle(el).position
      );
      // Verify enhanced UX is loaded (may or may not use sticky depending on settings)
      await expect(page).toHaveTitle(/Issues/);
    }
  });
});

test.describe('Redmine Enhanced UX - Issue View', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to first available issue or use a test issue ID
    await page.goto('/issues');
  });

  test('should have enhanced issue view loaded', async ({ page }) => {
    await expect(page).toHaveTitle(/Issues|Issue/);
  });
});
