# Adversarial first-read review 3 — FAIL

**Product:** Wallpage  
**Reviewed:** 2026-08-28  
**Live URL:** <https://wallpage.sociobot.in/>  
**Repository commit:** `495a366fb25d5c66da6832827d1d5190cafdf468`

## Verdict

**FAIL.** The cold landing screen, live demo, storage isolation, offline flow, metadata, routing, visual identity, and all 17 declared claim commands pass. One visitor-facing browser-support promise remains untested: README names four browser families, while the sole registered support test runs Chromium only. This reopens the still-unverified portion of `F-2-8`. `PASS` is unavailable while that claim is untested.

## Cold first read

Fresh logged-out Chromium contexts opened the live root at 390 × 844 and 1440 × 900. Before scrolling, the product reads as follows:

- **What it does:** it turns an idle display into moving art in a browser.
- **For whom:** people with a TV, wall display, or second monitor.
- **What to click first:** **Try it with sample data**; it says that it opens a running sample scene and controls.

The necessary first-screen text is visible without scrolling at 390 px:

> “Turn an idle screen into moving art”
>
> “For TVs, wall displays, and second monitors that need a calm display.”
>
> “Try it with sample data”
>
> “Opens a running sample scene and its controls.”

This passes the first-read clarity check. Screenshots: `/tmp/wallpage-review-3-phone.png` and `/tmp/wallpage-review-3-desktop.png`.

## Finding

### F-3-1 — BLOCKING — Claimed Firefox, Safari, and Edge support has no matching verification

**Reopens `F-2-8` (TV-browser and casting positioning).**

**Quote/location:** README, **Display support**: “Wallpage supports current Chrome, Edge, Firefox, and Safari browsers with Canvas 2D.” The registered `tv-display-support` claim is attached to this README wording.

**Evidence:** `.factory/claims.json` declares only: “At 1280 by 720, the gallery works with keyboard-only controls and remains usable without fullscreen.” Its exact test is `@claim:tv-display-support`. `playwright.config.ts` sets `browserName: 'chromium'`; the test creates a 1280 × 720 page, uses keyboard controls, and rejects fullscreen. It does not run Firefox, WebKit/Safari, or Edge. The test therefore proves the viewport/keyboard/fullscreen boundary in Chromium, not the stated four-browser support matrix.

**Why this matters:** A first-time visitor who opens Wallpage on Firefox or Safari is told the product is supported, yet there is no test evidence protecting that outcome. A green Chromium run cannot confirm the named browsers, especially for Canvas, fullscreen, Wake Lock, and TV-browser fallback behavior.

**Concrete fix:** Either run `@claim:tv-display-support` in Chromium, Firefox, and WebKit projects and maintain a documented Edge release smoke check, or narrow the README and guide to the tested statement: “Wallpage is tested in Chromium at 1280 by 720 with keyboard controls.” Keep the exact supported-browser wording only after the matching matrix is exercised from `/demo`.

## Copy audit

