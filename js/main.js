import * as THREE from 'three';
import { CONFIG, isCelebration, celebrationTime } from './config.js';
import { resolveQuality, saveQuality, savedQuality, FrameGovernor } from './quality.js';
import { createSky, FOG_COLOR, MOOD, SUN_DIR, MOON_DIR } from './world/sky.js';
import { createIslands } from './world/islands.js';
import { createCastle } from './world/castle.js';
import { createNature } from './world/nature.js';
import { createPath } from './world/path.js';
import { createGarden } from './world/garden.js';
import { createAcropolis } from './world/acropolis.js';
import { createMonuments } from './world/monuments.js';
import { createForest } from './world/forest.js';
import { createDistricts } from './world/districts.js';
import { createApproach } from './world/approach.js';
import { createCastleDetail } from './world/castleDetail.js';
import { createMeadow } from './world/meadow.js';
import { createCastleArch } from './world/castleArch.js';
import { createCreatures } from './world/creatures.js';
import { createEffects } from './world/effects.js';
import { createAtmosphere } from './world/atmosphere.js';
import { createHorizon } from './world/horizon.js';
import { SPAWN, MAIN, groundAt } from './world/layout.js';
import { MEADOW_TIME } from './world/materials.js';
const SPAWN_Y = groundAt(SPAWN.x, SPAWN.z) ?? MAIN.y;
import { Avatar } from './avatar.js';
import { Controller } from './controls.js';
import { createTravel, makeLotusBoat } from './travel.js';
import { createStardustHunt, createWishLanterns } from './minigames.js';
import { createCelebration, playWelcome } from './celebration.js';
import { Net } from './net.js';
import { Voice } from './voice.js';
import { loadProfile, openLobby } from './lobby.js';

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
scene.fog = new THREE.Fog(FOG_COLOR, 260, 3000);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.2, 6000);
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
  dusk: { sky: new THREE.Color('#ffe0f0'), ground: new THREE.Color('#7d6a8c'), hemi: 1.65, key: new THREE.Color('#ffd7a8'), keyI: 3.0, warm: new THREE.Color('#ffb0d0'), warmI: 0.5 },
  night: { sky: new THREE.Color('#9fb0ff'), ground: new THREE.Color('#3a2a6a'), hemi: 1.15, key: new THREE.Color('#c4ceff'), keyI: 1.3, warm: new THREE.Color('#ffb7d9'), warmI: 0.5 },
};
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
createHorizon(scene);
const islands = createIslands(scene, quality);
const castle = createCastle(scene, quality);
const nature = createNature(scene, quality);
const meadow = createMeadow(scene, quality);
const path = createPath(scene);
const acropolis = createAcropolis(scene, quality);
const monuments = createMonuments(scene, quality);
const garden = createGarden(scene, quality);
const forest = createForest(scene, quality);
const approach = createApproach(scene, quality);
const castleDetail = createCastleDetail(scene, quality, castle);
const castleArch = createCastleArch(scene, quality, castle);
const districts = createDistricts(scene, quality, { pillars: monuments.pillarTops });
const creatures = createCreatures(scene, quality);
const effects = createEffects(scene, quality);
const atmosphere = createAtmosphere(scene, quality);
const celebration = createCelebration(scene, effects, sky, castle);
const lanterns = createWishLanterns(scene);

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
    setTimeout(() => { el.textContent = text; el.classList.toggle('big', !!big); el.style.opacity = 1; }, 500);
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
  const controller = new Controller(camera, canvas);
  const me = new Avatar(p, p.gender);
  scene.add(me.root);

  const travel = createTravel(scene, controller, {
    onStart: (name) => ui.toast(`Flying to ${name}…`),
    onArrive: (name) => ui.toast(`✦ ${name} ✦`),
  });
  travel.setPortals([...islands.portals, ...islands.returns]);

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
  controller.onStep = (x, z) => path.step(x, z, 1);
  controller.onTap = (nx, ny) => {
    raycaster.setFromCamera({ x: nx, y: ny }, camera);
    const hit = raycaster.intersectObject(path.mesh, false)[0];
    if (hit) { path.step(hit.point.x, hit.point.z, 2.2); net.sendEvent({ k: 'tap', x: +hit.point.x.toFixed(2), z: +hit.point.z.toFixed(2) }); }
  };
  controller.onFallReset = () => ui.toast('The stars caught you ✦');

  function renderRoster() {
    const ol = $('players'); ol.innerHTML = '';
    const rows = [[p.name, hunt.score, true, p.honoree]];
    for (const [id, r] of remotes) { void id; rows.push([r.profile.name, r.score || 0, false, r.profile.honoree]); }
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
    if (!fromRoster) ui.toast(`${prof.name} has arrived ✦`);
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
      r.target.set(s[0], s[1], s[2]); r.facing = s[3]; r.speed = s[4]; r.boat.visible = !!s[5];
      if ((s[6] || 0) !== r.score) { r.score = s[6] || 0; changed = true; }
    }
    if (changed) renderRoster();
  });
  net.on('event', (id, e) => {
    const r = remotes.get(id);
    if (e.k === 'tap') path.step(e.x, e.z, 2.2);
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
    if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName) || controller.locked) return;
    if (e.code === 'KeyT') { me.twirl(); net.sendEvent({ k: 'twirl' }); }
    if (e.code === 'KeyE' && game.nearShrine) { wish.classList.remove('hidden'); controller.locked = true; $('wish-text').focus(); }
  });

  $('hud').classList.remove('hidden');
  ui.toast(`Welcome to the Castle of Starlight, ${p.name} ✦`);
  renderRoster();

  game = { controller, me, travel, remotes, voice, voicePositions, net, hunt, cutscene: null, nearShrine: false, sendAcc: 0 };

  if (p.honoree) {
    game.cutscene = playWelcome({ camera, castle, celebration, controller, target: controller.pos.clone(), ui, onDone: () => { game.cutscene = null; } });
  }
}

