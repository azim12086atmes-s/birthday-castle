import { ATMOS_GLSL, atmosUniforms } from './look.js';
// The Starlight Coast itself (sheets 04, 10, 12): the land, the open sea with its
// uneven wave field, reefs and surf, calm Lantern Lake, and the forests inland.
//
// Laptop plan (spec section 8): the land is one coarse mesh for the whole coast
// plus fine 384 m tiles built only round the player; the sea is a single quad
// shaded from a baked depth map; trees are instanced per 768 m tile and drawn
// only within a quality-dependent range.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { nightGrade } from './materials.js';
import { groundGrade } from './ground.js';
import { createTreeKit, SPECIES, SHRUB, woodAt, pickInWood, accentTree } from './trees.js';
import { grassTexture, rng } from './textures.js';
import { S, MAIN, TERRAIN_GRID, terrainHeight, groundHSL, forestAt, lakeDistance } from './layout.js';
import { MOOD, FOG_COLOR, SUN_DIR, MOON_DIR } from './sky.js';
import { OUTER_FRAME, outerH } from './crescent.js';
import { onPath, whenPaths } from './paths.js';

const G = TERRAIN_GRID;
const CHUNK = 384, CN = 32;                // fine tiles: 32 cells of 12 m
const CN_NEAR = 128, FINE_R = 560;        // and round the player 3 m cells, so the walking-scale relief is real geometry
const NEAR_R = 900, DIP_R = 600;

