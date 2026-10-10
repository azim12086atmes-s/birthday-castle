// The shape of the world: islands, where the castle stands, where things may not
// grow, and the ground height / collision queries the player controller uses.

export const ISLANDS = [
  { id: 'castle', name: 'Castle of Starlight', x: 0, z: 0, y: 0, r: 136, main: true },
  { id: 'garden', name: 'Crystal Garden', x: 175, z: -55, y: 16, r: 38, hue: 0.52 },
  { id: 'aurora', name: 'Aurora Peak', x: -165, z: -115, y: 40, r: 32, hue: 0.42 },
  { id: 'lake', name: 'Lantern Lake', x: -155, z: 110, y: 6, r: 44, hue: 0.12 },
  { id: 'meadow', name: 'Unicorn Meadow', x: 125, z: 150, y: 24, r: 40, hue: 0.85 },
  { id: 'star', name: 'Starfall Isle', x: 25, z: -235, y: 58, r: 30, hue: 0.62 },
];

export const MAIN = ISLANDS[0];
// The main island is laid out like Atlantis (U398–U400): one long axis from the
// arrival meadow, down an avenue of giant trees, across a long bridge over a
// long lake with a white town on both shores, through the plaza and up three
// marble terraces to a monumental castle.
export const SPAWN = { x: 0, z: 116 };
export const CASTLE = { x: 0, z: -86, y: 9, s: 1.2 };
export const PLAZA = { x: 0, z: -6, r: 15 };
export const LAKE = { hw: 34, z0: 12, z1: 80 };
export const BRIDGE = { hw: 3.6, z0: 10, z1: 82, y: 2.2, ramp: 8 };
export const TERRACES = [{ y: 3, hw: 58, front: -26 }, { y: 6, hw: 52, front: -40 }, { y: 9, hw: 46, front: -54 }];
export const TERRACE_REAR = -118;
export const STAIR = { hw: 8, run: 6 };
export const TOWN = { x0: 46, x1: 100, z0: 0, z1: 66 };   // mirrored on both sides of the lake
export const LAKE_POND = { x: -155, z: 110, r: 18 };

// Portals on the rim of the main island, each pointing at one floating island.
export const PORTALS = ISLANDS.filter((i) => !i.main).map((isl) => {
  const a = Math.atan2(isl.z, isl.x);
  const d = MAIN.r - 12;
  return { to: isl.id, name: isl.name, x: Math.cos(a) * d, z: Math.sin(a) * d, y: MAIN.y, angle: a };
});

// Return portal on each floating island, on the side facing the castle.
export const RETURNS = ISLANDS.filter((i) => !i.main).map((isl) => {
  const a = Math.atan2(-isl.z, -isl.x);
  const d = isl.r - 8;
  return { from: isl.id, x: isl.x + Math.cos(a) * d, z: isl.z + Math.sin(a) * d, y: isl.y, angle: a };
});

// Solid things the player bumps into: circles { x, z, r } and boxes.
export const COLLIDERS = [];
export function addCollider(c) { COLLIDERS.push(c); }

export function islandAt(x, z) {
  for (const isl of ISLANDS) {
    const dx = x - isl.x, dz = z - isl.z;
    if (dx * dx + dz * dz < isl.r * isl.r) return isl;
  }
  return null;
}

