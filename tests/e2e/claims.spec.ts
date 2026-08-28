import { access, readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

async function expectCanvasToChange(page: import('@playwright/test').Page) {
  const canvas = page.locator('#scene');
  await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) => node.width * node.height)).toBeGreaterThan(0);
  const first = await canvas.evaluate((node: HTMLCanvasElement) => node.toDataURL());
  await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) => node.toDataURL()), { timeout: 4000 }).not.toBe(first);
}

const verifierPattern = /https:\/\/api\.sociobot\.in\/api\/v1\/products\/wallpage(?:-test)?\/verify\?.*/;

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
  await expect(page).toHaveURL(/\/gallery\?scene=brackish-drift$/);
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(['wallpage:settings']);
  expect(await page.evaluate(() => localStorage.getItem('wallpage:settings'))).toBe(JSON.stringify({ clock: false, seenWelcome: true }));

  await page.goto('/demo?scene=cloud-chamber');
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await expect(page.getByText('Sample scene setting · sample-moon-tide-2042')).toBeVisible();

  await page.goto('/?demo=1&scene=cloud-chamber');
  await expect(page).toHaveTitle('Demo — Wallpage');
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).every((key) => key.startsWith('demo:') || key === 'wallpage:settings'))).toBe(true);
});

test('@claim:local-rendering draws all ten scenes without a media stream', async ({ page }) => {
  const mediaRequests: string[] = [];
  page.on('request', (request) => { if (request.resourceType() === 'media') mediaRequests.push(request.url()); });
  await page.route(verifierPattern, (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) }));
  await page.goto('/demo');
  await page.evaluate(() => {
    localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true, rotationMinutes: 0 }));
    localStorage.setItem('sb_license:wallpage', 'recorded-valid-license');
  });
  await page.goto('/gallery?seed=sample-all-scenes-2042');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/Collector is active/);
  await page.getByRole('button', { name: 'Close settings' }).click();
  for (const title of ['Brackish drift', 'Moon tide', 'Quiet duel', 'Cloud chamber', 'Ember bloom', 'Salt constellation', 'Kelp current', 'Rain archive', 'Fault garden', 'Aurora basin']) {
    await page.getByRole('button', { name: 'Open scene library' }).click();
    await page.getByRole('button', { name: new RegExp(title) }).click();
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expectCanvasToChange(page);
  }
  await expect(page.locator('video, iframe')).toHaveCount(0);
  expect(mediaRequests).toEqual([]);
});

test('@claim:privacy-no-tracking keeps the complete demo flow same-origin', async ({ page }, testInfo) => {
  const external: string[] = [];
  const productOrigin = new URL(String(testInfo.project.use.baseURL)).origin;
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== productOrigin) external.push(request.url());
  });
  await page.goto('/demo');
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

test('@claim:collector-network contacts only the declared verifier when a license exists', async ({ browser }) => {
  const withoutLicense = await browser.newPage();
  const firstVerifierRequests: string[] = [];
  withoutLicense.on('request', (request) => { if (request.url().includes('/verify')) firstVerifierRequests.push(request.url()); });
  await withoutLicense.addInitScript(() => localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true })));
  await withoutLicense.goto('/gallery');
  await withoutLicense.waitForTimeout(300);
  expect(firstVerifierRequests).toEqual([]);
  await withoutLicense.close();

  const withLicense = await browser.newPage();
  const verifierRequests: string[] = [];
  await withLicense.route(verifierPattern, (route) => {
    verifierRequests.push(route.request().url());
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) });
  });
  await withLicense.addInitScript(() => {
    localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true }));
    localStorage.setItem('sb_license:wallpage', 'saved-active-license');
  });
  await withLicense.goto('/gallery');
  await withLicense.getByRole('button', { name: 'Open settings' }).click();
  await expect(withLicense.locator('#collector-status')).toHaveText(/Collector is active/);
  expect(verifierRequests).toHaveLength(1);
  expect(new URL(verifierRequests[0]).origin).toBe('https://api.sociobot.in');
  expect(new URL(verifierRequests[0]).searchParams.get('license')).toBe('saved-active-license');
  await withLicense.close();
});

test('@claim:offline-reload reopens the demo after the first visit', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await expect(page.getByText('Offline · the gallery keeps playing')).toBeVisible();
  await expectCanvasToChange(page);
  await context.close();
});

test('@claim:scene-count has eight free and two locked Collector scenes', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('.scene-card')).toHaveCount(10);
  await expect(page.locator('.scene-card[data-locked]')).toHaveCount(2);
  await expect(page.locator('.scene-card:not([data-locked])')).toHaveCount(8);
});