function landMaterial(far) {
  // world pass 2: no tiled grass map and no constant glow; ground.js paints the land in world space
  const m = new THREE.MeshLambertMaterial({ vertexColors: true });
  if (far) {
    // the coarse land sinks out of sight wherever the fine tiles cover it
    m.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        { float dc = length(position.xz - cameraPosition.xz);
          transformed.y -= mix(40.0, 0.0, smoothstep(${DIP_R - 40}.0, ${DIP_R}.0, dc)) + 0.6 + dc * 0.0015; }`);
    };
    m.customProgramCacheKey = () => 'land-far';
  }
  return groundGrade(nightGrade(m, far ? 'land-far' : 'land'), far ? 'far' : 'near');
}

function landGeometry(x0, z0, n, step, skipDeep, skirt = 0) {
  const pos = new Float32Array((n + 1) * (n + 1) * 3), col = new Float32Array(pos.length), uv = new Float32Array((n + 1) * (n + 1) * 2);
  const nrm = skirt ? new Float32Array(pos.length) : null;
  const c = new THREE.Color(), hs = new Float32Array((n + 1) * (n + 1));
  for (let j = 0, k = 0; j <= n; j++) for (let i = 0; i <= n; i++, k++) {
    const x = x0 + i * step, z = z0 + j * step, h = terrainHeight(MAIN, x, z);
    hs[k] = h;
    pos[k * 3] = x; pos[k * 3 + 1] = h; pos[k * 3 + 2] = z;
    uv[k * 2] = x / 5; uv[k * 2 + 1] = z / 5;
    c.setHSL(...groundHSL(MAIN, x, z, h));
    col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
    if (nrm) {
      // normals from the height function itself, so neighbouring tiles of any density shade seamlessly
      const e = step * 0.5, dx = terrainHeight(MAIN, x + e, z) - terrainHeight(MAIN, x - e, z), dz = terrainHeight(MAIN, x, z + e) - terrainHeight(MAIN, x, z - e);
      const l = Math.hypot(dx, 2 * e, dz);
      nrm[k * 3] = -dx / l; nrm[k * 3 + 1] = 2 * e / l; nrm[k * 3 + 2] = -dz / l;
    }
  }
  const idx = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const a = j * (n + 1) + i, b = a + 1, d = a + n + 1, e = d + 1;
    if (skipDeep && Math.max(hs[a], hs[b], hs[d], hs[e]) < skipDeep) continue;
    idx.push(a, d, b, b, d, e);
  }
  if (!idx.length) return null;
  const g = new THREE.BufferGeometry();
  if (skirt) {
    // a skirt hangs from the tile's rim, so a fine tile beside a coarser one never shows a crack
    const P = Array.from(pos), C = Array.from(col), U = Array.from(uv), N = Array.from(nrm), base = (n + 1) * (n + 1);
    const rim = [];
    for (let i = 0; i < n; i++) rim.push(i);
    for (let j = 0; j < n; j++) rim.push(j * (n + 1) + n);
    for (let i = n; i > 0; i--) rim.push(n * (n + 1) + i);
    for (let j = n; j > 0; j--) rim.push(j * (n + 1));
    rim.forEach((v, r) => {
      P.push(pos[v * 3], pos[v * 3 + 1] - skirt, pos[v * 3 + 2]); C.push(col[v * 3], col[v * 3 + 1], col[v * 3 + 2]);
      U.push(uv[v * 2], uv[v * 2 + 1]); N.push(nrm[v * 3], nrm[v * 3 + 1], nrm[v * 3 + 2]);
      const a = v, b = rim[(r + 1) % rim.length], a2 = base + r, b2 = base + (r + 1) % rim.length;
      idx.push(a, b, a2, b, b2, a2, a, a2, b, b, a2, b2);   // both windings: the skirt shows from either side
    });
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    g.setIndex(idx);
    return g;
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// the great crescent ridge round the map (outer world, 41 km): a coarse ring, sunk out of
// sight under the coast's own land so the two meet without a seam
function ridgeGeometry(n) {
  const O = OUTER_FRAME, step = O.span / n, inset = 400;
  const inBox = (x, z, d) => x > G.x0 + d && x < G.x0 + G.span - d && z > G.z0 + d && z < G.z0 + G.span - d;
  const pos = new Float32Array((n + 1) * (n + 1) * 3), col = new Float32Array(pos.length), uv = new Float32Array((n + 1) * (n + 1) * 2);
  const c = new THREE.Color(), hs = new Float32Array((n + 1) * (n + 1)), inner = new Uint8Array((n + 1) * (n + 1));
  for (let j = 0, k = 0; j <= n; j++) for (let i = 0; i <= n; i++, k++) {
    const x = O.x0 + i * step, z = O.z0 + j * step, h = outerH(x, z);
    hs[k] = h; inner[k] = inBox(x, z, inset) ? 1 : 0;
    pos[k * 3] = x; pos[k * 3 + 1] = h - (inBox(x, z, 0) ? 80 : 0); pos[k * 3 + 2] = z;
    uv[k * 2] = x / 5; uv[k * 2 + 1] = z / 5;
    c.setHSL(...groundHSL(MAIN, x, z, h));
    col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
  }
  const idx = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const a = j * (n + 1) + i, b = a + 1, d = a + n + 1, e = d + 1;
    if (inner[a] && inner[b] && inner[d] && inner[e]) continue;
    if (Math.max(hs[a], hs[b], hs[d], hs[e]) < -5) continue;
    idx.push(a, d, b, b, d, e);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// --- the sea and the lake --------------------------------------------------------------------
function depthTexture() {
  const n = 401, step = G.span / (n - 1), data = new Uint8Array(n * n * 4);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = G.x0 + i * step, z = G.z0 + j * step, h = terrainHeight(MAIN, x, z), k = (j * n + i) * 4;
    data[k] = Math.round(Math.min(1, Math.max(0, (h / S + 40) / 60)) * 255);   // depth in drawn metres, so the shading keeps its proportions
    data[k + 1] = lakeDistance(x, z) < 40 * S ? 0 : 255;                // calm water in the lake
    data[k + 2] = 0; data[k + 3] = 255;
  }
  const t = new THREE.DataTexture(data, n, n, THREE.RGBAFormat);
  t.magFilter = t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

function waterMesh() {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uH: { value: depthTexture() }, uGrid: { value: new THREE.Vector3(G.x0, G.z0, G.span) },
      uTime: { value: 0 }, uNight: MOOD.night, uSun: { value: SUN_DIR }, uMoon: { value: MOON_DIR },
      uFog: { value: FOG_COLOR }, uFogNear: { value: 900 }, uFogFar: { value: 16000 }, ...atmosUniforms(FOG_COLOR),
    },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: /* glsl */`
      uniform sampler2D uH; uniform vec3 uGrid; uniform float uTime; uniform float uNight; uniform vec3 uSun; uniform vec3 uMoon;
      uniform vec3 uFog; uniform float uFogNear; uniform float uFogFar; varying vec3 vW;
      ${ATMOS_GLSL}
      float hsh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(hsh(i), hsh(i + vec2(1, 0)), f.x), mix(hsh(i + vec2(0, 1)), hsh(i + vec2(1, 1)), f.x), f.y); }
      void main(){
        vec2 uv = (vW.xz - uGrid.xy) / uGrid.z;
        vec4 tx = texture2D(uH, uv);
        float inside = step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
        float depth = mix(60., 40. - tx.r * 60., inside), open = mix(1., tx.g, inside);
        vec2 p = vW.xz;
        // an uneven wave field: long swells from the south-west, cross chop, and slow patches of calm
        float patchy = .55 + .45 * vn(p * .004 + uTime * .01);
        vec2 g = vec2(0.);
        vec2 d1 = normalize(vec2(.35, -1.)), d2 = normalize(vec2(-.8, -.45)), d3 = normalize(vec2(.9, .3));
        g += d1 * cos(dot(d1, p) * .045 - uTime * 1.1) * .045 * 1.2;
        g += d2 * cos(dot(d2, p) * .11 - uTime * 1.7) * .11 * .45;
        g += d3 * cos(dot(d3, p) * .27 - uTime * 2.6) * .27 * .16;
        g += (vec2(vn(p * .35 + uTime * .3), vn(p * .35 - uTime * .25 + 9.)) - .5) * .5;
        g *= mix(.12, 1., open) * patchy * (1. - smoothstep(1.5, .2, depth) * .6);
        // ripples ring out round the player wading or swimming, and trail behind as a wake
        vec2 rp = p - cameraPosition.xz; float rd = length(rp);
        float nearW = 1. - smoothstep(2.5, 6., cameraPosition.y);
        if (nearW > 0. && rd < 30.) g += rp / max(rd, .01) * sin(rd * 3.2 - uTime * 6.) * exp(-rd * .16) * .35 * nearW;
        // fine glitter: the surface catches the light in tiny facets
        g += (vec2(vn(p * 2.3 + uTime * .9), vn(p * 2.1 - uTime * .8 + 5.)) - .5) * .18 * (1. - smoothstep(30., 200., length(vW - cameraPosition)));
        vec3 n = normalize(vec3(-g.x, 1., -g.y));
        vec3 V = normalize(cameraPosition - vW);
        float dist = length(vW - cameraPosition);
        n = normalize(mix(n, vec3(0., 1., 0.), smoothstep(400., 3000., dist) * .7));
        float fres = pow(1. - max(dot(n, V), 0.), 3.);
        // clear water: the sandy bed shows through the shallows, then turquoise, then deep blue
        vec3 bed = vec3(.78, .72, .55) * (.85 + .3 * vn(p * .3));
        vec3 shallow = vec3(.2, .72, .68), mid = vec3(.06, .4, .55), deep = vec3(.03, .14, .32);
        vec3 c = mix(bed, shallow, smoothstep(.0, 1.6, depth));
        c = mix(c, mid, smoothstep(1.2, 7., depth));
        c = mix(c, deep, smoothstep(6., 30., depth));
        // light dancing on the bed of the shallows
        float caus = pow(1. - abs(vn(p * .9 + uTime * .35) - vn(p * .9 - uTime * .3 + 3.)), 8.);
        c += vec3(.5, .55, .4) * caus * (1. - smoothstep(.5, 4., depth)) * (1. - uNight) * .5;
        // coral gardens on the reef shallows
        float coral = smoothstep(.62, .8, vn(p * .05)) * smoothstep(.6, 1.5, depth) * (1. - smoothstep(3., 6., depth)) * open;
        c = mix(c, vec3(1., .55, .7), coral * .45);
        // the sky in the water: zenith blue overhead, the hazy horizon at grazing angles
        vec3 R = reflect(-V, n);
        vec3 skyD = mix(pow(uFog, vec3(.4545)) * 1.05, vec3(.36, .55, .9), smoothstep(.0, .5, R.y)), skyN = vec3(.12, .14, .38);
        c = mix(c, mix(skyD, skyN, uNight), clamp(.04 + fres * .9, 0., .9));
        vec3 L = normalize(mix(uSun, uMoon, uNight));
        float sd = max(dot(R, L), 0.);
        float spec = pow(sd, 420.) * 3.5 + pow(sd, 48.) * .35;
        c += mix(vec3(1., .85, .62), vec3(.75, .8, 1.), uNight) * spec;
        // surf: the waterline, and breakers rolling in towards the shore
        float wob = vn(p * .08 + uTime * .2) * 1.4;
        float foam = 1. - smoothstep(.0, .7, depth);
        foam += smoothstep(.82, .97, sin(depth * 2.1 - uTime * 1.5 + wob)) * (1. - smoothstep(.6, 3.4, depth)) * open;
        foam += smoothstep(.86, .98, vn(p * .045 + vec2(uTime * .05, 0.)) * patchy) * smoothstep(12., 30., depth) * .6;
        c = mix(c, vec3(1.), clamp(foam, 0., 1.) * .85);
        // night: dark blue water with glowing plankton in the surf
        c *= mix(1., .42, uNight);
        float bio = clamp(foam, 0., 1.) * (.5 + .5 * sin(uTime * 2. + vn(p * .2) * 6.));
        c += vec3(.2, .9, 1.) * bio * uNight * .5;
        c = pow(c, vec3(2.2));
        c = atmosApply(c, vW, uFog);
        gl_FragColor = vec4(c, 1.);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100000, 100000).rotateX(-Math.PI / 2), mat);
  mesh.frustumCulled = false;
  mesh.name = 'sea';
  return mesh;
}

