import { test, expect } from '@playwright/test';

test('home page loads and theme toggle is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /build stronger data engineering judgment/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /toggle theme|light mode|dark mode/i })).toBeVisible();
});

test('app dashboard shell renders', async ({ page }) => {
  await page.goto('/app/dashboard');
  await expect(page.getByRole('heading', { name: /your readiness dashboard/i })).toBeVisible();
});