test('@claim:collector-license keeps scenes locked until verified by Sociobot', async ({ page }) => {
  await page.route(verifierPattern, (route) => {
    const valid = new URL(route.request().url()).searchParams.get('license') === 'signed-valid-license';
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(valid ? { valid: true, reason: 'ok', expires_at: '2030-01-01T00:00:00Z' } : { valid: false, reason: 'invalid' }) });
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('[data-scene="fault-garden"]')).toHaveAttribute('data-locked', 'true');
  await page.getByRole('button', { name: 'Close scene library' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: /Open today’s gallery/ }).click();
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.getByRole('heading', { name: 'Collector · $19 once' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open checkout — $19 once (external)' })).toHaveAttribute('href', /https:\/\/api\.sociobot\.in\/api\/v1\/products\/wallpage(?:-test)?\/checkout/);
  await expect(page.getByRole('link', { name: 'Open checkout — $19 once (external)' })).toHaveAttribute('target', '_blank');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Restore Collector license' }).click();
  await page.getByLabel('License key').fill('tampered-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/could not be verified/i);
  await page.unroute(verifierPattern);
  await page.context().setOffline(true);
  await page.getByLabel('License key').fill('signed-offline-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/offline.*cannot be confirmed/i);
  await page.context().setOffline(false);
  await page.route(verifierPattern, (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: '2030-01-01T00:00:00Z' }) }));
  await page.getByLabel('License key').fill('signed-valid-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/Collector is active/);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('[data-scene="fault-garden"]')).not.toHaveAttribute('data-locked', 'true');
  await expect(page.locator('[data-scene="aurora-basin"]')).not.toHaveAttribute('data-locked', 'true');
  await page.locator('[data-scene="fault-garden"]').click();
  await expect(page.getByRole('heading', { name: 'Fault garden' })).toBeVisible();
  await expectCanvasToChange(page);
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await page.locator('[data-scene="aurora-basin"]').click();
  await expect(page.getByRole('heading', { name: 'Aurora basin' })).toBeVisible();
  await expectCanvasToChange(page);
});

test('@claim:display-settings applies and isolates every display choice', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-08-28T23:00:00Z') });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByLabel('Auto-rotate').selectOption('1');
  await page.getByLabel('Motion quality').selectOption('24');
  await page.getByLabel('Scene brightness').fill('65');
  await page.getByLabel('Show date').uncheck();
  await page.getByLabel('Dim at night').check();
  await page.getByLabel('Dim from').fill('22:00');
  await page.getByLabel('Until').fill('07:00');
  await expect(page.locator('.gallery')).toHaveCSS('--scene-brightness', '0.65');
  await expect(page.locator('.gallery')).toHaveClass(/night-dimmed/);
  await expect(page.locator('#clock-date')).toBeHidden();
  await page.getByLabel('Dim from').fill('08:00');
  await page.getByLabel('Until').fill('20:00');
  await expect(page.locator('.gallery')).not.toHaveClass(/night-dimmed/);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.clock.fastForward(60_100);
  await expect(page.getByRole('heading', { name: 'Quiet duel' })).toBeVisible();
  const demoState = await page.evaluate(() => ({ keys: Object.keys(localStorage), value: localStorage.getItem('demo:wallpage:settings') }));
  expect(demoState.keys).toEqual(['demo:wallpage:settings']);
  expect(JSON.parse(demoState.value!)).toMatchObject({ rotationMinutes: 1, maxFps: 24, brightness: 0.65, date: false, nightDim: true, dimStart: '08:00', dimEnd: '20:00' });

  await page.goto('/gallery');
  await page.getByRole('button', { name: /Open today’s gallery/ }).click();
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByLabel('Scene brightness').fill('75');
  expect(await page.evaluate(() => localStorage.getItem('wallpage:settings'))).toContain('"brightness":0.75');
  expect(await page.evaluate(() => localStorage.getItem('demo:wallpage:settings'))).toBeTruthy();
});

test('@claim:share-scene shares the active scene and fixed seed', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: ShareData) => { (window as unknown as { sharedUrl: string }).sharedUrl = String(data.url); } });
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Next scene' }).click();
  await page.getByRole('button', { name: 'Share this scene' }).click();
  const shared = new URL(await page.evaluate(() => (window as unknown as { sharedUrl: string }).sharedUrl));
  expect(shared.searchParams.get('scene')).toBe('quiet-duel');
  expect(shared.searchParams.get('seed')).toBe('sample-moon-tide-2042');
});

