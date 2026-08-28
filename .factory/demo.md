# Wallpage demo sandbox

## Entry point

Open `https://wallpage.sociobot.in/?demo=1`. `/demo` is an equivalent direct route.

The landing page links to this mode with **Try it with sample data**. It opens Moon tide immediately with the fixed scene setting `sample-moon-tide-2042`.

## Isolation and reset

Demo preferences use only `localStorage["demo:wallpage:settings"]`. Demo mode does not read, write, or delete `wallpage:settings`, `wallpage:collector`, or `sb_license:wallpage`.

**Reset demo** deletes every `demo:` key and reloads the fixed Moon tide sample. **Start for real** deletes every `demo:` key before opening the normal gallery. Collector purchase and restore controls stay disabled in demo mode.

## Verification

Run `npm run test:claims`. The claim tests enter through `?demo=1`, exercise the sample, check storage and network isolation, and verify offline reload.
