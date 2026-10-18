// A living meadow that travels with the player: thick tufts of wind-blown grass
// and drifts of little wildflowers fill the ground all around the camera, so the
// fields read as soft and full up close instead of flat colour. Cells sit on a
// fixed world grid and are cached, so nothing pops as you walk; the patch fades
// out smoothly at its edge into the painted meadow shader beyond.
import * as THREE from 'three';
import { nightGrade } from './materials.js';
import { MOOD } from './sky.js';
import { GROUND_NOISE } from './ground.js';
import { MAIN, islandAt, groundAt, builtHeight, terrainHeight, groundHSL, isClearOfBuildings } from './layout.js';

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
    const ox = Math.cos(a) * rr, oz = Math.sin(a) * rr, w = 0.008 + hash(k, 7) * 0.009, h = 0.42 + hash(k, 11) * hash(k, 19) * 0.6;
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
    const tipP = [Math.cos(a) * 0.12, H + 0.025, Math.sin(a) * 0.12];
    tri([0, H + 0.01, 0], [Math.cos(b) * 0.07, H + 0.02, Math.sin(b) * 0.07], tipP, E, P, P, 1);
    tri([0, H + 0.01, 0], tipP, [Math.cos(c) * 0.07, H + 0.02, Math.sin(c) * 0.07], E, P, P, 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aTip', new THREE.Float32BufferAttribute(tip, 1));
  return g;
}

function swayMaterial(time, radius, key, blade, inner = 0) {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = time;
    sh.uniforms.uR = { value: radius };
    sh.uniforms.uR0 = { value: inner };
    sh.uniforms.uGNight = MOOD.night;
    sh.vertexShader = sh.vertexShader
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
        uniform float uGNight; uniform float uTime; varying float vTip; varying vec3 vOrg;
        ${GROUND_NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        ${blade ? `{
          // Arkenfall-style sward colours (linear, dark and saturated, lit up by the sun and tone
          // curve): a ramp moss > lush > meadow > sedge > dry straw, chosen by 5 m stands and 1.6 m
          // tussocks, with each blade a little lighter or darker; dark at the root, sunlit at the tip
          float stand = gNoise(vOrg.xz / 5.3 + vec2(gNoise(vOrg.xz / 13.0) * 1.7, 3.1));
          float tuss = fract(sin(dot(floor(vOrg.xz / 1.6), vec2(12.9898, 78.233))) * 43758.5453);
          float cp = clamp(0.55 + (stand - 0.5) * 0.5 + (tuss - 0.5) * 0.2 + (gNoise(vOrg.xz * 0.0035) - 0.5) * 0.35, 0.0, 1.0);
          vec3 cMoss = vec3(0.083, 0.08, 0.036), cLush = vec3(0.082, 0.155, 0.05), cMeadow = vec3(0.11, 0.18, 0.06), cSedge = vec3(0.17, 0.18, 0.07), cDry = vec3(0.36, 0.28, 0.1);
          vec3 g = cp < 0.35 ? mix(cMoss, cLush, cp / 0.35) : cp < 0.65 ? mix(cLush, cMeadow, (cp - 0.35) / 0.3) : cp < 0.85 ? mix(cMeadow, cSedge, (cp - 0.65) / 0.2) : mix(cSedge, cDry, (cp - 0.85) / 0.15);
          g *= 0.84 + 0.32 * fract(vColor.g * 37.0);
          diffuseColor.rgb = mix(g * 0.45, g * 2.1 + vec3(0.02, 0.015, 0.0), smoothstep(0.0, 1.0, vTip));
          // slow cloud shadows drifting over the field, shared with the ground beneath
          diffuseColor.rgb *= 0.62 + 0.38 * smoothstep(0.32, 0.62, gNoise(vOrg.xz * 0.004 + vec2(uTime * 0.012, uTime * 0.005)));
        }` : `{
          // the stem stays green whatever the petals' colour
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
      for (const L of LAYERS) { L.tufts.visible = show; if (L.fl) L.fl.visible = show; }
      if (!show) return;
      if (isl !== cacheIsl) { for (const L of LAYERS) L.cache.clear(); cacheIsl = isl; lastX = Infinity; }
      if (Math.hypot(p.x - lastX, p.z - lastZ) > 2.5) { lastX = p.x; lastZ = p.z; for (const L of LAYERS) rebuild(L, p.x, p.z, isl); }
    },
  };
}
