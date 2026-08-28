import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const verifierPattern = /https:\/\/api\.sociobot\.in\/api\/v1\/products\/wallpage(?:-test)?\/verify\?.*/;

test('the first screen states the job, audience, action, and three facts', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('/');
  await expect(page).toHaveTitle('Wallpage — moving art for idle screens');
  await expect(page.getByRole('heading', { level: 1, name: 'Turn an idle screen into moving art' })).toBeVisible();
  await expect(page.getByText('For TVs, wall displays, and second monitors that need a calm display.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.locator('.plain-facts li')).toHaveCount(3);
  await expect(page.locator('.landing-hero')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.close();
});

test('gallery works from welcome through keyboard navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/gallery?seed=test-night');
  await expect(page.getByRole('dialog', { name: 'Turn an idle screen into moving art' })).toBeVisible();
  await page.getByRole('button', { name: /Open today’s gallery/ }).click();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Brackish drift' })).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Moon tide' })).toBeVisible();
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.getByRole('dialog', { name: 'Choose a scene' })).toBeVisible();
  await page.getByRole('button', { name: /Cloud chamber/ }).click();
  await expect(page.getByRole('heading', { name: 'Cloud chamber' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('all routes have metadata, focus, and no serious accessibility violations', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true })));
  for (const route of ['/', '/demo', '/gallery', '/privacy', '/terms', '/does-not-exist']) {
    await page.goto(route);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toBeFocused();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/wallpage\.sociobot\.in\//);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')), route).toEqual([]);
  }
});

test('every route uses the shared navigation, footer, and canonical URL', async ({ page }) => {
  for (const route of ['/', '/demo', '/gallery', '/privacy', '/terms']) {
    await page.goto(route);
    await expect(page.getByRole('link', { name: 'Wallpage home' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveCount(3);
    await expect(page.getByText('Wallpage turns idle displays into moving art.')).toBeAttached();
    await expect(page.getByText(/Built by Param Factory · v1\.2\.0 · build [0-9a-f]{7}/)).toBeAttached();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://wallpage.sociobot.in${route === '/' ? '/' : route}`);
  }
});

test('390px landing, demo, and settings stay operable without horizontal overflow', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const route of ['/', '/demo', '/gallery', '/privacy', '/terms', '/does-not-exist']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(0);
  }
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: 'Open settings' })).toBeVisible();
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.getByRole('dialog', { name: 'Adjust the idle display' })).toBeVisible();
  await expect(page.getByLabel('Auto-rotate')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  await page.close();
});

test('320px layouts reflow without losing content', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
  for (const route of ['/', '/demo', '/gallery', '/privacy', '/terms', '/does-not-exist']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(0);
    await expect(page.locator('main h1')).toBeAttached();
  }
  await page.close();
});

test('reduced-motion visitors start paused and can opt in', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/demo');
  const play = page.getByRole('button', { name: 'Play animation' });
  await expect(play).toBeVisible();
  await play.click();
  await expect(page.getByRole('button', { name: 'Pause animation' })).toBeVisible();
  await context.close();
});

test('unknown routes show a designed recovery page', async ({ page }) => {
  await page.goto('/does-not-exist');
  await expect(page).toHaveTitle('Page not found — Wallpage');
  await expect(page.getByRole('heading', { level: 1, name: 'This page was not found' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Return to Wallpage' })).toBeVisible();
});

test('legal navigation and browser Back restore heading focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy on your idle display' })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Turn an idle screen into moving art' })).toBeFocused();
});

test('Collector ignores a tampered local flag and stays locked', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true }));
    localStorage.setItem('wallpage:collector', 'verified');
  });
  await page.goto('/gallery');
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('[data-scene="fault-garden"]')).toHaveAttribute('data-locked', 'true');
  await expect(page.locator('[data-scene="aurora-basin"]')).toHaveAttribute('data-locked', 'true');
  expect(await page.evaluate(() => localStorage.getItem('wallpage:collector'))).toBeNull();
});

test('Collector unlocks only after a positive entitlement response', async ({ page }) => {
  await page.route(verifierPattern, async (route) => {
    expect(new URL(route.request().url()).searchParams.get('license')).toBe('signed-valid-license');
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: '2030-01-01T00:00:00Z' }) });
  });
  await page.addInitScript(() => {
    localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true }));
    localStorage.setItem('sb_license:wallpage', 'signed-valid-license');
  });
  await page.goto('/gallery');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/Collector is active for this session/);
  await expect(page.locator('#buy-collector')).toBeHidden();
  await expect(page.locator('#show-license')).toBeHidden();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await page.locator('[data-scene="fault-garden"]').click();
  await expect(page.getByRole('heading', { name: 'Fault garden' })).toBeVisible();
});

test('expired licenses remain locked with an honest state', async ({ page }) => {
  await page.route(verifierPattern, (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'expired' }) }));
  await page.addInitScript(() => {
    localStorage.setItem('wallpage:settings', JSON.stringify({ seenWelcome: true }));
    localStorage.setItem('sb_license:wallpage', 'tampered-license');
  });
  await page.goto('/gallery');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.locator('#collector-status')).toHaveText(/license has expired/i);
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Open scene library' }).click();
  await expect(page.locator('[data-scene="fault-garden"]')).toHaveAttribute('data-locked', 'true');
});
