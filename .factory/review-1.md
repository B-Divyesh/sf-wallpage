# Adversarial first-read review 1 — FAIL

**Product:** Wallpage  
**Reviewed:** 2026-08-28  
**Live URL:** <https://wallpage.sociobot.in/>  
**Commit reviewed:** `df2db712216c8343c6fa51ec411f00fecabc4bf7`

## Verdict

**FAIL.** There are four BLOCKING findings. A cold visitor cannot identify the intended audience from the first screen; no isolated sample-data demo exists; the required claims register and claim tests are absent; and an invalid route silently opens the gallery instead of a designed 404. The atmospheric visual treatment is distinct, but it does not make the product’s job, audience, or first action sufficiently plain.

## Cold first read

Fresh, logged-out Chromium contexts were opened at 390 × 844 and 1440 × 900 before scrolling.

My first-read interpretation was: “This appears to be a gallery of slow animated artwork for an idle screen; press **Enter the gallery** to see it.” I could not determine *for whom* from the first screen. It never says TV owners, wall displays, second monitors, or another concrete situation. I also cannot tell whether “today’s seed” is a choice I need to make.

The same welcome dialog appeared at both viewport sizes:

> “An idle screen, alive”
>
> “Time, made ambient.”
>
> “Ten slow environments evolve from today’s seed. Leave one running, or let the gallery wander.”

The first two lines are metaphors, not the job. The third names neither the visitor nor the display context and uses unexplained “seed” terminology. The button **“Enter the gallery”** is visible, but it does not name what will appear after it.

### BLOCKING 1 — The first screen fails the five-second clarity test

**Quote:** “Time, made ambient.” and “Ten slow environments evolve from today’s seed.”

**Why this loses a first-time visitor:** Verify the three required answers from that screen: the broad activity can be inferred, the intended visitor cannot, and the next result is not stated. On a phone this is the whole first screen. A visitor looking for a TV/second-monitor screensaver has to guess that this page is for them.

**Concrete fix:** Replace the headline, supporting sentence, and action with plain job language, for example:

> **Turn an idle screen into moving art**  
> For TVs, wall displays, and second monitors that need a calm display.  
> **Try it with sample data** — opens a running sample scene and its controls.

Place three short facts beside it: “Runs in your browser.” “No account or ads.” “Free gallery; Collector price: $X once.” Make the page’s one `<h1>` this headline rather than the hidden “Wallpage ambient generative gallery.”

### BLOCKING 2 — No one-click, isolated demo exists

**Quote:** The only welcome action is “Enter the gallery.” Neither the initial page nor `/demo`/`?demo=1` contains “Try it with sample data,” “Demo — sample data, nothing is saved,” “Reset demo,” or “Start for real.”

**Evidence:** In fresh 390 px contexts, both `https://wallpage.sociobot.in/?demo=1` and `https://wallpage.sociobot.in/demo` returned the regular welcome dialog. Clicking **Enter the gallery** changed the URL only by adding `scene=brackish-drift` and wrote this real namespace key:

```text
wallpage:settings = {"clock":true,...,"seenWelcome":true}
```

No `demo:` key, demo banner, reset control, or start-for-real transition was present. Therefore Reset demo cannot be exercised, and the purported demo changes the same settings a real visitor uses.

**Why this loses or misleads a first-time visitor:** The product is tryable as a normal gallery, but it does not meet the promised verification entry point: sample mode is neither named nor isolated. A verifier cannot prove that a trial leaves real data untouched.

**Concrete fix:** Implement `/demo` (and `?demo=1`) as a true demo entry. Make the first-screen CTA enter it in one click, preload a named seed and scene, show a persistent **“Demo — sample data, nothing is saved”** banner, and provide **Reset demo** and **Start for real**. Use only `demo:`-prefixed storage while that banner is visible; assert that normal Wallpage keys are not read or written. Add `.factory/demo.md` documenting the URL, sample, reset behavior, and namespace.

### BLOCKING 3 — Claims are unregistered and cannot be independently verified

**Quote:** `.factory/claims.json` is absent from the candidate.

