import './style.css';
import { defaultSettings, isWithinNightSchedule, readSettings, seedOfDay } from './core';
import { LICENSE_STORAGE_KEY, type EntitlementReason, verifyEntitlement } from './entitlement';
import { scenes } from './scene-catalog';
import type { SceneRenderer } from './scenes';

const app = document.querySelector<HTMLDivElement>('#app')!;
const BUILD_LABEL = 'v1.1.0 · repair 1';
const DEMO_SETTINGS_KEY = 'demo:wallpage:settings';
const DEMO_SEED = 'sample-moon-tide-2042';
const SITE_ORIGIN = 'https://wallpage.sociobot.in';

function clearDemoData() {
  // Demo state has its own namespace. Remove every key in that namespace so
  // changing the sample never follows a visitor into their real gallery.
  Object.keys(localStorage).filter((key) => key.startsWith('demo:')).forEach((key) => localStorage.removeItem(key));
}

function setMetadata(title: string, description: string, canonical: string) {
  document.title = title;
  const values: Record<string, string> = {
    'meta[name="description"]': description,
    'meta[property="og:title"]': title,
    'meta[property="og:description"]': description,
    'meta[name="twitter:title"]': title,
    'meta[name="twitter:description"]': description,
  };
  Object.entries(values).forEach(([selector, value]) => document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value));
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `${SITE_ORIGIN}${canonical}`);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', `${SITE_ORIGIN}${canonical}`);
}

function routeFocus() {
  requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('main h1');
    heading?.focus({ preventScroll: true });
    const status = document.querySelector<HTMLElement>('#route-status');
    if (status && heading) status.textContent = heading.textContent ?? '';
  });
}

function siteHeader() {
  return `<header class="site-header"><a class="wordmark" href="/" aria-label="Wallpage home"><span></span>Wallpage</a><nav aria-label="Main navigation"><a href="/?demo=1">Demo</a><a href="/?gallery=1">Gallery</a><a href="/privacy">Privacy</a></nav></header>`;
}

function siteFooter(className = 'site-footer') {
  return `<footer class="${className}"><p>Wallpage turns idle displays into moving art.</p><nav aria-label="Footer navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav><p>Built by Param Factory · ${BUILD_LABEL}</p></footer>`;
}

