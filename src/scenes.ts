import { hashSeed, randomFrom } from './core';

export type SceneDefinition = {
  id: string;
  title: string;
  index: string;
  description: string;
  collector?: boolean;
};

export const scenes: SceneDefinition[] = [
  { id: 'brackish-drift', index: '01', title: 'Brackish drift', description: 'Fine luminous currents wander through deep estuary water.' },
  { id: 'moon-tide', index: '02', title: 'Moon tide', description: 'Layered tidal contours move beneath a low copper moon.' },
  { id: 'quiet-duel', index: '03', title: 'Quiet duel', description: 'Two patient colonies trade a soft cellular frontier.' },
  { id: 'cloud-chamber', index: '04', title: 'Cloud chamber', description: 'Storm vapor gathers, opens, and dissolves in slow strata.' },
  { id: 'ember-bloom', index: '05', title: 'Ember bloom', description: 'A dark botanical flame draws itself from orbiting embers.' },
  { id: 'salt-constellation', index: '06', title: 'Salt constellation', description: 'Mineral points find temporary neighbors across a night basin.' },
  { id: 'kelp-current', index: '07', title: 'Kelp current', description: 'Long submerged ribbons lean into an unseen tide.' },
  { id: 'rain-archive', index: '08', title: 'Rain archive', description: 'Weather marks fall through a quiet field of reflected light.' },
  { id: 'fault-garden', index: '09', title: 'Fault garden', description: 'Collector scene — geological cells breathe along illuminated seams.', collector: true },
  { id: 'aurora-basin', index: '10', title: 'Aurora basin', description: 'Collector scene — veils of mineral light fold over a black horizon.', collector: true },
];

type Particle = { x: number; y: number; age: number; speed: number; offset: number };
type RenderState = { particles: Particle[]; width: number; height: number };

const TAU = Math.PI * 2;

