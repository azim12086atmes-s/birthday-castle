// What makes the quest feel like a game for each player: a pet to pick (schema: pets),
// starlight earned for every game won and the levels it brings (a steadier aim and a
// faster recovering light), a results card after each game, and a how-to-play card
// on the first visit. Pets follow their owner on every screen (they ride in the
// profile), and like every creature in the world they have no eyes.
import * as THREE from 'three';
import { toon } from '../world/materials.js';
import { glowTexture } from '../world/textures.js';

const $ = (id) => document.getElementById(id);
const KEY = 'castle-progress-v1';
const LEVELS = [0, 30, 80, 150, 250, 400, 600, 850, 1150, 1500];
const LOOK = {
  star_foxes: ['#ffd9a0', 'fox', '#fff4e0'], bunny_cats: ['#ffe4f2', 'bunny', '#ffb8dc'], young_dragons: ['#b9a2ff', 'dragon', '#ffd47a'], cloud_koi: ['#ffb38a', 'fish', '#ffffff'],
  glow_frogs: ['#9affc8', 'frog', '#e8fff2'], fennec_foxes: ['#f3d2a0', 'fennec', '#fff0dc'], griffins: ['#ffe9b0', 'griffin', '#c9a46a'], crystal_hummingbirds: ['#9ad8ff', 'humming', '#e0b8ff'],
};
const POWER = { find_hidden: 'runs ahead to your next target', heal: 'restores your light faster', carry_light: 'breathes sparks at foes', speed: 'makes you a touch quicker', scout: 'hops ahead to your next target', shield: 'softens every blow', fetch: 'grabs things from further away' };
const GUIDES = ['find_hidden', 'scout'];

