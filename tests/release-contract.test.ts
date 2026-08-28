import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const root = process.cwd();

describe('release contract', () => {
  test('every registered claim has exactly one tagged browser test', async () => {
    const claims = JSON.parse(await readFile(resolve(root, '.factory/claims.json'), 'utf8')) as Array<{ id: string; test: string }>;
    const browserTests = await readFile(resolve(root, 'tests/e2e/claims.spec.ts'), 'utf8');
    expect(claims.length).toBeGreaterThan(0);
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(browserTests.split(tag)).toHaveLength(2);
      expect(claim.test).toContain(`--grep ${tag}`);
    }
  });

  test('catalog copy is one short verb-first line', async () => {
    const copy = (await readFile(resolve(root, '.factory/catalog-description.txt'), 'utf8')).trim();
    expect(copy).not.toContain('\n');
    expect(copy.length).toBeLessThanOrEqual(120);
    expect(copy).toMatch(/^(Turn|Create|Show|Display|Run|Watch)\b/);
  });

  test('browser support copy stays within the tested Chromium boundary', async () => {
    const readme = await readFile(resolve(root, 'README.md'), 'utf8');
    const app = await readFile(resolve(root, 'src/main.ts'), 'utf8');
    expect(readme).toContain('Wallpage is tested in Chromium at a 1280 by 720 TV-like viewport with keyboard-only controls.');
    expect(app).toContain('This release is tested in Chromium at 1280 by 720 with keyboard controls.');
    for (const unsupportedClaim of ['supports current Chrome', 'Edge, Firefox', 'Safari browser with Canvas 2D']) {
      expect(`${readme}\n${app}`).not.toContain(unsupportedClaim);
    }
  });

  test('static host serves known routes and returns its designed 404 for unknown routes', async () => {
    const config = JSON.parse(await readFile(resolve(root, 'public/staticwebapp.config.json'), 'utf8')) as { routes: Array<{ route: string; rewrite?: string }>; responseOverrides?: Record<string, { rewrite?: string }> };
    for (const route of ['/', '/demo', '/gallery', '/privacy', '/terms']) {
      expect(config.routes).toContainEqual(expect.objectContaining({ route, rewrite: '/index.html' }));
    }
    expect(config.routes.some(({ route }) => route === '/*')).toBe(false);
    expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html' });
    await expect(readFile(resolve(root, 'public/404.html'), 'utf8')).resolves.toContain('This page was not found');
  });
});
