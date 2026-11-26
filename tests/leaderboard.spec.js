import { test, expect } from '@playwright/test';

const leaderboardApi = '**/rest/v1/hopes_corner_leaderboard*';

async function finishFirstShift(page) {
  await page.clock.install();
  await page.addInitScript(() => { Math.random = () => 0.26; });
  await page.goto('/');
  await page.getByRole('button', { name: 'Play Now' }).click();
  await page.getByRole('button', { name: 'Accept Donation' }).click();

  for (const category of ['protein', 'veg', 'carbs', 'protein']) {
    await page.locator(`.donation-item[data-type="${category}"]`).first().click();
    await page.locator(`#${category}-bin`).click();
  }
  await page.locator('[data-recipe-id="recipe-0"]').click();
  await page.clock.runFor(5100);
  await page.getByRole('button', { name: 'Serve Mei' }).click();
  const gameOver = page.getByRole('heading', { name: 'Game Over!' });
  // Stop advancing the game clock once the leaderboard request starts.
  for (let elapsed = 0; elapsed < 160000 && !(await gameOver.isVisible()); elapsed += 5000) {
    await page.clock.runFor(5000);
  }
  await expect(gameOver).toBeVisible();
}

test('qualifying score can be submitted and appears with the player’s rank', async ({ page }) => {
  test.setTimeout(60000);
  let savedScore;
  let posts = 0;
  let failedRankRefresh = false;
  await page.route(leaderboardApi, async route => {
    if (route.request().method() === 'POST') {
      posts++;
      if (posts === 1) return route.fulfill({ status: 503 });
      savedScore = route.request().postDataJSON();
      return route.fulfill({ status: 201 });
    }
    const entries = [{ player_name: 'Riley', score: 1000 }, { player_name: '<em>Sam</em>', score: 10 }];
    if (savedScore) {
      if (!failedRankRefresh) {
        failedRankRefresh = true;
        return route.fulfill({ status: 503 });
      }
      entries.splice(1, 0, savedScore);
    }
    return route.fulfill({ json: entries });
  });

  await finishFirstShift(page);
  const board = page.getByRole('region', { name: 'Top 5 Scores' });
  await expect(board.getByRole('listitem')).toHaveCount(2);
  await expect(board.getByText('<em>Sam</em>', { exact: true })).toBeVisible();
  await expect(board.getByText('You made the top five! Your score currently ranks #2.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play Again' })).toBeVisible();

  const name = board.getByLabel('Name on the public leaderboard');
  await name.fill('  Jo  ');
  await name.press('Enter');
  await expect(board.getByText('Could not confirm your score was saved. You can try again.')).toBeVisible();
  await expect(name).toHaveValue('  Jo  ');
  await name.press('Enter');
  await expect(board.getByText('Score saved. Retry the leaderboard to see your rank.')).toBeVisible();
  await expect(board.getByRole('button', { name: 'Submit Score' })).toBeHidden();
  await board.getByRole('button', { name: 'Retry leaderboard' }).click();
  await expect(board.getByText('Score saved! You’re #2 on the leaderboard.')).toBeVisible();
  await expect(board.locator('.leaderboard-player')).toContainText('Jo (you)');
  await expect(board.getByRole('button', { name: 'Submit Score' })).toBeHidden();
  expect(savedScore).toEqual({ player_name: 'Jo', score: Number(await page.locator('#final-score').textContent()) });
  expect(posts).toBe(2);
});

test('game over can retry a failed leaderboard load and shows the cutoff', async ({ page }) => {
  test.setTimeout(60000);
  let requests = 0;
  await page.route(leaderboardApi, route => {
    requests++;
    if (requests === 1) return route.fulfill({ status: 503 });
    return route.fulfill({ json: [1200, 1150, 1100, 1050, 1000].map((score, index) => ({
      player_name: `Player ${index + 1}`, score
    })) });
  });

  await finishFirstShift(page);
  const board = page.getByRole('region', { name: 'Top 5 Scores' });
  await expect(board.getByText('Could not load the leaderboard.')).toBeVisible();
  await board.getByRole('button', { name: 'Retry leaderboard' }).click();
  await expect(board.getByRole('listitem')).toHaveCount(5);
  await expect(board.getByText('Score at least 1,001 to enter the top five.')).toBeVisible();
  await expect(board.getByRole('button', { name: 'Submit Score' })).toBeHidden();
});