// a small soft creature with no eyes: body, head, ears or wings, and a tail.
// Every kind has its own shape and its own little motion (see animatePet).
export function makePet(creature) {
  const [col, kind, accent] = LOOK[creature] || ['#ffe4f2', 'bunny', '#ffb8dc'];
  const g = new THREE.Group();
  const rig = new THREE.Group(); g.add(rig);                      // what hops, spins and bobs
  const fur = toon(col, { emissive: col, emissiveIntensity: 0.25 });
  const trim = toon(accent, { emissive: accent, emissiveIntensity: 0.45 });
  const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, parent = rig) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); parent.add(m); return m; };
  const sph = (r) => new THREE.SphereGeometry(r, 14, 10);
  const body = add(sph(0.22), fur, 0, 0.3, 0); body.scale.set(1, 0.85, 1.25);
  const head = add(sph(0.17), fur, 0, 0.52, 0.22);
  const ears = [], wings = [];
  let tail;
  const flies = ['dragon', 'fish', 'griffin', 'humming'].includes(kind);
  if (kind === 'fox' || kind === 'fennec') {
    const big = kind === 'fennec' ? 1.9 : 1;
    for (const s of [-1, 1]) ears.push(add(new THREE.ConeGeometry(0.06 * big, 0.17 * big, 6), fur, s * 0.08 * (big > 1 ? 1.25 : 1), 0.66 + 0.05 * (big - 1), 0.2, 0, 0, -s * 0.35));
    add(new THREE.ConeGeometry(0.07, 0.14, 8), trim, 0, 0.48, 0.38, Math.PI / 2);   // a pale snout
    tail = add(sph(0.12), fur, 0, 0.36, -0.34); tail.scale.set(0.9, 0.9, 2.2);
    add(sph(0.06), trim, 0, 0.42, -0.6);                                               // white tail tip
  } else if (kind === 'bunny') {
    for (const s of [-1, 1]) ears.push(add(new THREE.CapsuleGeometry(0.04, 0.24, 3, 8), fur, s * 0.07, 0.78, 0.17, 0, 0, -s * 0.18));
    for (const s of [-1, 1]) add(new THREE.CapsuleGeometry(0.018, 0.16, 2, 6), trim, s * 0.07, 0.8, 0.2, 0, 0, -s * 0.18);
    add(sph(0.05), trim, 0, 0.47, 0.37);                                                // a pink nose bump
    tail = add(sph(0.09), trim, 0, 0.32, -0.3);
  } else if (kind === 'dragon') {
    for (const s of [-1, 1]) ears.push(add(new THREE.ConeGeometry(0.035, 0.18, 6), trim, s * 0.07, 0.7, 0.17, -0.5, 0, -s * 0.2));
    for (const s of [-1, 1]) { const w = add(new THREE.ConeGeometry(0.22, 0.04, 3), toon(col, { emissive: accent, emissiveIntensity: 0.5, transparent: true, opacity: 0.85 }), s * 0.26, 0.42, -0.02, 0, 0, s * 1.3); w.scale.set(1, 1, 1.8); wings.push(w); }
    for (let i = 0; i < 3; i++) add(new THREE.ConeGeometry(0.03, 0.08, 4), trim, 0, 0.52 - i * 0.06, 0.05 - i * 0.14);
    tail = add(new THREE.ConeGeometry(0.07, 0.42, 6), fur, 0, 0.3, -0.42, -Math.PI / 2);
  } else if (kind === 'fish') {
    body.scale.set(0.9, 0.9, 1.6); head.position.set(0, 0.32, 0.3); head.scale.set(1, 0.9, 1);
    for (const s of [-1, 1]) wings.push(add(new THREE.CircleGeometry(0.13, 10), toon(accent, { emissive: col, emissiveIntensity: 0.4, transparent: true, opacity: 0.8, side: THREE.DoubleSide }), s * 0.2, 0.26, 0.1, 0, s * 1.2, 0));
    tail = add(new THREE.CircleGeometry(0.2, 12), toon(accent, { emissive: col, emissiveIntensity: 0.4, transparent: true, opacity: 0.85, side: THREE.DoubleSide }), 0, 0.3, -0.48, 0, Math.PI / 2, 0);
    tail.scale.set(1, 1.3, 1);
    for (let i = 0; i < 3; i++) add(sph(0.05), trim, (i - 1) * 0.08, 0.42, 0.05 - i * 0.06);    // cloud puffs on its back
  } else if (kind === 'frog') {
    body.scale.set(1.3, 0.7, 1.1); head.position.set(0, 0.42, 0.18); head.scale.set(1.3, 0.8, 1);
    for (const s of [-1, 1]) { add(sph(0.08), fur, s * 0.24, 0.12, -0.08).scale.set(1, 0.6, 1.6); add(sph(0.06), trim, s * 0.12, 0.54, 0.22); }  // legs, and glowing bumps
    tail = add(sph(0.05), trim, 0, 0.36, -0.28);
    for (let i = 0; i < 4; i++) add(sph(0.035), trim, Math.cos(i * 1.6) * 0.14, 0.45, Math.sin(i * 1.6) * 0.12 - 0.05);
  } else if (kind === 'griffin') {
    add(new THREE.ConeGeometry(0.06, 0.16, 6), trim, 0, 0.5, 0.42, Math.PI / 2 + 0.3);   // a golden beak
    for (const s of [-1, 1]) ears.push(add(new THREE.ConeGeometry(0.04, 0.12, 5), trim, s * 0.08, 0.68, 0.16, -0.3, 0, -s * 0.3));
    for (const s of [-1, 1]) { const w = add(sph(0.2), toon('#ffffff', { emissive: col, emissiveIntensity: 0.35 }), s * 0.28, 0.42, -0.02, 0, 0, s * 0.6); w.scale.set(1, 0.22, 0.75); wings.push(w); }
    tail = add(new THREE.CapsuleGeometry(0.03, 0.3, 3, 6), fur, 0, 0.32, -0.38, -1.1); add(sph(0.06), trim, 0, 0.2, -0.52);
  } else if (kind === 'humming') {
    body.scale.set(0.6, 0.6, 0.9); head.scale.setScalar(0.65); head.position.set(0, 0.42, 0.14);
    add(new THREE.ConeGeometry(0.018, 0.22, 5), trim, 0, 0.42, 0.32, Math.PI / 2);        // a long thin beak
    for (const s of [-1, 1]) { const w = add(sph(0.16), toon(accent, { emissive: col, emissiveIntensity: 0.6, transparent: true, opacity: 0.6 }), s * 0.16, 0.38, 0, 0, 0, s * 0.4); w.scale.set(1, 0.12, 0.45); wings.push(w); }
    tail = add(new THREE.ConeGeometry(0.06, 0.2, 4), trim, 0, 0.3, -0.24, -Math.PI / 2);
  }
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: col, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(1.2); halo.position.y = 0.4; rig.add(halo);
  g.scale.setScalar(1.3);
  g.userData = { flies, kind, tail, ears, wings, rig, love: 0 };
  return g;
}

