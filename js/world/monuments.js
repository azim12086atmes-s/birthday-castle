// Monuments that fill the world, taken from the architecture catalogue: a
// stoa against the top terrace (1A), obelisks at the cove end of the bridge
// (U398), colossal winged guardian statues (U136, U379), two round temples on
// Temple Hill (tholos, U364), the sandstone pillars of Pillar Reach with rope
// bridges and waterfalls (U98, U236, U121), lily pads and floating candles on
// the lake (U258, U292), a ferris wheel (U343), a rune stone ring (U105) and
// hot-air balloons drifting round the crag (U142).
// Static stone is merged into a handful of meshes so the lot costs few draw calls.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { glowBasic, additive, nightGrade } from './materials.js';
import { stoneTexture, glowTexture, rng } from './textures.js';
import { TERRACES, STAIR, BRIDGE, BRIDGE_LINE, THOLOI, WHEEL, RUNES, PLAZA, CRAG, PILLAR_REACH, addCollider, groundAt, lakeDistance, nearestOnLine } from './layout.js';
import { MOOD } from './sky.js';

const MARBLE = '#f6e4ee';

// Every merged part keeps only position, normal and uv so they all merge.
function clean(g) {
  g = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  return g;
}
function box(w, h, d, x, y, z) { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; }
function cyl(rt, rb, h, seg, x, y, z) { const g = new THREE.CylinderGeometry(rt, rb, h, seg); g.translate(x, y + h / 2, z); return g; }

// A classical column: base, slightly swelling shaft (entasis), capital.
function column(h, r) {
  const pts = [[0, 0], [r * 1.35, 0], [r * 1.35, h * 0.03], [r * 1.15, h * 0.05], [r, h * 0.07], [r * 1.04, h * 0.4], [r * 0.9, h * 0.9],
    [r * 1.0, h * 0.92], [r * 1.35, h * 0.96], [r * 1.4, h], [0, h]];
  return new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), 14);
}

// A colossal robed guardian with folded wings, raising a glowing star.
// Built at height 1 and scaled. Modest robe and veil; no face.
function guardian() {
  const marble = [], gold = [];
  const robe = new THREE.LatheGeometry([[0, 0], [0.24, 0], [0.235, 0.04], [0.19, 0.4], [0.14, 0.6], [0.16, 0.72], [0.13, 0.79], [0.06, 0.82], [0, 0.82]]
    .map(([a, b]) => new THREE.Vector2(a, b)), 18);
  marble.push(robe);
  const veil = new THREE.SphereGeometry(0.075, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.72); veil.scale(1, 1.25, 1); veil.translate(0, 0.885, 0);
  marble.push(veil);
  const arm = new THREE.CylinderGeometry(0.028, 0.035, 0.34, 8); arm.rotateZ(-0.45); arm.translate(0.2, 0.9, 0.02);
  marble.push(arm);
  const arm2 = new THREE.CylinderGeometry(0.028, 0.035, 0.3, 8); arm2.rotateZ(0.12); arm2.translate(-0.16, 0.6, 0.04);
  marble.push(arm2);
  // folded wings: a feathered blade shape on each shoulder, swept back
  const wing = new THREE.Shape();
  wing.moveTo(0, 0); wing.bezierCurveTo(0.12, 0.2, 0.3, 0.42, 0.46, 0.6);   // leading edge up to the tip
  const tips = [[0.4, 0.38], [0.42, 0.3], [0.34, 0.16], [0.36, 0.08], [0.26, 0.0], [0.27, -0.1], [0.16, -0.12], [0.14, -0.26], [0.05, -0.2]];
  for (const [x, y] of tips) wing.lineTo(x, y);                             // scalloped feather ends
  wing.lineTo(0, -0.06);
  for (const s of [-1, 1]) {
    const g = new THREE.ExtrudeGeometry(wing, { depth: 0.015, bevelEnabled: false, curveSegments: 10 });
    g.scale(s, 1, 1); g.rotateY(s * 0.55); g.translate(s * 0.06, 0.68, -0.1);
    gold.push(g);
  }
  // plinth in three steps
  marble.push(box(0.7, 0.06, 0.7, 0, -0.03, 0), box(0.6, 0.06, 0.6, 0, -0.09, 0), box(0.5, 0.25, 0.5, 0, -0.245, 0));
  return { marble, gold, star: new THREE.Vector3(0.27, 1.08, 0.02) };
}

