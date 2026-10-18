// Grown trees for the forests (world pass 3, Oct 18): the owner's own Golden Thread trees.
// Each species is grown branch by branch from its habit (trunk, limbs, twigs, then leafy crowns
// covered with leaf cards that flutter and glow with the sun behind them), from the Golden
// Thread source bundled in gt/gt-trees.js. A few variants of each species are grown once; near
// the player they are drawn as instanced 3D trees, and further out as picture cards of the same
// trees, photographed from eight sides into a strip when the game starts, so the far forest is
// the same forest.
import * as THREE from 'three';
import { GeoBuilder, tree, HABITS, cardMaterial, blobMaterial, CARD_STRIDE, WIND_UNIFORMS, FOLIAGE_UNIFORMS } from './gt/gt-trees.js';
import { MOOD } from './sky.js';
import { ATMOS, ATMOS_GLSL, atmosUniforms } from './look.js';
import { FOG_COLOR } from './sky.js';

// species: Golden Thread kind and grown height range (m)
export const SPECIES = [
  { kind: 'oak', h: [11, 19] },        // 0 the valley woods
  { kind: 'sakura', h: [6, 9] },       // 1 cherry blossom
  { kind: 'pine', h: [15, 26] },       // 2 the slopes
  { kind: 'maple', h: [9, 14] },       // 3 red and orange crowns
  { kind: 'flame', h: [7, 11] },       // 4 flame tree
  { kind: 'wisteria', h: [7, 10] },    // 5
  { kind: 'birch', h: [11, 17] },      // 6
  { kind: 'plane', h: [13, 20] },      // 7
  { kind: 'willow', h: [8, 12] },      // 8
  { kind: 'jacaranda', h: [8, 12] },   // 9 violet
  { kind: 'ginkgo', h: [10, 15] },     // 10 gold
];
export const FERN = null;
const VARIANTS = 3;

// which tree grows here: pines take over up the slopes; the valleys are mostly oak, plane and
// birch, with blossom, wisteria, maple, jacaranda, ginkgo and willow scattered through them
const MIX = [[0, 0.3], [7, 0.13], [6, 0.12], [3, 0.09], [1, 0.09], [9, 0.06], [5, 0.06], [10, 0.05], [8, 0.05], [4, 0.05]];
export function pickSpecies(r, y) {
  if (r() < THREE.MathUtils.smoothstep(y, 120, 520) * 0.85 + 0.08) return 2;
  let x = r();
  for (const [sp, w] of MIX) { if ((x -= w) <= 0) return sp; }
  return 0;
}

let renderer = null;
export function setTreeRenderer(r) { renderer = r; }

// all the leaf cards of one grown tree as one geometry, so the tree can be instanced
function bakeCards(cards) {
  const n = cards.length / CARD_STRIDE;
  const pos = new Float32Array(n * 12), nrm = new Float32Array(n * 12), uv = new Float32Array(n * 8), col = new Float32Array(n * 12);
  const kind = new Float32Array(n * 4), sway = new Float32Array(n * 4), idx = new Uint32Array(n * 6);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), p = new THREE.Vector3(), nv = new THREE.Vector3();
  const z = new THREE.Vector3(0, 0, 1), s = new THREE.Vector3(), ax = new THREE.Vector3(1, 0, 0), v = new THREE.Vector3(), nm = new THREE.Matrix3();
  const corners = [[-0.5, 0.5], [0.5, 0.5], [-0.5, -0.5], [0.5, -0.5]], uvs = [[0, 1], [1, 1], [0, 0], [1, 0]];
  for (let i = 0; i < n; i++) {
    const o = i * CARD_STRIDE;
    p.set(cards[o], cards[o + 1], cards[o + 2]);
    nv.set(cards[o + 3], cards[o + 4], cards[o + 5]).normalize();
    q.setFromUnitVectors(z, nv).multiply(q2.setFromAxisAngle(z, cards[o + 12])).multiply(q2.setFromAxisAngle(ax, cards[o + 13]));
    m.compose(p, q, s.setScalar(cards[o + 6]));
    nm.getNormalMatrix(m);
    corners.forEach(([cx, cy], k) => {
      const j = i * 4 + k;
      v.set(cx, cy, 0).applyMatrix4(m); pos.set([v.x, v.y, v.z], j * 3);
      // normals lean outwards at the corners, so a crown shades round (as the Golden Thread cards do)
      v.set(cx * 1.4, cy * 1.4, 1).normalize().applyMatrix3(nm).normalize(); nrm.set([v.x, v.y, v.z], j * 3);
      uv.set(uvs[k], j * 2); col.set([cards[o + 7], cards[o + 8], cards[o + 9]], j * 3);
      kind[j] = cards[o + 10]; sway[j] = cards[o + 11];
    });
    idx.set([i * 4, i * 4 + 2, i * 4 + 1, i * 4 + 2, i * 4 + 3, i * 4 + 1], i * 6);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
  g.setAttribute('aSway', new THREE.BufferAttribute(sway, 1));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeBoundingSphere();
  return g;
}

