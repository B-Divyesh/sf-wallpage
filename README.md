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
npm run preview
```

The production command is exactly `npm run build`. It type-checks the app and writes the static deploy to `dist/`, with `dist/index.html` at the root. Azure Static Web Apps reads `staticwebapp.config.json` from that output.

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

Copy `.env.example` to `.env.local` and supply the deployment-provided Sociobot checkout URL, public product identifier, and license verification endpoint. Product identifiers are deliberately not committed. License keys are sent only to the configured `https://api.sociobot.in/api/v1/...` verifier and are otherwise stored locally in the browser. Payment providers are never embedded directly.

## Architecture and privacy

Wallpage is Vite + vanilla TypeScript. Scene algorithms live in `src/scenes.ts`; local settings and deterministic seed helpers live in `src/core.ts`. A small service worker caches the shell after the first visit. No analytics or tracking calls are made. `/privacy` and `/terms` are application routes with plain-language policies.

The visual thesis and generated-art provenance are in `.factory/design.md` and `assets/src/tidal-observatory.prompt.json`. The high-resolution PNG is retained as source; the shipped WebP is 1200 × 800 and under 300 KB.

## Deployment

Deploy the contents of `dist/` as an Azure Static Web App. The repository does not manage infrastructure, DNS, secrets, billing registration, or production deployment.

## License

MIT © 2026 Sociobot (Param Factory). See [LICENSE](LICENSE).