Counts treat contractions, prices, paths, hostnames, and hyphenated terms as one word. The inventory includes headings, labels, links, and static alt/accessible labels as well as sentences. No landing or README unit exceeds 22 words. No banned marketing word appears. Terminology is consistent: **scene**, **gallery**, **idle display**, **fullscreen**, **Collector**, and **demo**. Buttons name their result with verbs; the checkout action identifies the external destination.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Wallpage home | 2 | Pass |
| Demo / Gallery / Privacy | 1 / 1 / 1 | Pass |
| A fictional tidal observatory with dark mineral pools and low fog | 11 | Pass; alt text |
| Browser gallery for idle displays | 5 | Pass |
| Turn an idle screen into moving art | 7 | Pass |
| For TVs, wall displays, and second monitors that need a calm display. | 12 | Pass; `tv-display-support` coverage remains F-3-1 |
| Try it with sample data | 5 | Pass |
| Opens a running sample scene and its controls. | 8 | Pass |
| Runs in your browser. | 4 | Pass; `local-rendering` |
| No account or ads. | 4 | Pass; `privacy-no-tracking` |
| Eight scenes free; Collector is $19 once. | 7 | Pass; `scene-count`, `collector-license` |
| Sample scene | 2 | Pass |
| See the gallery before you leave it running | 8 | Pass |
| Moon tide is ready in the sample gallery. | 8 | Pass; `demo-sandbox` |
| Pause it, change scenes, show the clock, or adjust the display. | 11 | Pass; `keyboard-controls`, `display-settings` |
| Open the Moon tide sample | 5 | Pass |
| Preview of the Moon tide scene | 6 | Pass; accessible label |
| 02 / 10 / Moon tide | 2 / 2 | Pass |
| Layered tidal contours move beneath a low copper moon. | 9 | Pass; scene description |
| How it works | 3 | Pass; eyebrow before specific heading |
| Set up an idle display in three steps | 8 | Pass |
| Open a scene. | 3 | Pass |
| Use a TV browser or this tab on a second monitor. | 11 | Pass; `tv-display-support` coverage remains F-3-1 |
| Set the display. | 3 | Pass |
| Choose rotation, clock, brightness, and night dimming. | 7 | Pass; `display-settings` |
| Leave it running. | 3 | Pass |
| The controls move aside while the scene stays visible. | 9 | Pass; `controls-fade` |
| Privacy | 1 | Pass |
| What Wallpage does not do | 5 | Pass |
| Wallpage has no account, ads, or analytics. | 7 | Pass; `privacy-no-tracking` |
| Display settings stay in this browser. | 6 | Pass; `display-settings` |
| Wallpage contacts Sociobot to check or restore a Collector license. | 10 | Pass; `collector-network` |
| Read the privacy policy | 4 | Pass |
| Optional Collector | 2 | Pass |
| Add two scenes for $19 once | 6 | Pass; `collector-license` |
| The free gallery has eight scenes. | 6 | Pass; `scene-count` |
| Collector adds Fault garden and Aurora basin after Sociobot verifies the license. | 11 | Pass; `collector-license` |
| Sociobot manages the checkout outside Wallpage. | 6 | Pass; `collector-license` |
| Open checkout — $19 once (external) | 5 | Pass |
| Wallpage turns idle displays into moving art. | 7 | Pass |
| Privacy / Terms | 1 / 1 | Pass |
| Built by Param Factory · v1.2.0 · build 495a366 | 7 | Pass |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Wallpage | 1 | Pass |
| Turn an idle screen into moving art. | 7 | Pass |
| Wallpage is for TVs, wall displays, and second monitors that need a calm display. | 14 | Pass; `tv-display-support` coverage remains F-3-1 |
| Each moving scene is drawn in the browser without a video stream. | 12 | Pass; `local-rendering` |
| Try Wallpage with sample data. | 5 | Pass |
| The Moon tide sample uses separate browser storage. | 8 | Pass; `demo-sandbox` |
| You can reset it at any time. | 7 | Pass; `demo-sandbox` |
| The gallery has eight free scenes. | 6 | Pass; `scene-count` |
| Collector adds two scenes for $19 once. | 7 | Pass; `collector-license` |
| Those scenes unlock only after Sociobot verifies a license. | 9 | Pass; `collector-license` |
| The demo contacts only wallpage.sociobot.in. | 5 | Pass; `privacy-no-tracking` |
| It has no account, ads, analytics, or downloaded fonts. | 9 | Pass; `privacy-no-tracking` |
| The demo reopens offline after its first visit and keeps drawing its scene. | 13 | Pass; `offline-reload` |
| Run locally | 2 | Pass |
| Use Node.js 20 or newer. | 5 | Pass |
| The command prints a local URL. | 6 | Pass |
| Open `/demo` for the isolated sample. | 5 | Pass |
| Test and build | 3 | Pass |
| npm install / npm run dev / npm test / npm run test:claims / npm run test:e2e / npm run check:budget / npm run build / npm run preview | 2 / 3 / 2 / 3 / 3 / 3 / 3 / 3 | Pass; commands |
| `npm run build` type-checks the app and writes the static site to `dist/`. | 13 | Pass; `build-output` |
| The deploy folder contains `dist/index.html`. | 6 | Pass; `build-output` |
| The budget check caps initial JavaScript at 200 KB. | 9 | Pass; `asset-budgets` |
| It caps CSS files at 50 KB and scene images at 300 KB each. | 14 | Pass; `asset-budgets` |
| Controls | 1 | Pass |
| ← or J: previous scene | 4 | Pass; `keyboard-controls` |
| → or K: next scene | 4 | Pass; `keyboard-controls` |
| Space: pause or play | 4 | Pass; `keyboard-controls` |
| C: show or hide the clock | 6 | Pass; `keyboard-controls` |
| F: enter or leave fullscreen | 5 | Pass; `fullscreen` |
| S: open display settings | 4 | Pass; `keyboard-controls` |
| H: open the guide | 4 | Pass; `keyboard-controls` |
| These keyboard shortcuts change scenes, playback, the clock, settings, and the guide. | 12 | Pass; `keyboard-controls` |
| Gallery controls fade after 4.5 seconds and return on pointer movement. | 11 | Pass; `controls-fade` |
| The Share control creates a link for the current scene and seed. | 11 | Pass; `share-scene` |
| The fullscreen button and F key enter or leave fullscreen when the browser supports it. | 14 | Pass; `fullscreen` |
| Display settings control rotation, clock, date, brightness, night dimming, and the animation frame-rate cap. | 14 | Pass; `display-settings` |
| Keep screen awake asks a supported device to prevent display sleep while a scene plays. | 14 | Pass; `wake-lock` |
| Visible demo controls have touch targets at least 44 by 44 CSS pixels at 390px width. | 16 | Pass; `touch-targets` |
| Display support | 2 | Pass |
| Wallpage supports current Chrome, Edge, Firefox, and Safari browsers with Canvas 2D. | 11 | **F-3-1** |
| It is tested at a 1280 by 720 TV-like viewport with keyboard-only controls. | 13 | Pass; `tv-display-support` |
| The gallery remains usable when fullscreen or Screen Wake Lock is unavailable. | 11 | Pass; `tv-display-support`, `wake-lock` |
| Casting comes from your browser or device menu. | 8 | Pass; scope boundary, not a Wallpage casting promise |
| Wallpage does not control or promise support for a specific casting device. | 11 | Pass; scope boundary |
| Collector purchase and restore | 4 | Pass |
| Copy `.env.example` to `.env.local` to test another public Sociobot configuration. | 10 | Pass; maintainer instruction |
| Production uses the committed checkout and verifier URLs in `.env.production`. | 10 | Pass; maintainer instruction |
| Without a saved license, opening the gallery does not contact the verifier. | 12 | Pass; `collector-network` |
| Wallpage sends a saved or entered license only to the Sociobot verifier. | 12 | Pass; `collector-network` |
| Collector unlocks only when Sociobot confirms the saved license is active. | 10 | Pass; `collector-license` |
| Payment happens on the Sociobot checkout. | 6 | Pass; `collector-license` |
| Wallpage does not embed a payment provider. | 7 | Pass; `collector-license` |
| Architecture and privacy | 3 | Pass |
| Wallpage uses Vite and vanilla TypeScript. | 6 | Pass; maintainer detail |
| The browser test suite proves offline reload through the isolated sample. | 11 | Pass; `offline-reload` |
| Read the privacy policy and terms. | 6 | Pass |
| Demo behavior is documented in `.factory/demo.md`. | 6 | Pass |
| The visual thesis and generated-art provenance are in `.factory/design.md`. | 9 | Pass |
| Deployment | 1 | Pass |
| Deploy `dist/` as the configured Azure Static Web App. | 9 | Pass; maintainer instruction |
| The repository does not manage infrastructure, DNS, secrets, or billing registration. | 11 | Pass; scope statement |
| License | 1 | Pass |
| MIT © 2026 Sociobot (Param Factory). | 5 | Pass |
| See LICENSE. | 2 | Pass |

