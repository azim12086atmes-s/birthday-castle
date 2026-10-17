// The magic in the air (study thread's plan, design/vfx/README.md; owner, Oct 17 14:40):
// small sharp sparkles whose mood follows the land (glitter, fireflies, spores, petals,
// seeds, stardust), ribbons of light that swoop, spiral, drift, orbit the Mew and trail
// the sky ship, soft light rings under every footstep at night, a restoration wave when a
// place is freed, ash and fading ribbons in the Hush, and the finale's spire spirals and
// meteor shower. Each system is one draw, moved on the GPU; the CPU only respawns.
import * as THREE from 'three';
import { rng } from './textures.js';
import { MOOD } from './sky.js';
import { S, PAL } from './layout.js';
import { crescentH, crescentRGB } from './crescent.js';

const PALETTE = { gold: '#ffd27a', cyan: '#6fe8ff', rose: '#ff9bd6', lilac: '#b89bff', mint: '#8dffcf', pearl: '#fff4e6' };
const COL = Object.fromEntries(Object.entries(PALETTE).map(([k, v]) => [k, new THREE.Color(v)]));
const PAIRS = [['gold', 'rose'], ['cyan', 'lilac'], ['mint', 'cyan'], ['rose', 'lilac'], ['pearl', 'gold'], ['lilac', 'mint']];
// the palace's tallest needle spires (palace.js SPIRES, drawn metres): x, z, top
const SPIRES = [[-26, 18, 394], [-52, 30, 345], [22, 22, 347], [-78, 34, 316], [155, 60, 258], [-322, 120, 297], [-285, 100, 257],
  [206, -120, 316], [228, -60, 278], [281, -200, 287], [322, -215, 333], [351, -190, 353], [380, -210, 295]];
const KIND = { swift: 0, spiral: 1, drift: 2, orbit: 3, trail: 4, meteor: 5 };

