import './style.css';
import { defaultSettings, isWithinNightSchedule, readSettings, seedOfDay } from './core';
import { LICENSE_STORAGE_KEY, type EntitlementReason, verifyEntitlement } from './entitlement';
import { SceneRenderer, scenes } from './scenes';

const app = document.querySelector<HTMLDivElement>('#app')!;

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
  document.title = `${privacy ? 'Privacy' : 'Terms'} — Wallpage`;
  app.innerHTML = `
    <div class="legal-shell">
      <header class="legal-header"><a class="wordmark" href="/" aria-label="Wallpage home"><span></span>Wallpage</a></header>
      <main id="main" class="legal-copy">
        <p class="eyebrow">Plain-language policy · 27 August 2026</p>
        <h1>${privacy ? 'A quiet screen should be private.' : 'Simple terms for a quiet gallery.'}</h1>
        ${privacy ? `
          <h2>What stays on your device</h2><p>Your clock, rotation, dimming, welcome-state, and a pasted Collector license token are stored in your browser. Your daily seed and generated artwork are computed locally. Wallpage does not create an account, use advertising cookies, fingerprint your device, or include analytics.</p>
          <h2>When the network is used</h2><p>The gallery works offline after its first visit. Collector scenes require a live verification: the license token is sent securely to the configured Sociobot billing verifier and is not treated as an unlock by itself. Wallpage does not receive payment card details.</p>
          <h2>Your control</h2><p>Use “Reset local data” in Settings to remove preferences and any saved license key. Clearing this site’s browser data does the same. Questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>
        ` : `
          <h2>Using Wallpage</h2><p>Wallpage is provided as a browser-based ambient display. You may use it personally or in a workplace display. Do not resell the service, interfere with its operation, or represent its generative scenes as your own downloadable collection.</p>
          <h2>Collector access</h2><p>Collector access is a one-time license sold and verified through Sociobot when checkout is enabled. Paid scenes unlock only after the server confirms an active license; they remain locked while offline, expired, revoked, or unverifiable. Refunds and regional purchase terms shown at checkout apply.</p>
          <h2>Availability</h2><p>The service and its generated visuals are provided “as is.” We may improve or replace individual scene algorithms while preserving access to the core gallery. Wallpage is visual ambience, not a time-critical clock or safety display.</p>
        `}
        <p><a class="text-link" href="/">← Return to the gallery</a></p>
      </main>
      <footer class="legal-footer">© 2026 Sociobot · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></footer>
    </div>`;
}

if (/^\/(privacy|terms)\/?$/.test(location.pathname)) {
  renderLegal(location.pathname);
} else {
  renderGallery();
}

