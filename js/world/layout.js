// The shape of the world: the Starlight Coast (owner sketch sheet 04,
// art-references/owner-sketch-spec.md). A 7.5 km island coast in an open sea,
// with the Princess Palace (B01) raised at the origin, garden terraces stepping
// down to Lantern Lake, and one straight golden causeway from the Bridge
// Pavilions (B20, where everyone arrives) north across the lake to the gate.
// Metres; north is -z. This module answers the ground and collision queries.

// --- the palace and its approach --------------------------------------------------
// Palace heights are the drawn heights of build sheet B01 times H_SCALE: the owner
// chose the labelled heights (spires 840, 960 and 1100 m), so H_SCALE is 2.75.
export const H_SCALE = 2.75;
export const PAL = { x: 0, z: 0, y: 40, hw: 400, hd: 340 };           // 800 x 680 m plan, front at z = +340
// The Rose Gate (A003) opens 75 m wide in the main front above the arcaded podium;
// the cascade stair climbs to its landing up twin flights beside a water stair.
export const GATE = { w: 75, h: 100 * H_SCALE, sill: 45 * H_SCALE };
export const CASTLE = { x: 0, z: PAL.hd, y: PAL.y + GATE.sill, base: PAL.y };   // z: gate plane, y: gate sill
export const LANDING = { hw: 84, z0: PAL.hd, z1: 382, y: PAL.y + GATE.sill };
export const CASCADE = { z0: LANDING.z1, z1: 536, xs: [-56, 56], hw: 16 };
// The roof is all gardens, stepping up to the north (sheet 03): [z0, z1, height above the base]
export const ROOF = [[180, PAL.hd, 155 * H_SCALE], [20, 180, 170 * H_SCALE], [-160, 20, 185 * H_SCALE], [-PAL.hd, -160, 200 * H_SCALE]];
export function roofY(z) { for (const [z0, z1, y] of ROOF) if (z >= z0 && z <= z1) return PAL.y + y; return null; }
// G04 terrace gardens from the gate down to the lake (sheet 15): upper, middle, lower
export const TERRACES = [
  { name: 'upper', y: PAL.y, z0: PAL.hd, z1: 560, hw: 470 },
  { name: 'middle', y: 24, z0: 560, z1: 720, hw: 520 },
  { name: 'lower', y: 8, z0: 720, z1: 880, hw: 560 },
];
// flights of the grand stair between the terraces: [z top, z bottom, y top, y bottom, half width]
export const STAIRS = [
  [560, 592, 40, 24, 30], [720, 752, 24, 8, 30],                     // centre, either side of the water stair
  ...[-1, 1].flatMap((s) => [[560, 592, 40, 24, 12, s * 330], [720, 752, 24, 8, 12, s * 380]]),
];
export const CAUSEWAY = { x: 0, z0: 880, z1: 2262, hw: 15, y: 6 };
export const B20 = { x: 0, z: 2335, r: 72, y: 5 };                      // Bridge Pavilions plaza: the spawn
export const SPAWN = { x: 0, z: 2350 };
export const PLAZA = { x: 0, z: 548, y: PAL.y, r: 14 };                // the cascade's lotus basin at the stair foot
export const LAKE = { x: -150, z: 1500, rx: 1650, rz: 620, y: 0 };
export const SEA_Y = 0;
// arched bridges from the causeway to the two lake islands
export const BRANCHES = [
  { to: 'B02', pts: [[-CAUSEWAY.hw, 1320], [-480, 1320]], hw: 6, y: 6, hump: 6 },
  { to: 'B03', pts: [[CAUSEWAY.hw, 1410], [628, 1410]], hw: 6, y: 6, hump: 6 },
];