export function createMonuments(scene, preset) {
  const r = rng(77);
  const group = new THREE.Group();
  const marble = [], gold = [], glow = [], statue = [], rock = [], moss = [];
  const stars = [];               // glowing points that get a halo
  const low = preset.grass < 4000;

  // --- stoa: a colonnade along the face of the top terrace -----------------
  {
    const T2 = TERRACES[1], T3 = TERRACES[2], h = 13, D = 10, zc = T3.front + D - 1;
    for (const s of [-1, 1]) {
      const xa = STAIR.hw + 8, xb = T3.hw - 2;
      for (let x = xa; x <= xb + 0.01; x += 6.4) {
        const c = column(h, 0.8); c.translate(s * x, T2.y, zc);
        marble.push(c);
        addCollider({ x: s * x, z: zc, r: 1.05, y0: T2.y, y1: T2.y + h });
      }
      const cx = s * (xa + xb) / 2, w = xb - xa + 3;
      marble.push(box(w, 1.3, D, cx, T2.y + h + 0.65, zc - D / 2 + 0.6));      // architrave and roof slab
      gold.push(box(w + 0.6, 0.4, D + 0.6, cx, T2.y + h + 1.5, zc - D / 2 + 0.6)); // gold cornice
      marble.push(box(w, 0.6, 1.2, cx, T2.y + h - 0.3, zc));                     // beam over the columns
      marble.push(box(w, 0.1, D - 1, cx, T2.y + 0.05, zc - D / 2 + 0.6));        // paved floor
      // gold acroteria along the roof line
      for (let x = xa; x <= xb + 0.01; x += 12.8) {
        const a = new THREE.OctahedronGeometry(0.7, 0); a.scale(1, 1.6, 1); a.translate(s * x, T2.y + h + 2.6, zc + 0.6);
        gold.push(a);
      }
    }
  }

  // --- obelisks at both ends of the bridge ---------------------------------
  {
    const [ax, az] = BRIDGE.pts[0], [bx, bz] = BRIDGE.pts[1];
    const L = Math.hypot(bx - ax, bz - az), dx = (bx - ax) / L, dz = (bz - az) / L;
    for (const s of [-1, 1]) {
      const x = ax - dx * 6 - dz * s * (BRIDGE.hw + 6), z = az - dz * 6 + dx * s * (BRIDGE.hw + 6), y = groundAt(x, z) ?? 0, k = 2;
      marble.push(box(2.6 * k, 0.5 * k, 2.6 * k, x, y + 0.25 * k, z), box(2.1 * k, 0.5 * k, 2.1 * k, x, y + 0.75 * k, z));
      const o = new THREE.CylinderGeometry(0.55 * k, 0.85 * k, 13 * k, 4); o.rotateY(Math.PI / 4); o.translate(x, y + k + 6.5 * k, z);
      marble.push(o);
      const tip = new THREE.ConeGeometry(0.62 * k, 1.4 * k, 4); tip.rotateY(Math.PI / 4); tip.translate(x, y + 14.2 * k, z);
      gold.push(tip);
      stars.push([x, y + 15.3 * k, z, 5]);
      addCollider({ x, z, r: 1.5 * k });
    }
  }

  // --- colossal guardians: flanking the grand stair and in the lake corners -
  {
    const G = guardian();
    const spots = [
      { x: -(STAIR.hw + 12), z: TERRACES[0].front + STAIR.run + 6, s: 30, ry: 0.35 },
      { x: STAIR.hw + 12, z: TERRACES[0].front + STAIR.run + 6, s: 30, ry: -0.35 },
      { x: PLAZA.x - 16, z: PLAZA.z + 24, s: 20, ry: 0.2 },
      { x: PLAZA.x + 16, z: PLAZA.z + 24, s: 20, ry: -0.2 },
    ];
    for (const sp of spots) {
      const base = (groundAt(sp.x, sp.z, CRAG.y) ?? CRAG.y) + 0.34 * sp.s;
      const m = new THREE.Matrix4().compose(new THREE.Vector3(sp.x, base, sp.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, sp.ry, 0)), new THREE.Vector3(sp.s, sp.s, sp.s));
      for (const g of G.marble) statue.push(g.clone().applyMatrix4(m));
      for (const g of G.gold) gold.push(g.clone().applyMatrix4(m));
      const st = G.star.clone().applyMatrix4(m);
      const o = new THREE.OctahedronGeometry(0.06 * sp.s, 0); o.translate(st.x, st.y, st.z);
      glow.push(o);
      stars.push([st.x, st.y, st.z, sp.s * 0.6]);
      addCollider({ x: sp.x, z: sp.z, r: 0.36 * sp.s });
    }
  }

  // --- two round temples (tholos) with gold domes ---------------------------
  for (const t of THOLOI) {
    const y = (groundAt(t.x, t.z) ?? 0) - 0.4, R = 9, h = 11;
    for (let k = 0; k < 3; k++) marble.push(cyl(R + 3.6 - k * 1.1, R + 3.6 - k * 1.1, 0.6, 32, t.x, y + k * 0.6, t.z));
    const fy = y + 1.8;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2, cx = t.x + Math.cos(a) * R, cz = t.z + Math.sin(a) * R;
      const c = column(h, 0.6); c.translate(cx, fy, cz); marble.push(c);
      addCollider({ x: cx, z: cz, r: 0.8 });
    }
    const ent = new THREE.CylinderGeometry(R + 0.7, R + 0.7, 1.1, 32, 1, true); ent.translate(t.x, fy + h + 0.55, t.z);
    marble.push(ent, cyl(R + 0.9, R + 0.9, 0.3, 32, t.x, fy + h + 1.1, t.z));
    gold.push(cyl(R + 1.0, R + 1.0, 0.18, 32, t.x, fy + h + 1.4, t.z));
    const dome = new THREE.SphereGeometry(R + 0.4, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2); dome.scale(1, 0.75, 1); dome.translate(t.x, fy + h + 1.4, t.z);
    gold.push(dome);
    const fin = new THREE.OctahedronGeometry(0.6, 0); fin.scale(1, 1.8, 1); fin.translate(t.x, fy + h + 1.4 + (R + 0.4) * 0.75 + 0.9, t.z);
    gold.push(fin);
    // a glowing crystal floats inside
    const cr = new THREE.OctahedronGeometry(1.1, 0); cr.scale(1, 1.7, 1); cr.translate(t.x, fy + 3.2, t.z);
    glow.push(cr);
    stars.push([t.x, fy + 3.2, t.z, 7]);
  }

  // --- Pillar Reach: ten sandstone pillars, three hovering, rope bridges -----
  const fallSpots = [], wood = [];
  {
    const pr = rng(303), P = [];
    for (let tries = 0; P.length < 10 && tries < 4000; tries++) {
      const a = pr() * Math.PI * 2, d = Math.sqrt(pr()) * 240;
      const x = PILLAR_REACH.x + Math.cos(a) * d, z = PILLAR_REACH.z + Math.sin(a) * d;
      const rb = 20 + pr() * 15;
      if (x * x + z * z > 1000 * 1000 || lakeDistance(x, z) < rb + 25) continue;
      if (P.some((q) => Math.hypot(q.x - x, q.z - z) < q.rb + rb + 28)) continue;
      P.push({ x, z, rb, rt: rb * (0.72 + pr() * 0.2), H: 180 + pr() * 120, float: P.length % 3 === 1 && P.length < 9 });
    }
    // rough rock with strata: a lathe-like cylinder pushed in and out
    const pillar = (rt, rb, h, seed) => {
      const g = new THREE.CylinderGeometry(rt, rb, h, 16, Math.max(6, Math.round(h / 14)));
      const p = g.attributes.position, cols = [], c = new THREE.Color();
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i), ang = Math.atan2(z, x);
        const f = 1 + 0.1 * Math.sin(ang * 3 + seed + y * 0.02) + 0.06 * Math.sin(ang * 7 - y * 0.05 + seed * 2) + 0.03 * Math.sin(ang * 13 + y * 0.11);
        p.setX(i, x * f); p.setZ(i, z * f);
        // soft sandstone bands, warmer and lighter towards the top (U236)
        const t = (y + h / 2) / h, band = Math.sin(y * 0.07 + seed) * 0.5 + 0.5;
        c.setHSL(0.05 + band * 0.025, 0.42 + band * 0.1, 0.5 + t * 0.14 + band * 0.06);
        cols.push(c.r, c.g, c.b);
      }
      g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
      g.computeVertexNormals();
      return g;
    };
    for (const [i, q] of P.entries()) {
      let y0 = Infinity;
      for (let k = 0; k < 6; k++) { const a = k * 1.05; y0 = Math.min(y0, groundAt(q.x + Math.cos(a) * q.rb, q.z + Math.sin(a) * q.rb) ?? 0); }
      y0 -= 4; q.top = y0 + q.H;
      if (q.float) {
        const hs = 30 + pr() * 30, gap = 20 + pr() * 40, rs = q.rb * 0.95;
        rock.push(pillar(rs * 0.8, rs, hs, i).translate(q.x, y0 + hs / 2, q.z));                  // the stump left behind
        moss.push(cyl(rs * 0.82, rs * 0.82, 1.2, 16, q.x, y0 + hs - 0.4, q.z));
        const h = q.H - hs - gap, b = y0 + hs + gap;
        rock.push(pillar(q.rt, q.rb * 0.9, h, i + 5).translate(q.x, b + h / 2, q.z));
        const under = new THREE.ConeGeometry(q.rb * 0.9, 26, 16, 3); under.rotateX(Math.PI); under.translate(q.x, b - 13, q.z);
        rock.push(under);
        stars.push([q.x, b - 30, q.z, 30]);                                                         // a glow where it hangs
        addCollider({ x: q.x, z: q.z, r: rs * 0.95 });
      } else {
        rock.push(pillar(q.rt, q.rb, q.H, i).translate(q.x, y0 + q.H / 2, q.z));
        addCollider({ x: q.x, z: q.z, r: q.rb * 0.95 });
        if (fallSpots.length < 3) {
          const a = pr() * Math.PI * 2;
          fallSpots.push({ x: q.x + Math.cos(a) * (q.rt + 1), z: q.z + Math.sin(a) * (q.rt + 1), y: q.top, L: q.H - 4, a: Math.atan2(Math.cos(a), Math.sin(a)) });
        }
      }
      // grassy top with a few trees
      moss.push(cyl(q.rt * 1.06, q.rt * 0.98, 3, 16, q.x, q.top - 2, q.z));
      for (let k = 0, n = 3 + Math.floor(pr() * 3); k < n; k++) {
        const a = pr() * 6.28, d = pr() * q.rt * 0.7, h = 12 + pr() * 10;
        const c = new THREE.ConeGeometry(3 + pr() * 2, h, 7); c.translate(q.x + Math.cos(a) * d, q.top + 1 + h / 2, q.z + Math.sin(a) * d);
        moss.push(c);
      }
      // a domed pavilion on two of the tops
      if (i === 0 || i === 4) {
        const R = 6, h = 9, fy = q.top + 1;
        marble.push(cyl(R + 1.6, R + 1.6, 1, 24, q.x, fy - 1, q.z));
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, c = column(h, 0.45); c.translate(q.x + Math.cos(a) * R, fy, q.z + Math.sin(a) * R); marble.push(c); }
        const dome = new THREE.SphereGeometry(R + 0.6, 20, 8, 0, Math.PI * 2, 0, Math.PI / 2); dome.translate(q.x, fy + h, q.z);
        gold.push(dome);
        stars.push([q.x, fy + 4, q.z, 12]);
      }
    }
    // rope bridges between tops less than 190 m apart: a sagging plank deck and two hand ropes
    const strip = (pts, w) => {
      const pos = [], uv = [], nrm = [];
      for (let k = 0; k < pts.length - 1; k++) {
        const a = pts[k], b = pts[k + 1], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz), px = -dz / l * w, pz = dx / l * w;
        const q = [[a.x - px, a.y, a.z - pz], [a.x + px, a.y, a.z + pz], [b.x + px, b.y, b.z + pz], [b.x - px, b.y, b.z - pz]];
        for (const t of [0, 1, 2, 0, 2, 3]) { pos.push(...q[t]); nrm.push(0, 1, 0); uv.push(t === 1 || t === 2 ? 1 : 0, k % 2); }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      return g;
    };
    const linked = new Set();
    for (const [i, a] of P.entries()) {
      let best = null, bd = 190;
      for (const [j, b] of P.entries()) {
        if (i === j || linked.has(Math.min(i, j) + ':' + Math.max(i, j))) continue;
        const d = Math.hypot(a.x - b.x, a.z - b.z);
        if (d < bd) { bd = d; best = [j, b]; }
      }
      if (!best) continue;
      const [j, b] = best; linked.add(Math.min(i, j) + ':' + Math.max(i, j));
      const ux = (b.x - a.x) / bd, uz = (b.z - a.z) / bd;
      const A = { x: a.x + ux * a.rt * 0.9, z: a.z + uz * a.rt * 0.9, y: a.top + 0.2 }, B = { x: b.x - ux * b.rt * 0.9, z: b.z - uz * b.rt * 0.9, y: b.top + 0.2 };
      const span = Math.hypot(B.x - A.x, B.z - A.z), sag = span * 0.07, n = Math.max(8, Math.round(span / 4));
      const pts = [];
      for (let k = 0; k <= n; k++) { const t = k / n; pts.push({ x: A.x + (B.x - A.x) * t, z: A.z + (B.z - A.z) * t, y: A.y + (B.y - A.y) * t - sag * 4 * t * (1 - t) }); }
      wood.push(strip(pts, 1.3));
      for (const s of [-1, 1]) {
        const c = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p.x - uz * s * 1.4, p.y + 1.1, p.z + ux * s * 1.4)));
        wood.push(new THREE.TubeGeometry(c, n, 0.1, 3));
      }
      for (let k = 2; k < n; k += 6) stars.push([pts[k].x, pts[k].y + 1.6, pts[k].z, 3]);
    }
  }
  // --- rune stone ring in the arrival meadow --------------------------------
  {
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, x = RUNES.x + Math.cos(a) * RUNES.r, z = RUNES.z + Math.sin(a) * RUNES.r;
      const y = groundAt(x, z) ?? 0, h = 3.2 + r() * 1.6;
      const st = new THREE.BoxGeometry(1.3, h, 0.7, 1, 3, 1);
      const p = st.attributes.position;
      for (let k = 0; k < p.count; k++) if (p.getY(k) > 0) p.setX(k, p.getX(k) * (0.75 + 0.1 * Math.sin(k)));
      st.rotateY(-a + Math.PI / 2); st.translate(x, y + h / 2 - 0.2, z);
      marble.push(st);
      const rune = new THREE.PlaneGeometry(0.5, 1.4); rune.translate(0, 0, 0.36); rune.rotateY(-a - Math.PI / 2); rune.translate(x, y + h * 0.55, z);
      glow.push(rune);
      addCollider({ x, z, r: 0.8 });
    }
    const cy = groundAt(RUNES.x, RUNES.z) ?? 0;
    marble.push(cyl(1.5, 1.7, 0.8, 16, RUNES.x, cy - 0.1, RUNES.z));
    stars.push([RUNES.x, cy + 2.2, RUNES.z, 5]);
    const orb = new THREE.IcosahedronGeometry(0.7, 1); orb.translate(RUNES.x, cy + 2.2, RUNES.z);
    glow.push(orb);
  }

  // --- merged static meshes -------------------------------------------------
  const stone = stoneTexture().clone(); stone.needsUpdate = true;
  const M = new THREE.Mesh(mergeGeometries(marble.map(clean)), nightGrade(new THREE.MeshLambertMaterial({ color: MARBLE, map: stone, emissive: '#3e2250', emissiveIntensity: 0.4 }), 'monument-marble'));
  M.castShadow = M.receiveShadow = true;
  const Gm = new THREE.Mesh(mergeGeometries(gold.map(clean)), new THREE.MeshLambertMaterial({ color: '#e8b84a', emissive: '#6a4a10', emissiveIntensity: 0.85 }));
  Gm.castShadow = true;
  const Lm = new THREE.Mesh(mergeGeometries(glow.map(clean)), glowBasic('#9fe8ff'));
  // statues in smooth polished marble, without the block pattern
  const Sm = new THREE.Mesh(mergeGeometries(statue.map(clean)), nightGrade(new THREE.MeshLambertMaterial({ color: '#fbeaf2', emissive: '#4a2a5a', emissiveIntensity: 0.35 }), 'statue'));
  Sm.castShadow = true;
  // rock keeps its vertex colours; pieces without them (the hanging undersides) get a plain sandstone tint
  for (const g of rock) if (!g.attributes.color) { const n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) a.set([0.62, 0.42, 0.33], i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); }
  const Rm = new THREE.Mesh(mergeGeometries(rock.map((g) => { g = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) g.deleteAttribute(k); return g; })), nightGrade(new THREE.MeshLambertMaterial({ vertexColors: true, emissive: '#3a2030', emissiveIntensity: 0.4 }), 'pillar-rock'));
  Rm.castShadow = Rm.receiveShadow = true;
  const Mm = new THREE.Mesh(mergeGeometries(moss.map(clean)), nightGrade(new THREE.MeshLambertMaterial({ color: '#4f8a56', emissive: '#10283a', emissiveIntensity: 0.4 }), 'pillar-moss'));
  const Wm = new THREE.Mesh(mergeGeometries(wood.map(clean)), new THREE.MeshLambertMaterial({ color: '#8a6a4a', emissive: '#2a1a20', emissiveIntensity: 0.4, side: THREE.DoubleSide }));
  group.add(M, Gm, Lm, Sm, Rm, Mm, Wm);

  // halos round every glowing star, as one point cloud
  const hp = new THREE.BufferGeometry();
  hp.setAttribute('position', new THREE.Float32BufferAttribute(stars.flatMap(([x, y, z]) => [x, y, z]), 3));
  hp.setAttribute('size', new THREE.Float32BufferAttribute(stars.map((s) => s[3]), 1));
  const haloMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uMap: { value: glowTexture() }, uNight: MOOD.night, uTime: { value: 0 }, uScale: { value: 600 } },
    vertexShader: 'attribute float size; uniform float uScale; uniform float uTime; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = size * uScale * (1. + .08 * sin(uTime * 2. + position.x)) / -mv.z; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform sampler2D uMap; uniform float uNight; void main(){ float a = texture2D(uMap, gl_PointCoord).a; gl_FragColor = vec4(vec3(1., .82, .55) * a * (.35 + .55 * uNight), 1.); }',
  });
  group.add(new THREE.Points(hp, haloMat));

  // --- aqueduct waterfalls off the island edge ------------------------------
  const fallMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uNight: MOOD.night },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: /* glsl */`
      uniform float uTime; uniform float uNight; varying vec2 vUv;
      float h(float x){ return fract(sin(x * 91.7) * 4375.5); }
      void main(){
        float col = floor(vUv.x * 10.);
        float s = smoothstep(0., .6, fract(vUv.y * 4. + uTime * (.8 + h(col) * .4) + h(col + 3.)));
        float edge = smoothstep(0., .2, vUv.x) * smoothstep(1., .8, vUv.x);
        vec3 c = mix(vec3(.85, .9, 1.), vec3(.45, .85, 1.), uNight);
        gl_FragColor = vec4(c * (.75 + .35 * s), (.35 + .45 * s) * edge * smoothstep(0., .6, vUv.y));
      }`,
  });
  for (const f of fallSpots) {
    const g = new THREE.PlaneGeometry(7, f.L, 1, 12);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const t = (f.L / 2 - p.getY(i)) / f.L; p.setZ(i, Math.sqrt(Math.max(0, t)) * 14); }
    g.rotateY(f.a);
    const m = new THREE.Mesh(g, fallMat);
    m.position.set(f.x, f.y - f.L / 2, f.z);
    group.add(m);
  }

  // --- lily pads, lotus flowers and floating candles on the lake ------------
  const nPads = low ? 40 : 90;
  const pad = new THREE.CircleGeometry(0.9, 10, 0.3, Math.PI * 2 - 0.6); pad.rotateX(-Math.PI / 2);
  const pads = new THREE.InstancedMesh(pad, nightGrade(new THREE.MeshLambertMaterial({ color: '#4f9a5a', emissive: '#10283a', emissiveIntensity: 0.4, side: THREE.DoubleSide }), 'lily'), nPads);
  const lotus = new THREE.InstancedMesh(new THREE.ConeGeometry(0.32, 0.4, 6, 1, true).rotateX(Math.PI), glowBasic('#ffb0d8', { side: THREE.DoubleSide }), Math.ceil(nPads / 3));
  const d = new THREE.Object3D();
  const candles = [];
  for (let i = 0, k = 0; i < nPads; i++) {
    // in clusters along both sides of the bridge, where people walk past them
    let x, z, tries = 0;
    do {
      const s = BRIDGE_LINE.samples[Math.floor(r() * BRIDGE_LINE.samples.length)], a = r() * Math.PI * 2, dd = 10 + r() * 60;
      x = s.x + Math.cos(a) * dd; z = s.z + Math.sin(a) * dd;
    } while (++tries < 50 && (lakeDistance(x, z) > -5 || nearestOnLine(BRIDGE_LINE, x, z, BRIDGE.hw + 4)));
    d.position.set(x, -0.2, z); d.rotation.set(0, r() * 6.28, 0); d.scale.setScalar(1.2 + r() * 1.4); d.updateMatrix();
    pads.setMatrixAt(i, d.matrix);
    if (i % 3 === 0) { d.position.y = 0.05; d.updateMatrix(); lotus.setMatrixAt(k++, d.matrix); }
    if (i % 2 === 0) candles.push(x + 0.9, -0.05, z + 0.4);
  }
  group.add(pads, lotus);
  const cg = new THREE.BufferGeometry();
  cg.setAttribute('position', new THREE.Float32BufferAttribute(candles, 3));
  const candleMat = new THREE.PointsMaterial({ color: '#ffc070', map: glowTexture(), size: 1.6, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  group.add(new THREE.Points(cg, candleMat));

  // --- ferris wheel ---------------------------------------------------------
  const wy = groundAt(WHEEL.x, WHEEL.z) ?? 0, WR = 22, hubY = wy + WR + 3;
  const wheel = new THREE.Group(); wheel.position.set(WHEEL.x, hubY, WHEEL.z);
  {
    const parts = [];
    for (const zz of [-1, 1]) {
      const rim = new THREE.TorusGeometry(WR, 0.18, 6, 48); rim.translate(0, 0, zz); parts.push(rim);
      const inner = new THREE.TorusGeometry(WR * 0.55, 0.12, 6, 32); inner.translate(0, 0, zz); parts.push(inner);
      for (let i = 0; i < 16; i++) { const sp = new THREE.BoxGeometry(0.12, WR, 0.12); sp.translate(0, WR / 2, zz); sp.rotateZ((i / 16) * Math.PI * 2); parts.push(sp); }
    }
    const hub = new THREE.CylinderGeometry(0.8, 0.8, 2.6, 12); hub.rotateX(Math.PI / 2); parts.push(hub);
    wheel.add(new THREE.Mesh(mergeGeometries(parts.map(clean)), new THREE.MeshLambertMaterial({ color: '#f4e8f6', emissive: '#3e2250', emissiveIntensity: 0.5 })));
    // bulbs round the rim
    const bulbPos = [];
    for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; for (const zz of [-1.1, 1.1]) bulbPos.push(Math.cos(a) * WR, Math.sin(a) * WR, zz); }
    const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.Float32BufferAttribute(bulbPos, 3));
    wheel.add(new THREE.Points(bg, new THREE.PointsMaterial({ color: '#ffd0f0', map: glowTexture(), size: 2, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })));
    group.add(wheel);
    // A-frame legs
    const legs = [];
    for (const zz of [-1.6, 1.6]) for (const s of [-1, 1]) {
      const len = Math.hypot(WR * 0.55, hubY - wy), g = new THREE.BoxGeometry(0.4, len, 0.4);
      g.translate(0, len / 2, 0); g.rotateZ(-s * Math.atan2(WR * 0.55, hubY - wy)); g.translate(WHEEL.x + s * WR * 0.55, wy, WHEEL.z + zz);
      legs.push(g);
      addCollider({ x: WHEEL.x + s * WR * 0.55, z: WHEEL.z + zz, r: 0.6 });
    }
    group.add(new THREE.Mesh(mergeGeometries(legs.map(clean)), new THREE.MeshLambertMaterial({ color: '#d8c6e8', emissive: '#2a2050', emissiveIntensity: 0.4 })));
  }
  const nCars = 12;
  const cars = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.9, 0.7, 1.4, 8), new THREE.MeshLambertMaterial({ color: '#ffffff', emissive: '#3a1030', emissiveIntensity: 0.5 }), nCars);
  const carCols = ['#ff8cc6', '#9fd8ff', '#ffd47a', '#c9a6ff'];
  for (let i = 0; i < nCars; i++) cars.setColorAt(i, new THREE.Color(carCols[i % 4]));
  group.add(cars);

  // --- hot-air balloons drifting round the island ---------------------------
  const env = new THREE.LatheGeometry([[0, -3.4], [0.9, -3.0], [2.6, -1.2], [3.2, 0.6], [2.9, 2.2], [1.8, 3.3], [0, 3.6]].map(([a, b]) => new THREE.Vector2(a, b)), 16);
  const basket = new THREE.BoxGeometry(1.1, 0.8, 1.1); basket.translate(0, -4.6, 0);
  const balloonGeo = mergeGeometries([clean(env), clean(basket)]);
  const balloonCols = ['#ff7eb8', '#ffd47a', '#b48cff', '#7ad8ff', '#ff9e7a', '#f2f2ff'];
  const nB = low ? 4 : 6;
  const balloons = new THREE.InstancedMesh(balloonGeo, nightGrade(new THREE.MeshLambertMaterial({ color: '#ffffff', emissive: '#3a1a40', emissiveIntensity: 0.6 }), 'balloon'), nB);
  const bData = [];
  for (let i = 0; i < nB; i++) {
    balloons.setColorAt(i, new THREE.Color(balloonCols[i % balloonCols.length]));
    bData.push({ R: 300 + r() * 600, a: (i / nB) * Math.PI * 2, y: 150 + r() * 110, sp: (0.003 + r() * 0.004) * (i % 2 ? 1 : -1), s: 3 + r() * 1.5, ph: r() * 6 });
  }
  group.add(balloons);

  scene.add(group);
  const tmp = new THREE.Object3D();
  return {
    update(t) {
      haloMat.uniforms.uTime.value = t;
      fallMat.uniforms.uTime.value = t;
      candleMat.opacity = 0.45 + 0.5 * MOOD.night.value;
      // wheel turns slowly; the cars hang level
      const rot = t * 0.06;
      wheel.rotation.z = rot;
      for (let i = 0; i < nCars; i++) {
        const a = rot + (i / nCars) * Math.PI * 2;
        tmp.position.set(WHEEL.x + Math.cos(a) * WR, hubY + Math.sin(a) * WR - 2.2, WHEEL.z);
        tmp.rotation.set(0, 0, Math.sin(t + i) * 0.05); tmp.scale.setScalar(1.8); tmp.updateMatrix();
        cars.setMatrixAt(i, tmp.matrix);
      }
      cars.instanceMatrix.needsUpdate = true;
      bData.forEach((b, i) => {
        const a = b.a + t * b.sp;
        tmp.position.set(Math.cos(a) * b.R, b.y + Math.sin(t * 0.3 + b.ph) * 2.5, Math.sin(a) * b.R);
        tmp.rotation.set(0, a, Math.sin(t * 0.5 + b.ph) * 0.04); tmp.scale.setScalar(b.s); tmp.updateMatrix();
        balloons.setMatrixAt(i, tmp.matrix);
      });
      balloons.instanceMatrix.needsUpdate = true;
    },
  };
}
