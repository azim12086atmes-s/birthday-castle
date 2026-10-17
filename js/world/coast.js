// The Starlight Coast itself (sheets 04, 10, 12): the land, the open sea with its
// uneven wave field, reefs and surf, calm Lantern Lake, and the forests inland.
//
// Laptop plan (spec section 8): the land is one coarse mesh for the whole coast
// plus fine 384 m tiles built only round the player; the sea is a single quad
// shaded from a baked depth map; trees are instanced per 768 m tile and drawn
// only within a quality-dependent range.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { nightGrade, meadowGrade } from './materials.js';
import { grassTexture, rng } from './textures.js';
import { S, MAIN, TERRAIN_GRID, terrainHeight, groundHSL, forestAt, lakeDistance } from './layout.js';
import { MOOD, FOG_COLOR, SUN_DIR, MOON_DIR } from './sky.js';
import { onPath, whenPaths } from './paths.js';

const G = TERRAIN_GRID;
const CHUNK = 384, CN = 32;                // fine tiles: 32 cells of 12 m
const NEAR_R = 900, DIP_R = 600;

function landMaterial(far) {
  const grass = grassTexture().clone(); grass.needsUpdate = true;
  const m = new THREE.MeshLambertMaterial({ map: grass, vertexColors: true, emissive: '#10283a', emissiveIntensity: 0.5 });
  if (far) {
    // the coarse land sinks out of sight wherever the fine tiles cover it
    m.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        { float dc = length(position.xz - cameraPosition.xz);
          transformed.y -= mix(40.0, 0.0, smoothstep(${DIP_R - 40}.0, ${DIP_R}.0, dc)) + 0.6 + dc * 0.0015; }`);
    };
    m.customProgramCacheKey = () => 'land-far';
  }
  return rockGrade(meadowGrade(nightGrade(m, far ? 'land-far' : 'land')));
}

// bare rock on the steep slopes and snow on the high crests, at full resolution
// (the painted colour map holds them only at 20 m a pixel)
function rockGrade(m) {
  const prev = m.onBeforeCompile, key = m.customProgramCacheKey;
  m.onBeforeCompile = (sh, r) => {
    prev(sh, r);
    sh.fragmentShader = sh.fragmentShader.replace('#include <alphamap_fragment>', `#include <alphamap_fragment>
      {
        vec2 rp = vMWorld.xz;
        float rn = mNoise(rp * 0.02) * 0.6 + mNoise(rp * 0.11 + 3.) * 0.4;
        float steep = smoothstep(0.86, 0.62, vMUp + (rn - 0.5) * 0.12);
        // faint, broken strata: warped by noise so they never read as contour lines
        float strata = 0.95 + 0.05 * sin(vMWorld.y * 0.13 + rn * 9.0 + mNoise(rp * 0.004) * 12.0);
        vec3 rock = mix(vec3(0.56, 0.52, 0.6), vec3(0.74, 0.68, 0.7), rn) * strata;
        float hi = smoothstep(500.0, 1100.0, vMWorld.y);
        diffuseColor.rgb = mix(diffuseColor.rgb, rock, steep * (0.55 + 0.4 * hi) * smoothstep(8.0, 40.0, vMWorld.y));
        float snow = smoothstep(980.0, 1250.0, vMWorld.y + (rn - 0.5) * 160.0) * smoothstep(0.45, 0.7, vMUp);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.97, 0.97, 1.02), snow);
      }`);
  };
  m.customProgramCacheKey = () => (key ? key.call(m) : 'land') + '-rock';
  return m;
}

function landGeometry(x0, z0, n, step, skipDeep) {
  const pos = new Float32Array((n + 1) * (n + 1) * 3), col = new Float32Array(pos.length), uv = new Float32Array((n + 1) * (n + 1) * 2);
  const c = new THREE.Color(), hs = new Float32Array((n + 1) * (n + 1));
  for (let j = 0, k = 0; j <= n; j++) for (let i = 0; i <= n; i++, k++) {
    const x = x0 + i * step, z = z0 + j * step, h = terrainHeight(MAIN, x, z);
    hs[k] = h;
    pos[k * 3] = x; pos[k * 3 + 1] = h; pos[k * 3 + 2] = z;
    uv[k * 2] = x / 5; uv[k * 2 + 1] = z / 5;
    c.setHSL(...groundHSL(MAIN, x, z, h));
    col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
  }
  const idx = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const a = j * (n + 1) + i, b = a + 1, d = a + n + 1, e = d + 1;
    if (skipDeep && Math.max(hs[a], hs[b], hs[d], hs[e]) < skipDeep) continue;
    idx.push(a, d, b, b, d, e);
  }
  if (!idx.length) return null;
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
      uFog: { value: FOG_COLOR }, uFogNear: { value: 900 }, uFogFar: { value: 16000 },
    },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: /* glsl */`
      uniform sampler2D uH; uniform vec3 uGrid; uniform float uTime; uniform float uNight; uniform vec3 uSun; uniform vec3 uMoon;
      uniform vec3 uFog; uniform float uFogNear; uniform float uFogFar; varying vec3 vW;
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
        vec3 n = normalize(vec3(-g.x, 1., -g.y));
        vec3 V = normalize(cameraPosition - vW);
        float dist = length(vW - cameraPosition);
        n = normalize(mix(n, vec3(0., 1., 0.), smoothstep(400., 3000., dist) * .7));
        float fres = pow(1. - max(dot(n, V), 0.), 3.);
        vec3 shallow = vec3(.32, .9, .84), mid = vec3(.1, .56, .78), deep = vec3(.05, .2, .5);
        vec3 c = mix(shallow, mid, smoothstep(.4, 5., depth));
        c = mix(c, deep, smoothstep(5., 28., depth));
        // coral gardens on the reef shallows
        float coral = smoothstep(.62, .8, vn(p * .05)) * smoothstep(.6, 1.5, depth) * (1. - smoothstep(3., 6., depth)) * open;
        c = mix(c, vec3(1., .55, .7), coral * .45);
        vec3 skyD = vec3(1., .82, .86), skyN = vec3(.22, .24, .55);
        c = mix(c, mix(skyD, skyN, uNight), clamp(fres * .75, 0., .85));
        vec3 L = normalize(mix(uSun, uMoon, uNight));
        float spec = pow(max(dot(reflect(-V, n), L), 0.), 160.);
        c += mix(vec3(1., .8, .55), vec3(.75, .8, 1.), uNight) * spec * 1.4;
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
        c = mix(c, uFog, smoothstep(uFogNear, uFogFar, dist));
        gl_FragColor = vec4(c, 1.);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(64000, 64000).rotateX(-Math.PI / 2), mat);
  mesh.frustumCulled = false;
  mesh.name = 'sea';
  return mesh;
}

