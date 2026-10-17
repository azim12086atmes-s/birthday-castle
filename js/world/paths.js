// Roads, trails and village alleys across the crescent (study thread,
// design/world-fill/paths/paths.json): the royal road of pale stone from the Bridge
// Pavilions to the palace with lanterns along it, packed-earth roads between the
// places, footpaths up to the hilltop relics, cobbled alleys and plazas in the
// villages, and arched bridges. The ground under them is already flattened in the
// crescent height map, so each path is a ribbon laid a little above it.
import * as THREE from 'three';
import { groundAt, terrainHeight, MAIN } from './layout.js';
import { nightGrade } from './materials.js';
import { flagstoneTexture, cobbleTexture, glowTexture, rng } from './textures.js';
import { MOOD } from './sky.js';

const LIFT = 0.45;

// cells (6 m) the paths cover, so the forests leave them clear
const CELL = 6;
const mask = new Set();
const waiting = [];
export function onPath(x, z) { return mask.has(Math.floor(x / CELL) * 100003 + Math.floor(z / CELL)); }
export function whenPaths(fn) { waiting.push(fn); }
function markPath(pts, width) {
  const r = width / 2 + 2;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], n = Math.ceil(Math.hypot(b[0] - a[0], b[2] - a[2]) / 3);
    for (let j = 0; j <= n; j++) {
      const x = a[0] + (b[0] - a[0]) * j / n, z = a[2] + (b[2] - a[2]) * j / n;
      for (let cx = Math.floor((x - r) / CELL); cx <= Math.floor((x + r) / CELL); cx++)
        for (let cz = Math.floor((z - r) / CELL); cz <= Math.floor((z + r) / CELL); cz++) mask.add(cx * 100003 + cz);
    }
  }
}
const STYLE = {
  royal: { tint: '#f4ebe4', tex: 'flag', rep: 10 },
  road: { tint: '#c9a982', tex: 'earth', rep: 6 },
  trail: { tint: '#bfa17c', tex: 'earth', rep: 3 },
  alley: { tint: '#d8c8bc', tex: 'cobble', rep: 3 },
};

// packed earth with worn wheel ruts and a line of edge stones
function earthTexture(edges) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 256;
  const g = c.getContext('2d'), r = rng(edges ? 5 : 9);
  g.fillStyle = '#b89a76'; g.fillRect(0, 0, 128, 256);
  for (let i = 0; i < 900; i++) { const v = 150 + r() * 70; g.fillStyle = `rgba(${v},${v * 0.85},${v * 0.66},0.35)`; g.fillRect(r() * 128, r() * 256, 1 + r() * 3, 1 + r() * 3); }
  g.fillStyle = 'rgba(120,95,70,0.25)'; g.fillRect(34, 0, 10, 256); g.fillRect(84, 0, 10, 256);
  if (edges) for (let y = 0; y < 256; y += 16) for (const x of [0, 120]) { const v = 190 + r() * 40; g.fillStyle = `rgb(${v},${v - 6},${v - 14})`; g.fillRect(x + r() * 2, y + 1, 8, 13); }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.ClampToEdgeWrapping; t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function material(kind) {
  const st = STYLE[kind];
  let map;
  if (st.tex === 'flag') { map = flagstoneTexture().clone(); map.needsUpdate = true; }
  else if (st.tex === 'cobble') { map = cobbleTexture().clone(); map.needsUpdate = true; }
  else map = earthTexture(kind === 'road');
  map.wrapT = THREE.RepeatWrapping;
  if (st.tex !== 'earth') map.wrapS = THREE.RepeatWrapping;
  const m = new THREE.MeshLambertMaterial({ map, color: st.tint, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
  return nightGrade(m, 'path-' + kind);
}

// a flat ribbon along the centre line; v runs along the path in units of its width
function ribbon(src, width, deck) {
  // no straight stretch longer than 8 m, so the ribbon hugs the ground between points
  const pts = [];
  src.forEach((p, i) => {
    if (i > 0) {
      const q = src[i - 1], k = Math.ceil(Math.hypot(p[0] - q[0], p[2] - q[2]) / 8);
      for (let j = 1; j < k; j++) pts.push([q[0] + (p[0] - q[0]) * j / k, q[1] + (p[1] - q[1]) * j / k, q[2] + (p[2] - q[2]) * j / k]);
    }
    pts.push(p);
  });
  const n = pts.length, pos = [], uv = [], idx = [];
  let along = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dz = b[2] - a[2];
    const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
    if (i > 0) along += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][2] - pts[i - 1][2]);
    for (const s of [-1, 1]) {
      const x = pts[i][0] - dz * s * width / 2, z = pts[i][2] + dx * s * width / 2;
      const y = deck ? pts[i][1] : Math.max(groundAt(x, z, pts[i][1] + 3), terrainHeight(MAIN, x, z), pts[i][1] - 0.5) + LIFT;
      pos.push(x, y, z);
      uv.push(s < 0 ? 0 : 1, along / width);
    }
    if (i > 0) { const k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
  }
  return { pos, uv, idx };
}

