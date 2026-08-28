# Adversarial first-read review 4 — PASS

**Product:** Wallpage
**Reviewed:** 2026-08-28
**Live URL:** <https://wallpage.sociobot.in/>
**Repository commit:** `1ca74572acd53541b99ad65aa0dfa9b6985350fe`

## Verdict

**PASS.** This review found zero blocking, significant, or minor findings. The cold first screen is clear on a 390 px phone and desktop; the one-click sample is immediately useful and isolated; all registered claims are exercised by passing tests from a clean clone; and the live routes, metadata, recovery page, and visual system are complete.

## Cold first read

Fresh Chromium contexts opened the root at 390 × 844 and 1440 × 900 before any scrolling.

My first-read interpretation: Wallpage turns an idle TV, wall display, or second monitor into slow moving art in a browser. It is for people who want a calm display on an otherwise idle screen. I should click **Try it with sample data**, which says it opens a running sample scene and its controls.

The first mobile screen provides all three answers without inference:

> “Turn an idle screen into moving art”
>
> “For TVs, wall displays, and second monitors that need a calm display.”
>
> “Try it with sample data” — “Opens a running sample scene and its controls.”

It also states three plain facts: “Runs in your browser,” “No account or ads,” and “Eight scenes free; Collector is $19 once.” No first-screen clarity blocker reproduces.

## Copy audit

Counts treat a hyphenated term, path, price, and inline command as one word. This inventory covers every static reader-facing landing unit and every non-code README unit, including headings, controls, and links. No item exceeds 22 words; no banned marketing term, unexplained product jargon, inconsistent core term, contextless heading, or non-result naming action was found. `Collector` is a named paid tier, and `scene setting` is explained only where it is shown.

### Landing page

| Copy | Words | Result / claim coverage |
| --- | ---: | --- |
| Wallpage | 1 | Pass — wordmark |
| Demo / Gallery / Privacy / Terms | 1 each | Pass — route names |
| Browser gallery for idle displays | 5 | Pass |
| Turn an idle screen into moving art | 7 | Pass — plain job headline |
| For TVs, wall displays, and second monitors that need a calm display. | 12 | Pass — `tv-display-support` |
| Try it with sample data | 5 | Pass — result-naming action; `demo-sandbox` |
| Opens a running sample scene and its controls. | 8 | Pass — `demo-sandbox` |
| Runs in your browser. | 4 | Pass — `local-rendering` |
| No account or ads. | 4 | Pass — `privacy-no-tracking` |
| Eight scenes free; Collector is $19 once. | 7 | Pass — `scene-count`, `collector-license` |
| Sample scene | 2 | Pass — accurately labels the still preview |
| See the gallery before you leave it running | 8 | Pass |
| Moon tide is ready in the sample gallery. | 8 | Pass — `demo-sandbox` |
| Pause it, change scenes, show the clock, or adjust the display. | 11 | Pass — controls are covered by registered claims |
| Open the Moon tide sample | 5 | Pass — result-naming action |
| Layered tidal contours move beneath a low copper moon. | 9 | Pass — scene description |
| How it works | 3 | Pass |
| Set up an idle display in three steps | 8 | Pass |
| Open a scene. | 3 | Pass |
| Use a TV browser or this tab on a second monitor. | 11 | Pass — tested Chromium boundary is stated in the guide and README |
| Set the display. | 3 | Pass |
| Choose rotation, clock, brightness, and night dimming. | 7 | Pass — `display-settings` |
| Leave it running. | 3 | Pass |
| The controls move aside while the scene stays visible. | 9 | Pass — `controls-fade` |
| Privacy | 1 | Pass |
| What Wallpage does not do | 5 | Pass |
| Wallpage has no account, ads, or analytics. | 7 | Pass — `privacy-no-tracking` |
| Display settings stay in this browser. | 6 | Pass — `display-settings` |
| Wallpage contacts Sociobot to check or restore a Collector license. | 10 | Pass — `collector-network` |
| Read the privacy policy | 4 | Pass — result-naming link |
| Optional Collector | 2 | Pass — tier label |
| Add two scenes for $19 once | 6 | Pass — `collector-license` |
| The free gallery has eight scenes. | 6 | Pass — `scene-count` |
| Collector adds Fault garden and Aurora basin after Sociobot verifies the license. | 11 | Pass — `collector-license` |
| Sociobot manages the checkout outside Wallpage. | 6 | Pass — `collector-license` |
| Open checkout — $19 once (external) | 5 | Pass — names result and external handoff |
| Wallpage turns idle displays into moving art. | 7 | Pass — footer one-liner |
| Built by Param Factory · v1.2.1 · build `1ca7457` | 8 | Pass — footer build identity |