// --- forests ------------------------------------------------------------------------------
function treeGeometry() {
  const parts = [];
  const paint = (g, hex) => {
    g = g.toNonIndexed(); const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const k = 0.85 + 0.15 * Math.max(0, g.attributes.position.getY(i) % 7) / 7; a[i * 3] = c.r * k; a[i * 3 + 1] = c.g * k; a[i * 3 + 2] = c.b * k; }
    g.setAttribute('color', new THREE.BufferAttribute(a, 3)); g.deleteAttribute('uv'); return g;
  };
  parts.push(paint(new THREE.CylinderGeometry(0.5, 0.9, 9, 5, 1, true).translate(0, 4.5, 0), '#6a4a5a'));
  for (const [x, y, z, r] of [[0, 13, 0, 6.5], [2.6, 10.5, 1.2, 4.6], [-2.4, 11, -1.6, 4.4], [0.4, 17, -0.4, 4]]) {
    const g = new THREE.IcosahedronGeometry(r, 0); g.scale(1, 0.85, 1); g.translate(x, y, z);
    parts.push(paint(g, '#ffffff'));
  }
  const g = mergeGeometries(parts);
  g.computeVertexNormals();
  return g;
}

function coniferGeometry() {
  const parts = [];
  const paint = (g, hex) => {
    g = g.toNonIndexed(); const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const k = 0.8 + 0.2 * Math.min(1, g.attributes.position.getY(i) / 22); a[i * 3] = c.r * k; a[i * 3 + 1] = c.g * k; a[i * 3 + 2] = c.b * k; }
    g.setAttribute('color', new THREE.BufferAttribute(a, 3)); g.deleteAttribute('uv'); return g;
  };
  parts.push(paint(new THREE.CylinderGeometry(0.4, 0.7, 6, 5, 1, true).translate(0, 3, 0), '#5a4048'));
  for (const [y, r, h] of [[7, 5.2, 8], [11.5, 4.1, 7], [15.5, 3, 6], [19, 1.9, 5]]) parts.push(paint(new THREE.ConeGeometry(r, h, 7, 1).translate(0, y, 0), '#ffffff'));
  const g = mergeGeometries(parts);
  g.computeVertexNormals();
  return g;
}

// groves with clearings between them, rather than an even sprinkle
function grove(x, z) {
  const n = (a, b) => { const i = Math.floor(a), j = Math.floor(b), f = a - i, g = b - j, h = (u, v) => { const s = Math.sin(u * 127.1 + v * 311.7) * 43758.5453; return s - Math.floor(s); };
    const fx = f * f * (3 - 2 * f), fz = g * g * (3 - 2 * g);
    return (h(i, j) * (1 - fx) + h(i + 1, j) * fx) * (1 - fz) + (h(i, j + 1) * (1 - fx) + h(i + 1, j + 1) * fx) * fz; };
  const v = n(x / 140, z / 140) * 0.65 + n(x / 45 + 7, z / 45 - 3) * 0.35;
  return Math.min(1, Math.max(0, (v - 0.3) / 0.22));
}

