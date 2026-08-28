import { readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

test('@claim:demo-sandbox opens and resets an isolated fixed sample', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('wallpage:settings', JSON.stringify({ clock: false, seenWelcome: true })));
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveTitle('Demo — Wallpage');
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await expect(page.getByText('Sample scene setting · sample-moon-tide-2042')).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'Hide clock' }).click();
  await page.evaluate(() => localStorage.setItem('demo:temporary-check', 'remove me'));
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(['demo:temporary-check', 'demo:wallpage:settings', 'wallpage:settings']);
  expect(await page.evaluate(() => localStorage.getItem('wallpage:settings'))).toBe(JSON.stringify({ clock: false, seenWelcome: true }));
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(['wallpage:settings']);
  await page.evaluate(() => localStorage.setItem('demo:leave-check', 'remove me'));
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\?gallery=1(?:&|$)/);
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(['wallpage:settings']);
  expect(await page.evaluate(() => localStorage.getItem('wallpage:settings'))).toBe(JSON.stringify({ clock: false, seenWelcome: true }));

  await page.goto('/demo?scene=cloud-chamber');
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await expect(page.getByText('Sample scene setting · sample-moon-tide-2042')).toBeVisible();
});

test('@claim:local-rendering draws every free scene without a media stream', async ({ page }) => {
  const mediaRequests: string[] = [];
  page.on('request', (request) => { if (request.resourceType() === 'media') mediaRequests.push(request.url()); });
  await page.goto('/?demo=1');
  await expect.poll(() => page.locator('#scene').evaluate((canvas: HTMLCanvasElement) => canvas.width * canvas.height)).toBeGreaterThan(0);
  for (const title of ['Quiet duel', 'Cloud chamber', 'Ember bloom', 'Salt constellation', 'Kelp current', 'Rain archive']) {
    await page.getByRole('button', { name: 'Next scene' }).click();
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
  await expect(page.locator('video, iframe')).toHaveCount(0);
  expect(mediaRequests).toEqual([]);
});

test('@claim:privacy-no-tracking keeps the complete demo flow same-origin', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4174') external.push(request.url());
  });
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await page.getByRole('button', { name: /Cloud chamber/ }).click();
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByLabel('Scene brightness').fill('70');
  await page.getByRole('button', { name: 'Close settings' }).click();
  expect(external).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage).every((key) => key.startsWith('demo:')))).toBe(true);
  expect(await page.context().cookies()).toEqual([]);
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
});

test('@claim:offline-reload reopens the demo after the first visit', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/?demo=1');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await expect(page.getByText('Offline · the gallery keeps playing')).toBeVisible();
  await context.close();
});

test('@claim:scene-count has eight free and two locked Collector scenes', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('.scene-card')).toHaveCount(10);
  await expect(page.locator('.scene-card[data-locked]')).toHaveCount(2);
  await expect(page.locator('.scene-card:not([data-locked])')).toHaveCount(8);
});

test('@claim:collector-license keeps scenes locked until verified by Sociobot', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/wallpage-test/verify?**', (route) => {
    const valid = new URL(route.request().url()).searchParams.get('license') === 'signed-valid-license';
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(valid ? { valid: true, reason: 'ok', expires_at: '2030-01-01T00:00:00Z' } : { valid: false, reason: 'invalid' }) });
  });
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('[data-scene="fault-garden"]')).toHaveAttribute('data-locked', 'true');
  await page.getByRole('button', { name: 'Close scene library' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: /Open today’s gallery/ }).click();
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.getByRole('heading', { name: 'Collector · $19 once' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'See the $19 Collector price' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/wallpage-test/checkout');
  await expect(page.getByRole('link', { name: 'See the $19 Collector price' })).toHaveAttribute('target', '_blank');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Restore Collector license' }).click();
  await page.getByLabel('License key').fill('tampered-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/could not be verified/i);
  await page.unroute('https://api.sociobot.in/api/v1/products/wallpage-test/verify?**');
  await page.context().setOffline(true);
  await page.getByLabel('License key').fill('signed-offline-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/offline.*cannot be confirmed/i);
  await page.context().setOffline(false);
  await page.route('https://api.sociobot.in/api/v1/products/wallpage-test/verify?**', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: '2030-01-01T00:00:00Z' }) }));
  await page.getByLabel('License key').fill('signed-valid-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/Collector is active/);
});

test('@claim:controls-fade hides controls after 4.5 seconds and restores them', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.locator('.gallery')).toHaveAttribute('data-chrome', 'visible');
  await page.waitForTimeout(4700);
  await expect(page.locator('.gallery')).toHaveAttribute('data-chrome', 'hidden');
  await page.mouse.move(50, 500);
  await expect(page.locator('.gallery')).toHaveAttribute('data-chrome', 'visible');
});

test('@claim:keyboard-controls changes scenes, playback, clock, settings, and guide', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Quiet duel' })).toBeVisible();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
  await page.keyboard.press('c');
  await expect(page.locator('#clock')).toBeHidden();
  await page.keyboard.press('s');
  await expect(page.getByRole('dialog', { name: 'Adjust the idle display' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('h');
  await expect(page.getByRole('dialog', { name: 'Use Wallpage on a larger screen' })).toBeVisible();
});

test('@claim:touch-targets gives visible controls 44px touch targets at 390px', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('/?demo=1');
  const undersized = await page.locator('button, a').evaluateAll((elements) => elements.filter((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
  }).map((element) => ({ text: element.textContent?.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
  expect(undersized).toEqual([]);
  await page.close();
});

test('@claim:asset-budgets enforces the documented static asset limits', async () => {
  const files = await readdir(resolve('dist/assets'));
  const sizes = await Promise.all(files.map(async (file) => ({ file, bytes: (await stat(resolve('dist/assets', file))).size })));
  expect(sizes.filter(({ file }) => file.startsWith('index-') && file.endsWith('.js')).reduce((sum, item) => sum + item.bytes, 0)).toBeLessThanOrEqual(200 * 1024);
  expect(sizes.filter(({ file }) => file.endsWith('.css')).every(({ bytes }) => bytes <= 50 * 1024)).toBe(true);
  expect(sizes.filter(({ file }) => /\.(?:avif|webp|jpg)$/.test(file)).every(({ bytes }) => bytes <= 300 * 1024)).toBe(true);
});