### README

| Copy | Words | Result / claim coverage |
| --- | ---: | --- |
| Wallpage | 1 | Pass — document title |
| Turn an idle screen into moving art. | 7 | Pass |
| Wallpage is for TVs, wall displays, and second monitors that need a calm display. | 14 | Pass — `tv-display-support` |
| Each moving scene is drawn in the browser without a video stream. | 12 | Pass — `local-rendering` |
| Try Wallpage with sample data | 5 | Pass — `demo-sandbox` |
| The Moon tide sample uses separate browser storage. | 8 | Pass — `demo-sandbox` |
| You can reset it at any time. | 7 | Pass — `demo-sandbox` |
| The gallery has eight free scenes. | 6 | Pass — `scene-count` |
| Collector adds two scenes for $19 once. | 7 | Pass — `collector-license` |
| Those scenes unlock only after Sociobot verifies a license. | 9 | Pass — `collector-license` |
| The demo contacts only wallpage.sociobot.in. | 5 | Pass — `privacy-no-tracking` |
| It has no account, ads, analytics, or downloaded fonts. | 9 | Pass — `privacy-no-tracking` |
| The demo reopens offline after its first visit and keeps drawing its scene. | 13 | Pass — `offline-reload` |
| Run locally | 2 | Pass — contextual heading |
| Use Node.js 20 or newer. | 5 | Pass — contributor requirement |
| The command prints a local URL. | 6 | Pass — contributor instruction |
| Open `/demo` for the isolated sample. | 6 | Pass — `demo-sandbox` |
| Test and build | 3 | Pass — contextual heading |
| `npm run build` type-checks the app and writes the static site to `dist/`. | 8 | Pass — `build-output` |
| The deploy folder contains `dist/index.html`. | 5 | Pass — `build-output` |
| The budget check caps initial JavaScript at 200 KB. | 9 | Pass — `asset-budgets` |
| It caps CSS files at 50 KB and scene images at 300 KB each. | 14 | Pass — `asset-budgets` |
| Controls | 1 | Pass — contextual heading |
| ← or J: previous scene | 5 | Pass — `keyboard-controls` |
| → or K: next scene | 5 | Pass — `keyboard-controls` |
| Space: pause or play | 4 | Pass — `keyboard-controls` |
| C: show or hide the clock | 6 | Pass — `keyboard-controls` |
| F: enter or leave fullscreen | 5 | Pass — `fullscreen` |
| S: open display settings | 4 | Pass — `keyboard-controls` |
| H: open the guide | 4 | Pass — `keyboard-controls` |
| These keyboard shortcuts change scenes, playback, the clock, settings, and the guide. | 12 | Pass — `keyboard-controls` |
| Gallery controls fade after 4.5 seconds and return on pointer movement. | 9 | Pass — `controls-fade` |
| The Share control creates a link for the current scene and seed. | 11 | Pass — `share-scene` |
| The fullscreen button and F key enter or leave fullscreen when the browser supports it. | 14 | Pass — `fullscreen` |
| Display settings control rotation, clock, date, brightness, night dimming, and the animation frame-rate cap. | 14 | Pass — `display-settings` |
| Keep screen awake asks a supported device to prevent display sleep while a scene plays. | 14 | Pass — `wake-lock` |
| Visible demo controls have touch targets at least 44 by 44 CSS pixels at 390px width. | 16 | Pass — `touch-targets` |
| Display support | 2 | Pass — contextual heading |
| Wallpage is tested in Chromium at a 1280 by 720 TV-like viewport with keyboard-only controls. | 15 | Pass — `tv-display-support` |
| The gallery remains usable when fullscreen or Screen Wake Lock is unavailable. | 11 | Pass — `tv-display-support`, `wake-lock` |
| Casting comes from your browser or device menu. | 8 | Pass — scope statement |
| Wallpage does not control or promise support for a specific casting device. | 12 | Pass — scope statement |
| Collector purchase and restore | 4 | Pass — contextual heading |
| Copy `.env.example` to `.env.local` to test another public Sociobot configuration. | 10 | Pass — contributor instruction |
| Production uses the committed checkout and verifier URLs in `.env.production`. | 9 | Pass — contributor instruction |
| Without a saved license, opening the gallery does not contact the verifier. | 12 | Pass — `collector-network` |
| Wallpage sends a saved or entered license only to the Sociobot verifier. | 12 | Pass — `collector-network` |
| Collector unlocks only when Sociobot confirms the saved license is active. | 10 | Pass — `collector-license` |
| Payment happens on the Sociobot checkout. | 6 | Pass — `collector-license` |
| Wallpage does not embed a payment provider. | 7 | Pass — `collector-license` |
| Architecture and privacy | 3 | Pass — contextual heading |
| Wallpage uses Vite and vanilla TypeScript. | 6 | Pass — contributor description |
| The browser test suite proves offline reload through the isolated sample. | 10 | Pass — `offline-reload` |
| Read the privacy policy and terms. | 6 | Pass — result-naming links |
| Demo behavior is documented in `.factory/demo.md`. | 6 | Pass — contributor documentation |
| The visual thesis and generated-art provenance are in `.factory/design.md`. | 9 | Pass — documented provenance, not a user performance claim |
| Deployment | 1 | Pass — contextual heading |
| Deploy `dist/` as the configured Azure Static Web App. | 8 | Pass — contributor instruction |
| The repository does not manage infrastructure, DNS, secrets, or billing registration. | 10 | Pass — scope statement |
| License | 1 | Pass — contextual heading |
| MIT © 2026 Sociobot (Param Factory). | 5 | Pass — license notice |
| See LICENSE. | 2 | Pass — result-naming link |

