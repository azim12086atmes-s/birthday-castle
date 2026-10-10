// The castle: Cinderella-gothic spires married to Islamic onion domes and
// eight-pointed-star stained glass. Built from simple shapes and merged into a
// handful of meshes (one per material) so it costs very few draw calls.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon, glowBasic, additive, flagMaterial } from './materials.js';
import { stoneTexture, stainedGlassTexture, roseWindowTexture, friezeTexture, glowTexture } from './textures.js';
import { CASTLE, addCollider } from './layout.js';

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();

class Builder {
  constructor() { this.parts = {}; }
  add(key, geo, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1) {
    tmpQ.setFromEuler(tmpE.set(rx, ry, rz));
    tmpM.compose(new THREE.Vector3(x, y, z), tmpQ, new THREE.Vector3(s, s, s));
    let g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(tmpM);
    for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
    (this.parts[key] ||= []).push(g);
  }
  build(materials) {
    const group = new THREE.Group();
    for (const [key, list] of Object.entries(this.parts)) {
      const mesh = new THREE.Mesh(mergeGeometries(list), materials[key]);
      mesh.name = key;
      group.add(mesh);
    }
    return group;
  }
}

export function pointedArchShape(w, h, shape = new THREE.Shape()) {
  const hw = w / 2;
  const hs = Math.max(0, h - w * 0.866);
  shape.moveTo(-hw, 0);
  shape.lineTo(hw, 0);
  shape.lineTo(hw, hs);
  shape.absarc(-hw, hs, w, 0, Math.PI / 3, false);
  shape.absarc(hw, hs, w, (2 * Math.PI) / 3, Math.PI, false);
  shape.lineTo(-hw, 0);
  return shape;
}

export function pointedArchPath(w, h) {
  const hw = w / 2, hs = Math.max(0, h - w * 0.866);
  const pts = [new THREE.Vector3(-hw, 0, 0), new THREE.Vector3(-hw, hs, 0)];
  for (let i = 1; i <= 12; i++) { const a = Math.PI - (i / 12) * (Math.PI / 3); pts.push(new THREE.Vector3(hw + Math.cos(a) * w, hs + Math.sin(a) * w, 0)); }
  for (let i = 1; i <= 12; i++) { const a = Math.PI / 3 - (i / 12) * (Math.PI / 3); pts.push(new THREE.Vector3(-hw + Math.cos(a) * w, hs + Math.sin(a) * w, 0)); }
  pts.push(new THREE.Vector3(hw, 0, 0));
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.1);
}

function normalizeUV(geo) {
  geo.computeBoundingBox();
  const b = geo.boundingBox, uv = geo.attributes.uv, p = geo.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) - b.min.x) / (b.max.x - b.min.x), (p.getY(i) - b.min.y) / (b.max.y - b.min.y));
  return geo;
}

export function archFrameGeometry(w, h, thick, depth) {
  const outer = pointedArchShape(w + thick * 2, h + thick * 1.2);
  outer.holes.push(new THREE.Path(pointedArchShape(w, h).getPoints(24)));
  const g = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 16 });
  g.translate(0, 0, -depth / 2);
  return g;
}

function onionGeometry(r) {
  const pts = [[0, 0], [r, 0], [r * 1.18, r * 0.4], [r * 1.12, r * 0.85], [r * 0.72, r * 1.3], [r * 0.3, r * 1.65], [r * 0.08, r * 1.95], [0, r * 2.2]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 16);
}

