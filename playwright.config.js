// playwright.config.js
// Basic Playwright config for testing a static web game
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: {
    command: 'npx serve -l 3000',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'https://karangattu.github.io/hopes-corner-sort-and-serve',
    headless: true,
  },
};

module.exports = config;
