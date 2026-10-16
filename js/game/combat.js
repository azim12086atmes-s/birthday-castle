// Weapons (schema: weapons). Click or tap to loose a starlight bolt (ranged),
// Q to swing the starlight sword (melee). Hits are worked out by whoever
// shoots and shared as an event, so every screen agrees on what was struck.
import * as THREE from 'three';
import { sparkleTexture, glowTexture } from '../world/textures.js';

export function createCombat(scene, camera, data) {
  const ranged = data.weapons.find((w) => w.class === 'ranged') || { name: 'Starlight bolt' };
  const melee = data.weapons.find((w) => w.class === 'melee') || { name: 'Starlight sword' };
  const boltMat = new THREE.SpriteMaterial({ map: sparkleTexture(), color: '#bff6ff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const bolts = [];
  const arcMat = new THREE.MeshBasicMaterial({ color: '#ffd9f4', transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const arcGeo = new THREE.RingGeometry(1.6, 3.2, 24, 1, -Math.PI / 3, (Math.PI * 2) / 3);
  arcGeo.rotateX(-Math.PI / 2);
  const swings = [];
  const burstMat = new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffffff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const bursts = [];
  const ray = new THREE.Ray();
  const tmp = new THREE.Vector3();

  const self = {
    ranged, melee,
    enabled: false,
    light: 100,
    dimmed: 0,
    targets: () => [],            // set by the running game: [{ id, pos, r }]
    onHit: null,                  // (id, weapon) => void
    onHurt: null,
    onDimmed: null,
    burst(pos, color = '#ffffff', size = 4) {
      const s = new THREE.Sprite(burstMat.clone()); s.material.color.set(color);
      s.position.copy(pos); s.scale.setScalar(size); scene.add(s); bursts.push({ s, t: 0 });
    },
    // nx, ny: the tap in normalised device coordinates
    shoot(nx, ny) {
      if (!self.enabled || self.dimmed > 0) return false;
      tmp.set(nx, ny, 0.5).unproject(camera);
      ray.origin.copy(camera.position); ray.direction.copy(tmp).sub(camera.position).normalize();
      let best = null, bestD = 90;
      for (const tg of self.targets()) {
        const d = ray.distanceSqToPoint(tg.pos);
        if (d > tg.r * tg.r) continue;
        const along = tmp.copy(tg.pos).sub(ray.origin).dot(ray.direction);
        if (along > 0 && along < bestD) { bestD = along; best = tg; }
      }
      const end = ray.at(best ? bestD : 60, new THREE.Vector3());
      const s = new THREE.Sprite(boltMat); s.scale.setScalar(1.2); scene.add(s);
      bolts.push({ s, from: camera.position.clone().add(new THREE.Vector3(0, -0.3, 0)), to: end, t: 0, dur: Math.max(0.08, (best ? bestD : 60) / 140) , hit: best });
      return true;
    },
    swing(pos, facing) {
      if (!self.enabled || self.dimmed > 0) return;
      const m = new THREE.Mesh(arcGeo, arcMat.clone());
      m.position.copy(pos).add(new THREE.Vector3(0, 1.1, 0)); m.rotation.y = facing - Math.PI / 2;
      scene.add(m); swings.push({ m, t: 0 });
      for (const tg of self.targets()) {
        const dx = tg.pos.x - pos.x, dz = tg.pos.z - pos.z, d = Math.hypot(dx, dz);
        if (d > 3.6 + tg.r || Math.abs(tg.pos.y - pos.y - 1) > 3 + tg.r) continue;
        let a = Math.atan2(dx, dz) - facing; a = Math.atan2(Math.sin(a), Math.cos(a));
        if (Math.abs(a) < 1.2 || d < tg.r + 0.8) { self.onHit && self.onHit(tg.id, 'melee'); self.burst(tg.pos, '#ffd9f4', 3); }
      }
    },
    hurt(n) {
      if (!self.enabled || self.dimmed > 0) return;
      self.light = Math.max(0, self.light - n);
      self.onHurt && self.onHurt(self.light);
      if (self.light <= 0) { self.dimmed = 3; self.onDimmed && self.onDimmed(); }
    },
    reset() { self.light = 100; self.dimmed = 0; self.onHurt && self.onHurt(self.light); },
    update(dt) {
      if (self.dimmed > 0) { self.dimmed -= dt; if (self.dimmed <= 0) { self.light = 60; self.onHurt && self.onHurt(self.light); } }
      else if (self.enabled && self.light < 100) { self.light = Math.min(100, self.light + dt * 2); }
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]; b.t += dt;
        const k = Math.min(1, b.t / b.dur);
        b.s.position.lerpVectors(b.from, b.to, k);
        if (k >= 1) {
          scene.remove(b.s); bolts.splice(i, 1);
          if (b.hit) { self.onHit && self.onHit(b.hit.id, 'ranged'); self.burst(b.to, '#bff6ff', 3); }
        }
      }
      for (let i = swings.length - 1; i >= 0; i--) {
        const s = swings[i]; s.t += dt;
        s.m.material.opacity = 0.8 * (1 - s.t / 0.25); s.m.scale.setScalar(1 + s.t * 2);
        if (s.t > 0.25) { scene.remove(s.m); s.m.material.dispose(); swings.splice(i, 1); }
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]; b.t += dt;
        b.s.material.opacity = 1 - b.t / 0.5; b.s.scale.multiplyScalar(1 + dt * 3);
        if (b.t > 0.5) { scene.remove(b.s); b.s.material.dispose(); bursts.splice(i, 1); }
      }
    },
  };
  return self;
}
