// The shape of the world (art-references/world-layout.md v2): one wide land
// inside a mountain rim, with a long lake in front of a forested crag that
// carries the castle, and floating islands high overhead. This module answers
// the ground height and collision queries the player controller uses.
// Coordinates are metres; the castle crag is at the centre and north is -z.

export const ISLANDS = [
  { id: 'castle', name: 'Castle of Starlight', x: 0, z: 0, y: 0, r: 1250, main: true },
  { id: 'garden', name: 'Crystal Garden', x: 560, z: -330, y: 250, r: 38, hue: 0.52 },
  { id: 'aurora', name: 'Aurora Peak', x: -520, z: -640, y: 320, r: 32, hue: 0.42 },
  { id: 'lake', name: 'Lantern Lake', x: -430, z: 300, y: 230, r: 44, hue: 0.12 },
  { id: 'meadow', name: 'Unicorn Meadow', x: 520, z: 380, y: 270, r: 40, hue: 0.85 },
  { id: 'star', name: 'Starfall Isle', x: 90, z: -560, y: 380, r: 30, hue: 0.62 },
];
export const MAIN = ISLANDS[0];
const SKY = ISLANDS.filter((i) => !i.main);

// --- the main features --------------------------------------------------
export const CRAG = { x: 0, z: -10, rx: 250, rz: 190, y: 90 };
export const SPAWN = { x: -742, z: 884 };                       // Lantern Cove dais
export const COVE = { x: -742, z: 884, r: 18, y: 5 };
// the castle sits on three podium terraces on the crag top, gate facing the lake
export const CASTLE = { x: 0, z: -60, y: 108, s: 3 };
export const TERRACES = [{ y: 96, hw: 150, front: 90 }, { y: 102, hw: 140, front: 60 }, { y: 108, hw: 130, front: 30 }];
export const TERRACE_REAR = -170;
export const STAIR = { hw: 20, run: 12 };
export const PLAZA = { x: 0, z: 146, y: CRAG.y, r: 18 };          // armillary forecourt at the crag's lake edge
// the long lake, as a centre line with a varying half width
export const LAKE_PATH = [[-650, 790], [-520, 690], [-390, 600], [-250, 520], [-100, 430], [60, 360], [220, 355], [380, 410], [520, 500]];
// the long bridge, from the cove across the lake to the foot of the crag
export const BRIDGE = { pts: [[-728, 868], [-600, 768], [-450, 655], [-310, 560], [-200, 440], [-152, 284]], hw: 7, y: 14, ramp: 45 };
// the Giant-Tree Way: a winding road climbing the crag's gentle west slope [x, z, y]
export const TREE_WAY = { pts: [[-152, 284, 1.5], [-300, 282, 18], [-420, 250, 30], [-410, 190, 40], [-260, 200, 66], [-200, 170, 80], [-150, 140, 90], [-80, 126, 90], [-24, 142, CRAG.y]], hw: 6 };
export const LAGOON = { x: -700, z: 560, r: 90, y: 6 };           // Lagoon City (Atlantis white town) on the west shore
export const TEMPLE_HILL = { x: 140, z: -560, r: 150, top: 70, y: 110 };
export const ROSE_CRAG = { x: -560, z: -600, r: 90, top: 40, y: 70 };
export const PILLAR_REACH = { x: 760, z: 100 };
export const THOLOI = [{ x: 110, z: -580 }, { x: 180, z: -530 }];
export const WHEEL = { x: -772, z: 612 };
export const RUNES = { x: -1000, z: 260, r: 9 };
export const LAKE_POND = { x: ISLANDS[3].x, z: ISLANDS[3].z, r: 18 };

