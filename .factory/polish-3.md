# Wallpage polish 3 — cumulative zero-finding map

**Released candidate:** `495a366fb25d5c66da6832827d1d5190cafdf468`  
**Review source:** `ee6e5fc1abd217f8a5d760dbef1c8ac4018a175e`  
**Functional repair commits:** `e00bce8b59eb239f57e6e59ee4341f017a2858f5`, `827ff7d14201f5dfb860fd9e76665c61ca232f28`  
**Live site:** <https://wallpage.sociobot.in>

## Round 3 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Removed the untested Chrome/Edge/Firefox/Safari promise from README and the in-product guide. Both now state the exercised boundary: Chromium at 1280 × 720 with keyboard controls. The registered claim and sandbox name Chromium, the browser test checks the Chromium user agent, and a unit contract rejects the old browser-family wording. | `@claim:tv-display-support`; `browser support copy stays within the tested Chromium boundary`; `/tmp/wallpage-polish-3/live/support-1280.png`; cold <https://wallpage.sociobot.in/demo> guide check. |

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| R1-BLOCKING-1 | The first screen uses one job-led H1, names TVs/wall displays/second monitors, explains the sample result, and shows three plain facts. | `the first screen states the job, audience, action, and three facts`; `/tmp/wallpage-polish-3/live/landing-390.png`; cold <https://wallpage.sociobot.in/>. |
| R1-BLOCKING-2 | `/demo` and `/?demo=1` open the fixed Moon tide sample in the isolated `demo:` namespace. The persistent banner includes Reset demo and Start for real; both discard demo data without changing normal data. The query-string entry is now an explicit claim assertion. | `@claim:demo-sandbox`; `/tmp/wallpage-polish-3/live/demo-390.png`; cold <https://wallpage.sociobot.in/?demo=1>. |
| R1-BLOCKING-3 | `.factory/claims.json` registers 17 visitor claims with exactly one tagged observable test each. Privacy, rendering, offline, counts, entitlement, display controls, sharing, fullscreen, fade, keyboard, tested display boundary, Wake Lock, touch size, budgets, and build output are covered. | `every registered claim has exactly one tagged browser test`; all 17 exact commands passed separately in `/tmp/wallpage-polish-3-final-clean-Cdn0r8`; live `npm run test:e2e` 30/30. |
| R1-BLOCKING-4 | Unknown paths use the styled nocturnal recovery page with HTTP 404, a focused H1, a 404 title/canonical, and a return action. | `unknown routes show a designed recovery page`; `/tmp/wallpage-polish-3/live/404-390.png`; cold <https://wallpage.sociobot.in/does-not-exist> returned 404. |
| R1-S1 | Root, demo, gallery, privacy, terms, and 404 use the shared header/footer, route titles, descriptions, canonicals, social metadata, one H1, focus restoration, and a polite route status. `/gallery` is a real route. | `all routes have metadata, focus, and no serious accessibility violations`; `every route uses the shared navigation, footer, and canonical URL`; `/tmp/wallpage-polish-3/live/live-check.json`; live route checks. |
| R1-S2 | Copy consistently uses scene, gallery, idle display, fullscreen, Collector, and demo. Metaphors, vague purchase labels, unmeasured energy copy, and storage jargon remain removed. | `.factory/copy-audit.md`; `the first screen states the job, audience, action, and three facts`; live landing and guide screenshots. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | The local-rendering claim visits all eight free and both Collector scenes, requiring a sized canvas with changing pixels and forbidding media requests, video, or iframes. | `@claim:local-rendering`; live <https://wallpage.sociobot.in/gallery>. |
| F-2-2 | The Collector test covers locked, invalid, offline, and valid states, then opens both paid scenes and requires changing canvases. | `@claim:collector-license`; live <https://wallpage.sociobot.in/gallery>. |
| F-2-3 | Demo and gallery use the shared site shell; Guide is a control; `/gallery` has its own canonical, static-host route, and sitemap entry. | `every route uses the shared navigation, footer, and canonical URL`; `/tmp/wallpage-polish-3/live/live-check.json`; live `/demo` and `/gallery`. |
| F-2-4 | Privacy copy says saved or entered licenses contact Sociobot. The test proves no verifier request without a license and one declared request with a saved license. | `@claim:collector-network`; live <https://wallpage.sociobot.in/privacy>. |
| F-2-5 | Registered display coverage verifies rotation, clock, date, brightness, night dimming, frame cap, demo isolation, and normal local persistence. | `@claim:display-settings`; live <https://wallpage.sociobot.in/demo>. |
| F-2-6 | Sharing and fullscreen have separate claims covering scene/seed URLs plus button and keyboard entry/exit. | `@claim:share-scene`; `@claim:fullscreen`; live demo. |
| F-2-7 | Offline reload requires two changing post-reload canvas frames, not a cached still. | `@claim:offline-reload`; live production run passed offline at `/demo`. |
| F-2-8 | TV-like behavior is tested at 1280 × 720 with keyboard-only controls and fullscreen fallback. Round 3 narrowed browser-family copy to that tested Chromium boundary. Casting is described only as a browser/device feature. | `@claim:tv-display-support`; `/tmp/wallpage-polish-3/live/support-1280.png`; live guide. |
| F-2-9 | Keep screen awake uses Screen Wake Lock after visitor input, follows play/visibility, releases correctly, and fails soft when unavailable. | `@claim:wake-lock`; live settings at `/demo`. |
| F-2-10 | The static landing treatment is labeled Sample scene, not Live preview. | `.factory/copy-audit.md`; cold landing check. |
| F-2-11 | Collector actions say Open checkout — $19 once (external), name Sociobot, open separately, and never embed a payment provider. | `@claim:collector-license`; live landing and settings. |
| F-2-12 | README says separate browser storage; `demo:` appears only in technical demo documentation. | `.factory/copy-audit.md`; README review. |
| F-2-13 | README says the demo contacts only wallpage.sociobot.in and uses plain language for absent account, ads, analytics, and downloaded fonts. | `@claim:privacy-no-tracking`; README review. |
| F-2-14 | README names the actor and outcome: Collector unlocks only when Sociobot confirms the saved license is active. | `@claim:collector-license`; README review. |
| F-2-15 | Public footers show release version `v1.2.1` and a generated short build commit; internal repair wording is absent. | `every route uses the shared navigation, footer, and canonical URL`; live route check. |
| F-2-16 | The build-output claim runs after TypeScript/build and asserts `dist/index.html` and deployment configuration. | `@claim:build-output`; clean-clone exact command pass. |
| F-2-17 | The untestable public crop assertion remains removed; generation and crop provenance stay in `.factory/design.md`. | README review; `.factory/design.md`. |

## Final evidence

- Fresh clone `/tmp/wallpage-polish-3-final-clean-Cdn0r8` at `827ff7d14201f5dfb860fd9e76665c61ca232f28`: `npm ci` found 0 vulnerabilities; all 17 exact claim commands passed separately.
- Full local suite: `npm test` 17/17; `npm run test:e2e` 30/30; `npm run check:budget` pass; `npm run build` pass.
- Build: initial JavaScript 38,882 B; CSS 21.99 KB; all scene images within 300 KB; `dist/index.html` present.
- Accessibility: Playwright Axe found zero serious/critical issues on root, demo, gallery, privacy, terms, and 404. `verify-url.sh` found zero console errors, one H1, `lang=en`, a main landmark, complete alt text, and labeled buttons.
- Live suite: `PLAYWRIGHT_BASE_URL=https://wallpage.sociobot.in npm run test:e2e` passed 30/30.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0. Report: `/tmp/wallpage-polish-3/live/lighthouse.json`.
- Live cold evidence: `/tmp/wallpage-polish-3/live/live-check.json`, `landing-390.png`, `demo-390.png`, `support-1280.png`, and `404-390.png`.

Every finding from reviews 1–3 is resolved. No severity is deferred.
