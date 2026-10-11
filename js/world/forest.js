// The Glowwood (world-layout.md v2): a dense forest wrapping the castle crag on
// every side but the lake. Seen from afar it is one lumpy canopy blanket; walking
// under it you find instanced trunks, ten 100 m giant trees breaking through the
// roof, glowing mushrooms, fireflies and twelve storybook cottages in clearings.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { glowBasic, nightGrade, toon } from './materials.js';
import { glowTexture, trunkTexture, rng } from './textures.js';
import {
  CRAG, TREE_WAY, WAY_LINE, TEMPLE_HILL, ROSE_CRAG, addCollider, groundAt, lakeDistance, cragDistance,
  isClearOfBuildings, nearestOnLine,
} from './layout.js';
import { MOOD } from './sky.js';
import { giantTrees } from './nature.js';

const R = 650;                 // forest radius round the crag
const CELL = 16;               // canopy blanket grid

function hash(x, z) { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
function noise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz), b = hash(ix + 1, iz), c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function slope(x, z) {
  const e = 5, h = groundAt(x, z) ?? 0;
  return Math.max(Math.abs((groundAt(x + e, z) ?? h) - h), Math.abs((groundAt(x, z + e) ?? h) - h)) / e;
}

// 0 where there is no forest, 1 deep inside it
function makeMask(clearings) {
  return (x, z, forTrunk = false) => {
    const d = Math.hypot(x - CRAG.x, z - CRAG.z);
    if (d > R + (noise(x * 0.01, z * 0.01) - 0.5) * 160) return 0;
    if (lakeDistance(x, z) < 14) return 0;
    if (cragDistance(x, z) < -28) return 0;                    // the castle grounds on the crag top stay open
    if (Math.hypot(x - TEMPLE_HILL.x, z - TEMPLE_HILL.z) < TEMPLE_HILL.r) return 0;
    if (Math.hypot(x - ROSE_CRAG.x, z - ROSE_CRAG.z) < ROSE_CRAG.r) return 0;
    // keep the sky open over the Giant-Tree Way; trunks may come closer than the roof
    if (nearestOnLine(WAY_LINE, x, z, TREE_WAY.hw + (forTrunk ? 20 : 30))) return 0;
    if (!isClearOfBuildings(x, z, forTrunk ? 4 : 10)) return 0;
    for (const c of clearings) if (Math.hypot(x - c.x, z - c.z) < c.r) return 0;
    if (noise(x * 0.025 + 7, z * 0.025) > 0.82) return 0;     // small natural glades
    return 1;
  };
}

// A tileable top-down view of packed tree crowns: shaded round clumps with leaf
// speckle, so the canopy sheet reads as thousands of trees from the air.
let canopyTex = null;
function canopyTexture() {
  if (canopyTex) return canopyTex;
  const S = 512, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const g = cv.getContext('2d'), r = rng(99);
  g.fillStyle = '#183c30'; g.fillRect(0, 0, S, S);
  const blob = (x, y, rad, hue, light) => {
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      const cx = x + ox, cy = y + oy;
      if (cx + rad < 0 || cx - rad > S || cy + rad < 0 || cy - rad > S) continue;
      const gr = g.createRadialGradient(cx - rad * 0.35, cy - rad * 0.35, rad * 0.1, cx, cy, rad);
      gr.addColorStop(0, `hsl(${hue},55%,${light + 22}%)`);
      gr.addColorStop(0.6, `hsl(${hue},50%,${light}%)`);
      gr.addColorStop(1, `hsl(${hue + 10},45%,${light - 14}%)`);
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rad, 0, Math.PI * 2); g.fill();
    }
  };
  for (let i = 0; i < 150; i++) blob(r() * S, r() * S, 26 + r() * 40, 110 + r() * 50, 26 + r() * 10);
  for (let i = 0; i < 9000; i++) {
    const x = r() * S, y = r() * S;
    g.fillStyle = r() < 0.5 ? 'rgba(170,230,170,0.22)' : 'rgba(0,30,20,0.25)';
    g.fillRect(x, y, 2 + r() * 2, 1 + r() * 2);
  }
  canopyTex = new THREE.CanvasTexture(cv);
  canopyTex.wrapS = canopyTex.wrapT = THREE.RepeatWrapping;
  canopyTex.colorSpace = THREE.SRGBColorSpace;
  canopyTex.anisotropy = 4;
  return canopyTex;
}