// Portals on the crag top, each to one floating island.
const PORTAL_SPOTS = { lake: [-210, -10], garden: [210, -10], aurora: [-190, -120], star: [190, -120], meadow: [196, 92] };
export const PORTALS = SKY.map((isl) => {
  const [x, z] = PORTAL_SPOTS[isl.id];
  return { to: isl.id, name: isl.name, x, z, y: CRAG.y, angle: Math.atan2(isl.z - z, isl.x - x) };
});
// Return portal on each floating island, on the side facing the castle.
export const RETURNS = SKY.map((isl) => {
  const a = Math.atan2(-isl.z, -isl.x);
  const d = isl.r - 8;
  return { from: isl.id, x: isl.x + Math.cos(a) * d, z: isl.z + Math.sin(a) * d, y: isl.y, angle: a };
});

// Solid things the player bumps into: circles { x, z, r } and boxes.
export const COLLIDERS = [];
export function addCollider(c) { COLLIDERS.push(c); }

// Which island a point is on. The main land lies under the floating islands, so
// pass the height you are at (y) to pick the island you are standing on.
export function islandAt(x, z, y = 0) {
  let best = null;
  for (const isl of SKY) {
    const dx = x - isl.x, dz = z - isl.z;
    if (dx * dx + dz * dz < isl.r * isl.r && y > isl.y - 6) best = isl;
  }
  if (best) return best;
  return x * x + z * z < MAIN.r * MAIN.r ? MAIN : null;
}

// --- noise -----------------------------------------------------------------
function h2(x, z) { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = h2(ix, iz), b = h2(ix + 1, iz), c = h2(ix, iz + 1), d = h2(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

// --- polylines with a spatial index -------------------------------------------
// Each line is resampled every few metres; queries find the nearest sample.
function sampleLine(pts, step) {
  const out = [];
  let len = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(d / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      out.push({ x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, y: a[2] !== undefined ? a[2] + (b[2] - a[2]) * t : 0, s: len + d * t, i });
    }
    len += d;
  }
  const e = pts[pts.length - 1];
  out.push({ x: e[0], z: e[1], y: e[2] ?? 0, s: len, i: pts.length - 2 });
  return { samples: out, length: len };
}
// smooth the corners of a polyline (Chaikin) so curves read as curves
function chaikin(pts, rounds = 3) {
  let p = pts;
  for (let r = 0; r < rounds; r++) {
    const q = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1];
      q.push(a.map((v, k) => v * 0.75 + b[k] * 0.25), a.map((v, k) => v * 0.25 + b[k] * 0.75));
    }
    q.push(p[p.length - 1]);
    p = q;
  }
  return p;
}
const key = (i, j) => (i + 4096) * 8192 + (j + 4096);
function indexLine(line, cell) {
  const grid = new Map();
  for (let i = 0; i < line.samples.length; i++) {
    const s = line.samples[i], k = key(Math.floor(s.x / cell), Math.floor(s.z / cell));
    (grid.get(k) || grid.set(k, []).get(k)).push(i);
  }
  return { ...line, grid, cell };
}
// nearest sample within `reach` metres, or null
function nearest(L, x, z, reach) {
  const c = L.cell, cx = Math.floor(x / c), cz = Math.floor(z / c), n = Math.ceil(reach / c);
  let best = null, bd = reach;
  for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) {
    const list = L.grid.get(key(cx + i, cz + j));
    if (!list) continue;
    for (const k of list) {
      const s = L.samples[k], d = Math.hypot(s.x - x, s.z - z);
      if (d < bd) { bd = d; best = s; }
    }
  }
  return best ? { s: best, d: bd } : null;
}
export { nearest as nearestOnLine };

export const LAKE_LINE = indexLine(sampleLine(chaikin(LAKE_PATH), 8), 40);
export const BRIDGE_LINE = indexLine(sampleLine(chaikin(BRIDGE.pts), 3), 24);
export const WAY_LINE = indexLine(sampleLine(chaikin(TREE_WAY.pts, 2), 2), 16);