## Demo and sandbox checks

The live landing action reached `/demo` in one click. Its first screen showed a 390 × 844 animated Moon tide canvas, the fixed sample setting, and the persistent **“Demo — sample data, nothing is saved”** banner. **Reset demo** and **Start for real** were visible.

After changing a demo setting and inserting `demo:review-marker`, storage contained only `demo:review-marker` and `demo:wallpage:settings`. Reset removed both demo keys and restored `/demo?scene=moon-tide`. Start for real opened `/gallery?scene=brackish-drift` with no demo or normal storage key written. The observed demo flow made no cross-origin request. After service-worker control, an offline reload retained Moon tide, showed **“Offline · the gallery keeps playing”**, and produced different canvas frames 850 ms apart.

## Claim results

A clean clone at `/tmp/wallpage-review-3-clean-c4Uwqj` was cloned from the repository remote at `495a366`, then installed with `npm ci` (0 vulnerabilities). Every exact command declared in `.factory/claims.json` was executed separately and passed:

| Claim ID | Result |
| --- | --- |
| demo-sandbox | Pass |
| local-rendering | Pass |
| privacy-no-tracking | Pass |
| collector-network | Pass |
| offline-reload | Pass |
| scene-count | Pass |
| collector-license | Pass |
| display-settings | Pass |
| share-scene | Pass |
| fullscreen | Pass |
| controls-fade | Pass |
| keyboard-controls | Pass |
| tv-display-support | Command pass; browser-family coverage remains F-3-1 |
| wake-lock | Pass |
| touch-targets | Pass |
| asset-budgets | Pass |
| build-output | Pass |