function renderGallery() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let settings = readSettings(window.localStorage);
  // A writable browser value is never an entitlement. It may retain a license
  // token for restore, but every app session starts locked until Sociobot says
  // that token is valid for this product.
  localStorage.removeItem('wallpage:collector');
  let collectorUnlocked = false;
  let collectorReason: EntitlementReason | 'idle' | 'checking' = 'idle';
  let paused = reducedMotion || !settings.seenWelcome;
  let activeIndex = 0;
  let rotationTimer = 0;
  let chromeTimer = 0;
  let lastClockMinute = -1;

  const query = new URLSearchParams(location.search);
  const licenseFromReturn = query.get('license')?.trim();
  if (licenseFromReturn) {
    localStorage.setItem(LICENSE_STORAGE_KEY, licenseFromReturn);
    query.delete('license');
    const cleanUrl = new URL(location.href);
    cleanUrl.search = query.toString();
    history.replaceState({}, '', cleanUrl);
  }
  const seed = query.get('seed')?.slice(0, 80) || seedOfDay();
  const requestedScene = query.get('scene');
  const requestedIndex = scenes.findIndex((scene) => scene.id === requestedScene);
  if (requestedIndex >= 0 && (!scenes[requestedIndex].collector || collectorUnlocked)) activeIndex = requestedIndex;

  app.innerHTML = `
    <main id="main" class="gallery" data-chrome="visible">
      <h1 class="sr-only">Wallpage ambient generative gallery</h1>
      <canvas id="scene" aria-hidden="true"></canvas>
      <div class="scene-fallback" role="img" aria-label="A dark tidal observatory in blue-green fog"></div>
      <div class="dim-layer" aria-hidden="true"></div>
      <header class="masthead chrome">
        <button class="wordmark button-reset" id="open-help" aria-label="Open Wallpage guide"><span></span>Wallpage</button>
        <p><span id="scene-number">01</span> / <span id="scene-count">${scenes.length.toString().padStart(2, '0')}</span></p>
      </header>
      <section class="scene-caption chrome" aria-live="polite" aria-atomic="true">
        <p class="eyebrow" id="scene-kind">Seed of the day · ${escapeText(seed)}</p>
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
        <button id="share" class="icon-button" aria-label="Share this seed">${icon('share')}</button>
        <button id="fullscreen" class="icon-button" aria-label="Enter fullscreen">${icon('expand')}</button>
        <button id="settings" class="icon-button" aria-label="Open settings">${icon('settings')}</button>
      </nav>
      <footer class="corner-footer chrome"><span>Canvas generated locally</span><a href="/privacy">Privacy</a><a href="/terms">Terms</a></footer>
      <div class="connection" id="connection" role="status" hidden>Offline · the gallery will keep playing</div>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
    </main>

    <dialog id="welcome" class="welcome-dialog" aria-labelledby="welcome-title">
      <div class="welcome-art"><picture><source srcset="/assets/tidal-observatory.avif" type="image/avif"><source srcset="/assets/tidal-observatory.webp" type="image/webp"><img src="/assets/tidal-observatory.jpg" width="900" height="600" alt="A fictional tidal observatory of dark mineral pools, luminous currents, and low fog" decoding="async" fetchpriority="high"></picture></div>
      <div class="welcome-copy">
        <p class="eyebrow">An idle screen, alive</p>
        <h2 id="welcome-title">Time, made ambient.</h2>
        <p>Ten slow environments evolve from today’s seed. Leave one running, or let the gallery wander.</p>
        <ul><li><kbd>←</kbd> <kbd>→</kbd> change scene</li><li><kbd>Space</kbd> pause</li><li><kbd>C</kbd> clock</li><li><kbd>F</kbd> full screen</li></ul>
        <button id="enter-gallery" class="primary-button">Enter the gallery <span aria-hidden="true">→</span></button>
        <p class="generated-note">Artwork and live scenes are original, with the still artwork generated for Wallpage.</p>
      </div>
    </dialog>

    <dialog id="library-dialog" class="panel-dialog" aria-labelledby="library-title">
      <div class="dialog-heading"><div><p class="eyebrow">The collection</p><h2 id="library-title">Choose an environment</h2></div><button class="icon-button close-dialog" aria-label="Close scene library">${icon('close')}</button></div>
      <div class="scene-grid" id="scene-grid"></div>
    </dialog>

    <dialog id="settings-dialog" class="panel-dialog settings-dialog" aria-labelledby="settings-title">
      <form method="dialog" id="settings-form">
        <div class="dialog-heading"><div><p class="eyebrow">Projection room</p><h2 id="settings-title">Display settings</h2></div><button class="icon-button close-dialog" aria-label="Close settings">${icon('close')}</button></div>
        <div class="setting-row"><div><label for="rotation">Auto-rotate</label><p>Move to the next scene on a quiet interval.</p></div><select id="rotation"><option value="0">Off</option><option value="1">Every minute</option><option value="5">Every 5 minutes</option><option value="15">Every 15 minutes</option><option value="30">Every 30 minutes</option></select></div>
        <div class="setting-row"><div><label for="quality">Motion quality</label><p>Lower rates save energy on long-running displays.</p></div><select id="quality"><option value="24">Eco · 24 fps</option><option value="30">Balanced · 30 fps</option><option value="45">Smooth · 45 fps</option></select></div>
        <div class="setting-row"><div><label for="brightness">Scene brightness</label><p>Dim the canvas without dimming controls.</p></div><input id="brightness" type="range" min="35" max="100" step="5"></div>
        <div class="setting-row"><div><label for="date-toggle">Show date</label><p>Keep the calendar below the clock.</p></div><input id="date-toggle" class="switch" type="checkbox"></div>
        <div class="setting-row"><div><label for="night-dim">Dim at night</label><p>Apply an extra veil during your sleep hours.</p></div><input id="night-dim" class="switch" type="checkbox"></div>
        <div class="time-pair"><label>Dim from <input id="dim-start" type="time"></label><label>Until <input id="dim-end" type="time"></label></div>
        <section class="collector-panel" aria-labelledby="collector-heading"><p class="eyebrow">Optional</p><h3 id="collector-heading">Collector pass</h3><p id="collector-status">Unlock Fault garden and Aurora basin with a one-time purchase. The price is shown before checkout; paid scenes stay locked until Sociobot verifies a license.</p><div class="license-actions"><a class="secondary-button" id="buy-collector" target="_blank" rel="noreferrer">Get Collector</a><button class="secondary-button" type="button" id="show-license">Enter license</button></div><div class="license-form" id="license-form" hidden><label for="license-key">License key</label><div><input id="license-key" autocomplete="off" spellcheck="false" aria-describedby="license-message"><button class="primary-button" type="button" id="verify-license">Verify</button></div><p id="license-message" role="status"></p></div></section>
        <button class="text-button danger-button" type="button" id="reset-data">Reset local data</button>
      </form>
    </dialog>

    <dialog id="help-dialog" class="panel-dialog help-dialog" aria-labelledby="help-title">
      <div class="dialog-heading"><div><p class="eyebrow">Wallpage guide</p><h2 id="help-title">Make a room feel less idle</h2></div><button class="icon-button close-dialog" aria-label="Close guide">${icon('close')}</button></div>
      <div class="help-layout"><picture><source srcset="/assets/tidal-observatory.avif" type="image/avif"><source srcset="/assets/tidal-observatory.webp" type="image/webp"><img src="/assets/tidal-observatory.jpg" width="900" height="600" alt="The fictional tidal observatory artwork made for Wallpage" decoding="async" loading="lazy"></picture><div><p>Wallpage draws every moving scene in this browser. No video stream, account, ads, or installation is required.</p><h3>Put it on a larger screen</h3><ol><li>Open this page in a TV browser, or cast this tab from your browser menu.</li><li>Press <kbd>F</kbd> or the expand button for full screen.</li><li>Move the pointer away; the controls fade after a few seconds.</li></ol><h3>Use it as a screensaver</h3><p>On macOS or Windows, use a trusted “web page screensaver” utility and set its URL to this page. Wallpage itself does not install system software.</p><h3>Keyboard & remote</h3><p><kbd>←</kbd>/<kbd>J</kbd> previous · <kbd>→</kbd>/<kbd>K</kbd> next · <kbd>Space</kbd> pause · <kbd>C</kbd> clock · <kbd>S</kbd> settings · <kbd>H</kbd> guide.</p></div></div>
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
  let renderer: SceneRenderer | null = null;

  try {
    renderer = new SceneRenderer(canvas);
    renderer.setMaxFps(settings.maxFps);
    renderer.setPaused(paused);
    renderer.start();
  } catch {
    gallery.classList.add('canvas-error');
    showToast('Live canvas is unavailable. Showing the still environment instead.');
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
    localStorage.setItem('wallpage:settings', JSON.stringify(settings));
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
      if (navigator.share) await navigator.share({ title: `${scenes[activeIndex].title} — Wallpage`, text: `Watch today’s ${scenes[activeIndex].title} seed evolve.`, url: shareUrl.toString() });
      else {
        await navigator.clipboard.writeText(shareUrl.toString());
        showToast('Seed link copied');
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
    if (collectorUnlocked) {
      status.textContent = 'Collector is active for this session. All ten environments are available.';
      buy.hidden = true;
      showLicense.hidden = true;
    } else {
      buy.hidden = !buyUrl;
      if (buyUrl) buy.href = buyUrl;
      showLicense.hidden = false;
      const messages: Record<typeof collectorReason, string> = {
        idle: buyUrl ? 'Unlock Fault garden and Aurora basin with a one-time license. Paid scenes stay locked until Sociobot verifies it.' : 'Collector checkout is not configured here. An existing license can be checked when a verifier is configured.',
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
    button.textContent = 'Verify';
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
    if (!confirm('Reset display settings and remove the saved Collector license from this browser?')) return;
    localStorage.removeItem('wallpage:settings'); localStorage.removeItem(LICENSE_STORAGE_KEY); localStorage.removeItem('wallpage:collector');
    settings = { ...defaultSettings, seenWelcome: true }; collectorUnlocked = false; collectorReason = 'idle'; saveSettings(); populateSettings(); drawSceneGrid(); showToast('Local Wallpage data reset');
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
    const savedLicense = localStorage.getItem(LICENSE_STORAGE_KEY);
    if (savedLicense && !collectorUnlocked) void verifyLicense(savedLicense);
  });
  addEventListener('offline', updateConnection);
  addEventListener('beforeunload', () => renderer?.stop());

  drawSceneGrid();
  setScene(activeIndex);
  applySettings();
  updateClock();
  updateConnection();
  window.setInterval(updateClock, 1000);
  if (!settings.seenWelcome) showModal(welcome);
  else wakeChrome();
  if (reducedMotion) showToast('Animation paused to respect reduced motion.');

  const savedLicense = localStorage.getItem(LICENSE_STORAGE_KEY);
  if (savedLicense) void verifyLicense(savedLicense);
  else updateCollectorPanel();

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
