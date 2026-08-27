import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { releaseIdForShell } from '../../src/release';

let server: Server;
let origin = '';
let build: 'A' | 'B' = 'A';

function shell(version: 'A' | 'B') {
  return `<!doctype html><title>Wallpage build ${version}</title><main>Wallpage build ${version}</main><script>navigator.serviceWorker.register('/sw.js')</script>`;
}

test.beforeAll(async () => {
  const template = await readFile(resolve(process.cwd(), 'src/service-worker.template.js'), 'utf8');
  server = createServer((request, response) => {
    const path = new URL(request.url ?? '/', `http://${request.headers.host}`).pathname;
    if (path === '/sw.js') {
      const release = releaseIdForShell(shell(build));
      response.writeHead(200, { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-cache' });
      response.end(template.replace('__WALLPAGE_RELEASE__', release));
      return;
    }
    response.writeHead(200, { 'Content-Type': path.endsWith('.webmanifest') ? 'application/manifest+json' : 'text/html', 'Cache-Control': 'no-store' });
    response.end(path === '/' || path === '/index.html' ? shell(build) : 'asset');
  });
  await new Promise<void>((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not bind');
  origin = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => new Promise<void>((resolveServer, reject) => server.close((error) => error ? reject(error) : resolveServer())));

test('build A activates build B after an update request', async ({ page }) => {
  build = 'A';
  await page.goto(origin);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByText('Wallpage build A')).toBeVisible();
  expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  build = 'B';
  await page.evaluate(async () => { await (await navigator.serviceWorker.ready).update(); });
  await page.waitForFunction(() => navigator.serviceWorker.getRegistration().then((registration) => Boolean(registration?.waiting)));
  await page.evaluate(() => navigator.serviceWorker.getRegistration().then((registration) => registration?.waiting?.postMessage({ type: 'SKIP_WAITING' })));
  await page.waitForFunction(() => navigator.serviceWorker.getRegistration().then((registration) => Boolean(registration?.active && navigator.serviceWorker.controller && registration.active.scriptURL.includes('/sw.js'))));
  await page.reload();
  await expect(page.getByText('Wallpage build B')).toBeVisible();
});
