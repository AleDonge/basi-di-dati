import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  // Keep concurrent Chromium instances bounded on the local Windows host.
  testDir: "./tests/e2e", fullyParallel: true, workers: 2, reporter: "list",
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } }],
  webServer: { command: "npm run start", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
