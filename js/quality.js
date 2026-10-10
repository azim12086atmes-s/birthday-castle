// Quality presets. "auto" picks one from the device and then quietly lowers the
// render resolution if the frame rate drops, so weak laptops stay smooth.

export const PRESETS = {
  low: {
    name: 'Low', pixelRatio: 0.75, antialias: false, bloom: false, shadows: 0,
    particles: 450, trees: 70, flowers: 200, clouds: 14, skyOctaves: 2, strokes: 4, birds: 10, grass: 2500, grassBlades: 3, leafCards: 36, shafts: 3,
  },
  medium: {
    name: 'Medium', pixelRatio: 1, antialias: true, bloom: true, shadows: 1024,
    particles: 1300, trees: 150, flowers: 500, clouds: 26, skyOctaves: 3, strokes: 8, birds: 24, grass: 6000, grassBlades: 4, leafCards: 56, shafts: 6,
  },
  high: {
    name: 'High', pixelRatio: 1.5, antialias: true, bloom: true, shadows: 2048,
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

// Dynamic resolution: watches the frame rate and nudges the pixel ratio.
export class FrameGovernor {
  constructor(renderer, preset) {
    this.renderer = renderer;
    this.max = Math.min(window.devicePixelRatio || 1, preset.pixelRatio);
    this.ratio = this.max;
    this.min = 0.5;
    this.acc = 0; this.frames = 0;
    renderer.setPixelRatio(this.ratio);
  }
  tick(dt) {
    this.acc += dt; this.frames++;
    if (this.acc < 2) return;
    const fps = this.frames / this.acc;
    this.acc = 0; this.frames = 0;
    let next = this.ratio;
    if (fps < 40) next = Math.max(this.min, this.ratio - 0.15);
    else if (fps > 57) next = Math.min(this.max, this.ratio + 0.05);
    if (Math.abs(next - this.ratio) > 0.01) {
      this.ratio = next;
      this.renderer.setPixelRatio(next);
      this.onChange && this.onChange();
    }
    this.fps = fps;
  }
}
