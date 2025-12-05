const { test, expect } = require("@playwright/test");

test.describe("Verify Game look and feel", () => {
  test("should play through a basic game loop", async ({ page }) => {
    await page.goto(
      "https://karangattu.github.io/hopes-corner-sort-and-serve/"
    );
    await expect(page.locator("#start-modal")).toContainText("Pantry to Plate");
    await expect(page.locator("#start-modal")).toContainText("🎯 How to Play");
    await page.getByRole("button", { name: "▶ Play Now" }).click();
    await expect(page.getByRole("banner")).toMatchAriaSnapshot(`
    - banner:
      - img "Hope's Corner Official Logo"
      - heading "Hope's Corner" [level=1]
      - heading "Daily Update" [level=2]
      - paragraph: Get your kitchen ready!
      - text: Coins
      - paragraph: "0"
      - text: High Score
      - paragraph: "0"
      - text: Score
      - paragraph: "0"
      - text: Day
      - paragraph: "1"
      - text: Overwhelm Angry Guests
      - paragraph: 0 / 5
    `);
    await page
      .getByText(
        "🍳 Storage & Kitchen Level 1 Currently Cooking 0/3 Slots Available Recipes ←"
      )
      .click();
    await page
      .getByText(
        "📦 Donations & Sorting Level 1 Accept Donation How to Sort: Drag & drop"
      )
      .click();
    await page.getByText("🍽️ Serving Area Level 1 How").click();
    await page.getByText("Kitchen Upgrades ⚡ Faster").click();
  });
});
