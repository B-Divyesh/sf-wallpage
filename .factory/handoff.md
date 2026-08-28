# Wallpage repair handoff — 2026-08-28

## Outcome

Repaired every BLOCKING and significant finding in `.factory/review-1.md` while preserving Wallpage's cinematic projection-room identity and Azure Static Web App output. The hardening repair is `367c16c083a8801f1982c4002753e9604cc4532f`.

## What changed

- Replaced the first screen with the plain job, audience, sample action, and three tested facts.
- Added isolated `?demo=1` and `/demo` entry points. The fixed Moon tide sample stores only `demo:` data; reset and leaving demo clear the entire namespace.
- Added the persistent demo banner, reset/start-for-real actions, `.factory/demo.md`, `.factory/claims.json`, and one tagged Playwright test for each claim.
- Added route-aware metadata, canonical/OG/Twitter metadata, social and touch artwork, header/footer/legal links, focus/live route feedback, and a styled HTTP-404 response page.
- Completed narrow-phone layouts, reduced-motion behavior, touch-target checks, and axe coverage without replacing the dark cinematic visual system.
- Made the documented demo immutable at entry: `/demo?scene=anything` still starts the fixed Moon tide sample, and the strengthened local-rendering claim cycles all eight free scenes before checking for media traffic.
- Removed an untestable welcome provenance statement; provenance remains recorded in `.factory/design.md` and the source sidecar.

## Verification

- `npm test` — 16 passing tests.
- `npm run test:claims` — 10 passing tagged claim tests.
- `npm run test:e2e` — 22 passing browser/accessibility/mobile/offline tests.
- `npm run check:budget` — pass: initial JavaScript 36,508 B; CSS and all scene posters within configured limits.
- `npm run build` — pass; `dist/index.html` is present at the output root.
- Axe serious/critical violations are asserted as zero across landing, demo, legal, and recovery routes in the browser suite.
- `verify-url.sh http://127.0.0.1:4175/ /tmp/wallpage-polish-1/verify-local` passed: 200, title, `lang=en`, one H1, main landmark, no missing image alt, no unlabeled button, and no browser errors. Its report is `/tmp/wallpage-polish-1/verify-local/verify.json`.
- Evidence screenshots were visually reviewed at `/tmp/wallpage-polish-1/landing-390.png`, `/tmp/wallpage-polish-1/demo-390.png`, and `/tmp/wallpage-polish-1/404-390.png`.
- Clean clone: `/tmp/wallpage-clean-polish-1-367c16c` cloned from `367c16c083a8801f1982c4002753e9604cc4532f`; `npm ci` reported 0 vulnerabilities. All ten exact `.factory/claims.json` commands passed separately. Then `npm test` (16), `npm run test:e2e` (22), `npm run check:budget`, and `npm run build` passed.
- The live recheck and finding-by-finding evidence map are in `.factory/polish-1.md`.
- Deployment: `dist/` was deployed to Azure Static Web Apps production for `sf-wallpage` through the configured static work order. Azure returned `https://salmon-beach-009a16f0f.7.azurestaticapps.net`; its custom domain `https://wallpage.sociobot.in/` serves the new `index-P---bj2b.js` shell.
- Post-deploy fresh-context checks passed at `/`, `/?demo=1`, `/demo?scene=cloud-chamber`, and `/does-not-exist`. The stale demo scene parameter still opens Moon tide, normal storage stayed empty, Reset demo cleared its namespace, the recovery route returned HTTP 404, and live AxeBuilder reported 0 serious/critical violations.

## How to run

```sh
npm ci
npm test
npm run test:claims
npm run test:e2e
npm run check:budget
npm run build
```

Use `/?demo=1` for the isolated sample. Deployment is the committed `dist/` static artifact through the Azure Static Web App configuration in `public/staticwebapp.config.json`.

## Known gaps

None.