**Why this loses or misleads a visitor:** The live page and README make privacy, offline, local-rendering, feature, and commercial promises. With no inventory, sandbox instructions, or `@claim:` tests, there is no defined proof for any of them. This is a required release artifact, not an optional documentation improvement.

**Concrete fix:** Add `.factory/claims.json` with one sandbox test command per claim, tag each test exactly once, and point every test at `/demo`. At minimum register client-side rendering, offline reload, no-account/no-analytics behavior, scene count, Collector verification/locking, and every quantitative README statement. Intercept all requests for privacy tests and assert the demo namespace remains isolated.

The following live/README claims currently have **no claims.json entry**:

| Surface | Unlisted claim-like sentence or copy | Required test outcome |
| --- | --- | --- |
| Welcome | “Ten slow environments evolve from today’s seed.” | A fixed demo seed selects deterministic output. |
| Welcome | “Artwork and live scenes are original, with the still artwork generated for Wallpage.” | Keep provenance; remove the marketing claim if originality cannot be tested. |
| Gallery | “Canvas generated locally” | Intercept demo traffic and assert no scene/video fetch occurs. |
| Gallery | “Offline · the gallery will keep playing” | First-load `/demo`, go offline, reload, and assert a usable running/paused sample gallery. |
| Settings | “Lower rates save energy on long-running displays.” | Measure and define an energy/performance metric, or remove it. |
| Settings | “The price is shown before checkout; paid scenes stay locked until Sociobot verifies a license.” | Assert checkout price visibility and invalid/offline/valid entitlement outcomes. |
| Guide | “Wallpage draws every moving scene in this browser.” | Assert no scene media/network request during demo use. |
| Guide | “No video stream, account, ads, or installation is required.” | Intercept all demo requests; assert no account/install step. |
| Guide | “Move the pointer away; the controls fade after a few seconds.” | Assert the timed visible state and reduced-motion behavior. |
| Guide | “Wallpage itself does not install system software.” | Assert no install/download action is offered; otherwise remove. |
| README | “It draws slow, original, deterministic environments locally in Canvas—no video stream, ads, account, external font, or installation.” | Split into testable rendering, network, account, font, and install claims. |
| README | “The free collection includes eight scenes… [and] night dimming.” | Assert eight free scenes and each listed control/setting in demo. |
| README | “Two additional scenes are ready for the optional one-time Collector pass.” | Assert exactly two locked scenes and the stated purchase term. |
| README | “Open it in a modern browser; no environment variables are required for the free gallery.” | Fresh demo browser loads and runs without configured variables. |
| README | “`npm run check:budget` rebuilds and enforces… [the stated limits].” | Run the command and assert each stated limit. |
| README | “All actions also have 44 px pointer/remote-friendly buttons.” | Measure every applicable target at 390 px. |
| README | “Controls fade during playback and return on pointer movement or any key press.” | Timed interaction test. |
| README | “A local token or old local-storage flag never unlocks Collector… [and] paid scenes remain locked offline or on an error.” | Fresh-context tamper/offline/error entitlement test. |
| README | “Payment providers are never embedded directly…” | Intercept checkout flow and assert only the allowed Sociobot hand-off. |
| README | “The build stamps the service-worker cache… [and] navigation is network-first with an offline shell fallback.” | Release-A-to-B service-worker update plus offline demo reload. |
| README | “No analytics or tracking calls are made.” | Intercept the complete demo flow and allow only declared origins. |
| README | “The shipped 1200 × 800 AVIF, WebP, and JPEG fallbacks are each under 40 KB.” | Assert dimensions and byte sizes. |

I independently observed that a first online visit did reload successfully offline and that observed gallery requests were same-origin (`wallpage.sociobot.in`) only. That is evidence of current behavior, not a substitute for required demo-based claim tests.

### BLOCKING 4 — Unknown routes silently open the gallery; no designed 404 exists

**Quote:** Requesting `/does-not-exist` returned HTTP `200`, changed to `/does-not-exist?scene=brackish-drift`, and displayed the ordinary gallery with the normal welcome dialog.

**Why this loses a visitor:** A mistyped or stale link looks successful while hiding the requested page’s absence. This is broken routing under the site-structure contract, and it prevents a visitor from recovering deliberately.

