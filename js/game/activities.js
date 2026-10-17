// The eight game templates (schema: templates) as reusable controllers. Each
// place picks one for its game and one for its challenge. Every screen runs
// the same simulation from the same seed; things players do (a hit, a pickup,
// an answer) travel as small events so every screen stays in step.
//
// A controller is: { title, hint, combat, update(dt, t), apply(op), targets(),
//                    progress(), won, failed, dispose() }
import * as THREE from 'three';
import { rng, glowTexture, sparkleTexture } from '../world/textures.js';
import { glowBasic, toon } from '../world/materials.js';
import { groundAt } from '../world/layout.js';
import { CONFIG } from '../config.js';

const LIMIT = { harmony_puzzle: 150, race: 150, arena_defence: 240, boss_purification: 300, party_game: 60, escort: 200, gather_build: 200, heart_quiz: 240 };

// ---- shared bits ---------------------------------------------------------------
const glowSprite = (color, size, opacity = 1) => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
  s.scale.setScalar(size); return s;
};
let shadowGeo, shadowMat, shadowEdge;
// Shadow-glass creatures: dark crystal with a violet heart. No eyes, ever.
function shadowCreature(size = 1) {
  shadowGeo ||= new THREE.OctahedronGeometry(0.8, 0);
  shadowMat ||= new THREE.MeshStandardMaterial({ color: '#241c3a', emissive: '#5a1a8a', emissiveIntensity: 0.7, roughness: 0.2, metalness: 0.5, flatShading: true });
  shadowEdge ||= new THREE.MeshBasicMaterial({ color: '#c78aff', wireframe: true, transparent: true, opacity: 0.5 });
  const g = new THREE.Group();
  const body = new THREE.Mesh(shadowGeo, shadowMat); body.scale.set(1, 1.5, 1);
  const edge = new THREE.Mesh(shadowGeo, shadowEdge); edge.scale.set(1.04, 1.56, 1.04);
  const f1 = new THREE.Mesh(shadowGeo, shadowMat); f1.scale.set(0.35, 0.9, 0.35); f1.position.set(0.7, -0.2, 0); f1.rotation.z = -0.6;
  const f2 = f1.clone(); f2.position.x = -0.7; f2.rotation.z = 0.6;
  g.add(body, edge, f1, f2, glowSprite('#b45aff', 2.6, 0.7));
  g.scale.setScalar(size);
  return g;
}
function ringMesh(r, color, tube = 0.12) {
  return new THREE.Mesh(new THREE.TorusGeometry(r, tube, 8, 40), glowBasic(color));
}
function disposeTree(root) {
  root.traverse((o) => { if (o.geometry && o.geometry !== shadowGeo) o.geometry.dispose(); if (o.material && ![shadowMat, shadowEdge].includes(o.material)) o.material.dispose?.(); });
  root.parent && root.parent.remove(root);
}

function base(ctx, tpl) {
  const root = new THREE.Group();
  ctx.scene.add(root);
  const ground = (x, z) => Math.max(0.2, groundAt(x, z, ctx.spot.y + 40));
  return {
    root, ground,
    limit: LIMIT[tpl] || 180,
    combat: false, won: false, failed: false,
    targets: () => [],
    apply() {},
    progress: () => '',
    dispose() { disposeTree(root); },
  };
}
// the party size the host saw when the game began, so every screen scales it alike
const n = (ctx) => Math.max(1, ctx.party || ctx.players().length);
// foes and bosses grow with the party: base x (0.5 + 0.1 x players), 16 players at most
const scale = (ctx) => 0.5 + 0.1 * Math.min(16, n(ctx));
const atRing = (c, r, a, y) => new THREE.Vector3(c.x + Math.cos(a) * r, y, c.z + Math.sin(a) * r);