// each kind moves its own way; love (0..1) makes it spin and bounce for joy
function animatePet(mesh, t, moving) {
  const u = mesh.userData;
  const flap = u.kind === 'humming' ? 40 : u.kind === 'fish' ? 5 : 9;
  u.wings.forEach((w, i) => { w.rotation.z = (i ? -1 : 1) * ((u.kind === 'fish' ? 0.2 : 0.7) + Math.sin(t * flap) * (u.kind === 'humming' ? 0.5 : 0.45)); });
  u.ears.forEach((e, i) => { e.rotation.x = Math.sin(t * 3 + i) * 0.12; });
  if (u.tail) { if (u.kind === 'fish') u.tail.rotation.x = Math.sin(t * 6) * 0.5; else u.tail.rotation.y = Math.sin(t * (moving ? 12 : 6)) * 0.5; }
  u.rig.position.y = u.kind === 'frog' || u.kind === 'bunny' ? (moving ? Math.abs(Math.sin(t * 8)) * 0.12 : 0) : 0;
  if (u.love > 0) {
    u.rig.rotation.y = (1 - u.love) * Math.PI * 4;
    u.rig.position.y += Math.abs(Math.sin(u.love * Math.PI * 3)) * 0.35;
  } else u.rig.rotation.y = 0;
}

