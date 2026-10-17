import * as THREE from 'three';
import { CONFIG, isCelebration, celebrationTime } from './config.js';
import { resolveQuality, saveQuality, savedQuality, FrameGovernor } from './quality.js';
import { createSky, FOG_COLOR, MOOD, SUN_DIR, MOON_DIR } from './world/sky.js';
import { createIslands, portal as makePortal } from './world/islands.js';
import { createCoast } from './world/coast.js';
import { createPalace } from './world/palace.js';
import { createNature } from './world/nature.js';
import { createApproach } from './world/approach.js';
import { createMeadow } from './world/meadow.js';
import { createCreatures } from './world/creatures.js';
import { createEffects } from './world/effects.js';
import { createAtmosphere } from './world/atmosphere.js';
import { createWorldFill } from './world/fill.js';
import { createGate } from './world/gate.js';
import { createPaths } from './world/paths.js';
import { SPAWN, MAIN, groundAt } from './world/layout.js';
import { MEADOW_TIME } from './world/materials.js';
const SPAWN_Y = groundAt(SPAWN.x, SPAWN.z) ?? MAIN.y;
import { Avatar, OUTFITS } from './avatar.js';
import { Controller } from './controls.js';
import { createTravel, makeLotusBoat } from './travel.js';
import { createStardustHunt, createWishLanterns } from './minigames.js';
import { createCelebration, playWelcome } from './celebration.js';
import { Net } from './net.js';
import { Voice } from './voice.js';
import { loadProfile, openLobby, saveProfile } from './lobby.js';
import { createClock } from './game/clock.js';
import { preparePlaces, createPlaceVisuals, setSpotObstacles } from './game/places.js';
import { createShips } from './game/ship.js';
import { createCombat } from './game/combat.js';
import { createMew } from './game/mew.js';
import { createQuest } from './game/quest.js';
import { createProgress } from './game/progress.js';

// the game schema: places, cast, creatures, templates, story and clock (design/game-schema)
const DATA = await fetch('data/game-data.json').then((r) => r.json());

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const quality = resolveQuality(params.get('quality') || undefined);

// ---------------------------------------------------------------- renderer --
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: quality.antialias, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
if (quality.shadows) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}
const governor = new FrameGovernor(renderer, quality);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(FOG_COLOR, 900, 16000);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.3, 32000);
camera.position.set(SPAWN.x, SPAWN_Y + 40, SPAWN.z + 60);

const hemi = new THREE.HemisphereLight('#9fb0ff', '#3a2a6a', 1.6);
scene.add(hemi);
const key = new THREE.DirectionalLight('#d8e0ff', 1.6);
if (quality.shadows) {
  key.castShadow = true;
  key.shadow.mapSize.set(quality.shadows, quality.shadows);
  Object.assign(key.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 1, far: 400 });
  key.shadow.bias = -0.0008; key.shadow.normalBias = 0.6;
}
scene.add(key, key.target);
const warm = new THREE.DirectionalLight('#ffb7d9', 0.5);
warm.position.set(1, 0.4, 1);
scene.add(warm);