// ---- 1. Harmony puzzle: pads that must all glow at once ---------------------------
function harmony(ctx) {
  const A = base(ctx, 'harmony_puzzle');
  // more than 8 players split into two teams, each with its own ring of pads
  const teams = n(ctx) > 8 ? 2 : 1;
  const per = teams === 2 ? 5 : Math.min(6, Math.max(3, n(ctx) + 1));
  const nodes = per * teams;
  const linger = 3 + 8 / Math.min(8, n(ctx));          // alone you must run; together you just stand
  const pads = [];
  for (let i = 0; i < nodes; i++) {
    const t = Math.floor(i / per), c = teams === 2 ? ctx.spot.clone().add(new THREE.Vector3(t ? 16 : -16, 0, 0)) : ctx.spot;
    const p = atRing(c, teams === 2 ? 7 : 9, ((i % per) / per) * Math.PI * 2, 0);
    p.y = A.ground(p.x, p.z) + 0.05;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.6, 28), new THREE.MeshBasicMaterial({ color: '#5a6aa8', transparent: true, opacity: 0.8 }));
    disc.rotation.x = -Math.PI / 2; disc.position.copy(p);
    const ring = ringMesh(1.7, '#bfe4ff', 0.06); ring.rotation.x = Math.PI / 2; ring.position.copy(p);
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.4, 12, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#ffd47a', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    col.position.copy(p).add(new THREE.Vector3(0, 6, 0));
    A.root.add(disc, ring, col);
    pads.push({ p, disc, col, lit: 0 });
  }
  A.title = 'Light every pad at once';
  A.hint = `Stand on the pads. Each one stays lit for ${linger.toFixed(0)} s after you step off.`;
  A.update = (dt) => {
    const ps = ctx.players();
    let all = true;
    for (const pad of pads) {
      if (ps.some((q) => Math.hypot(q.pos.x - pad.p.x, q.pos.z - pad.p.z) < 1.8 && Math.abs(q.pos.y - pad.p.y) < 3)) pad.lit = linger;
      else pad.lit = Math.max(0, pad.lit - dt);
      const k = pad.lit / linger;
      pad.disc.material.color.setHSL(0.13, 0.9, 0.3 + 0.4 * k);
      pad.col.material.opacity = 0.55 * k;
      if (pad.lit <= 0) all = false;
    }
    if (all) A.won = true;
  };
  A.progress = () => `${pads.filter((p) => p.lit > 0).length} / ${nodes} lit`;
  return A;
}

// ---- 2. Race: rings in order, first home wins it for everyone -------------------
function race(ctx) {
  const A = base(ctx, 'race');
  const R = rng(ctx.seed);
  const count = 8;
  const rings = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = 30 + R() * 28;
    const p = atRing(ctx.spot, r, a, 0); p.y = A.ground(p.x, p.z) + 2.2;
    const m = ringMesh(2.4, '#9fe8ff', 0.18); m.position.copy(p); m.rotation.y = -a;
    A.root.add(m);
    rings.push({ p, m });
  }
  const finish = ringMesh(3, '#ffd47a', 0.25); finish.position.copy(rings[0].p); finish.rotation.y = 0; finish.visible = false; A.root.add(finish);
  let next = 0;
  const finished = [];
  A.title = 'Race through the rings';
  A.hint = 'Run (Shift) through every ring in order, then back through the first.';
  A.update = (dt, t) => {
    finish.visible = next === count;
    if (next > count) return;
    const me = ctx.mePos();
    const target = next < count ? rings[next].p : rings[0].p;
    rings.forEach((r, i) => { r.m.material.color.set(i === next ? '#ffd47a' : i < next ? '#4a5a7a' : '#9fe8ff'); r.m.rotation.z = t; });
    if (Math.hypot(me.x - target.x, me.z - target.z) < 3.2 && Math.abs(me.y + 1 - target.y) < 4) {
      next++;
      if (next > count) ctx.send({ op: 'fin' });
    }
  };
  A.apply = (op, from) => { if (op.op === 'fin' && !finished.includes(from)) { finished.push(from); A.won = true; ctx.toast(`${ctx.nameOf(from)} crossed the line first ✦`); } };
  A.progress = () => next > count ? 'Home!' : `Ring ${Math.min(next + 1, count)} / ${count}${next === count ? ' (back to the start)' : ''}`;
  return A;
}

