// Third-person controls: WASD / arrows to walk, Shift to run, Space to jump,
// drag to look around, scroll to zoom, V to switch to first person. On touch screens: left thumb moves,
// right thumb looks.
import * as THREE from 'three';
import { groundAt, resolveCollisions, SPAWN, MAIN, CASTLE } from './world/layout.js';

// arrive facing along the long bridge towards the castle
const SPAWN_FACING = Math.atan2(CASTLE.x - SPAWN.x, CASTLE.z - SPAWN.z);   // straight up the Grand Approach

const UP = new THREE.Vector3(0, 1, 0);

export class Controller {
  constructor(camera, dom) {
    this.camera = camera;
    this.dom = dom;
    this.pos = new THREE.Vector3(SPAWN.x, (groundAt(SPAWN.x, SPAWN.z) ?? MAIN.y) + 0.5, SPAWN.z);
    this.firstPerson = true;          // first person by default; V switches to the follow camera
    this.vel = new THREE.Vector3();
    this.facing = SPAWN_FACING;
    this.camYaw = SPAWN_FACING; this.camPitch = 0.04; this.camDist = 7.5;
    this.keys = new Set();
    this.onGround = true;
    this.locked = false;
    this.speed = 0;
    this.stepAcc = 0;
    this.onStep = null; this.onTap = null; this.onFallReset = null;
    this.camTarget = new THREE.Vector3();
    this.joy = null;
    this.bind();
  }

