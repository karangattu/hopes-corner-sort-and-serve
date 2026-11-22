import { test, expect } from '@playwright/test';

test('the first crate covers tacos and guests arrive after cooking', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await page.getByRole('button', { name: 'Play Now' }).click();
  await page.clock.fastForward(65000);
  await expect(page.locator('#day')).toHaveText('1');
  await expect(page.locator('.guest')).toHaveCount(0);

  await page.getByRole('button', { name: 'Accept Donation' }).click();
  await expect(page.locator('.donation-item[data-type="protein"]')).toHaveCount(2);
  const beans = page.getByRole('button', { name: 'beans protein' });
  await beans.click();
  await page.locator('#veg-bin').click();
  await expect(beans).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#overwhelm-bar')).toHaveCSS('width', '0px');
  await page.locator('#protein-bin').click();

  await page.getByRole('button', { name: 'carrot produce' }).dragTo(page.locator('#veg-bin'));
  await page.getByRole('button', { name: 'bread carbs' }).click();
  await page.locator('#carbs-bin').click();
  await page.getByRole('button', { name: 'egg protein' }).click();
  await page.locator('#protein-bin').click();
  await expect(page.locator('#protein-count')).toHaveText('2');
  await page.locator('[data-recipe-id="recipe-0"]').click();
  await expect(page.locator('.guest')).toHaveCount(0);

  await page.clock.runFor(5000);
  const mei = page.getByRole('button', { name: 'Serve Mei' });
  await expect(mei.locator('img')).toHaveAttribute('src', /mei-arrived\.webp$/);
  await page.clock.runFor(18000);
  await expect(mei).toContainText('Waiting');
  await expect(mei.locator('img')).toHaveAttribute('src', /mei-waiting\.webp$/);
  await page.clock.runFor(24000);
  await expect(mei).toContainText('Serve soon');
  await expect(mei.locator('img')).toHaveAttribute('src', /mei-worried\.webp$/);

  await mei.click();
  await expect(page.locator('#guests-served-today')).toHaveText('1');
  await expect(mei.locator('.guest-portrait')).toHaveAttribute('src', /mei-served\.webp$/);
});

test.describe('phone layout', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('rotation preserves the selected ingredient and makes room for the bins', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Play Now' }).click();
    await page.getByRole('button', { name: 'Accept Donation' }).tap();
    const beans = page.getByRole('button', { name: 'beans protein' });
    const proteinBin = page.locator('#protein-bin');
    await beans.tap();
    await expect(proteinBin).toHaveClass(/can-drop/);

    await page.setViewportSize({ width: 844, height: 390 });
    await expect(beans).toHaveAttribute('aria-pressed', 'true');
    const tray = await page.locator('#sorting-area').boundingBox();
    const bin = await proteinBin.boundingBox();
    expect(bin.x).toBeGreaterThan(tray.x + tray.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(844);
    await proteinBin.tap();
    await expect(page.locator('#protein-count')).toHaveText('1');

    await page.getByRole('button', { name: 'Cook', exact: true }).tap();
    await expect(page.getByRole('heading', { name: 'Available Recipes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Currently Cooking' })).toBeVisible();
  });
});

test('service ramps up after the first five arrivals in the same shift', async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => { Math.random = () => 0.4; });
  await page.goto('/');
  await page.getByRole('button', { name: 'Play Now' }).click();
  await page.getByRole('button', { name: 'Accept Donation' }).click();

  for (const category of ['protein', 'veg', 'carbs', 'protein']) {
    await page.locator(`.donation-item[data-type="${category}"]`).first().click();
    await page.locator(`#${category}-bin`).click();
  }
  await page.locator('[data-recipe-id="recipe-0"]').click();
  await page.clock.runFor(5100);
  await page.getByRole('button', { name: 'Accept Donation' }).click();
  const broccoli = page.getByRole('button', { name: 'broccoli produce' });
  await expect(broccoli).toBeVisible();
  await expect(broccoli.locator('img')).toHaveAttribute('src', /broccoli\.webp$/);

  // Jump across arrival timers without running every patience tick.
  for (let guest = 1; guest < 5; guest++) {
    await page.clock.fastForward(22000);
    await expect(page.locator(`#guest-${guest}`)).toBeAttached();
  }
  const rosa = page.getByRole('button', { name: 'Serve Rosa' });
  await expect(rosa).toBeVisible();
  const portrait = rosa.locator('.guest-portrait');
  await expect(portrait).toHaveAttribute('src', /rosa-arrived\.webp$/);
  await expect.poll(() => portrait.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator('#rush-status')).toBeEmpty();
  await expect(page.locator('#guest-5')).toHaveCount(0);

  await page.clock.fastForward(15000);
  await expect(page.locator('#guest-5')).toBeAttached();
  await expect(page.locator('#rush-status')).toHaveText('Rush 1');

  for (let guest = 6; guest <= 9; guest++) {
    await page.clock.fastForward(15000);
    await expect(page.locator(`#guest-${guest}`)).toBeAttached();
  }
  await expect(page.locator('#rush-status')).toHaveText('Rush 1');
  await page.clock.fastForward(10000);
  await expect(page.locator('#guest-10')).toBeAttached();
  await expect(page.locator('#rush-status')).toHaveText('Rush 2');
});
