# Independent verification 3 — FAIL

**Candidate:** `859299940603d82edd7c2d86b27eedb9efed7a36` (`main`)  
**Production:** <https://wallpage.sociobot.in/>  
**Date:** 2026-08-27  
**Method:** fresh detached clone at the exact SHA (`/tmp/wallpage-qa-KOeqnc`); no product source was changed during verification.

## Release verdict

**FAIL.** The previous deployment-only Collector configuration failure is fixed: the live candidate exposes the intended checkout and verifier, fails closed for an invalid license, and exactly matches the production build. However, the defined mobile Lighthouse performance gate is not met. Three independent default-mobile Lighthouse 13.0.1 runs returned **82, 87, and 85** performance (median **85**, required **>=90**). This is a P2 release blocker under the factory performance contract.

## Defect

### P2 — Mobile Lighthouse performance budget misses by 3–8 points

Fresh live mobile Lighthouse runs against the production URL returned:

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 82 | 100 | 100 | 100 | 1.4 s | 760 ms | 0 |
| 2 | 87 | — | — | — | 1.24 s | 527 ms | 0 |
| 3 | 85 | — | — | — | 1.23 s | 587 ms | 0 |

The performance policy requires mobile Lighthouse >=90. The reports attribute the long tasks to the shipped application script: run 1 has a 755 ms task (plus a 197 ms task) from `assets/index-CoymAM6_.js`; runs 2–3 likewise contain 393/392 ms and 219/208 ms script tasks. The compact transfer size is good, but it does not compensate for this interactive-startup/main-thread failure.

**Required remediation:** profile and break up/defer the Canvas scene initialization and other startup work until the first idle/render opportunity, then rerun mobile Lighthouse on the deployed candidate until the result is >=90 consistently.

## Passed checks

### Clean checkout and local quality gates

- Created a clean detached clone at the exact candidate SHA; `git status --short --branch` was clean.
- `npm ci` completed with 0 audit vulnerabilities.
- `npm test`: **12/12** Vitest tests passed (seeds, settings recovery, night schedule boundaries, entitlement parsing, production configuration, and release fingerprinting).
- No lint command is defined in `package.json`; the exact `npm run build` command includes `tsc --noEmit`. It passed and wrote `dist/`.
- After installing the repository-required Chromium (`npx playwright install chromium`), `npm run test:e2e` passed **10/10** tests: gallery flow, axe, 390 px layout, reduced motion, entitlement tampering/positive/expired/offline states, offline shell, and build-A-to-build-B worker update.
- Exact production build payload: JavaScript **36,579 B raw / 12,880 B gzip** (under the 200 KB budget); CSS **14,530 B raw / 4,120 B gzip** (under 50 KB); no webfonts. The welcome AVIF is 21,591 B.

### Deployment identity, privacy, and response policies

- A fresh no-override production build matched the live deployment byte-for-byte for `index.html`, `sw.js`, manifest, favicon, JS, CSS, and each AVIF/WebP/JPEG welcome asset. The live JS is `assets/index-CoymAM6_.js`; live `index.html` SHA-256 is `7e0a200cec8bbaac6005923d98f01043209c23d8eb82304145593f1b38ad96e0`.
- The formerly missing Collector setup is live. The visible checkout target is `https://api.sociobot.in/api/v1/products/wallpage/checkout`; a direct smoke request returns **303** to a Dodo checkout session. `GET /verify?license=wallpage-production-smoke-invalid` returns **200** with `{"valid":false,"reason":"invalid","expires_at":null}`. No credential or purchase was used.
- The live invalid-license browser path states that the key could not be verified and keeps both Collector scenes locked. The legacy `wallpage:collector=verified` value is removed/ignored by the automated test.
- Normal gallery traffic used only `wallpage.sociobot.in`. The one intentional license check additionally used `api.sociobot.in`; no analytics, advertising, third-party font, script, or tracking origin was observed. Local storage is limited to display preferences and a license token as described by `/privacy`; Reset local data removes the saved license.
- Live HTTPS policy headers include self-restricted CSP (with the two intentional Sociobot API connect origins), HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, `frame-ancestors 'none'`, and restrictive camera/microphone/geolocation permissions. HTML is short cached (`max-age=30`); JS/CSS/assets are immutable for one year; `sw.js` is `no-cache`; AVIF has `Content-Type: image/avif`.

### Product, responsive, accessibility, and PWA exercise

- Fresh-user welcome -> Enter gallery works. Desktop normal use exercised scene library selection, Arrow/J navigation, C clock toggle, Space pause/play, S settings, H guide/Escape, auto-rotate and night-dimming settings persistence, share-to-clipboard URL, Collector locked-scene recovery, reset confirmation, and invalid-license recovery. Headless Chromium correctly attempted F/fullscreen without an error but does not grant fullscreen in this environment.
- Boundary and invalid input: unknown `scene` falls back to **Brackish drift**; an HTML-like `seed` remains text rather than markup; malformed saved settings recovery and across-midnight/equal-endpoint night scheduling are covered by passing unit tests; short license input gives receipt-key guidance; invalid and offline license verification remain locked with an explicit message.
- At 390 x 844, horizontal overflow was 0, the Settings control measured 44 x 44 px, and the settings sheet was operable. Desktop and mobile visual review found the full-screen nocturnal scene treatment and legible controls consistent with the visual thesis.
- Keyboard-only traversal reaches the skip link and controls; tested focused control has the designed 3 px ember outline. Dialogs close on Escape with no observed trap. Reduced-motion starts paused and can explicitly opt into playback.
- Live axe scan with settings/Collector UI open found **0 serious or critical** violations. Normal flow recorded **0 console errors and 0 page errors**. The offline reload deliberately logs Chromium's `ERR_INTERNET_DISCONNECTED` resource error while displaying **“Offline · the gallery will keep playing.”**; there was no application exception.
- Live service worker became controller and served the gallery on offline reload. The automated local release-A/release-B scenario passed: a changed shell fingerprints a new worker, it waits, accepts `SKIP_WAITING`, claims clients, and reloads build B.

## Scope and limitation

The real checkout redirect and invalid server verdict were exercised. A successful paid purchase/return/license path cannot be fabricated without a legitimate purchaser license, so the positive-server-verdict path remains covered by the passing browser integration test rather than a real payment.
