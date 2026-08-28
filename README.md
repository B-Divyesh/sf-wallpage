# Wallpage

Turn an idle screen into moving art.

Wallpage is for TVs, wall displays, and second monitors that need a calm display. Each moving scene is drawn in the browser without a video stream.

[Try Wallpage with sample data](https://wallpage.sociobot.in/demo). The Moon tide sample uses separate browser storage. You can reset it at any time.

The gallery has eight free scenes. Collector adds two scenes for $19 once. Those scenes unlock only after Sociobot verifies a license.

The demo contacts only wallpage.sociobot.in. It has no account, ads, analytics, or downloaded fonts. The demo reopens offline after its first visit and keeps drawing its scene.

## Run locally

Use Node.js 20 or newer.

```sh
npm install
npm run dev
```

The command prints a local URL. Open `/demo` for the isolated sample.

## Test and build

```sh
npm test
npm run test:claims
npm run test:e2e
npm run check:budget
npm run build
npm run preview
```

`npm run build` type-checks the app and writes the static site to `dist/`. The deploy folder contains `dist/index.html`.

The budget check caps initial JavaScript at 200 KB. It caps CSS files at 50 KB and scene images at 300 KB each.

## Controls

- `←` or `J`: previous scene
- `→` or `K`: next scene
- `Space`: pause or play
- `C`: show or hide the clock
- `F`: enter or leave fullscreen
- `S`: open display settings
- `H`: open the guide

These keyboard shortcuts change scenes, playback, the clock, settings, and the guide. Gallery controls fade after 4.5 seconds and return on pointer movement.

The Share control creates a link for the current scene and seed. The fullscreen button and `F` key enter or leave fullscreen when the browser supports it.

Display settings control rotation, clock, date, brightness, night dimming, and the animation frame-rate cap. Keep screen awake asks a supported device to prevent display sleep while a scene plays.

Visible demo controls have touch targets at least 44 by 44 CSS pixels at 390px width.

## Display support

Wallpage is tested in Chromium at a 1280 by 720 TV-like viewport with keyboard-only controls. The gallery remains usable when fullscreen or Screen Wake Lock is unavailable.

Casting comes from your browser or device menu. Wallpage does not control or promise support for a specific casting device.

## Collector purchase and restore

Copy `.env.example` to `.env.local` to test another public Sociobot configuration. Production uses the committed checkout and verifier URLs in `.env.production`.

Without a saved license, opening the gallery does not contact the verifier. Wallpage sends a saved or entered license only to the Sociobot verifier. Collector unlocks only when Sociobot confirms the saved license is active.

Payment happens on the Sociobot checkout. Wallpage does not embed a payment provider.

## Architecture and privacy

Wallpage uses Vite and vanilla TypeScript. The browser test suite proves offline reload through the isolated sample.

Read the [privacy policy](https://wallpage.sociobot.in/privacy) and [terms](https://wallpage.sociobot.in/terms). Demo behavior is documented in [.factory/demo.md](.factory/demo.md).

The visual thesis and generated-art provenance are in [.factory/design.md](.factory/design.md).

## Deployment

Deploy `dist/` as the configured Azure Static Web App. The repository does not manage infrastructure, DNS, secrets, or billing registration.

## License

MIT © 2026 Sociobot (Param Factory). See [LICENSE](LICENSE).