## Demo and sandbox verification

The first click from the landing page opens `/demo`, not a setup screen. It immediately renders the named Moon tide scene with the fixed `sample-moon-tide-2042` scene setting, visible controls, and a moving Canvas. The persistent banner says **“Demo — sample data, nothing is saved”** and exposes **Reset demo** and **Start for real**.

The clean-clone `@claim:demo-sandbox` test set a real `wallpage:settings` value before entering demo, changed demo state, reset it, and exited it. It passed while preserving the real key byte-for-byte and removing only `demo:` keys. The direct `?demo=1` entry also passed. `@claim:privacy-no-tracking` intercepted the complete demo flow and passed with same-origin requests only, no cookies, no account fields, and demo-prefixed storage only. `@claim:offline-reload` passed after first visit with the browser offline and compared changing Canvas frames.

## Claims verification

All 17 exact commands from `.factory/claims.json` were run individually in clean clone `/tmp/wallpage-review4-clean-1ca7457` at this commit. Every command passed:

| Claim id | Result |
| --- | --- |
| demo-sandbox | PASS |
| local-rendering | PASS |
| privacy-no-tracking | PASS |
| collector-network | PASS |
| offline-reload | PASS |
| scene-count | PASS |
| collector-license | PASS |
| display-settings | PASS |
| share-scene | PASS |
| fullscreen | PASS |
| controls-fade | PASS |
| keyboard-controls | PASS |
| tv-display-support | PASS |
| wake-lock | PASS |
| touch-targets | PASS |
| asset-budgets | PASS |
| build-output | PASS |

`npm test` passed 17/17 tests; `npm run build` passed and produced `dist/`; the live production browser suite passed 30/30 tests. The local-rendering test visited and observed changing Canvas frames for all eight free scenes and both Collector scenes after a recorded positive verifier response. No claim-like landing or README sentence lacked a corresponding registered claim where an observable product promise was made.

## Earlier findings rechecked

Every earlier finding was checked against both the live deployment and current source/tests; none is merely marked fixed.

