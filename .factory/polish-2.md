# Wallpage polish 2 — zero-finding acceptance map

**Candidate repaired:** `58abcd0e957f1f739ffd13b21072f3006a1aebd4`  
**Adversarial review:** `e1047aac5be507eb5e30c5bdd868f5aa91749b13`  
**Functional repair:** `1b65f1c`  
**Live site:** <https://wallpage.sociobot.in>

## Round 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | `local-rendering` now opens every one of the ten scene IDs with a fixed seed and recorded positive Collector response. Each scene must produce a sized canvas whose pixels change; media requests, video, and iframes remain forbidden. | `@claim:local-rendering`; clean-clone individual command pass; live claim-suite pass; `/tmp/wallpage-polish-2/live/gallery-1280.png`; <https://wallpage.sociobot.in/gallery> |
| F-2-2 | The Collector claim now checks both cards before verification, exercises invalid and offline outcomes, verifies a recorded active license, confirms both cards lose their locks, and renders changing frames from both paid scenes. | `@claim:collector-license`; `Collector unlocks only after a positive entitlement response`; live fixture check at <https://wallpage.sociobot.in/gallery> |
| F-2-3 | `/demo` and `/gallery` now share the landing/legal wordmark, Demo/Gallery/Privacy navigation, product line, legal links, factory credit, and generated build ID. Gallery has its own canonical route, host rewrite, and sitemap entry. Guide is a separate gallery control. | `every route uses the shared navigation, footer, and canonical URL`; route metadata/Axe test; `/tmp/wallpage-polish-2/live/demo-390.png`; `/tmp/wallpage-polish-2/live/gallery-1280.png`; live `/demo` and `/gallery` return 200. |
| F-2-4 | Network copy now says Wallpage checks saved or entered licenses. A no-license gallery makes no verifier request; a saved license makes one request only to the declared Sociobot verifier. | `@claim:collector-network`; `@claim:privacy-no-tracking`; live claim-suite pass; <https://wallpage.sociobot.in/privacy> |
| F-2-5 | Added `display-settings` coverage for one-minute rotation, clock/date state, brightness, frame-rate choice, night schedule in and out, demo isolation, and normal local persistence. Fixed the clock refresh that previously reset rotation before it could fire. | `@claim:display-settings`; clean-clone and live claim passes. |
| F-2-6 | Registered sharing and fullscreen separately. Sharing proves the fixed seed and active scene are in the URL. Fullscreen proves button and `F` entry/exit with accurate accessible labels. | `@claim:share-scene`; `@claim:fullscreen`; live claim-suite pass. |
| F-2-7 | Offline verification now compares two post-reload canvas frames, protecting “the gallery keeps playing” from regressing to a cached still. | `@claim:offline-reload`; live offline claim pass at <https://wallpage.sociobot.in/demo>. |
| F-2-8 | README and Guide now define current Chrome, Edge, Firefox, and Safari with Canvas 2D as the support boundary. Casting is explicitly a browser/device feature. A 1280 × 720 test uses keyboard-only controls and verifies the fullscreen fallback. | `@claim:tv-display-support`; live claim pass; `/tmp/wallpage-polish-2/live/gallery-1280.png`. |
| F-2-9 | Added **Keep screen awake** using Screen Wake Lock. It requests only when enabled and playing, releases on pause/hide/exit, reacquires on visibility return, and explains unsupported or rejected requests. | `@claim:wake-lock` with supported and unsupported fixtures; live claim pass. |
| F-2-10 | Renamed the still landing treatment from “Live preview” to “Sample scene.” | First-screen/copy audit; `/tmp/wallpage-polish-2/live/landing-390.png`; <https://wallpage.sociobot.in/>. |
| F-2-11 | Changed the purchase action to **Open checkout — $19 once (external)** and added “Sociobot manages the checkout outside Wallpage.” | `@claim:collector-license`; live Collector settings check. |
| F-2-12 | README now says the Moon tide sample uses separate browser storage; the technical `demo:` key remains only in `.factory/demo.md`. | `.factory/copy-audit.md`; `.factory/demo.md`. |
| F-2-13 | README now says the demo contacts only wallpage.sociobot.in and lists the absent account, ads, analytics, and downloaded fonts in plain language. | `@claim:privacy-no-tracking`; live request interception pass. |
| F-2-14 | README now says “Collector unlocks only when Sociobot confirms the saved license is active.” | `@claim:collector-license`; `.factory/copy-audit.md`. |
| F-2-15 | Public footers now show `v1.2.0 · build 1b65f1c`, generated from Git at build time. The static 404 receives the same build stamp. | `every route uses the shared navigation, footer, and canonical URL`; live route suite pass. |
| F-2-16 | Added a build-output claim. Its command performs TypeScript checking and a production build, then asserts `dist/index.html` and deployment config exist. | `@claim:build-output`; clean-clone individual command pass. |
| F-2-17 | Removed the visitor-facing crop assertion from README. Original artwork provenance and crop history remain in the design record. | README cross-check; `.factory/design.md`. |

## Earlier findings rechecked

| Earlier finding | Final evidence |
| --- | --- |
| Review 1 BLOCKING 1 — first-screen clarity | `the first screen states the job, audience, action, and three facts`; live 390 px screenshot `/tmp/wallpage-polish-2/live/landing-390.png`. |
| Review 1 BLOCKING 2 — isolated one-click demo | `@claim:demo-sandbox`; canonical <https://wallpage.sociobot.in/demo>; persistent banner, Reset demo, Start for real, fixed Moon tide, and storage isolation all pass live. |
| Review 1 BLOCKING 3 — missing/unproved claims | `.factory/claims.json` contains 17 unique claims and exactly one tagged test each. Every exact command passed separately in a clean clone, and all 17 passed against production. |
| Review 1 BLOCKING 4 — missing 404 | `unknown routes show a designed recovery page`; live <https://wallpage.sociobot.in/does-not-exist> returns HTTP 404; `/tmp/wallpage-polish-2/live/404-390.png`. |
| Review 1 S1 — structure and metadata | Shared route test plus the route metadata/focus/Axe test pass on root, demo, gallery, privacy, terms, and 404. `/opt/fleet/lib/verify-url.sh` passes root, demo, and gallery. |
| Review 1 S2 — metaphor, jargon, and inconsistent controls | `.factory/copy-audit.md` records the plain first screen, stable terminology, claim links, and no sentence over 22 words or banned marketing word. |

## Final evidence

- Clean clone: `/tmp/wallpage-polish-2-clean-BOtXUg` at `1b65f1c`; `npm ci` reported zero vulnerabilities.
- Every exact `.factory/claims.json` command: 17/17 passed separately.
- Clean clone: `npm test` 16/16; `npm run test:e2e` 30/30; `npm run check:budget` pass; `npm run build` pass.
- Budget: initial JavaScript 38,879 B; CSS 21.99 KB; poster assets below 300 KB.
- Live production: claim suite 17/17; route/accessibility suite 12/12.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.2 s, CLS 0, TBT 10 ms. Report: `/tmp/wallpage-polish-2/live/lighthouse.json`.
- Live screenshots: `/tmp/wallpage-polish-2/live/landing-390.png`, `/tmp/wallpage-polish-2/live/demo-390.png`, `/tmp/wallpage-polish-2/live/gallery-1280.png`, `/tmp/wallpage-polish-2/live/404-390.png`.
- Deployment: Azure Static Web Apps deployment `e8776f57-4477-469c-8933-18546e05a2ce` succeeded; custom domain status was Ready.

All review-1 and review-2 findings are resolved. No severity is deferred.
