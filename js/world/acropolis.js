// The way in (world-layout.md v2, sections 4 and 5): Lantern Cove, the long
// lake and its arcaded bridge with two domed pavilions, the Moon Palace on the
// water, the islet tower, the Mother Tree, the Great Gate pylons, the winding
// Giant-Tree Way up the crag, the castle's marble podium terraces and the
// white Lagoon City on the west shore.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { glowBasic, additive, nightGrade, toon } from './materials.js';
import { arcadeTexture, flagstoneTexture, glowTexture, stoneTexture, leafTexture, rosetteTexture, rockTexture, rng } from './textures.js';
import {
  TERRACES, TERRACE_REAR, STAIR, CRAG, BRIDGE, BRIDGE_LINE, WAY_LINE, TREE_WAY, LAKE_LINE, COVE, LAGOON, WHEEL,
  addCollider, addPad, groundAt, lakeDistance, isClearOfBuildings, nearestOnLine,
} from './layout.js';
import { MOOD } from './sky.js';
import { giantTrees, canopyGeometry, leafCardGeometry, canopyMaterial } from './nature.js';

const MARBLE = '#f6e4ee';

function box(w, h, d, x, y, z) { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; }
function clean(g) {
  g = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  return g;
}
const merge = (list) => mergeGeometries(list.map(clean));
function marbleMat(key, repeat = 1) {
  const t = stoneTexture().clone(); t.needsUpdate = true; t.repeat.set(repeat, repeat);
  return nightGrade(new THREE.MeshLambertMaterial({ color: MARBLE, map: t, emissive: '#3e2250', emissiveIntensity: 0.4 }), key);
}
const goldMat = () => new THREE.MeshLambertMaterial({ color: '#e0b040', emissive: '#6a4a10', emissiveIntensity: 0.8 });
const roseMat = () => toon('#9c3a68', { emissive: '#2a0e2a', emissiveIntensity: 0.6 });
// an onion dome profile of radius R, built at its base
function onion(R, segs = 20) {
  const pts = [[0, 0], [R * 0.98, 0], [R * 1.16, R * 0.45], [R * 1.08, R * 0.95], [R * 0.7, R * 1.45], [R * 0.25, R * 1.85], [R * 0.08, R * 2.1], [0, R * 2.25]];
  return new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), segs);
}
// point and heading along a sampled line at distance s
function along(L, s) {
  const S = L.samples;
  let lo = 0, hi = S.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s < s) lo = m; else hi = m; }
  const a = S[lo], b = S[hi], t = b.s > a.s ? (s - a.s) / (b.s - a.s) : 0;
  return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, y: a.y + (b.y - a.y) * t, h: Math.atan2(b.x - a.x, b.z - a.z) };
}
// points in a row of circle colliders, for railings that are not axis aligned
function railColliders(pts, every = 1.5, r = 0.45, y0, y1) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[i + 1], d = Math.hypot(bx - ax, bz - az);
    for (let k = 0; k < d; k += every) addCollider({ x: ax + (bx - ax) * (k / d), z: az + (bz - az) * (k / d), r, y0, y1 });
  }
}

// --- the castle's podium terraces and grand stairs ---------------------------
function terraces(group) {
  const bodies = [], tops = [], fronts = [], gold = [], rails = [], posts = [];
  let prev = CRAG.y;
  for (const T of TERRACES) {
    const depth = T.front - TERRACE_REAR, cz = (T.front + TERRACE_REAR) / 2, hgt = T.y - CRAG.y + 2;
    bodies.push(box(T.hw * 2, hgt, depth, 0, T.y - hgt / 2, cz));
    const top = new THREE.PlaneGeometry(T.hw * 2, depth); top.rotateX(-Math.PI / 2); top.translate(0, T.y + 0.02, cz);
    tops.push(top);
    const fh = T.y - prev;
    const f = new THREE.PlaneGeometry(T.hw * 2, fh); f.translate(0, prev + fh / 2, T.front + 0.03);
    const fu = f.attributes.uv; for (let i = 0; i < fu.count; i++) fu.setX(i, fu.getX(i) * Math.round(T.hw * 2 / 7));
    fronts.push(f);
    for (const s of [-1, 1]) {
      const side = new THREE.PlaneGeometry(depth, T.y - CRAG.y); side.rotateY(s * Math.PI / 2); side.translate(s * (T.hw + 0.03), (T.y + CRAG.y) / 2, cz);
      const su = side.attributes.uv; for (let i = 0; i < su.count; i++) su.setX(i, su.getX(i) * Math.round(depth / 7));
      fronts.push(side);
    }
    gold.push(box(T.hw * 2 + 0.6, 0.35, 0.6, 0, T.y + 0.1, T.front + 0.1));
    for (const s of [-1, 1]) {
      const len = T.hw - STAIR.hw - 1, mx = s * (STAIR.hw + 1 + len / 2);
      rails.push(box(len, 0.18, 0.4, mx, T.y + 1.05, T.front - 0.3), box(len, 0.25, 0.5, mx, T.y + 0.2, T.front - 0.3));
      for (let x = STAIR.hw + 1.4; x < T.hw - 0.4; x += 0.9) posts.push([s * x, T.y + 0.6, T.front - 0.3]);
      gold.push(box(0.9, 2.2, 0.9, s * (STAIR.hw + 0.9), T.y + 1.1, T.front - 0.3));
    }
    const steps = 12, rise = (T.y - prev) / steps, run = STAIR.run / steps;
    for (let i = 0; i < steps; i++) {
      const top = prev + rise * (i + 1);
      bodies.push(box(STAIR.hw * 2, top - CRAG.y + 1, run, 0, (top + CRAG.y - 1) / 2, T.front + STAIR.run - run * (i + 0.5)));
    }
    for (const s of [-1, 1]) {
      const cheek = new THREE.BoxGeometry(1.2, 1, STAIR.run);
      const p = cheek.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const zz = p.getZ(i), yy = p.getY(i);
        p.setY(i, yy > 0 ? prev + (T.y - prev) * (0.5 - zz / STAIR.run) + 1.2 : CRAG.y - 1);
      }
      cheek.computeVertexNormals();
      cheek.translate(s * (STAIR.hw + 0.6), 0, T.front + STAIR.run / 2);
      bodies.push(cheek);
    }
    for (const s of [-1, 1]) {
      const x0 = s < 0 ? -T.hw : STAIR.hw, x1 = s < 0 ? -STAIR.hw : T.hw;
      addCollider({ minX: x0, maxX: x1, minZ: TERRACE_REAR, maxZ: T.front, y0: prev, y1: T.y - 0.3 });
    }
    prev = T.y;
  }
  const marble = marbleMat('marble', 6);
  const B = new THREE.Mesh(merge(bodies), marble);
  B.castShadow = B.receiveShadow = true;
  const pave = flagstoneTexture().clone(); pave.needsUpdate = true; pave.repeat.set(40, 30);
  const P = new THREE.Mesh(mergeGeometries(tops), new THREE.MeshLambertMaterial({ map: pave, emissive: '#2a2050', emissiveIntensity: 0.35 }));
  P.receiveShadow = true;
  const F = new THREE.Mesh(mergeGeometries(fronts), new THREE.MeshLambertMaterial({ map: arcadeTexture(), emissive: '#3e2250', emissiveIntensity: 0.4 }));
  const G = new THREE.Mesh(merge(gold), goldMat());
  const R = new THREE.Mesh(merge(rails), marble);
  const postMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.11, 0.16, 0.9, 6), marble, posts.length);
  const d = new THREE.Object3D();
  posts.forEach(([x, y, z], i) => { d.position.set(x, y, z); d.updateMatrix(); postMesh.setMatrixAt(i, d.matrix); });
  group.add(B, P, F, G, R, postMesh);
}