let woodMat = null, leafMat = null;
function materials() {
  if (!woodMat) {
    woodMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
    leafMat = cardMaterial();
    leafMat.vertexColors = true;          // the baked cards carry their colours per vertex
  }
}

// grow one variant of a species at scale 1, base at the origin
function grow(kind, seed) {
  materials();
  let st = seed;
  const rng = () => ((st = (st * 16807) % 2147483647) / 2147483647);
  const g = new GeoBuilder();
  g.cards = [];
  tree(g, kind, 0, 0, 0, 1, rng);
  const blobs = g.buildLeaves(blobMaterial());
  const cards = g.cards.length ? bakeCards(g.cards) : null;
  const wood = g.build(woodMat);
  const parts = [];
  if (wood) parts.push([wood.geometry, woodMat]);
  if (blobs) parts.push([blobs.geometry, blobs.material]);
  if (cards) parts.push([cards, leafMat]);
  const box = new THREE.Box3();
  for (const [geo] of parts) { geo.computeBoundingBox(); box.union(geo.boundingBox); }
  return { parts, box };
}

// photograph a grown tree from eight sides into its row of the shared atlas (the far card).
// All species share one atlas and one material, so a whole tile of far trees is one draw.
const ATLAS_COLS = 2;
function photograph(t, size, rt, slot) {
  const h = t.box.max.y, w = 2 * Math.max(-t.box.min.x, t.box.max.x, -t.box.min.z, t.box.max.z);
  const F = Math.max(h, w) * 1.04, cy = 0.48 * F;
  const col = slot % ATLAS_COLS, row = Math.floor(slot / ATLAS_COLS);
  const scene = new THREE.Scene();
  for (const [geo, mat] of t.parts) { const im = new THREE.InstancedMesh(geo, mat, 1); im.setMatrixAt(0, new THREE.Matrix4()); im.frustumCulled = false; scene.add(im); }
  scene.add(new THREE.HemisphereLight('#dbe8ff', '#5a6a40', 1.5));
  const sun = new THREE.DirectionalLight('#fff1dc', 2.4);
  scene.add(sun, sun.target);
  const cam = new THREE.OrthographicCamera(-F / 2, F / 2, F / 2, -F / 2, 0.1, F * 6);
  const prevT = renderer.getRenderTarget(), prevC = renderer.getClearColor(new THREE.Color()), prevA = renderer.getClearAlpha();
  const prevSun = FOLIAGE_UNIFORMS.uSunDir.value.clone(), prevNight = FOLIAGE_UNIFORMS.uLeafNight.value;
  FOLIAGE_UNIFORMS.uLeafNight.value = 0;
  renderer.setClearColor(0x000000, 0);
  rt.scissorTest = true;
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    cam.position.set(Math.sin(a) * F * 2, cy, Math.cos(a) * F * 2);
    cam.lookAt(0, cy, 0);
    // the light from above and a little to one side of each view, as the sun usually is
    sun.position.set(Math.sin(a + 0.6) * F, F * 1.6, Math.cos(a + 0.6) * F);
    FOLIAGE_UNIFORMS.uSunDir.value.copy(sun.position).normalize();
    const x = (col * 8 + k) * size, y = row * size;
    rt.viewport.set(x, y, size, size); rt.scissor.set(x, y, size, size);
    renderer.setRenderTarget(rt);
    renderer.clear();
    renderer.render(scene, cam);
  }
  renderer.setRenderTarget(prevT);
  renderer.setClearColor(prevC, prevA);
  FOLIAGE_UNIFORMS.uSunDir.value.copy(prevSun); FOLIAGE_UNIFORMS.uLeafNight.value = prevNight;
  return { frame: F, lift: 0.48 * F, height: h, col, row };
}

function cardMaterialFar(map, rows, dip) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map }, uRows: { value: rows },
      uNear: { value: 0 }, uNight: MOOD.night, uFog: { value: FOG_COLOR }, uSun: { value: ATMOS.sun }, ...atmosUniforms(FOG_COLOR),
    },
    vertexShader: /* glsl */`
      attribute float aDy; attribute vec4 aCard;   // atlas column, atlas row, frame (m), lift (m)
      uniform float uNear; varying vec2 vUv; varying float vK; varying vec2 vCell; varying vec3 vW; varying vec3 vTint; varying float vFade; varying vec3 vD;
      void main(){
        vec3 base = instanceMatrix[3].xyz, c0 = instanceMatrix[0].xyz;
        float rot = atan(-c0.z, c0.x), uFrame = aCard.z, s = 1.0;
        ${dip}
        vec3 centre = base + vec3(0.0, aCard.w, 0.0);
        vCell = aCard.xy;
        vec2 d = cameraPosition.xz - centre.xz;
        float ang = atan(d.x, d.y) - rot;
        vK = mod(floor(ang / 0.7853982 + 0.5) + 16.0, 8.0);
        vec3 right = normalize(vec3(d.y, 0.0, -d.x));
        vec3 w = centre + right * position.x * uFrame * s + vec3(0.0, position.y * uFrame * s, 0.0);
        vUv = uv; vW = w; vD = normalize(w - cameraPosition);
        vFade = (length(d) - uNear) / 12.0;
        #ifdef USE_INSTANCING_COLOR
          vTint = instanceColor;
        #else
          vTint = vec3(1.0);
        #endif
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform float uNight, uRows; uniform vec3 uFog; uniform vec4 uSun;
      varying vec2 vUv; varying float vK; varying vec2 vCell; varying vec3 vW; varying vec3 vTint; varying float vFade; varying vec3 vD;
      ${ATMOS_GLSL}
      void main(){
        // near trees are 3D: the card dissolves into them over a few metres
        if (vFade < fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453)) discard;
        vec4 c = texture2D(uMap, vec2((vCell.x * 8.0 + vK + clamp(vUv.x, 0.01, 0.99)) / 16.0, (vCell.y + clamp(vUv.y, 0.01, 0.99)) / uRows));
        if (c.a < 0.45) discard;
        vec3 col = c.rgb / max(c.a, 0.45) * vTint;
        // the sun through the leaves, as on the near trees
        col *= 1.0 + 0.45 * pow(max(dot(vD, uSun.xyz), 0.0), 3.0) * (1.0 - uNight);
        col *= mix(vec3(1.0), vec3(0.36, 0.46, 0.92), uNight);
        gl_FragColor = vec4(atmosApply(col, vW, uFog), 1.0);
      }`,
  });
}

