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
function tuftGeometry(blades) {
  const pos = [], col = [], tip = [], nrm = [], idx = [];
  for (let k = 0; k < blades; k++) {
    const a = hash(k, 3) * Math.PI * 2, rr = 0.03 + Math.sqrt(hash(k, 5)) * 0.5;
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

function swayMaterial(time, radius, key, blade) {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = time;
    sh.uniforms.uR = { value: radius };
    sh.uniforms.uGNight = MOOD.night;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime; uniform float uR; attribute float aTip; varying float vTip; varying vec3 vOrg;
        ${GROUND_NOISE}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec3 org = (modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.)).xyz;
        vOrg = org; vTip = aTip;
        float fade = 1. - smoothstep(uR * 0.62, uR * 0.97, length(org.xz - cameraPosition.xz));
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
  // a wider, denser blanket so the grass runs on toward the middle distance (look pass)
  const CELL = low ? 1.2 : high ? 0.8 : 0.95, R = low ? 38 : high ? 70 : 55;
  const span = Math.ceil(R / CELL), maxN = Math.ceil(Math.PI * span * span * 1.05);
  const time = { value: 0 };
  const tufts = new THREE.InstancedMesh(tuftGeometry(low ? 12 : 18), swayMaterial(time, R, 'meadow-blade', true), maxN);
  const flowers = new THREE.InstancedMesh(flowerGeometry(), swayMaterial(time, R, 'meadow-flower'), Math.ceil(maxN * 0.4));
  for (const m of [tufts, flowers]) { m.frustumCulled = false; m.count = 0; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); }
  tufts.setColorAt(0, new THREE.Color()); flowers.setColorAt(0, new THREE.Color());

  const PETALS = ['#ff86c0', '#fff4f8', '#ffd84f', '#c49bff', '#8fb8ff', '#ff9e9e'].map((c) => new THREE.Color(c));
  const cache = new Map();
  let cacheIsl = null, lastX = Infinity, lastZ = Infinity;
  const dummy = new THREE.Object3D(), color = new THREE.Color();

  // what grows in one grid cell: null for bare ground, else a tuft and maybe a blossom
  function cell(i, j, isl) {
    const key = i * 100003 + j;
    let c = cache.get(key);
    if (c !== undefined) return c;
    c = null;
    const x = (i + 0.15 + hash(i, j, 1) * 0.7) * CELL, z = (j + 0.15 + hash(i, j, 2) * 0.7) * CELL;
    if (islandAt(x, z, isl.y) === isl) {
      const y = groundAt(x, z, isl.y);
      const th = isl.main ? terrainHeight(isl, x, z) : null;
      const natural = isl.main ? builtHeight(x, z) === null && th > 0.6 : true;
      if (y !== null && natural && isClearOfBuildings(x, z, -1, isl.y)) {
        const [H, S, L] = groundHSL(isl, x, z, isl.main ? th : y - isl.y);
        if (H > 0.15 && H < 0.5 && S > 0.22 && L < 0.75) {
          const drift = vnoise(x * 0.05 + 3, z * 0.05 - 7);
          const bloom = hash(i, j, 3) < (drift > 0.55 ? 0.5 : 0.07);
          c = { x, y, z, H, S, L, rot: hash(i, j, 4) * 6.28, s: 0.75 + hash(i, j, 5) * 0.6, bloom, pet: Math.floor(hash(i, j, 6) * PETALS.length), fx: (hash(i, j, 7) - 0.5) * CELL * 0.6, fz: (hash(i, j, 8) - 0.5) * CELL * 0.6 };
        }
      }
    }
    cache.set(key, c);
    return c;
  }

  function rebuild(cx, cz, isl) {
    if (cacheIsl !== isl || cache.size > maxN * 6) { cache.clear(); cacheIsl = isl; }
    const ci = Math.floor(cx / CELL), cj = Math.floor(cz / CELL);
    let nt = 0, nf = 0;
    for (let j = -span; j <= span; j++) for (let i = -span; i <= span; i++) {
      if (i * i + j * j > span * span) continue;
      const c = cell(ci + i, cj + j, isl);
      if (!c) continue;
      if (nt < maxN) {
        dummy.position.set(c.x, c.y, c.z); dummy.rotation.set(0, c.rot, 0); dummy.scale.set(c.s, c.s * (0.85 + (c.L - 0.3) * 0.8), c.s);
        dummy.updateMatrix(); tufts.setMatrixAt(nt, dummy.matrix);
        color.setHSL(c.H - 0.01, Math.min(1, c.S + 0.08), c.L); tufts.setColorAt(nt++, color);
      }
      if (c.bloom && nf < flowers.instanceMatrix.count) {
        const fx = c.x + c.fx, fz = c.z + c.fz;
        dummy.position.set(fx, c.y, fz); dummy.rotation.set(0, c.rot, 0); dummy.scale.setScalar(0.8 + c.s * 0.5);
        dummy.updateMatrix(); flowers.setMatrixAt(nf, dummy.matrix);
        flowers.setColorAt(nf++, PETALS[c.pet]);
      }
    }
    tufts.count = nt; flowers.count = nf;
    for (const m of [tufts, flowers]) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
  }

  return {
    update(t, camera) {
      time.value = t;
      const p = camera.position;
      const isl = islandAt(p.x, p.z, p.y) || MAIN;
      const gy = groundAt(p.x, p.z, p.y);
      // only worth drawing when standing near the ground
      const show = gy !== null && p.y - gy < 30;
      tufts.visible = flowers.visible = show;
      if (!show) return;
      if (Math.hypot(p.x - lastX, p.z - lastZ) > CELL * 3 || isl !== cacheIsl) { lastX = p.x; lastZ = p.z; rebuild(p.x, p.z, isl); }
    },
  };
}
