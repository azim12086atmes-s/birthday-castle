// The 32 places on the map (schema: places): a light pillar over each one
// that shows its state from kilometres away, the place's head standing at its
// game spot, and the Great Birthday Lantern hanging over the palace.
import * as THREE from 'three';
import { glowBasic, toon } from '../world/materials.js';
import { glowTexture, sparkleTexture, textTexture } from '../world/textures.js';
import { groundAt, COLLIDERS, PLAZA, PAL } from '../world/layout.js';


// landmarks placed by the world fill: games keep clear of them too
let obstacles = [];
export function setSpotObstacles(list) { obstacles = list; }

// A flat, open patch near the place where a game can be played: the pads are
// flattened ground, but a building usually stands in the middle of each.
function findSpot(x, z) {
  if (Math.hypot(x, z) < 50) {
    // the palace: just in front of its lotus basin (the basin itself is a collider)
    const zz = PLAZA.z + PLAZA.r + 8;
    return new THREE.Vector3(PLAZA.x, groundAt(PLAZA.x, zz, PLAZA.y + 5) ?? PLAZA.y, zz);
  }
  const ok = (px, pz) => {
    const h = groundAt(px, pz, 2000);
    if (h < 0.8) return null;
    for (const [dx, dz] of [[14, 0], [-14, 0], [0, 14], [0, -14]]) if (Math.abs(groundAt(px + dx, pz + dz, 2000) - h) > 3) return null;
    for (const c of COLLIDERS) {
      const cx = c.r !== undefined ? c.x : (c.minX + c.maxX) / 2, cz = c.r !== undefined ? c.z : (c.minZ + c.maxZ) / 2;
      const cr = c.r !== undefined ? c.r : Math.hypot(c.maxX - c.minX, c.maxZ - c.minZ) / 2;
      if (Math.hypot(px - cx, pz - cz) < cr + 22) return null;
    }
    for (const o of obstacles) if (Math.hypot(px - o.x, pz - o.z) < o.r + 18) return null;
    return h;
  };
  for (let r = 0; r <= 420; r += 30) {
    const n = r ? 16 : 1;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.atan2(-z, -x);        // try the side facing the palace first
      const px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r;
      const h = ok(px, pz);
      if (h !== null) return new THREE.Vector3(px, h, pz);
    }
  }
  return new THREE.Vector3(x, Math.max(1, groundAt(x, z, 2000)), z);
}

export function preparePlaces(data) {
  const chars = Object.fromEntries(data.characters.map((c) => [c.id, c]));
  const creatures = Object.fromEntries(data.creatures.map((c) => [c.id, c]));
  const list = data.places.map((p) => {
    const at = p.at || { x: 0, z: 0 };
    return { ...p, at, headChar: chars[p.head], bossCreature: creatures[p.boss], spot: null };
  });
  const byId = Object.fromEntries(list.map((p) => [p.id, p]));
  const grandPath = list.filter((p) => p.schedule === 'night').sort((a, b) => a.order - b.order);
  // spots are found lazily: the height grid is big and only a few places are visited at once
  const spotOf = (p) => p.spot || (p.spot = findSpot(p.at.x, p.at.z));
  return { list, byId, grandPath, spotOf, chars, creatures };
}