**Concrete fix:** Add a styled 404 route that returns/serves the platform’s 404 behavior, says the page was not found, gives a visible **Return to gallery** link, sets a 404-specific title, and has a focused `<h1>`. Add a browser test for an invalid deep link.

## Significant findings

### S1 — Required page skeleton and route metadata are incomplete

**Evidence:**

- The landing page has no visible header navigation and no Demo link. Its footer is only “Canvas generated locally Privacy Terms”; legal pages instead use “© 2026 Sociobot · Privacy · Terms.” Neither footer has the required product one-liner, “Built by Param Factory,” or build/version identifier.
- The landing page is a full-screen gallery/welcome dialog, not the required information sequence. It lacks the plain first-screen facts, a three-step how-it-works section, a plain privacy limitation section, and exact Collector price.
- All inspected routes have a description and favicon, but root, Privacy, Terms, and the invalid route have no canonical link, Twitter card, or Apple touch icon. The only OG image is `/assets/tidal-observatory.webp`; no 1200 × 630 social image was found. `/demo` has the ordinary title “Wallpage — ambient generative scenes,” not “Demo — Wallpage.”
- A direct `/?scene=moon-tide` link correctly selected Moon tide and reloaded. However, after navigation to Privacy and after browser Back, `document.activeElement` was `BODY`, not the new page’s `<h1>`. No route-change announcement or focus management was observed.

**Concrete fix:** Build the documented landing structure around the live preview; add a consistent header/nav/footer to every route; produce route-specific metadata and a 1200 × 630 original social image; add `/demo` to sitemap; and move focus to the destination `<h1>` with an `aria-live` route announcement on each navigation/back transition.

### S2 — Copy uses metaphors, product jargon, inconsistent terms, and vague buttons

**Quotes:** “Time, made ambient.”, “An idle screen, alive”, “Projection room”, “today’s seed”, “Get Collector”, and “Make a room feel less idle”.

**Why this loses a visitor:** These phrases need interpretation before they explain the job. “Environment,” “scene,” “gallery,” “screen,” “screensaver,” and “display” are used for overlapping concepts; `fullscreen` in README and “full screen” in UI are also inconsistent. “Get Collector” says neither what happens nor the price.

**Concrete fix:** Use **scene** for every moving visual, **gallery** for the collection, and **idle display** for the use case. Replace “Projection room” with “Display settings,” “Get Collector” with “See Collector price,” “Enter license” with “Restore Collector license,” and “Verify” with “Verify license.” Use the headline and support sentence proposed in BLOCKING 1.

## Copy audit

Word counts use Unicode word tokens. The landing inventory includes every static visitor-facing copy unit in the gallery, welcome dialog, scene library, settings, and guide (not the live clock/date or conditional entitlement/error replacements). `Flag` records a plain-words failure or `—`.

### Landing page

