import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

const root = process.cwd();

function envValue(contents: string, key: string) {
  return contents.match(new RegExp(`^${key}=(.+)$`, 'm'))?.[1];
}

test('production build has the registered public Collector URLs and no billing secret', async () => {
  const env = await readFile(resolve(root, '.env.production'), 'utf8');
  expect(envValue(env, 'VITE_SOCIOBOT_BUY_URL')).toBe('https://api.sociobot.in/api/v1/products/wallpage/checkout');
  expect(envValue(env, 'VITE_SOCIOBOT_LICENSE_VERIFY_URL')).toBe('https://api.sociobot.in/api/v1/products/wallpage/verify');
  expect(env).not.toMatch(/(?:secret|token|api[_-]?key|password)\s*=/i);
});

test('static host declares the AVIF MIME type', async () => {
  const config = JSON.parse(await readFile(resolve(root, 'public/staticwebapp.config.json'), 'utf8')) as { mimeTypes?: Record<string, string> };
  expect(config.mimeTypes?.['.avif']).toBe('image/avif');
});