// --- the long lake: a sky mirror over the whole basin -------------------------
function lake(group) {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const s of LAKE_LINE.samples) { x0 = Math.min(x0, s.x); x1 = Math.max(x1, s.x); z0 = Math.min(z0, s.z); z1 = Math.max(z1, s.z); }
  x0 -= 220; x1 += 220; z0 -= 220; z1 += 220;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uNight: MOOD.night },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: /* glsl */`
      uniform float uTime; uniform float uNight; varying vec3 vW;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 q = vW.xz;
        vec3 n = normalize(vec3(
          sin(q.x * .35 + uTime * 1.1) * .3 + sin(q.x * 1.3 - q.y * .9 + uTime * 1.7) * .15,
          7.,
          sin(q.y * .45 - uTime * .9) * .3 + sin(q.y * 1.5 + q.x * .7 + uTime * 1.4) * .15));
        vec3 v = normalize(vW - cameraPosition);
        vec3 rd = reflect(v, n);
        float up = clamp(rd.y, 0., 1.);
        vec3 duskSky = mix(vec3(.66, .44, .62), vec3(.30, .26, .58), pow(up, .6));
        vec3 nightSky = mix(vec3(.34, .24, .56), vec3(.10, .08, .26), pow(up, .6));
        vec3 c = mix(mix(vec3(.18, .20, .44), vec3(.08, .09, .28), uNight), mix(duskSky, nightSky, uNight), .4 + .5 * pow(1. - abs(v.y), 2.));
        // the castle's pink glow mirrored on the water towards it
        vec2 toC = normalize(vec2(0., -60.) - q), toV = normalize(cameraPosition.xz - q);
        float mirror = pow(max(0., dot(toC, -toV)), 40.) * smoothstep(1400., 200., length(q - vec2(0., -60.)));
        c += vec3(1., .5, .78) * mirror * (.15 + .45 * uNight) * (.7 + .3 * sin(q.y * .8 + uTime * 2.));
        float rip = sin(q.x * .12 + q.y * .08 + uTime * .6) * sin(q.y * .17 - uTime * .4);
        c += vec3(.9, .7, .9) * smoothstep(.6, 1., rip) * (.06 + .05 * uNight);
        vec2 g = floor(q * .8), f = fract(q * .8) - .5;
        float s = step(.997, h(g)) * smoothstep(.3, 0., length(f)) * (.5 + .5 * sin(uTime * 3. + h(g + 1.) * 40.));
        c += vec3(1., .9, .75) * s * (.3 + .7 * uNight);
        gl_FragColor = vec4(pow(c, vec3(2.2)), 1.);
        #include <colorspace_fragment>
      }
    `,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mat);
  water.rotation.x = -Math.PI / 2; water.position.set((x0 + x1) / 2, -0.25, (z0 + z1) / 2);
  group.add(water);
  return mat;
}

