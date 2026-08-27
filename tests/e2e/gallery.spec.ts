import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('gallery works from welcome through keyboard navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/?seed=test-night');
  await expect(page).toHaveTitle(/Wallpage/);
  await expect(page.getByRole('dialog', { name: 'Time, made ambient.' })).toBeVisible();
  await page.getByRole('button', { name: /Enter the gallery/ }).click();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Brackish drift' })).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.getByRole('dialog', { name: 'Choose an environment' })).toBeVisible();
  await page.getByRole('button', { name: /Cloud chamber/ }).click();
  await expect(page.getByRole('heading', { name: 'Cloud chamber' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('gallery and privacy route have no serious accessibility violations', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true })));
  await page.goto('/');
  const galleryResults = await new AxeBuilder({ page }).analyze();
  expect(galleryResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const privacyResults = await new AxeBuilder({ page }).analyze();
  expect(privacyResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('390px layout remains operable without horizontal overflow', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true })));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open settings' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.getByRole('dialog', { name: 'Display settings' })).toBeVisible();
  await expect(page.getByLabel('Auto-rotate')).toBeVisible();
  await page.close();
});

test('reduced-motion visitors start paused and can opt in', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true })));
  await page.goto('/');
  const play = page.getByRole('button', { name: 'Play animation' });
  await expect(play).toBeVisible();
  await play.click();
  await expect(page.getByRole('button', { name: 'Pause animation' })).toBeVisible();
  await context.close();
});

test('Collector ignores a tampered local flag and stays locked', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true }));
    localStorage.setItem('wallpage:collector', 'verified');
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('[data-scene="fault-garden"]')).toHaveAttribute('data-locked', 'true');
  await expect(page.locator('[data-scene="aurora-basin"]')).toHaveAttribute('data-locked', 'true');
  await expect(page.evaluate(() => localStorage.getItem('wallpage:collector'))).resolves.toBeNull();
});

test('Collector unlocks only after a positive signed entitlement response', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/wallpage-test/verify?**', async (route) => {
    expect(new URL(route.request().url()).searchParams.get('license')).toBe('signed-valid-license');
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: '2030-01-01T00:00:00Z' }) });
  });
  await page.addInitScript(() => {
    localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true }));
    localStorage.setItem('sb_license:wallpage', 'signed-valid-license');
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/Collector is active for this session/);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await page.locator('[data-scene="fault-garden"]').click();
  await expect(page.getByRole('heading', { name: 'Fault garden' })).toBeVisible();
});

test('expired or tampered signed licenses remain locked with an honest state', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/wallpage-test/verify?**', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'expired' }) }));
  await page.addInitScript(() => {
    localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true }));
    localStorage.setItem('sb_license:wallpage', 'tampered-license');
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/license has expired/i);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('[data-scene="fault-garden"]')).toHaveAttribute('data-locked', 'true');
});

test('offline Collector verification stays locked and explains why', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true })));
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByRole('button', { name: 'Enter license' }).click();
  await page.getByLabel('License key').fill('signed-offline-license');
  await context.setOffline(true);
  await page.evaluate(() => Object.defineProperty(Navigator.prototype, 'onLine', { configurable: true, get: () => false }));
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/offline.*cannot be confirmed/i);
  await expect(page.locator('#license-message')).toHaveText(/offline/i);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('[data-scene="fault-garden"]')).toHaveAttribute('data-locked', 'true');
  await context.close();
});

test('installed shell reopens offline', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true })));
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Brackish drift' })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText(/Offline · the gallery will keep playing/)).toBeVisible();
  await context.close();
});
