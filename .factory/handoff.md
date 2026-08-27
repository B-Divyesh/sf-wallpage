# Wallpage verification handoff — 2026-08-27

## Release outcome: PASS

Repair commit `60a1dab` is deployed to the Standard Azure Static Web App at <https://wallpage.sociobot.in/>. Production now serves `assets/index-DrtwKfU3.js` and the Canvas renderer in the on-demand `scenes-Dh8KnrQO.js` chunk.

The prior candidate (`859299940603d82edd7c2d86b27eedb9efed7a36`) synchronously imported and rasterized all Canvas scene code while the welcome screen was displayed, producing 392–755 ms application tasks. The repair moves the catalog to the startup shell, loads renderer algorithms after explicit gallery entry (or during a returning visitor’s idle time), and does not synchronously draw a paused welcome/reduced-motion canvas. The static poster is also no longer decoded as an invisible second background during welcome; it remains the Canvas-error and reduced-motion fallback. Scene selection is rendered in the next animation frame so input and caption updates can paint first.

## Verification

All checks were run from the committed workspace after `npm ci`:

```sh
npm test                 # 12/12 unit tests passed
npm run build            # passed; emits dist/
npm run check:budget     # passed
npx playwright install chromium
npm run test:e2e         # 10/10 browser, mobile, accessibility, and PWA tests passed
```

`npm run check:budget` is the reproducible static budget gate. It rebuilds and rejects an initial JavaScript payload above 200 KB, CSS above 50 KB, an individual AVIF/WebP/JPEG poster above 300 KB, or a WOFF2 above 120 KB. This release measured 30,133 B initial JavaScript (10,550 B gzip), 14,590 B CSS (4,130 B gzip), an 8,080 B deferred renderer chunk, no webfonts, and a 21,591 B AVIF poster.

Production browser smoke (`verify-url.sh`) returned HTTPS 200 in 720 ms with no console/page errors; title, `lang`, one `h1`, main landmark, image alt coverage, and button labels passed. A production mobile Playwright/axe scan found **0 serious/critical** violations. The service worker controlled the second production load and the cached shell reloaded successfully offline.

Three independent default-mobile Lighthouse 13.0.1 runs against the deployed production URL used `/opt/pw-browsers/chromium-1234/chrome-linux64/chrome` with `--headless --no-sandbox --disable-dev-shm-usage`:

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Longest task |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | 100 | 100 | 1.40 s | 0 ms | 0 | 192 ms |
| 2 | 100 | 100 | 100 | 100 | 1.18 s | 43 ms | 0 | 124 ms |
| 3 | 99 | 100 | 100 | 100 | 1.17 s | 99 ms | 0 | 172 ms |

The required mobile performance gate (>=90) is met on all three fresh production runs. The reported 392–755 ms startup tasks are absent.

## Reproduce the production audit

```sh
CHROME_PATH=/opt/pw-browsers/chromium-1234/chrome-linux64/chrome \
  npx --yes lighthouse@13.0.1 https://wallpage.sociobot.in/ \
  --chrome-path="$CHROME_PATH" \
  --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' \
  --only-categories=performance,accessibility,best-practices,seo
```

## Known limitation

The real Collector checkout redirect and invalid-license fail-closed path are live. A genuine successful paid purchase cannot be exercised without a purchaser license; its positive verdict remains covered by the passing browser integration test.
