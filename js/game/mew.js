// The Mew (schema: mew). A small pink cat-like spirit bonded to her. It floats
// in her view, 30-50 degrees off centre and 1-2 m away, trailing her with a
// soft lag, and teases her: upside down at the top of her view wagging its
// tail, magic blobs that burst into petals on her screen, happy circles, naps
// in a bubble she can carry, and flying ahead to point the way.
//
// The owner plays it (?mew=<mewKey>): WASD/Space/C to fly, 1-5 for the
// actions, X to mew. When the owner is not steering, it follows on its own.
// Its eyes stay closed and smiling, and it only ever speaks in mews.
import * as THREE from 'three';
import { toon, glowBasic } from '../world/materials.js';
import { glowTexture, sparkleTexture, textTexture } from '../world/textures.js';

const UP = new THREE.Vector3(0, 1, 0);

function makeMew() {
  const g = new THREE.Group();
  const fur = toon('#ffc4e4', { emissive: '#ff7ac8', emissiveIntensity: 0.28 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), fur); body.scale.set(1, 0.9, 1.2);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 14), fur); head.position.set(0, 0.17, 0.1);
  const ears = [-1, 1].map((s) => { const e = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.13, 8), fur); e.position.set(s * 0.1, 0.32, 0.08); e.rotation.z = -s * 0.35; return e; });
  // closed, smiling eyes: two little arcs
  const lidMat = new THREE.MeshBasicMaterial({ color: '#7a2a5a' });
  const lids = [-1, 1].map((s) => { const l = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 4, 10, Math.PI), lidMat); l.position.set(s * 0.065, 0.19, 0.255); l.rotation.z = Math.PI; return l; });
  const feet = [[-0.07, 0.1], [0.07, 0.1], [-0.07, -0.08], [0.07, -0.08]].map(([x, z]) => { const f = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), fur); f.position.set(x, -0.12, z); return f; });
  // the long thin tail with its oval tip, a chain of beads that waves
  const tail = [];
  for (let i = 0; i < 14; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.028 - i * 0.0006, 6, 5), fur); g.add(b); tail.push(b); }
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), fur); tip.scale.set(0.8, 1.3, 0.8); g.add(tip);
  const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ff9bd6', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  aura.scale.setScalar(1.2);
  const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), new THREE.MeshPhongMaterial({ color: '#d8f4ff', emissive: '#6a8aff', emissiveIntensity: 0.25, transparent: true, opacity: 0.32, shininess: 140, depthWrite: false }));
  bubble.visible = false;
  const zzz = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTexture('z z z', { font: 'italic 600 40px Georgia, serif', color: '#e8f4ff', glow: '#9fd8ff' }), transparent: true, depthWrite: false }));
  zzz.scale.set(0.5, 0.18, 1); zzz.position.set(0.25, 0.45, 0); zzz.visible = false;
  const pose = new THREE.Group();
  pose.add(body, head, ...ears, ...lids, ...feet);
  g.add(pose, aura, bubble, zzz);
  g.userData = { pose, tail, tip, bubble, zzz, aura };
  return g;
}

// ---- sounds: mews only, made in WebAudio ----
let actx;
function mewSound(kind = 'mew', vol = 0.25) {
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    const n = kind === 'giggle' ? 3 : 1;
    for (let i = 0; i < n; i++) {
      const t0 = actx.currentTime + i * 0.13;
      const o = actx.createOscillator(), gn = actx.createGain(), lfo = actx.createOscillator(), lg = actx.createGain();
      o.type = 'sine';
      const f0 = kind === 'giggle' ? 1300 : 850;
      o.frequency.setValueAtTime(f0, t0);
      o.frequency.exponentialRampToValueAtTime(f0 * 1.6, t0 + 0.08);
      o.frequency.exponentialRampToValueAtTime(f0 * 1.15, t0 + (kind === 'giggle' ? 0.1 : 0.32));
      lfo.frequency.value = 28; lg.gain.value = 25; lfo.connect(lg); lg.connect(o.frequency);
      gn.gain.setValueAtTime(0, t0); gn.gain.linearRampToValueAtTime(vol, t0 + 0.03); gn.gain.exponentialRampToValueAtTime(0.001, t0 + (kind === 'giggle' ? 0.12 : 0.38));
      o.connect(gn); gn.connect(actx.destination);
      o.start(t0); lfo.start(t0); o.stop(t0 + 0.4); lfo.stop(t0 + 0.4);
    }
  } catch { /* no audio */ }
}

