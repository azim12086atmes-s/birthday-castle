// The flying sky ship: the party always travels together (storyline). Someone
// picks a place, the ship comes down to the group, lifts everyone onto its deck
// and sails over the land to that place, first person all the way.
import * as THREE from 'three';
import { toon, glowBasic } from '../world/materials.js';
import { glowTexture } from '../world/textures.js';

function makeShip() {
  const g = new THREE.Group();
  const wood = toon('#f4e6ff', { emissive: '#6a4a9a', emissiveIntensity: 0.25 });
  const gold = toon('#ecc76a', { emissive: '#7a5a1a', emissiveIntensity: 0.5 });
  const hull = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), wood);
  hull.scale.set(3.4, 2.4, 9.5);
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 24), toon('#d8c0f0'));
  deck.scale.set(3.3, 1, 9.3); deck.position.y = 0;
  const rail = new THREE.Mesh(new THREE.TorusGeometry(1, 0.04, 6, 40), gold);
  rail.rotation.x = Math.PI / 2; rail.scale.set(3.3, 9.3, 1); rail.position.y = 1.0;
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 11, 8), gold);
  mast.position.y = 5.5;
  const sailShape = new THREE.Shape();
  sailShape.moveTo(0, 0); sailShape.quadraticCurveTo(3.6, 4, 0, 8.5); sailShape.quadraticCurveTo(1.6, 4, 0, 0);
  const sail = new THREE.Mesh(new THREE.ShapeGeometry(sailShape, 16), new THREE.MeshBasicMaterial({ color: '#ffd0ec', transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
  sail.position.set(0, 2, 0); sail.rotation.y = Math.PI / 2;
  const balloon = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), toon('#cdb8ff', { emissive: '#8a5ad0', emissiveIntensity: 0.35 }));
  balloon.scale.set(4.5, 3.6, 10); balloon.position.y = 15;
  const band = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 6, 40), gold);
  band.scale.set(4.55, 10.05, 1); band.rotation.x = Math.PI / 2; band.position.y = 15;
  const wingMat = new THREE.MeshBasicMaterial({ color: '#9fe8ff', transparent: true, opacity: 0.35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0); wingShape.bezierCurveTo(4, 3, 9, 2, 10, -1); wingShape.bezierCurveTo(7, -2, 3, -2, 0, 0);
  const wings = [];
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.ShapeGeometry(wingShape, 12), wingMat);
    const pivot = new THREE.Group(); pivot.position.set(s * 3.2, 0.6, 0); pivot.scale.x = s;
    w.rotation.x = -Math.PI / 2;
    pivot.add(w); g.add(pivot); wings.push(pivot);
  }
  const lamps = [];
  for (const z of [-9, 9]) {
    const l = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffcf7a', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    l.scale.setScalar(5); l.position.set(0, 1.8, z); lamps.push(l); g.add(l);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), glowBasic('#fff2b0')); bulb.position.copy(l.position); g.add(bulb);
  }
  g.add(hull, deck, rail, mast, sail, balloon, band);
  g.userData.wings = wings;
  return g;
}

const BOARD = 2.5, LAND = 2.0;
const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

export function createShips(scene) {
  const trips = new Map();
  const tmp = new THREE.Vector3(), tan = new THREE.Vector3();

  // three abreast in six rows: 18 seats, the whole party of 16 with room to spare
  function slot(i) { return new THREE.Vector3(((i % 3) - 1) * 1.7, 0.15, -5.4 + Math.floor((i % 18) / 3) * 1.95); }

  return {
    // trip: { id, from, to, riders: [ids], dest }
    start(trip) {
      if (trips.has(trip.id)) return;
      const from = v3(trip.from), to = v3(trip.to);
      const dist = from.distanceTo(to);
      const fly = THREE.MathUtils.clamp(dist / 260, 9, 26);
      const top = Math.max(from.y, to.y) + 180 + dist * 0.04;
      const pts = [from, from.clone().lerp(to, 0.08).setY(from.y + 90), from.clone().lerp(to, 0.5).setY(top), to.clone().lerp(from, 0.08).setY(to.y + 90), to.clone().add(new THREE.Vector3(0, 1, 0))];
      const ship = makeShip();
      ship.position.copy(from);
      scene.add(ship);
      trips.set(trip.id, { ...trip, ship, curve: new THREE.CatmullRomCurve3(pts, false, 'centripetal'), fly, t: 0, fromV: from, toV: to, heading: Math.atan2(to.x - from.x, to.z - from.z) });
    },
    // where a rider should be right now (null when not on a trip)
    riderPos(id) {
      for (const tr of trips.values()) {
        const i = tr.riders.indexOf(id);
        if (i < 0) continue;
        if (tr.t > BOARD + tr.fly + LAND) return null;
        const s = slot(i).applyMatrix4(tr.ship.matrixWorld);
        return { pos: s, phase: tr.t < BOARD ? 'board' : tr.t < BOARD + tr.fly ? 'fly' : 'land', k: tr.t < BOARD ? tr.t / BOARD : 1, trip: tr };
      }
      return null;
    },
    landingFor(id) {
      for (const tr of trips.values()) {
        const i = tr.riders.indexOf(id);
        if (i >= 0) return tr.toV.clone().add(new THREE.Vector3(Math.cos(i * 1.3) * (3 + i * 0.6), 0, Math.sin(i * 1.3) * (3 + i * 0.6)));
      }
      return null;
    },
    get active() { return trips.size > 0; },
    update(dt, t) {
      for (const [id, tr] of trips) {
        tr.t += dt;
        const s = tr.ship;
        if (tr.t < BOARD) { s.position.copy(tr.fromV); s.rotation.y = tr.heading; }
        else if (tr.t < BOARD + tr.fly) {
          const raw = (tr.t - BOARD) / tr.fly;
          const k = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
          tr.curve.getPointAt(k, tmp); s.position.copy(tmp);
          tr.curve.getTangentAt(k, tan);
          s.rotation.y = Math.atan2(tan.x, tan.z);
          s.rotation.x = -Math.asin(THREE.MathUtils.clamp(tan.y, -0.5, 0.5)) * 0.5;
        } else { s.position.copy(tr.toV).add(new THREE.Vector3(0, 1, 0)); s.rotation.x = 0; }
        for (const [i, w] of s.userData.wings.entries()) w.rotation.z = Math.sin(t * 2.2 + i * Math.PI) * 0.25;
        s.updateMatrixWorld();
        if (tr.t > BOARD + tr.fly + LAND + 4) { scene.remove(s); trips.delete(id); }
        else if (tr.t > BOARD + tr.fly + LAND) s.position.y += dt * 30;      // sails away up into the sky
      }
    },
  };
}