// --- the long bridge ----------------------------------------------------------
function bridge(group, lamps) {
  const L = BRIDGE_LINE.length, Y = BRIDGE.y, W = BRIDGE.hw * 2;
  const mid = L - 2 * BRIDGE.ramp, n = Math.round(mid / 16), span = mid / n;
  // one arcaded module: deck, a big lower arch and two small upper arches
  const parts = [], gold = [];
  parts.push(box(W, 0.9, span, 0, Y - 0.45, 0));
  const arcade = (z0, z1, y0, y1, holes, depth) => {
    const sh = new THREE.Shape();
    sh.moveTo(z0, y0); sh.lineTo(z1, y0); sh.lineTo(z1, y1); sh.lineTo(z0, y1); sh.lineTo(z0, y0);
    for (const [c, ar, spring] of holes) {
      const p = new THREE.Path();
      p.moveTo(c - ar, y0); p.lineTo(c - ar, spring); p.absarc(c, spring, ar, Math.PI, 0, true); p.lineTo(c + ar, y0); p.lineTo(c - ar, y0);
      sh.holes.push(p);
    }
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false, curveSegments: 10 });
    g.translate(0, 0, -depth / 2); g.rotateY(Math.PI / 2);
    const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.12, uv.getY(i) * 0.12);
    return g;
  };
  const H1 = 6.5, lowR = span / 2 - 1.6, upR = span / 4 - 0.9;
  parts.push(arcade(-span / 2, span / 2, -10, H1, [[0, lowR, H1 - 1.2 - lowR]], W - 2));
  parts.push(arcade(-span / 2, span / 2, H1, Y - 0.9, [[-span / 4, upR, Y - 2 - upR], [span / 4, upR, Y - 2 - upR]], W - 2.6));
  for (const s of [-1, 1]) {
    parts.push(box(0.6, 1.1, span, s * (BRIDGE.hw - 0.3), Y + 0.55, 0));
    gold.push(box(0.75, 0.16, span, s * (BRIDGE.hw - 0.3), Y + 1.15, 0));
    gold.push(box(0.3, 0.3, span, s * (BRIDGE.hw - 1), H1, 0));                 // gold string course
  }
  const modGeo = merge(parts), goldGeo = merge(gold);
  const marble = marbleMat('bridge', 1);
  const mods = new THREE.InstancedMesh(modGeo, marble, n), golds = new THREE.InstancedMesh(goldGeo, goldMat(), n);
  const d = new THREE.Object3D();
  for (let i = 0; i < n; i++) {
    const p = along(BRIDGE_LINE, BRIDGE.ramp + span * (i + 0.5));
    d.position.set(p.x, 0, p.z); d.rotation.set(0, p.h, 0); d.updateMatrix();
    mods.setMatrixAt(i, d.matrix); golds.setMatrixAt(i, d.matrix);
  }
  mods.castShadow = mods.receiveShadow = true;
  group.add(mods, golds);
  // the two ramps down to the shores, on simple piers
  const ramps = [];
  const y0 = groundAt(BRIDGE.pts[0][0], BRIDGE.pts[0][1]) ?? 5;
  for (const [sa, sb] of [[0, BRIDGE.ramp], [L - BRIDGE.ramp, L]]) {
    for (let s = sa; s < sb - 0.01; s += 5) {
      const a = along(BRIDGE_LINE, s), b = along(BRIDGE_LINE, Math.min(sb, s + 5));
      const ya = rampY(s, L, y0), yb = rampY(Math.min(sb, s + 5), L, y0), len = Math.hypot(b.x - a.x, b.z - a.z);
      const g = new THREE.BoxGeometry(W, 0.9, len + 0.2);
      g.rotateX(-Math.atan2(yb - ya, len)); g.rotateY(a.h); g.translate((a.x + b.x) / 2, (ya + yb) / 2 - 0.45, (a.z + b.z) / 2);
      ramps.push(g);
      for (const sd of [-1, 1]) {
        const pg = new THREE.BoxGeometry(0.6, 1.1, len + 0.2);
        pg.rotateX(-Math.atan2(yb - ya, len)); pg.translate(sd * (BRIDGE.hw - 0.3), 0, 0); pg.rotateY(a.h);
        pg.translate((a.x + b.x) / 2, (ya + yb) / 2 + 0.55, (a.z + b.z) / 2);
        ramps.push(pg);
      }
      if (Math.round(s) % 10 === 0) {
        const pier = new THREE.BoxGeometry(W - 3, ya + 10, 2); pier.rotateY(a.h); pier.translate(a.x, (ya - 10) / 2 - 0.9, a.z);
        ramps.push(pier);
      }
    }
  }
  group.add(new THREE.Mesh(merge(ramps), marble));
  // railings keep you on the deck
  for (const sd of [-1, 1]) {
    const pts = [];
    for (let s = 2; s < L - 2; s += 6) { const p = along(BRIDGE_LINE, s); pts.push([p.x + Math.cos(p.h) * sd * (BRIDGE.hw - 0.2), p.z - Math.sin(p.h) * sd * (BRIDGE.hw - 0.2)]); }
    railColliders(pts, 1.4, 0.45, -2, 40);
  }
  // lamps every 20 m on both parapets
  for (let s = 10; s < L - 5; s += 20) {
    const p = along(BRIDGE_LINE, s), y = rampY(s, L, y0);
    for (const sd of [-1, 1]) lamps.push([p.x + Math.cos(p.h) * sd * (BRIDGE.hw - 0.3), y + 2.6, p.z - Math.sin(p.h) * sd * (BRIDGE.hw - 0.3)]);
  }
  // two domed pavilions on the deck
  const pav = [], pavGold = [], pavRoof = [];
  for (const s of [L * 0.36, L * 0.66]) {
    const p = along(BRIDGE_LINE, s), c = Math.cos(p.h), sn = Math.sin(p.h);
    const at = (lx, lz) => [p.x + c * lx + sn * lz, p.z - sn * lx + c * lz];
    for (const lx of [-1, 1]) for (const lz of [-1, 1]) {
      const [x, z] = at(lx * (BRIDGE.hw - 0.4), lz * 6);
      const col = new THREE.CylinderGeometry(0.55, 0.7, 10, 10); col.translate(x, Y + 5, z); pav.push(col);
      addCollider({ x, z, r: 0.8, y0: Y - 1, y1: Y + 10 });
    }
    const ring = new THREE.CylinderGeometry(9.4, 9.4, 1.6, 24, 1, true); ring.translate(p.x, Y + 10.8, p.z); pav.push(ring);
    const slab = new THREE.CylinderGeometry(9.6, 9.6, 0.5, 24); slab.translate(p.x, Y + 11.8, p.z); pavGold.push(slab);
    const dome = onion(7); dome.translate(p.x, Y + 12, p.z); pavRoof.push(dome);
    const fin = new THREE.ConeGeometry(0.4, 4, 6); fin.translate(p.x, Y + 12 + 7 * 2.25 + 1.8, p.z); pavGold.push(fin);
    lamps.push([p.x, Y + 9, p.z]);
  }
  group.add(new THREE.Mesh(merge(pav), marble), new THREE.Mesh(merge(pavGold), goldMat()), new THREE.Mesh(merge(pavRoof), roseMat()));
}
function rampY(s, L, y0) {
  if (s < BRIDGE.ramp) return y0 + (BRIDGE.y - y0) * (s / BRIDGE.ramp);
  if (s > L - BRIDGE.ramp) return 1.5 + (BRIDGE.y - 1.5) * ((L - s) / BRIDGE.ramp);
  return BRIDGE.y;
}