`npm test` passed 16/16. `npm run test:e2e` passed 30/30. `npm run build` produced `dist/`; `npm run check:budget` passed with initial JavaScript 38,879 B, CSS 21.99 KB, and poster assets within limits.

## Earlier findings rechecked

| Earlier finding | Round-3 result | Verification |
| --- | --- | --- |
| Review 1 BLOCKING 1 | Fixed | Live phone and desktop first screen names job, audience, result, and action. |
| Review 1 BLOCKING 2 | Fixed | Live fixed Moon tide demo, banner, reset/exit, storage isolation, and offline reload exercised. |
| Review 1 BLOCKING 3 | Fixed except the reopened browser-matrix coverage in F-3-1 | 17-entry register, one source tag per entry, and all exact commands passed. |
| Review 1 BLOCKING 4 | Fixed | `/does-not-exist` returns HTTP 404 with styled focused recovery page. |
| Review 1 S1 | Fixed | Shared navigation/footer, canonical metadata, sitemap, route focus, and live links checked. |
| Review 1 S2 | Fixed | Earlier metaphor/jargon/button defects remain absent. |
| F-2-1 | Fixed | `local-rendering` opens all ten scenes, including Collector scenes, and requires changing canvases. |
| F-2-2 | Fixed | `collector-license` verifies both unlock cards and renders both paid scenes. |
| F-2-3 | Fixed | `/demo` and `/gallery` use the shared shell and their own canonical URLs. |
| F-2-4 | Fixed | Live copy and `collector-network` cover saved and entered-license checks. |
| F-2-5 | Fixed | `display-settings` covers rotation, date, brightness, dimming, frame cap, and persistence. |
| F-2-6 | Fixed | Separate share and fullscreen claim tests pass. |
| F-2-7 | Fixed | Offline test compares changing post-reload canvas frames. |
| F-2-8 | **Reopened by F-3-1** | Viewport/keyboard/fullscreen test passes, but named Firefox/Safari/Edge support remains untested. |
| F-2-9 | Fixed | Wake Lock behavior and unsupported fallback are covered. |
| F-2-10 | Fixed | The static treatment is labeled “Sample scene.” |
| F-2-11 | Fixed | Checkout action names checkout, price, and external handoff. |
| F-2-12 | Fixed | README uses “separate browser storage,” not the storage-key jargon. |
| F-2-13 | Fixed | README states the demo contacts only wallpage.sociobot.in. |
| F-2-14 | Fixed | README names Sociobot and the license outcome directly. |
| F-2-15 | Fixed | Footer uses a version and commit build ID. |
| F-2-16 | Fixed | `build-output` is registered and passing. |
| F-2-17 | Fixed | Visitor-facing crop assertion remains removed. |

## Structure, accessibility, links, and identity

- Root, demo, gallery, privacy, terms, and 404 each had one h1, `lang="en"`, title, description, canonical URL, OG/Twitter image metadata, SVG favicon, and Apple touch icon. Deep links and browser Back moved focus to the new h1 and updated the polite route status.
- `/does-not-exist` returned HTTP 404; `/404` is a styled recovery page with a return link. Known internal links returned 200, the Sociobot checkout returned its expected 303, and the one `mailto:` link is explicit.
- The live root passed `/opt/fleet/lib/verify-url.sh`: status 200, zero console errors, one h1, main landmark, language, alt text, and labeled buttons.
- The visual treatment is distinctly Wallpage: original tidal-observatory art, nocturnal mineral palette, editorial serif display type, ember focus cue, and projection-slate controls. It does not resemble a generic SaaS template.

## Missed leverage

No further feature is required by the brief. The stated job—an evolving local browser display—has its scene gallery, clock/date, rotation, dimming, keyboard/remote controls, seed sharing, Collector flow, and Wake Lock. AI, import/export, and sync would not improve the core idle-display task and no AI feature or provider key is embedded.

## What would make this perfect

Close F-3-1: test the named current browser families against the demo entry point or reduce the support sentence to the Chromium-tested boundary. Then rerun every declared command from a new clone and repeat the live phone/desktop, demo-isolation, offline, metadata, focus, link, and accessibility checks. A zero-finding rerun can pass.