// ---- sparkles: one points field wrapped round the viewer, six moods -------------------
function sparkles(count) {
  const r = rng(77);
  const pos = new Float32Array(count * 3), seed = new Float32Array(count), mode = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (r() - 0.5) * 80; pos[i * 3 + 1] = r() * 30; pos[i * 3 + 2] = (r() - 0.5) * 80;
    seed[i] = r(); mode[i] = i % 6;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  g.setAttribute('aMode', new THREE.BufferAttribute(mode, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    uniforms: {
      uTime: { value: 0 }, uCenter: { value: new THREE.Vector3() }, uScale: { value: 1 }, uHush: { value: 0 }, uNight: MOOD.night,
      uW0: { value: new THREE.Vector3(0.3, 0, 0) }, uW1: { value: new THREE.Vector3(0, 0, 0) }, uWind: { value: new THREE.Vector2(0.8, 0.3) },
    },
    vertexShader: /* glsl */`
      uniform float uTime, uScale, uHush, uNight; uniform vec3 uCenter, uW0, uW1; uniform vec2 uWind;
      attribute float aSeed, aMode; varying vec3 vC; varying float vA, vMode, vRot;
      float h(float n){ return fract(sin(n * 91.7) * 43758.5); }
      void main(){
        float w = aMode < 0.5 ? uW0.x : aMode < 1.5 ? uW0.y : aMode < 2.5 ? uW0.z : aMode < 3.5 ? uW1.x : aMode < 4.5 ? uW1.y : uW1.z;
        if (h(aSeed * 13.1) > w) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
        float t = uTime, s = aSeed * 60.0;
        vec3 p = position;
        vec2 wind = uWind * (1.0 + uHush);
        float band0 = -6.0, band = 30.0, px = 2.5; vec3 c = vec3(1.0, 0.96, 0.9); float tw = 0.7 + 0.3 * sin(t * (2.0 + aSeed * 4.0) + s);
        if (aMode < 0.5) {                                  // glitter: fine twinkling sparkles
          p += vec3(sin(t * 0.3 + s), sin(t * 0.4 + s * 1.3) * 0.6, cos(t * 0.27 + s)) * 1.5;
          c = mix(vec3(1.0, 0.95, 0.85), aSeed > 0.6 ? vec3(0.45, 0.9, 1.0) : vec3(1.0, 0.82, 0.48), 0.5);
          tw = pow(0.5 + 0.5 * sin(t * (3.0 + aSeed * 5.0) + s), 3.0); px = 2.0 + aSeed * 2.0;
        } else if (aMode < 1.5) {                           // fireflies: warm, low over the grass, blinking
          band0 = -1.7; band = 3.6;
          p += vec3(sin(t * 0.5 + s) * 2.0, sin(t * 0.9 + s) * 0.4, cos(t * 0.43 + s) * 2.0);
          c = vec3(0.85, 1.0, 0.45); tw = pow(max(0.0, sin(t * 1.3 + s)), 4.0); px = 4.0 + aSeed * 2.0;
        } else if (aMode < 2.5) {                           // spores: cyan and violet, rising and swaying
          p += vec3(sin(t * 0.6 + s) * 0.8, t * (0.3 + aSeed * 0.3), cos(t * 0.5 + s) * 0.8);
          c = aSeed > 0.5 ? vec3(0.4, 0.95, 1.0) : vec3(0.75, 0.6, 1.0); px = 3.0 + aSeed * 1.5;
        } else if (aMode < 3.5) {                           // petals: pink and white, fluttering down
          p += vec3(wind.x * t * 1.2 + sin(t * 1.4 + s) * 1.2, -t * (0.6 + aSeed * 0.5), wind.y * t * 1.2 + cos(t * 1.1 + s) * 1.2);
          c = aSeed > 0.4 ? vec3(1.0, 0.62, 0.8) : vec3(1.0, 0.92, 0.95); tw = 0.55; px = 6.0 + aSeed * 3.0;
        } else if (aMode < 4.5) {                           // seeds: dandelion fluff on the wind
          p += vec3(wind.x * t * 2.2, sin(t * 0.7 + s) * 1.2, wind.y * t * 2.2) + vec3(sin(t + s), 0.0, cos(t * 0.8 + s)) * 0.6;
          c = vec3(1.0, 1.0, 0.95); tw = 0.5; px = 3.0 + aSeed * 2.0;
        } else {                                            // stardust: slow falling star specks, high up
          band0 = 4.0; band = 26.0;
          p += vec3(sin(t * 0.2 + s), -t * (0.25 + aSeed * 0.2), cos(t * 0.2 + s));
          c = vec3(1.0, 0.95, 0.8); tw = pow(0.5 + 0.5 * sin(t * (2.0 + aSeed * 3.0) + s), 2.0); px = 1.8 + aSeed * 1.5;
        }
        // the Hush: everything turns to slow grey ash
        c = mix(c, vec3(0.6, 0.6, 0.64), uHush); p.y -= uHush * t * 0.4;
        vec3 rel = vec3(mod(p.x - uCenter.x + 40.0, 80.0) - 40.0, mod(p.y - uCenter.y - band0, band) + band0, mod(p.z - uCenter.z + 40.0, 80.0) - 40.0);
        if (aMode >= 0.5 && aMode < 1.5) rel.y = mod(position.y + sin(t * 0.9 + s) * 0.4, band) + band0;
        vec4 mv = viewMatrix * vec4(uCenter + rel, 1.0);
        float d = -mv.z;
        // fewer sparkles right at the lens: only a third of them come within 15 m
        float near = h(aSeed * 7.7) < 0.35 ? 1.0 : smoothstep(10.0, 16.0, d);
        vA = tw * near * smoothstep(0.8, 2.5, d) * smoothstep(40.0, 28.0, length(rel.xz)) * (1.0 - 0.4 * uHush);
        vC = c; vMode = aMode; vRot = t * (0.6 + aSeed) + s;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = px * 2.6 * uScale * clamp(14.0 / max(d, 1.0), 0.55, 1.5);
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vC; varying float vA, vMode, vRot;
      void main(){
        vec2 q = gl_PointCoord - 0.5;
        float a;
        if (vMode > 2.5 && vMode < 3.5) {                   // a petal: a soft turning oval
          float cs = cos(vRot), sn = sin(vRot);
          vec2 r = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y) * vec2(2.0, 3.6);
          a = smoothstep(0.5, 0.3, length(r)) * 0.55;
        } else {                                            // a sharp core with a small halo
          float d = length(q) * 2.0;
          a = smoothstep(0.32, 0.0, d) + pow(max(0.0, 1.0 - d), 3.0) * 0.3;
        }
        if (a * vA < 0.01) discard;
        gl_FragColor = vec4(vC * a * vA, 1.0);
      }`,
  });
  mat.blending = THREE.CustomBlending; mat.blendSrc = THREE.OneFactor; mat.blendDst = THREE.OneFactor;
  const pts = new THREE.Points(g, mat);
  pts.frustumCulled = false;
  return pts;
}