| Copy unit | Words | Flag / proposed rewrite |
| --- | ---: | --- |
| Wallpage ambient generative gallery | 4 | H1 is product jargon, not a job. Use “Turn an idle screen into moving art.” |
| A dark tidal observatory in blue-green fog | 7 | — |
| Seed of the day | 4 | Jargon. Use “Today’s scene setting,” or explain seed once. |
| Fine luminous currents wander through deep estuary water. | 8 | — |
| Current time | 2 | — |
| Scene controls | 2 | — |
| Previous scene / Open scene library / Next scene | 2 / 3 / 2 | — |
| Play animation / Hide clock / Share this seed / Enter fullscreen / Open settings | 2 / 2 / 3 / 2 / 2 | “Share this seed” uses unexplained jargon; use “Share this scene.” |
| Canvas generated locally | 3 | Technical jargon. Use “This scene runs in your browser.” (and test it). |
| Offline · the gallery will keep playing | 6 | Claim; register offline test. |
| Skip to the gallery / Privacy / Terms | 4 / 1 / 1 | — |
| An idle screen, alive | 4 | Contextless marketing heading. Use the job headline. |
| Time, made ambient. | 3 | Metaphor; use the job headline. |
| Ten slow environments evolve from today’s seed. | 7 | “environment” and “seed” are jargon; use “Ten scenes change slowly through the day.” |
| Leave one running, or let the gallery wander. | 8 | “wander” is vague. Use “Keep one scene on screen, or rotate through the gallery.” |
| change scene / pause / clock / full screen | 2 / 1 / 1 / 2 | “full screen” conflicts with README `fullscreen`; choose “fullscreen.” |
| Enter the gallery | 3 | Result is unnamed. Use “Watch a sample scene.” |
| Artwork and live scenes are original, with the still artwork generated for Wallpage. | 13 | Claim; register provenance or use “About this artwork.” |
| The collection / Choose an environment / Close scene library | 2 / 3 / 3 | “environment” conflicts with “scene.” Use “Choose a scene.” |
| Projection room / Display settings / Close settings | 2 / 2 / 2 | “Projection room” is unexplained; remove it. |
| Move to the next scene on a quiet interval. | 9 | “quiet interval” is vague. Use “Change scenes every 1, 5, 15, or 30 minutes.” |
| Lower rates save energy on long-running displays. | 7 | Unmeasured claim. Define metric/test or use “Use fewer frames per second.” |
| Dim the canvas without dimming controls. | 6 | “canvas” is implementation jargon. Use “Dim the scene, not the controls.” |
| Keep the calendar below the clock. | 6 | — |
| Apply an extra veil during your sleep hours. | 8 | “veil” is metaphor. Use “Dim scenes during these hours.” |
| Unlock Fault garden and Aurora basin with a one-time purchase. | 10 | State exact price beside this copy. |
| The price is shown before checkout; paid scenes stay locked until Sociobot verifies a license. | 15 | Claim; add entitlement/checkout tests. |
| Get Collector / Enter license / License key / Verify / Reset local data | 2 / 2 / 2 / 1 / 3 | Buttons are not result-naming verbs. Use “See Collector price,” “Restore Collector license,” and “Verify license.” |
| Wallpage guide / Make a room feel less idle / Close guide | 2 / 6 / 2 | Second heading is marketing and unclear. Use “Use Wallpage on a larger screen.” |
| Wallpage draws every moving scene in this browser. | 8 | Claim; register network/render test. |
| No video stream, account, ads, or installation is required. | 9 | Claim; register network/account test. |
| Put it on a larger screen | 6 | — |
| Open this page in a TV browser, or cast this tab from your browser menu. | 15 | — |
| Press F or the expand button for full screen. | 9 | Standardize to “fullscreen.” |
| Move the pointer away; the controls fade after a few seconds. | 11 | Timed claim; test it. |
| Use it as a screensaver | 5 | Misleading next to a third-party utility requirement. Use “Show it on an idle display.” |
| On macOS or Windows, use a trusted web page screensaver utility and set its URL to this page. | 18 | “trusted” is unsupported. Name no utility unless it is supported/tested. |
| Wallpage itself does not install system software. | 7 | Claim; register or remove. |
| Keyboard and remote | 3 | Heading is understandable but should be “Keyboard and remote controls.” |
| previous / next / pause / clock / settings / guide | 1 each | Fragments are acceptable in a control legend. |
| Layered tidal contours move beneath a low copper moon. | 9 | — |
| Two patient colonies trade a soft cellular frontier. | 8 | “colonies” can be unclear; use “Two fields meet and shift slowly.” |
| Storm vapor gathers, opens, and dissolves in slow strata. | 9 | “strata” is specialist language; use “layers.” |
| A dark botanical flame draws itself from orbiting embers. | 9 | — |
| Mineral points find temporary neighbors across a night basin. | 9 | — |
| Long submerged ribbons lean into an unseen tide. | 8 | — |
| Weather marks fall through a quiet field of reflected light. | 10 | — |
| Collector scene — geological cells breathe along illuminated seams. | 8 | “Collector scene” is an undefined paid-tier label; state the price/tier. |
| Collector scene — veils of mineral light fold over a black horizon. | 11 | “veils” is metaphor; use “bands of mineral light…” |

No static landing unit exceeds 22 words. That does not pass the audit: the first-screen copy still fails its required job/audience/action shape, and several claims remain untested.

### README