export const MEW_ACTIONS = ['upside_down', 'magic_blob', 'circle', 'bubble_nap', 'point_way'];

export function createMew(scene, data, hooks) {
  const spec = data.mew;
  const mesh = makeMew();
  mesh.visible = false;
  scene.add(mesh);
  const { pose, tail, tip, bubble, zzz } = mesh.userData;
  const pos = new THREE.Vector3(0, -100, 0);
  const target = new THREE.Vector3();
  const lag = spec.view?.lagS ?? 0.6, leash = spec.view?.leashM ?? 6;
  const [offMin, offMax] = spec.view?.offsetDeg || [30, 50];
  const [dMin, dMax] = spec.view?.distanceM || [1, 2];

  let action = null;          // { id, t, dur }
  let side = 1, sideT = 0, aiActT = 25;
  let carried = false;
  let spin = 0, flip = 0;
  const blobs = [];
  const petals = [];
  const blobMat = new THREE.SpriteMaterial({ map: glowTexture(), color: '#ff9bd6', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const petalMat = new THREE.SpriteMaterial({ map: sparkleTexture(), color: '#ffd0ec', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });

  // owner flight
  let ownerIdle = 99;
  const vel = new THREE.Vector3();
  const tmp = new THREE.Vector3(), fwd = new THREE.Vector3(), right = new THREE.Vector3();

  function viewFrame(view) {
    // view: { head: Vector3, yaw, pitch }
    const cp = Math.cos(view.pitch);
    fwd.set(Math.sin(view.yaw) * cp, -Math.sin(view.pitch), Math.cos(view.yaw) * cp).normalize();
    right.crossVectors(fwd, UP).normalize();
  }

  function aiTarget(view, t, busy) {
    viewFrame(view);
    if (action?.id === 'upside_down') return target.copy(view.head).addScaledVector(fwd, 1.4).addScaledVector(UP, 0.5);
    if (action?.id === 'circle') {
      const a = action.t * 4;
      return target.copy(view.head).addScaledVector(fwd, Math.cos(a) * 1.3).addScaledVector(right, Math.sin(a) * 1.3).addScaledVector(UP, 0.3);
    }
    if (action?.id === 'point_way' && hooks.nextPlace()) {
      const np = hooks.nextPlace();
      tmp.set(np.x - view.head.x, 0, np.z - view.head.z).normalize();
      return target.copy(view.head).addScaledVector(tmp, 12).addScaledVector(UP, 2);
    }
    if (action?.id === 'bubble_nap' && carried) return target.copy(view.head).addScaledVector(fwd, 0.9).addScaledVector(UP, -0.55);
    if (action?.id === 'bubble_nap') return target.copy(pos);
    // drift between the two sides of her view now and then
    sideT -= 1 / 60;
    if (sideT <= 0) { side = -side; sideT = 12 + Math.random() * 14; }
    const deg = busy ? offMax + 15 : offMin + (offMax - offMin) * (0.5 + 0.5 * Math.sin(t * 0.13));
    const dist = busy ? dMax + 0.6 : dMin + (dMax - dMin) * (0.5 + 0.5 * Math.sin(t * 0.21 + 1));
    const a = THREE.MathUtils.degToRad(deg) * side;
    tmp.copy(fwd).applyAxisAngle(UP, a);
    return target.copy(view.head).addScaledVector(tmp, dist).addScaledVector(UP, (busy ? 0.6 : 0.15) + Math.sin(t * 1.7) * 0.12);
  }

  const self = {
    mesh, pos,
    visible: false,
    get action() { return action?.id || null; },
    get sleeping() { return action?.id === 'bubble_nap'; },
    get carried() { return carried; },
    // play an action; local=true means it started here and should be shared
    act(id, local = true) {
      if (id === 'bubble_nap' && action?.id === 'bubble_nap') { action = null; carried = false; mewSound('mew'); if (local) hooks.send({ a: 'wake' }); return; }
      action = { id, t: 0, dur: { upside_down: 4.5, magic_blob: 1.6, circle: 3.2, bubble_nap: 25, point_way: 4.5 }[id] || 3 };
      if (id === 'magic_blob') { const v = hooks.herView(); if (v) self.throwBlob(v.head); }
      if (id !== 'bubble_nap') mewSound(id === 'circle' ? 'giggle' : 'mew', 0.18);
      if (local) hooks.send({ a: id });
    },
    wake() { if (action?.id === 'bubble_nap') { action = null; carried = false; } },
    toggleCarry(local = true) {
      if (action?.id !== 'bubble_nap') return false;
      carried = !carried; if (local) hooks.send({ a: carried ? 'carry' : 'drop' });
      return true;
    },
    throwBlob(to) {
      const s = new THREE.Sprite(blobMat); s.scale.setScalar(0.35); s.position.copy(pos); scene.add(s);
      blobs.push({ s, from: pos.clone(), to: to.clone(), t: 0 });
    },
    // her answers to the Mew
    react(kind) {
      if (kind === 'boop') { flip = 1; mewSound('mew', 0.3); self.hearts(); }
      if (kind === 'tickle') { spin = 1.4; mewSound('giggle', 0.3); }
      if (kind === 'berry') { mewSound('mew', 0.25); setTimeout(() => self.act('circle', false), 500); }
      if (kind === 'wake') self.wake();
    },
    hearts() {
      for (let i = 0; i < 10; i++) {
        const s = new THREE.Sprite(petalMat); s.scale.setScalar(0.15); s.position.copy(pos); scene.add(s);
        petals.push({ s, v: new THREE.Vector3((Math.random() - 0.5) * 1.5, 1 + Math.random(), (Math.random() - 0.5) * 1.5), t: 0 });
      }
    },
    sound(kind) { mewSound(kind, 0.25); },
    // the owner steering: controller gives keys and look direction
    ownerFly(dt, controller) {
      const k = controller.keys;
      let ix = 0, iz = 0, iy = 0;
      if (k.has('KeyW') || k.has('ArrowUp')) iz += 1;
      if (k.has('KeyS') || k.has('ArrowDown')) iz -= 1;
      if (k.has('KeyA') || k.has('ArrowLeft')) ix -= 1;
      if (k.has('KeyD') || k.has('ArrowRight')) ix += 1;
      if (k.has('Space')) iy += 1;
      if (k.has('KeyC')) iy -= 1;
      if (controller.joy) { ix += controller.joy.x; iz -= controller.joy.y; }
      const moving = Math.hypot(ix, iy, iz) > 0.05;
      ownerIdle = moving ? 0 : ownerIdle + dt;
      viewFrame({ head: pos, yaw: controller.camYaw, pitch: controller.camPitch });
      const sp = (k.has('ShiftLeft') || k.has('ShiftRight')) ? 14 : 6;
      tmp.set(0, 0, 0).addScaledVector(fwd, iz).addScaledVector(right, ix).addScaledVector(UP, iy);
      if (tmp.lengthSq() > 1) tmp.normalize();
      vel.lerp(tmp.multiplyScalar(sp), Math.min(1, dt * 6));
      if (moving && action?.id === 'bubble_nap' && !carried) self.act('bubble_nap');     // moving wakes it
      return moving;
    },
    // view: her view { head, yaw, pitch } or null; owner: true on the owner's screen
    update(dt, t, { view, owner, controller, busy, remotePos }) {
      self.visible = !!view || !!owner || !!remotePos;
      mesh.visible = self.visible && !self.hidden;
      if (!self.visible) return;
      if (action) { action.t += dt; if (action.t > action.dur) { if (action.id === 'bubble_nap') carried = false; action = null; } }

      if (remotePos && !owner) {
        // the owner is steering on their screen: follow their position
        pos.lerp(remotePos, Math.min(1, dt * 10));
      } else {
        let steering = false;
        if (owner && controller) steering = self.ownerFly(dt, controller) || ownerIdle < 2.5;
        if (steering && !(action && ['upside_down', 'circle', 'point_way'].includes(action.id)) && !carried) {
          pos.addScaledVector(vel, dt);
        } else if (view) {
          aiTarget(view, t, busy);
          const k = 1 - Math.exp(-dt / (action?.id === 'circle' ? 0.15 : lag));
          pos.lerp(target, k);
          if (!owner && !action && (aiActT -= dt) <= 0) {
            aiActT = 18 + Math.random() * 25;
            const pick = ['upside_down', 'magic_blob', 'circle', 'point_way', 'upside_down', 'circle', 'bubble_nap'];
            self.act(pick[Math.floor(Math.random() * pick.length)], false);
          }
        }
        if (view) {
          // the leash: never more than 6 m from her; snap back after a ship ride or a fall
          const d = pos.distanceTo(view.head);
          if (d > 40) pos.copy(view.head).add(new THREE.Vector3(0.8, 0.4, 0.8));
          else if (d > leash && !(action?.id === 'point_way')) pos.sub(view.head).setLength(leash).add(view.head);
        }
      }

      // pose: face her (or ahead), float, wag, flip and spin
      mesh.position.copy(pos);
      mesh.position.y += Math.sin(t * 2.4) * 0.06;
      if (view && !owner) mesh.lookAt(view.head.x, mesh.position.y, view.head.z);
      else if (owner && controller) mesh.rotation.set(0, controller.camYaw, 0);
      const upside = action?.id === 'upside_down';
      if (flip > 0) flip = Math.max(0, flip - dt * 1.6);
      if (spin > 0) spin = Math.max(0, spin - dt);
      pose.rotation.set(flip * Math.PI * 2, spin * 12, upside ? Math.PI : 0);
      const nap = action?.id === 'bubble_nap';
      bubble.visible = nap; zzz.visible = nap;
      pose.scale.setScalar(nap ? 0.85 : 1);
      const wag = upside ? 9 : nap ? 1 : 3.5;
      for (let i = 0; i < tail.length; i++) {
        const u = i / tail.length;
        const sw = Math.sin(t * wag - u * 4) * u * 0.18;
        if (nap) tail[i].position.set(Math.cos(u * 5) * 0.2, -0.08, Math.sin(u * 5) * 0.2);
        else tail[i].position.set(sw, (upside ? 0.05 + u * 0.35 : -0.02 + u * 0.32 * Math.sin(u * 2.4)), -0.17 - u * 0.42);
      }
      const last = tail[tail.length - 1].position;
      tip.position.copy(last).add(new THREE.Vector3(0, nap ? 0 : 0.05, -0.03));
      zzz.material.opacity = 0.6 + Math.sin(t * 2) * 0.3;

      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i]; b.t += dt / 0.6;
        b.s.position.lerpVectors(b.from, b.to, Math.min(1, b.t)); b.s.position.y += Math.sin(Math.min(1, b.t) * Math.PI) * 0.6;
        if (b.t >= 1) { scene.remove(b.s); blobs.splice(i, 1); hooks.blobHit && hooks.blobHit(b.to); }
      }
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]; p.t += dt;
        p.s.position.addScaledVector(p.v, dt); p.v.y -= dt * 1.2;
        p.s.material.opacity = 1 - p.t;
        if (p.t > 1) { scene.remove(p.s); petals.splice(i, 1); }
      }
    },
    // the finale: spin up in a column of light and vanish
    hidden: false,
  };
  return self;
}

// Petals and sparkles bursting over the screen when a magic blob lands on her.
export function screenSplash() {
  const el = document.createElement('div');
  el.className = 'splash';
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('i');
    s.textContent = ['✿', '✦', '❀', '♥', '✧'][i % 5];
    s.style.left = `${30 + Math.random() * 40}%`; s.style.top = `${30 + Math.random() * 40}%`;
    s.style.setProperty('--dx', `${(Math.random() - 0.5) * 70}vw`); s.style.setProperty('--dy', `${(Math.random() - 0.5) * 70}vh`);
    s.style.color = ['#ffb3de', '#fff2b0', '#bff6ff', '#ff8ad8', '#d9c4ff'][i % 5];
    el.append(s);
  }
  document.body.append(el);
  setTimeout(() => el.remove(), 1600);
}