// ---- 3. Arena defence: waves of shadow-glass creatures ------------------------------
function arena(ctx) {
  const A = base(ctx, 'arena_defence');
  A.combat = true;
  const waves = 3;
  const per = Math.max(3, Math.round(8 * scale(ctx)));
  let wave = 0, waveT = 0;
  let foes = [];
  const spawnWave = () => {
    foes.forEach((f) => A.root.remove(f.m));
    const R = rng(ctx.seed + wave * 101);
    foes = [];
    for (let i = 0; i < per; i++) {
      const m = shadowCreature(1 + (wave === waves - 1 && i === 0 ? 1 : 0));
      A.root.add(m);
      foes.push({ id: `w${wave}_${i}`, a: R() * Math.PI * 2, delay: i * 0.8, hp: wave === waves - 1 && i === 0 ? 8 : 3, m, pos: new THREE.Vector3(), r: wave === waves - 1 && i === 0 ? 2.4 : 1.4 });
    }
    waveT = 0;
  };
  spawnWave();
  A.title = 'Hold the ground';
  A.hint = 'Click to loose starlight, Q to swing your sword. Keep the shadow-glass off each other.';
  A.update = (dt, t) => {
    waveT += dt;
    const me = ctx.mePos();
    for (const f of foes) {
      if (f.hp <= 0) { f.m.visible = false; continue; }
      const tt = Math.max(0, waveT - f.delay);
      f.m.visible = waveT > f.delay;
      const r = Math.max(4, 34 - 2.2 * tt);
      const a = f.a + 0.25 * tt;
      f.pos.set(ctx.spot.x + Math.cos(a) * r, 0, ctx.spot.z + Math.sin(a) * r);
      f.pos.y = A.ground(f.pos.x, f.pos.z) + 1.4 + Math.sin(t * 3 + f.a) * 0.3;
      f.m.position.copy(f.pos); f.m.rotation.y = t * 1.5;
      if (f.m.visible && Math.hypot(me.x - f.pos.x, me.z - f.pos.z) < 2.2) ctx.combat.hurt(14 * dt);
    }
    if (foes.every((f) => f.hp <= 0)) {
      wave++;
      if (wave >= waves) A.won = true; else { spawnWave(); ctx.toast(`Wave ${wave + 1} of ${waves}`); }
    }
  };
  A.targets = () => foes.filter((f) => f.hp > 0 && f.m.visible);
  A.apply = (op) => {
    if (op.op !== 'hit') return;
    const f = foes.find((q) => q.id === op.id);
    if (f && f.hp > 0) { f.hp--; if (f.hp <= 0) ctx.combat.burst(f.pos, '#d9a8ff', 6); }
  };
  A.progress = () => `Wave ${Math.min(wave + 1, waves)} / ${waves} · ${foes.filter((f) => f.hp > 0).length} left`;
  return A;
}

