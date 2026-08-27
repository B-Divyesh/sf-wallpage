# Wallpage repair handoff — 2026-08-27

## Release outcome

The deployment-only Collector blocker reported in `f67b0e6a8a26cc8ea0bc4ae44088c9f501a3be81` is repaired for production. The public registered URLs are committed in `.env.production` (no credentials):

```sh
VITE_SOCIOBOT_BUY_URL=https://api.sociobot.in/api/v1/products/wallpage/checkout
VITE_SOCIOBOT_LICENSE_VERIFY_URL=https://api.sociobot.in/api/v1/products/wallpage/verify
```

The app still fails closed: only a positive Sociobot verifier response unlocks Collector; legacy local storage, offline state, and bad/revoked/expired tokens remain locked. The existing PWA release fingerprint, update prompt, and offline app-shell behavior are unchanged.

## What changed

- Added committed public production configuration and regressions that assert its exact checkout/verifier URLs and absence of assignment-style secrets.
- Added `[hidden] { display: none !important; }`, so semantic hidden state always wins over `.secondary-button`’s `inline-flex` display. The browser entitlement regression confirms both alternate Collector controls are actually hidden after verification.
- Added `image/avif` to Azure Static Web Apps MIME configuration.
- Documented how local and production public billing configuration is selected.

## Run and verify

```sh
npm ci
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

Deploy `dist/` as a Standard Azure Static Web App. `.env.production` is intentionally public browser configuration only; never put a license, API key, Dodo credential, or other secret in `VITE_*` values.

## Verification performed

- `npm ci`: clean install, 0 audit vulnerabilities.
- `npm test`: **12/12** passed, including the new production URL and AVIF MIME regressions.
- `npm run test:e2e`: **10/10** Chromium scenarios passed, including accessibility, mobile, reduced motion, legacy entitlement tampering, positive/expired/offline verification, offline PWA reopen, and service-worker updates. The positive entitlement test also proves hidden Collector buttons remain visually hidden despite `.secondary-button`.
- `npm run build`: passed and produced `dist/`. Production JavaScript is 36,579 B raw / 12,880 B gzip; CSS is 14,530 B raw / 4,120 B gzip, under budget. Inspection confirms the built JavaScript contains both production URLs and `dist/staticwebapp.config.json` declares `.avif: image/avif`.
- Live Sociobot smoke checks before deployment: checkout returned **303** to a `checkout.dodopayments.com` session; `GET /verify?license=wallpage-production-smoke-invalid` returned **200** with `{"valid":false,"reason":"invalid"}`. No license or payment credential was used or recorded.

## Standard static deployment

- Deployed `dist/` successfully to <https://wallpage.sociobot.in> as Azure Static Web Apps **Standard** deployment `804f4572-fe6f-4b49-b1cd-f8d7ea1a13db`.
- Post-deploy `verify-url.sh` returned HTTPS **200** in 1,254 ms with no console errors. Title, language, one `h1`, `main`, image alts, and button labels all passed.
- A live browser smoke test opened Settings and confirmed the visible **Get Collector** control has the exact public checkout href; entering a synthetic invalid token received the live verifier’s honest “not active” response with no console errors.
- `HEAD /assets/tidal-observatory.avif` returns **200**, `Content-Type: image/avif`, and immutable asset caching.

A full paid purchase/return-url success path requires a legitimate purchaser license; this repair does not fabricate one.