// --- the districts (sheet 04 table), with the ground each one stands on -----------------
// pad: flattened ground { r, y, e (blend width) }
export const SITES = {
  B02: { name: 'Moon Water Palace', x: -630, z: 1320, pad: { r: 150, y: 5, e: 30 } },
  B03: { name: 'Star Chapel', x: 750, z: 1410, pad: { r: 140, y: 5, e: 30 } },
  B04: { name: 'Rose Keep', x: -960, z: -540, pad: { r: 70, y: 95, e: 150 } },
  B05: { name: 'Misty Keep', x: 1020, z: -900, pad: { r: 70, y: 210, e: 260 } },
  B06: { name: 'Pagoda', x: 1050, z: -420, pad: { r: 70, y: 55, e: 160 } },
  B07: { name: 'Temple Rotundas', x: -30, z: -1260, pad: { r: 190, y: 75, e: 200 } },
  B08: { name: 'Colosseum', x: -1020, z: -1140, pad: { r: 170, y: 60, e: 180 } },
  B09: { name: 'Lagoon City', x: -2460, z: 1200, pad: { r: 120, y: 4, e: 25 } },
  B10: { name: 'Canyon Palace', x: 1560, z: 1560, pad: { r: 90, y: 10, e: 40 } },
  B11: { name: 'Crescent Arch', x: 2640, z: 1920, pad: { r: 120, y: 6, e: 150 } },
  B12: { name: 'Storybook Village', x: -2400, z: 780, pad: { r: 200, y: 7, e: 150 } },
  B13: { name: 'Windmill', x: -2190, z: 240, pad: { r: 60, y: 48, e: 160 } },
  B14: { name: 'Pillar Sky City', x: 2220, z: 240, pad: { r: 300, y: 20, e: 200 } },
  B15: { name: 'Jungle Temple', x: 1860, z: 2580, pad: { r: 140, y: 30, e: 160 } },
  B16: { name: 'Fjord Longhouse', x: -2200, z: -900, pad: { r: 90, y: 8, e: 120 } },
  B17: { name: 'Glowwood Ruin', x: -2040, z: -300, pad: { r: 110, y: 38, e: 160 } },
  B18: { name: 'Mother Tree', x: -1320, z: 1800, pad: { r: 150, y: 5, e: 60 } },
  B19: { name: 'Lantern Cove', x: -1650, z: 2180, pad: { r: 120, y: 4, e: 80 } },
  B20: { name: 'Bridge Pavilions', x: B20.x, z: B20.z, pad: { r: 110, y: B20.y, e: 120 } },
  B21: { name: 'Tidal Observatory', x: -2580, z: 2760, pad: { r: 100, y: 26, e: 140 } },
  B22: { name: 'Lighthouse', x: -1920, z: 3180, pad: { r: 70, y: 10, e: 50 } },
  B23: { name: 'Sea Pavilion', x: 1620, z: 3480, pad: { r: 110, y: 4, e: 100 } },
  B24: { name: 'Reef Shrine', x: 2940, z: 3120, pad: { r: 60, y: 2.5, e: 40 } },
  B25: { name: 'Crystal Conservatory', x: -420, z: -540, pad: { r: 80, y: 40, e: 40 } },
};
const EXTRA_PADS = [
  { x: -2650, z: 1050, r: 70, y: 4, e: 25 }, { x: -2330, z: 1380, r: 60, y: 4, e: 25 },   // Lagoon City islets
];

// --- floating islands, reached by sky portals ------------------------------------------
export const ISLANDS = [
  { id: 'castle', name: 'Starlight Coast', x: 0, z: 0, y: 0, r: 5200, main: true },
  { id: 'garden', name: 'Crystal Garden', x: 1560, z: -1680, y: 520, r: 76, hue: 0.52 },
  { id: 'aurora', name: 'Aurora Isle', x: -3240, z: -1500, y: 600, r: 64, hue: 0.42 },
  { id: 'lake', name: 'Lantern Isle', x: -1100, z: 3000, y: 450, r: 88, hue: 0.12 },
  { id: 'meadow', name: 'Unicorn Meadow', x: 2760, z: 4320, y: 420, r: 80, hue: 0.85 },
  { id: 'star', name: 'Starfall Isle', x: -180, z: -2280, y: 680, r: 60, hue: 0.62 },
];
export const MAIN = ISLANDS[0];
const SKY = ISLANDS.filter((i) => !i.main);
export const LAKE_POND = { x: ISLANDS[3].x, z: ISLANDS[3].z, r: 22 };