// half width of the lake along its length: wide in the middle, narrower at the ends
function lakeHalfWidth(s) {
  const t = s / LAKE_LINE.length;
  return 55 + 105 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + 15 * Math.sin(s * 0.013 + 1.2);
}
// Big fields baked once into grids over the land, then sampled bilinearly.
const G0 = -1300, GSPAN = 2600;
function bakeGrid(step, fn) {
  const n = Math.round(GSPAN / step) + 1, data = new Float32Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) data[j * n + i] = fn(G0 + i * step, G0 + j * step);
  return { n, step, data };
}
function sampleGrid(g, x, z) {
  const fx = Math.min(g.n - 1.001, Math.max(0, (x - G0) / g.step)), fz = Math.min(g.n - 1.001, Math.max(0, (z - G0) / g.step));
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, d = g.data, n = g.n;
  const a = d[j * n + i], b = d[j * n + i + 1], c = d[(j + 1) * n + i], e = d[(j + 1) * n + i + 1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + e) * u * v;
}
let lakeGrid = null;
function lakeRaw(x, z) {
  let bd = Infinity, bs = 0;
  for (const s of LAKE_LINE.samples) {
    const dx = s.x - x, dz = s.z - z, d = dx * dx + dz * dz;
    if (d < bd) { bd = d; bs = s.s; }
  }
  return Math.sqrt(bd) - lakeHalfWidth(bs) - (vnoise(x * 0.02, z * 0.02) - 0.5) * 30;
}
// signed distance to the lake shore (negative on the water)
export function lakeDistance(x, z) {
  lakeGrid ||= bakeGrid(10, lakeRaw);
  return sampleGrid(lakeGrid, x, z);
}

// --- the designed terrain ------------------------------------------------------
export function cragDistance(x, z) {
  const dx = (x - CRAG.x) / CRAG.rx, dz = (z - CRAG.z) / CRAG.rz;
  const a = Math.atan2(dz, dx);
  const wobble = 1 + Math.sin(a * 5 + 1.3) * 0.05 + Math.sin(a * 11) * 0.025;
  return (Math.hypot(dx, dz) - wobble) * Math.min(CRAG.rx, CRAG.rz);
}
function plateau(x, z, P, edge) {
  const d = Math.hypot(x - P.x, z - P.z) - P.top * (1 + 0.08 * Math.sin(Math.atan2(z - P.z, x - P.x) * 6));
  return P.y * (1 - smooth(0, edge, d));
}
function bridgeEndY(e) { return e === BRIDGE.pts[0] ? COVE.y : 1.5; }

let terrainGrid = null;
function mainTerrain(x, z) {
  terrainGrid ||= bakeGrid(5, terrainRaw);
  return sampleGrid(terrainGrid, x, z);
}
export function terrainRaw(x, z, natural = false) {
  const r = Math.hypot(x, z);
  // rolling Glowwood hills, fading down to the lake and the cove
  const n = vnoise(x * 0.006 + 3, z * 0.006) * 0.7 + vnoise(x * 0.02, z * 0.02) * 0.3;
  const ld = lakeDistance(x, z);
  let h = 8 + n * 48;
  h *= smooth(-10, 220, ld) * 0.85 + 0.15;
  // the castle crag: a sheer cliff on the lake side, a long forested slope elsewhere
  const cd = cragDistance(x, z);
  const lakeSide = smooth(-120, 40, x) * smooth(40, 160, z);
  const fall = 26 + 210 * (1 - lakeSide);
  if (cd < 0) h = CRAG.y;
  else h = Math.max(h, CRAG.y * (1 - smooth(0, fall, cd)) + h * smooth(0, fall, cd) * 0.6);
  // other high ground
  h = Math.max(h, plateau(x, z, TEMPLE_HILL, 90), plateau(x, z, ROSE_CRAG, 45));
  // cliffs behind the cove
  const cv = Math.hypot(x - COVE.x + 60, z - COVE.z - 70);
  h += 55 * smooth(150, 40, cv) * smooth(40, 90, Math.hypot(x - COVE.x, z - COVE.z));
  // the mountain rim
  if (r > 1020) h += Math.pow(Math.min(1.25, (r - 1020) / 230), 1.6) * (320 + vnoise(x * 0.01, z * 0.01) * 260);
  // Lagoon City sits on a level shore terrace
  const dl = Math.hypot(x - LAGOON.x, z - LAGOON.z);
  if (dl < LAGOON.r + 70) h = LAGOON.y + (h - LAGOON.y) * smooth(LAGOON.r, LAGOON.r + 70, dl);
  // the lake basin
  if (ld < 0) h = Math.min(h, -9 * smooth(0, 70, -ld));
  else if (ld < 30) h = Math.min(h, h * smooth(0, 30, ld) + 1.2 * (1 - smooth(0, 30, ld)));
  // the cove dais and its beach
  const dc = Math.hypot(x - COVE.x, z - COVE.z);
  if (dc < 60) h = h + (COVE.y - h) * (1 - smooth(COVE.r, 60, dc));
  if (natural) return h;
  // the Giant-Tree Way is cut and filled into the slope
  const w = nearest(WAY_LINE, x, z, TREE_WAY.hw + 26);
  if (w) h = h + (w.s.y - 0.4 - h) * (1 - smooth(TREE_WAY.hw, TREE_WAY.hw + 26, w.d));
  // bridge landings
  for (const e of [BRIDGE.pts[0], BRIDGE.pts[BRIDGE.pts.length - 1]]) {
    const de = Math.hypot(x - e[0], z - e[1]);
    if (de < 40) h = h + (bridgeEndY(e) - 0.3 - h) * (1 - smooth(14, 40, de));
  }
  return h;
}

