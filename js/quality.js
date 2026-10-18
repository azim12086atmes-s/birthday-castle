// Quality presets. "auto" picks one from the device and then quietly lowers the
// render resolution if the frame rate drops, so weak laptops stay smooth.

export const PRESETS = {
  low: {
    name: 'Low', pixelRatio: 0.75, pixels: 1.0e6, antialias: false, bloom: false, shadows: 0,
    particles: 450, trees: 70, flowers: 200, clouds: 14, skyOctaves: 2, strokes: 4, birds: 10, grass: 2500, grassBlades: 3, leafCards: 36, shafts: 3,
  },
  medium: {
    name: 'Medium', pixelRatio: 1, pixels: 2.1e6, antialias: true, bloom: true, shadows: 1024,
    particles: 1300, trees: 150, flowers: 500, clouds: 26, skyOctaves: 3, strokes: 8, birds: 24, grass: 6000, grassBlades: 4, leafCards: 56, shafts: 6,
  },
  high: {
    name: 'High', pixelRatio: 1.5, pixels: 2.4e6, antialias: true, bloom: true, shadows: 2048,
    particles: 2600, trees: 230, flowers: 900, clouds: 40, skyOctaves: 4, strokes: 12, birds: 40, grass: 11000, grassBlades: 5, leafCards: 72, shafts: 8,
  },
};

const KEY = 'castle.quality';

export function savedQuality() {
  try { return localStorage.getItem(KEY) || 'auto'; } catch { return 'auto'; }
}

export function saveQuality(q) {
  try { localStorage.setItem(KEY, q); } catch { /* private mode */ }
}

function guessTier() {
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  let gpu = '';
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
    gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
  } catch { /* ignore */ }
  const discrete = /NVIDIA|GeForce|RTX|Radeon RX|Apple M\d/i.test(gpu);
  if (mobile || cores <= 2 || mem <= 2 || /SwiftShader|llvmpipe/i.test(gpu)) return 'low';
  if (discrete && cores >= 6) return 'high';
  return 'medium';
}

export function resolveQuality(choice = savedQuality()) {
  const key = choice === 'auto' ? guessTier() : choice;
  return { key, choice, ...PRESETS[key] };
}

// Dynamic resolution (after Arkenfall's renderer): each tier renders a fixed budget of pixels
// rather than the screen's full density, so a 4K or high-DPI screen costs no more than a 1080p
// one; then, whenever frames run slow, the resolution steps down a level and climbs back
// once there is headroom.
const LEVELS = [1, 0.87, 0.75, 0.62];
export class FrameGovernor {
  constructor(renderer, preset) {
    this.renderer = renderer;
    this.preset = preset;
    this.level = 0;
    this.acc = 0; this.frames = 0; this.good = 0;
    this.max = this.budgetRatio();
    this.ratio = this.max;
    renderer.setPixelRatio(this.ratio);
    addEventListener('resize', () => { this.max = this.budgetRatio(); this.apply(); });
  }
  budgetRatio() {
    const area = Math.max(1, innerWidth * innerHeight);
    return Math.min(window.devicePixelRatio || 1, this.preset.pixelRatio, Math.sqrt(this.preset.pixels / area));
  }
  apply() {
    const next = Math.max(0.4, this.max * LEVELS[this.level]);
    if (Math.abs(next - this.ratio) < 0.005) return;
    this.ratio = next;
    this.renderer.setPixelRatio(next);
    this.onChange && this.onChange();
  }
  tick(dt) {
    this.acc += dt; this.frames++;
    if (this.acc < 1) return;
    const fps = this.frames / this.acc;
    this.acc = 0; this.frames = 0;
    this.fps = fps;
    // a slow second drops a level at once; three smooth seconds in a row climb one back
    if (fps < 48 && this.level < LEVELS.length - 1) { this.level++; this.good = 0; this.apply(); }
    else if (fps > 58) { if (++this.good >= 3 && this.level > 0) { this.level--; this.good = 0; this.apply(); } }
    else this.good = 0;
  }
}
