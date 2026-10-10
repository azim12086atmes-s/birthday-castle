// The monumental axis of the main island, laid out after the owner's Atlantis
// references (U398–U400): three marble terraces with grand stairs carrying
// the castle, a long lake crossed by a long arched bridge, a white town with
// roof gardens on both shores, and giant trees lining the whole approach.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { glowBasic, additive, nightGrade } from './materials.js';
import { arcadeTexture, flagstoneTexture, glowTexture, stoneTexture, leafTexture, rng } from './textures.js';
import { TERRACES, TERRACE_REAR, STAIR, LAKE, BRIDGE, TOWN, SPAWN, PORTALS, addCollider, groundAt } from './layout.js';
import { MOOD } from './sky.js';
import { giantTrees } from './nature.js';

const MARBLE = '#f6e4ee';

function box(w, h, d, x, y, z) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}

// --- terraces and grand stairs ---------------------------------------------
function terraces(group) {
  const bodies = [], tops = [], fronts = [], gold = [], rails = [], posts = [];
  let prev = 0;
  for (const T of TERRACES) {
    const depth = T.front - TERRACE_REAR, cz = (T.front + TERRACE_REAR) / 2;
    bodies.push(box(T.hw * 2, T.y, depth, 0, T.y / 2, cz));
    // paved top slightly above the body so it can carry its own texture
    const top = new THREE.PlaneGeometry(T.hw * 2, depth); top.rotateX(-Math.PI / 2); top.translate(0, T.y + 0.02, cz);
    tops.push(top);
    // arcade on the front and both sides
    const fh = T.y - prev;
    const f = new THREE.PlaneGeometry(T.hw * 2, fh); f.translate(0, prev + fh / 2, T.front + 0.03);
    fronts.push(f);
    for (const s of [-1, 1]) {
      const side = new THREE.PlaneGeometry(depth, T.y); side.rotateY(s * Math.PI / 2); side.translate(s * (T.hw + 0.03), T.y / 2, cz);
      fronts.push(side);
    }
    // gold cornice and a balustrade along the front edge, open at the stairs
    gold.push(box(T.hw * 2 + 0.6, 0.35, 0.6, 0, T.y + 0.1, T.front + 0.1));
    for (const s of [-1, 1]) {
      const len = T.hw - STAIR.hw - 1, mx = s * (STAIR.hw + 1 + len / 2);
      rails.push(box(len, 0.18, 0.4, mx, T.y + 1.05, T.front - 0.3));
      rails.push(box(len, 0.25, 0.5, mx, T.y + 0.2, T.front - 0.3));
      for (let x = STAIR.hw + 1.4; x < T.hw - 0.4; x += 0.9) posts.push([s * x, T.y + 0.6, T.front - 0.3]);
      gold.push(box(0.7, 1.6, 0.7, s * (STAIR.hw + 0.9), T.y + 0.8, T.front - 0.3));
    }
    // the flight of steps in front of this terrace
    const steps = 12, rise = (T.y - prev) / steps, run = STAIR.run / steps;
    for (let i = 0; i < steps; i++) {
      const top = prev + rise * (i + 1);
      bodies.push(box(STAIR.hw * 2, top, run, 0, top / 2, T.front + STAIR.run - run * (i + 0.5)));
    }
    // stair cheeks with gold caps
    for (const s of [-1, 1]) {
      const cheek = new THREE.BoxGeometry(1, 1, STAIR.run);
      const p = cheek.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const zz = p.getZ(i), yy = p.getY(i);
        const h = prev + (T.y - prev) * (0.5 - zz / STAIR.run) + 1;      // follows the slope
        p.setY(i, yy > 0 ? h : 0);
      }
      cheek.computeVertexNormals();
      cheek.translate(s * (STAIR.hw + 0.5), 0, T.front + STAIR.run / 2);
      bodies.push(cheek);
    }
    // colliders: the terrace walls, open where the stairs climb
    for (const s of [-1, 1]) {
      const x0 = s < 0 ? -T.hw : STAIR.hw, x1 = s < 0 ? -STAIR.hw : T.hw;
      addCollider({ minX: x0, maxX: x1, minZ: TERRACE_REAR, maxZ: T.front, y0: prev, y1: T.y - 0.3 });
    }
    prev = T.y;
  }
  const stone = stoneTexture().clone(); stone.needsUpdate = true; stone.repeat.set(2, 2);
  const marble = nightGrade(new THREE.MeshLambertMaterial({ color: MARBLE, map: stone, emissive: '#3e2250', emissiveIntensity: 0.4 }), 'marble');
  const B = new THREE.Mesh(mergeGeometries(bodies.map((g) => (g.index ? g.toNonIndexed() : g))), marble);
  B.castShadow = B.receiveShadow = true;
  const pave = flagstoneTexture().clone(); pave.needsUpdate = true; pave.repeat.set(12, 12);
  const P = new THREE.Mesh(mergeGeometries(tops), new THREE.MeshLambertMaterial({ map: pave, emissive: '#2a2050', emissiveIntensity: 0.35 }));
  P.receiveShadow = true;
  const arc = arcadeTexture().clone(); arc.needsUpdate = true; arc.repeat.set(10, 1);
  const F = new THREE.Mesh(mergeGeometries(fronts), new THREE.MeshLambertMaterial({ map: arc, emissive: '#3e2250', emissiveIntensity: 0.4 }));
  const G = new THREE.Mesh(mergeGeometries(gold.map((g) => g.toNonIndexed())), new THREE.MeshLambertMaterial({ color: '#e0b040', emissive: '#6a4a10', emissiveIntensity: 0.8 }));
  const R = new THREE.Mesh(mergeGeometries(rails), marble);
  const postGeo = new THREE.CylinderGeometry(0.11, 0.16, 0.9, 6);
  const postMesh = new THREE.InstancedMesh(postGeo, marble, posts.length);
  const d = new THREE.Object3D();
  posts.forEach(([x, y, z], i) => { d.position.set(x, y, z); d.updateMatrix(); postMesh.setMatrixAt(i, d.matrix); });
  group.add(B, P, F, G, R, postMesh);
}