export function createProgress({ data, scene, combat, ui, profile, net, remotes, saveProfile }) {
  const o = {};
  let P = { starlight: 0, wins: 0 };
  try { P = { ...P, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* private mode */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch { /* ignore */ } };
  const level = () => { let l = 1; for (let i = 0; i < LEVELS.length; i++) if (P.starlight >= LEVELS[i]) l = i + 1; return l; };
  const pets = data.pets || [];
  const cname = Object.fromEntries((data.creatures || []).map((c) => [c.id, c.name]));

  function applyLevel() {
    const l = level();
    combat.reach = 1 + 0.06 * (l - 1);                 // a steadier aim: targets count as a little larger
    combat.regen = 6 + 1.5 * (l - 1) + (profile.pet && petOf(profile.pet)?.power === 'heal' ? 6 : 0);
    combat.armour = petOf(profile.pet)?.power === 'shield' ? 0.75 : 1;
    if (o.controller) o.controller.speedMul = petOf(profile.pet)?.power === 'speed' ? 1.15 : 1;
    let hud = $('lvl');
    if (!hud && $('quest')) { hud = document.createElement('div'); hud.id = 'lvl'; $('quest').append(hud); }
    if (hud) hud.textContent = `✦ Level ${l} · ${P.starlight} starlight`;
  }
  const petOf = (id) => pets.find((p) => p.id === id);

  // ---- the HUD line, the results card, the how-to card, the pet menu ----
  const card = document.createElement('div'); card.id = 'results'; card.className = 'hidden'; document.body.append(card);
  applyLevel();

  function award(amount, why) {
    const before = level();
    P.starlight += amount; P.wins++; save();
    applyLevel();
    if (level() > before) { ui.toast(`✦ Level ${level()}! Your aim steadies and your light recovers faster.`); combat.burst(combatPos(), '#ffd47a', 6); }
    return { amount, why, level: level() };
  }
  const combatPos = () => (o.mePos ? o.mePos().clone().add(new THREE.Vector3(0, 1.4, 0)) : new THREE.Vector3());

  function results({ place, stage, seconds, limit, gained, next, stars: best = [] }) {
    const k = seconds / Math.max(1, limit);
    const stars = k < 0.45 ? 3 : k < 0.75 ? 2 : 1;
    card.innerHTML = `<div class="panel ornate"><div class="t"></div><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div><div class="s"></div><div class="best"></div><div class="n"></div></div>`;
    card.querySelector('.t').textContent = `${place.name}: ${stage} won!`;
    card.querySelector('.s').textContent = `${Math.round(seconds)} s · +${gained.amount} starlight · Level ${gained.level}`;
    card.querySelector('.n').textContent = next || '';
    card.querySelector('.best').textContent = best.length ? 'Stars of the round: ' + best.map(([who, pts], i) => `${['🥇', '🥈', '🥉'][i]} ${who} ${pts}`).join('  ') : '';
    card.classList.remove('hidden');
    clearTimeout(results.tm); results.tm = setTimeout(() => card.classList.add('hidden'), 6500);
  }

  function howTo(onDone) {
    let seen = false;
    try { seen = !!localStorage.getItem('castle-howto-v1'); } catch { /* ignore */ }
    if (seen) return onDone && onDone();
    const m = document.createElement('div'); m.className = 'modal'; m.id = 'howto';
    m.innerHTML = `<div class="panel ornate"><h3>How to play</h3>
      <p class="sub">Win back the 32 star shards of the Great Birthday Lantern before midnight.</p>
      <ul>
        <li><b>Glowing pillars</b> mark the 32 places. Walk up to a place's veiled head and press <b>E</b> to start its game.</li>
        <li>Win the game, then its challenge, and the head is freed: its <b>star shard</b> flies home.</li>
        <li><b>M</b> opens the map: the sky ship sails you anywhere. After the Hush, the whole party sails together.</li>
        <li><b>Click</b> to loose starlight, <b>Q</b> to swing your sword. Taking hits dims your light; it comes back.</li>
        <li><b>WASD</b> to move, mouse to look, <b>Space</b> to jump, <b>V</b> to change the camera.</li>
        <li><b>P</b> opens the <b>party games</b>: play any game with friends, anywhere. <b>J</b> joins a game a friend started.</li>
        <li>Every win earns <b>starlight</b> and levels. Your pet follows you and helps (<b>Z</b> to cuddle it, 🐾 to change it).</li>
      </ul><button class="go">Let's go ✦</button></div>`;
    document.body.append(m);
    m.querySelector('.go').onclick = () => { m.remove(); try { localStorage.setItem('castle-howto-v1', '1'); } catch { /* ignore */ } onDone && onDone(); };
  }

  // force: opened from the paw button, to change companion at any time
  function pickPet(onDone, force) {
    if (!pets.length || profile.mew || (profile.pet && !force) || $('pets')) return onDone && onDone();
    const m = document.createElement('div'); m.className = 'modal'; m.id = 'pets';
    m.innerHTML = '<div class="panel ornate"><h3>Choose your companion</h3><p class="sub">It follows you everywhere and helps in the games. Press Z to cuddle it.</p><div class="grid"></div></div>';
    if (o.controller) o.controller.locked = true;
    const close = () => { m.remove(); if (o.controller) o.controller.locked = false; onDone && onDone(); };
    for (const p of pets) {
      const b = document.createElement('button');
      b.innerHTML = `<i></i><b></b><span></span><em></em>`;
      const [col] = LOOK[p.creature] || ['#ffe4f2'];
      b.querySelector('i').style.background = `radial-gradient(circle, ${col} 35%, transparent 70%)`;
      b.querySelector('b').textContent = (cname[p.creature] || p.creature).replace(/xes$/, 'x').replace(/s$/, '');
      b.querySelector('span').textContent = POWER[p.power] || '';
      b.querySelector('em').textContent = p.follow || '';
      if (profile.pet === p.id) b.classList.add('on');
      b.onclick = () => { setPet(p.id); close(); love('me'); };
      m.querySelector('.grid').append(b);
    }
    if (force) { const c = document.createElement('button'); c.className = 'close'; c.textContent = 'Close'; c.onclick = close; m.querySelector('.panel').append(c); }
    document.body.append(m);
  }
  // a cuddle: the pet spins, hops and sends up hearts (everyone sees it)
  function love(id) {
    const L = live.get(id);
    if (!L) return;
    L.mesh.userData.love = 1;
    combat.burst(L.mesh.position.clone().add(new THREE.Vector3(0, 0.8, 0)), '#ff9bd6', 2.2);
  }
  function setPet(id) {
    profile.pet = id;
    saveProfile(profile);
    net.updateProfile && net.updateProfile(profile);
    applyLevel();
  }

  // ---- pets following their owners ----
  const live = new Map();     // owner id -> { mesh, pet }
  let trail = 0;
  function sync(id, pet, pos, facing, dt, t) {
    let L = live.get(id);
    if (!pet) { if (L) { scene.remove(L.mesh); live.delete(id); } return; }
    if (!L || L.pet !== pet) {
      if (L) scene.remove(L.mesh);
      const def = petOf(pet);
      if (!def) return;
      L = { mesh: makePet(def.creature), pet, p: pos.clone() };
      scene.add(L.mesh); live.set(id, L);
    }
    // trot at heel, a little behind and to the side; a guiding pet runs ahead to my
    // next target in a game and leaves a trail of sparkles to follow
    let want = pos.clone().add(new THREE.Vector3(Math.sin(facing + 2.4) * 1.3, 0, Math.cos(facing + 2.4) * 1.3));
    const goal = id === 'me' && GUIDES.includes(petOf(pet)?.power) && o.goal ? o.goal() : null;
    if (goal) {
      const dx = goal.x - pos.x, dz = goal.z - pos.z, d = Math.hypot(dx, dz);
      if (d > 2.5) want = pos.clone().add(new THREE.Vector3(dx / d * Math.min(7, d - 1), 0, dz / d * Math.min(7, d - 1)));
      if ((trail -= dt) <= 0) { trail = 0.35; combat.burst(L.mesh.position.clone().add(new THREE.Vector3(0, 0.3, 0)), '#ffd47a', 0.8); }
    }
    const moving = L.p.distanceTo(want) > 0.3;
    L.p.lerp(want, Math.min(1, dt * (goal ? 4 : 3)));
    const fly = L.mesh.userData.flies ? 0.9 + Math.sin(t * 3) * 0.15 : 0;
    L.mesh.position.set(L.p.x, pos.y + fly, L.p.z);
    if (moving) L.mesh.rotation.y = Math.atan2(want.x - L.p.x, want.z - L.p.z) || facing;
    if (L.mesh.userData.love > 0) L.mesh.userData.love = Math.max(0, L.mesh.userData.love - dt / 1.4);
    animatePet(L.mesh, t, moving);
  }

  return {
    get level() { return level(); },
    get starlight() { return P.starlight; },
    award, results, howTo, pickPet, setPet, love,
    get power() { return petOf(profile.pet)?.power || null; },
    get hasPet() { return !!profile.pet && !profile.mew; },
    bind(x) { Object.assign(o, x); applyLevel(); },
    petPos: () => live.get('me')?.mesh.position || null,
    petPositions() { return [...live.values()].map((L) => L.mesh.position); },
    cheer() { for (const L of live.values()) { L.mesh.userData.love = 1; combat.burst(L.mesh.position.clone().add(new THREE.Vector3(0, 0.6, 0)), '#ffd47a', 1.5); } },
    update(dt, t, me) {
      if (!$('lvl')) applyLevel();
      sync('me', profile.mew ? null : profile.pet, me.pos, me.facing, dt, t);
      for (const [id, r] of remotes) sync(id, r.profile.mew ? null : r.profile.pet, r.avatar.root.position, r.avatar.root.rotation.y, dt, t);
      for (const id of live.keys()) if (id !== 'me' && !remotes.has(id)) sync(id, null);
    },
  };
}
