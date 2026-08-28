# Wallpage polish 3 handoff — 2026-08-28

## Outcome

Wallpage `v1.2.1` is repaired, pushed, and deployed as the original Vite + vanilla TypeScript static web artifact. All findings from `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md` are resolved; there are no known release gaps.

The round-3 blocker is closed by replacing the untested four-browser promise with the exact exercised boundary: Chromium at 1280 × 720 with keyboard controls. A unit contract prevents the broader wording from returning, and `@claim:tv-display-support` asserts both Chromium and the display behavior.

The existing one-click sample, claims, routing, legal, accessibility, mobile, privacy, offline, Collector, performance, and Wallpage-specific visual work were cumulatively re-audited. The `/?demo=1` entry now also has a direct claim-test assertion for its fixed scene, persistent banner, Reset demo, Start for real, and storage boundary.

## Repair commits

- `e00bce8b59eb239f57e6e59ee4341f017a2858f5` — align browser-support copy, claim, test, release version, catalog line, and copy audit.
- `827ff7d14201f5dfb860fd9e76665c61ca232f28` — protect the direct `/?demo=1` entry in the registered demo claim.

## Verification evidence

Fresh clone: `/tmp/wallpage-polish-3-final-clean-Cdn0r8` at `827ff7d14201f5dfb860fd9e76665c61ca232f28`.

- `npm ci` — pass; 0 vulnerabilities.
- Every exact command in `.factory/claims.json` — 17/17 passed separately.
- `npm test` — 17/17 unit and release-contract tests passed.
- `npm run test:e2e` — 30/30 passed. This includes all claim flows, 320/390 px layouts, reduced motion, route focus/metadata, Axe, entitlement failures, and service-worker update behavior.
- `npm run check:budget` — pass: initial JavaScript 38,882 B; CSS 21.99 KB; poster assets below 300 KB.
- `npm run build` — pass; TypeScript clean and `dist/index.html` produced.
- Local `/opt/fleet/lib/verify-url.sh` — pass: 200, zero console errors, one H1, `lang=en`, main, all image alts, and all button labels.
- Local Lighthouse — 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.5 s, TBT 40 ms, CLS 0.

Production was uploaded from `dist/` through `/opt/fleet/lib/deploy-static.sh wallpage dist`; Azure Static Web Apps reported success, the custom domain was Ready, and HTTPS returned 200.

- `PLAYWRIGHT_BASE_URL=https://wallpage.sociobot.in npm run test:e2e` — 30/30 passed against production.
- Live `verify-url.sh` — pass with zero console errors and all structural checks.
- Live Lighthouse — 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Cold 390 px root — correct first-screen job, audience, sample action, and facts: `/tmp/wallpage-polish-3/live/landing-390.png`.
- Cold demo — fixed Moon tide, persistent isolated-demo banner and controls: `/tmp/wallpage-polish-3/live/demo-390.png`.
- Live support guide — Chromium-only tested boundary: `/tmp/wallpage-polish-3/live/support-1280.png`.
- Cold unknown route — designed HTTP 404 and recovery: `/tmp/wallpage-polish-3/live/404-390.png`.
- Exact live route/status/title/focus/canonical/overflow and demo reset/exit results: `/tmp/wallpage-polish-3/live/live-check.json`.

## Run and verify

```sh
npm ci
npm test
npm run test:claims
npm run test:e2e
npm run check:budget
npm run build
npm run preview
```

The isolated sample is at <https://wallpage.sociobot.in/demo>; `/?demo=1` is equivalent. Deployment output is `dist/`.

## Known gaps and next steps

None. Edge, Firefox, and Safari are intentionally not promised until matching release tests exist.