// --- the long lake ------------------------------------------------------------
function lake(group) {
  const W = LAKE.hw * 2, L = LAKE.z1 - LAKE.z0, cz = (LAKE.z0 + LAKE.z1) / 2;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uNight: MOOD.night, uSize: { value: new THREE.Vector2(W, L) } },
    vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: /* glsl */`
      uniform float uTime; uniform float uNight; uniform vec2 uSize; varying vec2 vUv; varying vec3 vW;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 q = vW.xz;
        vec3 n = normalize(vec3(
          sin(q.x * .7 + uTime * 1.1) * .4 + sin(q.x * 1.9 - q.y * 1.3 + uTime * 1.7) * .2,
          7.,
          sin(q.y * .9 - uTime * .9) * .4 + sin(q.y * 2.3 + q.x * 1.1 + uTime * 1.4) * .2));
        vec3 v = normalize(vW - cameraPosition);
        vec3 rd = reflect(v, n);
        float up = clamp(rd.y, 0., 1.);
        vec3 duskSky = mix(vec3(.66, .44, .62), vec3(.30, .26, .58), pow(up, .6));
        vec3 nightSky = mix(vec3(.34, .24, .56), vec3(.10, .08, .26), pow(up, .6));
        vec3 sky = mix(duskSky, nightSky, uNight);
        vec3 deep = mix(vec3(.18, .20, .44), vec3(.08, .09, .28), uNight);
        float fres = .4 + .5 * pow(1. - abs(v.y), 2.);
        vec3 c = mix(deep, sky, fres);
        // soft ripples catching the light
        float rip = sin(q.x * .35 + q.y * .22 + uTime * .6) * sin(q.y * .5 - uTime * .4);
        c += vec3(.9, .7, .9) * smoothstep(.6, 1., rip) * (.08 + .05 * uNight);
        // warm streaks: the town's and castle's lights mirrored in the water
        float wob = sin(q.y * 1.7 + uTime * 1.3) * .8;
        float column = exp(-pow(q.x + wob, 2.) / 90.);                            // the castle's pink glow
        float shores = exp(-pow(abs(q.x) - ${(LAKE.hw - 2).toFixed(1)} + wob, 2.) / 6.); // the towns' window lights
        float shimmer = .6 + .4 * sin(q.y * 3.1 - uTime * 2.2 + q.x * .4);
        c += vec3(1., .55, .8) * column * shimmer * (.08 + .3 * uNight);
        c += vec3(1., .78, .45) * shores * shimmer * (.05 + .25 * uNight);
        vec2 g = floor(q * 1.6), f = fract(q * 1.6) - .5;
        float s = step(.996, h(g)) * smoothstep(.25, 0., length(f)) * (.5 + .5 * sin(uTime * 3. + h(g + 1.) * 40.));
        c += vec3(1., .9, .75) * s * (.3 + .7 * uNight);
        // bright glowing edge along the marble kerb
        vec2 e = min(vUv, 1. - vUv) * uSize;
        c += vec3(.45, .9, 1.) * smoothstep(1.2, 0., min(e.x, e.y)) * (.25 + .4 * uNight);
        // colours above are picked as on-screen colours: convert so every quality level shows the same
        gl_FragColor = vec4(pow(c, vec3(2.2)), 1.);
        #include <colorspace_fragment>
      }
    `,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(W, L), mat);
  water.rotation.x = -Math.PI / 2; water.position.set(0, -0.25, cz);
  group.add(water);
  // marble kerb round the lake
  const k = [box(W + 2, 0.5, 1, 0, 0.0, LAKE.z0 - 0.5), box(W + 2, 0.5, 1, 0, 0.0, LAKE.z1 + 0.5), box(1, 0.5, L, -LAKE.hw - 0.5, 0.0, cz), box(1, 0.5, L, LAKE.hw + 0.5, 0.0, cz)];
  group.add(new THREE.Mesh(mergeGeometries(k), new THREE.MeshLambertMaterial({ color: MARBLE, emissive: '#3e2250', emissiveIntensity: 0.4 })));
  return mat;
}

