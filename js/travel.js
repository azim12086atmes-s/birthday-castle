// Magical travel: step into a portal and a glowing lotus sky-boat carries you
// in a soaring arc to its floating island (and back again).
import * as THREE from 'three';
import { toon, glowBasic } from './world/materials.js';
import { glowTexture } from './world/textures.js';
import { ISLANDS, PORTALS, RETURNS } from './world/layout.js';

export function makeLotusBoat() {
  const g = new THREE.Group();
  const petalMat = toon('#ffd6ec', { emissive: '#7a3a8a', emissiveIntensity: 0.7 });
  const innerMat = toon('#fff4d6', { emissive: '#8a6a2a', emissiveIntensity: 0.8 });
  for (let ring = 0; ring < 2; ring++) {
    const n = ring ? 7 : 9;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.3;
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), ring ? innerMat : petalMat);
      p.scale.set(0.45, 0.18, 1.1);
      const r = ring ? 0.75 : 1.1;
      p.position.set(Math.cos(a) * r, 0.2 + ring * 0.15, Math.sin(a) * r);
      p.rotation.y = -a + Math.PI / 2;
      p.rotation.x = ring ? -0.9 : -0.55;
      g.add(p);
    }
  }
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.6, 0.3, 16), petalMat);
  g.add(base);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ff9bd6', transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.scale.setScalar(5); glow.position.y = -0.4;
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), glowBasic('#fff2b0'));
  core.position.y = -0.3;
  g.add(glow, core);
  return g;
}

export function createTravel(scene, controller, hooks = {}) {
  const boat = makeLotusBoat();
  boat.visible = false;
  scene.add(boat);
  let ride = null;
  let cooldown = 0;
  const tmp = new THREE.Vector3();

  const landingFor = (portal) => {
    if (portal.land) { const l = portal.land; return { pos: new THREE.Vector3(l.x, l.y, l.z), name: l.name, facing: l.facing ?? 0 }; }
    if (portal.kind === 'to') {
      const isl = ISLANDS.find((i) => i.id === portal.to);
      const r = RETURNS.find((x) => x.from === isl.id);
      tmp.set(isl.x - r.x, 0, isl.z - r.z).normalize();
      return { pos: new THREE.Vector3(r.x + tmp.x * 7, isl.y, r.z + tmp.z * 7), name: isl.name, facing: Math.atan2(tmp.x, tmp.z) };
    }
    const p = PORTALS.find((x) => x.to === portal.from);
    tmp.set(-p.x, 0, -p.z).normalize();
    return { pos: new THREE.Vector3(p.x + tmp.x * 8, p.y, p.z + tmp.z * 8), name: 'Castle of Starlight', facing: Math.atan2(tmp.x, tmp.z) };
  };

  const start = (portal) => {
    const land = landingFor(portal);
    const a = controller.pos.clone();
    const b = land.pos;
    const mid = a.clone().lerp(b, 0.5); mid.y = Math.max(a.y, b.y) + 40 + a.distanceTo(b) * 0.08;
    const curve = new THREE.CatmullRomCurve3([
      a.clone(), a.clone().add(new THREE.Vector3(0, 6, 0)), mid, b.clone().add(new THREE.Vector3(0, 10, 0)), b.clone(),
    ]);
    const dur = Math.min(30, Math.max(4.5, curve.getLength() / 160));
    ride = { curve, t: 0, dur, land };
    controller.locked = true;
    boat.visible = true;
    hooks.onStart && hooks.onStart(land.name);
  };

  const all = [];
  return {
    get riding() { return !!ride; },
    setPortals(list) { all.length = 0; all.push(...list); },
    update(dt, t) {
      if (ride) {
        ride.t += dt / ride.dur;
        const k = Math.min(1, ride.t);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const p = ride.curve.getPointAt(e);
        const ahead = ride.curve.getPointAt(Math.min(1, e + 0.01));
        controller.pos.copy(p).add(tmp.set(0, 0.35, 0));
        if (k < 0.98) controller.facing = Math.atan2(ahead.x - p.x, ahead.z - p.z);
        boat.position.copy(p);
        boat.rotation.y = controller.facing + t * 0.2;
        boat.position.y += Math.sin(t * 3) * 0.05;
        if (k >= 1) {
          controller.locked = false;
          controller.teleport(ride.land.pos.x, ride.land.pos.y, ride.land.pos.z);
          controller.facing = ride.land.facing;
          boat.visible = false;
          hooks.onArrive && hooks.onArrive(ride.land.name);
          ride = null; cooldown = 1.5;
        }
        return;
      }
      if (cooldown > 0) { cooldown -= dt; return; }
      for (const p of all) {
        const dx = controller.pos.x - p.x, dz = controller.pos.z - p.z;
        if (dx * dx + dz * dz < 2.6 * 2.6 && Math.abs(controller.pos.y - p.y) < 3) { start(p); break; }
      }
    },
  };
}