function fillBackground(ctx: CanvasRenderingContext2D, width: number, height: number, top: string, bottom = '#07100f') {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function vignette(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const x = width * (0.46 + Math.sin(time * 0.00003) * 0.08);
  const y = height * (0.48 + Math.cos(time * 0.000027) * 0.06);
  const gradient = ctx.createRadialGradient(x, y, Math.min(width, height) * 0.1, x, y, Math.max(width, height) * 0.74);
  gradient.addColorStop(0, 'rgba(3, 9, 8, 0)');
  gradient.addColorStop(1, 'rgba(2, 5, 5, .7)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawBrackish(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number, state: RenderState) {
  fillBackground(ctx, width, height, '#0b2423');
  if (state.width !== width || state.height !== height || state.particles.length === 0) {
    const random = randomFrom(seed);
    state.particles = Array.from({ length: Math.min(190, Math.max(80, Math.floor((width * height) / 9000))) }, () => ({
      x: random() * width,
      y: random() * height,
      age: random() * 100,
      speed: 0.25 + random() * 0.45,
      offset: random() * TAU,
    }));
    state.width = width;
    state.height = height;
  }
  ctx.lineWidth = Math.max(0.7, width / 1900);
  ctx.lineCap = 'round';
  for (const particle of state.particles) {
    const angle = Math.sin(particle.y * 0.007 + time * 0.00008 + particle.offset) * 1.2 + Math.cos(particle.x * 0.005 - time * 0.00005);
    const oldX = particle.x;
    const oldY = particle.y;
    particle.x += Math.cos(angle) * particle.speed;
    particle.y += Math.sin(angle) * particle.speed;
    particle.age += 1;
    if (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height || particle.age > 350) {
      const random = randomFrom(seed + Math.floor(time) + particle.age);
      particle.x = random() * width;
      particle.y = random() * height;
      particle.age = 0;
    }
    ctx.strokeStyle = `rgba(${particle.age % 3 === 0 ? '237,155,99' : '130,211,197'},${0.14 + Math.sin(particle.age / 350 * Math.PI) * 0.35})`;
    ctx.beginPath();
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(particle.x, particle.y);
    ctx.stroke();
  }
}

function drawMoonTide(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number) {
  fillBackground(ctx, width, height, '#0b1c21');
  const phase = (seed % 1000) / 1000 * TAU;
  const moonX = width * (0.72 + Math.sin(time * 0.000012 + phase) * 0.04);
  const moonY = height * 0.25;
  const glow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, height * 0.19);
  glow.addColorStop(0, 'rgba(237,155,99,.85)');
  glow.addColorStop(0.12, 'rgba(237,155,99,.36)');
  glow.addColorStop(1, 'rgba(237,155,99,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  for (let layer = 0; layer < 14; layer += 1) {
    const y = height * (0.38 + layer * 0.047);
    ctx.strokeStyle = layer % 4 === 0 ? 'rgba(237,155,99,.24)' : `rgba(99,184,177,${0.12 + layer * 0.008})`;
    ctx.lineWidth = 1 + layer * 0.14;
    ctx.beginPath();
    for (let x = -20; x <= width + 20; x += 16) {
      const wave = Math.sin(x * 0.009 + time * (0.000035 + layer * 0.0000015) + phase + layer * 0.64) * (8 + layer * 1.3);
      const second = Math.cos(x * 0.0037 - time * 0.000022 + layer) * 5;
      if (x === -20) ctx.moveTo(x, y + wave + second);
      else ctx.lineTo(x, y + wave + second);
    }
    ctx.stroke();
  }
}

function drawQuietDuel(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number) {
  fillBackground(ctx, width, height, '#111715');
  const size = Math.max(18, Math.min(36, width / 30));
  const columns = Math.ceil(width / size);
  const rows = Math.ceil(height / size);
  const phase = time * 0.000065;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const border = width * (0.5 + Math.sin(row * 0.33 + phase + seed) * 0.16 + Math.sin(row * 0.08 - phase * 0.7) * 0.1);
      const noise = Math.sin(column * 12.9898 + row * 78.233 + seed) * size * 1.2;
      const left = column * size + noise < border;
      ctx.fillStyle = left ? 'rgba(54,117,111,.72)' : 'rgba(142,78,56,.72)';
      const inset = 1.5 + Math.sin(row + column + phase) * 0.8;
      ctx.fillRect(column * size + inset, row * size + inset, size - inset * 2, size - inset * 2);
    }
  }
  ctx.strokeStyle = 'rgba(238,245,235,.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let row = 0; row <= rows; row += 1) {
    const y = row * size;
    const x = width * (0.5 + Math.sin(row * 0.33 + phase + seed) * 0.16 + Math.sin(row * 0.08 - phase * 0.7) * 0.1);
    if (row === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawClouds(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number) {
  fillBackground(ctx, width, height, '#101b20');
  const random = randomFrom(seed);
  for (let index = 0; index < 34; index += 1) {
    const baseX = random() * width;
    const baseY = random() * height;
    const radius = (0.07 + random() * 0.2) * Math.min(width, height);
    const x = (baseX + time * (0.001 + random() * 0.002) + Math.sin(time * 0.00003 + index) * 30) % (width + radius * 2) - radius;
    const y = baseY + Math.sin(time * 0.000025 + index * 1.8) * height * 0.06;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    const warm = index % 9 === 0;
    gradient.addColorStop(0, warm ? 'rgba(188,117,79,.11)' : 'rgba(121,159,161,.13)');
    gradient.addColorStop(1, 'rgba(7,16,15,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
}

function drawEmberBloom(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number) {
  fillBackground(ctx, width, height, '#150f0d');
  ctx.save();
  ctx.translate(width / 2 + Math.sin(time * 0.000018) * width * 0.06, height / 2);
  ctx.globalCompositeOperation = 'lighter';
  const scale = Math.min(width, height) * 0.22;
  const phase = time * 0.00007 + seed;
  for (let index = 0; index < 1200; index += 1) {
    const p = index / 1200;
    const orbit = p * TAU * 13 + phase;
    const radius = Math.sin(p * Math.PI) * scale * (0.5 + 0.5 * Math.sin(orbit * 0.31 + phase));
    const x = Math.cos(orbit) * radius * (0.5 + p);
    const y = Math.sin(orbit * 1.003) * radius - (p - 0.5) * scale * 0.6;
    ctx.fillStyle = index % 5 === 0 ? 'rgba(237,155,99,.26)' : 'rgba(167,89,54,.15)';
    ctx.fillRect(x, y, 1.4, 1.4);
  }
  ctx.restore();
}

function drawConstellation(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number) {
  fillBackground(ctx, width, height, '#081517');
  const random = randomFrom(seed);
  const points = Array.from({ length: Math.min(95, Math.max(44, Math.floor(width / 14))) }, (_, index) => ({
    x: random() * width + Math.sin(time * 0.00002 + index) * 18,
    y: random() * height + Math.cos(time * 0.000017 + index * 0.8) * 18,
  }));
  ctx.lineWidth = 0.8;
  for (let a = 0; a < points.length; a += 1) {
    const point = points[a];
    for (let b = a + 1; b < points.length; b += 1) {
      const other = points[b];
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < Math.min(width, height) * 0.13) {
        ctx.strokeStyle = `rgba(99,184,177,${(1 - distance / (Math.min(width, height) * 0.13)) * 0.18})`;
        ctx.beginPath(); ctx.moveTo(point.x, point.y); ctx.lineTo(other.x, other.y); ctx.stroke();
      }
    }
    ctx.fillStyle = a % 11 === 0 ? '#ed9b63' : 'rgba(238,245,235,.7)';
    ctx.beginPath(); ctx.arc(point.x, point.y, a % 11 === 0 ? 2 : 1.2, 0, TAU); ctx.fill();
  }
}

function drawKelp(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number) {
  fillBackground(ctx, width, height, '#071815');
  const random = randomFrom(seed);
  const strands = Math.min(42, Math.max(18, Math.floor(width / 34)));
  for (let index = 0; index < strands; index += 1) {
    const x = random() * width;
    const length = height * (0.35 + random() * 0.55);
    const sway = Math.sin(time * 0.000055 + index * 0.7) * width * 0.055;
    ctx.strokeStyle = index % 8 === 0 ? 'rgba(237,155,99,.22)' : `rgba(66,143,126,${0.16 + random() * 0.28})`;
    ctx.lineWidth = 1.5 + random() * 4;
    ctx.beginPath();
    ctx.moveTo(x, height + 5);
    ctx.bezierCurveTo(x + sway * 0.2, height - length * 0.35, x - sway * 0.55, height - length * 0.67, x + sway, height - length);
    ctx.stroke();
  }
}

function drawRain(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number) {
  fillBackground(ctx, width, height, '#0c1315');
  const random = randomFrom(seed);
  ctx.lineCap = 'round';
  for (let index = 0; index < Math.min(180, Math.floor(width / 7)); index += 1) {
    const x = random() * width;
    const speed = 0.035 + random() * 0.04;
    const y = (random() * height + time * speed) % (height + 80) - 40;
    const length = 12 + random() * 42;
    ctx.strokeStyle = index % 13 === 0 ? 'rgba(237,155,99,.3)' : `rgba(154,193,193,${0.1 + random() * 0.3})`;
    ctx.lineWidth = 0.7 + random();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - length * 0.15, y + length); ctx.stroke();
  }
  const horizon = height * 0.78;
  const reflection = ctx.createLinearGradient(0, horizon, 0, height);
  reflection.addColorStop(0, 'rgba(99,184,177,.08)');
  reflection.addColorStop(1, 'rgba(7,16,15,0)');
  ctx.fillStyle = reflection;
  ctx.fillRect(0, horizon, width, height - horizon);
}

function drawFaultGarden(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number) {
  fillBackground(ctx, width, height, '#11120f');
  const random = randomFrom(seed);
  const columns = Math.ceil(width / 90) + 2;
  const rows = Math.ceil(height / 78) + 2;
  ctx.lineWidth = 1.2;
  for (let row = -1; row < rows; row += 1) {
    for (let column = -1; column < columns; column += 1) {
      const offset = row % 2 ? 45 : 0;
      const x = column * 90 + offset + Math.sin(time * 0.00003 + row + column) * 8;
      const y = row * 78 + Math.cos(time * 0.000025 + column) * 7;
      const radius = 44 + random() * 16 + Math.sin(time * 0.00004 + row * column) * 5;
      ctx.strokeStyle = (row + column) % 7 === 0 ? 'rgba(237,155,99,.48)' : 'rgba(99,184,177,.17)';
      ctx.beginPath();
      for (let side = 0; side <= 6; side += 1) {
        const angle = side / 6 * TAU;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (side === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }
}

function drawAurora(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, seed: number) {
  fillBackground(ctx, width, height, '#060c11', '#07100f');
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const phase = (seed % 500) + time * 0.000025;
  for (let band = 0; band < 7; band += 1) {
    const gradient = ctx.createLinearGradient(0, height * 0.12, 0, height * 0.86);
    gradient.addColorStop(0, 'rgba(99,184,177,0)');
    gradient.addColorStop(0.45, band % 3 === 0 ? 'rgba(237,155,99,.08)' : 'rgba(76,167,157,.13)');
    gradient.addColorStop(1, 'rgba(99,184,177,0)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = width * (0.045 + band * 0.008);
    ctx.beginPath();
    for (let y = -height * 0.1; y < height * 1.1; y += 12) {
      const x = width * (0.15 + band * 0.11) + Math.sin(y * 0.009 + phase + band) * width * 0.09 + Math.cos(y * 0.003 - phase) * width * 0.04;
      if (y < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export class SceneRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private state: RenderState = { particles: [], width: 0, height: 0 };
  private animation = 0;
  private sceneId = scenes[0].id;
  private seed = '';
  private paused = false;
  private maxFps = 30;
  private effectiveFps = 30;
  private lastFrame = 0;
  private hidden = false;
  private renderCost = 0;
  private sampleCount = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas 2D is unavailable');
    this.context = context;
    document.addEventListener('visibilitychange', () => { this.hidden = document.hidden; });
  }

  start() {
    const draw = (time: number) => {
      this.animation = requestAnimationFrame(draw);
      if (this.paused || this.hidden || time - this.lastFrame < 1000 / this.effectiveFps) return;
      this.lastFrame = time;
      const started = performance.now();
      this.render(time);
      const cost = performance.now() - started;
      this.renderCost = this.renderCost * 0.92 + cost * 0.08;
      this.sampleCount += 1;
      if (this.sampleCount % 90 === 0) {
        const budget = 1000 / this.effectiveFps;
        if (this.renderCost > budget * 0.7) this.effectiveFps = Math.max(18, this.effectiveFps - 6);
        else if (this.renderCost < budget * 0.35 && this.effectiveFps < this.maxFps) this.effectiveFps = Math.min(this.maxFps, this.effectiveFps + 3);
      }
    };
    this.animation = requestAnimationFrame(draw);
  }

  stop() { cancelAnimationFrame(this.animation); }
  setPaused(paused: boolean) { this.paused = paused; if (paused) this.render(performance.now()); }
  setMaxFps(fps: number) { this.maxFps = fps; this.effectiveFps = Math.min(this.effectiveFps, fps); }
  setScene(id: string, seed: string) { this.sceneId = id; this.seed = seed; this.state = { particles: [], width: 0, height: 0 }; this.render(performance.now()); }

  private resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.35 : 1.65);
    const width = Math.max(1, Math.floor(this.canvas.clientWidth * ratio));
    const height = Math.max(1, Math.floor(this.canvas.clientHeight * ratio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    return { width, height };
  }

  private render(time: number) {
    const { width, height } = this.resize();
    const seed = hashSeed(`${this.seed}:${this.sceneId}`);
    const renderers: Record<string, () => void> = {
      'brackish-drift': () => drawBrackish(this.context, width, height, time, seed, this.state),
      'moon-tide': () => drawMoonTide(this.context, width, height, time, seed),
      'quiet-duel': () => drawQuietDuel(this.context, width, height, time, seed),
      'cloud-chamber': () => drawClouds(this.context, width, height, time, seed),
      'ember-bloom': () => drawEmberBloom(this.context, width, height, time, seed),
      'salt-constellation': () => drawConstellation(this.context, width, height, time, seed),
      'kelp-current': () => drawKelp(this.context, width, height, time, seed),
      'rain-archive': () => drawRain(this.context, width, height, time, seed),
      'fault-garden': () => drawFaultGarden(this.context, width, height, time, seed),
      'aurora-basin': () => drawAurora(this.context, width, height, time, seed),
    };
    (renderers[this.sceneId] ?? renderers['brackish-drift'])();
    vignette(this.context, width, height, time);
  }
}
