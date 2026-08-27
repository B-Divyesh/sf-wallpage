# Independent verification 4 — PASS

**Candidate:** `0659a2d784e1f17f96db58ada336c8b2153fc219` (`main`)  
**Production URL:** <https://wallpage.sociobot.in/>  
**Verified:** 2026-08-27

## Verdict

**PASS.** This is a complete, working static Wallpage release for the researched job: a no-install, full-screen ambient gallery of original local Canvas scenes with a clock, seed links, rotation/settings, dimming, keyboard/remote controls, privacy pages, a fail-closed Collector flow, and an offline-capable shell. No P0, P1, P2, or P3 defects were found in this verification.

The previously reported deployment-only concern does not reproduce. The production shell and all executable candidate assets are exactly the files built from this commit.

## Clean local gates

Ran from the clean candidate checkout after `npm ci` (0 audit vulnerabilities):

| Check | Result |
| --- | --- |
| `npm test` | PASS — 12/12 unit/integration tests |
| `npx playwright install chromium` | Installed the repository-pinned browser prerequisite missing from the clean container |
| `npm run test:e2e` | PASS — 10/10 browser, mobile, Collector, service-worker update, and offline tests |
| `npm run build` | PASS — TypeScript check and Vite production output in `dist/` |
| `npm run check:budget` | PASS — rebuild plus static budget enforcement |
| Available lint/type scripts | No separate lint script is defined; `tsc --noEmit` is part of the exact build |

Production output: initial JS **30,133 B** raw / **10,550 B gzip** (limit 204,800 B); deferred Canvas renderer **8,079 B** raw / **3,170 B gzip**; CSS **14,589 B** raw / **4,130 B gzip** (limit 51,200 B); AVIF poster **21,591 B**; no shipped webfonts.

Fresh local mobile Lighthouse (default mobile configuration): Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.90 s, LCP 1.51 s, TBT 198 ms, CLS 0.

## Product exercise

Independent Playwright exercise was performed on the local production preview and on live production at desktop 1440 x 900 and mobile 390 x 844.

- First-run welcome enters the gallery; the requested valid seed remains deterministic and an invalid scene query safely falls back to `Brackish drift`.
- Scene library selection, Arrow navigation, Space pause/play, `C` clock toggle, `S` settings, `H` guide, brightness endpoints (35 and 100), one-minute rotation selection, and all-day (`00:00` to `00:00`) dim schedule worked and persisted locally.
- Share copied exactly `/?seed=share-qa&scene=moon-tide` on both local and production URLs. Invalid three-character license input stayed locked and returned the specific recovery text “Enter the license key from your receipt.”
- Collector cards remained locked without a verifier-confirmed entitlement; the passing e2e suite also proves a tampered local flag is removed, valid entitlement unlocks, expired/offline entitlements stay locked, and the status copy is honest.
- Mobile had 0 px horizontal overflow and no visible button below 44 x 44 px. Visual inspection confirmed a legible, full-screen desktop canvas and a usable compact mobile dock/settings sheet.
- Keyboard focus landed on a visible 3 px `#ed9b63` solid ring; native dialogs had no observed trap. Reduced-motion mode started paused and used poster mode; the visitor can explicitly opt in to play.
- Axe on local and live gallery pages found **0 serious/critical** findings. `/opt/fleet/lib/verify-url.sh` against production passed: HTTPS 200, title, `lang=en`, exactly one h1, main landmark, zero missing image alts, zero unlabeled buttons, and no console/page errors (977 ms observed load).
- PWA coverage passed: a cached installed shell reloaded offline, and the build-A-to-build-B service-worker update test passed.

## Privacy, browser policy, and deployment identity

- Normal live gallery loads made no third-party requests: only the Wallpage origin (including its same-origin `/robots.txt` connectivity probe) was requested. No analytics, trackers, CDN fonts, or external scripts were observed.
- Data storage is local settings plus an optional Collector license token, both described on `/privacy`; Reset local data removes them. The optional verifier uses the declared Sociobot endpoint and omits credentials.
- Live responses have CSP limited to self plus the required Sociobot API connect origins, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive camera/microphone/geolocation permissions, and denied framing. HTML/manifest use 30-second revalidation; hashed JS/CSS/scene/poster assets are `max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Live `index.html` references `index-DrtwKfU3.js` and `index-D9qGQ3th.css`, exactly matching local `dist/`. SHA-256 matches also confirmed for the startup JS, CSS, `scenes-Dh8KnrQO.js`, and `sw.js`:
  - JS `57ca52870b685bd01fe84c40d312af190197dd0f4ec2f87bf38a85e047a8af17`
  - CSS `8928880dd6bdf40fc18ad8bd6b58cf1927b38fb6d37993da84af946d383af453`
  - Scenes `e5ba04c47f9082a7cc9c84921b85273f12330e6972f992086044f2e883a0d7db`
  - Service worker `7869176d49c1c286b997ff7819c18db82682c528a0c0d8c4f4428075ea46907e`

## Defects and scope notes

**Defects:** none found by severity (P0–P3).

The production checkout/positive paid entitlement cannot be completed with a real purchaser license in this verification environment. This is not a release failure: authenticated positive, invalid, expired, offline, and tampered-entitlement paths are covered by the passing deterministic browser integration tests, and the live UI exposes the registered public Sociobot checkout/verification configuration.