// ------------------------------------------------------------------- loop --
const clock = new THREE.Clock();
let t = 0;
let celebrationChecked = 0;
const shrineDist = new THREE.Vector3();

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  t += dt;

  const wantMood = forcedMood ?? (celebration.active ? 1 : 0);
  mood += (wantMood - mood) * Math.min(1, dt * 0.25);
  if (Math.abs(wantMood - mood) < 0.001) mood = wantMood;
  sky.update(t, camera);
  applyMood(mood);
  // shadows cover the area around the player (or the camera), snapped to whole metres to avoid shimmer
  const focus = game ? game.controller.pos : camera.position;
  key.target.position.set(Math.round(focus.x), Math.round(focus.y), Math.round(focus.z));
  key.position.copy(key.target.position).addScaledVector(keyDir, 200);
  islands.update(t);
  castle.update(t, dt);
  nature.update(t);
  atmosphere.update(t);
  path.update(t);
  garden.update(t, camera);
  acropolis.update(t, camera);
  monuments.update(t);
  forest.update(t);
  districts.update(t, camera);
  MEADOW_TIME.value = t;
  meadow.update(t, camera);
  approach.update(t);
  castleDetail.update(t);
  castleArch.update(t);
  creatures.update(t, dt, camera);
  effects.update(t, dt, camera, governor.ratio);
  celebration.update(t, dt);
  lanterns.update(t, dt);

  if ((celebrationChecked -= dt) <= 0) {
    celebrationChecked = 1;
    const on = isCelebration();
    if (on !== celebration.active && !(game && game.cutscene)) celebration.setActive(on);
  }

  if (game) {
    const g = game;
    g.travel.update(dt, t);
    g.controller.update(dt);
    if (g.cutscene) g.cutscene.update(dt);
    else g.controller.updateCamera(dt, null);
    g.me.root.position.copy(g.controller.pos);
    g.me.root.rotation.y = g.controller.facing;
    g.me.animate(dt, g.controller.speed, t);
    g.hunt.update(t, dt, g.controller.pos, camera);

    for (const [id, r] of g.remotes) {
      const a = r.avatar.root;
      a.position.lerp(r.target, Math.min(1, dt * 8));
      let d = r.facing - a.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
      a.rotation.y += d * Math.min(1, dt * 10);
      r.avatar.animate(dt, r.speed, t);
      if (r.boat.visible) { r.boat.position.copy(a.position).add(new THREE.Vector3(0, -0.35, 0)); r.boat.rotation.y = t * 0.3; }
      r.stepAcc += Math.hypot(a.position.x - r.last.x, a.position.z - r.last.z);
      r.last.copy(a.position);
      if (r.stepAcc > 1.4) { r.stepAcc = 0; if (a.position.y < 150) path.step(a.position.x, a.position.z, 1); }
      g.voicePositions.set(id, a.position);
    }
    const head = g.controller.pos.clone(); head.y += 1.6;
    g.voice.update(camera, g.voicePositions, head);

    g.sendAcc += dt;
    if (g.sendAcc > 0.09) {
      g.sendAcc = 0;
      const c = g.controller;
      g.net.setState([+c.pos.x.toFixed(2), +c.pos.y.toFixed(2), +c.pos.z.toFixed(2), +c.facing.toFixed(2), +c.speed.toFixed(1), g.travel.riding ? 1 : 0, g.hunt.score]);
    }

    g.nearShrine = shrineDist.copy(islands.shrine).sub(g.controller.pos).length() < 9;
    ui.prompt(g.nearShrine && !g.controller.locked ? 'Press E to release a wish lantern 🏮' : '');
  } else {
    // attract mode: a slow orbit around the castle behind the entrance screen
    const a = t * 0.05;
    const fixed = params.get('cam')?.split(',').map(Number);
    if (fixed?.length === 6) { camera.position.set(fixed[0], fixed[1], fixed[2]); camera.lookAt(fixed[3], fixed[4], fixed[5]); }
    else {
      camera.position.set(Math.sin(a) * 620, 260 + Math.sin(t * 0.1) * 20, -40 + Math.cos(a) * 620);
      camera.lookAt(0, 230, -40);
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
window.__castle = { scene, camera, renderer, get game() { return game; } };