export function createCastle(scene) {
  const B = new Builder();
  const cx = CASTLE.x, cz = CASTLE.z;
  const windows = [];      // {x,y,z,ry,w,h,variant}
  const flags = [];        // {x,y,z,color}

  const tower = (x, z, r, h, roof, opts = {}) => {
    B.add('stone', new THREE.CylinderGeometry(r, r * 1.06, h, 16, 1, true), x, h / 2, z);
    B.add('stone', new THREE.CylinderGeometry(r * 1.15, r * 1.15, 1, 16), x, h, z);
    B.add('gold', new THREE.TorusGeometry(r * 1.16, 0.18, 6, 24), x, h + 0.5, z, Math.PI / 2);
    B.add('gold', new THREE.TorusGeometry(r * 1.07, 0.12, 6, 24), x, h * 0.55, z, Math.PI / 2);
    B.add('frieze', new THREE.CylinderGeometry(r * 1.075, r * 1.075, 1.4, 16, 1, true), x, h - 1.4, z);
    let top = h + 0.5;
    if (roof === 'cone') {
      const rh = opts.roofH || r * 2.8;
      B.add('roof', new THREE.ConeGeometry(r * 1.3, rh, 12), x, top + rh / 2, z);
      top += rh;
    } else if (roof === 'onion') {
      B.add('roof2', onionGeometry(r * 0.95), x, top, z);
      top += r * 0.95 * 2.2;
    }
    B.add('gold', new THREE.ConeGeometry(0.18, 2.5, 6), x, top + 1.1, z);
    B.add('gold', new THREE.SphereGeometry(0.35, 8, 6), x, top + 0.3, z);
    if (opts.flag) flags.push({ x, y: top + 2.2, z, color: opts.flag });
    // windows facing outward around the tower
    const n = opts.windows ?? 4;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (opts.wOff || 0);
      for (const wy of opts.wRows || [h * 0.42, h * 0.75]) {
        windows.push({ x: x + Math.sin(a) * (r * 1.02 + 0.05), y: wy, z: z + Math.cos(a) * (r * 1.02 + 0.05), ry: a, w: r * 0.42, h: r * 0.95, variant: i % 3 });
      }
    }
    addCollider({ x, z, r: r * 1.08 });
  };

  // --- curtain walls with battlements ---------------------------------------
  const wallH = 11, wallT = 2.6;
  const wall = (x0, z0, x1, z1) => {
    const len = Math.hypot(x1 - x0, z1 - z0), ang = Math.atan2(x1 - x0, z1 - z0);
    const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
    B.add('stone', new THREE.BoxGeometry(wallT, wallH, len), mx, wallH / 2, mz, 0, ang);
    for (const side of [-1, 1]) {
      const off = side * (wallT / 2 + 0.04);
      B.add('frieze', new THREE.PlaneGeometry(len, 1.2), mx + Math.cos(ang) * off, wallH - 1.6, mz - Math.sin(ang) * off, 0, ang - Math.PI / 2);
    }
    const count = Math.floor(len / 2.2);
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      B.add('stone', new THREE.BoxGeometry(wallT + 0.3, 1.3, 1.1), x0 + (x1 - x0) * t, wallH + 0.65, z0 + (z1 - z0) * t, 0, ang);
    }
    addCollider({ minX: Math.min(x0, x1) - wallT / 2, maxX: Math.max(x0, x1) + wallT / 2, minZ: Math.min(z0, z1) - wallT / 2, maxZ: Math.max(z0, z1) + wallT / 2, y0: 0, y1: wallH });
  };
  const fz = cz + 20, bz = cz - 20, wx = 30;
  wall(cx - wx, fz, cx - 5.5, fz);
  wall(cx + 5.5, fz, cx + wx, fz);
  wall(cx - wx, bz, cx + wx, bz);
  wall(cx - wx, bz, cx - wx, fz);
  wall(cx + wx, bz, cx + wx, fz);

  // the grand gate: pointed arch in a raised gatehouse
  const gateW = 9, gateH = 12;
  B.add('stone', archFrameGeometry(gateW, gateH, 2.2, wallT + 0.6), cx, 0, fz);
  B.add('stone', new THREE.BoxGeometry(gateW + 4.4, 3.2, wallT + 0.6), cx, gateH + 1.6 + 1.2, fz);
  const gateTrim = new THREE.TubeGeometry(pointedArchPath(gateW + 0.3, gateH + 0.2), 64, 0.22, 6, false);
  B.add('goldGlow', gateTrim, cx, 0, fz + wallT / 2 + 0.35);
  B.add('goldGlow', gateTrim, cx, 0, fz - wallT / 2 - 0.35);

  // --- towers ---------------------------------------------------------------
  for (const sx of [-1, 1]) {
    tower(cx + sx * wx, fz, 5.5, 24, 'cone', { roofH: 15, flag: sx < 0 ? '#5b3fd6' : '#d6408f' });
    tower(cx + sx * wx, bz, 5.5, 22, 'cone', { roofH: 13, flag: '#2bb7c4' });
    tower(cx + sx * 9, fz, 3.3, 18, 'onion', { windows: 3, wOff: 0.4, wRows: [12] });
  }

  // --- the keep ---------------------------------------------------------------
  const kz = cz - 2, kw = 34, kd = 22, kh = 24;
  B.add('stone', new THREE.BoxGeometry(kw, kh, kd), cx, kh / 2, kz);
  const roofShape = new THREE.Shape([new THREE.Vector2(-kd / 2 - 1, 0), new THREE.Vector2(kd / 2 + 1, 0), new THREE.Vector2(0, 11)]);
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: kw + 1, bevelEnabled: false });
  roofGeo.translate(0, 0, -(kw + 1) / 2);
  B.add('roof', roofGeo, cx, kh, kz, 0, Math.PI / 2);
  B.add('frieze', new THREE.PlaneGeometry(kw, 1.6), cx, kh - 2, kz + kd / 2 + 0.04);
  B.add('gold', new THREE.BoxGeometry(kw + 0.4, 0.3, kd + 0.4), cx, kh + 0.15, kz);
  addCollider({ minX: cx - kw / 2, maxX: cx + kw / 2, minZ: kz - kd / 2, maxZ: kz + kd / 2 });

  // keep doors (decorative, glowing)
  windows.push({ x: cx, y: 0.05, z: kz + kd / 2 + 0.06, ry: 0, w: 5, h: 8.5, variant: 1, door: true });
  // lancet windows on the keep front
  for (const x of [-12.5, -7.5, 7.5, 12.5]) windows.push({ x: cx + x, y: 5, z: kz + kd / 2 + 0.06, ry: 0, w: 2.6, h: 7.5, variant: Math.abs(x) > 10 ? 0 : 2 });
  for (const x of [-12.5, 12.5]) windows.push({ x: cx + x, y: 15, z: kz + kd / 2 + 0.06, ry: 0, w: 2.2, h: 5, variant: 1 });
  for (const s of [-1, 1]) for (const z of [-6, 0, 6]) windows.push({ x: cx + s * (kw / 2 + 0.06), y: 8, z: kz + z, ry: s * Math.PI / 2, w: 2.4, h: 7, variant: 2 });

  // keep towers
  for (const sx of [-1, 1]) {
    tower(cx + sx * 17, kz + kd / 2, 3.6, 31, 'cone', { roofH: 12, flag: '#ffd36b', wRows: [18, 26] });
    tower(cx + sx * 17, kz - kd / 2, 3.6, 29, 'onion', { wRows: [20] });
    tower(cx + sx * 9.5, kz - 5, 4.4, 40, 'cone', { roofH: 17, flag: '#9b5cff', wRows: [28, 35] });
  }
  // the grand central spire
  tower(cx, kz - 3, 7.5, 46, null, { windows: 6, wRows: [30, 38] });
  B.add('stone', new THREE.CylinderGeometry(5, 5.4, 9, 16, 1, true), cx, 51, kz - 3);
  B.add('gold', new THREE.TorusGeometry(5.5, 0.2, 6, 24), cx, 55.5, kz - 3, Math.PI / 2);
  B.add('roof', new THREE.ConeGeometry(6.3, 26, 12), cx, 55.5 + 13, kz - 3);
  B.add('gold', new THREE.ConeGeometry(0.25, 4, 6), cx, 55.5 + 27, kz - 3);
  flags.push({ x: cx, y: 55.5 + 28.5, z: kz - 3, color: '#ff5fa8', big: true });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    windows.push({ x: cx + Math.sin(a) * 5.1, y: 48.5, z: kz - 3 + Math.cos(a) * 5.1, ry: a, w: 1.6, h: 4, variant: i % 3 });
    // little pinnacles around the spire base
    B.add('roof', new THREE.ConeGeometry(0.7, 4, 6), cx + Math.sin(a + 0.5) * 7.8, 48.5, kz - 3 + Math.cos(a + 0.5) * 7.8);
  }

  // --- materials & meshes ---------------------------------------------------
  const stoneMap = stoneTexture(); stoneMap.repeat.set(3, 3);
  const frieze = friezeTexture(); frieze.repeat.set(6, 1);
  const group = B.build({
    stone: toon('#f1ecff', { map: stoneMap, emissive: '#2a2050', emissiveIntensity: 0.6 }),
    roof: toon('#3d3aa8', { emissive: '#1a1440', emissiveIntensity: 0.6 }),
    roof2: toon('#2fb2b8', { emissive: '#0d3a4a', emissiveIntensity: 0.8 }),
    gold: toon('#ffcf5a', { emissive: '#6a4a10', emissiveIntensity: 0.9 }),
    goldGlow: glowBasic('#ffd47a'),
    frieze: additive('#ffcf6a', { map: frieze, side: THREE.DoubleSide, opacity: 0.9 }),
  });

  // stained glass windows, one merged mesh per pattern, plus soft halos
  const glassB = new Builder();
  const haloB = new Builder();
  for (const w of windows) {
    const shape = pointedArchShape(w.w, w.h);
    const g = normalizeUV(new THREE.ShapeGeometry(shape, 10));
    glassB.add('g' + w.variant, g, w.x, w.y, w.z, 0, w.ry);
    const halo = new THREE.PlaneGeometry(w.w * 2.6, w.h * 1.7);
    halo.translate(0, w.h * 0.5, 0.08);
    haloB.add('halo', halo, w.x, w.y, w.z, 0, w.ry);
  }
  // rose window
  const roseMesh = new THREE.Mesh(new THREE.CircleGeometry(5.2, 48), glowBasic('#ffffff', { map: roseWindowTexture() }));
  roseMesh.position.set(cx, 17, kz + kd / 2 + 0.07);
  const roseRing = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.35, 8, 48), toon('#ffcf5a', { emissive: '#6a4a10' }));
  roseRing.position.copy(roseMesh.position);
  const glassMats = [0, 1, 2].map((v) => glowBasic('#ffffff', { map: stainedGlassTexture(v), side: THREE.DoubleSide }));
  const glass = glassB.build({ g0: glassMats[0], g1: glassMats[1], g2: glassMats[2] });
  const halos = haloB.build({ halo: additive('#8f7bff', { map: glowTexture(), opacity: 0.35 }) });
  group.add(glass, halos, roseMesh, roseRing);

  // flags
  const flagMats = new Map();
  const flagMeshes = [];
  for (const f of flags) {
    if (!flagMats.has(f.color)) flagMats.set(f.color, flagMaterial(f.color));
    const s = f.big ? 1.6 : 1;
    const geo = new THREE.PlaneGeometry(4 * s, 2.2 * s, 14, 3); geo.translate(2 * s, -1.1 * s, 0);
    const m = new THREE.Mesh(geo, flagMats.get(f.color));
    m.position.set(f.x, f.y, f.z);
    m.rotation.y = -0.6;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6 * s), glowBasic('#ffe7a8'));
    pole.position.set(f.x, f.y - 1.1 * s, f.z);
    group.add(m, pole);
    flagMeshes.push(m);
  }

  // gate doors, hinged at each side, open by default
  const doorMat = glowBasic('#ffffff', { map: stainedGlassTexture(2), side: THREE.DoubleSide });
  const doors = [-1, 1].map((s) => {
    const pivot = new THREE.Group();
    pivot.position.set(cx + s * gateW / 2, 0, fz + 0.4);
    const shapeHalf = new THREE.Shape();
    shapeHalf.moveTo(0, 0); shapeHalf.lineTo(-s * gateW / 2, 0); shapeHalf.lineTo(-s * gateW / 2, gateH * 0.92); shapeHalf.lineTo(0, gateH * 0.55); shapeHalf.lineTo(0, 0);
    const d = new THREE.Mesh(normalizeUV(new THREE.ShapeGeometry(shapeHalf)), doorMat);
    pivot.add(d);
    pivot.userData.side = s;
    group.add(pivot);
    return pivot;
  });
  let gateOpen = 1, gateTarget = 1;

  scene.add(group);

  return {
    group,
    gatePosition: new THREE.Vector3(cx, 0, fz),
    rosePosition: roseMesh.position.clone(),
    spireTop: new THREE.Vector3(cx, 84, kz - 3),
    setGate(open, instant = false) { gateTarget = open ? 1 : 0; if (instant) gateOpen = gateTarget; },
    update(t, dt) {
      for (const m of flagMats.values()) m.uniforms.uTime.value = t;
      const pulse = 0.85 + Math.sin(t * 1.3) * 0.15;
      halos.children[0].material.opacity = 0.28 * pulse + 0.05;
      gateOpen += (gateTarget - gateOpen) * Math.min(1, dt * 1.2);
      for (const d of doors) d.rotation.y = d.userData.side * gateOpen * 1.6;
    },
  };
}