// which side of the bridge at s has more open water at distance `off`
function waterSide(s, off) {
  const p = along(BRIDGE_LINE, s), c = Math.cos(p.h), sn = Math.sin(p.h);
  const a = [p.x + c * off, p.z - sn * off], b = [p.x - c * off, p.z + sn * off];
  return lakeDistance(...a) < lakeDistance(...b) ? { p, side: 1, x: a[0], z: a[1] } : { p, side: -1, x: b[0], z: b[1] };
}

// --- the Moon Palace: a Mughal water palace joined to the bridge by a spur ----
function moonPalace(group, lamps) {
  const L = BRIDGE_LINE.length, w = waterSide(L * 0.5, 96), { p } = w;
  const a = Math.atan2(w.x - p.x, w.z - p.z);           // heading out along the spur
  const Y = BRIDGE.y, R = 22, cx = w.x, cz = w.z;
  const parts = [], gold = [], roofs = [], glass = [];
  // podium rising from the water, paved on top
  parts.push(box(R * 2, Y + 10, R * 2, 0, Y / 2 - 5, 0));
  // central hall with a great onion dome, four chhatris and four minarets
  parts.push(box(24, 12, 24, 0, Y + 6, 0));
  glass.push(box(24.2, 7, 6, 0, Y + 5, 0), box(6, 7, 24.2, 0, Y + 5, 0));
  const drum = new THREE.CylinderGeometry(9, 9, 4, 24); drum.translate(0, Y + 14, 0); parts.push(drum);
  const dome = onion(9.5, 24); dome.translate(0, Y + 16, 0); roofs.push(dome);
  const fin = new THREE.ConeGeometry(0.6, 5, 6); fin.translate(0, Y + 16 + 9.5 * 2.25 + 2.4, 0); gold.push(fin);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const mx = sx * 15, mz = sz * 15;
    const m = new THREE.CylinderGeometry(1.1, 1.4, 26, 12); m.translate(mx, Y + 13, mz); parts.push(m);
    const bal = new THREE.CylinderGeometry(2, 2, 0.6, 12); bal.translate(mx, Y + 20, mz); gold.push(bal);
    const md = onion(1.5, 12); md.translate(mx, Y + 26, mz); roofs.push(md);
    const kx = sx * (R - 3), kz = sz * (R - 3);
    for (const [ox, oz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) { const c = new THREE.CylinderGeometry(0.3, 0.35, 4.5, 8); c.translate(kx + ox, Y + 2.25, kz + oz); parts.push(c); }
    const kd = onion(2.7, 14); kd.translate(kx, Y + 4.6, kz); roofs.push(kd);
    addCollider({ x: cx + mx * Math.cos(a) + mz * Math.sin(a), z: cz - mx * Math.sin(a) + mz * Math.cos(a), r: 1.6, y0: Y - 1, y1: Y + 30 });
  }
  gold.push(box(R * 2 + 0.6, 0.4, R * 2 + 0.6, 0, Y + 0.2, 0));
  const g = new THREE.Group();
  g.position.set(cx, 0, cz); g.rotation.y = a;
  g.add(new THREE.Mesh(merge(parts), marbleMat('palace', 2)), new THREE.Mesh(merge(gold), goldMat()), new THREE.Mesh(merge(roofs), roseMat()));
  g.add(new THREE.Mesh(merge(glass), glowBasic('#ff9fd0')));
  group.add(g);
  addPad({ x: cx, z: cz, hw: R, hd: R, a, y: Y });
  addCollider({ x: cx, z: cz, r: 13.5, y0: Y - 1, y1: Y + 20 });
  // the spur from the bridge deck
  const len = 96 - R - BRIDGE.hw, sx = p.x + Math.sin(a) * (BRIDGE.hw + len / 2), sz = p.z + Math.cos(a) * (BRIDGE.hw + len / 2);
  const spur = [box(6, 0.9, len + 1, 0, Y - 0.45, 0), box(0.5, 1, len, -2.9, Y + 0.5, 0), box(0.5, 1, len, 2.9, Y + 0.5, 0)];
  for (let k = -len / 2 + 6; k < len / 2; k += 12) spur.push(box(4.5, Y + 10, 1.6, 0, Y / 2 - 5.9, k));
  const sg = new THREE.Mesh(merge(spur), marbleMat('spur', 1)); sg.position.set(sx, 0, sz); sg.rotation.y = a;
  group.add(sg);
  addPad({ x: sx, z: sz, hw: 3, hd: len / 2 + 0.5, a, y: Y });
  for (const sd of [-1, 1]) {
    const ox = Math.cos(a) * sd * 2.9, oz = -Math.sin(a) * sd * 2.9;
    railColliders([[p.x + Math.sin(a) * (BRIDGE.hw + 1) + ox, p.z + Math.cos(a) * (BRIDGE.hw + 1) + oz], [cx - Math.sin(a) * R + ox, cz - Math.cos(a) * R + oz]], 1.4, 0.4, Y - 1, Y + 3);
  }
  for (const sx2 of [-1, 1]) for (const sz2 of [-1, 1]) lamps.push([cx + (sx2 * Math.cos(a) + sz2 * Math.sin(a)) * (R - 1), Y + 1.8, cz + (-sx2 * Math.sin(a) + sz2 * Math.cos(a)) * (R - 1)]);
  return w.side;
}

