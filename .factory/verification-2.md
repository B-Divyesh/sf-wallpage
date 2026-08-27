# Independent verification 2 — FAIL

**Candidate:** `39ac05db765a819cef8704e637b5cc7cf9a5e24a` (`main`)  
**Production checked:** <https://wallpage.sociobot.in/>  
**Date:** 2026-08-27  
**Method:** fresh detached clone of the public repository at the candidate; no product source was changed during verification.

## Release verdict

**FAIL.** The repaired entitlement implementation and PWA update implementation pass their automated and browser checks. The actual production deployment, however, has neither usable Collector checkout nor a license verifier configured. It therefore cannot deliver the advertised one-time Collector unlock. This is a P1 release blocker for the deployed product, not a repeat of the prior local-storage entitlement bypass.

## Defects

### P1 — Live Collector purchase and verification path is unavailable

On the live candidate, opening Settings (or selecting a locked scene) states: **“Collector checkout is not configured here. An existing license can be checked when a verifier is configured.”** Entering `invalid-license` and pressing Verify returns: **“License verification is not configured on this deployment.”** The two Collector scenes remain locked.

This is fresh browser evidence that `VITE_SOCIOBOT_LICENSE_VERIFY_URL` is absent from the deployed bundle. The deployment also does not provide a usable checkout URL. Thus a visitor cannot buy, restore, or verify the one-time Collector unlock promised in the researched brief and displayed product UI. The implementation correctly fails closed; it does not make the missing deployment configuration acceptable for a production release that advertises Collector.

**Required remediation:** configure the registered Sociobot checkout and exact HTTPS license-verifier URLs at the production build/deploy boundary, then run a real purchase/return-URL/verification test against production before marking the release ready.

### P2 — Disabled Collector checkout is visibly rendered as a dead link

The unconfigured live `#buy-collector` element reports `hidden: true` and `href: ""`, but its computed display is `flex`, so the visible **Get Collector** control remains clickable and does nothing. This is caused by `.secondary-button { display: inline-flex; }` overriding the HTML `hidden` state. The same mechanism would leave controls visually present when entitlement UI asks to hide them.

**Required remediation:** ensure `[hidden]` wins (for example, an explicit `[hidden] { display: none !important; }` rule or a state-specific selector) and add an end-to-end assertion for the unconfigured and verified Collector states.

### P3 — AVIF response MIME type is generic

`/assets/tidal-observatory.avif` is served with `Content-Type: application/octet-stream`, rather than an AVIF image MIME type. Chromium still selected and decoded it (`naturalWidth: 1200`), so this did not block the tested experience, but deployment MIME configuration should be corrected for standards-compatible image delivery.

## What passed

### Clean checkout and build gates

- Created a fresh clone, detached it at the exact candidate SHA, and confirmed a clean worktree.
- `npm ci` completed with **0 vulnerabilities**.
- `npm test` passed: **10/10** Vitest tests (deterministic seeds, safe settings recovery, night-schedule boundaries, entitlement parsing, and release fingerprinting).
- No lint script is defined. The exact `npm run build` command includes `tsc --noEmit`; it passed and produced `dist/`.
- `npm run test:e2e` initially correctly exposed the clean environment’s missing Playwright browser. After the repository-standard `npx playwright install chromium`, it passed **10/10** tests: gallery flow, axe scan, 390 px layout, reduced motion, Collector fail-closed/positive/negative/offline paths, offline shell, and build-A-to-build-B service-worker activation.
- Production-build payload: JavaScript **35,631 B raw / 12,557 B gzip**; CSS **14,498 B raw / 4,109 B gzip**. Both are well below the 200 KB JS and 50 KB CSS budgets. The AVIF welcome image is 21,591 B and no webfonts are downloaded.

### Deployment identity, policies, and privacy

- A fresh no-environment-variable production build matched live byte-for-byte for `index.html`, `sw.js`, `manifest.webmanifest`, favicon, robots, sitemap, JS, CSS, and all three welcome-image formats. The live JS is `assets/index-CDCix80N.js`; the live shell SHA-256 is `a25059857fad9d5025d3bd9134d99a537ec9c7572f67b00eacf3df31c11447d3`. The deployment is the tested candidate build.
- Live HTML is short-cached (`public, must-revalidate, max-age=30`); hashed JS/CSS/assets are `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Live HTTPS responses include CSP restricted to self plus the permitted Sociobot API origins, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive camera/microphone/geolocation permissions policy, and `frame-ancestors 'none'`.
- Normal gallery loads made requests only to `https://wallpage.sociobot.in`; no analytics, advertising, third-party font, or third-party script requests were observed. Local storage held only display settings during the free flow. A legacy `wallpage:collector=verified` value is removed and does not unlock paid scenes (covered by the passing browser test).

### Product exercise and accessibility

- Desktop normal path: welcome state → Enter gallery → all eight free scenes via keyboard navigation; opening the library showed 10 scenes with exactly two locked Collector scenes. `J`/`K`/arrows, `C`, Space, `S`, `H`, Escape, settings controls, fullscreen fallback path, and scene sharing were exercised. Clipboard sharing produced a URL containing both the supplied seed and active scene.
- Boundary/recovery paths: unknown `scene` query recovered to Brackish drift; an HTML-like seed was rendered as text (`&lt;img …&gt;`), not markup; malformed stored settings recovered to the welcome state with no page error; short license input gave the receipt-key guidance; invalid/unconfigured verification gave an explicit recovery message. Unit tests cover across-midnight, daytime, and equal-endpoint (all-day) dimming schedules.
- 390 × 844 mobile: no horizontal overflow; the 44 × 44 Settings target and the settings sheet were operable. Desktop and mobile visual review found the original cinematic welcome/scene treatment legible and consistent with `.factory/design.md`.
- Keyboard-only traversal starts at the skip link and each tested control had the designed visible `3px solid rgb(237, 155, 99)` focus ring. Native dialogs trapped focus and Escape closed them; no keyboard trap was observed.
- `prefers-reduced-motion: reduce` starts the experience paused and permits an explicit opt-in to play.
- Axe on local gallery and privacy (automated test), and a fresh axe scan on live Settings, reported **0 serious or critical violations**. Normal desktop/mobile flows logged **0 console errors and 0 page errors**. The offline reload intentionally logs the browser’s `ERR_INTERNET_DISCONNECTED` resource message while displaying the offline banner; there were no application exceptions.

### PWA

- Local browser test passed the release-versioned worker scenario: build A installs, build B becomes waiting after `registration.update()`, receives `SKIP_WAITING`, claims clients, and reloads to build B.
- Live browser test: service worker became controller, online reload showed Brackish drift, then an offline reload still showed Brackish drift and **“Offline · the gallery will keep playing.”**

## Measurement limitation

Lighthouse 13.4.1 was attempted against the live site using the installed Playwright Chromium. This container’s Lighthouse/Chrome launcher could not connect to that binary, so it produced no valid Lighthouse scores. This is not reported as a product failure; the concrete bundle, axe, responsive, console, and browser-flow evidence above was collected successfully.
