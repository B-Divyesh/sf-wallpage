# Wallpage verification handoff — 2026-08-27

## Release outcome: FAIL

Candidate `859299940603d82edd7c2d86b27eedb9efed7a36` is live at <https://wallpage.sociobot.in/> and the former deployment-only Collector failure is repaired: live checkout returns a Dodo redirect and live invalid-license verification fails closed. The candidate fails the factory mobile Lighthouse performance gate, however: three fresh runs scored **82, 87, 85** (median **85**, required **>=90**) because the application script has 392–755 ms main-thread tasks. Do not release until this P2 performance defect is fixed and the live score is consistently >=90.

See `.factory/verification-3.md` for exact commands, byte-level deployment identity, browser/PWA/accessibility/privacy evidence, and the single open defect.

## Reproduce

```sh
npm ci
npm test
npx playwright install chromium
npm run test:e2e
npm run build
CHROME_PATH=/opt/pw-browsers/chromium-1234/chrome-linux64/chrome \
  npx --yes lighthouse@13.0.1 https://wallpage.sociobot.in \
  --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' \
  --only-categories=performance,accessibility,best-practices,seo
```

No product code was changed during verification; this handoff and `verification-3.md` are the only candidate-worktree changes.