export function createTreeKit(scene, quality, dip) {
  const nearR = quality.key === 'low' ? 0 : quality.key === 'medium' ? 110 : 170;
  const size = quality.key === 'high' ? 192 : 128;
  const count = SPECIES.length * VARIANTS, rows = Math.ceil(count / ATLAS_COLS);
  const kit = { ready: false, count, cardGeo: new THREE.PlaneGeometry(1, 1), cards: [], farMat: null, near: [], nearR, templates: [] };
  let atlas = null;
  // which grown variant a placed tree uses
  kit.slot = (pt) => pt[5] * VARIANTS + Math.min(VARIANTS - 1, Math.floor(pt[7] * VARIANTS));
  // grow and photograph a few trees a frame, once the renderer is known
  let next = 0;
  kit.grow = () => {
    if (kit.ready || !renderer) return;
    if (!atlas) {
      atlas = new THREE.WebGLRenderTarget(size * 8 * ATLAS_COLS, size * rows, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter });
      kit.farMat = cardMaterialFar(atlas.texture, rows, dip);
    }
    const t0 = performance.now();
    while (next < count && performance.now() - t0 < 25) {
      const sp = SPECIES[Math.floor(next / VARIANTS)], v = next % VARIANTS;
      const t = grow(sp.kind, 7919 * (next + 1) + 13);
      kit.templates[next] = t;
      kit.cards[next] = photograph(t, size, atlas, next);
      if (nearR > 0) kit.near[next] = { h: t.box.max.y, meshes: t.parts.map(([geo, mat]) => {
        const im = new THREE.InstancedMesh(geo, mat, 400);
        im.count = 0; im.frustumCulled = false; im.castShadow = false; im.receiveShadow = true;
        scene.add(im);
        return im;
      }) };
      next++;
    }
    if (next >= count) {
      kit.farMat.uniforms.uNear.value = nearR;
      kit.ready = true;
    }
  };
  // wind, sun and night for the leaves, every frame
  kit.tick = (t) => {
    WIND_UNIFORMS.uWindTime.value = t;
    WIND_UNIFORMS.uWindDir.value.set(0.85, 0.53);
    FOLIAGE_UNIFORMS.uSunDir.value.set(ATMOS.sun[0], ATMOS.sun[1], ATMOS.sun[2]);
    FOLIAGE_UNIFORMS.uLeafNight.value = MOOD.night.value;
  };
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), col = new THREE.Color();
  const lists = Array.from({ length: count }, () => []);
  // pts: [x, y, z, rotY, height, species, dy, k] of the trees in built tiles near the camera
  kit.updateNear = (cam, tiles) => {
    if (!nearR) return;
    for (const l of lists) l.length = 0;
    for (const t of tiles) {
      if (!t || !t.visible) continue;
      if (Math.hypot(t.userData.cx - cam.x, t.userData.cz - cam.z) > nearR + 600) continue;
      for (const pt of t.userData.trees) if (Math.hypot(pt[0] - cam.x, pt[2] - cam.z) < nearR + 6) lists[kit.slot(pt)].push(pt);
    }
    lists.forEach((list, i) => {
      const N = kit.near[i];
      if (!N) return;
      const n = Math.min(list.length, 400);
      for (const im of N.meshes) {
        for (let k = 0; k < n; k++) {
          const [x, y, z, rot, h, , , kk] = list[k], sc = h / N.h;
          q.setFromAxisAngle(up, rot); s.setScalar(sc); p.set(x, y - 0.3, z);
          im.setMatrixAt(k, m4.compose(p, q, s));
          im.setColorAt(k, col.setRGB(1, 1, 1).offsetHSL((kk - 0.5) * 0.03, 0, (kk - 0.5) * 0.12));
        }
        im.count = n; im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
      }
    });
  };
  return kit;
}
