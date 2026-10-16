// The crescent world (study thread's world fill, design/world-fill): a 20 km map of
// sea mountains ringing the mainland, with the waterfall gate in the south wall.
// Heights come as a 1024 x 1024 grid of uint16 ((h + 250) * 20), about 20 m per cell,
// and a painted colour map of the same area. Loaded once, before the world is built.
const N = 1024;
const S = 2.75;
export const CRESCENT_FRAME = { x0: -670 * 6 * S, z0: -490 * 6 * S, span: 1254 * 6 * S, n: N };
const F = CRESCENT_FRAME;

async function load() {
  const [hb, img] = await Promise.all([
    fetch('data/world/crescent-h.bin').then((r) => r.arrayBuffer()),
    fetch('data/world/crescent-colour.jpg').then((r) => r.blob()).then((b) => createImageBitmap(b)),
  ]);
  const q = new Uint16Array(hb), h = new Float32Array(N * N);
  for (let i = 0; i < h.length; i++) h[i] = q[i] / 20 - 250;
  const c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, N, N);
  return { h, rgb: g.getImageData(0, 0, N, N).data };
}
const C = await load();

function cell(x, z) {
  const fx = (x - F.x0) / F.span * N - 0.5, fz = (z - F.z0) / F.span * N - 0.5;
  if (fx < 0 || fz < 0 || fx >= N - 1 || fz >= N - 1) return null;
  const i = Math.floor(fx), j = Math.floor(fz);
  return [i, j, fx - i, fz - j];
}

// ground height in metres (the open ocean outside the map)
export function crescentH(x, z) {
  const c = cell(x, z);
  if (!c) return -200;
  const [i, j, u, v] = c, h = C.h, o = j * N + i;
  const a = h[o], b = h[o + 1], d = h[o + N], e = h[o + N + 1];
  return a + (b - a) * u + (d - a) * v + (a - b - d + e) * u * v;
}

// painted ground colour as [r, g, b] 0..1, or null outside the map
export function crescentRGB(x, z) {
  const c = cell(x, z);
  if (!c) return null;
  const o = (c[1] * N + c[0]) * 4, d = C.rgb;
  return [d[o] / 255, d[o + 1] / 255, d[o + 2] / 255];
}
