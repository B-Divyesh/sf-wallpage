# Wallpage review handoff — 2026-08-28

## Outcome

Completed the requested adversarial first-read review without modifying product code. The review is **FAIL** and is recorded in `.factory/review-1.md`.

## Work completed

- Opened live production cold in fresh 390 px and desktop browser contexts.
- Audited landing and README copy, demo entry points/storage behavior, claims artifacts, metadata/routes/links, offline behavior, and visual identity.
- Used a fresh clone at `df2db712216c8343c6fa51ec411f00fecabc4bf7` for local verification.
- Ran `npm ci`, `npm test` (12/12), `npm run build`, Playwright Chromium installation, and `npm run test:e2e` (10/10) in that clone.

## Outstanding blockers

1. The first screen does not identify its audience or explain its job in plain language.
2. `/demo` and `?demo=1` are ordinary gallery routes and write normal `wallpage:settings`; no isolated sample demo, banner, reset, or documentation exists.
3. `.factory/claims.json` and tagged claim tests are absent while the site and README make numerous unlisted claims.
4. Unknown URLs return the ordinary gallery with HTTP 200 instead of a designed 404.

## How to verify

Read `.factory/review-1.md`. The acceptance-retest section gives the required post-fix browser and clean-clone checks.
