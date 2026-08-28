# Wallpage

Turn an idle screen into moving art.

Wallpage is for TVs, wall displays, and second monitors that need a calm display. Each moving scene is drawn in the browser without a video stream.

[Try Wallpage with sample data](https://wallpage.sociobot.in/?demo=1). The fixed Moon tide sample uses separate `demo:` storage and can be reset at any time.

The gallery has eight free scenes. Collector adds two scenes for $19 once. Those scenes unlock only after Sociobot verifies a license.

Wallpage has no account, ads, analytics, external fonts, or cross-origin demo traffic. The demo reopens offline after its first visit.

## Run locally

Use Node.js 20 or newer.

```sh
npm install
npm run dev
```

The command prints a local URL. Open `/?demo=1` for the isolated sample.

## Test and build

```sh
npm test
npm run test:claims
npm run test:e2e
npm run check:budget
npm run build
npm run preview
```

`npm run build` type-checks the app and writes the static site to `dist/`. The deploy artifact keeps `index.html` at the root.

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

Visible demo controls have touch targets at least 44 by 44 CSS pixels at 390px width.

## Collector purchase and restore

Copy `.env.example` to `.env.local` to test another public Sociobot configuration. Production uses the committed checkout and verifier URLs in `.env.production`.

The browser sends a restored license only to the Sociobot verifier. A saved browser value cannot unlock Collector without a current positive response.

Payment happens on the Sociobot checkout. Wallpage does not embed a payment provider.

## Architecture and privacy

Wallpage uses Vite and vanilla TypeScript. The browser test suite proves offline reload through the isolated sample.

Read the [privacy policy](https://wallpage.sociobot.in/privacy) and [terms](https://wallpage.sociobot.in/terms). Demo behavior is documented in [.factory/demo.md](.factory/demo.md).

The visual thesis and generated-art provenance are in [.factory/design.md](.factory/design.md). Social and touch images are crops of the same project artwork.

## Deployment

Deploy `dist/` as the configured Azure Static Web App. The repository does not manage infrastructure, DNS, secrets, or billing registration.

## License

MIT © 2026 Sociobot (Param Factory). See [LICENSE](LICENSE).