// Terrain height (without built things).
export function terrainHeight(isl, x, z) {
  if (isl.main) return mainTerrain(x, z);
  if (!FLAT.length) initFlat();
  const n = vnoise(x * 0.028 + isl.x, z * 0.028 + isl.z) * 0.75 + vnoise(x * 0.09, z * 0.09) * 0.25;
  const rim = smooth(isl.r, isl.r - 12, Math.hypot(x - isl.x, z - isl.z));
  let d = Infinity;
  for (const f of FLAT) d = Math.min(d, Math.hypot(x - f.x, z - f.z) - f.r);
  return Math.max(0, n - 0.25) * 6 * 1.35 * rim * smooth(0, 14, d);
}
// level spots on the floating islands (portals, pond, landmarks)
const FLAT = [];
function initFlat() {
  FLAT.push({ x: LAKE_POND.x, z: LAKE_POND.z, r: LAKE_POND.r + 4 });
  for (const p of RETURNS) FLAT.push({ x: p.x, z: p.z, r: 9 });
  const by = Object.fromEntries(ISLANDS.map((i) => [i.id, i]));
  FLAT.push({ x: by.aurora.x, z: by.aurora.z, r: 10 }, { x: by.lake.x + 26, z: by.lake.z - 10, r: 8 }, { x: by.star.x, z: by.star.z - 6, r: 9 });
}

// Ground colour as HSL: sunny and cool greens, rock on steep ground and the rim.
const ISLE_HUE = { castle: 0.31, garden: 0.34, aurora: 0.38, lake: 0.29, meadow: 0.27, star: 0.35 };
export function groundHSL(isl, x, z, h) {
  const big = vnoise(x * 0.035 + 50, z * 0.035 + 9);
  const small = vnoise(x * 0.16, z * 0.16);
  const hue = (ISLE_HUE[isl.id] ?? 0.28) - big * 0.055 + (small - 0.5) * 0.025 - (isl.main ? 0 : h * 0.002);
  const sat = 0.64 + big * 0.14;
  const light = 0.31 + big * 0.13 + (isl.main ? 0 : Math.min(h, 12) * 0.008) + (small - 0.5) * 0.05;
  if (isl.main) {
    // steep slopes and the high rim go to lilac rock; lake shores to pale sand
    const e = 3, s = Math.hypot(mainTerrain(x + e, z) - mainTerrain(x - e, z), mainTerrain(x, z + e) - mainTerrain(x, z - e)) / (2 * e);
    const rock = Math.max(smooth(0.9, 1.6, s), smooth(150, 260, h));
    const sand = smooth(5, 1, h) * smooth(-2, 0, h);
    const mix = (a, b, t) => a + (b - a) * t;
    return [mix(mix(hue, 0.08, sand), 0.74, rock), mix(mix(sat, 0.45, sand), 0.18, rock), mix(mix(light, 0.62, sand), 0.42 + small * 0.08, rock)];
  }
  return [hue, sat, light];
}

