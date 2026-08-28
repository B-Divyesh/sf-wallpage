# Wallpage copy audit

Audited 2026-08-28. Counts treat contractions, prices, paths, and hyphenated terms as one word. No sentence exceeds 22 words. No banned marketing word appears. “Unlock” appears only for literal Collector access.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Browser gallery for idle displays | 5 | Pass |
| Turn an idle screen into moving art | 7 | Pass |
| For TVs, wall displays, and second monitors that need a calm display. | 12 | Pass; `tv-display-support` |
| Try it with sample data | 5 | Pass; `demo-sandbox` |
| Opens a running sample scene and its controls. | 8 | Pass |
| Runs in your browser. | 4 | Pass; `local-rendering` |
| No account or ads. | 4 | Pass; `privacy-no-tracking` |
| Eight scenes free; Collector is $19 once. | 7 | Pass; `scene-count`, `collector-license` |

Read-aloud check: “Turn an idle screen into moving art for TVs, wall displays, and second monitors. Try it with sample data.” The job, audience, and first action fit in one breath.

## Remaining landing copy

| Copy | Words | Result |
| --- | ---: | --- |
| Sample scene | 2 | Pass; accurately labels a still image |
| See the gallery before you leave it running | 8 | Pass |
| Moon tide is ready in the sample gallery. | 8 | Pass; `demo-sandbox` |
| Pause it, change scenes, show the clock, or adjust the display. | 11 | Pass |
| Open the Moon tide sample | 5 | Pass |
| Layered tidal contours move beneath a low copper moon. | 9 | Pass |
| Set up an idle display in three steps | 8 | Pass |
| Open a scene. | 3 | Pass |
| Use a TV browser or this tab on a second monitor. | 11 | Pass; `tv-display-support` |
| Set the display. | 3 | Pass |
| Choose rotation, clock, brightness, and night dimming. | 7 | Pass; `display-settings` |
| Leave it running. | 3 | Pass |
| The controls move aside while the scene stays visible. | 9 | Pass; `controls-fade` |
| What Wallpage does not do | 5 | Pass |
| Wallpage has no account, ads, or analytics. | 7 | Pass; `privacy-no-tracking` |
| Display settings stay in this browser. | 6 | Pass; `display-settings` |
| Wallpage contacts Sociobot to check or restore a Collector license. | 10 | Pass; `collector-network` |
| Read the privacy policy | 4 | Pass |
| Add two scenes for $19 once | 6 | Pass; `collector-license` |
| The free gallery has eight scenes. | 6 | Pass; `scene-count` |
| Collector adds Fault garden and Aurora basin after Sociobot verifies the license. | 11 | Pass; `collector-license` |
| Sociobot manages the checkout outside Wallpage. | 6 | Pass; `collector-license` |
| Open checkout — $19 once (external) | 5 | Pass; names action and destination |

## Gallery, dialogs, and states

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 7 | Pass; `demo-sandbox` |
| Wallpage turns idle displays into moving art. | 7 | Pass |
| Offline · the gallery keeps playing | 5 | Pass; `offline-reload` |
| Open today’s gallery | 3 | Pass |
| Change scenes every 1, 5, 15, or 30 minutes. | 8 | Pass; `display-settings` |
| Choose fewer or more frames per second. | 7 | Pass; `display-settings` |
| Dim the scene, not the controls. | 6 | Pass; `display-settings` |
| Keep the calendar below the clock. | 6 | Pass; `display-settings` |
| Dim scenes during these hours. | 5 | Pass; `display-settings` |
| Ask this device to keep the display on. | 8 | Pass; `wake-lock` |
| The screen will stay awake while this scene plays. | 9 | Pass; `wake-lock` |
| Collector · $19 once | 3 | Pass; `collector-license` |
| Paid scenes stay locked until Sociobot verifies the license. | 9 | Pass; `collector-license` |
| Each moving scene is drawn in this browser. | 8 | Pass; `local-rendering` |
| The gallery uses no video stream, account, or ads. | 9 | Pass; `local-rendering`, `privacy-no-tracking` |
| This release is tested in Chromium at 1280 by 720 with keyboard controls. | 12 | Pass; `tv-display-support` |
| To cast, use your browser or device menu. | 8 | Pass; support boundary |
| Casting is not controlled by Wallpage. | 6 | Pass; scope statement |
| The gallery still works when fullscreen is unavailable. | 8 | Pass; `tv-display-support` |
| The controls fade after 4.5 seconds. | 6 | Pass; `controls-fade` |

Scene descriptions use 6–11 words. Status and error sentences use 3–17 words. Legal-page sentences use 5–22 words.

## README

README visitor claims map to `demo-sandbox`, `local-rendering`, `privacy-no-tracking`, `collector-network`, `offline-reload`, `scene-count`, `collector-license`, `display-settings`, `share-scene`, `fullscreen`, `controls-fade`, `keyboard-controls`, `tv-display-support`, `wake-lock`, `touch-targets`, `asset-budgets`, and `build-output`. Browser support is limited to the tested Chromium boundary. Its sentences use 3–22 words. Contributor commands and architecture statements describe repository mechanics.

## Terminology

| Concept | Required term |
| --- | --- |
| One moving visual | scene |
| The collection | gallery |
| TV, wall display, or spare monitor use | idle display |
| Browser-wide viewing mode | fullscreen |
| Paid two-scene license | Collector |
| Fixed test state | demo |
| Deterministic input shown only when needed | scene setting |
| Preventing device display sleep | Keep screen awake |
