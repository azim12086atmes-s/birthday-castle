// Cinematic scenes (schema: cinema, cutscenes, places[].scene, characters[].dialogue).
// Every scene is the live world seen through a moving camera, never a video: each shot
// of a schema cutscene becomes one camera move round its subject (a place, a head, the
// Great Lantern, the group, the Mew…), with letterbox bars, subtitles, and a soft
// babbling voice per speaker. A reusable scene plays in full the first time it is seen
// on this device and in its short version after that. Scenes queue: a place visit is
// a run of them (travel, enter_place, meet_people, frozen_head, head_freed, shard,
// farewell), so play() takes one id or a list.
import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { groundAt, PAL, CASTLE } from '../world/layout.js';
import { toon } from '../world/materials.js';

const $ = (id) => document.getElementById(id);
const SEEN_KEY = 'castle-scenes-seen';
const up = (v, h) => v.clone().add(new THREE.Vector3(0, h, 0));
const smooth = (k) => k * k * (3 - 2 * k);
const lerp = THREE.MathUtils.lerp;

// words for the shots the schema leaves without a line
const NARRATION = {
  arrival: { 0: 'Far beyond the sea mountains, a ride is waiting for you…', 2: 'The white falls part like curtains.', 4: 'A crescent of mountains. Thirty-two places. One palace, glowing in the middle.', 7: 'Tonight is a birthday.' },
  ship_docks: { 0: 'A shadow passes over the palace…', 2: 'The gentlemen have arrived ✦' },
  the_hush: { 0: 'Just as the lanterns were lit for her…', 1: 'the Hush crept in from the sea, and the music fell still.', 3: 'The Great Birthday Lantern shattered into thirty-two star shards.', 4: 'Colour drained from the land, place by place.' },
  return_palace: { 0: 'Night falls. Everyone you freed sets off for the palace.', 1: 'Gondolas, longboats, dragons and lanterns, all heading home.', 2: 'The Hush waits in the heart of the palace.' },
  finale: { 0: 'The clock strikes midnight.', 1: 'The glass roof opens like a flower.', 2: 'The floor rises into the sky.', 4: 'A cake, cut with ribbons of light.', 5: 'A slice floats to every guest.' },
  travel: { 1: 'Over the crescent, together.' },
  enter_place: { 1: 'The creatures hide…' },
  befriend: {},
};
const VOICELESS = { the_hush: 'Such a bright night. Let it sleep. Let every colour sleep.' };

// the colours each effect throws into the scene
const FX = {
  mist: ['#e8f6ff', 6], rainbow: ['#ffd6f0', 5], confetti: ['#ffd47a', 4], petals: ['#ff9bd6', 4], sparkles: ['#fff3c8', 3],
  petal_burst: ['#ffb3de', 8], gold_glow: ['#ffd47a', 5], bond_ribbon: ['#ff9bd6', 3], fireworks: ['#9ad8ff', 14],
  jellyfish: ['#b9a2ff', 10], dragon_fire: ['#ff9a4a', 12], shadow_mist: ['#3a2a5a', 10], colour_wave: ['#9affd8', 10],
};

let AC = null;
function babble(text, who) {
  try { AC ||= new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  if (AC.state === 'suspended') AC.resume();
  let h = 0; for (const ch of who || '') h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const base = who === 'the_hush' ? 95 : 170 + (h % 230);
  const n = Math.min(26, Math.max(4, Math.round(text.length / 4)));
  const t0 = AC.currentTime + 0.05;
  for (let i = 0; i < n; i++) {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = who === 'the_hush' ? 'sawtooth' : 'triangle';
    o.frequency.value = base * (1 + 0.22 * Math.sin(i * 1.9 + h)) * (i === n - 1 ? 0.85 : 1);
    const s = t0 + i * 0.09;
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.05, s + 0.015); g.gain.exponentialRampToValueAtTime(0.001, s + 0.075);
    o.connect(g).connect(AC.destination); o.start(s); o.stop(s + 0.09);
  }
}