// --- forests ------------------------------------------------------------------------------
// groves with clearings between them, rather than an even sprinkle
function grove(x, z) {
  const n = (a, b) => { const i = Math.floor(a), j = Math.floor(b), f = a - i, g = b - j, h = (u, v) => { const s = Math.sin(u * 127.1 + v * 311.7) * 43758.5453; return s - Math.floor(s); };
    const fx = f * f * (3 - 2 * f), fz = g * g * (3 - 2 * g);
    return (h(i, j) * (1 - fx) + h(i + 1, j) * fx) * (1 - fz) + (h(i, j + 1) * (1 - fx) + h(i + 1, j + 1) * fx) * fz; };
  const v = n(x / 140, z / 140) * 0.65 + n(x / 45 + 7, z / 45 - 3) * 0.35;
  return Math.min(1, Math.max(0, (v - 0.3) / 0.22));
}

// height of the coarse land mesh (132 m cells, split a-d-b / b-d-e like landGeometry)
const FAR_STEP = 132;
function farLandH(x, z) {
  const fx = (x - G.x0) / FAR_STEP, fz = (z - G.z0) / FAR_STEP, i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
  const h = (a, b) => terrainHeight(MAIN, G.x0 + a * FAR_STEP, G.z0 + b * FAR_STEP);
  const b = h(i + 1, j), d = h(i, j + 1);
  return u + v <= 1 ? h(i, j) + (b - h(i, j)) * u + (d - h(i, j)) * v : h(i + 1, j + 1) + (d - h(i + 1, j + 1)) * (1 - u) + (b - h(i + 1, j + 1)) * (1 - v);
}

