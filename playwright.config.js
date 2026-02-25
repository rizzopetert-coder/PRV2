/**
 * Principal Resolution // Playwright Configuration
 * Suite: Institutional Logic Matrix
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: 'diagnostic-matrix.spec.js',

  // Run all 12 profiles in parallel
  fullyParallel: true,
  workers: 4,

  // Retry once on CI to absorb flaky animation timing
  retries: process.env.CI ? 1 : 0,

  // Reporter: list in dev, HTML on CI
  reporter: process.env.CI ? 'html' : 'list',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Capture trace and screenshot on failure only
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',

    // Allow time for Next.js hydration before interactions begin
    actionTimeout: 8000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'] },
    },
  ],

  // Start the Next.js dev server automatically when running locally
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 30000,
      },
});