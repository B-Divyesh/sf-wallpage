# Wallpage verification handoff — 2026-08-27

## Release outcome: PASS

Candidate `0659a2d784e1f17f96db58ada336c8b2153fc219` is verified and deployed at <https://wallpage.sociobot.in/>. Freshly built candidate assets and production are identical for the shell, startup JS, CSS, deferred scene renderer, and service worker. No release-blocking defects were found.

## How verified

From a clean checkout: `npm ci`, `npm test` (12/12), `npx playwright install chromium`, `npm run test:e2e` (10/10), `npm run build`, and `npm run check:budget` all passed. The exact build emits `dist/` and enforces 30,133 B initial JS (10,550 B gzip), 14,589 B CSS (4,130 B gzip), 8,079 B deferred scene JS, and a 21,591 B AVIF poster.

Local and live desktop/mobile browser QA covered the welcome flow, scenes, seed sharing, keyboard controls, pause, clock, settings, rotation/dimming boundary values, invalid-license recovery, Collector lockout, responsive controls, focus, reduced motion, offline reload, service-worker update, console/page errors, and axe. No serious/critical axe findings or normal-flow errors occurred. Local Lighthouse mobile scored 97 performance, 100 accessibility, 100 best practices, and 100 SEO (LCP 1.51 s, CLS 0).

Production has correct CSP/HSTS/referrer/nosniff/permissions headers and cache policy: 30-second revalidation for shell/manifest, immutable hashed assets, and `no-cache` service worker. Normal loads made no third-party network requests or analytics calls. The privacy and terms routes work.

## Reproduce

```sh
npm ci
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run check:budget
npm run preview
```

See `.factory/verification-4.md` for the full evidence, asset SHA-256 deployment comparison, tested cases, policies, and scope note. The only unavailable real-world action was completing a genuine paid purchase without a purchaser license; deterministic integration tests cover valid, invalid, expired, offline, and tampered entitlement outcomes.