function forests(scene, preset) {
  const spacing = preset.trees >= 200 ? 30 : preset.trees >= 120 ? 40 : 54;
  const range = preset.trees >= 200 ? 3000 : preset.trees >= 120 ? 2000 : 1300;
  const T = 768;
  // beyond the fine tiles the land is the coarse mesh, sunk like landMaterial(true): trees follow it there
  // instead of floating over valleys and ridges
  const dip = `{ float dc = length(base.xz - cameraPosition.xz);
      vec2 c0 = vec2(${G.x0.toFixed(1)}, ${G.z0.toFixed(1)}), cc = c0 + (floor((base.xz - c0) / ${CHUNK}.0) + 0.5) * ${CHUNK}.0;
      float k = step(${NEAR_R}.0, length(cc - cameraPosition.xz));     // same test that picks the fine tiles
      base.y += k * (aDy - mix(40.0, 0.0, smoothstep(${DIP_R - 40}.0, ${DIP_R}.0, dc)) - 0.6 - dc * 0.0015); }`;
  const quality = { key: preset.trees >= 200 ? 'high' : preset.trees >= 120 ? 'medium' : 'low' };
  const kit = createTreeKit(scene, quality, dip);
  const tiles = new Map();
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color(), up = new THREE.Vector3(0, 1, 0);
  function build(ti, tj) {
    const r = rng(ti * 7919 + tj * 104729 + 13), pts = [];
    const x0 = ti * T, z0 = tj * T;
    const step = spacing * 0.46;
    const add = (px, pz, sp, f, big = 1) => {
      const h = terrainHeight(MAIN, px, pz), S0 = SPECIES[sp], [lo, hi] = S0.h;
      // big old trees in the hearts of the woods, young ones at their edges
      const ht = (lo + (hi - lo) * r() * r()) * (0.62 + 0.42 * f) * big;
      pts.push([px, h - (S0.sink || 0) * ht, pz, r() * 6.283, ht, sp, farLandH(px, pz) - h, r()]);
    };
    for (let z = z0; z < z0 + T; z += step) for (let x = x0; x < x0 + T; x += step) {
      const px = x + r() * step, pz = z + r() * step;
      const h = terrainHeight(MAIN, px, pz), fa = forestAt(px, pz, h), f = fa * grove(px, pz);
      if (onPath(px, pz)) continue;
      // a wood: dense in its heart (the crowns close over), thinning to a ragged edge
      const dense = THREE.MathUtils.smoothstep(f, 0.12, 0.62);
      if (r() < dense * 0.95) {
        const edge = 1 - THREE.MathUtils.smoothstep(f, 0.2, 0.7);
        add(px, pz, pickInWood(r, woodAt(px, pz, h), edge, h), f);
        // understory: shrubs gather at the wood's edge and in its gaps
        if (r() < 0.22 + edge * 0.5) { const a = r() * 6.283, d = 3 + r() * 4, sx = px + Math.cos(a) * d, sz = pz + Math.sin(a) * d; if (!onPath(sx, sz)) add(sx, sz, SHRUB, 1); }
      } else if (fa > 0.05 && f < 0.1 && r() < 0.012) {
        // out in the open meadow, now and then a lone specimen tree in full bloom
        add(px, pz, accentTree(r), 0.9, 1.15);
      } else if (fa > 0.05 && f < 0.12 && r() < 0.02) add(px, pz, SHRUB, 0.6);
    }
    if (!pts.length) return null;
    const group = new THREE.Group();
    group.userData = { trees: pts, cx: x0 + T / 2, cz: z0 + T / 2 };
    // every far tree of the tile in one draw: the species' views share one atlas
    const g = kit.cardGeo.clone(), card = new Float32Array(pts.length * 4);
    g.setAttribute('aDy', new THREE.InstancedBufferAttribute(Float32Array.from(pts, (pt) => pt[6]), 1));
    const mesh = new THREE.InstancedMesh(g, kit.farMat, pts.length);
    pts.forEach(([x, y, z, rot, ht, , , k], j) => {
      const C = kit.cards[kit.slot(pts[j])], sc = ht / C.height;
      card.set([C.col, C.row, C.frame * sc, C.lift * sc], j * 4);
      q.setFromAxisAngle(up, rot); s.setScalar(1); p.set(x, y - 0.3, z);
      mesh.setMatrixAt(j, m4.compose(p, q, s));
      // a touch of colour variety from tree to tree
      c.setRGB(1, 1, 1).offsetHSL((k - 0.5) * 0.03, 0, (k - 0.5) * 0.12);
      mesh.setColorAt(j, c);
    });
    g.setAttribute('aCard', new THREE.InstancedBufferAttribute(card, 4));
    mesh.frustumCulled = false;
    group.add(mesh);
    scene.add(group);
    return group;
  }
  // once the roads are known, regrow the tiles already built so no tree stands on a road
  whenPaths(() => { for (const t of tiles.values()) if (t) { scene.remove(t); t.traverse((o) => o.geometry && o.geometry !== kit.cardGeo && o.geometry.dispose()); } tiles.clear(); });
  let nx = 1e9, nz = 1e9, built = false;
  return {
    // true while the trees wait for their cards to load
    get waiting() { return !built; },
    update(cam) {
      if (!kit.ready) { kit.grow(); return; }
      built = true;
      const ci = Math.floor(cam.x / T), cj = Math.floor(cam.z / T), n = Math.ceil(range / T) + 1;
      for (const [k, t] of tiles) if (t) t.visible = false;
      for (let j = cj - n; j <= cj + n; j++) for (let i = ci - n; i <= ci + n; i++) {
        if (Math.hypot((i + 0.5) * T - cam.x, (j + 0.5) * T - cam.z) > range + T * 0.5) continue;
        if (i * T < G.x0 || j * T < G.z0 || i * T > G.x0 + G.span || j * T > G.z0 + G.span) continue;
        const k = i + ',' + j;
        if (!tiles.has(k)) tiles.set(k, build(i, j));
        const t = tiles.get(k);
        if (t) t.visible = true;
      }
      nx = 1e9;
    },
    // the 3D trees round the player, refreshed every few metres
    tick(t) { kit.tick(t); },
    near(cam) {
      if (!kit.ready || Math.hypot(cam.x - nx, cam.z - nz) < 5) return;
      nx = cam.x; nz = cam.z;
      kit.updateNear(cam, tiles.values());
    },
  };
}