// --- the islet tower on an eroded rock pedestal ---------------------------------
function isletTower(group, side, lamps) {
  const L = BRIDGE_LINE.length, p = along(BRIDGE_LINE, L * 0.22), off = 70 * side;
  const x = p.x + Math.cos(p.h) * off, z = p.z - Math.sin(p.h) * off;
  const rock = new THREE.LatheGeometry([[0, -10], [11, -10], [9, 0], [6.5, 10], [7, 18], [12, 24], [12.5, 25], [0, 25]].map(([a, b]) => new THREE.Vector2(a, b)), 16);
  const rp = rock.attributes.position;
  for (let i = 0; i < rp.count; i++) { const k = 1 + Math.sin(rp.getY(i) * 0.7 + Math.atan2(rp.getZ(i), rp.getX(i)) * 3) * 0.08; rp.setX(i, rp.getX(i) * k); rp.setZ(i, rp.getZ(i) * k); }
  rock.computeVertexNormals();
  const rm = rockTexture();
  const R = new THREE.Mesh(rock, new THREE.MeshLambertMaterial({ color: '#b49ac8', map: rm, emissive: '#1a1440', emissiveIntensity: 0.6 }));
  R.position.set(x, 0, z);
  const t = [new THREE.CylinderGeometry(5.6, 6, 34, 18).translate(0, 42, 0), new THREE.CylinderGeometry(6.6, 6.6, 2, 18).translate(0, 59, 0)];
  const T = new THREE.Mesh(merge(t), marbleMat('islet', 2)); T.position.set(x, 0, z);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(7.6, 16, 18).translate(0, 68, 0), roseMat()); cone.position.set(x, 0, z);
  // giant glowing mushrooms on the ledge
  const caps = [];
  for (let i = 0; i < 4; i++) {
    const a = i * 1.7, cxm = Math.cos(a) * 9.5, czm = Math.sin(a) * 9.5, h = 3 + i;
    caps.push(new THREE.CylinderGeometry(0.35, 0.5, h, 8).translate(cxm, 25 + h / 2, czm));
    caps.push(new THREE.SphereGeometry(1.8 + i * 0.4, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2).translate(cxm, 25 + h, czm));
  }
  const C = new THREE.Mesh(merge(caps), glowBasic('#7fe9ff')); C.position.set(x, 0, z);
  group.add(R, T, cone, C);
  lamps.push([x, 50, z + 6]);
}

// --- the Mother Tree: 140 m, glowing magenta, on a rock island ------------------
function motherTree(group, side, preset, r, blossoms) {
  const L = BRIDGE_LINE.length, p = along(BRIDGE_LINE, L * 0.8), off = -115 * side;
  const x = p.x + Math.cos(p.h) * off, z = p.z - Math.sin(p.h) * off;
  const isle = new THREE.LatheGeometry([[0, -10], [40, -10], [36, 0], [30, 5], [26, 8], [0, 8]].map(([a, b]) => new THREE.Vector2(a, b)), 28);
  const I = new THREE.Mesh(isle, nightGrade(new THREE.MeshLambertMaterial({ color: '#4f8a52', map: leafTexture(), emissive: '#10283a', emissiveIntensity: 0.5 }), 'mother-isle'));
  I.position.set(x, 0, z);
  addPad({ x, z, hw: 22, hd: 22, a: 0, y: 8 });
  // trunk: a flared, twisting lathe with root buttresses
  const trunk = new THREE.LatheGeometry([[15, 0], [10, 6], [7.5, 25], [6.8, 55], [5.6, 80], [3.5, 100], [1.5, 112], [0, 116]].map(([a, b]) => new THREE.Vector2(a, b)), 20, 0, Math.PI * 2);
  const tp = trunk.attributes.position;
  for (let i = 0; i < tp.count; i++) {
    const y = tp.getY(i), a = Math.atan2(tp.getZ(i), tp.getX(i)) + y * 0.012, rad = Math.hypot(tp.getX(i), tp.getZ(i)) * (1 + 0.18 * Math.sin(a * 5) * Math.max(0, 1 - y / 30));
    tp.setX(i, Math.cos(a) * rad); tp.setZ(i, Math.sin(a) * rad);
  }
  trunk.computeVertexNormals();
  const branches = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4, len = 32 + r() * 12, y = 70 + r() * 22;
    const b = new THREE.CylinderGeometry(1.2, 2.6, len, 8); b.translate(0, len / 2, 0); b.rotateZ(-0.95); b.rotateY(a); b.translate(0, y, 0);
    branches.push(b);
  }
  const bark = toon('#6a4a7a', { emissive: '#2a1040', emissiveIntensity: 0.6 });
  const Tm = new THREE.Mesh(merge([trunk, ...branches]), bark); Tm.position.set(x, 8, z); Tm.castShadow = true;
  // crown of big magenta canopy blobs with leaf cards
  const n = 11;
  const core = new THREE.InstancedMesh(canopyGeometry(r, preset.grass < 4000 ? 0 : 1), canopyMaterial(true), n);
  const cards = new THREE.InstancedMesh(leafCardGeometry(r, (preset.leafCards ?? 60) + 30), canopyMaterial(false), n);
  const d = new THREE.Object3D(), col = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r(), rad = i === 0 ? 0 : 26 + r() * 14, y = 8 + (i === 0 ? 128 : 100 + r() * 22);
    d.position.set(x + Math.cos(a) * rad, y, z + Math.sin(a) * rad); d.rotation.set(0, r() * 6, 0); d.scale.setScalar(i === 0 ? 30 : 20 + r() * 8);
    d.updateMatrix(); core.setMatrixAt(i, d.matrix); cards.setMatrixAt(i, d.matrix);
    col.setHSL(0.89 + r() * 0.04, 0.7, 0.62); core.setColorAt(i, col); cards.setColorAt(i, col);
    for (let k = 0; k < 70; k++) {
      const u = r() * 6.28, v = Math.acos(2 * r() - 1), rr = d.scale.x * (0.7 + r() * 0.5);
      blossoms.push(d.position.x + Math.sin(v) * Math.cos(u) * rr, d.position.y + Math.cos(v) * rr * 0.7, d.position.z + Math.sin(v) * Math.sin(u) * rr);
    }
  }
  core.castShadow = true;
  group.add(I, Tm, core, cards);
  addCollider({ x, z, r: 11, y0: 0, y1: 130 });
  // glowing vines hanging from the branches
  const vines = [];
  for (let i = 0; i < 40; i++) {
    const a = r() * 6.28, rad = 12 + r() * 34, len = 15 + r() * 30, top = 95 + r() * 20;
    vines.push(new THREE.CylinderGeometry(0.15, 0.05, len, 3).translate(x + Math.cos(a) * rad, top - len / 2, z + Math.sin(a) * rad));
  }
  group.add(new THREE.Mesh(merge(vines), additive('#ff8fe0', { opacity: 0.7 })));
}

