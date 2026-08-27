import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4174',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    env: {
      ...process.env,
      VITE_SOCIOBOT_BUY_URL: 'https://api.sociobot.in/api/v1/products/wallpage-test/checkout',
      VITE_SOCIOBOT_LICENSE_VERIFY_URL: 'https://api.sociobot.in/api/v1/products/wallpage-test/verify',
    },
  },
});
