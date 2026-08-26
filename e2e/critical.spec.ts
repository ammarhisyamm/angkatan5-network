import { test, expect } from '@playwright/test';
test('login -> discover -> profile', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill('member@example.com');
  await page.getByRole('button', { name: /Continue|Login|Sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard|\/discover|\/onboarding/);
});
test('search debounce', async ({ page }) => {
  await page.goto('/discover');
  const input = page.getByPlaceholder(/Search people/i);
  if (await input.count()) {
    await input.fill('Design');
    await page.waitForTimeout(400);
    await expect(page.getByText(/People Found/i)).toBeVisible();
  }
});