| Sentence or heading | Words | Flag / proposed rewrite |
| --- | ---: | --- |
| Wallpage | 1 | Product-name heading is acceptable only with a plain summary immediately below. |
| Wallpage is a browser “screensaver” gallery for idle TVs, wall displays, and second monitors. | 14 | Use the same “idle display” term as the site. |
| It draws slow, original, deterministic environments locally in Canvas—no video stream, ads, account, external font, or installation. | 18 | Dense list of unlisted claims and Canvas jargon. Split into tested facts. |
| The free collection includes eight scenes, a movable clock/date overlay, deterministic seed-of-the-day, shareable seed links, auto-rotation, fullscreen, adaptive frame rates, hidden-tab pausing, and night dimming. | 26 | **Over 22 words.** Split into short, tested feature lines. |
| Two additional scenes are ready for the optional one-time Collector pass. | 11 | State price and test the count/entitlement. |
| Live product | 2 | Heading is understandable. |
| Run locally | 2 | — |
| Requirements: Node.js 20 or newer. | 6 | — |
| Vite prints the local URL. | 5 | Implementation jargon for a user README; use “The command prints a local URL.” |
| Open it in a modern browser; no environment variables are required for the free gallery. | 15 | Unlisted environment/configuration claim. |
| Test and build | 3 | — |
| The production command is exactly `npm run build`. | 8 | — |
| It type-checks the app and writes the static deploy to `dist/`, with `dist/index.html` at the root. | 18 | Implementation detail; split if retained. |
| Azure Static Web Apps reads `staticwebapp.config.json` from that output. | 11 | Product-infrastructure jargon; move to deploy documentation. |
| `npm run check:budget` rebuilds and enforces the static product limits for initial JavaScript (200 KB), CSS (50 KB), poster formats (300 KB each), and WOFF2 fonts (120 KB each). | 30 | **Over 22 words.** Split into tested limit bullets. |
| Controls | 1 | — |
| `←` / `J`: previous scene; `→` / `K`: next scene; `Space`: pause or play; `C`: show or hide the clock; `F`: enter or leave fullscreen; `S`: open settings; `H`: open the guide. | 5 / 5 / 4 / 7 / 6 / 3 / 4 | Control labels are clear. Standardize “fullscreen” with the UI. |
| All actions also have 44 px pointer/remote-friendly buttons. | 9 | Unlisted measurable claim. |
| Controls fade during playback and return on pointer movement or any key press. | 13 | Unlisted timed claim. |
| Collector billing | 2 | “billing” is internal wording; use “Collector purchase and restore.” |
| Copy `.env.example` to `.env.local` for a local Collector configuration. | 11 | Refers to a file absent from the reviewed file list; verify it exists or remove. |
| Production uses the committed, public-only `.env.production` URLs for the registered Wallpage Sociobot checkout and verifier. | 16 | Jargon and deployment claim; move to maintainer docs. |
| The browser calls `GET <verifier>?license=<token>` only to verify a restored or pasted license. | 15 | Technical claim; document/test without exposing protocol in first-read docs. |
| A local token or old local-storage flag never unlocks Collector: each session requires an active server verdict, and paid scenes remain locked offline or on an error. | 27 | **Over 22 words.** Split into tested, plain entitlement facts. |
| Payment providers are never embedded directly and Vite variables must never contain secrets. | 13 | Implementation/security policy, not visitor-facing copy; move to contributor docs. |
| Architecture and privacy | 3 | These are separate topics; split heading. |
| Wallpage is Vite + vanilla TypeScript. | 5 | Maintainer jargon; acceptable in architecture subsection. |
| The compact scene catalog lives in `src/scene-catalog.ts`; Canvas algorithms load from `src/scenes.ts` after gallery entry or during a returning visitor’s idle time. | 26 | **Over 22 words.** Split or move implementation detail to code comments. |
| Local settings and deterministic seed helpers live in `src/core.ts`. | 11 | Maintainer detail; “seed” unexplained. |
| The build stamps the service-worker cache and manifest start URL from the emitted shell fingerprint, so each release installs as a distinct worker; navigation is network-first with an offline shell fallback. | 31 | **Over 22 words.** Split into separately tested update and offline statements. |
| No analytics or tracking calls are made. | 7 | Privacy claim; add interception test. |
| `/privacy` and `/terms` are application routes with plain-language policies. | 9 | Route jargon; simply link them. |
| The visual thesis and generated-art provenance are in `.factory/design.md` and `assets/src/tidal-observatory.prompt.json`. | 12 | Maintainer detail; fine in a provenance section. |
| The high-resolution PNG is retained as source; the shipped 1200 × 800 AVIF, WebP, and JPEG fallbacks are each under 40 KB. | 22 | At cap and a measurable claim; test it. |
| Deployment | 1 | — |
| Deploy the contents of `dist/` as an Azure Static Web App. | 11 | Reasonable maintainer instruction. |
| The repository does not manage infrastructure, DNS, secrets, billing registration, or production deployment. | 13 | Reasonable scope note; split if reader-facing. |
| License | 1 | — |
| MIT © 2026 Sociobot (Param Factory). | 5 | — |
| See LICENSE. | 2 | Use a markdown link for clarity. |