// ---- ribbons of light: one instanced strip, each instance one ribbon ---------------------
const SEG = 48;
function ribbonMesh(n) {
  const g = new THREE.InstancedBufferGeometry();
  const aS = new Float32Array((SEG + 1) * 2), aSide = new Float32Array((SEG + 1) * 2), idx = [];
  for (let i = 0; i <= SEG; i++) {
    aS[i * 2] = aS[i * 2 + 1] = i / SEG; aSide[i * 2] = -1; aSide[i * 2 + 1] = 1;
    if (i < SEG) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
  }
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEG + 1) * 2 * 3), 3));
  g.setAttribute('aS', new THREE.BufferAttribute(aS, 1));
  g.setAttribute('aSide', new THREE.BufferAttribute(aSide, 1));
  g.setIndex(idx);
  const inst = (k) => new THREE.InstancedBufferAttribute(new Float32Array(n * k), k).setUsage(THREE.DynamicDrawUsage);
  const A = { aKind: inst(1), aSeed: inst(1), aC: inst(3), aP: inst(4), aD: inst(3), aColA: inst(3), aColB: inst(3), aT: inst(3) };
  for (const [k, v] of Object.entries(A)) g.setAttribute(k, v);
  g.instanceCount = n;
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    uniforms: { uTime: { value: 0 }, uHush: { value: 0 } },
    vertexShader: /* glsl */`
      uniform float uTime, uHush;
      attribute float aS, aSide, aKind, aSeed; attribute vec3 aC, aD, aColA, aColB, aT; attribute vec4 aP;
      varying vec3 vC; varying float vA, vS, vSide;
      // aP: radius, height, speed, length; aT: born, life, width
      vec3 path(float s, out float ok){
        float age = uTime - aT.x, f = age * aP.z, R = aP.x, H = aP.y, L = aP.w, k = aSeed * 6.2832;
        ok = 1.0;
        if (aKind < 0.5) {                                  // swift: darting S-curves and loops
          float q = f - s * L;
          return aC + vec3(R * sin(q * 1.3 + k) + 0.45 * R * sin(q * 3.1 + k * 2.0), H * 0.5 * sin(q * 0.9 + k * 3.0), R * cos(q * 1.1 + k * 4.0) + 0.45 * R * cos(q * 2.3 + k));
        } else if (aKind < 1.5) {                           // spiral: a helix climbing round an axis
          float y = fract(f * 0.05 + aSeed) - s * L;
          ok = step(0.0, y) * smoothstep(1.0, 0.85, y);
          y = max(y, 0.0);
          float a = y * 6.0 * 6.2832 + k;
          return aC + vec3(cos(a) * R * (1.0 - 0.55 * y), y * H, sin(a) * R * (1.0 - 0.55 * y));
        } else if (aKind < 2.5) {                           // drift: a lazy sine flow along the wind
          float q = f - s * L, m = mod(q, 2.0 * R) - R;
          ok = smoothstep(R, R * 0.8, abs(m));
          vec3 side = normalize(vec3(-aD.z, 0.0, aD.x));
          return aC + aD * m + side * sin(q * 0.05 + k) * 8.0 + vec3(0.0, H + sin(q * 0.031 + k) * 4.0, 0.0);
        } else if (aKind < 3.5) {                           // orbit: round a moving friend
          float a = f - s * L;
          return aC + vec3(cos(a) * R, sin(a * 2.0 + k) * 0.35 + sin(age * 0.7) * 0.25, sin(a) * R);
        } else if (aKind < 4.5) {                           // trail: streaming behind a ride
          vec3 side = normalize(cross(aD, vec3(0.0, 1.0, 0.0)) + vec3(1e-4));
          return aC - aD * s * L + side * sin(s * 7.0 - age * 5.0 + k) * R * s + vec3(0.0, sin(s * 5.0 - age * 3.0) * R * 0.5 * s, 0.0);
        }
        float q = f - s * L;                                // meteor: a straight bright streak
        return aC + aD * q;
      }
      void main(){
        float ok, ok2;
        vec3 p = path(aS, ok);
        vec3 p2 = path(aS + 0.01, ok2);
        vec3 tg = normalize(p - p2 + vec3(0.0, 1e-4, 0.0));
        vec3 side = normalize(cross(tg, normalize(cameraPosition - p)));
        float w = aT.z * pow(1.0 - aS, 0.8) * smoothstep(0.0, 0.06, aS);
        p.y -= uHush * aS * aS * 6.0;
        p += side * aSide * w;
        float age = uTime - aT.x;
        float life = aT.y > 0.0 ? smoothstep(0.0, 1.2, age) * smoothstep(aT.y, aT.y - 1.5, age) : smoothstep(0.0, 2.0, age);
        float dist = length(cameraPosition - p);
        vA = ok * life * smoothstep(aKind > 4.5 ? 9000.0 : 2200.0, aKind > 4.5 ? 6000.0 : 1300.0, dist) * (1.0 - 0.75 * uHush);
        vec3 c = mix(aColA, aColB, aS);
        c *= 0.85 + 0.35 * sin(aS * 26.0 - uTime * 4.0 + aSeed * 30.0);
        vC = mix(c, vec3(0.62), uHush * 0.8);
        vS = aS; vSide = aSide;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vC; varying float vA, vS, vSide;
      void main(){
        // a bright core line with soft glowing edges
        float e = abs(vSide);
        float a = vA * (1.0 - vS) * (1.0 - vS * 0.4) * (pow(1.0 - e, 3.0) * 0.8 + smoothstep(0.35, 0.0, e) * 0.9);
        if (a < 0.004) discard;
        gl_FragColor = vec4(mix(vC, vec3(1.0), smoothstep(0.3, 0.0, e) * 0.35) * a * 1.3, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;
  return { mesh, A };
}

// ---- footstep light rings: a pool of flat quads -----------------------------------------
function stepRings(n) {
  const g = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(3.2, 3.2).rotateX(-Math.PI / 2));
  const born = new THREE.InstancedBufferAttribute(new Float32Array(n).fill(-99), 1).setUsage(THREE.DynamicDrawUsage);
  const at = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage);
  g.setAttribute('aBorn', born); g.setAttribute('aAt', at); g.instanceCount = n;
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    polygonOffset: true, polygonOffsetFactor: -4,
    uniforms: { uTime: { value: 0 }, uNight: MOOD.night },
    vertexShader: /* glsl */`
      uniform float uTime; attribute float aBorn; attribute vec3 aAt; varying vec2 vUv; varying float vK;
      void main(){ vUv = uv; vK = (uTime - aBorn) / 2.0; gl_Position = projectionMatrix * viewMatrix * vec4(position + aAt, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform float uNight; varying vec2 vUv; varying float vK;
      void main(){
        if (vK < 0.0 || vK > 1.0) discard;
        float d = length(vUv - 0.5) * 2.0, r = 0.12 + 0.82 * sqrt(vK);
        float band = smoothstep(0.1, 0.0, abs(d - r)) + smoothstep(r, 0.0, d) * 0.12;
        vec3 c = mix(vec3(0.42, 0.95, 1.0), vec3(0.72, 0.55, 1.0), d);
        gl_FragColor = vec4(c * band * (1.0 - vK) * uNight * 0.9, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;
  return { mesh, born, at, next: 0, n };
}

// ---- the restoration wave: a ring of colour spreading from a freed place -----------------
function waveMesh() {
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    uniforms: { uK: { value: 1 } },
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: /* glsl */`
      uniform float uK; varying vec2 vP;
      void main(){
        float d = length(vP), r = 600.0 * (1.0 - pow(1.0 - uK, 2.0));
        float band = smoothstep(26.0, 0.0, abs(d - r)) + smoothstep(r, 0.0, d) * 0.06;
        float a = atan(vP.y, vP.x);
        vec3 c = 0.5 + 0.5 * cos(6.2832 * (vec3(0.0, 0.33, 0.67) + a / 6.2832 + uK));
        c = mix(c, vec3(1.0, 0.85, 0.5), 0.45);
        gl_FragColor = vec4(c * band * (1.0 - uK) * 0.8, 1.0);
      }`,
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1300, 1300).rotateX(-Math.PI / 2), mat);
  m.visible = false; m.frustumCulled = false;
  return m;
}

export function createMagic(scene, preset) {
  const tier = preset.trees >= 200 ? 'high' : preset.trees >= 120 ? 'medium' : 'low';
  const BUDGET = { low: 24, medium: 64, high: 140 }[tier];
  const air = sparkles({ low: 1500, medium: 4000, high: 9000 }[tier]);
  const rib = ribbonMesh(BUDGET);
  const rings = stepRings(64);
  const wave = waveMesh();
  scene.add(air, rib.mesh, rings.mesh, wave);
  const r = rng(91);

  // ---- ribbon slots ----
  const slots = Array.from({ length: BUDGET }, () => null);
  function write(i, sl) {
    const A = rib.A;
    if (!sl) { A.aT.setXYZ(i, 0, 0, 0); A.aT.needsUpdate = true; return; }
    A.aKind.setX(i, KIND[sl.kind]); A.aSeed.setX(i, sl.seed);
    A.aC.setXYZ(i, sl.c.x, sl.c.y, sl.c.z); A.aD.setXYZ(i, sl.d.x, sl.d.y, sl.d.z);
    A.aP.setXYZW(i, ...sl.p);
    A.aColA.setXYZ(i, sl.a.r, sl.a.g, sl.a.b); A.aColB.setXYZ(i, sl.b.r, sl.b.g, sl.b.b);
    A.aT.setXYZ(i, sl.t0, sl.life, sl.w);
    for (const v of Object.values(A)) v.needsUpdate = true;
  }
  const pair = (k) => { const [a, b] = PAIRS[k % PAIRS.length]; return [COL[a], COL[b]]; };
  const ground = (x, z) => Math.max(crescentH(x, z), 0);

  let time = 0, plan = 0, hush = 0, finaleOn = false, meteorAcc = 0;
  const events = [];                  // short-lived ribbons: restoration spirals and meteors
  const want = new Map();             // key -> ribbon spec, rebuilt twice a second
  const walkers = new Map();

  function spec(key, kind, o) {
    const [a, b] = o.cols || pair(o.k ?? key.length);
    return { key, kind, seed: o.seed ?? r(), c: o.c.clone(), d: (o.d || new THREE.Vector3(1, 0, 0)).clone(), p: o.p, a, b, t0: o.t0 ?? time, life: o.life || 0, w: o.w, pri: o.pri };
  }

  function replan(cam, ctx) {
    want.clear();
    // the Mew always has its pale gold ribbon, and every pet a small one
    if (ctx.mew) want.set('mew', spec('mew', 'orbit', { c: ctx.mew, p: [1.6, 0, 1.4, 2.6], w: 0.09, cols: [COL.pearl, COL.gold], pri: 100 }));
    (ctx.pets || []).slice(0, tier === 'low' ? 1 : 6).forEach((p, i) => want.set('pet' + i, spec('pet' + i, 'orbit', { c: p, p: [0.9, 0, 2.0, 2.2], w: 0.05, k: i + 2, pri: 60 - i })));
    if (ctx.trail) want.set('trail', spec('trail', 'trail', { c: ctx.trail.pos, d: ctx.trail.dir, p: [1.6, 0, 1, 60], w: 1.4, cols: [COL.cyan, COL.rose], pri: 90 }));
    // spirals round the palace spires and the light pillars of the places nearby
    SPIRES.forEach(([x, z, top], i) => {
      const c = new THREE.Vector3(x * S, PAL.y, z * S), d = c.distanceTo(cam);
      if (d > 5000 && !finaleOn) return;
      const n = finaleOn ? 2 : 1;
      for (let j = 0; j < n; j++) want.set(`sp${i}.${j}${finaleOn ? 'f' : ''}`, spec(`sp${i}.${j}${finaleOn ? 'f' : ''}`, 'spiral', { c, seed: (i * 0.37 + j * 0.5) % 1, p: [10 + (i % 3) * 4, top * S - PAL.y, 1 + j * 0.3, 0.16], w: finaleOn ? 3 : 2, k: i + j, pri: (finaleOn ? 80 : 40) - d / 500 }));
    });
    for (const pl of ctx.places || []) {
      const d = pl.at.distanceTo(cam);
      if (d > 1500) continue;
      const key = 'pl' + pl.id + (pl.freed ? 'f' : '');
      want.set(key, spec(key, 'spiral', { c: pl.at, seed: (pl.id.charCodeAt(2) * 0.13) % 1, p: [7, 260, 1.2, 0.18], w: 1.2, cols: pl.freed ? [COL.gold, COL.rose] : [COL.cyan, COL.lilac], pri: 50 - d / 100 }));
    }
    // swift streaks and lazy drifts round the viewer, renewed when they end
    const nSwift = tier === 'low' ? 3 : tier === 'medium' ? 6 : 10, nDrift = tier === 'low' ? 2 : 4;
    for (let i = 0; i < nSwift; i++) {
      const key = 'sw' + i, old = slots.find((s) => s && s.key === key);
      if (old && time - old.t0 < old.life && old.c.distanceTo(cam) < 260) { want.set(key, old); continue; }
      const a = r() * Math.PI * 2, rr = 40 + r() * 90, x = cam.x + Math.cos(a) * rr, z = cam.z + Math.sin(a) * rr;
      want.set(key, spec(key, 'swift', { c: new THREE.Vector3(x, Math.max(ground(x, z), cam.y - 30) + 8 + r() * 22, z), p: [18 + r() * 30, 10 + r() * 14, 0.5 + r() * 0.5, 0.6], w: 0.6 + r() * 0.5, life: 8 + r() * 6, k: i, pri: 30 }));
    }
    for (let i = 0; i < nDrift; i++) {
      const key = 'dr' + i, old = slots.find((s) => s && s.key === key);
      if (old && time - old.t0 < old.life && old.c.distanceTo(cam) < 400) { want.set(key, old); continue; }
      const a = r() * Math.PI * 2, rr = 30 + r() * 120, x = cam.x + Math.cos(a) * rr, z = cam.z + Math.sin(a) * rr;
      const wd = new THREE.Vector3(0.8 + (r() - 0.5) * 0.4, 0, 0.3 + (r() - 0.5) * 0.4).normalize();
      want.set(key, spec(key, 'drift', { c: new THREE.Vector3(x, ground(x, z), z), d: wd, p: [140, 9 + r() * 16, 6 + r() * 6, 90], w: 0.8 + r() * 0.6, life: 22, k: i + 3, pri: 25 }));
    }
    for (const e of events) want.set(e.key, e);
    // keep what is still wanted, free the rest, then fill by priority
    const keep = new Set();
    slots.forEach((s, i) => {
      const w = s && want.get(s.key);
      // anchored ribbons (spirals, orbits, trails) live on; a renewed swift or drift takes a fresh slot
      if (w && (w === s || (w.kind === s.kind && !w.life))) keep.add(s.key);
      else if (s) { slots[i] = null; write(i, null); }
    });
    const todo = [...want.values()].filter((w) => !keep.has(w.key)).sort((x, y) => y.pri - x.pri);
    for (let i = 0; i < slots.length && todo.length; i++) if (!slots[i]) { slots[i] = todo.shift(); write(i, slots[i]); }
  }

  return {
    get debug() { return { slots: slots.filter(Boolean).map((s) => [s.key, s.kind, s.t0, s.life, s.c.toArray().map(Math.round)]), t: time, aT: [...rib.A.aT.array.slice(0, 9)] }; },
    // a place's head is freed: the ring of colour, and spirals climbing towards the lantern
    restore(at) {
      wave.position.copy(at).y += 4; wave.visible = true; wave.material.uniforms.uK.value = 0;
      for (let i = 0; i < 6; i++) events.push(spec(`rs${time}.${i}`, 'spiral', { c: at, seed: i / 6, p: [6 + i * 2, 420, 4 + i * 0.4, 0.22], w: 2.2, k: i, life: 10, pri: 120 }));
      plan = 0;
    },
    set hush(v) { hush = v; },
    set finale(v) { finaleOn = v; },
    update(t, dt, cam, ctx = {}) {
      time = t;
      const night = MOOD.night.value;
      air.material.uniforms.uTime.value = t;
      air.material.uniforms.uCenter.value.copy(cam);
      air.material.uniforms.uScale.value = ctx.pixelRatio || 1;
      rib.mesh.material.uniforms.uTime.value = t;
      rings.mesh.material.uniforms.uTime.value = t;
      const hu = air.material.uniforms.uHush;
      hu.value += (hush - hu.value) * Math.min(1, dt * 0.5);
      rib.mesh.material.uniforms.uHush.value = hu.value;

      // the moving ribbons follow their friends every frame
      slots.forEach((s, i) => {
        if (!s) return;
        const p = s.key === 'mew' ? ctx.mew : s.key.startsWith('pet') ? ctx.pets?.[+s.key.slice(3)] : s.key === 'trail' ? ctx.trail?.pos : null;
        if (!p) return;
        rib.A.aC.setXYZ(i, p.x, p.y, p.z); rib.A.aC.needsUpdate = true;
        if (s.key === 'trail') { const d = ctx.trail.dir; rib.A.aD.setXYZ(i, d.x, d.y, d.z); rib.A.aD.needsUpdate = true; }
      });
      // the finale's meteor shower
      if (finaleOn && (meteorAcc -= dt) <= 0) {
        meteorAcc = 0.35 + r() * 0.6;
        const a = r() * Math.PI * 2, d = new THREE.Vector3(Math.cos(a), -0.35 - r() * 0.3, Math.sin(a)).normalize();
        plan = 0;
        events.push(spec('mt' + t, 'meteor', { c: new THREE.Vector3(cam.x + (r() - 0.5) * 3000, cam.y + 900 + r() * 700, cam.z + (r() - 0.5) * 3000), d, p: [0, 0, 260 + r() * 200, 140], w: 5, cols: [COL.pearl, COL.cyan], life: 3.2, pri: 70 }));
      }
      for (let i = events.length - 1; i >= 0; i--) if (t - events[i].t0 > events[i].life) events.splice(i, 1);
      if ((plan -= dt) <= 0) { plan = 0.5; replan(cam, ctx); }

      // the land sets the mood of the air: glowwood spores, blossom petals, meadow seeds, night fireflies
      {
        const rgb = crescentRGB(cam.x, cam.z) || [0.2, 0.4, 0.6];
        const [cr, cg, cb] = rgb, mx = Math.max(cr, cg, cb), mn = Math.min(cr, cg, cb);
        const sat = mx > 0 ? (mx - mn) / mx : 0;
        const glowwood = THREE.MathUtils.clamp((cb - cr) * 3 + (cg + cb - 2 * cr) * 1.2, 0, 1) * (sat > 0.25 ? 1 : 0.3);
        const blossom = THREE.MathUtils.clamp((cr - cg) * 3 + (cb - cg) * 1.5, 0, 1) + (Math.hypot(cam.x, cam.z) < 2600 ? 0.5 : 0);
        const meadow = THREE.MathUtils.clamp((cg - cr) * 3 + (cg - cb) * 2, 0, 1);
        const lowAlt = THREE.MathUtils.clamp(1 - (cam.y - ground(cam.x, cam.z)) / 60, 0, 1);
        const W0 = air.material.uniforms.uW0.value, W1 = air.material.uniforms.uW1.value;
        const k = Math.min(1, dt * 0.6);
        W0.lerp({ x: 0.22 + 0.15 * night, y: night * lowAlt * (0.5 + 0.5 * meadow), z: Math.min(0.9, glowwood * 0.8 + night * 0.25) }, k);
        W1.lerp({ x: Math.min(0.75, blossom * 0.6) * (1 - night * 0.5), y: meadow * (1 - night) * 0.55 * lowAlt, z: night * 0.55 + (1 - lowAlt) * 0.2 }, k);
      }

      // footstep light at night
      if (night > 0.15) for (const [id, p] of ctx.walkers || []) {
        let w = walkers.get(id);
        if (!w) { w = p.clone(); walkers.set(id, w); }
        if (w.distanceToSquared(p) > 1.2 * 1.2) {
          w.copy(p);
          const i = rings.next; rings.next = (i + 1) % rings.n;
          rings.born.setX(i, t); rings.at.setXYZ(i, p.x, p.y + 0.06, p.z);
          rings.born.needsUpdate = rings.at.needsUpdate = true;
        }
      }
      if (wave.visible) { const u = wave.material.uniforms.uK; u.value += dt / 5; if (u.value >= 1) wave.visible = false; }
    },
  };
}