function merge(parts) {
  const pos = [], uv = [], idx = [];
  for (const p of parts) {
    const o = pos.length / 3;
    pos.push(...p.pos); uv.push(...p.uv);
    for (const i of p.idx) idx.push(i + o);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

export function createPaths(scene, quality) {
  const group = new THREE.Group();
  group.name = 'paths';
  scene.add(group);
  const lanterns = [];
  let glow = null;

  fetch('data/world/paths.json').then((r) => r.json()).then((P) => {
    // --- the ribbons, one mesh per kind ---
    const byKind = {};
    for (const p of P.paths) {
      if (p.points.length < 2) continue;
      markPath(p.points, p.width);
      // over open water the bridges and the causeway carry the way, so the ribbon breaks there
      let run = [];
      const flush = () => { if (run.length > 1) (byKind[p.kind] ||= []).push(ribbon(run, p.width, false)); run = []; };
      for (const q of p.points) { if (groundAt(q[0], q[2], q[1] + 3) < 0.5) flush(); else run.push(q); }
      flush();
    }
    for (const [kind, parts] of Object.entries(byKind)) {
      const mesh = new THREE.Mesh(merge(parts), material(kind));
      mesh.receiveShadow = true;
      group.add(mesh);
    }

    for (const z of P.plazas) markPath([[z.x - z.radius, 0, z.z], [z.x + z.radius, 0, z.z]], z.radius * 2);
    waiting.forEach((fn) => fn());

    // --- plazas: paved discs at the village centres ---
    const plazaMat = material('royal');
    for (const z of P.plazas) {
      const g = new THREE.CircleGeometry(z.radius, 36).rotateX(-Math.PI / 2);
      const a = g.attributes.position, u = g.attributes.uv;
      for (let i = 0; i < a.count; i++) {
        const x = a.getX(i) + z.x, zz = a.getZ(i) + z.z;
        a.setXYZ(i, x, groundAt(x, zz, 200) + LIFT + 0.05, zz);
        u.setXY(i, x / 4, zz / 4);
      }
      g.computeVertexNormals();
      group.add(new THREE.Mesh(g, plazaMat));
    }

    // --- bridges: an arched stone deck with low parapets ---
    const deckMat = nightGrade(new THREE.MeshLambertMaterial({ color: '#efe6f0' }), 'bridge');
    for (const b of P.bridges) {
      const [x0, y0, z0] = b.start, [x1, y1, z1] = b.end;
      const len = Math.hypot(x1 - x0, z1 - z0);
      if (len < 2) continue;
      const rise = Math.min(8, len * 0.08), N = 16, pts = [];
      for (let i = 0; i <= N; i++) { const k = i / N; pts.push([x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * rise + 0.6, z0 + (z1 - z0) * k]); }
      const top = ribbon(pts, b.width, true);
      const w = b.width / 2, dx = (x1 - x0) / len, dz = (z1 - z0) / len;
      const side = (s, h0, h1) => ({ pos: pts.flatMap((p) => [p[0] - dz * s * w, p[1] + h0, p[2] + dx * s * w, p[0] - dz * s * w, p[1] + h1, p[2] + dx * s * w]), uv: pts.flatMap(() => [0, 0, 0, 1]), idx: pts.slice(1).flatMap((_, i) => { const k = (i + 1) * 2; return s > 0 ? [k - 2, k - 1, k, k - 1, k + 1, k] : [k - 2, k, k - 1, k - 1, k, k + 1]; }) });
      const mesh = new THREE.Mesh(merge([top, side(-1, -1.6, 1.1), side(1, -1.6, 1.1), side(-1, -1.6, -1.6)]), deckMat);
      mesh.material.side = THREE.DoubleSide;
      group.add(mesh);
    }

    // --- lanterns along the royal road, every 40 m on alternate sides ---
    const royal = P.paths.filter((p) => p.kind === 'royal');
    const spots = [];
    for (const p of royal) {
      let acc = 0, side = 1;
      for (let i = 1; i < p.points.length; i++) {
        const a = p.points[i - 1], b = p.points[i];
        acc += Math.hypot(b[0] - a[0], b[2] - a[2]);
        if (acc < 40) continue;
        acc = 0; side = -side;
        const l = Math.hypot(b[0] - a[0], b[2] - a[2]) || 1, nx = -(b[2] - a[2]) / l, nz = (b[0] - a[0]) / l;
        const x = b[0] + nx * side * (p.width / 2 + 1.2), z = b[2] + nz * side * (p.width / 2 + 1.2);
        const gy = groundAt(x, z, b[1] + 3);
        if (gy > 0.5) spots.push([x, Math.max(gy, b[1] - 0.5), z]);
      }
    }
    if (spots.length) {
      const post = new THREE.CylinderGeometry(0.12, 0.18, 4, 6).translate(0, 2, 0);
      const posts = new THREE.InstancedMesh(post, nightGrade(new THREE.MeshLambertMaterial({ color: '#3a2c48' }), 'lantern-post'), spots.length);
      const head = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.42, 0).translate(0, 4.4, 0), new THREE.MeshBasicMaterial({ color: '#ffd9a0' }), spots.length);
      const m4 = new THREE.Matrix4();
      spots.forEach(([x, y, z], i) => { m4.makeTranslation(x, y, z); posts.setMatrixAt(i, m4); head.setMatrixAt(i, m4); });
      group.add(posts, head);
      // soft halos that only show at night
      const gpos = new Float32Array(spots.length * 3);
      spots.forEach(([x, y, z], i) => gpos.set([x, y + 4.4, z], i * 3));
      const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.BufferAttribute(gpos, 3));
      glow = new THREE.Points(gg, new THREE.PointsMaterial({ map: glowTexture(), color: '#ffc27a', size: 9, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
      group.add(glow);
      lanterns.push(...spots);
    }
  }).catch((e) => console.warn('paths', e));

  void quality;
  return {
    lanterns,
    update() { if (glow) glow.material.opacity = 0.15 + 0.75 * MOOD.night.value; },
  };
}