function cottage(r) {
  // a timber storybook cottage: plaster walls, steep roof, chimney, lit windows
  const w = 7 + r() * 3, d = 6 + r() * 2, h = 4.5 + r() * 1.5, rh = 4 + r() * 2;
  const walls = [new THREE.BoxGeometry(w, h, d).translate(0, h / 2, 0)];
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-d / 2 - 0.8, 0); roofShape.lineTo(0, rh); roofShape.lineTo(d / 2 + 0.8, 0); roofShape.lineTo(-d / 2 - 0.8, 0);
  const roof = new THREE.ExtrudeGeometry(roofShape, { depth: w + 1.2, bevelEnabled: false });
  roof.translate(0, 0, -(w + 1.2) / 2); roof.rotateY(Math.PI / 2); roof.translate(0, h - 0.1, 0);
  const chimney = new THREE.BoxGeometry(1, 3, 1).translate(w * 0.28, h + rh * 0.6, d * 0.15);
  const beams = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) beams.push(new THREE.BoxGeometry(0.35, h, 0.35).translate(sx * w / 2, h / 2, sz * d / 2));
  beams.push(new THREE.BoxGeometry(w + 0.2, 0.35, 0.35).translate(0, h * 0.55, d / 2), new THREE.BoxGeometry(w + 0.2, 0.35, 0.35).translate(0, h * 0.55, -d / 2));
  const windows = [];
  for (const sx of [-0.28, 0.28]) for (const sz of [-1, 1]) windows.push(new THREE.PlaneGeometry(1.1, 1.3).rotateY(sz > 0 ? 0 : Math.PI).translate(sx * w, h * 0.68, sz * (d / 2 + 0.03)));
  const door = new THREE.PlaneGeometry(1.3, 2.3).translate(0, 1.15, d / 2 + 0.04);
  return { walls, roof: [roof, chimney], beams: [...beams, door], windows, w, d };
}