// --- the long bridge -------------------------------------------------------
function bridge(group) {
  const { hw, z0, z1, y, ramp } = BRIDGE;
  const parts = [], gold = [], lamps = [], deck = [];
  const span = 8, deckT = 0.7;
  // deck: flat middle and two ramps
  const mid0 = z0 + ramp, mid1 = z1 - ramp;
  deck.push(box(hw * 2, deckT, mid1 - mid0, 0, y - deckT / 2, (mid0 + mid1) / 2));
  for (const [a, b] of [[z0, mid0], [z1, mid1]]) {
    const len = Math.hypot(b - a, y), g = new THREE.BoxGeometry(hw * 2, deckT, len);
    g.rotateX((b > a ? -1 : 1) * Math.atan2(y, Math.abs(b - a)));
    g.translate(0, y / 2 - deckT / 2, (a + b) / 2);
    deck.push(g);
  }
  // arched spans under the flat part, with piers
  for (let z = LAKE.z0; z < LAKE.z1 - 0.1; z += span) {
    const sh = new THREE.Shape();
    const top = y - deckT, bot = -1.2;
    sh.moveTo(-span / 2, bot); sh.lineTo(span / 2, bot); sh.lineTo(span / 2, top); sh.lineTo(-span / 2, top); sh.lineTo(-span / 2, bot);
    const hole = new THREE.Path();
    const ar = span / 2 - 0.8, cy = top - 0.35 - ar;
    hole.moveTo(-ar, bot); hole.lineTo(-ar, cy); hole.absarc(0, cy, ar, Math.PI, 0, true); hole.lineTo(ar, bot); hole.lineTo(-ar, bot);
    sh.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(sh, { depth: hw * 2, bevelEnabled: false, curveSegments: 10 });
    g.translate(0, 0, -hw);
    g.rotateY(Math.PI / 2);
    g.translate(0, 0, z + span / 2);
    parts.push(g);
  }
  // parapets, gold coping, lamp posts every 8 m
  for (const s of [-1, 1]) {
    parts.push(box(0.5, 1.0, mid1 - mid0, s * (hw - 0.25), y + 0.5, (mid0 + mid1) / 2));
    gold.push(box(0.62, 0.14, mid1 - mid0, s * (hw - 0.25), y + 1.05, (mid0 + mid1) / 2));
    for (let z = mid0; z <= mid1 + 0.1; z += span) lamps.push([s * (hw - 0.25), z]);
    addCollider({ minX: s < 0 ? -hw - 0.4 : hw - 0.5, maxX: s < 0 ? -hw + 0.5 : hw + 0.4, minZ: z0, maxZ: z1, y0: -2, y1: 6 });
  }
  const marble = nightGrade(new THREE.MeshLambertMaterial({ color: MARBLE, map: arcadeTexture(), emissive: '#3e2250', emissiveIntensity: 0.4 }), 'bridge');
  const M = new THREE.Mesh(mergeGeometries(parts.map((g) => (g.index ? g.toNonIndexed() : g)).map((g) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); return g; })), marble);
  M.castShadow = M.receiveShadow = true;
  // paving on the deck, mapped from above so the stones stay square
  const D = mergeGeometries(deck.map((g) => g.toNonIndexed()));
  const P = D.attributes.position, U = D.attributes.uv;
  for (let i = 0; i < P.count; i++) U.setXY(i, P.getX(i) / 7, P.getZ(i) / 7);
  const flag = flagstoneTexture().clone(); flag.needsUpdate = true;
  const DM = new THREE.Mesh(D, nightGrade(new THREE.MeshLambertMaterial({ color: '#e9d6e2', map: flag, emissive: '#3e2250', emissiveIntensity: 0.4 }), 'bridge-deck'));
  DM.receiveShadow = true;
  group.add(DM);
  group.add(M, new THREE.Mesh(mergeGeometries(gold), new THREE.MeshLambertMaterial({ color: '#e0b040', emissive: '#6a4a10', emissiveIntensity: 0.8 })));
  return lamps.map(([x, z]) => [x, y + 1.0, z]);
}