## Structure, routing, and visual checks

| Check | Result | Evidence |
| --- | --- | --- |
| Phone and desktop cold load | Fail | Same metaphor-led welcome dialog; no audience or demo action. |
| One H1 and main landmark | Pass | One H1 and one `<main>` on each inspected route; the root H1 is not a plain headline. |
| Title pattern | Partial | Root is `Wallpage — ambient generative scenes`; legal titles are `Privacy — Wallpage` and `Terms — Wallpage`; `/demo` is not a demo title. |
| Description, favicon, lang | Pass | `lang=en`, description, and SVG favicon were present. |
| Canonical, complete social metadata, touch icon | Fail | No canonical, Twitter card, or Apple touch icon; OG image is not the specified 1200 × 630 asset. |
| Designed 404 | Fail / BLOCKING | Invalid URL displays normal gallery with 200. |
| Deep link | Pass | `/?scene=moon-tide` opened Moon tide after reload. |
| Back and route focus | Fail | Privacy navigation and Back left focus on `BODY`, not H1. |
| Crawlable links | Partial | `/`, `/privacy`, and `/terms` returned 200; checkout returned 303 to its payment session; `mailto:` is exempt. Invalid internal URL incorrectly returned gallery 200. |
| Header/footer consistency | Fail | Gallery has no visible nav; legal header/footer differ; required factory/build/footer information is absent. |
| Distinct visual identity | Pass | The dark cinematic observatory art, projection-slate controls, serif display type, and full-screen composition are recognizably product-specific, not a generic SaaS template. |

## Verification performed

- Created a fresh shallow clone of the supplied public repository at `df2db712216c8343c6fa51ec411f00fecabc4bf7` in `/tmp/wallpage-review-OIsX8r`.
- Ran `npm ci` (0 vulnerabilities), `npm test` (**12/12 passed**), `npm run build` (passed, wrote `dist/`), installed the repository-required Playwright Chromium, and ran `npm run test:e2e` (**10/10 passed**).
- There were no tests listed in `.factory/claims.json`, because the required file does not exist. The ordinary suite does not use `@claim:` tags or a documented demo entry point.
- On live production, exercised fresh phone/desktop first load, `/demo`, `?demo=1`, storage behavior, direct scene deep link, legal routes, invalid route, offline reload after service-worker control, metadata, focus after navigation/back, and links.
- The online/offline interception recorded only `wallpage.sociobot.in` gallery requests. After first load, an offline reload showed “Offline · the gallery will keep playing”; Chromium emitted its expected `ERR_INTERNET_DISCONNECTED` resource error. This behavior must be rechecked through the future isolated demo test.

## Required acceptance retest

1. Start in a fresh 390 px context and verify the first screen answers job, audience, and action in one screen.
2. Enter `/demo` in a fresh context. Confirm immediate realistic sample use, persistent demo banner, `Reset demo`, `Start for real`, and only `demo:` storage writes. Confirm offline demo reload and same-origin-only privacy behavior.
3. Run every command in the new `.factory/claims.json` from a clean clone. Require one passing `@claim:` test per listed claim.
4. Verify canonical/OG/Twitter/touch metadata, consistent skeleton/footer, focused announced navigation, a real 404, and a complete link crawl.
