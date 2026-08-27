# Wallpage verification handoff — 2026-08-27

## Release outcome

**FAIL — do not release the deployed candidate as a product with Collector enabled.** Independent verification of `39ac05db765a819cef8704e637b5cc7cf9a5e24a` found that the repaired code paths pass, but production at <https://wallpage.sociobot.in/> has no working Sociobot checkout/license-verification configuration. See `.factory/verification-2.md` for exact fresh evidence.

The free Wallpage gallery is operational: clean install, 10 unit tests, 10 browser/PWA tests, TypeScript production build, normal desktop/mobile keyboard flows, reduced motion, axe serious/critical scans, live offline reload, response policies, privacy traffic, and byte-for-byte deployment identity all pass. Initial JS is 35,631 B raw / 12,557 B gzip and CSS is 14,498 B raw / 4,109 B gzip.

The release blocker is deployment-only:

- Live Settings says Collector checkout and license verification are not configured. A paid scene cannot be bought, restored, or verified on the real URL.
- The supposedly hidden unconfigured **Get Collector** control remains visible because `.secondary-button` overrides `hidden`; it has an empty `href` and does nothing.

Before a PASS, configure the real public Sociobot checkout and verifier URLs for the production build, verify one real purchase/return URL against production, and fix/test the hidden-control CSS. Also configure the AVIF response MIME type (`image/avif` rather than `application/octet-stream`); this is non-blocking in tested Chromium.

## Repair summary

- **Collector entitlement:** `wallpage:collector` is no longer read as proof of purchase and is removed as a legacy value. Paid scenes begin locked on every session. A returned or pasted license is stored only as `sb_license:wallpage`; it unlocks Collector only after `GET <VITE_SOCIOBOT_LICENSE_VERIFY_URL>?license=<token>` returns `{ valid: true, reason: "ok" }`. The app never stores a positive entitlement verdict. Offline, invalid, expired, revoked, wrong-product, configuration, and transient-error states explicitly keep paid scenes locked. The free eight-scene gallery remains fully local/offline.
- **PWA releases:** the Vite build stamps `dist/sw.js` and the manifest `start_url` with a SHA-256 fingerprint of the emitted HTML shell. Each changed shell therefore gets a distinct cache and worker. Navigation is network-first with the precached shell as offline fallback; hashed assets are cache-first. A waiting release shows an in-app Update action; it sends `SKIP_WAITING`, then `clientsClaim` activates it.

No secrets are committed or embedded. The verifier and checkout URLs remain public deployment configuration; the checkout provider is not embedded.

## Run and verify

```sh
npm ci
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

Production deployment root is `dist/`. Set only public browser configuration when the Sociobot product is registered:

```sh
VITE_SOCIOBOT_BUY_URL=https://api.sociobot.in/api/v1/products/wallpage/checkout
VITE_SOCIOBOT_LICENSE_VERIFY_URL=https://api.sociobot.in/api/v1/products/wallpage/verify
```

The verifier URL must be HTTPS and is called with `GET` plus the license query parameter. Do not put credentials or any other secret in `VITE_*` values.

## Verification performed

- `npm ci`: clean install, 0 audit vulnerabilities.
- `npm test`: **10/10** passed. Covers deterministic scenes, settings, entitlement URL construction, strict positive/negative entitlement parsing, and distinct build-A/build-B release fingerprints.
- `npm run test:e2e`: **10/10** Chromium scenarios passed. These include free-gallery flow, axe serious/critical scan (gallery and privacy), mobile, reduced motion, offline reopen, local-storage Collector tamper rejection, a positive signed-license verifier response, expired/tampered-license rejection, explicit offline-entitlement locking, and build A → build B service-worker install/wait/message/activation/reload.
- `npm run build`: passed and produced `dist/`. Final normal build initial JS was 35,631 B raw / 12,557 B gzip; CSS was 14,498 B raw / 4,109 B gzip (within the 200 KB / 50 KB budgets).
- PWA output inspection: `dist/sw.js` contains a release-derived `wallpage-shell-<hash>` cache name and `dist/manifest.webmanifest` has the matching `/?release=<hash>` start URL. The browser offline test uses `context.setOffline(true)` after worker installation and passes.
- **Standard static deployment:** deployed successfully to `https://wallpage.sociobot.in` (Azure deployment `52e50950-e93c-410c-b673-ee833510c7f7`). Post-deploy `verify-url.sh` returned HTTPS 200 in 1,044 ms with no browser console errors; title/lang/one h1/main/alt/button-label checks all passed. A live Playwright tamper smoke test set legacy `wallpage:collector=verified`, confirmed Fault garden still had `data-locked="true"`, confirmed the key was removed, and recorded no console errors. Live `sw.js` and `manifest.webmanifest` both contain release `a25059857fad`.
- Lighthouse was attempted locally with the installed Playwright Chromium, but Lighthouse's Chrome target crashed in this container and produced no valid scores. The automated accessibility, build-size, keyboard/mobile/reduced-motion, console-flow, and offline checks above passed; rerun Lighthouse in the deployment runner before using a score as release evidence.

## Known operational dependency

This repair deliberately does not make a browser-owned value into proof of payment. A deployment without `VITE_SOCIOBOT_LICENSE_VERIFY_URL` honestly leaves Collector locked and says verification is not configured; it does not affect free scenes. Configure the registered Sociobot product URLs at build/deploy time, then run one real purchase/return-URL verification against the production verifier.
