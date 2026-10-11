// Mini games.
//  1. Stardust Hunt — collect glowing star shards hidden across every island;
//     everyone's tally shows on the shared leaderboard.
//  2. Wish Lanterns — at the Lantern Lake shrine, write a wish and release a
//     lantern that everyone sees float up into the aurora.
import * as THREE from 'three';
import { glowBasic } from './world/materials.js';
import { glowTexture, textTexture, rng } from './world/textures.js';
import { ISLANDS, isClearOfBuildings, groundAt, randomOnIsland, MAIN_SHARE_R } from './world/layout.js';

const SHARDS = 45;
const RESPAWN = 75; // seconds before a collected shard reappears for you

export function createStardustHunt(scene, onCollect) {
  const r = rng(2026);
  const spots = [];
  const share = (i) => (i.main ? MAIN_SHARE_R * 2 : i.r);
  const total = ISLANDS.reduce((s, i) => s + share(i), 0);
  for (const isl of ISLANDS) {
    const n = Math.round((SHARDS * share(isl)) / total);
    let k = 0, tries = 0;
    while (k < n && tries++ < 400) {
      const [x, z] = randomOnIsland(isl, r, 4);
      if (!isClearOfBuildings(x, z, -2, isl.y)) continue;
      const g = groundAt(x, z, isl.y);
      if (g == null) continue;
      spots.push({ x, y: g + 1.2 + r() * 1.5, z, gone: 0 });
      k++;
    }
  }
  const mesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.45, 0), glowBasic('#fff1a8'), spots.length);
  const halo = new THREE.InstancedMesh(new THREE.PlaneGeometry(2.4, 2.4), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ffcf6a', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), spots.length);
  mesh.frustumCulled = halo.frustumCulled = false;
  scene.add(mesh, halo);
  const d = new THREE.Object3D();
  let score = 0;

  return {
    get score() { return score; },
    update(t, dt, pos, camera) {
      spots.forEach((s, i) => {
        if (s.gone > 0) s.gone -= dt;
        const visible = s.gone <= 0;
        if (visible) {
          const dx = pos.x - s.x, dy = pos.y + 1 - s.y, dz = pos.z - s.z;
          if (dx * dx + dy * dy + dz * dz < 2.2 * 2.2) { s.gone = RESPAWN; score++; onCollect && onCollect(score, s); }
        }
        const sc = visible ? 1 : 0;
        d.position.set(s.x, s.y + Math.sin(t * 2 + i) * 0.25, s.z);
        d.rotation.set(0, t * 1.5 + i, 0.3); d.scale.setScalar(sc);
        d.updateMatrix(); mesh.setMatrixAt(i, d.matrix);
        d.quaternion.copy(camera.quaternion); d.scale.setScalar(sc * (1 + Math.sin(t * 4 + i) * 0.15));
        d.updateMatrix(); halo.setMatrixAt(i, d.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      halo.instanceMatrix.needsUpdate = true;
    },
  };
}

export function createWishLanterns(scene) {
  const lanterns = [];
  const geo = new THREE.CylinderGeometry(0.5, 0.36, 1, 8);
  const mat = new THREE.MeshBasicMaterial({ color: '#ffb347', toneMapped: false });
  const glowMat = new THREE.SpriteMaterial({ map: glowTexture(), color: '#ff9a3c', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  return {
    release(origin, text, by) {
      const g = new THREE.Group();
      g.position.copy(origin).add(new THREE.Vector3((Math.random() - 0.5) * 3, 2, (Math.random() - 0.5) * 3));
      const body = new THREE.Mesh(geo, mat);
      const glow = new THREE.Sprite(glowMat); glow.scale.setScalar(4);
      const label = textTexture(`“${text}” — ${by}`, { font: 'italic 500 30px Georgia, serif', color: '#fff3d6', glow: '#ff9a3c' });
      const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: label, transparent: true, depthWrite: false, fog: false }));
      tag.scale.set(label.userData.aspect * 0.7, 0.7, 1); tag.position.y = 1.4;
      g.add(body, glow, tag);
      g.userData = { age: 0, seed: Math.random() * 10 };
      scene.add(g);
      lanterns.push(g);
      if (lanterns.length > 40) { const old = lanterns.shift(); scene.remove(old); old.children[2].material.map.dispose(); }
    },
    update(t, dt) {
      for (const l of lanterns) {
        l.userData.age += dt;
        l.position.y += dt * (0.9 + Math.min(l.userData.age * 0.02, 0.8));
        l.position.x += Math.sin(t * 0.4 + l.userData.seed) * dt * 0.5;
        l.children[2].material.opacity = Math.max(0, 1 - l.userData.age / 90);
      }
    },
  };
}
