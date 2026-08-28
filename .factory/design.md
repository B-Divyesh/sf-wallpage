# Wallpage visual thesis

## Direction — cinematic environmental art

Wallpage should feel like a quiet window into a place that does not exist, not a dashboard placed on top of a canvas. The scene is always the main character. Interface elements borrow the language of a projection-room slate: compact labels, hairline rules, darkened glass, and a single ember-colored cue. Controls retreat after inactivity so the display becomes architecture rather than software.

The product is intentionally dark-only. It is designed for televisions, idle second monitors, and dim rooms; a light theme would interrupt that setting and undermine the OLED-safe dimming model. Legal and help surfaces use the same explicitly painted night treatment.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--night` | `#07100f` | scene fallback and page background |
| `--ink` | `#0c1716` | panels and scrims |
| `--glass` | `rgba(9, 20, 18, .82)` | floating controls |
| `--mist` | `#eef5eb` | primary text (16.7:1 on night) |
| `--lichen` | `#afc2b6` | secondary text (9.8:1 on night) |
| `--ember` | `#ed9b63` | active controls and focus (8.5:1 on night) |
| `--ember-ink` | `#1b0c05` | text on ember |
| `--tide` | `#63b8b1` | cool scene accent and success |
| `--warning` | `#ffd27a` | schedule warnings |
| `--danger` | `#ff8a81` | failures |

Scene palettes stay within nocturnal mineral tones—deep kelp, oxidized copper, moon milk, storm blue—and avoid pure white or large fixed saturated areas. A slowly drifting vignette and per-scene spatial drift reduce static OLED exposure.

## Type

- Display and clock: Georgia, `Times New Roman`, serif. It reads as a film title card and makes time feel editorial rather than instrument-panel-like.
- Utility: system UI (`Inter`-like metrics without a font download). Wide tracking and tabular figures make scene names, seed values, and timings scan from across a room.
- Scale: 12 / 14 / 16 / 20 / clamp(34–72) px. Body copy never falls below 16 px; small uppercase text is limited to nonessential metadata.

No external fonts are loaded. The deliberate system/serif pairing keeps the first render immediate on constrained TV browsers.

## Spacing and composition

An 8 px base rhythm drives `8, 16, 24, 32, 48, 64`. The scene fills the viewport. The identity lockup sits in the upper safe area; time sits in a movable lower corner; the control dock is centered above the lower safe area. All fixed chrome respects `env(safe-area-inset-*)`. Controls are at least 44 px, with 8 px separation. On 390 px screens, labels that repeat obvious icons disappear, the dock wraps, and settings become a full-height sheet.

## Interaction grammar

- Any pointer movement or key press wakes the chrome; 4.5 seconds of inactivity lets it dissolve.
- Left/right or J/K moves between scenes. Space pauses. C toggles the clock. F requests fullscreen. S opens settings. H opens the guide. The remote-friendly dock mirrors these actions.
- Scene changes crossfade through a short dark exposure, like a projector changing reels. Settings rise from the dock and return to it.
- Immediate live-region feedback names each state change without interrupting the scene.

## Motion and thermal policy

Environmental motion is slow, continuous, and non-flashing. The default renderer adapts between 30 and 45 fps based on measured frame cost and device capability, caps device pixel ratio, pauses when the page is hidden, and exposes an explicit pause control. All scene clocks derive from elapsed time, not per-frame increments.

With `prefers-reduced-motion`, Wallpage starts paused, scene transitions become instant opacity changes, and the animated hero preview on the welcome state becomes a still image. The user can still opt into playback. Night dimming applies a scene-level veil; the clock shifts position every minute and all overlay chrome times out to mitigate burn-in.

## Original asset plan

The ten live scenes are original TypeScript/Canvas 2D algorithms. One generated cinematic still acts as the welcome/offline poster and social preview, clarifying the product before animation starts. It depicts a fictional nocturnal tidal observatory with mineral pools and fog, matching the live scene palette but containing no interface or recognizable place.

Prompt (use case `stylized-concept`):

> Asset type: Wallpage welcome poster and social preview. Primary request: a wide cinematic environmental artwork of an impossible nocturnal tidal observatory, seen from a quiet elevated overlook; broad black mineral pools hold delicate luminous current lines, low fog drifts between monolithic basalt forms, and a small distant amber light suggests human scale. Style/medium: premium atmospheric concept art with subtle film grain and restrained detail, neither photoreal tourism nor fantasy spectacle. Composition: 3:2 landscape, deep layered space, central calm negative space, no important details at the extreme edges. Lighting: moonless blue-green ambient light with one muted ember practical light. Palette: deep kelp `#07100f`, storm teal, moon milk, oxidized copper. Materials: wet basalt, fog, dark water, brushed mineral surfaces. Constraints: original fictional environment; no people in foreground; no text, no watermark, no logos, no recognizable brands, no UI, no frame, no bright white fields. Avoid: neon cyberpunk, generic gradients, fantasy castles, star fields, planets, lens flare, high saturation, busy composition.

Generation provenance: generated for Wallpage on 2026-08-27 using the Param Factory Azure image generation deployment via `/opt/fleet/lib/gen-image.sh`. The selected output is project-original; no third-party or copyrighted source imagery is used. Source prompt and generation metadata live beside the source asset in `assets/src/`.

The 1200 × 630 social preview and 180 × 180 touch icon are deterministic crops of that selected original on 2026-08-28. No additional source artwork or third-party asset was introduced.

## Accessibility and fallback states

Canvas visuals are decorative and described by adjacent accessible scene title/description text. Keyboard focus uses a 3 px ember ring plus offset. Status changes are announced politely. Offline operation uses the cached app shell and scenes; the poster is the loading/offline fallback if canvas setup fails. Error copy explains that a lower-motion still mode is available. Contrast is evaluated against the darkest panel treatment, not the shifting canvas.