export function createForest(scene, preset) {
  const r = rng(4321);
  const group = new THREE.Group();
  const low = preset.grass < 4000;

  // --- twelve cottages in their own clearings ---------------------------------
  const homes = [];
  for (let tries = 0; homes.length < 12 && tries < 3000; tries++) {
    const a = r() * Math.PI * 2, d = 160 + r() * (R - 220);
    const x = CRAG.x + Math.cos(a) * d, z = CRAG.z + Math.sin(a) * d;
    if (lakeDistance(x, z) < 30 || cragDistance(x, z) < 10 || !isClearOfBuildings(x, z, 16)) continue;
    if (nearestOnLine(WAY_LINE, x, z, TREE_WAY.hw + 24)) continue;
    if (slope(x, z) > 0.25 || homes.some((h) => Math.hypot(h.x - x, h.z - z) < 90)) continue;
    homes.push({ x, z, r: 22, y: groundAt(x, z) ?? 0, a: r() * Math.PI * 2 });
  }
  const mask = makeMask(homes);
  {
    const parts = { walls: [], roof: [], beams: [], windows: [] };
    for (const hm of homes) {
      const c = cottage(r), m = new THREE.Matrix4().makeRotationY(hm.a).setPosition(hm.x, hm.y - 0.3, hm.z);
      for (const k of Object.keys(parts)) for (const g of c[k]) parts[k].push(g.applyMatrix4(m));
      const half = Math.max(c.w, c.d) / 2;
      addCollider({ x: hm.x, z: hm.z, r: half * 0.9 });
    }
    const flat = (gs) => mergeGeometries(gs.map((g) => { g = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); return g; }));
    group.add(
      new THREE.Mesh(flat(parts.walls), nightGrade(new THREE.MeshLambertMaterial({ color: '#f3e6d4', emissive: '#2a2040', emissiveIntensity: 0.35 }), 'cottage-wall')),
      new THREE.Mesh(flat(parts.roof), nightGrade(new THREE.MeshLambertMaterial({ color: '#b2406e', emissive: '#2a0a20', emissiveIntensity: 0.4 }), 'cottage-roof')),
      new THREE.Mesh(flat(parts.beams), new THREE.MeshLambertMaterial({ color: '#6a4632', emissive: '#1a0e10', emissiveIntensity: 0.4 })),
      new THREE.Mesh(flat(parts.windows), glowBasic('#ffc070')),
    );
  }

  // --- the canopy blanket -----------------------------------------------------
  // One indexed sheet over the forest. Masked-out points just past the edge drop
  // to a lower fringe; points further out are never used.
  const n = Math.ceil((R + 120) * 2 / CELL) + 1, x0 = CRAG.x - (n - 1) * CELL / 2, z0 = CRAG.z - (n - 1) * CELL / 2;
  const H = new Float32Array(n * n), M = new Uint8Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = x0 + i * CELL, z = z0 + j * CELL, k = j * n + i;
    M[k] = mask(x, z);
    const g = groundAt(x, z) ?? 0;
    H[k] = M[k] ? g + 27 + noise(x * 0.03, z * 0.03) * 12 + noise(x * 0.09, z * 0.09) * 6 : g + 13;
  }
  const pos = [], col = [], uv = [], idx = [], speck = [], vid = new Int32Array(n * n).fill(-1);
  const c = new THREE.Color();
  const vert = (i, j) => {
    const k = j * n + i;
    if (vid[k] >= 0) return vid[k];
    const x = x0 + i * CELL, z = z0 + j * CELL;
    pos.push(x, H[k], z); uv.push(x / 46, z / 46);
    const t = noise(x * 0.012 + 3, z * 0.012), p = noise(x * 0.03, z * 0.03 + 9);
    c.setHSL(0.36 + t * 0.12, 0.35 + t * 0.25, 0.75 + t * 0.25);
    if (p > 0.78) c.setHSL(0.9, 0.45, 0.85);                    // a pink-blossom patch
    col.push(c.r, c.g, c.b);
    return (vid[k] = pos.length / 3 - 1);
  };
  for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) {
    const a = j * n + i, b = a + 1, d = a + n, e = d + 1;
    if (M[a] + M[b] + M[d] + M[e] === 0) continue;
    const va = vert(i, j), vb = vert(i + 1, j), vd = vert(i, j + 1), ve = vert(i + 1, j + 1);
    idx.push(va, vd, vb, vb, vd, ve);
    if (M[a] && r() < (low ? 0.25 : 0.45)) speck.push(x0 + (i + r()) * CELL, H[a] + 3 + r() * 3, z0 + (j + r()) * CELL);
  }
  const bg = new THREE.BufferGeometry();
  bg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  bg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  bg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  bg.setIndex(idx);
  bg.computeVertexNormals();
  const blanket = new THREE.Mesh(bg, nightGrade(new THREE.MeshLambertMaterial({ vertexColors: true, map: canopyTexture(), emissive: '#0a2a30', emissiveIntensity: 0.45, side: THREE.DoubleSide }), 'canopy-blanket'));
  blanket.receiveShadow = true;
  group.add(blanket);

  // --- trunks under the roof --------------------------------------------------
  const trunks = [];
  const STEP = low ? 26 : 21;
  for (let z = z0; z < z0 + n * CELL; z += STEP) for (let x = x0; x < x0 + n * CELL; x += STEP) {
    const tx = x + (r() - 0.5) * STEP * 0.8, tz = z + (r() - 0.5) * STEP * 0.8;
    if (!mask(tx, tz, true) || slope(tx, tz) > 1.1) continue;
    const i = Math.round((tx - x0) / CELL), j = Math.round((tz - z0) / CELL), top = H[j * n + i];
    const g = groundAt(tx, tz) ?? 0;
    if (!(top > g + 10)) continue;
    trunks.push({ x: tx, z: tz, y: g - 3, h: top - g - 2.5, w: 1.6 + r() * 1.4 });
  }
  const tgeo = new THREE.CylinderGeometry(0.45, 0.75, 1, 7, 1, true).translate(0, 0.5, 0);
  const tTex = trunkTexture();
  const tm = new THREE.InstancedMesh(tgeo, toon('#c8b8d8', { map: tTex, emissive: '#2a1a40', emissiveIntensity: 0.4 }), trunks.length);
  const dmy = new THREE.Object3D();
  trunks.forEach((t, i) => {
    dmy.position.set(t.x, t.y, t.z); dmy.rotation.set((r() - 0.5) * 0.06, r() * 6.28, (r() - 0.5) * 0.06); dmy.scale.set(t.w, t.h, t.w);
    dmy.updateMatrix(); tm.setMatrixAt(i, dmy.matrix);
    addCollider({ x: t.x, z: t.z, r: t.w * 0.6 });
  });
  group.add(tm);

  // --- ten 100 m giant trees bursting through the canopy ----------------------
  const giants = [];
  for (let tries = 0; giants.length < 10 && tries < 4000; tries++) {
    const a = (giants.length / 10) * Math.PI * 2 + (r() - 0.5) * 0.5, d = 260 + r() * 300;
    const x = CRAG.x + Math.cos(a) * d, z = CRAG.z + Math.sin(a) * d;
    if (!mask(x, z, true) || slope(x, z) > 0.6 || giants.some((g) => Math.hypot(g.x - x, g.z - z) < 120)) continue;
    giants.push({ x, z, y: (groundAt(x, z) ?? 0) - 1, h: 92 + r() * 14, sc: 38 + r() * 8, w: 15 + r() * 4, pink: giants.length % 3 === 0 });
  }
  giantTrees(group, giants, preset);

  // --- glowing mushrooms on the forest floor and by the road ------------------
  const shrooms = [];
  for (let tries = 0; shrooms.length < (low ? 220 : 420) && tries < 20000; tries++) {
    let x, z;
    if (r() < 0.4) {                      // along the Giant-Tree Way's verges
      const s = WAY_LINE.samples[Math.floor(r() * WAY_LINE.samples.length)], a = r() * Math.PI * 2, d = TREE_WAY.hw + 3 + r() * 14;
      x = s.x + Math.cos(a) * d; z = s.z + Math.sin(a) * d;
      if (nearestOnLine(WAY_LINE, x, z, TREE_WAY.hw + 2.5)) continue;
    } else {
      const t = trunks[Math.floor(r() * trunks.length)];
      if (!t) break;
      const a = r() * Math.PI * 2, d = t.w + 1 + r() * 5;
      x = t.x + Math.cos(a) * d; z = t.z + Math.sin(a) * d;
    }
    const y = groundAt(x, z);
    if (y == null || !isClearOfBuildings(x, z, 0)) continue;
    shrooms.push({ x, y, z, s: 0.6 + r() * 1.8 });
  }
  const cap = new THREE.SphereGeometry(0.5, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.6, 1).translate(0, 0.9, 0);
  const stem = new THREE.CylinderGeometry(0.1, 0.16, 0.9, 5).translate(0, 0.45, 0);
  const sg = mergeGeometries([cap, stem].map((g) => (g.index ? g.toNonIndexed() : g)));
  const sm = new THREE.InstancedMesh(sg, glowBasic('#ffffff'), shrooms.length);
  const glows = [];
  const sc = ['#7ff3ff', '#ff9bd6', '#b48cff', '#9fffc8'];
  shrooms.forEach((m, i) => {
    dmy.position.set(m.x, m.y - 0.05, m.z); dmy.rotation.set((r() - 0.5) * 0.3, r() * 6, (r() - 0.5) * 0.3); dmy.scale.setScalar(m.s);
    dmy.updateMatrix(); sm.setMatrixAt(i, dmy.matrix);
    const cc = sc[i % sc.length]; sm.setColorAt(i, c.set(cc));
    glows.push(m.x, m.y + 0.8 * m.s, m.z);
  });
  group.add(sm);

  // --- fireflies and canopy speckles: one point cloud each --------------------
  const ff = [];
  for (let i = 0; i < (low ? 500 : 1100); i++) {
    const t = trunks[Math.floor(r() * trunks.length)];
    if (!t) break;
    ff.push(t.x + (r() - 0.5) * 20, t.y + 1.5 + r() * 9, t.z + (r() - 0.5) * 20);
  }
  const pointsMat = (color, size, twinkle) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uMap: { value: glowTexture() }, uTime: { value: 0 }, uNight: MOOD.night, uColor: { value: new THREE.Color(color) }, uSize: { value: size }, uTw: { value: twinkle } },
    vertexShader: /* glsl */`
      uniform float uTime; uniform float uSize; uniform float uTw; varying float vA;
      void main(){
        vec3 p = position;
        float ph = fract(sin(dot(p.xz, vec2(12.9898, 78.233))) * 43758.5) * 6.28;
        p += uTw * vec3(sin(uTime * .7 + ph) * 1.5, sin(uTime * .9 + ph * 2.) * .8, cos(uTime * .6 + ph) * 1.5);
        vA = .45 + .55 * sin(uTime * (1.5 + uTw) + ph * 3.);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_PointSize = uSize * 300. / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform vec3 uColor; uniform float uNight; varying float vA;
      void main(){ float a = texture2D(uMap, gl_PointCoord).a; gl_FragColor = vec4(uColor * a * vA * (.25 + .75 * uNight), 1.); }`,
  });
  const cloud = (arr, mat) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); const p = new THREE.Points(g, mat); p.frustumCulled = false; group.add(p); return mat; };
  const mats = [
    cloud(ff, pointsMat('#d8ff8a', 1.1, 1)),
    cloud(speck, pointsMat('#7ff3ff', 5, 0)),
    cloud(glows, pointsMat('#ff9bd6', 2.4, 0)),
  ];

  scene.add(group);
  return {
    trunks: trunks.length, giants: giants.length, homes,
    update(t) { for (const m of mats) m.uniforms.uTime.value = t; },
  };
}