// Sky portals stand in a row on the upper terrace before the palace.
const PORTAL_X = { lake: -420, aurora: -330, garden: 330, star: 420, meadow: 240 };
export const PORTALS = SKY.map((isl) => {
  const x = PORTAL_X[isl.id], z = 520;
  return { to: isl.id, name: isl.name, x, z, y: PAL.y, angle: Math.atan2(isl.z - z, isl.x - x) };
});
export const RETURNS = SKY.map((isl) => {
  const a = Math.atan2(-isl.z, -isl.x), d = isl.r - 10;
  return { from: isl.id, x: isl.x + Math.cos(a) * d, z: isl.z + Math.sin(a) * d, y: isl.y, angle: a };
});

// Solid things the player bumps into: circles { x, z, r } and boxes, with an optional y0..y1 band.
export const COLLIDERS = [];
export function addCollider(c) { COLLIDERS.push(c); }

export function islandAt(x, z, y = 0) {
  for (const isl of SKY) {
    const dx = x - isl.x, dz = z - isl.z;
    if (dx * dx + dz * dz < isl.r * isl.r && y > isl.y - 6) return isl;
  }
  return MAIN;
}

// --- noise ------------------------------------------------------------------------
function h2(x, z) { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = h2(ix, iz), b = h2(ix + 1, iz), c = h2(ix, iz + 1), d = h2(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const ridge = (x, z) => 1 - Math.abs(2 * vnoise(x, z) - 1);

// --- the coastline ------------------------------------------------------------------
// Traced from sheet 04, clockwise from the north-west.
const COAST = [
  [-2700, -1800], [-1800, -2350], [-700, -2500], [500, -2450], [1500, -2250], [2350, -1850], [2900, -1150],
  [3150, -350], [3050, 450], [2850, 1150], [3050, 1850], [2950, 2550], [2500, 3050], [2050, 3550], [1500, 3750],
  [1050, 3350], [850, 2850], [450, 2700], [0, 2640], [-600, 2700], [-1250, 2640], [-1700, 2580], [-2000, 2720],
  [-2300, 3000], [-2800, 2980], [-3000, 2450], [-3050, 1800], [-3250, 1200], [-3150, 600], [-3350, 0],
  [-3250, -700], [-3050, -1300],
];
function coastRaw(x, z) {
  let inside = false, best = Infinity;
  for (let i = 0, j = COAST.length - 1; i < COAST.length; j = i++) {
    const [ax, az] = COAST[j], [bx, bz] = COAST[i];
    if ((az > z) !== (bz > z) && x < ax + ((z - az) * (bx - ax)) / (bz - az)) inside = !inside;
    const ex = bx - ax, ez = bz - az, t = Math.min(1, Math.max(0, ((x - ax) * ex + (z - az) * ez) / (ex * ex + ez * ez)));
    best = Math.min(best, Math.hypot(x - ax - ex * t, z - az - ez * t));
  }
  return inside ? best : -best;
}

// carved water: lagoon, coves and the fjord, as line segments with a half width
const CARVES = [
  { a: [-2550, 1250], b: [-2550, 1250], r: 380 },                  // B09 lagoon
  { a: [-2850, 1250], b: [-3500, 1250], r: 90 },                   // its mouth to the sea
  { a: [-1650, 2420], b: [-1650, 2900], r: 230 },                  // B19 Lantern Cove harbour
  { a: [-3600, -1300], b: [-2330, -1020], r: 110 },                // B16 fjord
  { a: [2500, 1850], b: [3300, 1850], r: 70 },                     // the inlet under the Crescent Arch
];
function segDist(x, z, a, b) {
  const ex = b[0] - a[0], ez = b[1] - a[1], L = ex * ex + ez * ez;
  const t = L ? Math.min(1, Math.max(0, ((x - a[0]) * ex + (z - a[1]) * ez) / L)) : 0;
  return Math.hypot(x - a[0] - ex * t, z - a[1] - ez * t);
}

// the B10 red canyon: a mesa cut by a winding gorge
const CANYON = { x: 1600, z: 1600, r: 430, top: 95, gorge: [[1230, 1330], [1480, 1500], [1640, 1620], [1960, 1900]], hw: 55 };

// offshore sea stacks, scattered along the coast
const STACKS = [];
{
  let s = 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let k = 0; k < 46; k++) {
    const i = Math.floor(rnd() * COAST.length), [ax, az] = COAST[i], [bx, bz] = COAST[(i + 1) % COAST.length];
    const t = rnd(), ex = bx - ax, ez = bz - az, L = Math.hypot(ex, ez);
    const off = 160 + rnd() * 420;                                  // outward normal of a clockwise ring is (-ez, ex)
    STACKS.push({ x: ax + ex * t - (ez / L) * off, z: az + ez * t + (ex / L) * off, r: 18 + rnd() * 40, h: 25 + rnd() * 70 });
  }
}

const PAD_LIST = [...Object.values(SITES).map((s) => ({ x: s.x, z: s.z, ...s.pad })), ...EXTRA_PADS];

// signed distance to the lake shore (negative on the water)
export function lakeDistance(x, z) {
  const dx = (x - LAKE.x) / LAKE.rx, dz = (z - LAKE.z) / LAKE.rz;
  return (Math.hypot(dx, dz) - 1) * LAKE.rz + (vnoise(x * 0.004, z * 0.004) - 0.5) * 140 + (vnoise(x * 0.015, z * 0.015) - 0.5) * 30;
}

// the palace plateau and the terraces: [ground y or null, blend 0..1]
function palaceGround(x, z) {
  const ax = Math.abs(x);
  // the plateau the palace stands on, with B25 beside it
  const dx = Math.max(0, ax - 470), dz = Math.max(0, -420 - z, z - PAL.hd);
  const d = Math.hypot(dx, dz);
  if (z <= PAL.hd + 2 && d < 260) return [PAL.y - 0.4, 1 - smooth(0, 260, d)];
  for (const T of TERRACES) {
    if (z > T.z0 - 2 && z <= T.z1 + 2) {
      const e = Math.max(0, ax - T.hw);
      if (e < 200) return [T.y - 0.4, 1 - smooth(0, 200, e)];
    }
  }
  return [null, 0];
}

export function terrainRaw(x, z) {
  let d = coastRaw(x, z) + (vnoise(x * 0.0022, z * 0.0022) - 0.5) * 260 + (vnoise(x * 0.009, z * 0.009) - 0.5) * 70;
  for (const c of CARVES) d = Math.min(d, segDist(x, z, c.a, c.b) - c.r - (vnoise(x * 0.01, z * 0.01) - 0.5) * 60);
  let h;
  if (d < 0) h = -16 * smooth(0, -300, d) - 30 * smooth(-300, -1500, d) - 0.8 * smooth(0, -30, d);
  else {
    const inland = smooth(60, 600, d);
    const hills = vnoise(x * 0.0018 + 7, z * 0.0018) * 0.6 + vnoise(x * 0.006, z * 0.006) * 0.3 + vnoise(x * 0.02, z * 0.02) * 0.1;
    h = 2.2 * smooth(-20, 110, d) + inland * (6 + hills * 60);
    // the mountain spine in the north and north-west, high ground in the north-east
    const M = Math.max(smooth(-1300, -2000, z), smooth(-1800, -2700, x) * smooth(700, -300, z) * 0.9, smooth(2200, 2900, x) * smooth(700, -800, z) * 0.6);
    if (M > 0) {
      const r1 = ridge(x * 0.0011, z * 0.0011), r2 = ridge(x * 0.003 + 3, z * 0.003);
      h += M * inland * (110 + 380 * r1 * r1 + 90 * r2);
    }
  }
  for (const s of STACKS) {
    const q = Math.hypot(x - s.x, z - s.z);
    if (q < s.r * 2) h = Math.max(h, s.h * (1 - smooth(s.r * 0.6, s.r * 2, q)) - 8);
  }
  // Lantern Lake
  const ld = lakeDistance(x, z);
  if (ld < 170) h = lerp(-0.8 - 11 * smooth(0, -280, ld), Math.max(h, 1.4), smooth(-10, 170, ld));
  // the red canyon mesa and its gorge
  const cd = Math.hypot(x - CANYON.x, z - CANYON.z);
  if (cd < CANYON.r + 200) {
    const n = vnoise(x * 0.012, z * 0.012);
    h = lerp(h, CANYON.top + n * 30 + Math.floor(n * 4) * 8, 1 - smooth(CANYON.r - 60, CANYON.r + 120 + n * 60, cd));
    let g = Infinity;
    for (let i = 0; i < CANYON.gorge.length - 1; i++) g = Math.min(g, segDist(x, z, CANYON.gorge[i], CANYON.gorge[i + 1]));
    h = lerp(10, h, smooth(CANYON.hw, CANYON.hw + 30, g));
  }
  // flat ground under each district
  for (const p of PAD_LIST) {
    const q = Math.hypot(x - p.x, z - p.z);
    if (q < p.r + p.e) h = lerp(p.y - 0.3, h, smooth(p.r, p.r + p.e, q));
  }
  // B20 shore: the causeway's south end lands on a broad flat shore
  if (Math.abs(x) < 200 && z > 2150 && z < 2480) h = lerp(h, B20.y - 0.3, 1 - smooth(120, 200, Math.abs(x)));
  const [py, pb] = palaceGround(x, z);
  if (py !== null) h = lerp(h, py, pb);
  return h;
}

// --- the baked height grid ---------------------------------------------------------------
const GX0 = -4800, GZ0 = -3400, GSPAN = 9600, GSTEP = 12, GN = GSPAN / GSTEP + 1;
let grid = null;
function bake() {
  grid = new Float32Array(GN * GN);
  for (let j = 0; j < GN; j++) for (let i = 0; i < GN; i++) grid[j * GN + i] = terrainRaw(GX0 + i * GSTEP, GZ0 + j * GSTEP);
}
export const TERRAIN_GRID = { x0: GX0, z0: GZ0, span: GSPAN, step: GSTEP, n: GN, get data() { if (!grid) bake(); return grid; } };
function mainTerrain(x, z) {
  if (!grid) bake();
  const fx = Math.min(GN - 1.001, Math.max(0, (x - GX0) / GSTEP)), fz = Math.min(GN - 1.001, Math.max(0, (z - GZ0) / GSTEP));
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, n = GN;
  const a = grid[j * n + i], b = grid[j * n + i + 1], c = grid[(j + 1) * n + i], e = grid[(j + 1) * n + i + 1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + e) * u * v;
}

export function terrainHeight(isl, x, z) {
  if (isl.main) return mainTerrain(x, z);
  const n = vnoise(x * 0.028 + isl.x, z * 0.028 + isl.z) * 0.75 + vnoise(x * 0.09, z * 0.09) * 0.25;
  const rim = smooth(isl.r, isl.r - 14, Math.hypot(x - isl.x, z - isl.z));
  let d = Math.hypot(x - LAKE_POND.x, z - LAKE_POND.z) - LAKE_POND.r - 4;
  for (const p of RETURNS) d = Math.min(d, Math.hypot(x - p.x, z - p.z) - 10);
  d = Math.min(d, Math.hypot(x - isl.x, z - isl.z) - 12);
  return Math.max(0, n - 0.25) * 8 * rim * smooth(0, 14, d);
}

// forest cover 0..1: woods everywhere inland, thinning on high rock and round the districts
export function forestAt(x, z, h = mainTerrain(x, z)) {
  if (h < 3 || h > 330) return 0;
  let f = smooth(0.38, 0.58, vnoise(x * 0.0035 + 11, z * 0.0035 - 4) * 0.7 + vnoise(x * 0.015, z * 0.015) * 0.3);
  f *= smooth(330, 240, h);
  if (Math.abs(x) < 700 && z > -700 && z < 950) f = 0;                   // palace grounds
  if (Math.abs(x) < 260 && z > 2100 && z < 2550) f = 0;                  // spawn shore
  if (Math.hypot(x - CANYON.x, z - CANYON.z) < CANYON.r + 80) f *= 0.15;
  for (const p of PAD_LIST) if (Math.hypot(x - p.x, z - p.z) < p.r + 30) return 0;
  return f;
}

// Ground colour as HSL: meadow and forest greens, sand on beaches, lilac rock, snow, red canyon.
const ISLE_HUE = { castle: 0.3, garden: 0.34, aurora: 0.38, lake: 0.29, meadow: 0.27, star: 0.35 };
export function groundHSL(isl, x, z, h) {
  const big = vnoise(x * 0.012 + 50, z * 0.012 + 9), small = vnoise(x * 0.08, z * 0.08);
  let H = (ISLE_HUE[isl.id] ?? 0.28) - big * 0.05 + (small - 0.5) * 0.025;
  let S = 0.6 + big * 0.14, L = 0.33 + big * 0.12 + (small - 0.5) * 0.05;
  if (!isl.main) return [H, S, L];
  const e = 6, s = Math.hypot(mainTerrain(x + e, z) - mainTerrain(x - e, z), mainTerrain(x, z + e) - mainTerrain(x, z - e)) / (2 * e);
  const f = forestAt(x, z, h);
  H = lerp(H, 0.33, f * 0.6); L = lerp(L, 0.2 + big * 0.06, f * 0.8); S = lerp(S, 0.55, f * 0.5);
  const sand = smooth(4.5, 2, h) * (h > -6 ? 1 : 0.6);
  H = lerp(H, 0.11, sand); S = lerp(S, 0.42, sand); L = lerp(L, 0.72 + small * 0.06, sand);
  const rock = Math.max(smooth(0.75, 1.3, s), smooth(220, 340, h));
  H = lerp(H, 0.74, rock); S = lerp(S, 0.16, rock); L = lerp(L, 0.46 + small * 0.08, rock);
  const snow = smooth(470, 560, h + small * 40);
  H = lerp(H, 0.66, snow); S = lerp(S, 0.12, snow); L = lerp(L, 0.92, snow);
  const cd = Math.hypot(x - CANYON.x, z - CANYON.z);
  if (cd < CANYON.r + 160) {
    const t = smooth(CANYON.r + 160, CANYON.r, cd) * smooth(12, 25, h);
    H = lerp(H, 0.025 + big * 0.02, t); S = lerp(S, 0.55, t); L = lerp(L, 0.42 + Math.sin(h * 0.3) * 0.05, t);
  }
  return [H, S, L];
}

// --- built ground: terraces, stairs, causeway, bridges, plazas ---------------------------------
// Level walkable platforms added by builders: oriented rectangles { x, z, hw, hd, a, y, y0? }.
// y0 limits a pad to walkers standing above it (roof gardens over the palace).
export const PADS = [];
export function addPad(p) { PADS.push({ ...p, c: Math.cos(p.a || 0), s: Math.sin(p.a || 0) }); }
export function causewayY(z) {
  if (z < CAUSEWAY.z0 + 24) return lerp(TERRACES[2].y, CAUSEWAY.y, (z - CAUSEWAY.z0) / 24);
  if (z > CAUSEWAY.z1 - 30) return lerp(CAUSEWAY.y, B20.y, (z - CAUSEWAY.z1 + 30) / 30);
  return CAUSEWAY.y;
}
export function branchY(B, t) { return B.y + B.hump * Math.sin(Math.PI * t); }
export function builtHeight(x, z, y = 0) {
  for (const p of PADS) {
    if (p.y0 !== undefined && y < p.y0) continue;
    const dx = x - p.x, dz = z - p.z, u = dx * p.c - dz * p.s, v = dx * p.s + dz * p.c;
    if (Math.abs(u) <= p.hw && Math.abs(v) <= p.hd) return p.y;
  }
  const ax = Math.abs(x);
  // up on the palace roof gardens
  if (y > PAL.y + 300 && ax <= PAL.hw && Math.abs(z) <= PAL.hd) return roofY(z);
  if (ax <= LANDING.hw && z >= LANDING.z0 && z <= LANDING.z1) return LANDING.y;
  for (const cx of CASCADE.xs) if (Math.abs(x - cx) <= CASCADE.hw && z > CASCADE.z0 && z <= CASCADE.z1) return lerp(LANDING.y, PAL.y, (z - CASCADE.z0) / (CASCADE.z1 - CASCADE.z0));
  if (ax <= CAUSEWAY.hw && z >= CAUSEWAY.z0 && z <= CAUSEWAY.z1) return causewayY(z);
  for (const B of BRANCHES) {
    const [[x0, z0], [x1, z1]] = B.pts;
    if (Math.abs(z - z0) <= B.hw && (x - x0) * (x - x1) <= 0) return branchY(B, (x - x0) / (x1 - x0));
  }
  if (Math.hypot(x - B20.x, z - B20.z) <= B20.r) return B20.y;
  for (const [za, zb, ya, yb, hw, cx = 0] of STAIRS) if (z >= za && z <= zb && Math.abs(x - cx) <= hw) return lerp(ya, yb, (z - za) / (zb - za));
  for (const T of TERRACES) if (z >= T.z0 && z <= T.z1 && ax <= T.hw) return T.y;
  return null;
}

export function groundAt(x, z, y = 0) {
  const isl = islandAt(x, z, y);
  if (!isl.main) {
    if (isl.id === 'lake' && Math.hypot(x - LAKE_POND.x, z - LAKE_POND.z) < LAKE_POND.r) return isl.y - 0.3;
    return isl.y + terrainHeight(isl, x, z);
  }
  const b = builtHeight(x, z, y);
  if (b !== null) return b;
  return Math.max(mainTerrain(x, z), -1.1);                    // wade through the shallows
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
    } else if (pos.x > c.minX - pr && pos.x < c.maxX + pr && pos.z > c.minZ - pr && pos.z < c.maxZ + pr) {
      const pushes = [[c.minX - pr - pos.x, 0], [c.maxX + pr - pos.x, 0], [0, c.minZ - pr - pos.z], [0, c.maxZ + pr - pos.z]];
      pushes.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
      pos.x += pushes[0][0]; pos.z += pushes[0][1];
    }
  }
}