// ---- 4. Boss purification: weak spots, warning zones, two phases ---------------------
function boss(ctx, place) {
  const A = base(ctx, 'boss_purification');
  A.combat = true;
  const spotsN = n(ctx) > 3 ? 5 : 4;
  const phases = 2;
  let phase = 0;
  const body = shadowCreature(6);
  const centre = ctx.spot.clone(); centre.y += 12;
  body.position.copy(centre);
  A.root.add(body);
  let spots = [];
  const makeSpots = () => {
    spots.forEach((s) => A.root.remove(s.m));
    spots = [];
    for (let i = 0; i < spotsN; i++) {
      const m = new THREE.Group();
      m.add(new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), glowBasic('#ff8ad8')), glowSprite('#ff5ac8', 5));
      A.root.add(m);
      spots.push({ id: `s${phase}_${i}`, hp: Math.max(2, Math.round(5 * scale(ctx))), m, pos: new THREE.Vector3(), r: 1.8, i });
    }
  };
  makeSpots();
  const zones = [];
  let zoneCycle = -1;
  const name = place.bossCreature?.name || place.challenge.name.replace(/^the /, '');
  A.title = `Purify ${name}`;
  A.hint = 'Shoot the glowing weak spots. Step out of the red circles before they burst.';
  A.update = (dt, t) => {
    body.position.y = centre.y + Math.sin(t * 0.8) * 1.5;
    body.rotation.y = t * 0.3;
    const speed = phase ? 0.9 : 0.5;
    for (const s of spots) {
      if (s.hp <= 0) { s.m.visible = false; continue; }
      const a = t * speed + (s.i / spotsN) * Math.PI * 2;
      s.pos.set(centre.x + Math.cos(a) * 9, body.position.y + Math.sin(t * 1.3 + s.i) * 3, centre.z + Math.sin(a) * 9);
      s.m.position.copy(s.pos);
    }
    // warning zones: three every five seconds, two to get clear
    const cyc = Math.floor(t / 5);
    if (cyc !== zoneCycle && t > 3) {
      zoneCycle = cyc;
      const R = rng(ctx.seed + cyc * 7919);
      for (let i = 0; i < 3 + phase; i++) {
        const p = atRing(ctx.spot, 4 + R() * 16, R() * Math.PI * 2, 0); p.y = A.ground(p.x, p.z) + 0.1;
        const m = new THREE.Mesh(new THREE.RingGeometry(3.4, 4, 32), new THREE.MeshBasicMaterial({ color: '#ff3a5a', transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
        m.rotation.x = -Math.PI / 2; m.position.copy(p);
        const fill = new THREE.Mesh(new THREE.CircleGeometry(4, 32), new THREE.MeshBasicMaterial({ color: '#ff3a5a', transparent: true, opacity: 0.25, depthWrite: false }));
        fill.rotation.x = -Math.PI / 2; fill.position.copy(p); fill.scale.setScalar(0.01);
        A.root.add(m, fill);
        zones.push({ p, m, fill, t: 0 });
      }
    }
    const me = ctx.mePos();
    for (let i = zones.length - 1; i >= 0; i--) {
      const z = zones[i]; z.t += dt;
      z.fill.scale.setScalar(Math.min(1, z.t / 2));
      if (z.t >= 2 && z.t - dt < 2) {
        ctx.combat.burst(z.p.clone().add(new THREE.Vector3(0, 1, 0)), '#ff6a8a', 9);
        if (Math.hypot(me.x - z.p.x, me.z - z.p.z) < 4) ctx.combat.hurt(30);
      }
      if (z.t > 2.3) { A.root.remove(z.m, z.fill); z.m.geometry.dispose(); z.fill.geometry.dispose(); zones.splice(i, 1); }
    }
    if (spots.every((s) => s.hp <= 0)) {
      phase++;
      if (phase >= phases) { A.won = true; body.visible = false; } else { makeSpots(); ctx.toast(`${name} rages! Phase ${phase + 1}`); }
    }
  };
  A.targets = () => spots.filter((s) => s.hp > 0);
  A.apply = (op) => {
    if (op.op !== 'hit') return;
    const s = spots.find((q) => q.id === op.id);
    if (s && s.hp > 0) { s.hp--; if (s.hp <= 0) ctx.combat.burst(s.pos, '#fff2b0', 10); }
  };
  A.progress = () => `Phase ${Math.min(phase + 1, phases)} / ${phases} · weak spots ${spots.filter((s) => s.hp > 0).length}`;
  return A;
}

// ---- 5. Party game: pop the rising bubbles, as a team --------------------------------
function party(ctx) {
  const A = base(ctx, 'party_game');
  A.combat = true;
  const R = rng(ctx.seed);
  const goal = Math.round(12 + 4 * Math.min(16, n(ctx)) * 0.8);
  const bubbles = [];
  const bubMat = new THREE.MeshPhongMaterial({ color: '#bfe8ff', emissive: '#5a7aff', emissiveIntensity: 0.3, transparent: true, opacity: 0.45, shininess: 120 });
  const goldMat = new THREE.MeshPhongMaterial({ color: '#ffe08a', emissive: '#c08a20', emissiveIntensity: 0.6, transparent: true, opacity: 0.7, shininess: 120 });
  const geo = new THREE.SphereGeometry(1, 16, 12);
  for (let k = 0; k < 90; k++) {
    const p = atRing(ctx.spot, 4 + R() * 20, R() * Math.PI * 2, 0); p.y = A.ground(p.x, p.z) + 0.8;
    const gold = k % 7 === 6;
    const m = new THREE.Mesh(geo, gold ? goldMat : bubMat); m.visible = false; m.scale.setScalar(gold ? 1.1 : 0.9);
    A.root.add(m);
    bubbles.push({ id: `b${k}`, t0: k * 0.65, base: p, m, pos: p.clone(), r: 1.3, gold, popped: false });
  }
  const scores = new Map();
  let team = 0;
  A.title = 'Bubble pop';
  A.hint = `Pop ${goal} bubbles together before time runs out. Gold ones count three.`;
  A.limit = 70;
  A.update = (dt, t) => {
    for (const b of bubbles) {
      const age = t - b.t0;
      b.m.visible = !b.popped && age > 0 && age < 12;
      if (!b.m.visible) continue;
      b.pos.set(b.base.x + Math.sin(age * 1.3 + b.t0) * 1.2, b.base.y + age * 1.2, b.base.z + Math.cos(age + b.t0) * 1.2);
      b.m.position.copy(b.pos);
    }
    if (team >= goal) A.won = true;
  };
  A.targets = () => bubbles.filter((b) => b.m.visible);
  A.apply = (op, from) => {
    if (op.op !== 'hit') return;
    const b = bubbles.find((q) => q.id === op.id);
    if (!b || b.popped) return;
    b.popped = true; b.m.visible = false;
    const pts = b.gold ? 3 : 1;
    team += pts; scores.set(from, (scores.get(from) || 0) + pts);
    ctx.combat.burst(b.pos, b.gold ? '#ffe08a' : '#bfe8ff', 4);
  };
  A.progress = () => `${team} / ${goal}` + [...scores].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, s]) => ` · ${ctx.nameOf(id)} ${s}`).join('');
  return A;
}

