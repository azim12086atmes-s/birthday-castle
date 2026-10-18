// The world fill (study thread, design/world-fill): 3,138 placed models (landmarks at the
// 32 places, the arrival gate, relics, glowing flora, road lanterns, sky isles and citadels,
// far citadels on the great ridge), drawn from 264 of our Meshy models.
// Each model is one InstancedMesh, so the whole fill costs about one draw
// call per model in view. Near the player a model draws as its web copy of the layout
// GLB (about a quarter of the triangles, 1024 px texture); further out it is a picture
// card (study thread, design/world-fill/cards): a strip of 8 views round the model, of
// which the shader shows the one facing the camera on an upright billboard.
// Both load on demand as you come within range, and only instances within range draw.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { groundAt, addPad } from './layout.js';
import { crescentH } from './crescent.js';
import { clearAround } from './paths.js';
import { MOOD, FOG_COLOR } from './sky.js';
import { ATMOS_GLSL, atmosUniforms } from './look.js';
import { contactGrade } from './ground.js';

// one material per model: the card strip, its frame size and how high its centre sits
function cardMaterial(map, card) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map }, uFrame: { value: card.frame }, uLift: { value: card.base_from_centre * card.frame },
      uNight: MOOD.night, uFog: { value: FOG_COLOR }, uFogNear: { value: 900 }, uFogFar: { value: 16000 }, ...atmosUniforms(FOG_COLOR),
    },
    vertexShader: /* glsl */`
      uniform float uFrame, uLift; varying vec2 vUv; varying float vK; varying float vDist; varying vec3 vW;
      void main(){
        vec3 base = instanceMatrix[3].xyz, c0 = instanceMatrix[0].xyz;
        float s = length(c0), rot = atan(-c0.z, c0.x);
        vec3 centre = base + vec3(0.0, uLift * s, 0.0);
        vec2 d = cameraPosition.xz - centre.xz;
        float ang = atan(d.x, d.y) - rot;
        vK = mod(floor(ang / 0.7853982 + 0.5) + 16.0, 8.0);
        vec3 right = normalize(vec3(d.y, 0.0, -d.x));
        vec3 w = centre + right * position.x * uFrame * s + vec3(0.0, position.y * uFrame * s, 0.0);
        vUv = uv; vW = w;
        vec4 mv = viewMatrix * vec4(w, 1.0);
        vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform float uNight; uniform vec3 uFog; uniform float uFogNear, uFogFar;
      varying vec2 vUv; varying float vK; varying float vDist; varying vec3 vW;
      ${ATMOS_GLSL}
      void main(){
        vec4 c = texture2D(uMap, vec2((vK + clamp(vUv.x, 0.002, 0.998)) / 8.0, vUv.y));
        if (c.a < 0.5) discard;
        vec3 col = c.rgb * mix(vec3(1.0), vec3(0.36, 0.46, 0.92), uNight);
        col = atmosApply(col, vW, uFog);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}

// scattered props the owner found cluttered and low-mesh
const CLUTTER = /^(Rubble_Pile|Rock_Formation_Collec|Meadow_Rocks|Stone|Stone_town|Desert_Rock_Formation|A_big_menhir_with_anc|Ancient_Stone_Relic)$/;

// metres: the near copy within the first number, the far copy out to the second
// (owner, Oct 18: no far-off town views; let the hills and the haze cover them, as Arkenfall does)
const RANGE = { landmark: [450, 7000], building: [300, 1100], prop: [140, 350] };
const TOWN_FAR = 650;

export function createWorldFill(scene, quality) {
  const q = quality.key === 'low' ? 0.55 : quality.key === 'medium' ? 0.8 : 1;
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  // three steps of detail, as Arkenfall does: the full layout mesh (near-hd: every triangle, 2048 px
  // textures) only close up on Medium and High, the light quarter-triangle copy (near) out to the
  // model's range, then a card. Low never fetches near-hd. The cliff kit and the light town houses
  // (*_town, 14k triangles) have one copy.
  const hd = quality.key !== 'low';
  // the town houses step the other way: their own 14k-triangle mesh close up and a fifth of it
  // (near-lo, 256 px) across the rest of the town, on every tier
  const isTown = (name) => name.endsWith('_town');
  const hasHD = (name) => isTown(name) || hd && !/^(CliffWall_|Viaduct_|SeaPillar_|SkyBridge_|Gate|CloudPlatform)/.test(name);
  const dirOf = (M, kind) => kind === 'card' ? 'cards' : isTown(M.name) ? (kind === 'hd' ? 'near' : 'near-lo') : kind === 'hd' ? 'near-hd' : 'near';
  const HD_SHARE = 0.4;        // of the near range: 180 m for landmarks, 120 m for buildings, 56 m for props; 90 m for town houses
  const KEEP = 30;             // seconds a copy nobody draws stays in memory once the camera is well away
  const texLoader = new THREE.TextureLoader();
  const cardGeo = new THREE.PlaneGeometry(1, 1);
  let cards = {};
  fetch('data/world/cards/index.json').then((r) => r.json()).then((j) => { cards = j.cards; }).catch(() => {});
  const models = new Map();
  const footprints = [];
  let ready = false;

  fetch('data/world/placements.json').then((r) => r.json()).then((P) => {
    for (const [name, m] of Object.entries(P.models)) {
      if (name === 'SkyBridge_Segment') continue;      // the sky bridge is drawn by skybridge.js now (look pass)
      const [n, f] = RANGE[m.tier];
      // cards cost two triangles, so they reach further than the old far copies did
      // town houses stay 3D across a whole town (r <= 225 m) on every tier, never cards inside it
      const near = name.endsWith('_town') ? Math.max(260, n * Math.max(q, 0.7)) : n * Math.max(q, 0.7);
      models.set(name, { name, tier: m.tier, near, hdR: isTown(name) ? 90 : hasHD(name) ? near * HD_SHARE : 0, far: name.endsWith('_town') ? TOWN_FAR : f * q * 1.3, items: [], copies: { hd: null, near: null, card: null }, closest: Infinity });
    }
    for (const [m, place, x, y, z, rot, s, far] of P.items) {
      const M = models.get(m);
      if (!M) continue;
      // world pass 2b (owner, Oct 18: the low-mesh builds add nothing): the scatter in the wilds and along the
      // roads, and the rubble and rock props everywhere, are gone; places and the roadside hamlets keep their buildings
      if (place === 'wild' || place === 'road' || CLUTTER.test(m)) continue;
      if (place === 'roadside' && (P.models[m].tier === 'prop' || /Rock|Rubble|menhir|Relic/i.test(m))) continue;   // the hamlets stay
      // sit on the game's own ground: the palace terraces and district pads differ a little from the raw crescent
      // (sky isles, the great ridge's citadels and the cliff kit's viaducts and sea pillars keep their own height)
      const g = far ? -1 : groundAt(x, z, y + 5);
      const yy = g < 0 ? y : y + THREE.MathUtils.clamp(g - crescentH(x, z), -15, 60);
      const mat = new THREE.Matrix4().compose(new THREE.Vector3(x, yy, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rot), new THREE.Vector3(s, s, s));
      const dims = P.models[m].dims;
      // a sphere from the base that surely holds the model, for culling each copy outside the view
      M.items.push({ x, z, mat, place, k: far === 3 ? Infinity : far === 1 ? 3 : far ? 1.5 : 1, sphere: new THREE.Sphere(new THREE.Vector3(x, yy, z), Math.hypot(...dims) * s) });      // the cliff walls always draw their near copy
      if (M.tier !== 'prop' && place !== 'sky' && place !== 'cliffs') footprints.push({ x, z, r: 0.5 * Math.max(dims[0], dims[2]) * s });
    }
    // no tree grows through a town house or a roadside hamlet
    const clear = [];
    for (const M of models.values()) if (M.name.endsWith('_town') && M.tier !== 'prop') for (const it of M.items) clear.push({ x: it.x, z: it.z, r: 15 + 0.5 * Math.max(P.models[M.name].dims[0], P.models[M.name].dims[1]) * Math.hypot(it.mat.elements[0], it.mat.elements[1], it.mat.elements[2]) });
    for (const M of models.values()) if (!M.name.endsWith('_town')) for (const it of M.items) if (it.place === 'roadside') clear.push({ x: it.x, z: it.z, r: 15 });
    if (clear.length) clearAround(clear);
    ready = true;
  });
  // the viaducts' level decks are walkable
  fetch('data/world/viaducts.json').then((r) => r.json()).then((V) => { for (const p of V.pads) addPad({ ...p, y0: p.y - 10.5 }); }).catch(() => {});

  // ---- loading -----------------------------------------------------------------
  const queue = [];
  let loading = 0;
  function request(M, kind, dist) {
    if (M.copies[kind]) return;
    M.copies[kind] = { status: 'queued', meshes: [], dist };
    if (kind === 'card') return loadCard(M);
    queue.push([M, kind]);
  }
  function loadCard(M) {
    const C = M.copies.card, card = cards[M.name];
    if (!card) { C.status = 'failed'; M.dirty = true; return; }
    texLoader.load(`data/world/cards/${M.name}.webp`, (tex) => {
      let map = tex;
      if (quality.key !== 'high') {
        // half size on Low and Medium: 264 strips at full size would fill a small GPU
        const cv = document.createElement('canvas'); cv.width = tex.image.width / 2; cv.height = tex.image.height / 2;
        cv.getContext('2d').drawImage(tex.image, 0, 0, cv.width, cv.height);
        map = new THREE.CanvasTexture(cv); tex.dispose();
      }
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = 4;
      const im = new THREE.InstancedMesh(cardGeo, cardMaterial(map, card), M.items.length);
      im.count = 0; im.frustumCulled = false;
      scene.add(im);
      C.meshes.push(im);
      C.status = 'ready';
      M.dirty = true;
    }, undefined, () => { C.status = 'failed'; M.dirty = true; });
  }
  function pump() {
    queue.sort((a, b) => a[0].copies[a[1]].dist - b[0].copies[b[1]].dist);
    while (loading < 3 && queue.length) {
      const [M, kind] = queue.shift();
      loading++;
      loader.load(`data/world/${dirOf(M, kind)}/${M.name}.glb`, (gltf) => {
        loading--;
        const C = M.copies[kind];
        if (!C) { disposeScene(gltf.scene); return; }       // dropped while it was loading
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((o) => {
          if (!o.isMesh) return;
          const geo = o.geometry.clone();
          // quantized positions and normals (meshopt) would clamp when transformed: widen them to floats first
          for (const name of ['position', 'normal']) {
            const at = geo.attributes[name];
            if (!at || at.array instanceof Float32Array && !at.isInterleavedBufferAttribute) continue;
            const f = new Float32Array(at.count * at.itemSize);
            for (let i = 0; i < at.count; i++) for (let c = 0; c < at.itemSize; c++) f[i * at.itemSize + c] = at.getComponent(i, c);
            geo.setAttribute(name, new THREE.BufferAttribute(f, at.itemSize));
          }
          geo.applyMatrix4(o.matrixWorld);
          const mat = o.material;
          mat.metalness = 0; mat.roughness = Math.max(mat.roughness ?? 1, 0.75);
          if (!/^(SkyBridge_|Sky|Cloud)/.test(M.name)) contactGrade(mat);
          const im = new THREE.InstancedMesh(geo, mat, M.items.length);
          im.count = 0; im.frustumCulled = false;      // culled per instance in cull()
          scene.add(im);
          C.meshes.push(im);
        });
        C.status = 'ready'; C.used = performance.now() / 1000;
        M.dirty = true;
      }, undefined, () => { loading--; if (M.copies[kind]) M.copies[kind].status = 'failed'; });
    }
  }
  const disposeMat = (m) => { for (const v of Object.values(m)) if (v && v.isTexture) v.dispose(); m.dispose(); };
  function disposeScene(root) { root.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); disposeMat(o.material); } }); }
  // free a copy's GPU memory: travelling the whole crescent would otherwise keep every model it passed
  function drop(M, kind) {
    const C = M.copies[kind];
    for (const im of C.meshes) { scene.remove(im); im.geometry.dispose(); disposeMat(im.material); im.dispose(); }
    M.copies[kind] = null;
  }

  // ---- per model: which instances draw with which copy -----------------------------
  function refresh(M, cam) {
    const close = [], near = [], far = [];
    let closest = Infinity;
    for (const it of M.items) {
      const d = Math.hypot(it.x - cam.x, it.z - cam.z) / it.k;      // sky and ridge items reach three times as far
      closest = Math.min(closest, d);
      if (d < M.hdR) close.push(it); else if (d < M.near) near.push(it); else if (d < M.far) far.push(it);
    }
    M.closest = closest;
    if (close.length || closest < M.hdR * 1.5) request(M, 'hd', closest);
    // until the full mesh arrives, the close instances draw with the light copy
    if (M.copies.hd?.status !== 'ready') near.push(...close.splice(0));
    // a sky or ridge item whose card is missing draws its near copy from afar instead
    if (M.copies.card?.status === 'failed') for (let i = far.length - 1; i >= 0; i--) if (far[i].k > 1) near.push(...far.splice(i, 1));
    if (near.length || closest < M.near * 1.8) request(M, 'near', closest);     // fetch a little early, so a town is 3D on arrival
    if ((near.length || far.length) && Object.keys(cards).length) request(M, 'card', closest);
    const nearOK = M.copies.near?.status === 'ready';
    const farOK = M.copies.card?.status === 'ready';
    const put = (C, list) => {
      if (!C || C.status !== 'ready') return;
      for (const im of C.meshes) {
        list.forEach((it, i) => im.setMatrixAt(i, it.mat));
        im.count = list.length;
        im.instanceMatrix.needsUpdate = true;
        im.visible = list.length > 0;
        if (list.length && im.geometry !== cardGeo) im.computeBoundingSphere();
      }
    };
    const now = performance.now() / 1000;
    for (const k of ['hd', 'near']) if (M.copies[k]?.status === 'ready' && (k === 'hd' ? close : near).length) M.copies[k].used = now;
    // 3D copies keep their list and are culled to the view every frame (an instanced mesh is otherwise
    // drawn whole: a town's 74 cottages behind the camera cost as much as those in front)
    if (M.copies.hd) M.copies.hd.list = close;
    if (M.copies.near) M.copies.near.list = nearOK ? near : [];
    // until the near copy arrives, its instances draw as cards
    put(M.copies.card, nearOK || !farOK ? far : far.concat(near));
  }

  const frustum = new THREE.Frustum(), pv = new THREE.Matrix4();
  function cull(C) {
    const vis = C.list.filter((it) => frustum.intersectsSphere(it.sphere));
    if (C.vis && C.vis.length === vis.length && vis.every((it, i) => C.vis[i] === it)) return;
    C.vis = vis;
    for (const im of C.meshes) {
      vis.forEach((it, i) => im.setMatrixAt(i, it.mat));
      im.count = vis.length;
      im.instanceMatrix.needsUpdate = true;
      im.visible = vis.length > 0;
    }
  }

  let acc = 0, cursor = 0;
  const last = new THREE.Vector3(1e9, 0, 0);
  return {
    get ready() { return ready; },
    footprints,
    fog(near, far) {
      for (const M of models.values()) for (const im of M.copies.card?.meshes || []) { im.material.uniforms.uFogNear.value = near; im.material.uniforms.uFogFar.value = far; }
    },
    update(dt, camera) {
      if (!ready) return;
      pump();
      acc += dt;
      const moved = camera.position.distanceTo(last) > 40;
      const list = [...models.values()];
      // a few models a frame, everything again once the camera has moved far enough
      if (moved && acc > 0.25) { acc = 0; last.copy(camera.position); cursor = 0; }
      for (let k = 0; k < 12 && cursor < list.length; k++, cursor++) refresh(list[cursor], camera.position);
      for (const M of list) if (M.dirty) { M.dirty = false; refresh(M, camera.position); }
      frustum.setFromProjectionMatrix(pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
      for (const M of list) for (const k of ['hd', 'near']) if (M.copies[k]?.status === 'ready' && M.copies[k].list) cull(M.copies[k]);
      const now = performance.now() / 1000;
      for (const M of list) for (const k of ['hd', 'near']) {
        const C = M.copies[k];
        if (C?.status === 'ready' && now - (C.used ?? now) > KEEP && M.closest > (k === 'hd' ? M.hdR * 2.5 : M.near * 2.5)) drop(M, k);
      }
    },
  };
}