// ------------------------------------------------------------------ visuals --
function beamTexture() {
  const c = document.createElement('canvas'); c.width = 4; c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 128);
  grd.addColorStop(0, 'rgba(255,255,255,0)'); grd.addColorStop(0.7, 'rgba(255,255,255,0.35)'); grd.addColorStop(1, 'rgba(255,255,255,0.9)');
  g.fillStyle = grd; g.fillRect(0, 0, 4, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

const STATE_COLOR = {
  idle: new THREE.Color('#8fb8ff'),      // before the Hush: soft blue
  grey: new THREE.Color('#5a5566'),      // corrupted
  next: new THREE.Color('#ffd47a'),      // the next stop on the Grand Path
  active: new THREE.Color('#ff7ad0'),    // a game is running here
  freed: new THREE.Color('#9dffcf'),     // shard won, head freed
};

function makeHead(char, place) {
  const g = new THREE.Group();
  const robe = new THREE.Mesh(new THREE.ConeGeometry(0.75, 2.0, 12, 1, true), toon('#f3e6ff', { emissive: '#5a3a8a', emissiveIntensity: 0.35, side: THREE.DoubleSide }));
  robe.position.y = 1.0;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), toon('#ffe2cc'));
  head.position.y = 2.2;
  // a soft veil over the face: the game's faces carry no eyes
  const veil = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), toon('#c9b6ff', { emissive: '#7a5ad0', emissiveIntensity: 0.4 }));
  veil.position.y = 2.24;
  const crown = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 6, 20), glowBasic('#ffd47a'));
  crown.rotation.x = Math.PI / 2; crown.position.y = 2.55;
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffcf8a', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.6 }));
  halo.scale.setScalar(3); halo.position.y = 2.3;
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTexture(char?.name || place.name, { font: '600 44px "Cinzel Decorative", Georgia, serif', color: '#fff3c8', glow: '#ff9bd6' }), transparent: true, depthWrite: false }));
  label.scale.set(label.material.map.userData.aspect * 0.55, 0.55, 1); label.position.y = 3.2;
  // the dark crystal the Hush grows around a head
  const cage = new THREE.Group();
  const cMat = new THREE.MeshStandardMaterial({ color: '#2a2040', emissive: '#4a1a6a', emissiveIntensity: 0.6, roughness: 0.25, metalness: 0.4, transparent: true, opacity: 0.88 });
  for (let i = 0; i < 9; i++) {
    const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.5 + (i % 3) * 0.2, 0), cMat);
    const a = (i / 9) * Math.PI * 2;
    s.position.set(Math.cos(a) * 0.7, 0.6 + (i % 4) * 0.5, Math.sin(a) * 0.7);
    s.scale.set(0.5, 1.8, 0.5); s.rotation.set(Math.cos(a) * 0.4, a, Math.sin(a) * 0.4);
    cage.add(s);
  }
  g.add(robe, veil, head, crown, halo, label, cage);
  g.userData = { cage, halo, label };
  return g;
}