// ---- 6. Escort: bring the lantern spirit home with light left -----------------------
function escort(ctx) {
  const A = base(ctx, 'escort');
  A.combat = true;
  const R = rng(ctx.seed);
  const dir = R() * Math.PI * 2;
  const from = atRing(ctx.spot, 30, dir, 0), to = atRing(ctx.spot, 30, dir + Math.PI, 0);
  const len = from.distanceTo(to), speed = 1.5, travel = len / speed;
  const spirit = new THREE.Group();
  spirit.add(new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), glowBasic('#fff2b0')), glowSprite('#ffcf7a', 6));
  const goal = ringMesh(3, '#9dffcf', 0.15); goal.rotation.x = Math.PI / 2; goal.position.copy(to); goal.position.y = A.ground(to.x, to.z) + 0.2;
  A.root.add(spirit, goal);
  let light = 100;
  const wisps = [];
  for (let k = 0; k < 40; k++) {
    const m = shadowCreature(0.6); m.visible = false; A.root.add(m);
    wisps.push({ id: `x${k}`, t0: 3 + k * (2.4 / (1 + 0.15 * n(ctx))), a: R() * Math.PI * 2, m, pos: new THREE.Vector3(), r: 1.1, dead: false, done: false });
  }
  const sp = new THREE.Vector3();
  let lightSend = 0;
  A.title = 'Guide the lantern spirit';
  A.hint = 'Shadow wisps drink its light. Shoot them before they reach it.';
  A.update = (dt, t) => {
    const k = Math.min(1, t / travel);
    sp.lerpVectors(from, to, k); sp.y = A.ground(sp.x, sp.z) + 2 + Math.sin(t * 2) * 0.3;
    spirit.position.copy(sp);
    spirit.scale.setScalar(0.4 + 0.6 * light / 100);
    for (const w of wisps) {
      const age = t - w.t0;
      w.m.visible = !w.dead && !w.done && age > 0;
      if (!w.m.visible) continue;
      const r = Math.max(0, 22 - age * 3);
      w.pos.set(sp.x + Math.cos(w.a + age * 0.4) * r, sp.y + r * 0.15, sp.z + Math.sin(w.a + age * 0.4) * r);
      w.m.position.copy(w.pos);
      if (r <= 0.5) { w.done = true; light -= 12; ctx.combat.burst(sp, '#5a3a8a', 5); }
    }
    if (ctx.isHost() && (lightSend -= dt) <= 0) { lightSend = 1; ctx.send({ op: 'light', v: light }); }
    if (light <= 0) A.failed = true;
    else if (k >= 1) A.won = true;
  };
  A.targets = () => wisps.filter((w) => w.m.visible);
  A.apply = (op) => {
    if (op.op === 'light') { light = Math.min(light, op.v); return; }
    if (op.op !== 'hit') return;
    const w = wisps.find((q) => q.id === op.id);
    if (w && !w.dead) { w.dead = true; ctx.combat.burst(w.pos, '#d9a8ff', 3); }
  };
  A.progress = () => `Light ${Math.max(0, light | 0)}% · ${Math.round(Math.min(1, (ctx.time() / travel)) * 100)}% of the way`;
  return A;
}

