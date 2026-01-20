import { test, expect } from '@playwright/test';

test('welcome screen and start game', async ({ page }) => {
  await page.goto('/');
  
  // Verify welcome modal content
  await expect(page.getByRole('heading', { name: 'Pantry to Plate' })).toBeVisible();
  await expect(page.getByText('For the best experience, please enable sound on your device.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How to Play' })).toBeVisible();
  
  // Start the game
  await page.getByRole('button', { name: 'Play Now' }).click();
  
  // After starting, verify the main game UI is visible
  // Note: Quick tour is not shown in automated/webdriver environments
  await expect(page.getByRole('heading', { name: 'Donations & Sorting' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Storage & Kitchen' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Serving Area' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hope\'s Corner' })).toBeVisible();
  await expect(page.getByText('Overwhelm')).toBeVisible();
  await expect(page.getByText('Angry Guests')).toBeVisible();
  
  // Verify game stats are showing
  await expect(page.getByText('Coins')).toBeVisible();
  await expect(page.getByText('Score', { exact: true })).toBeVisible();
  await expect(page.getByText('Day', { exact: true })).toBeVisible();
});

test('game stations are functional', async ({ page }) => {
  await page.goto('/');
  
  // Start the game
  await page.getByRole('button', { name: 'Play Now' }).click();
  
  // Wait for game to initialize
  await expect(page.getByRole('heading', { name: 'Donations & Sorting' })).toBeVisible();
  
  // Verify Accept Donation button becomes enabled (should appear after game starts)
  await expect(page.getByRole('button', { name: 'Accept Donation' })).toBeVisible();
  
  // Verify storage bins are visible
  await expect(page.getByText('Veggies')).toBeVisible();
  await expect(page.getByText('Protein')).toBeVisible();
  await expect(page.getByText('Carbs')).toBeVisible();
  
  // Verify kitchen section
  await expect(page.getByRole('heading', { name: 'Currently Cooking' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Available Recipes' })).toBeVisible();
  
  // Verify serving section
  await expect(page.getByRole('heading', { name: 'Ready Meals' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Waiting Guests' })).toBeVisible();
});

test('leaderboard modal opens', async ({ page }) => {
  await page.goto('/');
  
  // Click on View Leaderboard button
  await page.getByRole('button', { name: 'View Leaderboard' }).click();
  
  // Verify leaderboard modal opens
  await expect(page.getByRole('heading', { name: 'Top 5 Scores' })).toBeVisible();
});
