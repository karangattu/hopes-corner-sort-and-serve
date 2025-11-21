const { test, expect } = require("@playwright/test");

test.describe("Verify Game look and feel", () => {
  test("should play through a basic game loop", async ({ page }) => {
    await page.goto("https://karangattu.github.io/hopes-corner-sort-and-serve");
    await expect(page.locator("#start-modal")).toMatchAriaSnapshot(`
    - img "Hope's Corner Official Logo"
    - heading "Pantry to Plate game!" [level=1]
    - text: COMMUNITY IMPACT EDUCATIONAL
    - paragraph: This game is inspired by the real Hope's Corner in Mountain View, CA, which provides free nutritious meals and warm showers to anyone in need.
    - paragraph:
      - link "Visit their website to learn more or get involved!":
        - /url: https://www.hopes-corner.org/
    - text: How To Play Features Achievements
    - paragraph:
      - strong: "Your mission:"
      - text: Accept donations, sort food, cook meals, and serve guests. Don't get overwhelmed!
    - list:
      - listitem: Click "Accept Donation" to receive food items
      - listitem: Sort items into the correct storage bins
      - listitem: Use stored ingredients to cook meals
      - listitem: Serve prepared meals to waiting guests
      - listitem: Earn coins to purchase upgrades
    - paragraph:
      - strong: "Key Tip:"
      - text: Guests will arrive once you have 5 meal servings ready or if you collect too many ingredients in storage. If 5 guests leave angry, the game is over!
    - paragraph: "Your High Score: 0"
    - button "Start Playing"
    - button "View Leaderboard"
    `);
    await expect(
      page.getByRole("heading", { name: "Pantry to Plate game!" })
    ).toBeVisible();
    await page.getByText("Features").click();
    await expect(
      page.getByRole("heading", { name: "⚡ Upgrades System" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "📊 Daily Statistics" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "🏆 Achievements" })
    ).toBeVisible();
    await page.getByText("Achievements", { exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "First Day Survivor" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Visit their website to learn" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Start Playing" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Start Playing" }).click();
    await expect(
      page.getByRole("heading", { name: "📦 Donations & Sorting" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "🍳 Storage & Kitchen" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "🍽️ Serving Area" })
    ).toBeVisible();
    await expect(page.getByText("1. Click a ready meal to")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Currently Cooking" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Accept Donation" })
    ).toBeVisible();
    await expect(page.getByText("Overwhelm", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Hope's Corner" })
    ).toBeVisible();
    await expect(page.locator("#sorting-level")).toBeVisible();
    await expect(page.locator("#kitchen-level")).toBeVisible();
    await expect(page.locator("#serving-level")).toBeVisible();

    await expect(page.locator("#donations-station")).toMatchAriaSnapshot(`
        - heading "📦 Donations & Sorting" [level=2]
        - text: Level 1
        - button "Accept Donation"
        - heading "How to Sort:" [level=3]
        - paragraph: Drag & drop donations into the correct bins.
        - heading "Sorting Upgrades" [level=3]
        - text: /🤖 Auto-Sort Assistant Automatically sorts 1 item every \\d+ seconds/
        - button /\\d+ 🪙/ [disabled]
        `);
    await expect(page.locator("#kitchen-station")).toMatchAriaSnapshot(`
        - heading "🍳 Storage & Kitchen" [level=2]
        - text: Level 1
        - heading "🥬 Veggies" [level=3]
        - paragraph: "0"
        - heading "🍗 Protein" [level=3]
        - paragraph: "0"
        - heading "🍞 Carbs" [level=3]
        - paragraph: "0"
        - heading "Currently Cooking" [level=3]
        - text: 0/3 Slots
        - heading "Available Recipes" [level=3]
        - text: 🌮
        - heading "Tacos" [level=3]
        - text: "/3 servings 🍗 x2 🥬 x1 🍞 x1 Cook time: \\\\d+[hmsp]+/"
        - button "Needed" [disabled]
        - text: 🍗
        - heading "Fried Chicken" [level=3]
        - text: "/4 servings 🍗 x2 🍞 x2 Cook time: \\\\d+[hmsp]+/"
        - button "Needed" [disabled]
        - text: 🥧
        - heading "Shepherd's Pie" [level=3]
        - text: "/5 servings 🍗 x2 🥬 x2 🍞 x1 Cook time: \\\\d+[hmsp]+/"
        - button "Needed" [disabled]
        - text: 🍜
        - heading "Chicken Noodle Soup" [level=3]
        - text: "/4 servings 🍗 x1 🥬 x1 🍞 x2 Cook time: \\\\d+[hmsp]+/"
        - button "Needed" [disabled]
        - heading "Kitchen Upgrades" [level=3]
        - text: /⚡ Faster Cooking Reduces cooking time by \\d+%/
        - button /\\d+ 🪙/ [disabled]
        - text: ➕ Extra Cooking Slot Add one more cooking slot (max 5)
        - button /\\d+ 🪙/ [disabled]
        `);
    await expect(page.locator("#serving-station")).toMatchAriaSnapshot(`
        - heading "🍽️ Serving Area" [level=2]
        - text: Level 1
        - heading "How to Serve:" [level=3]
        - paragraph: 1. Click a ready meal to select it.
        - text: Guests Served Today 0 Meals Prepared 0 Average Satisfaction 0%
        - heading "Ready Meals" [level=3]
        - heading "Waiting Guests" [level=3]
        - heading "Serving Upgrades" [level=3]
        - text: /⏱️ Guest Patience Guests wait \\d+% longer before getting angry/
        - button /\\d+ 🪙/ [disabled]
        - text: 🌟 Bonus Points Earn +2 points per satisfied guest
        - button /\\d+ 🪙/ [disabled]
        `);
  });
});