test('@claim:fullscreen supports the button and F shortcut in both directions', async ({ page }) => {
  await page.addInitScript(() => {
    let fullscreen: Element | null = null;
    Object.defineProperty(Document.prototype, 'fullscreenElement', { configurable: true, get: () => fullscreen });
    Object.defineProperty(Element.prototype, 'requestFullscreen', { configurable: true, value: async function () { fullscreen = this as Element; document.dispatchEvent(new Event('fullscreenchange')); } });
    Object.defineProperty(Document.prototype, 'exitFullscreen', { configurable: true, value: async () => { fullscreen = null; document.dispatchEvent(new Event('fullscreenchange')); } });
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Enter fullscreen' }).click();
  await expect(page.getByRole('button', { name: 'Leave fullscreen' })).toBeVisible();
  await page.keyboard.press('f');
  await expect(page.getByRole('button', { name: 'Enter fullscreen' })).toBeVisible();
});

test('@claim:controls-fade hides controls after 4.5 seconds and restores them', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.gallery')).toHaveAttribute('data-chrome', 'visible');
  await page.waitForTimeout(4700);
  await expect(page.locator('.gallery')).toHaveAttribute('data-chrome', 'hidden');
  await page.mouse.move(50, 500);
  await expect(page.locator('.gallery')).toHaveAttribute('data-chrome', 'visible');
});

test('@claim:keyboard-controls changes scenes, playback, clock, settings, and guide', async ({ page }) => {
  await page.goto('/demo');
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

test('@claim:tv-display-support works in Chromium by keyboard at a TV-like size without fullscreen', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.addInitScript(() => Object.defineProperty(Element.prototype, 'requestFullscreen', { configurable: true, value: async () => { throw new Error('unsupported'); } }));
  await page.goto('/demo');
  expect(await page.evaluate(() => navigator.userAgent)).toMatch(/(?:Headless)?Chrome\//);
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Quiet duel' })).toBeVisible();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
  await page.keyboard.press('Space');
  await page.keyboard.press('f');
  await expect(page.getByText('Fullscreen is not available in this browser.')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
  await page.close();
});

test('@claim:wake-lock follows play and visibility state with an unsupported fallback', async ({ browser }) => {
  const page = await browser.newPage();
  await page.addInitScript(() => {
    const state = { requests: 0, releases: 0, hidden: false };
    (window as unknown as { wakeTest: typeof state }).wakeTest = state;
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state.hidden ? 'hidden' : 'visible' });
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => state.hidden });
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: async () => {
      state.requests += 1;
      const listeners: Array<() => void> = [];
      return { released: false, addEventListener: (_type: string, listener: () => void) => listeners.push(listener), release: async function () { this.released = true; state.releases += 1; listeners.forEach((listener) => listener()); } };
    } } });
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByLabel('Keep screen awake').check();
  await expect(page.getByText('The screen will stay awake while this scene plays.')).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { wakeTest: { requests: number } }).wakeTest.requests)).toBe(1);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Pause animation' }).click();
  expect(await page.evaluate(() => (window as unknown as { wakeTest: { releases: number } }).wakeTest.releases)).toBe(1);
  await page.getByRole('button', { name: 'Play animation' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { wakeTest: { requests: number } }).wakeTest.requests)).toBe(2);
  await page.evaluate(() => { (window as unknown as { wakeTest: { hidden: boolean } }).wakeTest.hidden = true; document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(() => page.evaluate(() => (window as unknown as { wakeTest: { releases: number } }).wakeTest.releases)).toBe(2);
  await page.evaluate(() => { (window as unknown as { wakeTest: { hidden: boolean } }).wakeTest.hidden = false; document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(() => page.evaluate(() => (window as unknown as { wakeTest: { requests: number } }).wakeTest.requests)).toBe(3);
  await page.close();

  const unsupported = await browser.newPage();
  await unsupported.addInitScript(() => Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: undefined }));
  await unsupported.goto('/demo');
  await unsupported.getByRole('button', { name: 'Open settings' }).click();
  await expect(unsupported.getByText('This browser does not support keeping the screen awake.')).toBeVisible();
  await unsupported.getByLabel('Keep screen awake').click();
  await expect(unsupported.getByLabel('Keep screen awake')).not.toBeChecked();
  await unsupported.getByRole('button', { name: 'Close settings' }).click();
  await unsupported.getByRole('button', { name: 'Next scene' }).click();
  await expect(unsupported.getByRole('heading', { name: 'Quiet duel' })).toBeVisible();
  await unsupported.close();
});

test('@claim:touch-targets gives visible controls 44px touch targets at 390px', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('/demo');
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

test('@claim:build-output writes a deployable root index after type-checking', async () => {
  await expect(access(resolve('dist/index.html'))).resolves.toBeUndefined();
  await expect(access(resolve('dist/staticwebapp.config.json'))).resolves.toBeUndefined();
  await expect(readFile(resolve('dist/index.html'), 'utf8')).resolves.toContain('<div id="app"></div>');
});