| Earlier finding | Confirmed current evidence |
| --- | --- |
| Review 1 — BLOCKING 1 | Mobile and desktop first screen now states job, audience, action result, and three facts. |
| Review 1 — BLOCKING 2 | `/demo` and `?demo=1` show fixed sample, persistent banner, reset/exit controls, and separate storage. |
| Review 1 — BLOCKING 3 | `claims.json` has 17 one-to-one tagged tests; all passed separately. |
| Review 1 — BLOCKING 4 | Unknown live route returns HTTP 404 with the designed recovery page. |
| Review 1 — S1 | Routes have individual metadata/canonicals, focused h1s, announcements, shared navigation/footer, sitemap, and 404. |
| Review 1 — S2 | The prior metaphors, seed jargon, vague actions, and inconsistent scene terms are absent from primary copy. |
| Review 2 — F-2-1 | `local-rendering` loops through all ten scene titles and compares changing Canvas output. |
| Review 2 — F-2-2 | `collector-license` confirms both paid cards unlock, selects each, and checks rendering. |
| Review 2 — F-2-3 | `/gallery` has its own route/canonical and the shared header/footer component. |
| Review 2 — F-2-4 | Live disclosure says Sociobot checks **or restores** a Collector license; `collector-network` covers saved and absent licenses. |
| Review 2 — F-2-5 | `display-settings` verifies rotation, clock/date, brightness, night dimming, frame cap, and storage separation. |
| Review 2 — F-2-6 | Dedicated `share-scene` and `fullscreen` claim tests pass. |
| Review 2 — F-2-7 | Offline reload compares two later Canvas frames, not only status text. |
| Review 2 — F-2-8 | Public copy confines the tested boundary to Chromium at 1280 × 720 and keyboard controls. |
| Review 2 — F-2-9 | Keep screen awake is present with play/visibility/unsupported-browser handling and a claim test. |
| Review 2 — F-2-10 | The static landing artwork is labeled “Sample scene,” not “Live preview.” |
| Review 2 — F-2-11 | Checkout action says “Open checkout — $19 once (external).” |
| Review 2 — F-2-12 | README explains separate browser storage without exposing the implementation prefix. |
| Review 2 — F-2-13 | README uses the plain same-origin disclosure. |
| Review 2 — F-2-14 | README names Sociobot and the active-license outcome plainly. |
| Review 2 — F-2-15 | Footer uses a version and seven-character build identity, not repair language. |
| Review 2 — F-2-16 | `build-output` is registered and passes. |
| Review 2 — F-2-17 | Provenance is retained in the design record rather than an unsupported README promise. |
| Review 3 — F-3-1 | Unsupported Firefox/Safari/Edge wording is absent; Chromium-only tested wording is protected by a release-contract test. |

## Structure, links, accessibility, and identity

- Live `/`, `/demo`, `/gallery`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, favicon, touch icon, manifest, and social image all returned HTTP 200. The deliberately invalid route returned HTTP 404. The explicitly external checkout link returned its expected 303 handoff, and the privacy link is an explicit `mailto:` address.
- Route tests confirmed one h1, title, description, canonical, OG/Twitter metadata, apple touch icon, h1 focus, back-navigation focus, and no serious or critical Axe issue across root, demo, gallery, legal pages, and the recovery page. The live suite passed 30/30.
- The live root sends CSP, HSTS, `X-Content-Type-Options`, referrer policy, and permissions policy. The social image is 1200 × 630 and the touch icon is 180 × 180.
- The recovery page is visually and structurally part of the nocturnal mineral system, with a clear return action. The landing and gallery avoid a generic SaaS card/gradient template: the tidal-observatory art, dark projection-room chrome, serif display type, ember focus cues, and dissolving controls match the documented Wallpage-specific thesis.

## Missed leverage

No missing AI, import/export, or sync feature is expected for this job. The useful implied addition—preventing a long-running display from sleeping—is present as **Keep screen awake**, remains optional, and has an unsupported-browser fallback. An AI feature would be decorative here and is correctly absent.

## What would make this perfect

It meets the stated zero-finding standard at this review point. Preserve that status by continuing to run the registered claim suite from the demo sandbox whenever copy, storage, display controls, or browser-support wording changes.