// ---- 7. Team gather and build: carry the pieces home, one each ---------------------
function gather(ctx) {
  const A = base(ctx, 'gather_build');
  const R = rng(ctx.seed);
  const slots = Math.min(10, Math.max(5, 4 + n(ctx)));
  const pieces = [];
  const gemGeo = new THREE.OctahedronGeometry(0.6, 0);
  const cols = ['#ff9bd6', '#9fe8ff', '#ffd47a', '#b8a8ff', '#9dffcf'];
  for (let i = 0; i < slots + 3; i++) {
    const p = atRing(ctx.spot, 12 + R() * 28, R() * Math.PI * 2, 0); p.y = A.ground(p.x, p.z) + 1.2;
    const m = new THREE.Group();
    m.add(new THREE.Mesh(gemGeo, glowBasic(cols[i % cols.length])), glowSprite(cols[i % cols.length], 3));
    m.position.copy(p);
    A.root.add(m);
    pieces.push({ i, p, m, by: null, used: false });
  }
  const site = ctx.spot.clone(); site.y = A.ground(site.x, site.z);
  const ring = ringMesh(4, '#ffd47a', 0.12); ring.rotation.x = Math.PI / 2; ring.position.copy(site).add(new THREE.Vector3(0, 0.15, 0));
  A.root.add(ring);
  const layers = [];
  let filled = 0;
  const layerMat = toon('#fff0f6', { emissive: '#ff9bd6', emissiveIntensity: 0.35 });
  A.title = 'Build it together';
  A.hint = 'Walk over a glowing piece to pick it up, then bring it to the golden circle.';
  A.update = (dt, t) => {
    const me = ctx.mePos();
    const ps = ctx.players();
    const mine = pieces.find((q) => q.by === ctx.meId && !q.used);
    for (const q of pieces) {
      if (q.used) { q.m.visible = false; continue; }
      if (q.by) {
        const carrier = ps.find((x) => x.id === q.by);
        if (carrier) q.m.position.set(carrier.pos.x, carrier.pos.y + 2.6, carrier.pos.z);
      } else {
        q.m.position.y = q.p.y + Math.sin(t * 2 + q.i) * 0.25;
        if (!mine && Math.hypot(me.x - q.p.x, me.z - q.p.z) < 1.8 && !q.asked) { q.asked = true; ctx.send({ op: 'pick', i: q.i }); }
      }
      q.m.rotation.y = t;
    }
    if (mine && Math.hypot(me.x - site.x, me.z - site.z) < 4.2 && !mine.asked2) { mine.asked2 = true; ctx.send({ op: 'drop', i: mine.i }); }
    if (filled >= slots) A.won = true;
  };
  A.apply = (op, from) => {
    const q = pieces[op.i];
    if (!q) return;
    if (op.op === 'pick' && !q.by && !q.used && !pieces.some((x) => x.by === from && !x.used)) q.by = from;
    else if (op.op === 'pick' && q.by !== from) q.asked = false;
    if (op.op === 'drop' && q.by === from && !q.used) {
      q.used = true; filled++;
      const k = layers.length;
      const layer = new THREE.Mesh(new THREE.CylinderGeometry(3.2 - k * 0.25, 3.3 - k * 0.25, 0.8, 24), layerMat);
      layer.position.copy(site).add(new THREE.Vector3(0, 0.4 + k * 0.82, 0));
      A.root.add(layer); layers.push(layer);
      ctx.combat.burst(layer.position, '#ffd47a', 6);
    }
  };
  A.progress = () => `${filled} / ${slots} pieces placed`;
  return A;
}