// Lighting mood: golden-hour dusk before the celebration, aurora night during it.
const LIGHT = {
  dusk: { sky: new THREE.Color('#fff4ec'), ground: new THREE.Color('#8f8296'), hemi: 1.7, key: new THREE.Color('#fff1dc'), keyI: 3.0, warm: new THREE.Color('#ffd6e6'), warmI: 0.35 },   // bright watercolour day, as the sheets are drawn
  night: { sky: new THREE.Color('#9fb0ff'), ground: new THREE.Color('#3a2a6a'), hemi: 1.15, key: new THREE.Color('#c4ceff'), keyI: 1.3, warm: new THREE.Color('#ffb7d9'), warmI: 0.5 },
};
LIGHT.golden = { sky: new THREE.Color('#ffd2b0'), ground: new THREE.Color('#8a5a6a'), hemi: 1.45, key: new THREE.Color('#ffb070'), keyI: 2.6, warm: new THREE.Color('#ff9ac0'), warmI: 0.7 };
const forcedMood = params.get('night') === '1' ? 1 : params.get('dusk') === '1' ? 0 : null;
const keyDir = new THREE.Vector3();
function applyMood(n) {
  MOOD.night.value = n;
  const a = LIGHT.dusk, b = LIGHT.night;
  hemi.color.copy(a.sky).lerp(b.sky, n); hemi.groundColor.copy(a.ground).lerp(b.ground, n);
  hemi.intensity = a.hemi + (b.hemi - a.hemi) * n;
  key.color.copy(a.key).lerp(b.key, n); key.intensity = a.keyI + (b.keyI - a.keyI) * n;
  warm.color.copy(a.warm).lerp(b.warm, n); warm.intensity = a.warmI + (b.warmI - a.warmI) * n;
  keyDir.copy(SUN_DIR).lerp(MOON_DIR, n).normalize();
  scene.fog.color.copy(FOG_COLOR);
}
// golden hour on top of the day/night blend (the game clock's sun near the horizon)
function applyGolden(gw) {
  if (gw <= 0.001) return;
  const G = LIGHT.golden;
  hemi.color.lerp(G.sky, gw); hemi.groundColor.lerp(G.ground, gw); hemi.intensity += (G.hemi - hemi.intensity) * gw;
  key.color.lerp(G.key, gw); key.intensity += (G.keyI - key.intensity) * gw;
  warm.color.lerp(G.warm, gw); warm.intensity += (G.warmI - warm.intensity) * gw;
}
let mood = forcedMood ?? (isCelebration() ? 1 : 0);

let composer = null;
async function setupBloom() {
  if (!quality.bloom) return;
  const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
    import('three/addons/postprocessing/EffectComposer.js'),
    import('three/addons/postprocessing/RenderPass.js'),
    import('three/addons/postprocessing/UnrealBloomPass.js'),
    import('three/addons/postprocessing/OutputPass.js'),
  ]);
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), quality.key === 'high' ? 0.4 : 0.32, 0.5, 0.93));
  composer.addPass(new OutputPass());
  composer.setPixelRatio(governor.ratio);
  composer.setSize(innerWidth, innerHeight);
}
governor.onChange = () => { if (composer) { composer.setPixelRatio(governor.ratio); composer.setSize(innerWidth, innerHeight); } };

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer && composer.setSize(innerWidth, innerHeight);
});

// ------------------------------------------------------------------- world --
const sky = createSky(scene, quality);
const coast = createCoast(scene, quality);
const islands = createIslands(scene, quality);
const castle = createPalace(scene, quality, { makePortal });
const approach = createApproach(scene, quality, { makePortal });
const nature = createNature(scene, quality);
const meadow = createMeadow(scene, quality);
const creatures = createCreatures(scene, quality);
const effects = createEffects(scene, quality);
const atmosphere = createAtmosphere(scene, quality);
const celebration = createCelebration(scene, effects, sky, castle);
const lanterns = createWishLanterns(scene);
const places = preparePlaces(DATA);
const placeVisuals = createPlaceVisuals(scene, places);
const gameClock = createClock(DATA);
const ships = createShips(scene);
const worldFill = createWorldFill(scene, quality);
setSpotObstacles(worldFill.footprints);
const gate = createGate(scene);
const paths = createPaths(scene, quality);

// --------------------------------------------------------------------- UI --
const ui = {
  toast(text) {
    const d = document.createElement('div'); d.textContent = text;
    $('toast').append(d); setTimeout(() => d.remove(), 3700);
  },
  prompt(text) { $('prompt').textContent = text || ''; $('prompt').classList.toggle('hidden', !text); },
  letterbox(on) { $('letterbox').classList.toggle('hidden', !on); $('hud').style.visibility = on ? 'hidden' : ''; },
  cutsceneText(text, big) {
    const el = $('cs-text');
    el.style.opacity = 0;
    clearTimeout(el.tm);
    el.tm = setTimeout(() => { el.textContent = text; el.classList.toggle('big', !!big); el.style.opacity = 1; }, 500);
  },
  onSkip(fn) { $('skip').onclick = fn; },
};

function formatCountdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return (d ? `${d}d ` : '') + `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
}

function updateCountdown() {
  const now = Date.now();
  const left = celebrationTime() - now;
  const el = $('countdown');
  if (isCelebration(now)) {
    el.textContent = `✦ Happy Birthday, ${CONFIG.honoreeName}! ✦`;
    el.classList.add('celebrate');
    $('lobby-countdown').textContent = 'The celebration has begun ✦';
  } else {
    el.textContent = `The celebration begins in ${formatCountdown(left)}`;
    el.classList.remove('celebrate');
    $('lobby-countdown').textContent = `The celebration begins in ${formatCountdown(left)}`;
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ------------------------------------------------------------------- game --
let game = null;
const profile = loadProfile();

function startGame(p) {
  let quest = null;
  const controller = new Controller(camera, canvas);
  const me = new Avatar(p, p.gender);
  scene.add(me.root);

  const travel = createTravel(scene, controller, {
    onStart: (name) => ui.toast(`Flying to ${name}…`),
    onArrive: (name) => ui.toast(`✦ ${name} ✦`),
  });
  travel.setPortals([...islands.portals, ...islands.returns, ...castle.portals, ...approach.portals]);

  const remotes = new Map(); // id -> { avatar, target, facing, speed, score, boat, stepAcc, last }
  const voicePositions = new Map();
  const voice = new Voice();
  voice.unlock();

  const net = new Net(params.get('room') || CONFIG.roomId, p);
  const hunt = createStardustHunt(scene, (score) => {
    $('score').querySelector('b').textContent = score;
    if (score % 5 === 0) ui.toast(`✦ ${score} star shards! ✦`);
    renderRoster();
  });

  const raycaster = new THREE.Raycaster();
  controller.onStep = (x, z) => approach.step(x, controller.pos.y, z, 1);
  controller.onTap = (nx, ny) => {
    if (quest && quest.onTap(nx, ny)) return;
    raycaster.setFromCamera({ x: nx, y: ny }, camera);
    const hit = approach.tapMesh && raycaster.intersectObject(approach.tapMesh, false)[0];
    if (hit) { approach.step(hit.point.x, hit.point.y, hit.point.z, 2.2); net.sendEvent({ k: 'tap', x: +hit.point.x.toFixed(2), z: +hit.point.z.toFixed(2) }); }
  };
  controller.onFallReset = () => ui.toast('The stars caught you ✦');

  function renderRoster() {
    const ol = $('players'); ol.innerHTML = '';
    const rows = [[quest ? quest.nameOf(net.id || 'me') : p.name, hunt.score, true, p.honoree]];
    for (const [id, r] of remotes) rows.push([quest ? quest.nameOf(id) : r.profile.name, r.score || 0, false, r.profile.honoree]);
    rows.sort((a, b) => b[1] - a[1]);
    for (const [n, s, mine, hon] of rows) {
      const li = document.createElement('li');
      li.className = (mine ? 'me ' : '') + (hon ? 'honoree' : '');
      li.innerHTML = '<span class="n"></span><span class="s"></span>';
      li.firstChild.textContent = (hon ? '👑 ' : '') + n + (mine ? ' (you)' : '');
      li.lastChild.textContent = '✦ ' + s;
      ol.append(li);
    }
  }

  function addRemote(id, prof) {
    if (remotes.has(id)) { remotes.get(id).avatar.build(prof, p.gender); remotes.get(id).profile = prof; return; }
    const avatar = new Avatar(prof, p.gender);
    avatar.root.position.set(SPAWN.x, SPAWN_Y, SPAWN.z);
    scene.add(avatar.root);
    avatar.root.visible = !prof.mew;
    const boat = makeLotusBoat(); boat.visible = false; scene.add(boat);
    remotes.set(id, { avatar, profile: prof, target: avatar.root.position.clone(), facing: Math.PI, speed: 0, score: 0, boat, stepAcc: 0, last: avatar.root.position.clone() });
    voice.addPeer(id);
    renderRoster();
  }

  net.on('peer', (peer) => voice.attachPeer(peer));
  net.on('status', (s) => {
    $('net-status').textContent = { connecting: 'Connecting to the realm…', host: 'Connected ✦ you opened the realm', connected: 'Connected ✦', offline: 'Playing offline (retrying…)' }[s] || s;
  });
  net.on('join', (id, prof, fromRoster) => {
    addRemote(id, prof);
    if (!fromRoster && !prof.mew) ui.toast(`${prof.name} has arrived ✦`);
    if (prof.honoree && !fromRoster && !p.honoree && game && !game.cutscene) {
      const st = net.players.get(id)?.state;
      const target = st ? new THREE.Vector3(st[0], st[1], st[2]) : new THREE.Vector3(SPAWN.x, SPAWN_Y, SPAWN.z);
      game.cutscene = playWelcome({ camera, castle, celebration, controller, target, ui, onDone: () => { game.cutscene = null; } });
    }
  });
  net.on('profile', (id, prof) => addRemote(id, prof));
  net.on('leave', (id) => {
    const r = remotes.get(id);
    if (!r) return;
    scene.remove(r.avatar.root, r.boat);
    if (r.far) scene.remove(r.far);
    remotes.delete(id);
    voice.removePeer(id);
    voicePositions.delete(id);
    ui.toast(`${r.profile.name} drifted away`);
    renderRoster();
  });
  net.on('states', (list) => {
    let changed = false;
    for (const [id, s] of list) {
      const r = remotes.get(id);
      if (!r || !s) continue;
      r.target.set(s[0], s[1], s[2]); r.facing = s[3]; r.speed = s[4]; r.boat.visible = !!s[5]; r.camYaw = s[7]; r.camPitch = s[8];
      if ((s[6] || 0) !== r.score) { r.score = s[6] || 0; changed = true; }
    }
    if (changed) renderRoster();
  });
  net.on('event', (id, e) => {
    const r = remotes.get(id);
    if (e.k === 'tap') approach.step(e.x, groundAt(e.x, e.z, 50) ?? 0, e.z, 2.2);
    else if (e.k === 'twirl' && r) r.avatar.twirl();
    else if (e.k === 'wish' && r) { lanterns.release(islands.shrine, String(e.text).slice(0, 60), r.profile.name); ui.toast(`${r.profile.name} released a wish lantern 🏮`); }
  });
  net.start();

  // microphone
  const micBtn = $('mic');
  const refreshMic = () => {
    micBtn.classList.toggle('live', !!voice.local && !voice.muted);
    micBtn.classList.toggle('muted', !voice.local || voice.muted);
    micBtn.title = !voice.local ? 'Turn on microphone' : voice.muted ? 'Unmute' : 'Mute';
  };
  voice.onChange = refreshMic;
  refreshMic();
  micBtn.onclick = async () => {
    if (!voice.local) {
      try { await voice.enableMic(); ui.toast('Microphone on: players near you can hear you'); }
      catch { ui.toast('Microphone not available or not allowed'); }
    } else voice.setMuted(!voice.muted);
    refreshMic();
  };
  $('wardrobe').onclick = () => {
    controller.locked = true;
    openLobby(p, {
      inGame: true,
      onEnter: (np, q) => {
        controller.locked = false;
        me.build(np, np.gender);
        for (const r of remotes.values()) r.avatar.build(r.profile, np.gender);
        net.updateProfile(np);
        if (q !== savedQuality()) { saveQuality(q); ui.toast('Graphics setting applies next time you open the game'); }
      },
    });
  };
  $('help-btn').onclick = () => $('help').classList.toggle('hidden');

  // wish lanterns
  const wish = $('wish');
  const closeWish = () => { wish.classList.add('hidden'); controller.locked = false; };
  $('wish-cancel').onclick = closeWish;
  $('wish-send').onclick = () => {
    const text = $('wish-text').value.trim().slice(0, 60);
    if (!text) return;
    lanterns.release(islands.shrine, text, p.name);
    net.sendEvent({ k: 'wish', text });
    $('wish-text').value = '';
    closeWish();
    ui.toast('Your lantern rises into the aurora 🏮');
  };
  $('wish-text').onkeydown = (e) => { if (e.key === 'Enter') $('wish-send').click(); if (e.key === 'Escape') closeWish(); };

  addEventListener('keydown', (e) => {
    if (quest && quest.onKey(e)) return;
    if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName) || controller.locked) return;
    if (e.code === 'KeyT') { me.twirl(); net.sendEvent({ k: 'twirl' }); }
    if (e.code === 'KeyE' && game.nearShrine) { wish.classList.remove('hidden'); controller.locked = true; $('wish-text').focus(); }
  });

  $('hud').classList.remove('hidden');
  ui.toast(`Welcome to the Castle of Starlight, ${p.name} ✦`);
  renderRoster();

  // ---- the quest, the Mew, weapons and the sky ship (js/game) ----
  const combat = createCombat(scene, camera, DATA);
  const progress = createProgress({ data: DATA, scene, combat, ui, profile: p, net, remotes, saveProfile });
  combat.onDimmed = () => ui.toast('Your light went out… it comes back in a moment ✦');
  const mew = createMew(scene, DATA, {
    send: (e) => quest && quest.mewSend(e),
    herView: () => quest && quest.herView(),
    nextPlace: () => quest && quest.nextPlace(),
    blobHit: (to) => quest && quest.blobHit(to),
  });
  quest = createQuest({
    data: DATA, places, visuals: placeVisuals, ships, combat, mew, clock: gameClock, net, controller, camera, profile: p, ui, remotes, scene, gate, progress,
    celebrating: () => celebration.active,
    onReveal: () => playReveal(),
  });
  if (p.mew) {
    mew.pos.copy(controller.pos).y += 1.6;
    controller.firstPerson = false; controller.camDist = 2.6;          // the owner watches the Mew from just behind it
    micBtn.classList.add('hidden');                                      // the Mew only speaks in mews
    me.root.visible = false;
    ui.toast('You are the Mew ✦ WASD fly, Space/C up and down, 1-5 tease, X mew. She must not know it is you!');
  }
  function playReveal() {
    // the Mew spins up in a column of light, and the owner stands there instead
    let t = 0;
    const startY = mew.pos.y;
    const owner = p.mew ? null : [...remotes.values()].find((r) => r.profile.mew);
    const reveal = {
      update(dt) {
        t += dt;
        if (t < 3) { mew.pos.y = startY + t * t * 0.6; mew.mesh.rotation.y += dt * (4 + t * 8); if (Math.random() < dt * 20) combat.burst(mew.pos.clone(), '#ffd0ec', 3); }
        else if (!reveal.done) {
          reveal.done = true;
          mew.hidden = true;
          combat.burst(mew.pos.clone(), '#ffffff', p.mew ? 3 : 10);
          if (p.mew) {
            const gy = groundAt(controller.pos.x, controller.pos.z, controller.pos.y + 2) ?? controller.pos.y;
            controller.teleport(controller.pos.x, gy + 0.3, controller.pos.z);
            controller.firstPerson = true; me.root.visible = true;
          } else if (owner) owner.avatar.root.visible = true;
          if (p.honoree) ui.toast(CONFIG.revealLine || 'Your little Mew… was me, all along. Happy birthday ♥');
          renderRoster();
        }
      },
    };
    game.reveal = reveal;
  }
  if (quest.revealed) { mew.hidden = true; for (const r of remotes.values()) if (r.profile.mew) r.avatar.root.visible = true; }

  game = { controller, me, travel, remotes, voice, voicePositions, net, hunt, cutscene: null, nearShrine: false, sendAcc: 0, quest, mew, combat, progress, reveal: null };

  // the arrival ride through the waterfall gate; then her welcome, and the Mew finds her
  const welcome = () => {
    game.cutscene = playWelcome({ camera, castle, celebration, controller, target: controller.pos.clone(), ui, onDone: () => { game.cutscene = null; quest.sharedScene('mew_bond'); setup(); } });
  };
  // then how to play, and a companion to choose
  const setup = () => progress.howTo(() => progress.pickPet());
  progress.bind({ mePos: () => controller.pos });
  if (!p.mew) quest.playScene('arrival', { onEnd: p.honoree ? welcome : setup });
  else setup();
}

// a simple stand-in for a player drawn beyond the full-detail few
function farFigure(prof) {
  // everyone sees the everyday gown here: party gowns show only to ladies, up close
  const col = (prof.gender === 'male' ? OUTFITS[prof.outfit] : OUTFITS[prof.modest])?.color || '#c9b6ff';
  const g = new THREE.Group();
  const robe = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.45, 8), new THREE.MeshLambertMaterial({ color: col }));
  robe.position.y = 0.72;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 8, 6), new THREE.MeshLambertMaterial({ color: prof.skin || '#e8c4a8' }));
  head.position.y = 1.62;
  g.add(robe, head);
  scene.add(g);
  return g;
}

// ------------------------------------------------------------------- loop --
const clock = new THREE.Clock();
let t = 0;
let celebrationChecked = 0;
const shrineDist = new THREE.Vector3();

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  t += dt;

  const sky0 = gameClock.update(Date.now(), celebration.active);
  const wantMood = forcedMood ?? (celebration.active ? 1 : sky0.night);
  mood += (wantMood - mood) * Math.min(1, dt * 0.25);
  if (Math.abs(wantMood - mood) < 0.001 || params.get('phase')) mood = wantMood;
  sky.update(t, camera);
  applyMood(mood);
  if (forcedMood === null && !celebration.active) applyGolden(sky0.golden);
  // shadows cover the area around the player (or the camera), snapped to whole metres to avoid shimmer
  const focus = game ? game.controller.pos : camera.position;
  key.target.position.set(Math.round(focus.x), Math.round(focus.y), Math.round(focus.z));
  key.position.copy(key.target.position).addScaledVector(keyDir, 200);
  coast.update(t, camera);
  // the haze thins as you climb, so the view from high up stays clear
  {
    const hk = THREE.MathUtils.clamp((camera.position.y - 150) / 1400, 0, 1);
    scene.fog.near = 900 + hk * 5000; scene.fog.far = 16000 + hk * 22000;
    const wu = coast.sea.material.uniforms; wu.uFogNear.value = scene.fog.near; wu.uFogFar.value = scene.fog.far;
    worldFill.fog(scene.fog.near, scene.fog.far); gate.fog(scene.fog.near, scene.fog.far);
    gate.update(dt, t, camera.position);
    paths.update();
  }
  islands.update(t);
  castle.update(t, dt, camera);
  nature.update(t);
  atmosphere.update(t);
  MEADOW_TIME.value = t;
  meadow.update(t, camera);
  approach.update(t, dt, camera);
  creatures.update(t, dt, camera);
  effects.update(t, dt, camera, governor.ratio);
  celebration.update(t, dt);
  lanterns.update(t, dt);
  worldFill.update(dt, camera);

  if ((celebrationChecked -= dt) <= 0) {
    celebrationChecked = 1;
    const on = isCelebration() || !!(game && game.quest.finale);
    if (on !== celebration.active && !(game && game.cutscene)) celebration.setActive(on);
  }

  if (game) {
    const g = game;
    g.travel.update(dt, t);
    const flyingMew = g.me.profile?.mew && !g.quest.revealed;
    if (!flyingMew) g.controller.update(dt);
    g.quest.update(dt, t);
    g.progress.update(dt, t, { pos: g.controller.pos, facing: g.controller.facing });
    if (g.reveal) g.reveal.update(dt);
    // the Mew: steered by the owner on their screen, followed everywhere else
    const ownerRemote = [...g.remotes.values()].find((r) => r.profile.mew);
    g.mew.update(dt, t, {
      view: g.quest.herView(),
      owner: flyingMew,
      controller: g.controller,
      busy: g.quest.busy,
      remotePos: !flyingMew && ownerRemote && !g.quest.revealed ? ownerRemote.avatar.root.position.clone().add(new THREE.Vector3(0, 1.6, 0)) : null,
    });
    if (flyingMew && !g.quest.riding) g.controller.pos.copy(g.mew.pos).y -= 1.6;
    if (g.quest.cutscene) { /* the quest's cutscene drives the camera */ }
    else if (g.cutscene) g.cutscene.update(dt);
    else g.controller.updateCamera(dt, null);
    g.me.root.position.copy(g.controller.pos);
    g.me.root.rotation.y = g.controller.facing;
    g.me.animate(dt, g.controller.speed, t);
    g.hunt.update(t, dt, g.controller.pos, camera);

    // with 16 players only the nearest few draw in full detail; the rest are simple figures
    if ((g.lodAcc = (g.lodAcc || 0) - dt) <= 0) {
      g.lodAcc = 0.5;
      const FULL = { low: 6, medium: 10, high: 15 }[quality.key] || 10;
      const list = [...g.remotes.values()].sort((x, y) => x.avatar.root.position.distanceToSquared(g.controller.pos) - y.avatar.root.position.distanceToSquared(g.controller.pos));
      list.forEach((r, i) => { r.lodFar = i >= FULL; });
    }
    for (const [id, r] of g.remotes) {
      const a = r.avatar.root;
      a.position.lerp(r.target, Math.min(1, dt * 8));
      const hiddenMew = r.profile.mew && !g.quest.revealed;
      if (r.lodFar && !hiddenMew) {
        if (!r.far) r.far = farFigure(r.profile);
        a.visible = false; r.far.visible = true;
        r.far.position.copy(a.position); r.far.rotation.y = a.rotation.y;
      } else {
        if (r.far) r.far.visible = false;
        if (!hiddenMew) a.visible = true;
      }
      let d = r.facing - a.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
      a.rotation.y += d * Math.min(1, dt * 10);
      r.avatar.animate(dt, r.speed, t);
      if (r.boat.visible) { r.boat.position.copy(a.position).add(new THREE.Vector3(0, -0.35, 0)); r.boat.rotation.y = t * 0.3; }
      r.stepAcc += Math.hypot(a.position.x - r.last.x, a.position.z - r.last.z);
      r.last.copy(a.position);
      if (r.stepAcc > 1.4) { r.stepAcc = 0; approach.step(a.position.x, a.position.y, a.position.z, 1); }
      g.voicePositions.set(id, a.position);
    }
    const head = g.controller.pos.clone(); head.y += 1.6;
    g.voice.update(camera, g.voicePositions, head);

    g.sendAcc += dt;
    if (g.sendAcc > 0.09) {
      g.sendAcc = 0;
      const c = g.controller;
      g.net.setState([+c.pos.x.toFixed(2), +c.pos.y.toFixed(2), +c.pos.z.toFixed(2), +c.facing.toFixed(2), +c.speed.toFixed(1), g.travel.riding ? 1 : 0, g.hunt.score, +c.camYaw.toFixed(2), +c.camPitch.toFixed(2)]);
    }

    g.nearShrine = shrineDist.copy(islands.shrine).sub(g.controller.pos).length() < 9;
    ui.prompt(g.quest.prompt() || (g.nearShrine && !g.controller.locked ? 'Press E to release a wish lantern 🏮' : ''));
  } else {
    // attract mode: a slow orbit around the castle behind the entrance screen
    const a = t * 0.05;
    const fixed = params.get('cam')?.split(',').map(Number);
    if (fixed?.length >= 6) {
      camera.position.set(fixed[0], fixed[1], fixed[2]); camera.lookAt(fixed[3], fixed[4], fixed[5]);
      if (fixed[6] && camera.fov !== fixed[6]) { camera.fov = fixed[6]; camera.updateProjectionMatrix(); }   // ?cam=...,fov for elevation shots
      if (fixed[7]) {                                                     // ?cam=...,fov,halfHeight: a true orthographic elevation
        const hh = fixed[7], hw = hh * camera.aspect;
        camera.projectionMatrix.makeOrthographic(-hw, hw, hh, -hh, 0.3, 32000); camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
        if (!camera.userData.ortho) { camera.userData.ortho = true; scene.traverse((o) => { if (o.isPoints) o.visible = false; }); }   // point sprites size by depth
      }
    }
    else {
      camera.position.set(Math.sin(a) * 5200, 1300 + Math.sin(t * 0.1) * 150, 1400 + Math.cos(a) * 5200);
      camera.lookAt(80, 650, 0);
    }
  }

  governor.tick(dt);
  if (composer) composer.render(); else renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

await setupBloom();
requestAnimationFrame(frame);
setTimeout(() => {
  $('loading').style.opacity = 0;
  setTimeout(() => $('loading').remove(), 900);
}, 300);

openLobby(profile, {
  onEnter: (p, q) => {
    if (q !== savedQuality()) {
      saveQuality(q);
      if (resolveQuality(q).key !== quality.key) { location.reload(); return; }
    }
    startGame(p);
  },
});

// Debug helpers for testing: ?celebrate=1 forces celebration mode,
// ?cutscene=1 previews the welcome after entering.
if (params.get('cutscene') === '1') {
  window.__previewWelcome = () => game && (game.cutscene = playWelcome({ camera, castle, celebration, controller: game.controller, target: game.controller.pos.clone(), ui, onDone: () => { game.cutscene = null; } }));
}
window.__castle = { scene, camera, renderer, places, get game() { return game; } };