function forests(scene, preset) {
  const spacing = preset.trees >= 200 ? 30 : preset.trees >= 120 ? 40 : 54;
  const range = preset.trees >= 200 ? 2200 : preset.trees >= 120 ? 1600 : 1100;
  const T = 768, geo = treeGeometry(), coneGeo = coniferGeometry();
  const mat = nightGrade(new THREE.MeshLambertMaterial({ vertexColors: true, emissive: '#0c2030', emissiveIntensity: 0.6 }), 'forest');
  const tiles = new Map();
  const palette = ['#3f9a52', '#4fae5a', '#2f8a5a', '#5bb86a', '#3a8f70', '#f2a6c8', '#7fd8c8', '#62b04a'];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color(), up = new THREE.Vector3(0, 1, 0);
  function build(ti, tj) {
    const r = rng(ti * 7919 + tj * 104729 + 13), pts = [];
    const x0 = ti * T, z0 = tj * T;
    const step = spacing * 0.6;
    for (let z = z0; z < z0 + T; z += step) for (let x = x0; x < x0 + T; x += step) {
      const px = x + r() * step, pz = z + r() * step;
      const h = terrainHeight(MAIN, px, pz), f = forestAt(px, pz, h) * grove(px, pz);
      if (f > 0 && r() < f * 1.8 && !onPath(px, pz)) pts.push([px, h, pz, r(), r(), r(), f]);
    }
    if (!pts.length) return null;
    // conifers take over up the slopes; broadleaf trees keep the valleys
    const kinds = [[], []];
    for (const pt of pts) kinds[r() < THREE.MathUtils.smoothstep(pt[1], 120, 520) * 0.85 + 0.12 ? 1 : 0].push(pt);
    const group = new THREE.Group();
    kinds.forEach((list, kind) => {
      if (!list.length) return;
      const mesh = new THREE.InstancedMesh(kind ? coneGeo : geo, mat, list.length);
      list.forEach(([x, y, z, a, b, k, f], i) => {
        // big old trees in the hearts of the groves, saplings at their edges
        const sc = (0.45 + a * a * 1.3) * (0.7 + 0.5 * f);
        q.setFromAxisAngle(up, b * 6.28); s.set(sc, sc * (0.8 + k * 0.5), sc); p.set(x, y - 0.5, z);
        mesh.setMatrixAt(i, m4.compose(p, q, s));
        c.set(kind ? (k < 0.5 ? '#2f7a5c' : '#3b8a62') : palette[Math.floor(k * (k < 0.9 ? 5 : palette.length))]);
        c.offsetHSL((a - 0.5) * 0.04, (b - 0.5) * 0.15, (k - 0.5) * 0.12);
        mesh.setColorAt(i, c);
      });
      mesh.castShadow = false; mesh.receiveShadow = true;
      mesh.computeBoundingSphere();
      group.add(mesh);
    });
    scene.add(group);
    return group;
  }
  // once the roads are known, regrow the tiles already built so no tree stands on a road
  whenPaths(() => { for (const t of tiles.values()) if (t) { scene.remove(t); t.traverse((o) => o.geometry && o.geometry !== geo && o.geometry !== coneGeo && o.geometry.dispose()); } tiles.clear(); });
  return {
    update(cam) {
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
      sea.position.set(Math.round(camera.position.x / 100) * 100, 0, Math.round(camera.position.z / 100) * 100);
      const cx = camera.position.x, cz = camera.position.z;
      const key = Math.round(cx / 48) + ',' + Math.round(cz / 48);
      if (key === lastKey) return;
      lastKey = key;
      const ci = Math.floor((cx - G.x0) / CHUNK), cj = Math.floor((cz - G.z0) / CHUNK), n = Math.ceil(NEAR_R / CHUNK) + 1;
      for (const m of chunks.values()) if (m) m.visible = false;
      for (let j = cj - n; j <= cj + n; j++) for (let i = ci - n; i <= ci + n; i++) {
        const x0 = G.x0 + i * CHUNK, z0 = G.z0 + j * CHUNK;
        if (i < 0 || j < 0 || x0 + CHUNK > G.x0 + G.span || z0 + CHUNK > G.z0 + G.span) continue;
        if (Math.hypot(x0 + CHUNK / 2 - cx, z0 + CHUNK / 2 - cz) > NEAR_R) continue;
        const k = i + ',' + j;
        if (!chunks.has(k)) {
          const g = landGeometry(x0, z0, CN, CHUNK / CN, -6);
          let m = null;
          if (g) { m = new THREE.Mesh(g, nearMat); m.receiveShadow = true; group.add(m); }
          chunks.set(k, m);
        }
        const m = chunks.get(k);
        if (m) m.visible = true;
      }
      woods.update(camera.position);
    },
  };
}
