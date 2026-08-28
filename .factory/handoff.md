# Wallpage adversarial review 2 handoff — 2026-08-28

## Outcome

Completed the second adversarial first-read review at repository commit `58abcd0e957f1f739ffd13b21072f3006a1aebd4`. The verdict is **FAIL** with 17 findings: four blocking, five significant, and eight minor. No product code was changed.

The cold landing screen, isolated one-click demo, designed 404, accessibility baseline, and distinct visual identity pass. The blockers are incomplete local-rendering coverage, a Collector claim test that stops at status copy instead of proving paid-scene access, inconsistent gallery/demo route chrome with an incorrect Gallery canonical, and inaccurate Collector network-disclosure copy.

The complete evidence, exact copy audit, earlier-finding recheck, fixes, and verdict are in `.factory/review-2.md`.

## Verification completed

- Opened live production in fresh Chromium contexts at 390 × 844 and 1440 × 900 before scrolling.
- Exercised the live demo entry, animated sample, persistent banner, Reset demo, Start for real, storage isolation, offline reload, and same-origin network behavior.
- Checked route metadata, deep links, browser Back/focus, route announcements, internal links, the external checkout handoff, and the HTTP 404.
- Ran live AxeBuilder checks across root, demo, gallery, Privacy, Terms, and 404 with zero serious or critical violations.
- Ran `/opt/fleet/lib/verify-url.sh https://wallpage.sociobot.in/`; it passed. Evidence is in `/tmp/wallpage-review-2-verify-yLnu19/verify.json`.
- Used a clean clone at `/tmp/wallpage-review-2-clean-iCKFF6`. `npm ci` reported zero vulnerabilities.
- Ran all ten exact commands from `.factory/claims.json` separately. Every command exited successfully, but two tests do not assert their complete registered outcomes; these are blocking findings F-2-1 and F-2-2.
- Ran `npm test` (16/16), `npm run test:e2e` (22/22), `npm run check:budget`, and `npm run build`; all passed. The build produced `dist/index.html`, and initial JavaScript measured 36,508 bytes.
- Rechecked the live route status on handoff: `/`, `/demo`, `/privacy`, and `/terms` returned 200; `/does-not-exist` returned 404.

Screenshots are `/tmp/wallpage-review-2-phone-cold.png`, `/tmp/wallpage-review-2-desktop-cold.png`, and `/tmp/wallpage-review-2-demo-phone.png`.

## How to reproduce

```sh
npm ci
npm test
npm run test:claims
npm run test:e2e
npm run check:budget
npm run build
```

Use `https://wallpage.sociobot.in/?demo=1` for the isolated live sample. Run each exact test command in `.factory/claims.json` individually when verifying claim coverage.

## Work left

Resolve every finding in `.factory/review-2.md`, then rerun the review from a fresh browser context and clean clone. The product cannot receive PASS until no finding and no untested claim remains.
