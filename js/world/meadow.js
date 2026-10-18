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

// a clump of tall, thin, curving blades (world pass 2, after Arkenfall's meadows): each blade
// tapers to a point in three segments and leans outward, so the field reads as soft grass
function tuftGeometry(blades, spread = 1) {
  const pos = [], col = [], tip = [], nrm = [], idx = [];
  for (let k = 0; k < blades; k++) {
    const a = hash(k, 3) * Math.PI * 2, rr = (0.03 + Math.sqrt(hash(k, 5)) * 0.5) * spread;
    const ox = Math.cos(a) * rr, oz = Math.sin(a) * rr, w = 0.022 + hash(k, 7) * 0.018, h = 0.28 + hash(k, 11) * hash(k, 19) * 0.6;
    const fa = a + (hash(k, 17) - 0.5) * 1.2, ta = fa + Math.PI / 2, lean = 0.15 + hash(k, 13) * 0.35;
    const base = pos.length / 3;
    for (let s = 0; s <= 3; s++) {
      const t = s / 3, ww = w * (1 - t * 0.85), bend = lean * t * t;
      const cx = ox + Math.cos(fa) * bend, cz = oz + Math.sin(fa) * bend, y = h * t * (1 - 0.15 * t);
      if (s < 3) pos.push(cx - Math.cos(ta) * ww, y, cz - Math.sin(ta) * ww, cx + Math.cos(ta) * ww, y, cz + Math.sin(ta) * ww);
      else pos.push(cx, y, cz, cx, y, cz);
      const c = 0.5 + 0.6 * t;
      col.push(c, c, c, c, c, c); tip.push(t, t);
      nrm.push(0, 1, 0, 0, 1, 0);
    }
    for (let s = 0; s < 3; s++) { const q = base + s * 2; idx.push(q, q + 1, q + 3, q, q + 3, q + 2); }
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
  const H = 0.42, tri = (a, b, c, ca, cb, cc, t) => {
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
          // the same sunlit and cool patches as the ground beneath, darker at the root, light at the tip
          float n1 = gNoise(vOrg.xz * 0.0035), n2 = gNoise(vOrg.xz * 0.017 + 3.0);
          vec3 g = diffuseColor.rgb * vec3(0.9, 1.06, 0.72);
          g *= mix(vec3(0.78, 0.95, 1.1), vec3(1.16, 1.08, 0.7), smoothstep(0.28, 0.78, n1));
          g *= 0.82 + 0.34 * n2;
          diffuseColor.rgb = mix(g * 0.42, g * 1.12 + vec3(0.05, 0.05, 0.0), smoothstep(0.0, 1.0, vTip));
        }` : ''}`)
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
    { CELL: low ? 1.2 : high ? 0.8 : 0.95, R0: 0, R: low ? 38 : high ? 60 : 50, blades: low ? 12 : 18, spread: 1, flowers: true },
  ];
  if (!low) LAYERS.push({ CELL: high ? 2.2 : 2.7, R0: high ? 48 : 40, R: high ? 150 : 110, blades: high ? 16 : 12, spread: 1.9, flowers: false });
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

  const PETALS = ['#ff86c0', '#fff4f8', '#ffd84f', '#c49bff', '#8fb8ff', '#ff9e9e'].map((c) => new THREE.Color(c));
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
          const bloom = hash(i, j, 3) < (drift > 0.55 ? 0.5 : 0.07);
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