export function createCoast(scene, preset) {
  const group = new THREE.Group();
  group.name = 'coast';
  const farStep = 132, farN = Math.round(G.span / farStep);
  const far = new THREE.Mesh(landGeometry(G.x0, G.z0, farN, farStep, -24 * S), landMaterial(true));
  far.frustumCulled = false; far.receiveShadow = true;
  group.add(far);
  const ridge = new THREE.Mesh(ridgeGeometry(preset.trees < 120 ? 192 : 256), far.material);
  ridge.frustumCulled = false; ridge.name = 'great-ridge';
  group.add(ridge);
  const nearMat = landMaterial(false);
  const chunks = new Map();
  const sea = waterMesh();
  group.add(sea);
  scene.add(group);
  const woods = forests(scene, preset);
  let lastKey = '';
  whenPaths(() => { lastKey = ''; });
  return {
    sea,
    update(t, camera) {
      sea.material.uniforms.uTime.value = t;
      woods.tick(t);
      sea.position.set(Math.round(camera.position.x / 100) * 100, 0, Math.round(camera.position.z / 100) * 100);
      const cx = camera.position.x, cz = camera.position.z;
      woods.near(camera.position);
      if (woods.waiting) woods.update(camera.position);
      const key = Math.round(cx / 48) + ',' + Math.round(cz / 48);
      if (key === lastKey) return;
      lastKey = key;
      const ci = Math.floor((cx - G.x0) / CHUNK), cj = Math.floor((cz - G.z0) / CHUNK), n = Math.ceil(NEAR_R / CHUNK) + 1;
      for (const m of chunks.values()) if (m) m.visible = false;
      for (let j = cj - n; j <= cj + n; j++) for (let i = ci - n; i <= ci + n; i++) {
        const x0 = G.x0 + i * CHUNK, z0 = G.z0 + j * CHUNK;
        if (i < 0 || j < 0 || x0 + CHUNK > G.x0 + G.span || z0 + CHUNK > G.z0 + G.span) continue;
        if (Math.hypot(x0 + CHUNK / 2 - cx, z0 + CHUNK / 2 - cz) > NEAR_R) continue;
        const fineT = Math.hypot(x0 + CHUNK / 2 - cx, z0 + CHUNK / 2 - cz) < FINE_R;
        const k = i + ',' + j + (fineT ? 'f' : '');
        if (!chunks.has(k)) {
          const g = fineT ? landGeometry(x0, z0, CN_NEAR, CHUNK / CN_NEAR, -6, 4) : landGeometry(x0, z0, CN, CHUNK / CN, -6, 4);
          let m = null;
          if (g) { m = new THREE.Mesh(g, nearMat); m.receiveShadow = true; group.add(m); }
          chunks.set(k, m);
        }
        const m = chunks.get(k);
        if (m) m.visible = true;
      }
      // let go of tiles left far behind
      if (chunks.size > 90) for (const [k, m] of chunks) if (!m || !m.visible) { if (m) { group.remove(m); m.geometry.dispose(); } chunks.delete(k); }
      woods.update(camera.position);
    },
  };
}