// --- the white town (Atlantis): flat-roofed houses with roof gardens --------
function town(group, r) {
  const houses = [];
  const near = (x, z, d) => PORTALS.some((p) => Math.hypot(p.x - x, p.z - z) < d);
  for (const s of [-1, 1]) {
    for (let z = TOWN.z0 + 5; z < TOWN.z1; z += 11) {
      for (let x = TOWN.x0 + 4; x < TOWN.x1 - 3; x += 10.5) {
        if (r() < 0.12) continue;                       // a little square here and there
        const hx = s * (x + (r() - 0.5) * 1.5), hz = z + (r() - 0.5) * 1.5;
        if (near(hx, hz, 14) || Math.hypot(hx, hz) > 128) continue;
        const w = 6 + r() * 2.5, d = 6 + r() * 2.5, h = 5 + r() * 7 + (Math.abs(x - TOWN.x0) < 12 ? 0 : r() * 4);
        houses.push({ x: hx, z: hz, w, d, h, kind: r() });
      }
    }
  }
  const bodies = [], roofs = [], domes = [], gardens = [];
  for (const H of houses) {
    bodies.push(box(H.w, H.h, H.d, H.x, H.h / 2, H.z));
    roofs.push(box(H.w + 0.5, 0.35, H.d + 0.5, H.x, H.h + 0.17, H.z));
    if (H.kind < 0.22) {
      const dm = new THREE.SphereGeometry(Math.min(H.w, H.d) * 0.36, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      dm.translate(H.x, H.h + 0.3, H.z); domes.push(dm);
    } else if (H.kind < 0.65) {
      gardens.push(box(H.w - 1.2, 0.6, H.d - 1.2, H.x, H.h + 0.6, H.z));
    }
    addCollider({ minX: H.x - H.w / 2, maxX: H.x + H.w / 2, minZ: H.z - H.d / 2, maxZ: H.z + H.d / 2, y0: 0, y1: H.h });
  }
  // windows drawn from world position, so every house gets evenly sized panes
  // that glow warm after dark (only the windows are warm at night, U60)
  const wallMat = new THREE.MeshLambertMaterial({ color: '#f7ece8', emissive: '#3e2250', emissiveIntensity: 0.35 });
  wallMat.onBeforeCompile = (sh) => {
    sh.uniforms.uNight = MOOD.night;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN; uniform float uNight;')
      .replace('#include <opaque_fragment>', `
        float u = abs(vWN.x) > 0.5 ? vWP.z : vWP.x;
        vec2 cell = vec2(fract(u / 2.4), fract(vWP.y / 3.0));
        float win = step(0.3, cell.x) * step(cell.x, 0.7) * step(0.3, cell.y) * step(cell.y, 0.82) * step(1.5, vWP.y) * (1.0 - step(0.9, abs(vWN.y)));
        float lit = step(0.35, fract(sin(dot(floor(vec3(u / 2.4, vWP.y / 3.0, vWN.x + vWN.z * 3.0)), vec3(12.9, 78.2, 37.7))) * 43758.5));
        vec3 glassDay = vec3(0.45, 0.42, 0.62);
        vec3 glassNight = mix(vec3(0.15, 0.12, 0.3), vec3(1.0, 0.72, 0.42) * 1.6, lit);
        outgoingLight = mix(outgoingLight, mix(glassDay, glassNight, uNight), win);
        #include <opaque_fragment>`);
  };
  wallMat.customProgramCacheKey = () => 'town-walls';
  const Bm = new THREE.Mesh(mergeGeometries(bodies.map((g) => g.toNonIndexed())), wallMat);
  Bm.castShadow = Bm.receiveShadow = true;
  const roofMat = new THREE.MeshLambertMaterial({ color: '#eadbe4', emissive: '#3e2250', emissiveIntensity: 0.35 });
  group.add(Bm, new THREE.Mesh(mergeGeometries(roofs.map((g) => g.toNonIndexed())), roofMat));
  if (domes.length) group.add(new THREE.Mesh(mergeGeometries(domes), new THREE.MeshLambertMaterial({ color: '#b8508c', emissive: '#3a1030', emissiveIntensity: 0.6 })));
  if (gardens.length) group.add(new THREE.Mesh(mergeGeometries(gardens.map((g) => g.toNonIndexed())), nightGrade(new THREE.MeshLambertMaterial({ color: '#4f9a4a', map: leafTexture(), emissive: '#10283a', emissiveIntensity: 0.5 }), 'roofgarden')));
  // cypresses along the streets
  const cyp = [];
  for (let i = 0; i < houses.length; i++) {
    const H = houses[i];
    if (r() < 0.5) continue;
    const x = H.x + (H.w / 2 + 1.6) * (r() < 0.5 ? -1 : 1), z = H.z + (r() - 0.5) * H.d;
    const t = 6 + r() * 3;
    const c = new THREE.LatheGeometry([[0, 0], [0.8, 0.4], [1.0, 1.8], [0.9, 3.6], [0.6, 5.4], [0.25, 6.6], [0, 7]].map(([a, b]) => new THREE.Vector2(a, b * t / 7)), 8);
    c.translate(x, 0, z); cyp.push(c);
  }
  if (cyp.length) {
    const C = new THREE.Mesh(mergeGeometries(cyp), nightGrade(new THREE.MeshLambertMaterial({ color: '#2f6a44', map: leafTexture(), emissive: '#10283a', emissiveIntensity: 0.5 }), 'town-cypress'));
    C.castShadow = true; group.add(C);
  }
}

export function createAcropolis(scene, preset) {
  const group = new THREE.Group();
  const r = rng(2026);
  terraces(group);
  const lakeMat = lake(group);
  const lampSpots = bridge(group);
  town(group, r);

  // lamps on the bridge parapets and up the stairs
  for (const T of TERRACES) for (const s of [-1, 1]) lampSpots.push([s * (STAIR.hw + 0.9), T.y + 2.0, T.front - 0.3]);
  const lampGeo = new THREE.SphereGeometry(0.32, 10, 8);
  const lamps = new THREE.InstancedMesh(lampGeo, glowBasic('#ffc65c'), lampSpots.length);
  const halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(3, 3), additive('#ffb347', { map: glowTexture(), opacity: 0.5 }), lampSpots.length);
  const d = new THREE.Object3D();
  lampSpots.forEach(([x, y, z], i) => { d.position.set(x, y + 0.5, z); d.updateMatrix(); lamps.setMatrixAt(i, d.matrix); halos.setMatrixAt(i, d.matrix); });
  group.add(lamps, halos);

  // giant trees: an avenue from the meadow to the bridge, and a row along each shore
  const spots = [];
  for (let z = LAKE.z1 + 8; z <= SPAWN.z - 2; z += 9) for (const s of [-1, 1]) spots.push({ x: s * 13, z, pink: false });
  for (let z = LAKE.z0 + 4; z <= LAKE.z1 - 2; z += 10) for (const s of [-1, 1]) spots.push({ x: s * (LAKE.hw + 6), z, pink: ((z / 10) | 0) % 3 === 0 });
  for (const sp of spots) sp.y = groundAt(sp.x, sp.z) ?? 0;
  giantTrees(group, spots, preset);

  scene.add(group);
  const q = new THREE.Quaternion();
  return {
    update(t, camera) {
      lakeMat.uniforms.uTime.value = t;
      if (camera) {
        q.copy(camera.quaternion);
        lampSpots.forEach(([x, y, z], i) => { d.position.set(x, y + 0.5, z); d.quaternion.copy(q); d.updateMatrix(); halos.setMatrixAt(i, d.matrix); });
        halos.instanceMatrix.needsUpdate = true;
      }
      halos.material.opacity = 0.25 + 0.4 * MOOD.night.value;
    },
  };
}