// Places where trees and decorations must not be put.
export function isClearOfBuildings(x, z, margin = 0, y = 0) {
  for (const p of RETURNS) if (Math.hypot(x - p.x, z - p.z) < 10 + margin) return false;
  const isl = islandAt(x, z, y);
  if (!isl.main) return Math.hypot(x - LAKE_POND.x, z - LAKE_POND.z) >= LAKE_POND.r + 4 + margin && Math.hypot(x - isl.x, z - isl.z) > 14 + margin;
  if (mainTerrain(x, z) < 1.5 + margin * 0.1) return false;
  const ax = Math.abs(x);
  if (ax < PAL.hw + 30 + margin && z > -PAL.hd - 30 - margin && z < PAL.hd + 60 + margin) return false;
  if (ax < CAUSEWAY.hw + 10 + margin && z > PAL.hd && z < CAUSEWAY.z1 + 10) return false;
  if (ax < 70 + margin && z > PAL.hd && z < 900) return false;                   // water stair and grand stair
  for (const [za, zb, , , hw, cx = 0] of STAIRS) if (z > za - 6 - margin && z < zb + 6 + margin && Math.abs(x - cx) < hw + 6 + margin) return false;
  for (const p of PORTALS) if (Math.hypot(x - p.x, z - p.z) < 14 + margin) return false;
  if (Math.hypot(x - PLAZA.x, z - PLAZA.z) < 60 + margin) return false;
  if (Math.hypot(x - B20.x, z - B20.z) < B20.r + 30 + margin) return false;
  for (const s of Object.values(SITES)) if (s !== SITES.B20 && Math.hypot(x - s.x, z - s.z) < s.pad.r * 0.8 + margin) return false;
  for (const p of PADS) if (Math.hypot(x - p.x, z - p.z) < Math.max(p.hw, p.hd) + margin) return false;
  return true;
}

// Where small life (shrubs, flowers, collectables) goes on the main land: round the places people walk.
export const MAIN_ZONES = [
  { x: 0, z: 2330, r: 230 },                 // the spawn shore
  { x: -420, z: 640, r: 160 }, { x: 420, z: 640, r: 160 },   // the terrace gardens
  { x: -760, z: 820, r: 160 }, { x: 760, z: 820, r: 160 },   // lake shores beside the terraces
  { x: SITES.B02.x, z: SITES.B02.z, r: 120 }, { x: SITES.B03.x, z: SITES.B03.z, r: 110 },
  { x: SITES.B18.x, z: SITES.B18.z, r: 140 },
  { x: -300, z: 2350, r: 160 }, { x: 300, z: 2350, r: 160 },
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
export const MAIN_SHARE_R = 260;
