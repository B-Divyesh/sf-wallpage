/* This template is stamped with the emitted shell fingerprint by vite.config.ts. */
const RELEASE = '__WALLPAGE_RELEASE__';
const CACHE = `wallpage-shell-${RELEASE}`;
const CACHE_PREFIX = 'wallpage-shell-';
const CORE = ['/', '/index.html', '/assets/tidal-observatory.avif', '/assets/tidal-observatory.webp', '/assets/tidal-observatory.jpg', '/favicon.svg', '/manifest.webmanifest'];

async function cacheShell() {
  const cache = await caches.open(CACHE);
  await cache.addAll(CORE);
  const shell = await cache.match('/index.html');
  if (!shell) return;
  const html = await shell.text();
  const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)].map((match) => match[1]);
  await cache.addAll(builtAssets);
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheShell());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put('/index.html', response.clone());
    return response;
  } catch {
    return (await cache.match('/index.html')) || (await cache.match('/')) || Response.error();
  }
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(event.request));
  } else {
    event.respondWith(cacheFirstAsset(event.request));
  }
});