export function createPlaceVisuals(scene, places) {
  const N = places.list.length;
  const beamMat = new THREE.MeshBasicMaterial({ map: beamTexture(), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const beamGeo = new THREE.CylinderGeometry(5, 7, 900, 12, 1, true);
  beamGeo.translate(0, 450, 0);
  const beams = new THREE.InstancedMesh(beamGeo, beamMat, N);
  beams.frustumCulled = false;
  const m = new THREE.Matrix4();
  const beamBase = places.list.map((p, i) => {
    const y = Math.max(0, groundAt(p.at.x, p.at.z, 2000));
    m.makeTranslation(p.at.x, y, p.at.z);
    beams.setMatrixAt(i, m);
    beams.setColorAt(i, STATE_COLOR.idle);
    return new THREE.Vector3(p.at.x, y, p.at.z);
  });
  const beamNear = new Array(places.list.length).fill(false);
  scene.add(beams);

  // heads are built only near the player
  const heads = new Map();
  function headFor(p) {
    if (heads.has(p.id)) return heads.get(p.id);
    const h = makeHead(p.headChar, p);
    const s = places.spotOf(p);
    h.position.copy(s).add(new THREE.Vector3(0, 0, 0));
    h.rotation.y = Math.atan2(-s.x, -s.z);
    scene.add(h);
    heads.set(p.id, h);
    return h;
  }

  // ---- the Great Birthday Lantern over the palace ----
  const lantern = new THREE.Group();
  lantern.position.set(0, PAL.y + 1450, -120);         // above the 1100 m spire
  lantern.scale.setScalar(3);
  const coreMat = glowBasic('#ffe9a8');
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(16, 1), coreMat);
  const frameMat = toon('#e9c56a', { emissive: '#7a5a1a', emissiveIntensity: 0.6 });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 50, 6), frameMat);
    rib.position.set(Math.cos(a) * 20, 0, Math.sin(a) * 20); rib.rotation.z = Math.cos(a) * 0.12; rib.rotation.x = -Math.sin(a) * 0.12;
    lantern.add(rib);
  }
  const capT = new THREE.Mesh(new THREE.ConeGeometry(24, 16, 8), frameMat); capT.position.y = 32;
  const capB = new THREE.Mesh(new THREE.ConeGeometry(18, 12, 8), frameMat); capB.position.y = -31; capB.rotation.x = Math.PI;
  const lglow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffcf7a', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  lglow.scale.setScalar(200);
  lantern.add(core, capT, capB, lglow);
  // returned shards circle the lantern
  const shardMat = new THREE.SpriteMaterial({ map: sparkleTexture(), color: '#fff2b0', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const orbit = [];
  for (let i = 0; i < 32; i++) { const s = new THREE.Sprite(shardMat); s.scale.setScalar(14); s.visible = false; lantern.add(s); orbit.push(s); }
  scene.add(lantern);

  // ---- shard streaks: a star flying from one point to another ----
  const streaks = [];
  const streakMat = new THREE.SpriteMaterial({ map: sparkleTexture(), color: '#fff2b0', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  function streak(from, to, dur = 4, delay = 0) {
    const sprites = [];
    for (let i = 0; i < 6; i++) { const s = new THREE.Sprite(streakMat); s.scale.setScalar(30 - i * 4); s.visible = false; scene.add(s); sprites.push(s); }
    const mid = from.clone().lerp(to, 0.5); mid.y = Math.max(from.y, to.y) + from.distanceTo(to) * 0.25;
    streaks.push({ from: from.clone(), to: to.clone(), mid, t: -delay, dur, sprites });
  }
  const bez = (s, a, b, c, t) => s.set(0, 0, 0).addScaledVector(a, (1 - t) * (1 - t)).addScaledVector(b, 2 * t * (1 - t)).addScaledVector(c, t * t);

  let broken = false, shardCount = 0;
  return {
    beams, lantern,
    lanternPos: lantern.position,
    streak,
    setBroken(b, shards) {
      broken = b; shardCount = shards;
      coreMat.color.set(b ? '#4a4258' : '#ffe9a8');
      lglow.material.opacity = b ? 0.15 + 0.85 * (shards / 32) : 1;
      orbit.forEach((s, i) => { s.visible = b && i < shards; });
    },
    // state per place id: idle | grey | next | active | freed
    setStates(states) {
      places.list.forEach((p, i) => beams.setColorAt(i, STATE_COLOR[states[p.id] || 'idle']));
      beams.instanceColor.needsUpdate = true;
      for (const [id, h] of heads) { h.userData.cage.visible = states[id] === 'grey' || states[id] === 'next' || states[id] === 'active'; }
      this.states = states;
    },
    states: {},
    update(t, dt, camPos) {
      // heads within 700 m exist; farther ones are removed
      for (const p of places.list) {
        const d = Math.hypot(camPos.x - p.at.x, camPos.z - p.at.z);
        if (d < 700) { const h = headFor(p); h.userData.cage.visible = ['grey', 'next', 'active'].includes(this.states[p.id]); h.userData.halo.material.opacity = 0.45 + Math.sin(t * 2) * 0.15; }
        else if (d > 900 && heads.has(p.id)) { scene.remove(heads.get(p.id)); heads.delete(p.id); }
      }
      // a pillar is a far-off signpost: it fades out as you arrive so it never fills the view
      let moved = false;
      beamBase.forEach((b, i) => {
        const near = Math.hypot(camPos.x - b.x, camPos.z - b.z) < 320;
        if (near === beamNear[i]) return;
        beamNear[i] = near; moved = true;
        m.makeTranslation(b.x, b.y, b.z);
        if (near) m.scale(new THREE.Vector3(0, 0, 0));
        beams.setMatrixAt(i, m);
      });
      if (moved) beams.instanceMatrix.needsUpdate = true;
      lantern.rotation.y = t * 0.15;
      if (!broken) lglow.material.opacity = 0.85 + Math.sin(t * 1.5) * 0.15;
      orbit.forEach((s, i) => {
        const a = t * 0.4 + (i / Math.max(1, shardCount)) * Math.PI * 2;
        s.position.set(Math.cos(a) * 48, Math.sin(t + i) * 8, Math.sin(a) * 48);
      });
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.t += dt;
        const k = s.t / s.dur;
        s.sprites.forEach((sp, j) => {
          const kk = k - j * 0.012;
          sp.visible = kk > 0 && kk < 1;
          if (sp.visible) bez(sp.position, s.from, s.mid, s.to, kk);
        });
        if (k > 1.1) { s.sprites.forEach((sp) => scene.remove(sp)); streaks.splice(i, 1); }
      }
    },
  };
}
