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
  star_foxes: ['#ffd9a0', 'fox'], bunny_cats: ['#ffe4f2', 'bunny'], young_dragons: ['#b9a2ff', 'dragon'], cloud_koi: ['#ffb38a', 'fish'],
  glow_frogs: ['#9affc8', 'frog'], fennec_foxes: ['#f3d2a0', 'fox'], griffins: ['#ffe9b0', 'bird'], crystal_hummingbirds: ['#9ad8ff', 'bird'],
};
const POWER = { find_hidden: 'sniffs out the way', heal: 'restores your light faster', carry_light: 'carries a little lantern', speed: 'makes you a touch quicker', scout: 'peeks ahead', shield: 'softens every blow', fetch: 'fetches far shards' };

// a small soft creature with no eyes: body, head, ears or wings, and a tail
export function makePet(creature) {
  const [col, kind] = LOOK[creature] || ['#ffe4f2', 'bunny'];
  const g = new THREE.Group();
  const fur = toon(col, { emissive: col, emissiveIntensity: 0.25 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 9), fur); body.scale.set(1, 0.85, 1.25); body.position.y = 0.3;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 9), fur); head.position.set(0, 0.52, 0.22);
  g.add(body, head);
  const add = (geo, x, y, z, rx = 0, rz = 0) => { const m = new THREE.Mesh(geo, fur); m.position.set(x, y, z); m.rotation.set(rx, 0, rz); g.add(m); return m; };
  if (kind === 'fox' || kind === 'dragon') for (const s of [-1, 1]) add(new THREE.ConeGeometry(0.06, 0.16, 6), s * 0.08, 0.68, 0.2, 0, -s * 0.3);
  if (kind === 'bunny') for (const s of [-1, 1]) add(new THREE.CapsuleGeometry(0.035, 0.2, 3, 6), s * 0.06, 0.75, 0.18, 0, -s * 0.15);
  if (kind === 'bird' || kind === 'dragon') for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.16, 8, 6), s * 0.24, 0.38, 0, 0, s * 0.6).scale.set(1, 0.25, 0.7);
  if (kind === 'fish') add(new THREE.ConeGeometry(0.14, 0.3, 6), 0, 0.3, -0.36, -Math.PI / 2);
  if (kind === 'frog') { body.scale.set(1.2, 0.7, 1.1); head.position.set(0, 0.42, 0.2); }
  const tail = add(new THREE.SphereGeometry(kind === 'fox' ? 0.11 : 0.07, 8, 6), 0, 0.34, -0.3);
  tail.scale.set(1, 1, kind === 'fox' ? 2 : 1);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: col, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(1.2); halo.position.y = 0.4; g.add(halo);
  g.userData = { flies: kind === 'bird' || kind === 'dragon' || kind === 'fish', tail };
  return g;
}

export function createProgress({ data, scene, combat, ui, profile, net, remotes, saveProfile }) {
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
  const o = {};

  function results({ place, stage, seconds, limit, gained, next }) {
    const k = seconds / Math.max(1, limit);
    const stars = k < 0.45 ? 3 : k < 0.75 ? 2 : 1;
    card.innerHTML = `<div class="panel ornate"><div class="t"></div><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div><div class="s"></div><div class="n"></div></div>`;
    card.querySelector('.t').textContent = `${place.name}: ${stage} won!`;
    card.querySelector('.s').textContent = `${Math.round(seconds)} s · +${gained.amount} starlight · Level ${gained.level}`;
    card.querySelector('.n').textContent = next || '';
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
        <li>Every win earns <b>starlight</b> and levels. Your pet follows you everywhere.</li>
      </ul><button class="go">Let's go ✦</button></div>`;
    document.body.append(m);
    m.querySelector('.go').onclick = () => { m.remove(); try { localStorage.setItem('castle-howto-v1', '1'); } catch { /* ignore */ } onDone && onDone(); };
  }

  function pickPet(onDone) {
    if (!pets.length || profile.mew || profile.pet) return onDone && onDone();
    const m = document.createElement('div'); m.className = 'modal'; m.id = 'pets';
    m.innerHTML = '<div class="panel ornate"><h3>Choose your companion</h3><p class="sub">It follows you through the whole adventure.</p><div class="grid"></div></div>';
    for (const p of pets) {
      const b = document.createElement('button');
      b.innerHTML = `<b></b><span></span>`;
      b.querySelector('b').textContent = (cname[p.creature] || p.creature).replace(/s$/, '');
      b.querySelector('span').textContent = POWER[p.power] || p.follow || '';
      b.onclick = () => { m.remove(); setPet(p.id); onDone && onDone(); };
      m.querySelector('.grid').append(b);
    }
    document.body.append(m);
  }
  function setPet(id) {
    profile.pet = id;
    saveProfile(profile);
    net.updateProfile && net.updateProfile(profile);
    applyLevel();
  }

  // ---- pets following their owners ----
  const live = new Map();     // owner id -> { mesh, pet }
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
    // trot at heel, a little behind and to the side
    const want = pos.clone().add(new THREE.Vector3(Math.sin(facing + 2.4) * 1.3, 0, Math.cos(facing + 2.4) * 1.3));
    L.p.lerp(want, Math.min(1, dt * 3));
    const fly = L.mesh.userData.flies ? 0.9 + Math.sin(t * 3) * 0.15 : Math.abs(Math.sin(t * 6)) * 0.05 * Math.min(1, L.p.distanceTo(want));
    L.mesh.position.set(L.p.x, pos.y + fly, L.p.z);
    L.mesh.rotation.y = Math.atan2(want.x - L.p.x, want.z - L.p.z) || facing;
    L.mesh.userData.tail.rotation.y = Math.sin(t * 8) * 0.5;
  }

  return {
    get level() { return level(); },
    get starlight() { return P.starlight; },
    award, results, howTo, pickPet, setPet,
    bind(x) { Object.assign(o, x); },
    cheer() { for (const L of live.values()) combat.burst(L.mesh.position.clone().add(new THREE.Vector3(0, 0.6, 0)), '#ffd47a', 1.5); },
    update(dt, t, me) {
      if (!$('lvl')) applyLevel();
      sync('me', profile.mew ? null : profile.pet, me.pos, me.facing, dt, t);
      for (const [id, r] of remotes) sync(id, r.profile.mew ? null : r.profile.pet, r.avatar.root.position, r.avatar.root.rotation.y, dt, t);
      for (const id of live.keys()) if (id !== 'me' && !remotes.has(id)) sync(id, null);
    },
  };
}
