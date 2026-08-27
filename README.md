# Wallpage

Wallpage is a browser “screensaver” gallery for idle TVs, wall displays, and second monitors. It draws slow, original, deterministic environments locally in Canvas—no video stream, ads, account, external font, or installation.

The free collection includes eight scenes, a movable clock/date overlay, deterministic seed-of-the-day, shareable seed links, auto-rotation, fullscreen, adaptive frame rates, hidden-tab pausing, and night dimming. Two additional scenes are ready for the optional one-time Collector pass.

Live product: [wallpage.sociobot.in](https://wallpage.sociobot.in)

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm install
npm run dev
```

Vite prints the local URL. Open it in a modern browser; no environment variables are required for the free gallery.

## Test and build

```sh
npm test
npm run build
npm run check:budget
npm run preview
```

The production command is exactly `npm run build`. It type-checks the app and writes the static deploy to `dist/`, with `dist/index.html` at the root. Azure Static Web Apps reads `staticwebapp.config.json` from that output.
`npm run check:budget` rebuilds and enforces the static product limits for initial JavaScript (200 KB), CSS (50 KB), poster formats (300 KB each), and WOFF2 fonts (120 KB each).

## Controls

- `←` / `J`: previous scene
- `→` / `K`: next scene
- `Space`: pause or play
- `C`: show or hide the clock
- `F`: enter or leave fullscreen
- `S`: open settings
- `H`: open the guide

All actions also have 44 px pointer/remote-friendly buttons. Controls fade during playback and return on pointer movement or any key press.

## Collector billing

Copy `.env.example` to `.env.local` for a local Collector configuration. Production uses the committed, public-only `.env.production` URLs for the registered Wallpage Sociobot checkout and verifier. The browser calls `GET <verifier>?license=<token>` only to verify a restored or pasted license. A local token or old local-storage flag never unlocks Collector: each session requires an active server verdict, and paid scenes remain locked offline or on an error. Payment providers are never embedded directly and Vite variables must never contain secrets.

## Architecture and privacy

Wallpage is Vite + vanilla TypeScript. The compact scene catalog lives in `src/scene-catalog.ts`; Canvas algorithms load from `src/scenes.ts` after gallery entry or during a returning visitor’s idle time. Local settings and deterministic seed helpers live in `src/core.ts`. The build stamps the service-worker cache and manifest start URL from the emitted shell fingerprint, so each release installs as a distinct worker; navigation is network-first with an offline shell fallback. No analytics or tracking calls are made. `/privacy` and `/terms` are application routes with plain-language policies.

The visual thesis and generated-art provenance are in `.factory/design.md` and `assets/src/tidal-observatory.prompt.json`. The high-resolution PNG is retained as source; the shipped 1200 × 800 AVIF, WebP, and JPEG fallbacks are each under 40 KB.

## Deployment

Deploy the contents of `dist/` as an Azure Static Web App. The repository does not manage infrastructure, DNS, secrets, billing registration, or production deployment.

## License

MIT © 2026 Sociobot (Param Factory). See [LICENSE](LICENSE).
