import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://karangattu.github.io/hopes-corner-sort-and-serve/');
  await expect(page.getByRole('heading', { name: 'Pantry to Plate' })).toBeVisible();
  await expect(page.getByText('🔊 For the best experience,')).toBeVisible();
  await expect(page.getByRole('heading', { name: '🎯 How to Play' })).toBeVisible();
  await page.getByRole('button', { name: '▶ Play Now' }).click();
  await page.getByRole('button', { name: 'Next ▶' }).click();
  await page.getByRole('button', { name: 'Skip' }).click();
  await expect(page.getByRole('heading', { name: '📦 Donations & Sorting' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '🍳 Storage & Kitchen' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '🍽️ Serving Area' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hope\'s Corner' })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'Overwhelm' }).nth(2)).toBeVisible();
  await expect(page.getByText('Angry Guests')).toBeVisible();
});