// --- Great Gate pylons at the foot of the crag ------------------------------------
function gatePylons(group, lamps) {
  const e = along(BRIDGE_LINE, BRIDGE_LINE.length - 4), parts = [], gold = [];
  for (const sd of [-1, 1]) {
    const x = e.x + Math.cos(e.h) * sd * 15, z = e.z - Math.sin(e.h) * sd * 15, y = (groundAt(x, z) ?? 1) - 1;
    const p = new THREE.CylinderGeometry(2.4, 4.6, 60, 4); p.rotateY(Math.PI / 4); p.translate(0, 30, 0); p.rotateZ(-sd * 0.07);
    p.rotateY(e.h); p.translate(x, y, z); parts.push(p);
    const cap = new THREE.ConeGeometry(2.8, 4.5, 4); cap.rotateY(Math.PI / 4); cap.translate(0, 62.2, 0); cap.rotateZ(-sd * 0.07); cap.rotateY(e.h); cap.translate(x, y, z); gold.push(cap);
    for (const hy of [12, 30, 48]) { const band = new THREE.CylinderGeometry(4.6 - hy * 0.036, 4.6 - hy * 0.036, 0.8, 4); band.rotateY(Math.PI / 4); band.translate(0, hy, 0); band.rotateZ(-sd * 0.07); band.rotateY(e.h); band.translate(x, y, z); gold.push(band); }
    addCollider({ x, z, r: 4.6 });
    lamps.push([x - sd * Math.cos(e.h) * 4.5, y + 66, z + sd * Math.sin(e.h) * 4.5]);
  }
  const rose = new THREE.MeshLambertMaterial({ color: '#f2c6d6', map: stoneTexture(), emissive: '#3e2250', emissiveIntensity: 0.45 });
  group.add(new THREE.Mesh(merge(parts), nightGrade(rose, 'pylon')), new THREE.Mesh(merge(gold), goldMat()));
}

// --- Lantern Cove: a round stone stage, lit huts and rising sky lanterns -------------
function cove(group, lamps) {
  const y = groundAt(COVE.x, COVE.z) ?? COVE.y;
  const stage = new THREE.CylinderGeometry(COVE.r, COVE.r + 0.6, 1.2, 48); stage.translate(COVE.x, y - 0.58, COVE.z);
  group.add(new THREE.Mesh(stage, marbleMat('cove', 3)));
  const inlay = new THREE.Mesh(new THREE.CircleGeometry(COVE.r - 2, 48), new THREE.MeshLambertMaterial({ map: rosetteTexture(), emissive: '#2a2050', emissiveIntensity: 0.35, polygonOffset: true, polygonOffsetFactor: -1 }));
  inlay.rotation.x = -Math.PI / 2; inlay.position.set(COVE.x, y + 0.03, COVE.z);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(COVE.r, 0.18, 6, 64), glowBasic('#ffd47a'));
  ring.rotation.x = Math.PI / 2; ring.position.set(COVE.x, y + 0.05, COVE.z);
  group.add(inlay, ring);
  // little lantern huts round the stage
  const huts = [], roofs = [], wins = [];
  for (let i = 0; i < 5; i++) {
    // in an arc behind the dais, leaving the view to the bridge open
    const a = Math.atan2(COVE.z - BRIDGE.pts[1][1], COVE.x - BRIDGE.pts[1][0]) + (i - 2) * 0.62, hx = COVE.x + Math.cos(a) * (COVE.r + 14), hz = COVE.z + Math.sin(a) * (COVE.r + 14), hy = groundAt(hx, hz) ?? y;
    huts.push(box(5, 4, 5, hx, hy + 2, hz));
    roofs.push(new THREE.ConeGeometry(4.6, 3.4, 4).rotateY(Math.PI / 4).translate(hx, hy + 5.7, hz));
    wins.push(box(5.1, 1.4, 1.2, hx, hy + 2.3, hz), box(1.2, 1.4, 5.1, hx, hy + 2.3, hz));
    addCollider({ x: hx, z: hz, r: 3.2 });
  }
  group.add(new THREE.Mesh(merge(huts), new THREE.MeshLambertMaterial({ color: '#e9d2c4', emissive: '#3e2250', emissiveIntensity: 0.35 })), new THREE.Mesh(merge(roofs), roseMat()), new THREE.Mesh(merge(wins), glowBasic('#ffc070')));
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; lamps.push([COVE.x + Math.cos(a) * (COVE.r - 0.8), y + 1.2, COVE.z + Math.sin(a) * (COVE.r - 0.8)]); }
  // sky lanterns drifting up over the cove and the lake
  const N = 160, pos = [], seed = [];
  for (let i = 0; i < N; i++) { pos.push(COVE.x + 60 + (Math.random() - 0.5) * 320, 0, COVE.z - 60 + (Math.random() - 0.5) * 260); seed.push(Math.random()); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('seed', new THREE.Float32BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uMap: { value: glowTexture() }, uNight: MOOD.night },
    vertexShader: `attribute float seed; uniform float uTime; varying float vA;
      void main(){ vec3 p = position; float t = fract(uTime * (0.006 + seed * 0.004) + seed);
        p.y = 4. + t * 260.; p.x += sin(uTime * .2 + seed * 30.) * 6.; vA = smoothstep(0., .08, t) * smoothstep(1., .7, t);
        vec4 mv = modelViewMatrix * vec4(p, 1.); gl_PointSize = 900. / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform sampler2D uMap; uniform float uNight; varying float vA;
      void main(){ float a = texture2D(uMap, gl_PointCoord).a; float core = smoothstep(.35, .0, length(gl_PointCoord - .5));
        gl_FragColor = vec4(vec3(1., .66, .32) * (a * .6 + core * 1.4) * vA * (.35 + .65 * uNight), 1.); }`,
  });
  group.add(new THREE.Points(g, mat));
  return mat;
}

