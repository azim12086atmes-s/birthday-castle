// The world fill (study thread, design/world-fill): 1,521 placed models (landmarks at the
// 32 places, the arrival gate, relics and rocks across the crescent), drawn from 110 of our
// Meshy models. Each model is one InstancedMesh, so the whole fill costs about one draw
// call per model in view. Every model has two web copies made from the layout GLBs:
// near (about a quarter of the triangles, 1024 px texture) and far (about 4%, 256 px).
// Copies load on demand as you come within range, and only instances within range draw.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { groundAt } from './layout.js';
import { crescentH } from './crescent.js';

// metres: the near copy within the first number, the far copy out to the second
const RANGE = { landmark: [450, 7000], building: [300, 3500], prop: [140, 1200] };

export function createWorldFill(scene, quality) {
  const q = quality.key === 'low' ? 0.55 : quality.key === 'medium' ? 0.8 : 1;
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const models = new Map();
  const footprints = [];
  let ready = false;

  fetch('data/world/placements.json').then((r) => r.json()).then((P) => {
    for (const [name, m] of Object.entries(P.models)) {
      const [n, f] = RANGE[m.tier];
      models.set(name, { name, tier: m.tier, near: n * Math.max(q, 0.7), far: f * q, items: [], copies: { near: null, far: null } });
    }
    for (const [m, place, x, y, z, rot, s] of P.items) {
      const M = models.get(m);
      if (!M) continue;
      // sit on the game's own ground: the palace terraces and district pads differ a little from the raw crescent
      const g = groundAt(x, z, y + 5);
      const yy = g < 0 ? y : y + THREE.MathUtils.clamp(g - crescentH(x, z), -15, 60);
      const mat = new THREE.Matrix4().compose(new THREE.Vector3(x, yy, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rot), new THREE.Vector3(s, s, s));
      M.items.push({ x, z, mat, place });
      const dims = P.models[m].dims;
      if (M.tier !== 'prop') footprints.push({ x, z, r: 0.5 * Math.max(dims[0], dims[2]) * s });
    }
    ready = true;
  });

  // ---- loading -----------------------------------------------------------------
  const queue = [];
  let loading = 0;
  function request(M, kind, dist) {
    if (M.copies[kind]) return;
    M.copies[kind] = { status: 'queued', meshes: [], dist };
    queue.push([M, kind]);
  }
  function pump() {
    queue.sort((a, b) => a[0].copies[a[1]].dist - b[0].copies[b[1]].dist);
    while (loading < 3 && queue.length) {
      const [M, kind] = queue.shift();
      loading++;
      loader.load(`data/world/${kind}/${M.name}.glb`, (gltf) => {
        loading--;
        const C = M.copies[kind];
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((o) => {
          if (!o.isMesh) return;
          const geo = o.geometry.clone().applyMatrix4(o.matrixWorld);
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
      const d = Math.hypot(it.x - cam.x, it.z - cam.z);
      closest = Math.min(closest, d);
      if (d < M.near) near.push(it); else if (d < M.far) far.push(it);
    }
    if (near.length) request(M, 'near', closest);
    if (near.length || far.length) request(M, 'far', closest);
    const nearOK = M.copies.near?.status === 'ready';
    const farOK = M.copies.far?.status === 'ready';
    const put = (C, list) => {
      if (!C || C.status !== 'ready') return;
      for (const im of C.meshes) {
        list.forEach((it, i) => im.setMatrixAt(i, it.mat));
        im.count = list.length;
        im.instanceMatrix.needsUpdate = true;
        im.visible = list.length > 0;
        if (list.length) im.computeBoundingSphere();
      }
    };
    // until the near copy arrives, its instances draw with the far one
    put(M.copies.near, nearOK ? near : []);
    put(M.copies.far, nearOK || !farOK ? far : far.concat(near));
  }

  let acc = 0, cursor = 0;
  const last = new THREE.Vector3(1e9, 0, 0);
  return {
    get ready() { return ready; },
    footprints,
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
