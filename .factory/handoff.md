# Wallpage v1 handoff

## What shipped

- A full-screen, install-free ambient gallery in Vite + vanilla TypeScript with ten original Canvas 2D environments: Brackish drift, Moon tide, Quiet duel, Cloud chamber, Ember bloom, Salt constellation, Kelp current, Rain archive, Fault garden, and Aurora basin.
- Deterministic daily/custom seeds, share links that preserve seed and scene, previous/next navigation, scene library, clock/date overlay, fullscreen, pause/play, and configurable 1/5/15/30-minute rotation.
- Long-run display protections: 24/30/45 fps caps with automatic render-cost adaptation, device-pixel-ratio caps, hidden-tab pause, brightness control, overnight dim schedule, drifting clock position, and retiring controls.
- Remote/keyboard paths (`←/J`, `→/K`, Space, `C`, `F`, `S`, `H`), 44 px controls, live status feedback, first-run guide, mobile settings sheet, and explicit canvas-error/offline states.
- Reduced-motion starts paused and allows explicit opt-in. The scene shell works offline after first visit through a versioned service worker.
- Eight free scenes and two ready-to-register Collector scenes. Checkout URL, verifier URL, and product ID are environment configuration; no product identifier, secret, or payment provider is hardcoded. A verified license is local to the browser.
- Plain-language `/privacy` and `/terms`, sitemap, robots policy, manifest, CSP/security headers, README, and MIT license.
- One project-original generated tidal-observatory plate, manually reviewed and exported as AVIF (21.6 KB), WebP (25.7 KB), and JPEG (36.5 KB). Source PNG and prompt/deployment sidecars are in `assets/src/`; provenance and art direction are in `.factory/design.md`.

## Run and verify

```sh
npm install
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

Production build command: `npm run build`.
Deployment root: `dist/` (`dist/index.html` is present at its root)

Verification on 2026-08-27:

- `npm test`: 7/7 tests passed.
- `npm run test:e2e`: 5/5 Chromium scenarios passed (first-run/keyboard flow, desktop axe scan, `/privacy` axe scan, 390 × 844 layout, reduced motion, and offline reopen).
- Axe: zero serious or critical violations on gallery and privacy route.
- Browser console: no errors during the complete gallery flow.
- `npm audit --audit-level=high`: zero vulnerabilities.
- Production payload: initial JavaScript 32.4 KB raw / 11.5 KB gzip; CSS 14.2 KB raw / 4.1 KB gzip. Both are far below the 200 KB / 50 KB budgets.
- Lighthouse mobile, local production preview: Performance 92, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.5 s, CLS 0, Speed Index 1.0 s, TBT 360 ms. INP is not produced for a synthetic first-load audit; interactive browser tests complete without delayed controls.
- Visual review completed at 1440 × 900 and 390 × 844. No horizontal overflow was found.

## Deployment configuration

Collector remains disabled until the factory registers the product. At deploy time set:

- `VITE_SOCIOBOT_BUY_URL`
- `VITE_SOCIOBOT_LICENSE_VERIFY_URL`
- `VITE_SOCIOBOT_PRODUCT_ID`

Use only the Sociobot billing endpoints. `.env.example` documents the contract. Vite variables are public and must never contain a secret.

## Known gaps and next steps

- Collector checkout and live license verification cannot be exercised before the factory supplies the deployment values. The unavailable state is explicit and the free gallery is unaffected.
- Native/macOS screensaver packaging and user-authored shaders are deliberately outside v1 scope. The in-product guide describes using a trusted webpage-screensaver utility or browser casting.
- Real-user duration, return, and seed-sharing measures require privacy-preserving production telemetry decisions; v1 intentionally sends no analytics.