  bind() {
    const typing = () => /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
    addEventListener('keydown', (e) => {
      if (typing()) return;
      this.keys.add(e.code);
      if (e.code === 'Space') e.preventDefault();
      if (e.code === 'KeyV' && !e.repeat) this.firstPerson = !this.firstPerson;
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());

    let drag = null;
    this.dom.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' && e.clientX < innerWidth * 0.4) {
        this.joy = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: 0, y: 0 };
        this.showJoy(e.clientX, e.clientY, true);
        return;
      }
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 };
      this.dom.setPointerCapture?.(e.pointerId);
    });
    this.dom.addEventListener('pointermove', (e) => {
      if (this.joy && e.pointerId === this.joy.id) {
        const dx = e.clientX - this.joy.x0, dy = e.clientY - this.joy.y0, m = Math.min(1, Math.hypot(dx, dy) / 60);
        const a = Math.atan2(dy, dx);
        this.joy.x = Math.cos(a) * m; this.joy.y = Math.sin(a) * m;
        this.showJoy(this.joy.x0 + this.joy.x * 40, this.joy.y0 + this.joy.y * 40, false);
        return;
      }
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      drag.x = e.clientX; drag.y = e.clientY;
      this.camYaw -= dx * 0.005;
      this.camPitch = THREE.MathUtils.clamp(this.camPitch + dy * 0.004, this.firstPerson ? -1.2 : -0.15, 1.2);
    });
    const end = (e) => {
      if (this.joy && e.pointerId === this.joy.id) { this.joy = null; this.showJoy(0, 0, false, true); return; }
      if (drag && e.pointerId === drag.id) {
        if (drag.moved < 6 && this.onTap) this.onTap((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
        drag = null;
      }
    };
    this.dom.addEventListener('pointerup', end);
    this.dom.addEventListener('pointercancel', end);
    this.dom.addEventListener('wheel', (e) => {
      this.camDist = THREE.MathUtils.clamp(this.camDist + e.deltaY * 0.01, 1.2, 22);
      // scrolling all the way in becomes first person, scrolling out leaves it
      if (this.camDist <= 1.2 && e.deltaY < 0) this.firstPerson = true;
      else if (e.deltaY > 0 && this.firstPerson) { this.firstPerson = false; this.camDist = 3; }
    }, { passive: true });
  }

  showJoy(x, y, start, hide) {
    let base = document.getElementById('joy');
    if (!base) {
      base = document.createElement('div'); base.id = 'joy';
      base.innerHTML = '<div></div>';
      document.body.appendChild(base);
    }
    if (hide) { base.style.display = 'none'; return; }
    base.style.display = 'block';
    if (start) { base.style.left = x + 'px'; base.style.top = y + 'px'; }
    const knob = base.firstChild;
    knob.style.transform = `translate(${(x - parseFloat(base.style.left))}px, ${(y - parseFloat(base.style.top))}px)`;
  }

  teleport(x, y, z, facing) {
    this.pos.set(x, y, z); this.vel.set(0, 0, 0);
    if (facing !== undefined) { this.facing = facing; this.camYaw = facing; }
  }

  update(dt) {
    if (this.locked) { this.speed = 0; return; }
    const k = this.keys;
    let ix = 0, iz = 0;
    if (k.has('KeyW') || k.has('ArrowUp')) iz += 1;
    if (k.has('KeyS') || k.has('ArrowDown')) iz -= 1;
    if (k.has('KeyA') || k.has('ArrowLeft')) ix -= 1;
    if (k.has('KeyD') || k.has('ArrowRight')) ix += 1;
    if (this.joy) { ix += this.joy.x; iz -= this.joy.y; }
    const len = Math.hypot(ix, iz);
    const run = k.has('ShiftLeft') || k.has('ShiftRight') || (this.joy && len > 0.9);
    const target = new THREE.Vector3();
    if (len > 0.01) {
      const fwd = new THREE.Vector3(Math.sin(this.camYaw), 0, Math.cos(this.camYaw));
      const right = new THREE.Vector3().crossVectors(fwd, UP);
      target.addScaledVector(fwd, iz).addScaledVector(right, ix).normalize().multiplyScalar((run ? 12 : 6) * Math.min(1, len));
      const want = Math.atan2(target.x, target.z);
      let d = want - this.facing;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      this.facing += d * Math.min(1, dt * 10);
    }
    const accel = this.onGround ? 12 : 3;
    this.vel.x += (target.x - this.vel.x) * Math.min(1, dt * accel);
    this.vel.z += (target.z - this.vel.z) * Math.min(1, dt * accel);
    if (this.onGround && k.has('Space')) { this.vel.y = 8.5; this.onGround = false; }
    this.vel.y -= 24 * dt;

    const before = this.pos.clone();
    this.pos.addScaledVector(this.vel, dt);
    resolveCollisions(this.pos, 0.45);

    let g = groundAt(this.pos.x, this.pos.z, this.pos.y + 1);
    // too steep to walk up (cliffs, walls of rock): stay where you were
    if (g !== null && this.onGround && g - before.y > 0.35 + Math.hypot(this.pos.x - before.x, this.pos.z - before.z) * 1.4) {
      this.pos.x = before.x; this.pos.z = before.z;
      g = groundAt(this.pos.x, this.pos.z, this.pos.y + 1);
    }
    if (g !== null && this.pos.y <= g + 0.02 && g - this.pos.y < 0.8 && this.vel.y <= 0) {
      this.pos.y = g; this.vel.y = 0; this.onGround = true;
    } else if (g === null || this.pos.y > g + 0.05) {
      this.onGround = false;
    }
    if (this.pos.y < -45) {
      this.teleport(SPAWN.x, (groundAt(SPAWN.x, SPAWN.z) ?? MAIN.y) + 3, SPAWN.z, SPAWN_FACING);
      this.onFallReset && this.onFallReset();
    }

    const moved = Math.hypot(this.pos.x - before.x, this.pos.z - before.z);
    this.speed = moved / Math.max(dt, 1e-4);
    if (this.onGround) {
      this.stepAcc += moved;
      if (this.stepAcc > 1.4) { this.stepAcc = 0; this.onStep && this.onStep(this.pos.x, this.pos.z); }
    }
  }

  updateCamera(dt, avatarRoot) {
    const head = this.camTarget.lerp(new THREE.Vector3(this.pos.x, this.pos.y + 1.6, this.pos.z), Math.min(1, dt * 10));
    const cp = Math.cos(this.camPitch), sp = Math.sin(this.camPitch);
    if (this.firstPerson) {
      // eyes at 1.6 m, looking where you drag
      this.camera.position.set(this.pos.x, this.pos.y + 1.6, this.pos.z);
      this.camTarget.copy(this.camera.position);
      this.camera.lookAt(this.pos.x + Math.sin(this.camYaw) * cp, this.pos.y + 1.6 - sp, this.pos.z + Math.cos(this.camYaw) * cp);
      if (avatarRoot) { avatarRoot.position.copy(this.pos); avatarRoot.rotation.y = this.facing; avatarRoot.visible = false; }
      return;
    }
    if (avatarRoot) avatarRoot.visible = true;
    const want = new THREE.Vector3(
      head.x - Math.sin(this.camYaw) * cp * this.camDist,
      head.y + sp * this.camDist,
      head.z - Math.cos(this.camYaw) * cp * this.camDist,
    );
    const g = groundAt(want.x, want.z, want.y);
    if (g !== null) want.y = Math.max(want.y, g + 0.6);
    this.camera.position.lerp(want, Math.min(1, dt * 8));
    this.camera.lookAt(head);
    if (avatarRoot) {
      avatarRoot.position.copy(this.pos);
      avatarRoot.rotation.y = this.facing;
    }
  }
}
