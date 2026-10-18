// A living meadow that travels with the player: thick tufts of wind-blown grass
// and drifts of little wildflowers fill the ground all around the camera, so the
// fields read as soft and full up close instead of flat colour. Cells sit on a
// fixed world grid and are cached, so nothing pops as you walk; the patch fades
// out smoothly at its edge into the painted meadow shader beyond.
import * as THREE from 'three';
import { nightGrade } from './materials.js';
import { MOOD } from './sky.js';
import { GROUND_NOISE } from './ground.js';
import { MAIN, TERRAIN_GRID, FINE_RELIEF, TARN, BROOK, BROOK_BOX, sliceWaterAt, islandAt, groundAt, builtHeight, terrainHeight, groundHSL, isClearOfBuildings } from './layout.js';

const hash = (i, j, k = 0) => {
  let h = (i * 374761393 + j * 668265263 + k * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const vnoise = (x, z) => {
  const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(i, j, 9), b = hash(i + 1, j, 9), c = hash(i, j + 1, 9), d = hash(i + 1, j + 1, 9);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

// a clump of tall, hair-thin blades (look pass 3, after Arkenfall's wheat-gold meadows): each blade
// is one quad and a tip triangle (3 triangles), so a clump can carry many blades for little cost;
// the curve comes from the lean and the wind in the shader
function tuftGeometry(blades, spread = 1) {
  const pos = [], col = [], tip = [], nrm = [], idx = [];
  for (let k = 0; k < blades; k++) {
    const a = hash(k, 3) * Math.PI * 2, rr = (0.03 + Math.sqrt(hash(k, 5)) * 0.5) * spread;
    const ox = Math.cos(a) * rr, oz = Math.sin(a) * rr, w = 0.011 + hash(k, 7) * 0.012, h = 0.42 + hash(k, 11) * hash(k, 19) * 0.6;
    const fa = a + (hash(k, 17) - 0.5) * 1.2, ta = fa + Math.PI / 2, lean = 0.12 + hash(k, 13) * 0.3;
    // each blade its own shade: some yellower, some bluer, so the field is never one flat green
    const v = 0.82 + hash(k, 23) * 0.36, hu = hash(k, 29) - 0.5;
    const base = pos.length / 3;
    for (const t of [0, 0.55]) {
      const ww = w * (1 - t * 0.6), bend = lean * t * t, cx = ox + Math.cos(fa) * bend, cz = oz + Math.sin(fa) * bend, y = h * t;
      pos.push(cx - Math.cos(ta) * ww, y, cz - Math.sin(ta) * ww, cx + Math.cos(ta) * ww, y, cz + Math.sin(ta) * ww);
      const c = 0.5 + 0.6 * t, r = c * v * (1 + hu * 0.35), g = c * v, bl = c * v * (1 - hu * 0.5);
      col.push(r, g, bl, r, g, bl); tip.push(t, t); nrm.push(0, 1, 0, 0, 1, 0);
    }
    pos.push(ox + Math.cos(fa) * lean, h * 0.97, oz + Math.sin(fa) * lean);
    col.push(1.1 * v * (1 + hu * 0.35), 1.1 * v, 1.1 * v * (1 - hu * 0.5)); tip.push(1); nrm.push(0, 1, 0);
    idx.push(base, base + 1, base + 3, base, base + 3, base + 2, base + 2, base + 3, base + 4);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aTip', new THREE.Float32BufferAttribute(tip, 1));
  g.setIndex(idx);
  return g;
}

// a little five-petalled blossom on a stem: petals take the instance colour, the eye stays golden
function flowerGeometry() {
  const pos = [], col = [], tip = [], nrm = [];
  const H = 0.68, tri = (a, b, c, ca, cb, cc, t) => {
    pos.push(...a, ...b, ...c); col.push(...ca, ...cb, ...cc); tip.push(t, t, t); nrm.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
  };
  const stem = [0.25, 0.42, 0.2];
  tri([-0.015, 0, 0], [0.015, 0, 0], [0, H, 0], stem, stem, stem, 0.4);
  const P = [1, 1, 1], E = [1.25, 0.95, 0.35];
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2, b = a + 0.55, c = a - 0.55;
    const tipP = [Math.cos(a) * 0.075, H + 0.025, Math.sin(a) * 0.075];
    tri([0, H + 0.01, 0], [Math.cos(b) * 0.045, H + 0.02, Math.sin(b) * 0.045], tipP, E, P, P, 1);
    tri([0, H + 0.01, 0], tipP, [Math.cos(c) * 0.045, H + 0.02, Math.sin(c) * 0.045], E, P, P, 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aTip', new THREE.Float32BufferAttribute(tip, 1));
  return g;
}

// ---- the meadow on the graphics card (after Arkenfall's sward) -----------------------------
// One draw per field: each instance is a cell of a camera-centred grid, worked out from
// gl_InstanceID; the shader jitters it by a hash of the world cell (so nothing swims as you walk),
// reads the ground height from the baked terrain grid and whether grass grows there from a small
// mask baked round the player. The CPU never touches a blade.
function gpuVertex(vs, flower) {
  return vs
    .replace('#include <common>', `#include <common>
      uniform float uTime; uniform sampler2D uH; uniform vec4 uHG; uniform sampler2D uFR; uniform float uFRT; uniform sampler2D uMask; uniform vec3 uMaskO;
      uniform vec4 uField; uniform vec2 uOrigin; ${flower ? 'uniform vec3 uPetals[6]; varying vec3 vPet;' : ''}
      attribute float aTip; varying float vTip; varying vec3 vOrg;
      ${GROUND_NOISE}
      // the slice's tarn and brook, carved exactly as layout.js carveWater() does
      uniform vec4 uTarn; uniform vec4 uBrookBox; uniform vec2 uBrook[${BROOK.length}];
      float sm(float a, float b, float x) { float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
      float carveWater(vec2 p, float h, float fr) {
        if (p.x < uBrookBox.x || p.x > uBrookBox.z || p.y < uBrookBox.y || p.y > uBrookBox.w) return h + fr;
        float bd = 1e9;
        for (int k = 0; k < ${BROOK.length - 1}; k++) {
          vec2 a = uBrook[k], d = uBrook[k + 1] - a;
          float t = clamp(dot(p - a, d) / dot(d, d), 0.0, 1.0);
          bd = min(bd, length(p - a - d * t));
        }
        h += fr * sm(4.0, 14.0, bd);
        if (bd < 7.0) h -= 1.0 * (1.0 - sm(1.2, 7.0, bd));
        vec2 q = p - uTarn.xy; float dd = length(q), a = atan(q.y, q.x);
        float R = uTarn.z * (1.0 + 0.16 * sin(3.0 * a + 1.3) + 0.08 * sin(5.0 * a + 0.4)), t = dd / R;
        if (t < 1.0) return uTarn.w - 0.25 - ${TARN.depth.toFixed(2)} * sm(1.0, 0.2, t);
        if (t < 1.0 + 34.0 / R) return uTarn.w + 0.2 + (h - uTarn.w - 0.2) * sm(1.0, 1.0 + 34.0 / R, t);
        return h;
      }
      float gHeight(vec2 p) {
        vec2 f = clamp((p - uHG.xy) / uHG.z, vec2(0.0), vec2(uHG.w - 1.001));
        ivec2 i = ivec2(floor(f)); vec2 u = fract(f);
        vec2 a = texelFetch(uH, i, 0).rg, b = texelFetch(uH, i + ivec2(1, 0), 0).rg, c = texelFetch(uH, i + ivec2(0, 1), 0).rg, e = texelFetch(uH, i + ivec2(1, 1), 0).rg;
        vec2 hm = a + (b - a) * u.x + (c - a) * u.y + (a - b - c + e) * u.x * u.y;
        // the walking-scale relief, sampled exactly as layout.js fineAt() does
        if (hm.y <= 0.0) return carveWater(p, hm.x, 0.0);
        vec2 ff = p / uFRT; ivec2 fi = ivec2(floor(ff)); vec2 fu = ff - floor(ff); int M = textureSize(uFR, 0).x - 1;
        float fa = texelFetch(uFR, fi & M, 0).r, fb = texelFetch(uFR, (fi + ivec2(1, 0)) & M, 0).r, fc = texelFetch(uFR, (fi + ivec2(0, 1)) & M, 0).r, fe = texelFetch(uFR, (fi + ivec2(1, 1)) & M, 0).r;
        return carveWater(p, hm.x, hm.y * (fa + (fb - fa) * fu.x + (fc - fa) * fu.y + (fa - fb - fc + fe) * fu.x * fu.y));
      }
      vec2 gH22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }`)
    .replace('#include <begin_vertex>', `#include <begin_vertex>
      int N = int(uField.y), id = gl_InstanceID;
      vec2 cell = uOrigin + vec2(float(id - (id / N) * N), float(id / N));
      vec2 r = gH22(cell), r2 = gH22(cell * 1.618 + 7.3), r3 = gH22(cell + 19.1);
      vec2 p = (cell + 0.15 + 0.7 * r) * uField.x;
      float dcam = length(p - cameraPosition.xz);
      vec2 muv = (p - uMaskO.xy) / uMaskO.z;
      vec4 m = texture(uMask, muv);
      float inside = step(0.0, muv.x) * step(muv.x, 1.0) * step(0.0, muv.y) * step(muv.y, 1.0);
      float fade = (1. - smoothstep(uField.w * 0.62, uField.w * 0.97, dcam)) * (uField.z > 0. ? smoothstep(uField.z * 0.6, uField.z, dcam) : 1.);
      ${flower
        ? `// flowers gather in drifts: a few everywhere, many where the drift noise is high
      float drift = gNoise(p * 0.05 + vec2(3.0, -7.0));
      float keep = m.r * inside * (drift > 0.55 ? 0.85 : 0.3);
      int pk = int(floor(r3.y * 5.999)); vPet = uPetals[pk];`
        : 'float keep = m.r * inside;'}
      float alive = step(r2.x, keep) * step(0.001, fade);
      float ang = r2.y * 6.2832, sc = 0.75 + r3.x * 0.6, sy = sc * (0.65 + m.g * 0.7);
      vec3 lp = transformed;
      lp.xz = vec2(lp.x * cos(ang) - lp.z * sin(ang), lp.x * sin(ang) + lp.z * cos(ang));
      lp *= vec3(sc, sy, sc) * fade * alive;
      vec3 org = vec3(p.x, gHeight(p) - 0.05, p.y);
      vOrg = org; vTip = aTip;
      // gusts roll across the field as waves of bending grass, with a quick flutter on top
      vec2 wdir = normalize(vec2(0.8, 0.5));
      float gust = gNoise(org.xz * 0.06 - wdir * uTime * 1.6) * 0.8 + gNoise(org.xz * 0.21 - wdir * uTime * 2.4) * 0.3;
      float bend = aTip * aTip * (0.12 + 0.55 * gust) * sy;
      lp += vec3(wdir.x, 0.0, wdir.y) * bend; lp.y -= bend * 0.35;
      lp.x += aTip * 0.04 * sin(uTime * 3.3 + org.z * 1.7) * sy;
      // the grass parts round the player
      vec2 away = org.xz - cameraPosition.xz; float da = length(away);
      if (da < 1.8) { vec2 pu = normalize(away + 1e-4) * (1.0 - da / 1.8) * 0.45 * aTip * sy; lp += vec3(pu.x, 0.0, pu.y); }
      transformed = org + lp;`);
}

function swayMaterial(time, radius, key, blade, inner = 0, gpu = null) {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = time;
    sh.uniforms.uR = { value: radius };
    sh.uniforms.uR0 = { value: inner };
    sh.uniforms.uGNight = MOOD.night;
    if (gpu) { Object.assign(sh.uniforms, gpu.uniforms); sh.vertexShader = gpuVertex(sh.vertexShader, gpu.flower); }
    else sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime; uniform float uR; uniform float uR0; attribute float aTip; varying float vTip; varying vec3 vOrg;
        ${GROUND_NOISE}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec3 org = (modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.)).xyz;
        vOrg = org; vTip = aTip;
        float dcam = length(org.xz - cameraPosition.xz);
        // each ring fades out at its edge and the outer ring fades in under the inner one's edge
        float fade = (1. - smoothstep(uR * 0.62, uR * 0.97, dcam)) * (uR0 > 0. ? smoothstep(uR0 * 0.62 * 0.95, uR0, dcam) : 1.);
        transformed *= fade;
        // gusts roll across the field as waves of bending grass, with a quick flutter on top
        vec2 wdir = normalize(vec2(0.8, 0.5));
        float gust = gNoise(org.xz * 0.06 - wdir * uTime * 1.6) * 0.8 + gNoise(org.xz * 0.21 - wdir * uTime * 2.4) * 0.3;
        float bend = aTip * aTip * (0.12 + 0.55 * gust);
        mat3 toLocal = inverse(mat3(instanceMatrix));
        transformed += toLocal * vec3(wdir.x, 0.0, wdir.y) * bend;
        transformed.y -= bend * 0.35;
        transformed.x += aTip * 0.04 * sin(uTime * 3.3 + org.z * 1.7);
        // the grass parts round the player
        vec2 away = org.xz - cameraPosition.xz; float da = length(away);
        if (da < 1.8) { vec2 pu = normalize(away + 1e-4) * (1.0 - da / 1.8) * 0.45 * aTip; transformed += toLocal * vec3(pu.x, 0.0, pu.y); }`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uGNight; uniform float uTime; varying float vTip; varying vec3 vOrg; ${gpu && gpu.flower ? 'varying vec3 vPet;' : ''}
        ${GROUND_NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        ${blade ? `{
          // Arkenfall-style sward colours (linear, dark and saturated, lit up by the sun and tone
          // curve): a ramp moss > lush > meadow > sedge > dry straw, chosen by 5 m stands and 1.6 m
          // tussocks, with each blade a little lighter or darker; dark at the root, sunlit at the tip
          float stand = gNoise(vOrg.xz / 5.3 + vec2(gNoise(vOrg.xz / 13.0) * 1.7, 3.1));
          float tuss = fract(sin(dot(floor(vOrg.xz / 1.6), vec2(12.9898, 78.233))) * 43758.5453);
          float cp = clamp(0.55 + (stand - 0.5) * 0.5 + (tuss - 0.5) * 0.2 + (gNoise(vOrg.xz * 0.0035) - 0.5) * 0.35 + (gNoise(vOrg.xz * 0.017 + 3.0) - 0.5) * 0.45, 0.0, 1.0);
          vec3 g = swardColour(cp);
          g *= 0.84 + 0.32 * fract(vColor.g * 37.0);
          diffuseColor.rgb = mix(g * 0.6, g * 2.7 + vec3(0.03, 0.02, 0.0), smoothstep(0.0, 1.0, vTip));
          // slow cloud shadows drifting over the field, shared with the ground beneath
          diffuseColor.rgb *= 0.62 + 0.38 * smoothstep(0.32, 0.62, gNoise(vOrg.xz * 0.004 + vec2(uTime * 0.012, uTime * 0.005)));
        }` : `{
          // the stem stays green whatever the petals' colour
          ${gpu ? 'diffuseColor.rgb *= vPet;' : ''}
          if (vTip < 0.5) diffuseColor.rgb = vec3(0.16, 0.3, 0.1);
        }`}`)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nnormal = normalize(vNormal);')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        #ifdef USE_FOG
        {
          // light through the blades when looking toward the sun
          vec3 vd = normalize(vAtmosW - cameraPosition);
          float back = pow(max(dot(vd, fogSun.xyz), 0.0), 4.0);
          totalEmissiveRadiance += diffuseColor.rgb * fogSunCol.rgb * back * vTip * 0.5 * (1.0 - uGNight);
        }
        #endif
        // night: tips of the grass breathe a faint bioluminescent glow in patches
        totalEmissiveRadiance += vec3(0.12, 0.55, 0.5) * pow(vTip, 3.0) * uGNight * smoothstep(0.45, 0.8, gNoise(vOrg.xz * 0.08 + uTime * 0.05)) * 0.6;`);
  };
  m.customProgramCacheKey = () => key + (gpu ? '-gpu' : '');
  return nightGrade(m, key);
}

export function createMeadow(scene, preset) {
  const low = preset.grass < 4000, high = preset.grass >= 8000;
  const time = { value: 0 };
  // two rings of grass: dense blades round the player, then wider, sparser clumps out to the
  // middle distance, so the meadows read as grass as far as the eye settles (world pass 2b)
  const LAYERS = [
    { CELL: low ? 0.95 : high ? 0.75 : 0.85, R0: 0, R: low ? 24 : high ? 40 : 32, blades: low ? 16 : high ? 32 : 24, spread: 1, flowers: true },
  ];
  // beyond it, wider sparser clumps to the middle distance, where the ground shader takes over
  if (!low) LAYERS.push({ CELL: high ? 2.4 : 2.9, R0: high ? 32 : 26, R: high ? 120 : 90, blades: 14, spread: 1.9, flowers: false });
  for (const L of LAYERS) {
    L.span = Math.ceil(L.R / L.CELL);
    L.maxN = Math.ceil(Math.PI * (L.span * L.span - (L.R0 / L.CELL) ** 2 * 0.8) * 1.05);
    L.tufts = new THREE.InstancedMesh(tuftGeometry(L.blades, L.spread), swayMaterial(time, L.R, 'meadow-blade' + (L.R0 ? '-mid' : ''), true, L.R0), L.maxN);
    L.cache = new Map();
    const ms = [L.tufts];
    if (L.flowers) { L.fl = new THREE.InstancedMesh(flowerGeometry(), swayMaterial(time, L.R, 'meadow-flower'), Math.ceil(L.maxN * 0.4)); ms.push(L.fl); L.fl.setColorAt(0, new THREE.Color()); }
    for (const m of ms) { m.frustumCulled = false; m.count = 0; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); }
    L.tufts.setColorAt(0, new THREE.Color());
  }

  const PETALS = ['#e8323a', '#3f6bff', '#fff6ee', '#e8323a', '#5a7dff', '#ffd84f', '#ff86c0', '#fff6ee'].map((c) => new THREE.Color(c));
  let cacheIsl = null, lastX = Infinity, lastZ = Infinity;

  // ---- the GPU meadow on the main land ----
  const G = TERRAIN_GRID;
  const hTex = new THREE.DataTexture(G.hm, G.n, G.n, THREE.RGFormat, THREE.FloatType);
  hTex.minFilter = hTex.magFilter = THREE.NearestFilter; hTex.needsUpdate = true;
  const frTex = new THREE.DataTexture(FINE_RELIEF.data, FINE_RELIEF.n, FINE_RELIEF.n, THREE.RedFormat, THREE.FloatType);
  frTex.minFilter = frTex.magFilter = THREE.NearestFilter; frTex.needsUpdate = true;
  // where grass grows (r) and how lush it stands (g), 2 m texels over a window round the player,
  // re-baked a few rows a frame when the player nears its edge (the old mask serves meanwhile)
  const MT = 2, MN = high ? 200 : low ? 110 : 160, MS = MT * MN;
  const maskData = [new Uint8Array(MN * MN * 4), new Uint8Array(MN * MN * 4)];
  let front = 0;
  const mTex = new THREE.DataTexture(maskData[0], MN, MN, THREE.RGBAFormat);
  mTex.minFilter = mTex.magFilter = THREE.LinearFilter; mTex.needsUpdate = true;
  const maskO = new THREE.Vector3(1e9, 1e9, MS);
  function grows(x, z) {
    if (islandAt(x, z, MAIN.y) !== MAIN || sliceWaterAt(x, z, 0.5)) return null;
    const th = terrainHeight(MAIN, x, z);
    if (!(builtHeight(x, z) === null && th > 0.6 && th < 800) || !isClearOfBuildings(x, z, -1, MAIN.y)) return null;
    let [H, S, Lt] = groundHSL(MAIN, x, z, th);
    let ok = H > 0.12 && H < 0.55 && S > 0.12 && Lt < 0.8;
    if (!ok && th > 6 && S < 0.3 && Lt > 0.4 && Lt < 0.85) { ok = true; Lt = 0.36; }
    if (!ok) return null;
    const e = 2, sl = Math.hypot(terrainHeight(MAIN, x + e, z) - terrainHeight(MAIN, x - e, z), terrainHeight(MAIN, x, z + e) - terrainHeight(MAIN, x, z - e)) / (2 * e);
    return sl > 0.75 ? null : Math.min(1, Math.max(0, (Lt - 0.2) / 0.6));
  }
  let bake = null;   // { x0, z0, row }
  function bakeRows(budgetMs) {
    const t0 = performance.now(), d = maskData[1 - front];
    while (bake.row < MN && performance.now() - t0 < budgetMs) {
      const z = bake.z0 + (bake.row + 0.5) * MT;
      for (let i = 0; i < MN; i++) {
        const g = grows(bake.x0 + (i + 0.5) * MT, z), k = (bake.row * MN + i) * 4;
        d[k] = g === null ? 0 : 255; d[k + 1] = g === null ? 0 : Math.round(g * 255);
      }
      bake.row++;
    }
    if (bake.row >= MN) {
      front = 1 - front;
      mTex.image.data = maskData[front]; mTex.needsUpdate = true;
      maskO.set(bake.x0, bake.z0, MS);
      bake = null;
    }
  }
  const FIELDS = [
    { CELL: low ? 0.85 : high ? 0.6 : 0.7, R0: 0, R: low ? 24 : high ? 40 : 32, geo: tuftGeometry(low ? 12 : high ? 16 : 14, 1), key: 'gpu-near' },
  ];
  if (!low) FIELDS.push({ CELL: high ? 1.8 : 2.2, R0: high ? 34 : 27, R: high ? 120 : 90, geo: tuftGeometry(14, 1.9), key: 'gpu-mid' });
  FIELDS.push({ CELL: 1.1, R0: 0, R: FIELDS[0].R, geo: flowerGeometry(), key: 'gpu-flower', flower: true });
  for (const F of FIELDS) {
    F.N = Math.ceil((2 * F.R) / F.CELL) + 2;
    const g = new THREE.InstancedBufferGeometry().copy(F.geo);
    g.instanceCount = F.N * F.N;
    F.origin = new THREE.Vector2();
    const uniforms = { uTarn: { value: new THREE.Vector4(TARN.x, TARN.z, TARN.r, TARN.level) }, uBrookBox: { value: new THREE.Vector4(...BROOK_BOX) }, uBrook: { value: BROOK.map(([x, z]) => new THREE.Vector2(x, z)) }, uH: { value: hTex }, uFR: { value: frTex }, uFRT: { value: FINE_RELIEF.texel }, uHG: { value: new THREE.Vector4(G.x0, G.z0, G.step, G.n) }, uMask: { value: mTex }, uMaskO: { value: maskO },
      uField: { value: new THREE.Vector4(F.CELL, F.N, F.R0, F.R) }, uOrigin: { value: F.origin } };
    if (F.flower) uniforms.uPetals = { value: ['#e8323a', '#3f6bff', '#fff6ee', '#e8323a', '#5a7dff', '#ffd84f'].map((c) => new THREE.Color(c)) };
    F.mesh = new THREE.Mesh(g, swayMaterial(time, F.R, 'meadow-' + F.key, !F.flower, F.R0, { uniforms, flower: !!F.flower }));
    F.mesh.frustumCulled = false; F.mesh.visible = false; F.mesh.receiveShadow = true; F.mesh.userData.noReflect = true;   // the woods' shadows fall across the grass
    scene.add(F.mesh);
  }
  const dummy = new THREE.Object3D(), color = new THREE.Color();

  // what grows in one grid cell: null for bare ground, else a tuft and maybe a blossom
  function cell(L, i, j, isl) {
    const key = i * 100003 + j, CELL = L.CELL;
    let c = L.cache.get(key);
    if (c !== undefined) return c;
    c = null;
    const x = (i + 0.15 + hash(i, j, 1) * 0.7) * CELL, z = (j + 0.15 + hash(i, j, 2) * 0.7) * CELL;
    if (islandAt(x, z, isl.y) === isl) {
      const y = groundAt(x, z, isl.y);
      const th = isl.main ? terrainHeight(isl, x, z) : null;
      const natural = isl.main ? builtHeight(x, z) === null && th > 0.6 && th < 800 : true;
      if (y !== null && natural && isClearOfBuildings(x, z, -1, isl.y)) {
        let [H, S, Lt] = groundHSL(isl, x, z, isl.main ? th : y - isl.y);
        let ok = H > 0.12 && H < 0.55 && S > 0.12 && Lt < 0.8;
        // the pale painted ground inland is drawn as meadow by the ground shader: grass grows there too
        if (!ok && isl.main && th > 6 && S < 0.3 && Lt > 0.4 && Lt < 0.85) { ok = true; H = 0.27; S = 0.5; Lt = 0.36; }
        if (ok && isl.main) {
          const e = 2, sl = Math.hypot(terrainHeight(isl, x + e, z) - terrainHeight(isl, x - e, z), terrainHeight(isl, x, z + e) - terrainHeight(isl, x, z - e)) / (2 * e);
          if (sl > 0.75) ok = false;
        }
        if (ok) {
          const drift = vnoise(x * 0.05 + 3, z * 0.05 - 7);
          const bloom = hash(i, j, 3) < (drift > 0.55 ? 0.6 : 0.16);
          c = { x, y, z, H, S, L: Lt, rot: hash(i, j, 4) * 6.28, s: 0.75 + hash(i, j, 5) * 0.6, bloom, pet: Math.floor(hash(i, j, 6) * PETALS.length), fx: (hash(i, j, 7) - 0.5) * CELL * 0.6, fz: (hash(i, j, 8) - 0.5) * CELL * 0.6 };
        }
      }
    }
    L.cache.set(key, c);
    return c;
  }

  function rebuild(L, cx, cz, isl) {
    if (L.cache.size > L.maxN * 6) L.cache.clear();
    const ci = Math.floor(cx / L.CELL), cj = Math.floor(cz / L.CELL), span = L.span, in0 = Math.max(0, L.R0 - 12) / L.CELL;
    let nt = 0, nf = 0;
    for (let j = -span; j <= span; j++) for (let i = -span; i <= span; i++) {
      const d2 = i * i + j * j;
      if (d2 > span * span || d2 < in0 * in0) continue;
      const c = cell(L, ci + i, cj + j, isl);
      if (!c) continue;
      if (nt < L.maxN) {
        dummy.position.set(c.x, c.y, c.z); dummy.rotation.set(0, c.rot, 0); dummy.scale.set(c.s, c.s * (0.85 + (c.L - 0.3) * 0.8), c.s);
        dummy.updateMatrix(); L.tufts.setMatrixAt(nt, dummy.matrix);
        color.setHSL(c.H - 0.01, Math.min(1, c.S + 0.08), c.L); L.tufts.setColorAt(nt++, color);
      }
      if (L.fl && c.bloom && nf < L.fl.instanceMatrix.count) {
        const fx = c.x + c.fx, fz = c.z + c.fz;
        dummy.position.set(fx, c.y, fz); dummy.rotation.set(0, c.rot, 0); dummy.scale.setScalar(0.8 + c.s * 0.5);
        dummy.updateMatrix(); L.fl.setMatrixAt(nf, dummy.matrix);
        L.fl.setColorAt(nf++, PETALS[c.pet]);
      }
    }
    L.tufts.count = nt;
    if (L.fl) L.fl.count = nf;
    for (const m of [L.tufts, L.fl]) if (m) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
  }

  return {
    update(t, camera) {
      time.value = t;
      const p = camera.position;
      const isl = islandAt(p.x, p.z, p.y) || MAIN;
      const gy = groundAt(p.x, p.z, p.y);
      // only worth drawing when near the ground (riding low or walking)
      const show = gy !== null && p.y - gy < 60;
      // on the main land the graphics card grows the meadow; the sky isles keep the clump fields
      const gpuOn = show && isl === MAIN;
      for (const F of FIELDS) { F.mesh.visible = gpuOn; if (gpuOn) F.origin.set(Math.floor(p.x / F.CELL) - (F.N >> 1), Math.floor(p.z / F.CELL) - (F.N >> 1)); }
      if (gpuOn) {
        const cx = maskO.x + MS / 2, cz = maskO.y + MS / 2;
        if (!bake && Math.max(Math.abs(p.x - cx), Math.abs(p.z - cz)) > MS / 2 - FIELDS[FIELDS.length > 2 ? 1 : 0].R - 8) {
          bake = { x0: Math.round(p.x / MT) * MT - MS / 2, z0: Math.round(p.z / MT) * MT - MS / 2, row: 0 };
          // far off the old window (a spawn or a teleport): bake the whole mask at once
          if (Math.max(Math.abs(p.x - cx), Math.abs(p.z - cz)) > MS / 2) bakeRows(1e9);
        }
        if (bake) bakeRows(3);
      }
      for (const L of LAYERS) { L.tufts.visible = show && !gpuOn; if (L.fl) L.fl.visible = show && !gpuOn; }
      if (!show || gpuOn) return;
      if (isl !== cacheIsl) { for (const L of LAYERS) L.cache.clear(); cacheIsl = isl; lastX = Infinity; }
      if (Math.hypot(p.x - lastX, p.z - lastZ) > 2.5) { lastX = p.x; lastZ = p.z; for (const L of LAYERS) rebuild(L, p.x, p.z, isl); }
    },
  };
}