// ---- 8. Heart quiz: questions about her and each other -----------------------------
function quiz(ctx) {
  const A = base(ctx, 'heart_quiz');
  const R = rng(ctx.seed);
  const qs = [...(CONFIG.quiz || [])].sort(() => R() - 0.5);
  const need = Math.min(4, qs.length);
  let idx = 0, right = 0, answered = new Set();
  const box = document.getElementById('quiz');
  const show = () => {
    const q = qs[idx];
    if (!q) return;
    box.classList.remove('hidden');
    box.querySelector('.q').textContent = q.q;
    const list = box.querySelector('.a'); list.innerHTML = '';
    q.a.forEach((text, i) => {
      const b = document.createElement('button'); b.textContent = text;
      b.onclick = () => { if (!answered.has(idx)) ctx.send({ op: 'ans', q: idx, i }); };
      list.append(b);
    });
    box.querySelector('.who').textContent = 'Anyone can answer: talk it over first!';
  };
  show();
  A.title = 'The heart quiz';
  A.hint = `Answer ${need} right as a team.`;
  A.update = () => { if (right >= need) A.won = true; else if (idx >= qs.length) A.failed = true; };
  A.apply = (op, from) => {
    if (op.op !== 'ans' || op.q !== idx || answered.has(idx)) return;
    answered.add(idx);
    const ok = op.i === qs[idx].right;
    if (ok) right++;
    const btns = box.querySelectorAll('.a button');
    btns[qs[idx].right]?.classList.add('right');
    if (!ok) btns[op.i]?.classList.add('wrong');
    box.querySelector('.who').textContent = `${ctx.nameOf(from)} answered: ${ok ? 'right ✦' : 'not quite'}`;
    setTimeout(() => { idx++; if (right < need) show(); }, 1800);
  };
  A.progress = () => `${right} / ${need} right`;
  const dispose = A.dispose;
  A.dispose = () => { box.classList.add('hidden'); dispose(); };
  return A;
}

const FACTORY = { harmony_puzzle: harmony, race, arena_defence: arena, boss_purification: boss, party_game: party, escort, gather_build: gather, heart_quiz: quiz };

export function createActivity(template, ctx, place) {
  const f = FACTORY[template] || party;
  const a = f(ctx, place);
  a.template = template;
  return a;
}
export const TEMPLATE_IDS = Object.keys(FACTORY);