// --- the Giant-Tree Way: paved road, curbs, 100 m trees and a closing canopy ---------
function treeWay(group, preset, r) {
  const S = WAY_LINE.samples, pos = [], uv = [], idx = [], curbs = [];
  for (let i = 0; i < S.length; i++) {
    const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)], h = Math.atan2(b.x - a.x, b.z - a.z), c = Math.cos(h), sn = Math.sin(h);
    for (const sd of [-1, 1]) { pos.push(S[i].x + c * sd * TREE_WAY.hw, S[i].y + 0.06, S[i].z - sn * sd * TREE_WAY.hw); uv.push(sd * TREE_WAY.hw / 4, S[i].s / 4); }
    if (i < S.length - 1) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    if (i % 3 === 0 && i < S.length - 3) {
      const e = S[i + 3], len = Math.hypot(e.x - S[i].x, e.z - S[i].z);
      for (const sd of [-1, 1]) {
        const g = new THREE.BoxGeometry(0.8, 0.7, len + 0.3);
        g.rotateX(-Math.atan2(e.y - S[i].y, len)); g.rotateY(h);
        g.translate((S[i].x + e.x) / 2 + c * sd * (TREE_WAY.hw + 0.4), (S[i].y + e.y) / 2 + 0.3, (S[i].z + e.z) / 2 - sn * sd * (TREE_WAY.hw + 0.4));
        curbs.push(g);
      }
    }
  }
  const road = new THREE.BufferGeometry();
  road.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  road.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  road.setIndex(idx); road.computeVertexNormals();
  const pave = flagstoneTexture().clone(); pave.needsUpdate = true;
  const R = new THREE.Mesh(road, new THREE.MeshLambertMaterial({ map: pave, color: '#f0e2ea', emissive: '#2a2050', emissiveIntensity: 0.35, polygonOffset: true, polygonOffsetFactor: -2 }));
  R.receiveShadow = true;
  group.add(R, new THREE.Mesh(merge(curbs), marbleMat('curb', 1)));
  // trees: ten 100 m giants, and big trees close to the road whose crowns meet overhead
  const spots = [];
  const L = WAY_LINE.length;
  let side = 1;
  for (let s = 20; s < L - 60; s += 9) {
    const p = along(WAY_LINE, s), giant = Math.round(s) % 72 < 9;
    side = -side;
    const off = giant ? TREE_WAY.hw + 16 + r() * 6 : TREE_WAY.hw + 5 + r() * 4;
    const x = p.x + Math.cos(p.h) * side * off, z = p.z - Math.sin(p.h) * side * off;
    if (!isClearOfBuildings(x, z, giant ? 8 : 2)) continue;
    const y = groundAt(x, z);
    if (y == null) continue;
    spots.push(giant ? { x, y, z, h: 66 + r() * 10, sc: 26 + r() * 6, w: 11 + r() * 3, pink: r() < 0.2 }
      : { x, y, z, h: 22 + r() * 10, sc: 11 + r() * 4, w: 3.4 + r() * 1.4, pink: r() < 0.15 });
  }
  giantTrees(group, spots, preset);
  return spots;
}

