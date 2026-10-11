// The formal courtyard before the castle gate (style guide layout + U09's
// lantern-lined approach): two mirrored charbagh parterres of clipped hedges,
// flower beds and a star-shaped basin, cypresses at the corners, and lanterns
// lining the walkway from the arrival meadow to the gate.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { additive, glowBasic, nightGrade } from './materials.js';
import { leafTexture, flowerTexture, glowTexture, rng } from './textures.js';
import { TERRACES, STAIR, TREE_WAY, WAY_LINE, CRAG, addCollider, groundAt } from './layout.js';
import { MOOD } from './sky.js';

function box(w, h, d, x, y, z) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}

export function createGarden(scene, preset) {
  const r = rng(314);
  const group = new THREE.Group();
  const hedges = [], gravel = [], beds = [], cypress = [], basins = [];
  const flowers = [];
  const gy = (x, z) => groundAt(x, z, CRAG.y) ?? 0;

  // --- two parterres, mirrored either side of the gate walkway ---
  // they sit on the first marble terrace, either side of the grand stairs
  const TY = TERRACES[0].y;
  const z0 = TERRACES[1].front + 2, z1 = TERRACES[0].front - 2, xin = STAIR.hw + 6, xout = STAIR.hw + 70, hh = 1.1, ht = 0.9;
  for (const s of [-1, 1]) {
    const xa = s * xin, xb = s * xout, cx = (xa + xb) / 2, cz = (z0 + z1) / 2;
    const w = Math.abs(xb - xa), d = z1 - z0;
    // outer hedge, with an opening facing the walkway
    hedges.push(box(w, hh, ht, cx, hh / 2, z0), box(w, hh, ht, cx, hh / 2, z1));
    hedges.push(box(ht, hh, d, xb, hh / 2, cz));
    hedges.push(box(ht, hh, d / 2 - 1.4, xa, hh / 2, z0 + (d / 2 - 1.4) / 2), box(ht, hh, d / 2 - 1.4, xa, hh / 2, z1 - (d / 2 - 1.4) / 2));
    addCollider({ minX: Math.min(xa, xb), maxX: Math.max(xa, xb), minZ: z0 - ht / 2, maxZ: z0 + ht / 2, y0: TY, y1: TY + hh });
    addCollider({ minX: Math.min(xa, xb), maxX: Math.max(xa, xb), minZ: z1 - ht / 2, maxZ: z1 + ht / 2, y0: TY, y1: TY + hh });
    addCollider({ minX: xb - ht / 2, maxX: xb + ht / 2, minZ: z0, maxZ: z1, y0: TY, y1: TY + hh });
    // cross of pale gravel paths
    gravel.push(box(w - 1, 0.04, 1.6, cx, 0.02, cz), box(1.6, 0.04, d - 1, cx, 0.021, cz));
    // four beds, each a low hedge frame full of flowers
    const bedCols = ['#ff9bd6', '#ffd84a', '#c9a6ff', '#ffffff'];
    let q = 0;
    for (const bx of [-1, 1]) for (const bz of [-1, 1]) {
      const ex = cx + bx * (w / 4 + 0.2), ez = cz + bz * (d / 4 + 0.2);
      const bw = w / 2 - 2.4, bd = d / 2 - 2.4;
      beds.push(box(bw, 0.12, bd, ex, 0.06, ez));
      for (const [fx, fz, fw, fd] of [[ex, ez - bd / 2, bw, 0.35], [ex, ez + bd / 2, bw, 0.35], [ex - bw / 2, ez, 0.35, bd], [ex + bw / 2, ez, 0.35, bd]]) {
        hedges.push(box(fw, 0.45, fd, fx, 0.22, fz));
      }
      const col = bedCols[q++ % bedCols.length];
      const n = Math.round((preset.flowers / 900) * 140) + 30;
      for (let i = 0; i < n; i++) flowers.push({ x: ex + (r() - 0.5) * (bw - 0.6), z: ez + (r() - 0.5) * (bd - 0.6), col });
    }
    // eight-sided basin in the middle
    const basin = new THREE.CylinderGeometry(3.8, 4.2, 0.6, 8); basin.translate(cx, 0.3, cz);
    basins.push(basin);
    addCollider({ x: cx, z: cz, r: 4, y0: TY, y1: TY + 1 });
    // cypresses at the four corners
    for (const [px, pz] of [[xa, z0], [xb, z0], [xa, z1], [xb, z1]]) {
      // flame-shaped clipped cypress, smooth so it reads as one soft column
      const tall = 13 + r() * 3;
      const c = new THREE.LatheGeometry([[0, 0], [0.9, 0.4], [1.25, 1.8], [1.2, 3.6], [0.85, 5.4], [0.35, 6.6], [0, 7]].map(([x, y]) => new THREE.Vector2(x * 1.6, y * tall / 7)), 12);
      c.translate(px + s * 0.3, 0, pz);
      cypress.push(c);
      addCollider({ x: px, z: pz, r: 1.8, y0: TY, y1: TY + 14 });
    }
  }

  const leafy = leafTexture();
  const hedgeMat = nightGrade(new THREE.MeshLambertMaterial({ color: '#3f8a46', map: leafy, emissive: '#10283a', emissiveIntensity: 0.5 }), 'hedge');
  const H = new THREE.Mesh(mergeGeometries(hedges), hedgeMat); H.castShadow = H.receiveShadow = true;
  const G = new THREE.Mesh(mergeGeometries(gravel), new THREE.MeshLambertMaterial({ color: '#efe3d2', emissive: '#2a2050', emissiveIntensity: 0.3 })); G.receiveShadow = true;
  const B = new THREE.Mesh(mergeGeometries(beds), new THREE.MeshLambertMaterial({ color: '#4a7a3c', emissive: '#10283a', emissiveIntensity: 0.4 })); B.receiveShadow = true;
  const C = new THREE.Mesh(mergeGeometries(cypress), nightGrade(new THREE.MeshLambertMaterial({ color: '#2f6a44', map: leafy, emissive: '#10283a', emissiveIntensity: 0.5 }), 'cypress')); C.castShadow = true;
  const S = new THREE.Mesh(mergeGeometries(basins), new THREE.MeshLambertMaterial({ color: '#f2e8da', emissive: '#2a2050', emissiveIntensity: 0.3 }));
  const parterres = new THREE.Group();
  parterres.position.y = TY;
  group.add(parterres);
  parterres.add(H, G, B, C, S);
  // glowing water in each basin
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.CircleGeometry(3.5, 8), additive('#5fd6ff', { map: glowTexture(), opacity: 0.7 }));
    w.rotation.x = -Math.PI / 2; w.position.set(s * (xin + xout) / 2, 0.62, (z0 + z1) / 2);
    parterres.add(w);
  }

  // flowers in the beds
  const petal = new THREE.PlaneGeometry(0.4, 0.4).rotateX(-Math.PI / 2);
  const fm = new THREE.InstancedMesh(petal, new THREE.MeshBasicMaterial({ color: '#ffffff', map: flowerTexture(), alphaTest: 0.5, side: THREE.DoubleSide, toneMapped: false }), flowers.length);
  const dummy = new THREE.Object3D(), color = new THREE.Color();
  flowers.forEach((f, i) => {
    dummy.position.set(f.x, 0.2 + r() * 0.15, f.z); dummy.rotation.set((r() - 0.5) * 0.5, r() * 6, (r() - 0.5) * 0.5); dummy.scale.setScalar(0.8 + r() * 0.5);
    dummy.updateMatrix(); fm.setMatrixAt(i, dummy.matrix);
    fm.setColorAt(i, color.set(f.col).multiplyScalar(0.85));
  });
  parterres.add(fm);

  // --- lanterns along the walkway on the terrace and up the Giant-Tree Way ---
  const spots = [];
  for (let z = z0; z <= z1; z += 7) spots.push([-(STAIR.hw + 2), z], [STAIR.hw + 2, z]);
  const WS = WAY_LINE.samples;
  for (let k = 0; k < WS.length - 1; k += 9) {
    const a = WS[k], b = WS[k + 1], l = Math.hypot(b.x - a.x, b.z - a.z) || 1, px = -(b.z - a.z) / l, pz = (b.x - a.x) / l;
    const sd = (k / 9) % 2 ? 1 : -1, o = TREE_WAY.hw + 1.6;
    spots.push([a.x + px * sd * o, a.z + pz * sd * o]);
  }
  const posts = [], caps = [];
  const ys = spots.map(([x, z]) => gy(x, z));
  for (const [i, [x, z]] of spots.entries()) {
    const y = ys[i];
    posts.push(box(0.14, 2.7, 0.14, x, y + 1.35, z), box(0.4, 0.16, 0.4, x, y + 0.08, z), box(0.36, 0.06, 0.36, x, y + 2.72, z));
    const roof = new THREE.ConeGeometry(0.34, 0.4, 4); roof.rotateY(Math.PI / 4); roof.translate(x, y + 3.37, z);
    caps.push(roof);
    addCollider({ x, z, r: 0.3 });
  }
  const iron = new THREE.MeshLambertMaterial({ color: '#3a3358', emissive: '#120e28', emissiveIntensity: 0.6 });
  group.add(new THREE.Mesh(mergeGeometries([...posts, ...caps]), iron));
  const lampGeo = new THREE.BoxGeometry(0.3, 0.42, 0.3);
  const lamps = new THREE.InstancedMesh(lampGeo, glowBasic('#ffc65c'), spots.length);
  const halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(2.6, 2.6), additive('#ffb347', { map: glowTexture(), opacity: 0.5 }), spots.length);
  spots.forEach(([x, z], i) => {
    const y = ys[i];
    dummy.position.set(x, y + 2.95, z); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1);
    dummy.updateMatrix(); lamps.setMatrixAt(i, dummy.matrix); halos.setMatrixAt(i, dummy.matrix);
  });
  group.add(lamps, halos);

  scene.add(group);
  const q = new THREE.Quaternion();
  return {
    update(t, camera) {
      // halos face the camera; lanterns brighten as night falls
      if (camera) {
        q.copy(camera.quaternion);
        spots.forEach(([x, z], i) => {
          dummy.position.set(x, ys[i] + 2.95, z); dummy.quaternion.copy(q); dummy.scale.setScalar(1 + 0.06 * Math.sin(t * 2 + i));
          dummy.updateMatrix(); halos.setMatrixAt(i, dummy.matrix);
        });
        halos.instanceMatrix.needsUpdate = true;
      }
      halos.material.opacity = 0.3 + 0.35 * MOOD.night.value;
    },
  };
}
