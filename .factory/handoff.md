# Wallpage repair handoff — 2026-08-28

## Outcome

Repaired every BLOCKING finding in `.factory/review-1.md` while preserving Wallpage's cinematic projection-room identity and Azure Static Web App output.

## What changed

- Replaced the first screen with the plain job, audience, sample action, and three tested facts.
- Added isolated `?demo=1` and `/demo` entry points. The fixed Moon tide sample stores only `demo:` data; reset and leaving demo clear the entire namespace.
- Added the persistent demo banner, reset/start-for-real actions, `.factory/demo.md`, `.factory/claims.json`, and one tagged Playwright test for each claim.
- Added route-aware metadata, canonical/OG/Twitter metadata, social and touch artwork, header/footer/legal links, focus/live route feedback, and a styled HTTP-404 response page.
- Completed narrow-phone layouts, reduced-motion behavior, touch-target checks, and axe coverage without replacing the dark cinematic visual system.

## Verification before clean-clone retest

- `npm test` — 16 passing tests.
- `npm run test:claims` — 10 passing tagged claim tests.
- `npm run test:e2e` — 22 passing browser/accessibility/mobile/offline tests.
- `npm run check:budget` — pass: initial JavaScript 36,642 B; CSS and all scene posters within configured limits.
- `npm run build` — pass; `dist/index.html` is present at the output root.
- Axe serious/critical violations are asserted as zero across landing, demo, legal, and recovery routes in the browser suite.

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

None. A clean-clone retest and deployment push are recorded in the final amended handoff commit.