// --- rolling hills --------------------------------------------------------
// Deterministic value noise so every player gets the same landscape.
function h2(x, z) { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = h2(ix, iz), b = h2(ix + 1, iz), c = h2(ix, iz + 1), d = h2(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

// Places that must stay level (buildings, plaza, path, portals, the pond),
// as circles and one strip; hills fade in beyond them.
const FLAT = [];
const FLAT_RECTS = [
  { x0: -104, x1: 104, z0: -140, z1: 84 },   // the whole monumental core
  { x0: -22, x1: 22, z0: 84, z1: 140 },      // arrival avenue and meadow
];
function rectDistance(x, z, r) {
  const dx = Math.max(r.x0 - x, 0, x - r.x1), dz = Math.max(r.z0 - z, 0, z - r.z1);
  return Math.hypot(dx, dz);
}
function flatDistance(x, z, isl) {
  let d = Infinity;
  for (const f of FLAT) d = Math.min(d, Math.hypot(x - f.x, z - f.z) - f.r);
  if (isl.main) for (const r of FLAT_RECTS) d = Math.min(d, rectDistance(x, z, r));
  return d;
}
function initFlat() {
  FLAT.push({ x: LAKE_POND.x, z: LAKE_POND.z, r: LAKE_POND.r + 4 });
  for (const p of PORTALS) FLAT.push({ x: p.x, z: p.z, r: 9 });
  for (const p of RETURNS) FLAT.push({ x: p.x, z: p.z, r: 9 });
  const by = Object.fromEntries(ISLANDS.map((i) => [i.id, i]));
  FLAT.push({ x: by.aurora.x, z: by.aurora.z, r: 10 }, { x: by.lake.x + 26, z: by.lake.z - 10, r: 8 }, { x: by.star.x, z: by.star.z - 6, r: 9 });
}

export function terrainHeight(isl, x, z) {
  if (!FLAT.length) initFlat();
  const amp = isl.main ? 10 : 6;
  const n = vnoise(x * 0.028 + isl.x, z * 0.028 + isl.z) * 0.75 + vnoise(x * 0.09, z * 0.09) * 0.25;
  const rim = smooth(isl.r, isl.r - 12, Math.hypot(x - isl.x, z - isl.z));
  const flat = smooth(0, 14, flatDistance(x, z, isl));
  return Math.max(0, n - 0.25) * amp * 1.35 * rim * flat;
}

// Meadow colour as HSL (reference U13 / U05): big soft patches of sunny
// yellow-green and cooler blue-green, never olive or grey. Shared by the
// terrain and the grass blades so the two blend into one surface.
const ISLE_HUE = { castle: 0.31, garden: 0.34, aurora: 0.38, lake: 0.29, meadow: 0.27, star: 0.35 };
export function groundHSL(isl, x, z, h) {
  const big = vnoise(x * 0.035 + 50, z * 0.035 + 9);
  const small = vnoise(x * 0.16, z * 0.16);
  const hue = (ISLE_HUE[isl.id] ?? 0.28) - big * 0.055 + (small - 0.5) * 0.025 - h * 0.002;
  const sat = 0.64 + big * 0.14;
  const light = 0.31 + big * 0.13 + Math.min(h, 12) * 0.008 + (small - 0.5) * 0.05;
  return [hue, sat, light];
}

// Height of the built-up axis: bridge deck, lake bed, grand stairs, terraces.
// Returns null where the natural ground applies.
export function builtHeight(x, z) {
  const ax = Math.abs(x);
  if (ax <= BRIDGE.hw && z >= BRIDGE.z0 && z <= BRIDGE.z1) {
    return BRIDGE.y * Math.min(1, (z - BRIDGE.z0) / BRIDGE.ramp, (BRIDGE.z1 - z) / BRIDGE.ramp);
  }
  if (ax < LAKE.hw && z > LAKE.z0 && z < LAKE.z1) return -0.6;
  let prev = 0;
  for (const T of TERRACES) {
    const zs = T.front + STAIR.run;
    if (ax <= STAIR.hw && z <= zs && z >= T.front) return prev + (T.y - prev) * Math.round(((zs - z) / STAIR.run) * 12) / 12;
    prev = T.y;
  }
  for (let k = TERRACES.length - 1; k >= 0; k--) {
    const T = TERRACES[k];
    if (ax <= T.hw && z <= T.front && z >= TERRACE_REAR) {
      // the next flight up is cut into this terrace's top
      return T.y;
    }
  }
  return null;
}

export function groundAt(x, z) {
  const isl = islandAt(x, z);
  if (!isl) return null;
  if (isl.id === 'lake') {
    const dx = x - LAKE_POND.x, dz = z - LAKE_POND.z;
    if (dx * dx + dz * dz < LAKE_POND.r * LAKE_POND.r) return isl.y - 0.3;
  }
  if (isl.main) {
    const b = builtHeight(x, z);
    if (b !== null) return b;
  }
  return isl.y + terrainHeight(isl, x, z);
}

// Push a point of radius `pr` out of every collider. Mutates pos.
export function resolveCollisions(pos, pr = 0.5) {
  for (const c of COLLIDERS) {
    if (c.y0 !== undefined && (pos.y < c.y0 - 1 || pos.y > c.y1)) continue;
    if (c.r !== undefined) {
      const dx = pos.x - c.x, dz = pos.z - c.z;
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

// Places where trees and decorations must not be put.
export function isClearOfBuildings(x, z, margin = 0) {
  const ax = Math.abs(x);
  if (ax < LAKE.hw + 4 + margin && z > LAKE.z0 - 4 - margin && z < LAKE.z1 + 4 + margin) return false;
  if (ax < 16 + margin && z > LAKE.z1 && z < 140) return false;                       // avenue and spawn
  if (Math.hypot(x - PLAZA.x, z - PLAZA.z) < PLAZA.r + 6 + margin) return false;
  if (ax < TERRACES[0].hw + 4 + margin && z < TERRACES[0].front + STAIR.run + 4 + margin) return false;
  if (ax > TOWN.x0 - 3 - margin && ax < TOWN.x1 + 3 + margin && z > TOWN.z0 - 3 - margin && z < TOWN.z1 + 3 + margin) return false;
  for (const p of PORTALS) if (Math.hypot(x - p.x, z - p.z) < 9 + margin) return false;
  for (const p of RETURNS) if (Math.hypot(x - p.x, z - p.z) < 8 + margin) return false;
  if (Math.hypot(x - LAKE_POND.x, z - LAKE_POND.z) < LAKE_POND.r + 4 + margin) return false;
  return true;
}