// --- Lagoon City: Atlantis white houses with roof gardens, partial canal rings ---------
function lagoonCity(group, r) {
  const houses = [], canals = [{ R: 40, a0: 0.3, a1: 4.4 }, { R: 72, a0: -1.2, a1: 2.6 }];
  for (let x = LAGOON.x - LAGOON.r; x <= LAGOON.x + LAGOON.r; x += 12) {
    for (let z = LAGOON.z - LAGOON.r; z <= LAGOON.z + LAGOON.r; z += 12) {
      const hx = x + (r() - 0.5) * 2, hz = z + (r() - 0.5) * 2, dr = Math.hypot(hx - LAGOON.x, hz - LAGOON.z);
      if (dr > LAGOON.r - 6 || dr < 16 || r() < 0.1) continue;
      let ang = Math.atan2(hz - LAGOON.z, hx - LAGOON.x);
      if (canals.some((c) => { let a = ang; while (a < c.a0) a += Math.PI * 2; return a <= c.a1 && Math.abs(dr - c.R) < 9; })) continue;
      if (Math.hypot(hx - WHEEL.x, hz - WHEEL.z) < 28 || lakeDistance(hx, hz) < 6) continue;
      const w = 7 + r() * 3, d = 7 + r() * 3, h = 6 + r() * 8 + (dr < 40 ? 6 : 0), y = (groundAt(hx, hz) ?? LAGOON.y) - 0.4;
      houses.push({ x: hx, z: hz, y, w, d, h, kind: r() });
    }
  }
  const bodies = [], roofs = [], domes = [], gardens = [];
  for (const H of houses) {
    bodies.push(box(H.w, H.h, H.d, H.x, H.y + H.h / 2, H.z));
    roofs.push(box(H.w + 0.5, 0.35, H.d + 0.5, H.x, H.y + H.h + 0.17, H.z));
    if (H.kind < 0.22) domes.push(new THREE.SphereGeometry(Math.min(H.w, H.d) * 0.36, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2).translate(H.x, H.y + H.h + 0.3, H.z));
    else if (H.kind < 0.65) gardens.push(box(H.w - 1.2, 0.6, H.d - 1.2, H.x, H.y + H.h + 0.6, H.z));
    addCollider({ minX: H.x - H.w / 2, maxX: H.x + H.w / 2, minZ: H.z - H.d / 2, maxZ: H.z + H.d / 2, y0: H.y, y1: H.y + H.h });
  }
  // windows from world position, warm after dark
  const wallMat = new THREE.MeshLambertMaterial({ color: '#f7ece8', emissive: '#3e2250', emissiveIntensity: 0.35 });
  wallMat.onBeforeCompile = (sh) => {
    sh.uniforms.uNight = MOOD.night;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN; uniform float uNight;')
      .replace('#include <opaque_fragment>', `
        float u = abs(vWN.x) > 0.5 ? vWP.z : vWP.x;
        vec2 cell = vec2(fract(u / 2.4), fract(vWP.y / 3.0));
        float win = step(0.3, cell.x) * step(cell.x, 0.7) * step(0.3, cell.y) * step(cell.y, 0.82) * (1.0 - step(0.9, abs(vWN.y)));
        float lit = step(0.35, fract(sin(dot(floor(vec3(u / 2.4, vWP.y / 3.0, vWN.x + vWN.z * 3.0)), vec3(12.9, 78.2, 37.7))) * 43758.5));
        outgoingLight = mix(outgoingLight, mix(vec3(0.45, 0.42, 0.62), mix(vec3(0.15, 0.12, 0.3), vec3(1.0, 0.72, 0.42) * 1.6, lit), uNight), win);
        #include <opaque_fragment>`);
  };
  wallMat.customProgramCacheKey = () => 'town-walls';
  const Bm = new THREE.Mesh(merge(bodies), wallMat); Bm.castShadow = Bm.receiveShadow = true;
  group.add(Bm, new THREE.Mesh(merge(roofs), new THREE.MeshLambertMaterial({ color: '#eadbe4', emissive: '#3e2250', emissiveIntensity: 0.35 })));
  if (domes.length) group.add(new THREE.Mesh(merge(domes), new THREE.MeshLambertMaterial({ color: '#b8508c', emissive: '#3a1030', emissiveIntensity: 0.6 })));
  if (gardens.length) group.add(new THREE.Mesh(merge(gardens), nightGrade(new THREE.MeshLambertMaterial({ color: '#4f9a4a', map: leafTexture(), emissive: '#10283a', emissiveIntensity: 0.5 }), 'roofgarden')));
  // canal arcs of glowing water with marble edges
  const water = [], edges = [];
  for (const c of canals) {
    const g = new THREE.RingGeometry(c.R - 4, c.R + 4, 64, 1, c.a0, c.a1 - c.a0); g.rotateX(-Math.PI / 2);
    water.push(g.translate(LAGOON.x, LAGOON.y + 0.15, LAGOON.z));
    for (const rr of [c.R - 4.4, c.R + 4.4]) {
      const e = new THREE.RingGeometry(rr - 0.5, rr + 0.5, 64, 1, c.a0, c.a1 - c.a0); e.rotateX(-Math.PI / 2);
      edges.push(e.translate(LAGOON.x, LAGOON.y + 0.3, LAGOON.z));
    }
  }
  // the ring geometry winds the other way once laid flat, so flip angles to match
  const W = new THREE.Mesh(merge(water), new THREE.MeshBasicMaterial({ color: '#3a6fb0', side: THREE.DoubleSide, transparent: true, opacity: 0.85 }));
  W.scale.z = 1;
  group.add(W, new THREE.Mesh(merge(edges), new THREE.MeshLambertMaterial({ color: MARBLE, side: THREE.DoubleSide, emissive: '#3e2250', emissiveIntensity: 0.4 })));
}

export function createAcropolis(scene, preset) {
  const group = new THREE.Group();
  const r = rng(2026);
  const lamps = [], blossoms = [];
  terraces(group);
  const lakeMat = lake(group);
  bridge(group, lamps);
  const side = moonPalace(group, lamps);
  isletTower(group, side, lamps);
  motherTree(group, side, preset, r, blossoms);
  gatePylons(group, lamps);
  const coveMat = cove(group, lamps);
  treeWay(group, preset, r);
  lagoonCity(group, r);
  for (const T of TERRACES) for (const s of [-1, 1]) lamps.push([s * (STAIR.hw + 0.9), T.y + 2.8, T.front - 0.3]);

  // every lamp is a small glowing globe with a soft halo point
  const lampMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.34, 7, 5), glowBasic('#ffc65c'), lamps.length);
  const d = new THREE.Object3D();
  lamps.forEach(([x, y, z], i) => { d.position.set(x, y, z); d.updateMatrix(); lampMesh.setMatrixAt(i, d.matrix); });
  group.add(lampMesh);
  const halo = (pts, color, size) => {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const m = new THREE.PointsMaterial({ color, map: glowTexture(), size, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
    group.add(new THREE.Points(g, m));
    return m;
  };
  const lampHalo = halo(lamps.flat(), '#ffb347', 3.2);
  const blossomHalo = halo(blossoms, '#ff7fd8', 3.5);

  scene.add(group);
  return {
    update(t) {
      lakeMat.uniforms.uTime.value = t;
      coveMat.uniforms.uTime.value = t;
      lampHalo.opacity = 0.35 + 0.5 * MOOD.night.value;
      blossomHalo.opacity = 0.25 + 0.6 * MOOD.night.value;
    },
  };
}