// Height of built things: bridge deck, the tree way, terraces and grand stairs.
// Returns null where the natural ground applies.
// Level walkable platforms added by builders (palace podium, spur bridges):
// oriented rectangles { x, z, hw, hd, a, y }.
export const PADS = [];
export function addPad(p) { PADS.push({ ...p, c: Math.cos(p.a || 0), s: Math.sin(p.a || 0) }); }
export function builtHeight(x, z) {
  for (const p of PADS) {
    const dx = x - p.x, dz = z - p.z, u = dx * p.c - dz * p.s, v = dx * p.s + dz * p.c;
    if (Math.abs(u) <= p.hw && Math.abs(v) <= p.hd) return p.y;
  }
  const b = nearest(BRIDGE_LINE, x, z, BRIDGE.hw + 0.5);
  if (b && b.d <= BRIDGE.hw) {
    const L = BRIDGE_LINE.length, s = b.s.s;
    const y0 = bridgeEndY(BRIDGE.pts[0]), y1 = bridgeEndY(BRIDGE.pts[BRIDGE.pts.length - 1]);
    if (s < BRIDGE.ramp) return y0 + (BRIDGE.y - y0) * (s / BRIDGE.ramp);
    if (s > L - BRIDGE.ramp) return y1 + (BRIDGE.y - y1) * ((L - s) / BRIDGE.ramp);
    return BRIDGE.y;
  }
  const w = nearest(WAY_LINE, x, z, TREE_WAY.hw + 0.5);
  if (w && w.d <= TREE_WAY.hw) return w.s.y;
  const ax = Math.abs(x - CASTLE.x);
  let prev = CRAG.y;
  for (const T of TERRACES) {
    const zs = T.front + STAIR.run;
    if (ax <= STAIR.hw && z <= zs && z >= T.front) return prev + (T.y - prev) * Math.round(((zs - z) / STAIR.run) * 12) / 12;
    prev = T.y;
  }
  for (let k = TERRACES.length - 1; k >= 0; k--) {
    const T = TERRACES[k];
    if (ax <= T.hw && z <= T.front && z >= TERRACE_REAR) return T.y;
  }
  return null;
}

export function groundAt(x, z, y = 0) {
  const isl = islandAt(x, z, y);
  if (!isl) return null;
  if (isl.id === 'lake') {
    const dx = x - LAKE_POND.x, dz = z - LAKE_POND.z;
    if (dx * dx + dz * dz < LAKE_POND.r * LAKE_POND.r) return isl.y - 0.3;
  }
  if (isl.main) {
    const b = builtHeight(x, z);
    if (b !== null) return b;
    return Math.max(mainTerrain(x, z), -1.1);        // wade through the shallows of the lake
  }
  return isl.y + terrainHeight(isl, x, z);
}

// Push a point of radius `pr` out of every collider. Mutates pos.
export function resolveCollisions(pos, pr = 0.5) {
  for (const c of COLLIDERS) {
    if (c.y0 !== undefined && (pos.y < c.y0 - 1 || pos.y > c.y1)) continue;
    if (c.r !== undefined) {
      const dx = pos.x - c.x, dz = pos.z - c.z;
      if (Math.abs(dx) > c.r + pr || Math.abs(dz) > c.r + pr) continue;
      const d = Math.hypot(dx, dz), min = c.r + pr;
      if (d < min && d > 1e-4) { pos.x = c.x + (dx / d) * min; pos.z = c.z + (dz / d) * min; }
    } else {
      // axis-aligned box {minX,maxX,minZ,maxZ}
      if (pos.x > c.minX - pr && pos.x < c.maxX + pr && pos.z > c.minZ - pr && pos.z < c.maxZ + pr) {
        const pushes = [
          [c.minX - pr - pos.x, 0], [c.maxX + pr - pos.x, 0],
          [0, c.minZ - pr - pos.z], [0, c.maxZ + pr - pos.z],
        ];
        pushes.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
        pos.x += pushes[0][0]; pos.z += pushes[0][1];
      }
    }
  }
}