const icon = (name: 'previous' | 'next' | 'pause' | 'play' | 'clock' | 'share' | 'expand' | 'settings' | 'close' | 'grid') => {
  const paths: Record<typeof name, string> = {
    previous: '<path d="m15 18-6-6 6-6"/>',
    next: '<path d="m9 18 6-6-6-6"/>',
    pause: '<path d="M9 6v12M15 6v12"/>',
    play: '<path d="m9 6 9 6-9 6Z"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/>',
    expand: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    grid: '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
};

function renderLegal(path: string) {
  const privacy = path === '/privacy' || path === '/privacy/';
  setMetadata(
    `${privacy ? 'Privacy' : 'Terms'} — Wallpage`,
    privacy ? 'How Wallpage stores display settings and handles Collector license checks.' : 'Terms for using the Wallpage browser gallery and Collector scenes.',
    privacy ? '/privacy' : '/terms',
  );
  app.innerHTML = `
    <div class="legal-shell">
      ${siteHeader()}
      <main id="main" class="legal-copy">
        <p class="eyebrow">Plain-language policy · 28 August 2026</p>
        <h1 tabindex="-1">${privacy ? 'Privacy on your idle display' : 'Terms for using Wallpage'}</h1>
        ${privacy ? `
          <h2>What stays on this device</h2><p>Your display settings stay in this browser. Demo settings use a separate temporary storage key.</p><p>Wallpage has no accounts, ads, analytics, or tracking cookies.</p>
          <h2>When Wallpage uses the network</h2><p>Gallery files come from Wallpage. Restoring Collector sends the license key to the Sociobot verifier.</p><p>Collector checkout opens on Sociobot, outside Wallpage.</p>
          <h2>Delete your data</h2><p>Use “Reset local data” in Display settings. In demo mode, use “Reset demo.” You can also clear this site’s browser data.</p><p>Questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>
        ` : `
          <h2>Using Wallpage</h2><p>Wallpage is provided as a browser-based ambient display. You may use it personally or in a workplace display. Do not resell the service, interfere with its operation, or represent its generative scenes as your own downloadable collection.</p>
          <h2>Collector access</h2><p>Collector costs $19 once and adds two scenes. Sociobot sells and verifies the license.</p><p>Collector scenes unlock only after the verifier confirms an active license. They stay locked while offline or when verification fails.</p>
          <h2>Availability</h2><p>The service and its generated visuals are provided “as is.” We may improve or replace individual scene algorithms while preserving access to the core gallery. Wallpage is visual ambience, not a time-critical clock or safety display.</p>
        `}
        <p><a class="text-link" href="/">← Return to Wallpage</a></p>
      </main>
      ${siteFooter('legal-footer')}
      <div id="route-status" class="sr-only" aria-live="polite"></div>
    </div>`;
  routeFocus();
}

function renderNotFound() {
  setMetadata('Page not found — Wallpage', 'This Wallpage address does not exist. Return to the gallery.', '/404');
  app.innerHTML = `<div class="legal-shell not-found">${siteHeader()}<main id="main" class="legal-copy"><p class="eyebrow">404 · Lost scene</p><h1 tabindex="-1">This page was not found</h1><p>The address does not lead to a Wallpage scene or guide.</p><p><a class="primary-button" href="/">Return to Wallpage</a></p></main>${siteFooter('legal-footer')}<div id="route-status" class="sr-only" aria-live="polite"></div></div>`;
  routeFocus();
}

function renderLanding() {
  setMetadata('Wallpage — moving art for idle screens', 'Turn a TV, wall display, or second monitor into a calm gallery of moving browser scenes.', '/');
  app.innerHTML = `<div class="landing-shell">
    ${siteHeader()}
    <main id="main">
      <section class="landing-hero" aria-labelledby="landing-title">
        <div class="hero-art"><picture><source srcset="/assets/tidal-observatory.avif" type="image/avif"><source srcset="/assets/tidal-observatory.webp" type="image/webp"><img src="/assets/tidal-observatory.jpg" width="1200" height="800" alt="A fictional tidal observatory with dark mineral pools and low fog" decoding="async" fetchpriority="high"></picture></div>
        <div class="hero-copy"><p class="eyebrow">Browser gallery for idle displays</p><h1 id="landing-title" tabindex="-1">Turn an idle screen into moving art</h1><p class="hero-support">For TVs, wall displays, and second monitors that need a calm display.</p><div class="hero-actions"><a class="primary-button" href="/?demo=1">Try it with sample data</a><span>Opens a running sample scene and its controls.</span></div><ul class="plain-facts"><li>Runs in your browser.</li><li>No account or ads.</li><li>Eight scenes free; Collector is $19 once.</li></ul></div>
      </section>
      <section class="landing-section preview-section" aria-labelledby="preview-title"><div><p class="eyebrow">Live preview</p><h2 id="preview-title">See the gallery before you leave it running</h2><p>Moon tide is ready in the sample gallery. Pause it, change scenes, show the clock, or adjust the display.</p><a class="text-link" href="/?demo=1">Open the Moon tide sample →</a></div><div class="preview-slate" role="img" aria-label="Preview of the Moon tide scene"><span>02 / 10</span><strong>Moon tide</strong><small>Layered tidal contours move beneath a low copper moon.</small></div></section>
      <section class="landing-section" aria-labelledby="works-title"><p class="eyebrow">How it works</p><h2 id="works-title">Set up an idle display in three steps</h2><ol class="steps"><li><strong>Open a scene.</strong><span>Use a TV browser or this tab on a second monitor.</span></li><li><strong>Set the display.</strong><span>Choose rotation, clock, brightness, and night dimming.</span></li><li><strong>Leave it running.</strong><span>The controls move aside while the scene stays visible.</span></li></ol></section>
      <section class="landing-section split-section"><div><p class="eyebrow">Privacy</p><h2>What Wallpage does not do</h2><p>Wallpage has no account, ads, or analytics. Display settings stay in this browser. A Collector license contacts Sociobot only when you restore it.</p><a class="text-link" href="/privacy">Read the privacy policy →</a></div><div><p class="eyebrow">Optional Collector</p><h2>Add two scenes for $19 once</h2><p>The free gallery has eight scenes. Collector adds Fault garden and Aurora basin after Sociobot verifies the license.</p><a class="secondary-button" href="https://api.sociobot.in/api/v1/products/wallpage/checkout" rel="noreferrer">See the $19 Collector price</a></div></section>
    </main>
    ${siteFooter()}
    <div id="route-status" class="sr-only" aria-live="polite"></div>
  </div>`;
  routeFocus();
}

const queryAtLoad = new URLSearchParams(location.search);
const isDemoRoute = location.pathname === '/demo' || (location.pathname === '/' && queryAtLoad.get('demo') === '1');
const isGalleryRoute = location.pathname === '/' && (queryAtLoad.has('gallery') || queryAtLoad.has('scene') || queryAtLoad.has('seed'));

if (/^\/(privacy|terms)\/?$/.test(location.pathname)) renderLegal(location.pathname);
else if (isDemoRoute || isGalleryRoute) renderGallery(isDemoRoute);
else if (location.pathname === '/' || location.pathname === '') renderLanding();
else renderNotFound();

addEventListener('pageshow', () => routeFocus());

function renderGallery(demoMode = false) {
  setMetadata(demoMode ? 'Demo — Wallpage' : 'Gallery — Wallpage', demoMode ? 'Try a fixed Moon tide sample without changing your Wallpage settings.' : 'Run Wallpage scenes on a TV, wall display, or second monitor.', demoMode ? '/?demo=1' : '/');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const settingsKey = demoMode ? DEMO_SETTINGS_KEY : 'wallpage:settings';
  let settings = readSettings(window.localStorage, settingsKey);
  if (demoMode) settings = { ...defaultSettings, ...settings, seenWelcome: true, rotationMinutes: 0 };
  // A writable browser value is never an entitlement. It may retain a license
  // token for restore, but every app session starts locked until Sociobot says
  // that token is valid for this product.
  if (!demoMode) localStorage.removeItem('wallpage:collector');
  let collectorUnlocked = false;
  let collectorReason: EntitlementReason | 'idle' | 'checking' = 'idle';
  let paused = reducedMotion || (!demoMode && !settings.seenWelcome);
  let activeIndex = demoMode ? scenes.findIndex((scene) => scene.id === 'moon-tide') : 0;
  let rotationTimer = 0;
  let chromeTimer = 0;
  let lastClockMinute = -1;

  const query = new URLSearchParams(location.search);
  const licenseFromReturn = demoMode ? undefined : query.get('license')?.trim();
  if (!demoMode && licenseFromReturn) {
    localStorage.setItem(LICENSE_STORAGE_KEY, licenseFromReturn);
    query.delete('license');
    const cleanUrl = new URL(location.href);
    cleanUrl.search = query.toString();
    history.replaceState({}, '', cleanUrl);
  }
  const seed = demoMode ? DEMO_SEED : query.get('seed')?.slice(0, 80) || seedOfDay();
  const requestedScene = demoMode ? query.get('scene') || 'moon-tide' : query.get('scene');
  const requestedIndex = scenes.findIndex((scene) => scene.id === requestedScene);
  if (requestedIndex >= 0 && (!scenes[requestedIndex].collector || collectorUnlocked)) activeIndex = requestedIndex;

  app.innerHTML = `
    <main id="main" class="gallery ${demoMode ? 'demo-gallery' : ''}" data-chrome="visible">
      <h1 class="sr-only" tabindex="-1">${demoMode ? 'Watch a sample scene on your idle display' : 'Turn an idle screen into moving art'}</h1>
      <canvas id="scene" aria-hidden="true"></canvas>
      <div class="scene-fallback" role="img" aria-label="A dark tidal observatory in blue-green fog"></div>
      <div class="dim-layer" aria-hidden="true"></div>
      <header class="masthead chrome">
        <a class="wordmark" href="/" aria-label="Wallpage home"><span></span>Wallpage</a>
        <nav class="gallery-nav" aria-label="Gallery navigation"><button class="button-reset nav-button" id="open-help">Guide</button><a href="/?demo=1">Demo</a><a href="/privacy">Privacy</a><p><span id="scene-number">01</span> / <span id="scene-count">${scenes.length.toString().padStart(2, '0')}</span></p></nav>
      </header>
      <section class="scene-caption chrome" aria-live="polite" aria-atomic="true">
        <p class="eyebrow" id="scene-kind">${demoMode ? 'Sample scene setting' : 'Today’s scene setting'} · ${escapeText(seed)}</p>
        <h2 id="scene-title">${scenes[activeIndex].title}</h2>
        <p id="scene-description">${scenes[activeIndex].description}</p>
      </section>
      <div class="clock" id="clock" aria-label="Current time">
        <time id="clock-time"></time>
        <time id="clock-date"></time>
      </div>
      <nav class="control-dock chrome" aria-label="Scene controls">
        <button id="previous" class="icon-button" aria-label="Previous scene">${icon('previous')}</button>
        <button id="library" class="scene-button" aria-label="Open scene library"><span id="dock-index">01</span><span class="dock-title" id="dock-title">Brackish drift</span>${icon('grid')}</button>
        <button id="next" class="icon-button" aria-label="Next scene">${icon('next')}</button>
        <span class="dock-rule" aria-hidden="true"></span>
        <button id="pause" class="icon-button" aria-label="${paused ? 'Play animation' : 'Pause animation'}">${icon(paused ? 'play' : 'pause')}</button>
        <button id="clock-toggle" class="icon-button" aria-label="Hide clock" aria-pressed="${settings.clock}">${icon('clock')}</button>
        <button id="share" class="icon-button" aria-label="Share this scene">${icon('share')}</button>
        <button id="fullscreen" class="icon-button" aria-label="Enter fullscreen">${icon('expand')}</button>
        <button id="settings" class="icon-button" aria-label="Open settings">${icon('settings')}</button>
      </nav>
      <footer class="corner-footer chrome"><span>This scene runs in your browser.</span><a href="/privacy">Privacy</a><a href="/terms">Terms</a><span>Param Factory · ${BUILD_LABEL}</span></footer>
      ${demoMode ? '<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><button type="button" id="reset-demo">Reset demo</button><a href="/?gallery=1" id="start-real">Start for real</a></aside>' : ''}
      <div class="connection" id="connection" role="status" hidden>Offline · the gallery keeps playing</div>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
      <div id="route-status" class="sr-only" aria-live="polite"></div>
    </main>

    <dialog id="welcome" class="welcome-dialog" aria-labelledby="welcome-title">
      <div class="welcome-art"><picture><source srcset="/assets/tidal-observatory.avif" type="image/avif"><source srcset="/assets/tidal-observatory.webp" type="image/webp"><img src="/assets/tidal-observatory.jpg" width="900" height="600" alt="A fictional tidal observatory of dark mineral pools, luminous currents, and low fog" decoding="async" fetchpriority="high"></picture></div>
      <div class="welcome-copy">
        <p class="eyebrow">Browser gallery for idle displays</p>
        <h2 id="welcome-title">Turn an idle screen into moving art</h2>
        <p>For TVs, wall displays, and second monitors that need a calm display.</p>
        <ul><li><kbd>←</kbd> <kbd>→</kbd> change scene</li><li><kbd>Space</kbd> pause</li><li><kbd>C</kbd> clock</li><li><kbd>F</kbd> fullscreen</li></ul>
        <button id="enter-gallery" class="primary-button">Open today’s gallery <span aria-hidden="true">→</span></button>
        <p class="generated-note">The still artwork was generated for Wallpage. Provenance is in the project design notes.</p>
      </div>
    </dialog>

    <dialog id="library-dialog" class="panel-dialog" aria-labelledby="library-title">
      <div class="dialog-heading"><div><p class="eyebrow">The gallery</p><h2 id="library-title">Choose a scene</h2></div><button class="icon-button close-dialog" aria-label="Close scene library">${icon('close')}</button></div>
      <div class="scene-grid" id="scene-grid"></div>
    </dialog>

    <dialog id="settings-dialog" class="panel-dialog settings-dialog" aria-labelledby="settings-title">
      <form method="dialog" id="settings-form">
        <div class="dialog-heading"><div><p class="eyebrow">Display settings</p><h2 id="settings-title">Adjust the idle display</h2></div><button class="icon-button close-dialog" aria-label="Close settings">${icon('close')}</button></div>
        <div class="setting-row"><div><label for="rotation">Auto-rotate</label><p>Change scenes every 1, 5, 15, or 30 minutes.</p></div><select id="rotation"><option value="0">Off</option><option value="1">Every minute</option><option value="5">Every 5 minutes</option><option value="15">Every 15 minutes</option><option value="30">Every 30 minutes</option></select></div>
        <div class="setting-row"><div><label for="quality">Motion quality</label><p>Choose fewer or more frames per second.</p></div><select id="quality"><option value="24">Eco · 24 fps</option><option value="30">Balanced · 30 fps</option><option value="45">Smooth · 45 fps</option></select></div>
        <div class="setting-row"><div><label for="brightness">Scene brightness</label><p>Dim the scene, not the controls.</p></div><input id="brightness" type="range" min="35" max="100" step="5"></div>
        <div class="setting-row"><div><label for="date-toggle">Show date</label><p>Keep the calendar below the clock.</p></div><input id="date-toggle" class="switch" type="checkbox"></div>
        <div class="setting-row"><div><label for="night-dim">Dim at night</label><p>Dim scenes during these hours.</p></div><input id="night-dim" class="switch" type="checkbox"></div>
        <div class="time-pair"><label>Dim from <input id="dim-start" type="time"></label><label>Until <input id="dim-end" type="time"></label></div>
        <section class="collector-panel" aria-labelledby="collector-heading"><p class="eyebrow">Optional</p><h3 id="collector-heading">Collector · $19 once</h3><p id="collector-status">Add Fault garden and Aurora basin. Paid scenes stay locked until Sociobot verifies the license.</p><div class="license-actions"><a class="secondary-button" id="buy-collector" target="_blank" rel="noreferrer">See the $19 Collector price</a><button class="secondary-button" type="button" id="show-license">Restore Collector license</button></div><div class="license-form" id="license-form" hidden><label for="license-key">License key</label><div><input id="license-key" autocomplete="off" spellcheck="false" aria-describedby="license-message"><button class="primary-button" type="button" id="verify-license">Verify license</button></div><p id="license-message" role="status" aria-live="polite"></p></div></section>
        <button class="text-button danger-button" type="button" id="reset-data">${demoMode ? 'Reset demo settings' : 'Reset local data'}</button>
      </form>
    </dialog>

    <dialog id="help-dialog" class="panel-dialog help-dialog" aria-labelledby="help-title">
      <div class="dialog-heading"><div><p class="eyebrow">Wallpage guide</p><h2 id="help-title">Use Wallpage on a larger screen</h2></div><button class="icon-button close-dialog" aria-label="Close guide">${icon('close')}</button></div>
      <div class="help-layout"><picture><source srcset="/assets/tidal-observatory.avif" type="image/avif"><source srcset="/assets/tidal-observatory.webp" type="image/webp"><img src="/assets/tidal-observatory.jpg" width="900" height="600" alt="The fictional tidal observatory artwork made for Wallpage" decoding="async" loading="lazy"></picture><div><p>Each moving scene is drawn in this browser. The gallery uses no video stream, account, or ads.</p><h3>Put it on a larger screen</h3><ol><li>Open this page in a TV browser, or cast this tab from your browser menu.</li><li>Press <kbd>F</kbd> or the expand button for fullscreen.</li><li>Move the pointer away. The controls fade after 4.5 seconds.</li></ol><h3>Show it on an idle display</h3><p>Keep this browser tab open on a TV, wall display, or second monitor.</p><h3>Keyboard and remote controls</h3><p><kbd>←</kbd>/<kbd>J</kbd> previous · <kbd>→</kbd>/<kbd>K</kbd> next · <kbd>Space</kbd> pause · <kbd>C</kbd> clock · <kbd>S</kbd> settings · <kbd>H</kbd> guide.</p></div></div>
    </dialog>`;

  const canvas = document.querySelector<HTMLCanvasElement>('#scene')!;
  const gallery = document.querySelector<HTMLElement>('.gallery')!;
  const clock = document.querySelector<HTMLElement>('#clock')!;
  const toast = document.querySelector<HTMLElement>('#toast')!;
  const welcome = document.querySelector<HTMLDialogElement>('#welcome')!;
  const libraryDialog = document.querySelector<HTMLDialogElement>('#library-dialog')!;
  const settingsDialog = document.querySelector<HTMLDialogElement>('#settings-dialog')!;
  const helpDialog = document.querySelector<HTMLDialogElement>('#help-dialog')!;
  const sceneGrid = document.querySelector<HTMLElement>('#scene-grid')!;
  gallery.classList.toggle('poster-mode', reducedMotion);
  let renderer: SceneRenderer | null = null;
  let rendererLoading: Promise<SceneRenderer | null> | null = null;

  function startRenderer() {
    if (renderer) return Promise.resolve(renderer);
    if (rendererLoading) return rendererLoading;
    // Canvas algorithms are intentionally not parsed or run while the
    // welcome/poster has focus. This turns the first view into a small,
    // paintable shell and reserves expensive drawing for an explicit gallery
    // entry or a later idle opportunity for returning visitors.
    rendererLoading = import('./scenes').then(({ SceneRenderer: CanvasRenderer }) => {
      const next = new CanvasRenderer(canvas);
      next.setMaxFps(settings.maxFps);
      next.setPaused(paused);
      next.setScene(scenes[activeIndex].id, seed);
      next.start();
      renderer = next;
      return next;
    }).catch(() => {
      gallery.classList.add('canvas-error');
      showToast('Live canvas is unavailable. Showing the still environment instead.');
      return null;
    });
    return rendererLoading;
  }

  function startRendererWhenIdle() {
    const begin = () => { void startRenderer(); };
    if ('requestIdleCallback' in window) window.requestIdleCallback(begin, { timeout: 2500 });
    else setTimeout(begin, 250);
  }

  function showModal(dialog: HTMLDialogElement) {
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    gallery.dataset.chrome = 'visible';
  }
  function closeModal(dialog: HTMLDialogElement) {
    if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
  }
  function isDialogOpen() { return Boolean(document.querySelector('dialog[open]')); }

  function showToast(message: string) {
    toast.replaceChildren();
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  function showUpdateToast(worker: ServiceWorker, onUpdate: () => void) {
    toast.replaceChildren();
    const text = document.createElement('span');
    text.textContent = 'A new Wallpage release is ready.';
    const reload = document.createElement('button');
    reload.type = 'button';
    reload.className = 'toast-action';
    reload.textContent = 'Update';
    reload.addEventListener('click', () => { onUpdate(); worker.postMessage({ type: 'SKIP_WAITING' }); }, { once: true });
    toast.append(text, reload);
    toast.classList.add('is-visible');
  }

  function availableScenes() { return scenes.filter((scene) => !scene.collector || collectorUnlocked); }

  function saveSettings() {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    applySettings();
  }

  function applySettings() {
    clock.hidden = !settings.clock;
    document.querySelector<HTMLElement>('#clock-date')!.hidden = !settings.date;
    gallery.style.setProperty('--scene-brightness', String(settings.brightness));
    gallery.classList.toggle('night-dimmed', settings.nightDim && isWithinNightSchedule(new Date(), settings.dimStart, settings.dimEnd));
    renderer?.setMaxFps(settings.maxFps);
    const clockButton = document.querySelector<HTMLButtonElement>('#clock-toggle')!;
    clockButton.setAttribute('aria-pressed', String(settings.clock));
    clockButton.setAttribute('aria-label', `${settings.clock ? 'Hide' : 'Show'} clock`);
    scheduleRotation();
  }

  function scheduleRotation() {
    window.clearInterval(rotationTimer);
    if (settings.rotationMinutes > 0) {
      rotationTimer = window.setInterval(() => changeScene(1), settings.rotationMinutes * 60_000);
    }
  }

  function drawSceneGrid() {
    sceneGrid.innerHTML = scenes.map((scene, index) => {
      const locked = Boolean(scene.collector && !collectorUnlocked);
      return `<button class="scene-card ${index === activeIndex ? 'active' : ''}" data-scene="${scene.id}" ${locked ? 'data-locked="true"' : ''} aria-label="${locked ? 'Locked Collector scene: ' : ''}${scene.title}" aria-current="${index === activeIndex ? 'true' : 'false'}"><span>${scene.index}</span><strong>${scene.title}</strong><small>${locked ? 'Collector · locked' : scene.description}</small></button>`;
    }).join('');
  }

  function setScene(index: number) {
    const scene = scenes[index];
    if (!scene || (scene.collector && !collectorUnlocked)) return;
    activeIndex = index;
    document.querySelector('#scene-number')!.textContent = scene.index;
    document.querySelector('#dock-index')!.textContent = scene.index;
    document.querySelector('#dock-title')!.textContent = scene.title;
    document.querySelector('#scene-title')!.textContent = scene.title;
    document.querySelector('#scene-description')!.textContent = scene.description;
    renderer?.setScene(scene.id, seed);
    gallery.classList.remove('scene-change');
    requestAnimationFrame(() => gallery.classList.add('scene-change'));
    const nextUrl = new URL(location.href);
    nextUrl.searchParams.set('scene', scene.id);
    if (query.has('seed')) nextUrl.searchParams.set('seed', seed); else nextUrl.searchParams.delete('seed');
    history.replaceState({}, '', nextUrl);
    drawSceneGrid();
  }

  function changeScene(direction: number) {
    const available = availableScenes();
    const current = available.findIndex((scene) => scene.id === scenes[activeIndex].id);
    const target = available[(current + direction + available.length) % available.length];
    setScene(scenes.findIndex((scene) => scene.id === target.id));
  }

  function togglePause() {
    paused = !paused;
    renderer?.setPaused(paused);
    const button = document.querySelector<HTMLButtonElement>('#pause')!;
    button.innerHTML = icon(paused ? 'play' : 'pause');
    button.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    showToast(paused ? 'Scene paused' : 'Scene playing');
  }

  function toggleClock() {
    settings.clock = !settings.clock;
    saveSettings();
    showToast(settings.clock ? 'Clock shown' : 'Clock hidden');
  }

  function wakeChrome() {
    gallery.dataset.chrome = 'visible';
    window.clearTimeout(chromeTimer);
    if (!paused && !isDialogOpen()) chromeTimer = window.setTimeout(() => { gallery.dataset.chrome = 'hidden'; }, 4500);
  }

  function updateClock() {
    const now = new Date();
    document.querySelector<HTMLTimeElement>('#clock-time')!.textContent = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(now);
    document.querySelector<HTMLTimeElement>('#clock-time')!.dateTime = now.toISOString();
    document.querySelector<HTMLTimeElement>('#clock-date')!.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(now);
    if (now.getMinutes() !== lastClockMinute) {
      lastClockMinute = now.getMinutes();
      clock.style.setProperty('--drift-x', `${((now.getMinutes() * 17) % 25) - 12}px`);
      clock.style.setProperty('--drift-y', `${((now.getMinutes() * 11) % 17) - 8}px`);
      applySettings();
    }
  }

  async function shareScene() {
    const shareUrl = new URL(location.href);
    shareUrl.searchParams.set('seed', seed);
    shareUrl.searchParams.set('scene', scenes[activeIndex].id);
    try {
      if (navigator.share) await navigator.share({ title: `${scenes[activeIndex].title} — Wallpage`, text: `Watch the ${scenes[activeIndex].title} scene.`, url: shareUrl.toString() });
      else {
        await navigator.clipboard.writeText(shareUrl.toString());
        showToast('Scene link copied');
      }
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') showToast('Could not share. Copy the address from your browser.');
    }
  }

  function populateSettings() {
    document.querySelector<HTMLSelectElement>('#rotation')!.value = String(settings.rotationMinutes);
    document.querySelector<HTMLSelectElement>('#quality')!.value = String(settings.maxFps);
    document.querySelector<HTMLInputElement>('#brightness')!.value = String(Math.round(settings.brightness * 100));
    document.querySelector<HTMLInputElement>('#date-toggle')!.checked = settings.date;
    document.querySelector<HTMLInputElement>('#night-dim')!.checked = settings.nightDim;
    document.querySelector<HTMLInputElement>('#dim-start')!.value = settings.dimStart;
    document.querySelector<HTMLInputElement>('#dim-end')!.value = settings.dimEnd;
    updateCollectorPanel();
  }

  function updateCollectorPanel() {
    const status = document.querySelector<HTMLElement>('#collector-status')!;
    const buy = document.querySelector<HTMLAnchorElement>('#buy-collector')!;
    const showLicense = document.querySelector<HTMLButtonElement>('#show-license')!;
    const buyUrl = import.meta.env.VITE_SOCIOBOT_BUY_URL;
    if (demoMode) {
      status.textContent = 'Collector stays locked in demo mode. Start for real to buy or restore a license.';
      buy.hidden = true;
      showLicense.hidden = true;
    } else if (collectorUnlocked) {
      status.textContent = 'Collector is active for this session. All ten scenes are available.';
      buy.hidden = true;
      showLicense.hidden = true;
    } else {
      buy.hidden = !buyUrl;
      if (buyUrl) buy.href = buyUrl;
      showLicense.hidden = false;
      const messages: Record<typeof collectorReason, string> = {
        idle: buyUrl ? 'Add Fault garden and Aurora basin for $19 once. Paid scenes stay locked until Sociobot verifies the license.' : 'Collector checkout is not configured here. An existing license can be checked when a verifier is configured.',
        checking: 'Checking the saved license with Sociobot. Paid scenes remain locked until it is confirmed.',
        offline: 'You are offline, so Collector cannot be confirmed. Paid scenes stay locked; reconnect to verify.',
        expired: 'This license has expired and Collector is no longer active. Paid scenes stay locked.',
        revoked: 'This license is no longer active. Paid scenes stay locked.',
        wrong_product: 'This license belongs to a different product. Paid scenes stay locked.',
        invalid: 'That license could not be verified. Paid scenes stay locked.',
        error: 'Collector could not be confirmed right now. Paid scenes stay locked; please try again.',
        unconfigured: 'License verification is not configured on this deployment. Paid scenes stay locked.',
        ok: 'Collector is awaiting verification.',
      };
      status.textContent = messages[collectorReason];
    }
  }

  async function verifyLicense(license = document.querySelector<HTMLInputElement>('#license-key')!.value.trim()) {
    const keyInput = document.querySelector<HTMLInputElement>('#license-key')!;
    const message = document.querySelector<HTMLElement>('#license-message')!;
    const button = document.querySelector<HTMLButtonElement>('#verify-license')!;
    const endpoint = import.meta.env.VITE_SOCIOBOT_LICENSE_VERIFY_URL;
    if (license.length < 6) {
      message.textContent = 'Enter the license key from your receipt.';
      keyInput.focus();
      return;
    }
    button.disabled = true;
    button.textContent = 'Checking…';
    collectorUnlocked = false;
    collectorReason = 'checking';
    updateCollectorPanel();
    const verdict = await verifyEntitlement(license, endpoint);
    collectorReason = verdict.reason;
    if (verdict.valid) {
      localStorage.setItem(LICENSE_STORAGE_KEY, license);
      collectorUnlocked = true;
      message.textContent = 'Collector unlocked. Thank you.';
      showToast('Collector verified. All ten scenes are available.');
    } else {
      // Do not turn an unverified value into a persistent bypass. A previously
      // saved token is removed only when the server explicitly rejects it.
      if (['invalid', 'expired', 'revoked', 'wrong_product'].includes(verdict.reason)) localStorage.removeItem(LICENSE_STORAGE_KEY);
      const messages: Record<EntitlementReason, string> = {
        ok: 'Collector is active.',
        invalid: 'That key is not active. Check the license from your receipt.',
        expired: 'That license has expired and cannot unlock Collector.',
        revoked: 'That license is no longer active.',
        wrong_product: 'That license is for a different product.',
        offline: 'You are offline. Reconnect before Collector can be unlocked.',
        error: 'The verifier could not confirm this key. Try again shortly.',
        unconfigured: 'License verification is not configured on this deployment.',
      };
      message.textContent = messages[verdict.reason];
    }
    updateCollectorPanel();
    drawSceneGrid();
    button.disabled = false;
    button.textContent = 'Verify license';
  }

  document.querySelector('#previous')!.addEventListener('click', () => changeScene(-1));
  document.querySelector('#next')!.addEventListener('click', () => changeScene(1));
  document.querySelector('#pause')!.addEventListener('click', togglePause);
  document.querySelector('#clock-toggle')!.addEventListener('click', toggleClock);
  document.querySelector('#share')!.addEventListener('click', shareScene);
  document.querySelector('#fullscreen')!.addEventListener('click', async () => {
    try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen(); }
    catch { showToast('Fullscreen is not available in this browser.'); }
  });
  document.querySelector('#library')!.addEventListener('click', () => { drawSceneGrid(); showModal(libraryDialog); });
  document.querySelector('#settings')!.addEventListener('click', () => { populateSettings(); showModal(settingsDialog); });
  document.querySelector('#open-help')!.addEventListener('click', () => showModal(helpDialog));
  document.querySelector('#enter-gallery')!.addEventListener('click', () => {
    settings.seenWelcome = true;
    saveSettings();
    closeModal(welcome);
    if (!reducedMotion && paused) {
      paused = false;
      renderer?.setPaused(false);
      const pauseButton = document.querySelector<HTMLButtonElement>('#pause')!;
      pauseButton.innerHTML = icon('pause');
      pauseButton.setAttribute('aria-label', 'Pause animation');
    }
    void startRenderer();
    wakeChrome();
  });

  document.querySelectorAll<HTMLButtonElement>('.close-dialog').forEach((button) => button.addEventListener('click', () => closeModal(button.closest('dialog')!)));
  [libraryDialog, settingsDialog, helpDialog].forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) closeModal(dialog); }));
  sceneGrid.addEventListener('click', (event) => {
    const card = (event.target as HTMLElement).closest<HTMLButtonElement>('.scene-card');
    if (!card) return;
    if (card.dataset.locked) {
      closeModal(libraryDialog); populateSettings(); showModal(settingsDialog); showToast('That scene is part of Collector.'); return;
    }
    const index = scenes.findIndex((scene) => scene.id === card.dataset.scene);
    setScene(index); closeModal(libraryDialog); wakeChrome();
  });

  document.querySelector('#rotation')!.addEventListener('change', (event) => { settings.rotationMinutes = Number((event.target as HTMLSelectElement).value); saveSettings(); });
  document.querySelector('#quality')!.addEventListener('change', (event) => { settings.maxFps = Number((event.target as HTMLSelectElement).value); saveSettings(); });
  document.querySelector('#brightness')!.addEventListener('input', (event) => { settings.brightness = Number((event.target as HTMLInputElement).value) / 100; saveSettings(); });
  document.querySelector('#date-toggle')!.addEventListener('change', (event) => { settings.date = (event.target as HTMLInputElement).checked; saveSettings(); });
  document.querySelector('#night-dim')!.addEventListener('change', (event) => { settings.nightDim = (event.target as HTMLInputElement).checked; saveSettings(); });
  document.querySelector('#dim-start')!.addEventListener('change', (event) => { settings.dimStart = (event.target as HTMLInputElement).value; saveSettings(); });
  document.querySelector('#dim-end')!.addEventListener('change', (event) => { settings.dimEnd = (event.target as HTMLInputElement).value; saveSettings(); });
  document.querySelector('#show-license')!.addEventListener('click', () => { const form = document.querySelector<HTMLElement>('#license-form')!; form.hidden = false; document.querySelector<HTMLInputElement>('#license-key')!.focus(); });
  document.querySelector('#verify-license')!.addEventListener('click', () => { void verifyLicense(); });
  document.querySelector('#reset-data')!.addEventListener('click', () => {
    if (demoMode) {
      clearDemoData();
      location.replace('/?demo=1');
      return;
    }
    if (!confirm('Reset display settings and remove the saved Collector license from this browser?')) return;
    localStorage.removeItem(settingsKey); localStorage.removeItem(LICENSE_STORAGE_KEY); localStorage.removeItem('wallpage:collector');
    settings = { ...defaultSettings, seenWelcome: true }; collectorUnlocked = false; collectorReason = 'idle'; saveSettings(); populateSettings(); drawSceneGrid(); showToast('Local Wallpage data reset');
  });
  document.querySelector<HTMLAnchorElement>('#start-real')?.addEventListener('click', (event) => {
    event.preventDefault();
    clearDemoData();
    location.assign('/?gallery=1');
  });
  document.querySelector<HTMLButtonElement>('#reset-demo')?.addEventListener('click', () => {
    clearDemoData();
    location.replace('/?demo=1');
  });

  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    wakeChrome();
    if (isDialogOpen() && event.key !== 'Escape') return;
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'j') changeScene(-1);
    else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'k') changeScene(1);
    else if (event.key === ' ') { event.preventDefault(); togglePause(); }
    else if (event.key.toLowerCase() === 'c') toggleClock();
    else if (event.key.toLowerCase() === 'f') document.querySelector<HTMLButtonElement>('#fullscreen')!.click();
    else if (event.key.toLowerCase() === 's') { populateSettings(); showModal(settingsDialog); }
    else if (event.key.toLowerCase() === 'h') showModal(helpDialog);
  });
  document.addEventListener('pointermove', wakeChrome, { passive: true });
  document.addEventListener('pointerdown', wakeChrome, { passive: true });

  async function updateConnection() {
    const connection = document.querySelector<HTMLElement>('#connection')!;
    let online = navigator.onLine;
    if (online) {
      try {
        await fetch('/robots.txt', { method: 'HEAD', cache: 'no-store' });
      } catch {
        online = false;
      }
    }
    connection.hidden = online;
  }
  addEventListener('online', () => {
    updateConnection();
    showToast('Back online');
    const savedLicense = demoMode ? null : localStorage.getItem(LICENSE_STORAGE_KEY);
    if (savedLicense && !collectorUnlocked) void verifyLicense(savedLicense);
  });
  addEventListener('offline', updateConnection);
  addEventListener('beforeunload', () => renderer?.stop());

  setScene(activeIndex);
  applySettings();
  updateClock();
  updateConnection();
  window.setInterval(updateClock, 1000);
  if (!settings.seenWelcome && !demoMode) showModal(welcome);
  else { wakeChrome(); startRendererWhenIdle(); }
  if (reducedMotion) showToast('Animation paused to respect reduced motion.');

  const savedLicense = demoMode ? null : localStorage.getItem(LICENSE_STORAGE_KEY);
  if (savedLicense) void verifyLicense(savedLicense);
  else updateCollectorPanel();

  routeFocus();

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((registration) => {
        let updateRequested = false;
        const offerUpdate = (worker: ServiceWorker | null) => {
          if (worker && navigator.serviceWorker.controller) showUpdateToast(worker, () => { updateRequested = true; });
        };
        offerUpdate(registration.waiting);
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker?.addEventListener('statechange', () => { if (worker.state === 'installed') offerUpdate(registration.waiting); });
        });
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!updateRequested) return;
          showToast('Wallpage updated. Reloading…');
          window.setTimeout(() => location.reload(), 300);
        });
      }).catch(() => undefined);
    }, { once: true });
  }
}

function escapeText(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
}
