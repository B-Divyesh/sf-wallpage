# Independent verification — FAIL

**Candidate:** `683c8f3fbae8f7afb806c3084cc525587e3c7628` (`main`)  
**Production checked:** https://wallpage.sociobot.in/  
**Date:** 2026-08-27

## Release verdict

**FAIL.** The free gallery, accessibility baseline, offline reload, production build, and live deployment identity pass. Two P1 defects mean the paid Collector entitlement is not enforceable and future PWA releases can remain permanently stale for existing visitors.

## P1 defects

1. **Collector scenes can be unlocked without a license or billing verification.**
   - Reproduction: before loading the gallery, set `localStorage['wallpage:collector'] = 'verified'`, then open Scene library. Both `Fault garden` and `Aurora basin` are immediately available and neither card is locked.
   - Evidence: `src/main.ts` trusts that exact local-storage value at startup (`collectorUnlocked = localStorage.getItem('wallpage:collector') === 'verified'`); only the interactive verification path calls the Sociobot endpoint. The bundled JS also contains all Collector algorithms.
   - Impact: the stated one-time Collector unlock is trivially bypassable. This is a release blocker for a paid feature.

2. **Service-worker updates are not versioned; an app-only release will stay stale for installed clients.**
   - Evidence: `public/sw.js` has a fixed `const CACHE = 'wallpage-shell-v1'`, cache-first handling for navigations, and only changes a client’s cached shell in its `install` handler. A deployment that changes `index.html`/hashed assets but leaves `sw.js` byte-identical does not install a new worker; the active worker therefore continues returning cached `/` and `/index.html` forever instead of checking the network.
   - Current behavior checked: an installed current worker was controlling the page (`controller: true`), `registration.update()` completed with no waiting worker, and offline reload served `Brackish drift`. This verifies the current worker lifecycle and offline shell, but also demonstrates that no update is installed when the script itself is unchanged.
   - Impact: the next normal front-end-only release can be invisible indefinitely to prior visitors. This fails the required PWA update verification.

## What passed

- Clean dependency installation: `npm ci` completed with 0 audit vulnerabilities.
- Unit/integration: `npm test` — 7/7 passed.
- Browser tests: initial run correctly reported the missing Playwright browser in the clean image; after the repository-documented `npx playwright install chromium`, `npm run test:e2e` — 5/5 passed.
- Exact production build: `npm run build` passed, writing `dist/`.
  - JS: 32,410 bytes raw / 11,373 bytes gzip (under 200 KB).
  - CSS: 14,247 bytes raw / 4,084 bytes gzip (under 50 KB).
  - No lint script exists; TypeScript checking is part of the exact build command.
- Product exercise on local production preview and the live site:
  - Normal shared seed/scene URL selected the requested scene; `J`, `K`, `C`, Space, `S`, and `H` worked.
  - Invalid scene recovered to `Brackish drift`; an HTML-like seed remained text, not markup; corrupt saved JSON recovered to the welcome state; short license input produced the explicit unavailable/configuration message.
  - Night-schedule boundaries are covered by the 7 unit tests, including across-midnight and equal start/end (all-day) behavior.
  - Desktop and 390 x 844 mobile had no horizontal overflow. The desktop and mobile visual review found legible, full-screen scenes and a usable mobile dock/settings sheet.
  - Reduced motion starts paused and accepts an explicit play action.
  - Keyboard focus uses the visible 3 px ember focus style; no keyboard trap was observed in native dialogs.
  - Axe found 0 serious or critical violations on gallery, privacy, and live-gallery scans.
  - Normal gallery flow logged no browser console errors or page errors. The deliberately offline reload emits expected `ERR_INTERNET_DISCONNECTED` resource noise while displaying the offline banner and cached gallery.
- Privacy/security/network:
  - Normal live load requested only the Wallpage origin (HTML, local JS/CSS/art, and `/robots.txt`); no analytics, third-party fonts, scripts, or tracking requests were observed.
  - Local data is limited to display settings and the Collector values described in the privacy policy; reset removes those keys.
  - Live HTTPS headers include CSP (`default-src 'self'`, frame embedding denied), HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive camera/microphone/geolocation permissions policy.
  - Live HTML is short-cached (`max-age=30`); hashed assets are correctly immutable for one year and `sw.js` is `no-cache`.
- Deployment identity: SHA-256 values matched exactly between `dist/` from candidate `683c8f3` and production for `index.html`, `sw.js`, manifest, favicon, JS, CSS, AVIF, WebP, and JPEG. The live site is this candidate.

## Required remediation before PASS

1. Make Collector entitlement tamper-resistant enough for the chosen commercial model: validate a signed/verifiable entitlement on load (or move protected content/server authorization behind the Sociobot API). Do not treat a writable local flag as proof of purchase.
2. Version the service-worker cache from the build/release identity and use an update strategy that refreshes navigation HTML/assets; add an automated test that installs build A, serves build B with only app assets changed, and proves the client receives build B.