// Places where trees and decorations must not be put (main land and islands).
export function isClearOfBuildings(x, z, margin = 0, y = 0) {
  for (const p of RETURNS) if (Math.hypot(x - p.x, z - p.z) < 8 + margin) return false;
  if (islandAt(x, z, y) !== MAIN) {
    return Math.hypot(x - LAKE_POND.x, z - LAKE_POND.z) >= LAKE_POND.r + 4 + margin;
  }
  if (x * x + z * z > 1030 * 1030) return false;
  if (lakeDistance(x, z) < 3 + margin) return false;
  if (nearest(BRIDGE_LINE, x, z, BRIDGE.hw + 6 + margin)) return false;
  if (nearest(WAY_LINE, x, z, TREE_WAY.hw + 2 + margin)) return false;
  if (cragDistance(x, z) < 6 + margin) {
    if (Math.abs(x) < TERRACES[0].hw + 6 + margin && z < TERRACES[0].front + STAIR.run + 6 + margin && z > TERRACE_REAR - 8) return false;
    if (Math.hypot(x - PLAZA.x, z - PLAZA.z) < PLAZA.r + 6 + margin) return false;
  }
  for (const p of PORTALS) if (Math.hypot(x - p.x, z - p.z) < 10 + margin) return false;
  if (Math.hypot(x - COVE.x, z - COVE.z) < COVE.r + 8 + margin) return false;
  if (Math.hypot(x - LAGOON.x, z - LAGOON.z) < LAGOON.r + margin) return false;
  for (const p of PADS) if (Math.hypot(x - p.x, z - p.z) < Math.max(p.hw, p.hd) + margin) return false;
  for (const t of THOLOI) if (Math.hypot(x - t.x, z - t.z) < 10 + margin) return false;
  if (Math.hypot(x - WHEEL.x, z - WHEEL.z) < 14 + margin) return false;
  if (Math.hypot(x - RUNES.x, z - RUNES.z) < RUNES.r + 3 + margin) return false;
  return true;
}

// Where small life (trees, shrubs, flowers, collectables) goes on the main land:
// around the places people walk, since the land is far too big to fill evenly.
export const MAIN_ZONES = [
  { x: COVE.x, z: COVE.z, r: 90 },
  { x: -120, z: 60, r: 170 },          // crag top round the castle
  { x: -200, z: 200, r: 110 },         // along the Giant-Tree Way
  { x: -600, z: 640, r: 90 }, { x: -320, z: 420, r: 80 }, { x: -880, z: 760, r: 80 },  // lake shores
  { x: LAGOON.x - 60, z: LAGOON.z - 130, r: 90 },
  { x: TEMPLE_HILL.x, z: TEMPLE_HILL.z, r: 110 },
];
export function randomOnIsland(isl, r, minEdge = 4) {
  if (!isl.main) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (isl.r - minEdge);
    return [isl.x + Math.cos(a) * d, isl.z + Math.sin(a) * d];
  }
  const Z = MAIN_ZONES[Math.floor(r() * MAIN_ZONES.length)];
  const a = r() * Math.PI * 2, d = Math.sqrt(r()) * Z.r;
  return [Z.x + Math.cos(a) * d, Z.z + Math.sin(a) * d];
}
// the main land counts as an island of this radius when sharing out small life
export const MAIN_SHARE_R = 150;
