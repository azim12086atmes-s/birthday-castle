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
import { MOOD, FOG_COLOR } from './sky.js';

// one material per model: the card strip, its frame size and how high its centre sits
function cardMaterial(map, card) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map }, uFrame: { value: card.frame }, uLift: { value: card.base_from_centre * card.frame },
      uNight: MOOD.night, uFog: { value: FOG_COLOR }, uFogNear: { value: 900 }, uFogFar: { value: 16000 },
    },
    vertexShader: /* glsl */`
      uniform float uFrame, uLift; varying vec2 vUv; varying float vK; varying float vDist;
      void main(){
        vec3 base = instanceMatrix[3].xyz, c0 = instanceMatrix[0].xyz;
        float s = length(c0), rot = atan(-c0.z, c0.x);
        vec3 centre = base + vec3(0.0, uLift * s, 0.0);
        vec2 d = cameraPosition.xz - centre.xz;
        float ang = atan(d.x, d.y) - rot;
        vK = mod(floor(ang / 0.7853982 + 0.5) + 16.0, 8.0);
        vec3 right = normalize(vec3(d.y, 0.0, -d.x));
        vec3 w = centre + right * position.x * uFrame * s + vec3(0.0, position.y * uFrame * s, 0.0);
        vUv = uv;
        vec4 mv = viewMatrix * vec4(w, 1.0);
        vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform float uNight; uniform vec3 uFog; uniform float uFogNear, uFogFar;
      varying vec2 vUv; varying float vK; varying float vDist;
      void main(){
        vec4 c = texture2D(uMap, vec2((vK + clamp(vUv.x, 0.002, 0.998)) / 8.0, vUv.y));
        if (c.a < 0.5) discard;
        vec3 col = c.rgb * mix(vec3(1.0), vec3(0.36, 0.46, 0.92), uNight);
        col = mix(col, uFog, smoothstep(uFogNear, uFogFar, vDist));
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}

// metres: the near copy within the first number, the far copy out to the second
const RANGE = { landmark: [450, 7000], building: [300, 3500], prop: [140, 1200] };

export function createWorldFill(scene, quality) {
  const q = quality.key === 'low' ? 0.55 : quality.key === 'medium' ? 0.8 : 1;
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  // close up, medium and high draw the full layout meshes (near-hd: every triangle, 2048 px
  // textures, 1024 for props); low keeps the light quarter-triangle copies. The cliff kit has one copy.
  const hd = quality.key !== 'low';
  const dirFor = (kind, name) => (kind === 'near' && hd && !/^(CliffWall|Viaduct|SeaPillar)_/.test(name) ? 'near-hd' : kind);
  const texLoader = new THREE.TextureLoader();
  const cardGeo = new THREE.PlaneGeometry(1, 1);
  let cards = {};
  fetch('data/world/cards/index.json').then((r) => r.json()).then((j) => { cards = j.cards; }).catch(() => {});
  const models = new Map();
  const footprints = [];
  let ready = false;

  fetch('data/world/placements.json').then((r) => r.json()).then((P) => {
    for (const [name, m] of Object.entries(P.models)) {
      const [n, f] = RANGE[m.tier];
      // cards cost two triangles, so they reach further than the old far copies did
      models.set(name, { name, tier: m.tier, near: n * Math.max(q, 0.7), far: f * q * 1.3, items: [], copies: { near: null, card: null } });
    }
    for (const [m, place, x, y, z, rot, s, far] of P.items) {
      const M = models.get(m);
      if (!M) continue;
      // sit on the game's own ground: the palace terraces and district pads differ a little from the raw crescent
      // (sky isles, the great ridge's citadels and the cliff kit's viaducts and sea pillars keep their own height)
      const g = far ? -1 : groundAt(x, z, y + 5);
      const yy = g < 0 ? y : y + THREE.MathUtils.clamp(g - crescentH(x, z), -15, 60);
      const mat = new THREE.Matrix4().compose(new THREE.Vector3(x, yy, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rot), new THREE.Vector3(s, s, s));
      M.items.push({ x, z, mat, place, k: far === 3 ? Infinity : far === 1 ? 3 : far ? 1.5 : 1 });      // the cliff walls always draw their near copy (culled by bounds)
      const dims = P.models[m].dims;
      if (M.tier !== 'prop' && place !== 'sky' && place !== 'cliffs') footprints.push({ x, z, r: 0.5 * Math.max(dims[0], dims[2]) * s });
    }
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
      loader.load(`data/world/${dirFor(kind, M.name)}/${M.name}.glb`, (gltf) => {
        loading--;
        const C = M.copies[kind];
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
          const im = new THREE.InstancedMesh(geo, mat, M.items.length);
          im.count = 0; im.frustumCulled = true;
          scene.add(im);
          C.meshes.push(im);
        });
        C.status = 'ready';
        M.dirty = true;
      }, undefined, () => { loading--; M.copies[kind].status = 'failed'; });
    }
  }

  // ---- per model: which instances draw with which copy -----------------------------
  function refresh(M, cam) {
    const near = [], far = [];
    let closest = Infinity;
    for (const it of M.items) {
      const d = Math.hypot(it.x - cam.x, it.z - cam.z) / it.k;      // sky and ridge items reach three times as far
      closest = Math.min(closest, d);
      if (d < M.near) near.push(it); else if (d < M.far) far.push(it);
    }
    // a sky or ridge item whose card is missing draws its near copy from afar instead
    if (M.copies.card?.status === 'failed') for (let i = far.length - 1; i >= 0; i--) if (far[i].k > 1) near.push(...far.splice(i, 1));
    if (near.length) request(M, 'near', closest);
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
    // until the near copy arrives, its instances draw as cards
    put(M.copies.near, nearOK ? near : []);
    put(M.copies.card, nearOK || !farOK ? far : far.concat(near));
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
    },
  };
}
