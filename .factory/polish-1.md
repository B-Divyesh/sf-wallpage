# Wallpage polish 1 — acceptance map

**Base reviewed:** `b66ced244e26997d87a1b59307e0d58be22ca35b`  
**Repair commit:** `367c16c083a8801f1982c4002753e9604cc4532f`  
**Review source:** `.factory/review-1.md` at `ede9a22035fc367dd9401ff981866cbcbfd4a79c`

| Finding | Change made | Evidence |
| --- | --- | --- |
| BLOCKING 1 | The landing hero has one plain H1, the named TV/wall-display/second-monitor audience, a one-click **Try it with sample data** link, its immediate result, and three short facts. | `gallery.spec.ts` — `the first screen states the job, audience, action, and three facts`; `/tmp/wallpage-polish-1/live-repair/landing-390.png`; cold `https://wallpage.sociobot.in/` check passed. |
| BLOCKING 2 | `/?demo=1` and `/demo` open the fixed Moon tide sample in `demo:` storage only. The persistent banner offers Reset demo and Start for real; both discard demo data. Stale `scene` parameters cannot change the documented initial sample. | `@claim:demo-sandbox`; `.factory/demo.md`; `/tmp/wallpage-polish-1/live-repair/demo-390.png`; cold `https://wallpage.sociobot.in/demo?scene=cloud-chamber` check passed with Moon tide, banner, no normal keys, and empty storage after reset. |
| BLOCKING 3 | Added the complete claims register and exactly one tagged browser test for each listed visitor claim. The registry contract test rejects missing, duplicate, or unrunnable tags. Claims use the demo entry point and exercise isolation, local rendering, privacy, offline reload, scene count, Collector, controls, keyboard, touch size, and budgets. | `.factory/claims.json`; `release-contract.test.ts` — `every registered claim has exactly one tagged browser test`; all ten exact commands passed from a clean clone (recorded in handoff). |
| BLOCKING 4 | Azure Static Web Apps routes only known application URLs to the shell and rewrites unknown URLs to the designed `404.html`, with title, focusable H1, return link, metadata, and consistent header/footer. | `release-contract.test.ts` — `static host serves known routes and returns its designed 404 for unknown routes`; `gallery.spec.ts` — `unknown routes show a designed recovery page`; `/tmp/wallpage-polish-1/live-repair/404-390.png`; cold `https://wallpage.sociobot.in/does-not-exist` check passed with HTTP 404. |
| S1 | Added the full landing sequence, shared header/footer, `/demo`, legal routes, route-specific title/description/canonical/OG/Twitter metadata, social and touch artwork, sitemap entries, H1 focus, and polite route announcements. | `gallery.spec.ts` — `all routes have metadata, focus, and no serious accessibility violations` and `legal navigation and browser Back restore heading focus`; `verify-url.sh` local report `/tmp/wallpage-polish-1/verify-local/verify.json`. |
| S2 | Rewrote the first screen, controls, settings, guide, Collector actions, and README around the stable terms **scene**, **gallery**, **idle display**, **fullscreen**, **Collector**, and **demo**. Removed the untestable welcome provenance sentence while retaining provenance in `.factory/design.md`. | `.factory/copy-audit.md`; `gallery.spec.ts` first-screen test; `/tmp/wallpage-polish-1/landing-390.png`. |

## Additional no-regression repair

- The compact gallery footer now says **Built by Param Factory** on every gallery route.
- `@claim:local-rendering` now cycles all eight free scenes before asserting that no video, iframe, or media request was used.
- Mobile screenshots above were reviewed at 390 × 844. The landing action, demo banner actions, scene dock, and 404 recovery link fit without horizontal scrolling.

## Live recheck

After deploying `dist/` through the Azure Static Web Apps work-order configuration, fresh cold checks were run at:

- `https://wallpage.sociobot.in/`
- `https://wallpage.sociobot.in/?demo=1`
- `https://wallpage.sociobot.in/demo?scene=cloud-chamber`
- `https://wallpage.sociobot.in/does-not-exist`

All mapped findings passed on the deployed shell: the landing answers job/audience/action, both demo URLs open Moon tide with the banner, and the invalid URL serves the styled recovery page. `/opt/fleet/lib/verify-url.sh` passed at the live root, and a live AxeBuilder scan on the 404 had zero serious or critical violations.
