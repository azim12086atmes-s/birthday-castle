// The shape of the world: islands, where the castle stands, where things may not
// grow, and the ground height / collision queries the player controller uses.

export const ISLANDS = [
  { id: 'castle', name: 'Castle of Starlight', x: 0, z: 0, y: 0, r: 95, main: true },
  { id: 'garden', name: 'Crystal Garden', x: 175, z: -55, y: 16, r: 38, hue: 0.52 },
  { id: 'aurora', name: 'Aurora Peak', x: -165, z: -115, y: 40, r: 32, hue: 0.42 },
  { id: 'lake', name: 'Lantern Lake', x: -155, z: 110, y: 6, r: 44, hue: 0.12 },
  { id: 'meadow', name: 'Unicorn Meadow', x: 125, z: 150, y: 24, r: 40, hue: 0.85 },
  { id: 'star', name: 'Starfall Isle', x: 25, z: -235, y: 58, r: 30, hue: 0.62 },
];

export const MAIN = ISLANDS[0];
export const SPAWN = { x: 0, z: 62 };
export const CASTLE = { x: 0, z: -48 };
export const PLAZA = { x: 0, z: 14, r: 26 };
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

export function groundAt(x, z) {
  const isl = islandAt(x, z);
  if (!isl) return null;
  if (isl.id === 'lake') {
    const dx = x - LAKE_POND.x, dz = z - LAKE_POND.z;
    if (dx * dx + dz * dz < LAKE_POND.r * LAKE_POND.r) return isl.y - 0.3;
  }
  return isl.y;
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
  if (Math.hypot(x - CASTLE.x, z - CASTLE.z) < 44 + margin) return false;
  if (Math.hypot(x - PLAZA.x, z - PLAZA.z) < PLAZA.r + 6 + margin) return false;
  if (Math.abs(x) < 7 + margin && z > -10 && z < 90) return false; // main path
  for (const p of PORTALS) if (Math.hypot(x - p.x, z - p.z) < 9 + margin) return false;
  for (const p of RETURNS) if (Math.hypot(x - p.x, z - p.z) < 8 + margin) return false;
  if (Math.hypot(x - LAKE_POND.x, z - LAKE_POND.z) < LAKE_POND.r + 4 + margin) return false;
  return true;
}