// a villager to greet the group: a soft robe and a veil, no face
function makeLocal(color) {
  const g = new THREE.Group();
  const robe = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5, 10, 1, true), toon(color, { side: THREE.DoubleSide, emissive: color, emissiveIntensity: 0.15 }));
  robe.position.y = 0.75;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), toon('#ffe2cc')); head.position.y = 1.68;
  const veil = new THREE.Mesh(new THREE.SphereGeometry(0.23, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6), toon('#fff3e0')); veil.position.y = 1.72;
  g.add(robe, head, veil);
  return g;
}

export function createCinema(o) {
  const { data, camera, controller, ui, places, visuals, combat, scene } = o;
  const cuts = Object.fromEntries(data.cutscenes.map((c) => [c.id, c]));
  const chars = Object.fromEntries(data.characters.map((c) => [c.id, c]));
  const qs = new URLSearchParams(location.search);
  const off = qs.get('scenes') === '0';
  const speed = +qs.get('scenespeed') || 1;     // for testing
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}'); } catch { /* private mode */ }
  const her = CONFIG.honoreeName || 'you';

  const queue = [];
  let cur = null;          // { cut, ctx, shots, i, t, run, votes }
  let local = null;        // the villager standing in for a place's people
  const baseFov = camera.fov;

  // ---- where each subject is ----------------------------------------------------------
  function where(subject, c) {
    const spot = c.place ? places.spotOf(c.place) : null;
    const group = o.group();
    const L = visuals.lanternPos;
    switch (subject) {
      case 'place': case 'B08': return spot ? { p: up(spot, 8), r: 70 } : { p: group, r: 40 };
      case 'plaza': case 'people': return spot ? { p: up(spot, 2), r: 22 } : { p: group, r: 15 };
      case 'head': return spot ? { p: up(spot, 1.6), r: 2.6 } : { p: up(group, 1.6), r: 3 };
      case 'local': return local ? { p: up(local.position, 1.3), r: 2.2 } : { p: up(group, 1.5), r: 3 };
      case 'creature': return spot ? { p: up(spot.clone().add(new THREE.Vector3(7, 0, -5)), 1), r: 2.5 } : { p: group, r: 3 };
      case 'boss': return spot ? { p: up(spot, 22), r: 16 } : { p: up(group, 20), r: 16 };
      case 'shard': return spot ? { p: up(spot, 5), r: 5 } : { p: up(group, 4), r: 5 };
      case 'lantern': case 'sky_lantern': return { p: L.clone(), r: 230 };
      case 'sky': return { p: L.clone(), r: 600 };
      case 'the_hush': return { p: up(L, -260), r: 160 };
      case 'crescent': return { p: new THREE.Vector3(0, 200, 1500), r: 8000 };
      case 'palace': return { p: new THREE.Vector3(0, PAL.y + 260, 0), r: 460 };
      case 'palace_doors': return { p: new THREE.Vector3(0, CASTLE.y + 50, CASTLE.z), r: 70 };
      case 'palace_roof': return { p: new THREE.Vector3(0, PAL.y + 650, 0), r: 320 };
      case 'theatre': return { p: up(L, -500), r: 260 };
      case 'docks': return { p: new THREE.Vector3(-710, 4, 12158), r: 140 };
      case 'gate': return { p: new THREE.Vector3(-710, 90, 11158), r: 150 };
      case 'ride': return { p: new THREE.Vector3(-710, 6, lerp(12158, 11158, c.k ?? 0)), r: 40 };
      case 'bridge': return { p: new THREE.Vector3(0, 30, 4300), r: 900 };
      case 'route': {
        if (!c.from || !c.to) return { p: group, r: 200 };
        return { p: c.from.clone().lerp(c.to, 0.5).setY(Math.max(c.from.y, c.to.y) + 150), r: Math.max(200, c.from.distanceTo(c.to) / 2), route: true };
      }
      case 'flying_ship': case 'ship': { const s = c.shipRider && o.shipPos(c.shipRider); return { p: s || up(group, 30), r: 28 }; }
      case 'mew': return { p: o.mewPos(), r: 0.7, partner: true };
      case 'owner': return { p: up(o.ownerPos() || o.mewPos(), 0), r: 1.6, partner: true };
      case 'courtier': return { p: up(group, 1.5), r: 3, partner: true };
      case 'cake': return { p: up(group, 1), r: 3 };
      case 'hall': case 'friends': case 'guests': case 'group': default: return { p: up(group, 1.4), r: 9 };
    }
  }

  // ---- one camera move per shot type -------------------------------------------------
  const pos = new THREE.Vector3(), look = new THREE.Vector3();
  function frame(type, W, k, yaw, c) {
    const s = smooth(k), P = W.p, r = W.r;
    const dir = (a) => new THREE.Vector3(Math.sin(a), 0, Math.cos(a));
    const at = (a, d, h) => pos.copy(P).addScaledVector(dir(a), d).setY(P.y + h);
    let fov = 50;
    look.copy(P);
    switch (type) {
      case 'establishing_aerial': at(yaw - 0.45 + 0.8 * k, 2.3 * r, (1.15 - 0.2 * k) * r); fov = 55; break;
      case 'flyover':
        if (W.route) { pos.copy(c.from).lerp(c.to, 0.1 + 0.75 * k).setY(P.y + 120); look.copy(c.from).lerp(c.to, 0.35 + 0.65 * k).setY(P.y - 60); }
        else { const side = dir(yaw + Math.PI / 2); pos.copy(P).addScaledVector(side, lerp(-1.4, 1.4, k) * r).addScaledVector(dir(yaw), 0.7 * r).setY(P.y + 0.55 * r); look.copy(P).addScaledVector(side, lerp(-0.4, 0.7, k) * r); }
        fov = 58; break;
      case 'crane_down': at(yaw, 1.4 * r, lerp(1.6, 0.25, s) * r); break;
      case 'crane_up': at(yaw, 1.3 * r, lerp(0.08, 1.1, s) * r); look.y += lerp(0, 0.8, s) * r; fov = 55; break;
      case 'orbit': at(yaw - 0.7 + 1.4 * s, 1.7 * r, 0.35 * r); break;
      case 'whip_pan': at(yaw + 3 * s, 1.7 * r, 0.35 * r); break;
      case 'dolly_in': at(yaw, lerp(3, 1.15, s) * r, 0.25 * r); fov = 42; break;
      case 'dolly_out': at(yaw, lerp(1.15, 3, s) * r, 0.25 * r); break;
      case 'tracking': { const side = dir(yaw + Math.PI / 2); pos.copy(P).addScaledVector(dir(yaw), 2 * r).addScaledVector(side, lerp(-1, 1, k) * r).setY(P.y + 0.3 * r); look.copy(P).addScaledVector(side, lerp(-0.3, 0.3, k) * r); break; }
      case 'two_shot': {
        const Q = o.partner(W.partner) || up(o.mePos(), 1.5);
        const mid = P.clone().lerp(Q, 0.5), d = Math.max(2.5 * r, P.distanceTo(Q) * 1.3, 2.5);
        const a = Math.atan2(Q.x - P.x, Q.z - P.z) + Math.PI / 2 + 0.25 - 0.15 * k;
        pos.copy(mid).addScaledVector(dir(a), d).setY(mid.y + 0.35 * Math.min(d, 6)); look.copy(mid); fov = 45; break;
      }
      case 'close_up': at(yaw + 0.1 * k, lerp(1.3, 1.0, s) * r, 0.08 * r); fov = 38; break;
      case 'insert': at(yaw + 0.6, lerp(1.0, 0.85, s) * r, 0.2 * r); fov = 36; break;
      case 'over_shoulder': {
        const me = up(o.mePos(), 1.7), a = Math.atan2(me.x - P.x, me.z - P.z);
        pos.copy(me).addScaledVector(dir(a), 3).addScaledVector(dir(a + Math.PI / 2), 1.3).setY(me.y + 0.7); fov = 45; break;
      }
      case 'pov':
        // riding through something big (the falls): the camera passes through it
        if (r > 40) { pos.copy(P).addScaledVector(dir(yaw), lerp(1.2, -1.2, k) * r).setY(25); look.copy(pos).addScaledVector(dir(yaw), -100).setY(30); break; }
        { const me = up(o.mePos(), 1.6); pos.copy(me).lerp(P, 0.04 * k); }
        break;
      case 'title_card': at(yaw, lerp(3.4, 3.0, s) * r, 0.9 * r); fov = 55; break;
      case 'wide': case 'fade': default: at(yaw + 0.15 * k, 3.2 * r, 0.9 * r); fov = 55; break;
    }
    // keep the camera out of the ground
    const g = groundAt(pos.x, pos.z, pos.y + 20);
    if (g != null && pos.y < g + 1.5) pos.y = g + 1.5;
    camera.position.copy(pos);
    camera.lookAt(look);
    if (Math.abs(camera.fov - fov) > 0.1) { camera.fov = fov; camera.updateProjectionMatrix(); }
  }

  // ---- lines ---------------------------------------------------------------------------
  function speak(line, c) {
    if (!line) return '';
    const place = c.place;
    let who = line.who, name = '', text = line.text || '';
    if (who === 'local') { name = place?.scene?.local || 'A villager'; text ||= place?.scene?.[line.key] || ''; }
    else if (who === 'head') { const h = place?.headChar; name = h?.name || 'The head'; text ||= h?.dialogue?.[line.key] || h?.lines?.[0] || ''; }
    else if (who === 'mew') name = 'Mew';
    else if (who === 'owner') name = o.ownerName() || 'Mew';
    else if (who === 'the_hush') { name = 'The Hush'; text ||= VOICELESS.the_hush; }
    else { name = chars[who]?.name || who; text ||= chars[who]?.dialogue?.[line.key] || ''; }
    if (!text) return '';
    text = text.replaceAll('{her}', her);
    if (who === 'mew') o.mewSound(); else babble(text, who);
    return `${name}: “${text}”`;
  }

  function fx(names, W) {
    for (const n of names || []) {
      const f = FX[n];
      if (!f) continue;
      const p = W.p.clone().add(new THREE.Vector3((Math.random() - 0.5) * W.r, (Math.random() - 0.2) * W.r * 0.6, (Math.random() - 0.5) * W.r));
      combat.burst(p, f[0], f[1] * THREE.MathUtils.clamp(W.r / 30, 0.3, 2));
    }
  }

  // ---- the player ------------------------------------------------------------------------
  function start(item) {
    const cut = cuts[item.id];
    if (!cut) return false;
    const c = { ...item.ctx };
    const short = cut.shortSeconds && seen[cut.id];
    const scale = short ? cut.shortSeconds / cut.seconds : 1;
    seen[cut.id] = (seen[cut.id] || 0) + 1;
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch { /* ignore */ }
    const shots = cut.shots.map((s, i) => ({ ...s, i, dur: Math.max(1.6, s.seconds * scale) }));
    // the camera looks at a subject from where the group is, so the players stand in shot
    const g = o.group();
    const sp = c.place ? places.spotOf(c.place) : null;
    c.yaw = sp && g.distanceTo(sp) > 1 ? Math.atan2(g.x - sp.x, g.z - sp.z) : 0;
    if (c.place && !local && cut.shots.some((s) => s.subject === 'local' || s.line?.who === 'local')) {
      local = makeLocal(['#ffb3c7', '#b7e4ff', '#d8c7ff', '#c9f2c7'][c.place.id.charCodeAt(2) % 4]);
      const a = c.yaw + 0.9, lp = sp.clone().add(new THREE.Vector3(Math.sin(a) * 5, 0, Math.cos(a) * 5));
      lp.y = groundAt(lp.x, lp.z, lp.y + 5) ?? lp.y;
      local.position.copy(lp); local.lookAt(g.x, lp.y, g.z);
      scene.add(local);
    }
    const mode = cut.id === 'finale' ? 'none' : cut.shortSeconds || cut.skippable === true ? 'local' : 'vote';
    cur = { cut, c, shots, i: -1, t: 0, total: shots.reduce((a, s) => a + s.dur, 0), run: item.run || `${cut.id}:${Math.random().toString(36).slice(2, 7)}`, votes: new Set(), mode, fxAcc: 0 };
    controller.locked = true;
    ui.letterbox(true);
    const skip = $('skip');
    skip.style.display = mode === 'none' && !o.director ? 'none' : '';
    skip.textContent = mode === 'vote' ? 'Vote to skip ▸' : 'Skip ▸';
    ui.onSkip(() => {
      if (!cur) return;
      if (mode === 'local' || o.director) finish(true);
      else if (mode === 'vote') o.voteSkip(cur.run);
    });
    $('cine-fade')?.classList.remove('on');
    o.onState(true);
    return true;
  }

  function finish(skipped) {
    if (!cur) return;
    const done = cur;
    cur = null;
    // the rest of a skipped place visit goes too, except what the story needs
    if (skipped) while (queue.length && done.c.chain && queue[0].chain === done.c.chain) { const d = queue.shift(); d.ctx.onEnd && d.ctx.onEnd(true); }
    done.c.onEnd && done.c.onEnd(skipped);
    if (!queue.length || !next()) end();
  }
  function end() {
    if (local) { scene.remove(local); local = null; }
    ui.letterbox(false); ui.cutsceneText('');
    $('skip').style.display = '';
    $('cine-fade')?.classList.remove('on');
    camera.fov = baseFov; camera.updateProjectionMatrix();
    o.onState(false);
  }
  function next() {
    while (queue.length) if (start(queue.shift())) return true;
    return false;
  }

  function update(dt) {
    if (!cur) return;
    dt *= speed;
    cur.t += dt;
    let t = cur.t, i = 0;
    while (i < cur.shots.length && t > cur.shots[i].dur) { t -= cur.shots[i].dur; i++; }
    if (i >= cur.shots.length) { finish(false); return; }
    const shot = cur.shots[i], k = Math.min(1, t / shot.dur);
    cur.c.k = k;
    const W = where(shot.subject, cur.c);
    if (i !== cur.i) {
      cur.i = i;
      const said = speak(shot.line, cur.c);
      let text = said || NARRATION[cur.cut.id]?.[i] || '';
      let big = false;
      if (shot.type === 'title_card') { text = cur.c.title || cur.c.place?.name || text; big = true; }
      if (cur.cut.id === 'shard' && shot.type === 'insert' && cur.c.shardText) text = cur.c.shardText;
      if (cur.cut.id === 'the_hush' && i === 3 && cur.c.alreadyWon) text += ` ${cur.c.alreadyWon} shards from this week's adventures already shine through ✦`;
      ui.cutsceneText(text, big);
      $('cine-fade')?.classList.toggle('on', shot.type === 'fade');
      o.onShot && o.onShot(cur.cut.id, shot, cur.c);
      if (shot.subject === 'shard' && cur.c.place) visuals.streak(up(places.spotOf(cur.c.place), 3), visuals.lanternPos.clone(), shot.dur + 2);
    }
    if (shot.vfx && (cur.fxAcc -= dt) <= 0) { cur.fxAcc = 0.3; fx(shot.vfx, W); }
    frame(shot.type, W, k, cur.c.yaw, cur.c);
  }

  return {
    // play('id' | ['id', ...], ctx): ctx { place, from, to, shipRider, title, onEnd, run }
    play(ids, ctx = {}) {
      if (off) { ctx.onEnd && ctx.onEnd(true); return; }
      const list = Array.isArray(ids) ? ids : [ids];
      const chain = list.length > 1 ? Math.random() : 0;
      list.forEach((id, n) => queue.push({ id, ctx: { ...ctx, chain, onEnd: n === list.length - 1 ? ctx.onEnd : null }, run: ctx.run && `${ctx.run}:${id}`, chain }));
      if (!cur) next();
    },
    vote(run, from, total) {
      if (!cur || cur.run !== run) return;
      cur.votes.add(from);
      $('skip').textContent = `Vote to skip ▸ ${cur.votes.size}/${Math.floor(total / 2) + 1}`;
      if (cur.votes.size > total / 2) finish(true);
    },
    stop() { queue.length = 0; if (cur) { cur = null; end(); } },
    update,
    get active() { return !!cur; },
    get current() { return cur ? cur.cut.id : null; },
    has: (id) => !!cuts[id],
    off,
  };
}
