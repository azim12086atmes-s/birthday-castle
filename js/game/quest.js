// The quest (schema: story, places, clock). One shared state for the whole
// party, kept by the host (the first player in the room) and shared with
// everyone as a snapshot whenever it changes:
//
//   act 1  the ladies arrive        act 2  her surprise (she joins, the Mew bonds)
//   act 4  the Hush has fallen: free the heads, win the 32 shards, follow the
//          Grand Path of 14 places that ends at the palace
//   act 5  midnight: the roof opens, the cake, the Mew's reveal
//
// At each place: press E by its head to start its game; win the game, then its
// challenge, and the head is freed and the place's shard flies home to the
// Great Birthday Lantern. Shards won during the week count on the night too.
import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { createActivity } from './activities.js';
import { createCinema } from './cinema.js';
import { MEW_ACTIONS, screenSplash } from './mew.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const SAVE_KEY = 'castle-quest-v1';

function el(tag, attrs = {}, parent) {
  const e = document.createElement(tag);
  Object.assign(e, attrs);
  parent && parent.append(e);
  return e;
}

function buildHud() {
  const hud = $('hud');
  const quest = el('div', { id: 'quest', className: 'panel' }, hud);
  quest.innerHTML = '<div class="act"></div><div class="goal"></div><div class="shards"></div><div class="next"><span class="arrow">➤</span><span class="txt"></span></div><div class="sky"></div>';
  const act = el('div', { id: 'activity', className: 'panel hidden' }, hud);
  act.innerHTML = '<div class="title"></div><div class="hint"></div><div class="prog"></div><div class="row"><div class="light"><i></i></div><span class="timer"></span></div>';
  const map = el('div', { id: 'map', className: 'modal hidden' }, document.body);
  map.innerHTML = '<div class="panel ornate"><h3>Where shall the sky ship sail?</h3><p class="sub"></p><ol class="list"></ol><button class="close">Close</button></div>';
  const quiz = el('div', { id: 'quiz', className: 'modal hidden' }, document.body);
  quiz.innerHTML = '<div class="panel ornate"><h3>The heart quiz</h3><p class="q"></p><div class="a"></div><p class="who"></p></div>';
  el('div', { id: 'title-card', className: 'hidden' }, document.body).innerHTML = '<div class="t"></div><div class="s"></div>';
  const btns = $('buttons');
  const mapBtn = el('button', { id: 'map-btn', className: 'round', title: 'Map and sky ship (M)', textContent: '⛵' });
  btns.prepend(mapBtn);
  return { quest, act, map, quiz, mapBtn };
}

export function createQuest(o) {
  const { data, places, visuals, ships, combat, mew, clock, net, controller, camera, profile, ui, remotes, scene } = o;
  const hud = buildHud();
  const isMew = !!profile.mew;
  const director = isMew || params.get('director') === '1';
  const acts = Object.fromEntries(data.story.acts.map((a, i) => [i + 1, a]));
  acts[4] ||= { name: 'The 32 places' };

  let S = { v: 0, act: 1, shards: [], activity: null, finale: false, revealed: false };
  try { const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (saved && saved.act) S = { ...S, ...saved, activity: null }; } catch { /* private mode */ }
  if (params.get('act')) S.act = +params.get('act');

  let shown = JSON.parse(JSON.stringify(S));     // the last state put on screen (the host edits S in place)
  let activity = null, actPlace = null, actT = 0, reported = false, downs = 0;
  const hearts = () => 3 + Math.floor((activity?.meta.n || players().length) / 2) - downs;
  let cutscene = null;
  const seenTitles = new Map();

  const myId = () => net.id || 'me';
  const auth = () => net.isHost || !net.peer;
  const nameOf = (id) => {
    if (id === myId()) return profile.name;
    const r = remotes.get(id);
    if (!r) return 'A friend';
    return r.profile.mew && !S.revealed ? 'Mew' : r.profile.name;
  };
  const players = () => {
    const list = isMew && !S.revealed ? [] : [{ id: myId(), pos: controller.pos }];
    for (const [id, r] of remotes) if (!(r.profile.mew && !S.revealed)) list.push({ id, pos: r.avatar.root.position });
    return list;
  };
  const group = () => {
    const ps = players(), c = new THREE.Vector3();
    if (!ps.length) return controller.pos.clone();
    for (const q of ps) c.add(q.pos);
    return c.divideScalar(ps.length);
  };
  const ownerRemote = () => [...remotes.values()].find((r) => r.profile.mew);
  const near = (p, d) => !!p && controller.pos.distanceTo(places.spotOf(p)) < d;

  // ---- cinematic scenes (js/game/cinema.js) ---------------------------------------------
  const cinema = createCinema({
    data, camera, controller, ui, places, visuals, combat, scene, director,
    group, mePos: () => controller.pos,
    mewPos: () => mew.pos.clone(),
    ownerPos: () => (isMew ? controller.pos.clone() : ownerRemote()?.avatar.root.position.clone()),
    ownerName: () => (isMew ? profile.name : ownerRemote()?.profile.name),
    partner: (forHer) => { const v = herView(); return v && (forHer || !profile.honoree) ? v.head.clone().setY(v.head.y - 0.2) : null; },
    shipPos: (id) => ships.riderPos(id)?.pos.clone() || null,
    mewSound: () => mew.sound('mew'),
    voteSkip: (run) => emit({ k: 'cskip', run }),
    onState: (on) => {
      cutscene = on ? cinema : null;
      controller.locked = on || riding || !hud.map.classList.contains('hidden');
      if (!on) refreshBeacons();
    },
    onShot: (id, shot, c) => {
      // the Hush: the lantern cracks and its shards streak out to every place
      if (id === 'the_hush') {
        if (shot.vfx?.includes('grey_fog')) $('c').style.filter = 'saturate(0.75)';
        if (shot.vfx?.includes('star_trails')) {
          visuals.setBroken(true, 0);
          const L = visuals.lanternPos;
          places.list.forEach((p, i) => visuals.streak(L.clone(), new THREE.Vector3(p.at.x, 40, p.at.z), 5 + (i % 5), i * 0.12));
        }
        if (shot.vfx?.includes('colour_drain')) $('c').style.filter = 'saturate(0.42)';
      }
      // the finale: the Mew glows gold and becomes the owner
      if (id === 'finale' && shot.vfx?.includes('gold_glow') && auth() && !S.revealed && (isMew || ownerRemote())) hostRequest(myId(), { a: 'reveal' });
      if (id === 'head_freed' && shot.vfx?.includes('colour_wave')) refreshBeacons();
      // the white falls part for the arriving ride
      if (id === 'arrival' && (shot.subject === 'gate' || shot.subject === 'ride')) o.gate?.part(shot.subject === 'ride' ? 8 : 14);
      void c;
    },
  });
  function playScene(ids, ctx) { cinema.play(ids, ctx); }
  // a scene everyone watches at the same moment
  function sharedScene(id, ctx = {}) { emit({ k: 'cut', id, run: Math.random().toString(36).slice(2, 8), ...ctx }); }

  const nightPlaces = places.grandPath;
  const nextOnPath = () => nightPlaces.find((p) => !S.shards.includes(p.id)) || null;

  // ---- sending: every event is handled here too, since the network does not echo ----
  function emit(e) { net.sendEvent(e); handle(myId(), e); }
  function request(a, extra = {}) {
    const r = { k: 'qr', a, ...extra };
    if (auth()) hostRequest(myId(), r); else net.sendEvent(r);
  }
  function publish() {
    S.v++;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch { /* ignore */ }
    const snap = JSON.parse(JSON.stringify(S));
    net.sendEvent({ k: 'q', s: snap });
    applySnapshot(snap);
  }

  // ---- host: the one place the rules are decided --------------------------------
  function hostRequest(from, r) {
    const p = places.byId[r.place];
    if (r.a === 'start' && p && !S.activity) {
      const freed = S.shards.includes(p.id);
      S.activity = { id: Math.random().toString(36).slice(2, 8), place: p.id, stage: 0, tpl: p.game.template, seed: (Math.random() * 1e9) | 0, replay: freed, n: players().length };
      publish();
    } else if ((r.a === 'won' || r.a === 'skip') && S.activity && (r.aid === S.activity.id || r.a === 'skip')) {
      const a = S.activity, pl = places.byId[a.place];
      S.lastWin = { aid: a.id, place: a.place, stage: a.stage, tpl: a.tpl, replay: !!a.replay, secs: Math.round(r.secs || 0), limit: r.limit || 180 };
      if (a.stage === 0 && !a.replay) {
        S.activity = { id: Math.random().toString(36).slice(2, 8), place: a.place, stage: 1, tpl: pl.challenge.template, seed: (Math.random() * 1e9) | 0, n: players().length };
      } else {
        S.activity = null;
        if (!a.replay && !S.shards.includes(a.place)) S.shards.push(a.place);
        if (S.act >= 4 && nightPlaces.every((q) => S.shards.includes(q.id))) S.act = 5;
      }
      publish();
    } else if (r.a === 'fail' && S.activity && r.aid === S.activity.id) {
      S.activity = null; publish();
      emit({ k: 'qmsg', text: `${places.byId[r.place]?.name || 'The place'}: not this time. Speak to the head to try again.` });
    } else if (r.a === 'hush' && S.act < 4) { S.act = 4; publish(); }
    else if (r.a === 'finale') { S.finale = true; S.act = 5; publish(); }
    else if (r.a === 'reveal') { S.revealed = true; publish(); }
    else if (r.a === 'honoree' && S.act < 2) { S.act = 2; S.act2At = Date.now(); S.act2Shards = S.shards.length; publish(); }
    else if (r.a === 'reset' && director) { S = { v: S.v, act: 1, shards: [], activity: null, finale: false, revealed: false }; publish(); }
  }

  // ---- everyone: show what the state says -------------------------------------------
  function applySnapshot(s) {
    const old = shown;
    S = s; shown = JSON.parse(JSON.stringify(s));
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
    if (old.act < 4 && S.act === 4 && !params.get('act')) playHush(old.shards.length);
    for (const id of S.shards) if (!old.shards.includes(id)) headFreed(places.byId[id]);
    if (old.act < 5 && S.act === 5 && !S.finale) { ui.toast('Every shard of the Grand Path is home. Return to the palace for midnight ✦'); playScene('return_palace', { run: `ret:${S.v}` }); }
    if (!old.finale && S.finale && !params.get('act')) playScene('finale', { run: `fin:${S.v}` });
    if (!old.revealed && S.revealed) o.onReveal && o.onReveal();
    if (S.lastWin && S.lastWin.aid !== old.lastWin?.aid) rewardWin(S.lastWin);
    const a = S.activity, oa = activity ? activity.meta : null;
    if (!a && activity) endActivity();
    else if (a && (!oa || oa.id !== a.id)) beginActivity(a);
    refreshBeacons();
  }

  // starlight and a results card for everyone who was there
  function rewardWin(w) {
    const place = places.byId[w.place];
    if (!place || !o.progress || isMew || !near(place, 260)) return;
    const boss = w.tpl === 'boss_purification';
    const gained = o.progress.award(w.replay ? 5 : w.stage === 0 ? 15 : boss ? 45 : 30, w.stage === 0 ? 'game' : 'challenge');
    const stage = w.stage === 0 ? place.game.name : place.challenge.name;
    const nxt = w.stage === 0 && !w.replay ? `Now the challenge: ${place.challenge.name}` : S.act >= 4 && nextOnPath() ? `Next on the Grand Path: ${nextOnPath().name} (M to sail)` : 'Press M to sail to another place';
    o.progress.results({ place, stage, seconds: w.secs, limit: w.limit, gained, next: nxt });
    o.progress.cheer();
  }

  function refreshBeacons() {
    const states = {};
    const next = nextOnPath();
    for (const p of places.list) {
      if (S.shards.includes(p.id)) states[p.id] = 'freed';
      else if (S.activity?.place === p.id) states[p.id] = 'active';
      else if (S.act >= 4 && next && next.id === p.id) states[p.id] = 'next';
      else if (S.act >= 4) states[p.id] = 'grey';
      else states[p.id] = 'idle';
    }
    visuals.setStates(states);
    if (!cutscene) visuals.setBroken(S.act >= 4 && S.act < 5 && !S.finale, S.shards.length);
    // the Hush greys the world; every freed place gives colour back
    const nightDone = nightPlaces.filter((p) => S.shards.includes(p.id)).length;
    const sat = S.act >= 4 && S.act < 5 && !S.finale ? 0.42 + 0.58 * (nightDone / nightPlaces.length) : 1;
    $('c').style.filter = sat < 0.999 ? `saturate(${sat.toFixed(2)})` : '';
  }

  function beginActivity(a) {
    if (activity) endActivity(true);
    const place = places.byId[a.place];
    const spot = places.spotOf(place);
    actT = 0; reported = false;
    const ctx = {
      scene, spot, seed: a.seed, meId: myId(), party: a.n,
      players, mePos: () => controller.pos, nameOf, combat,
      send: (op) => emit({ k: 'aop', aid: a.id, op }),
      toast: ui.toast, isHost: auth, time: () => actT,
    };
    activity = createActivity(a.tpl, ctx, place);
    activity.meta = a;
    actPlace = place;
    combat.targets = () => activity.targets();
    combat.onHit = (id) => ctx.send({ op: 'hit', id });
    combat.onDimmed = () => emit({ k: 'aop', aid: a.id, op: { op: 'down' } });
    downs = 0;
    combat.reset();
    const stageName = a.stage === 0 ? place.game.name : place.challenge.name;
    hud.act.classList.remove('hidden');
    hud.act.querySelector('.title').textContent = `${place.name}: ${stageName}`;
    hud.act.querySelector('.hint').textContent = activity.title + '. ' + activity.hint;
    hud.act.querySelector('.light').classList.toggle('hidden', !activity.combat);
    const far = controller.pos.distanceTo(spot) > 220;
    ui.toast(a.stage === 0 ? `${place.name}: ${stageName} begins!${far ? ' Open the map (M) to sail there.' : ''}` : `Now the challenge: ${stageName}`);
    if (!far && a.stage === 0 && !a.replay && S.act >= 4) playScene('frozen_head', { place, run: `fh:${a.id}` });
    if (!far && a.stage === 1 && a.tpl === 'boss_purification') playScene('boss_entrance', { place, title: place.challenge?.boss?.name || place.challenge?.name || stageName, run: `boss:${a.id}` });
  }
  function endActivity(silent) {
    if (!activity) return;
    activity.dispose();
    activity = null; actPlace = null;
    combat.enabled = false; combat.targets = () => [];
    hud.act.classList.add('hidden');
    void silent;
  }

  function headFreed(place) {
    if (!place) return;
    const from = places.spotOf(place).clone().add(new THREE.Vector3(0, 3, 0));
    visuals.streak(from, visuals.lanternPos.clone(), 6);
    o.magic?.restore(places.spotOf(place));
    const shardText = `Shard ${S.shards.length} of ${places.list.length} flies home to the Great Lantern`;
    if (!cinema.off && near(place, 320)) { playScene(['head_freed', 'shard', 'farewell'], { place, shardText }); return; }
    const line = place.headChar?.dialogue?.freed || place.headChar?.lines?.[0] || 'Thank you.';
    ui.toast(`✦ ${place.name} is free! ${place.headChar?.name || 'Its head'}: “${line}”`);
    titleCard(`${place.name} is free`, shardText);
  }

  function titleCard(t, s) {
    const c = $('title-card');
    c.querySelector('.t').textContent = t; c.querySelector('.s').textContent = s || '';
    c.classList.remove('hidden'); c.classList.remove('show'); void c.offsetWidth; c.classList.add('show');
    clearTimeout(titleCard.tm); titleCard.tm = setTimeout(() => c.classList.add('hidden'), 4200);
  }

  // ---- the Hush: the lantern cracks and the shards scatter -------------------------
  function playHush(alreadyWon) {
    visuals.setBroken(false, 0);
    cinema.play('the_hush', { alreadyWon, run: `hush:${S.v}`, onEnd: () => { visuals.setBroken(true, S.shards.length); refreshBeacons(); } });
    if (cinema.off) refreshBeacons();
  }

  // ---- place visits: arriving, meeting the people, the frozen head --------------------
  const visited = new Set();
  function arriveAt(place) {
    if (!place || visited.has(place.id)) return;
    visited.add(place.id);
    if (cinema.off) { titleCard(place.name, `${place.headChar?.name || ''} · ${place.game.name}`); return; }
    const freed = S.shards.includes(place.id);
    const first = place.id === 'B08' && cinema.has('tournament') ? 'tournament' : 'enter_place';
    const title = `${place.name}`;
    playScene(freed || S.act < 4 ? [first] : [first, 'meet_people'], { place, title });
  }

  // ---- incoming events -------------------------------------------------------------
  function handle(from, e) {
    if (e.k === 'q') { if (from !== myId()) applySnapshot(e.s); }
    else if (e.k === 'qr') { if (auth()) hostRequest(from, e); }
    else if (e.k === 'qmsg') ui.toast(e.text);
    else if (e.k === 'cut') playScene(e.id, { run: e.run, shipRider: e.shipRider, title: e.title });
    else if (e.k === 'cskip') cinema.vote(e.run, from, 1 + remotes.size);
    else if (e.k === 'aop') {
      if (!activity || activity.meta.id !== e.aid) return;
      if (e.op?.op === 'down') {
        // every knockdown costs the party a heart; when they run out, the light is lost
        downs++;
        ui.toast(`${nameOf(from)}'s light went out! ${Math.max(0, hearts())} ♥ left`);
        if (hearts() < 0 && auth() && !reported) { reported = true; request('fail', { aid: e.aid, place: actPlace.id }); }
        return;
      }
      activity.apply(e.op, from);
    }
    else if (e.k === 'ship') ships.start(e.trip);
    else if (e.k === 'mew') {
      if (MEW_ACTIONS.includes(e.a)) { if (from !== myId()) mew.act(e.a, false); }
      else if (e.a === 'wake') mew.wake();
      else if (e.a === 'carry' || e.a === 'drop') { if (from !== myId()) mew.toggleCarry(false); }
      else if (e.a === 'sound') { if (from !== myId()) mew.sound('mew'); }
      else if (['boop', 'berry', 'tickle'].includes(e.a)) {
        mew.react(e.a);
        if (isMew && from !== myId()) ui.toast({ boop: 'She booped your nose ♥', berry: 'She tossed you a glowing berry ♥', tickle: 'She tickled you ♥' }[e.a]);
      }
    }
  }

  // ---- the sky ship --------------------------------------------------------------
  function sailTo(place) {
    const group = S.act >= 4;
    const riders = group ? [myId(), ...remotes.keys()] : [myId()];
    const c = new THREE.Vector3();
    for (const id of riders) c.add(id === myId() ? controller.pos : remotes.get(id).avatar.root.position);
    c.divideScalar(riders.length); c.y += 1;
    const to = places.spotOf(place);
    emit({ k: 'ship', trip: { id: Math.random().toString(36).slice(2, 8), from: [c.x, c.y, c.z].map((v) => +v.toFixed(1)), to: [to.x, to.y, to.z].map((v) => +v.toFixed(1)), riders, dest: place.id } });
    ui.toast(group ? `All aboard! The sky ship sails for ${place.name}` : `The sky ship sails for ${place.name}`);
  }
  let rideStart = null, riding = false, rideDest = null;
  function updateRide() {
    const rp = ships.riderPos(myId());
    if (rp) {
      if (!riding) {
        riding = true; rideStart = controller.pos.clone();
        const tr = rp.trip, dest = places.byId[tr.dest];
        if (dest) playScene('travel', { place: dest, title: dest.name, from: tr.fromV?.clone() || rideStart.clone(), to: tr.toV?.clone() || places.spotOf(dest).clone(), shipRider: myId() });
      }
      controller.locked = true;
      rideDest = places.byId[rp.trip.dest] || null;
      const deck = rp.pos.clone();
      if (rp.phase === 'board') controller.pos.lerpVectors(rideStart, deck, rp.k * rp.k * (3 - 2 * rp.k));
      else controller.pos.copy(deck);
    } else if (riding) {
      riding = false;
      const land = ships.landingFor(myId()) || controller.pos;
      const dest = rideDest;
      controller.teleport(land.x, land.y + 0.5, land.z);
      controller.locked = !!cutscene;
      if (dest) { visited.delete(dest.id); arriveAt(dest); }
    }
    return riding;
  }

  function openMap() {
    const list = hud.map.querySelector('.list');
    list.innerHTML = '';
    hud.map.querySelector('.sub').textContent = S.act >= 4 ? 'The whole party sails together.' : 'Explore before the night: the ship takes just you.';
    const order = [...nightPlaces, ...places.list.filter((p) => p.schedule !== 'night')];
    for (const p of order) {
      const li = el('li', {}, list);
      const done = S.shards.includes(p.id);
      const night = p.schedule === 'night';
      li.className = (done ? 'done ' : '') + (night ? 'night' : '');
      const d = Math.hypot(controller.pos.x - p.at.x, controller.pos.z - p.at.z);
      li.innerHTML = `<span class="st">${done ? '✦' : night ? p.order : '·'}</span><span class="nm"></span><span class="km">${(d / 1000).toFixed(1)} km</span>`;
      li.querySelector('.nm').textContent = `${p.name}: ${p.game.name}`;
      const b = el('button', { textContent: 'Sail' }, li);
      b.onclick = () => { closeMap(); sailTo(p); };
    }
    hud.map.classList.remove('hidden');
    controller.locked = true;
  }
  function closeMap() { hud.map.classList.add('hidden'); controller.locked = !!cutscene; }
  hud.map.querySelector('.close').onclick = closeMap;
  hud.mapBtn.onclick = () => openMap();

  // ---- nearby things: heads, the sleeping Mew ----------------------------------------
  function nearestPlace(maxD) {
    let best = null, bd = maxD;
    for (const p of places.list) {
      if (!p.spot && Math.hypot(controller.pos.x - p.at.x, controller.pos.z - p.at.z) > 600) continue;
      const s = places.spotOf(p);
      const d = Math.hypot(controller.pos.x - s.x, controller.pos.z - s.z);
      if (d < bd) { bd = d; best = p; }
    }
    return best;
  }

  let nearHead = null;
  function prompt() {
    if (cutscene || riding) return '';
    if (profile.honoree && mew.sleeping && mew.pos.distanceTo(controller.pos) < 3.5) return mew.carried ? 'Press E to set the bubble down' : 'Press E to carry the sleeping Mew';
    if (nearHead) {
      if (S.activity) return S.activity.place === nearHead.id ? '' : `${nearHead.headChar?.name || nearHead.name} waits: finish the game at ${places.byId[S.activity.place].name} first`;
      return S.shards.includes(nearHead.id) ? `Press E to play ${nearHead.game.name} again` : `Press E to help ${nearHead.headChar?.name || 'the head'}: ${nearHead.game.name}`;
    }
    return '';
  }

  function herView() {
    if (profile.honoree) return { head: camera.position.clone(), yaw: controller.camYaw, pitch: controller.camPitch };
    for (const r of remotes.values()) if (r.profile.honoree) return { head: r.avatar.root.position.clone().add(new THREE.Vector3(0, 1.6, 0)), yaw: r.camYaw ?? r.facing, pitch: r.camPitch ?? 0 };
    if (params.get('mewtest') === '1' && !isMew) return { head: controller.pos.clone().add(new THREE.Vector3(0, 1.6, 0)), yaw: controller.camYaw, pitch: controller.camPitch };
    return null;
  }

  // ---- input -----------------------------------------------------------------------
  function onKey(e) {
    if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) return false;
    if (e.code === 'Escape' && !hud.map.classList.contains('hidden')) { closeMap(); return true; }
    if (controller.locked) return false;
    if (e.code === 'KeyM') { openMap(); return true; }
    if (director && e.shiftKey) {
      if (e.code === 'KeyH') { request('hush'); ui.toast('The Hush is coming…'); return true; }
      if (e.code === 'KeyN' && S.activity) { request('skip'); return true; }
      if (e.code === 'KeyF') { request('finale'); return true; }
      if (e.code === 'Digit0') { request('reset'); ui.toast('Quest reset'); return true; }
    }
    if (isMew && !S.revealed) {
      const i = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'].indexOf(e.code);
      if (i >= 0) { mew.act(MEW_ACTIONS[i]); return true; }
      if (e.code === 'KeyX') { mew.sound('mew'); emit({ k: 'mew', a: 'sound' }); return true; }
      if (e.code === 'KeyR' && e.shiftKey && (S.act >= 5 || S.finale || o.celebrating())) { request('reveal'); return true; }
      return false;
    }
    if (profile.honoree && mew.visible) {
      const near = mew.pos.distanceTo(camera.position) < 3.5;
      if (e.code === 'KeyE' && mew.sleeping && mew.pos.distanceTo(controller.pos) < 3.5) { mew.toggleCarry(); return true; }
      if (e.code === 'KeyF' && near) { emit({ k: 'mew', a: 'boop' }); return true; }
      if (e.code === 'KeyG') { emit({ k: 'mew', a: 'berry' }); return true; }
      if (e.code === 'KeyH' && near) { emit({ k: 'mew', a: 'tickle' }); return true; }
    }
    if (e.code === 'KeyE' && nearHead && !S.activity) { request('start', { place: nearHead.id }); return true; }
    if (e.code === 'KeyQ' && activity?.combat) { combat.swing(controller.pos, controller.facing); return true; }
    return false;
  }

  function onTap(nx, ny) {
    if (profile.honoree && mew.visible) {
      const ray = new THREE.Raycaster(); ray.setFromCamera({ x: nx, y: ny }, camera);
      if (ray.ray.distanceToPoint(mew.pos) < 0.45 && mew.pos.distanceTo(camera.position) < 8) { emit({ k: 'mew', a: 'boop' }); return true; }
    }
    if (combat.enabled) return combat.shoot(nx, ny);
    return false;
  }

  // ---- per frame ------------------------------------------------------------------
  let clockAcc = 0, honoreeSeen = false;
  const fwd = new THREE.Vector3();
  function nearestOpen() {
    let best = null, bd = Infinity;
    for (const p of places.list) {
      if (S.shards.includes(p.id)) continue;
      const d = Math.hypot(p.at.x - controller.pos.x, p.at.z - controller.pos.z);
      if (d < bd) { bd = d; best = p; }
    }
    return best;
  }
  function goalText() {
    if (S.finale) return 'Midnight: the celebration!';
    if (S.act >= 5) return clock.timelineEvent().onTheNight ? 'Gather at the palace for midnight' : 'Return to the palace for the finale';
    if (S.activity) { const p = places.byId[S.activity.place]; return `Win ${S.activity.stage === 0 ? p.game.name : p.challenge.name} at ${p.name}`; }
    if (S.act >= 4) { const n = nextOnPath(); const k = nightPlaces.filter((q) => S.shards.includes(q.id)).length; return n ? `Grand Path ${k + 1}/${nightPlaces.length}: free the head at ${n.name} (E)` : 'Return to the palace'; }
    return 'Explore: find a glowing pillar, talk to its head (E) and win its game';
  }

  function update(dt, t) {
    ships.update(dt, t);
    updateRide();
    if (cutscene) cutscene.update(dt);
    combat.update(dt);
    visuals.update(t, dt, camera.position);

    // host: the clock and the guests move the story on
    if ((clockAcc -= dt) <= 0) {
      clockAcc = 2;
      if (auth()) {
        const tl = clock.timelineEvent();
        if (tl.onTheNight && S.act < 4 && tl.minutes >= 21 * 60 + 10 && tl.minutes < 24 * 60) hostRequest(myId(), { a: 'hush' });
        // other days the story moves on with play: the Hush falls a few minutes after her
        // surprise (or once she has won a shard), or after three shards if she is not here
        if (!tl.onTheNight && S.act < 4 && !S.activity && !cutscene) {
          const since = S.act === 2 && S.act2At ? Date.now() - S.act2At : 0;
          if ((S.act === 2 && (since > 240000 || S.shards.length > (S.act2Shards ?? 0))) || (S.act === 1 && S.shards.length >= 3)) hostRequest(myId(), { a: 'hush' });
        }
        // midnight on the night always brings the finale; otherwise it begins once the
        // Grand Path is done and someone stands at the palace
        if (!S.finale && !cutscene) {
          const atPalace = players().some((q) => q.pos.distanceTo(places.spotOf(places.byId.B01)) < 180);
          if ((tl.onTheNight && o.celebrating()) || (S.act >= 5 && !tl.onTheNight && atPalace)) hostRequest(myId(), { a: 'finale' });
        }
        const honoreeHere = profile.honoree || [...remotes.values()].some((r) => r.profile.honoree);
        if (honoreeHere && !honoreeSeen) { honoreeSeen = true; hostRequest(myId(), { a: 'honoree' }); }
      }
    }

    // the running game
    if (activity && !cutscene) {
      actT += dt;
      const spot = places.spotOf(actPlace);
      combat.enabled = activity.combat && !isMew && controller.pos.distanceTo(spot) < 160;
      activity.update(dt, actT);
      if (!reported && activity.won) { reported = true; request('won', { aid: activity.meta.id, place: actPlace.id, secs: actT, limit: activity.limit }); }
      else if (!reported && (activity.failed || actT > activity.limit)) { reported = true; request('fail', { aid: activity.meta.id, place: actPlace.id }); }
    }
    // (a win or a loss may have just ended the game: the host applies it at once)
    if (activity && !cutscene) {
      hud.act.querySelector('.prog').textContent = activity.progress();
      hud.act.querySelector('.timer').textContent = `${activity.combat ? '♥'.repeat(Math.max(0, hearts())) + ' · ' : ''}${Math.max(0, Math.ceil(activity.limit - actT))} s`;
      hud.act.querySelector('.light i').style.width = `${combat.light}%`;
      hud.act.classList.toggle('dimmed', combat.dimmed > 0);
    }

    // heads near you and title cards as you arrive somewhere
    nearHead = null;
    const np = nearestPlace(260);
    if (np) {
      const s = places.spotOf(np);
      const d = Math.hypot(controller.pos.x - s.x, controller.pos.z - s.z);
      if (d < 6) nearHead = np;
      const last = seenTitles.get(np.id) || 0;
      if (Date.now() - last > 300000 && !riding && !cutscene && d < 150 && !S.activity) {
        seenTitles.set(np.id, Date.now());
        if (visited.has(np.id)) titleCard(np.name, `${np.headChar?.name || ''} · ${np.game.name}`);
        else arriveAt(np);
      }
    }

    // the quest panel
    const actName = S.finale || S.act >= 5 ? (acts[5]?.name || 'Midnight') : acts[Math.min(S.act, 4)]?.name;
    hud.quest.querySelector('.act').textContent = actName;
    hud.quest.querySelector('.shards').textContent = `✦ ${S.shards.length} / ${places.list.length} star shards`;
    const target = S.act >= 5 ? places.byId.B01 : S.activity ? places.byId[S.activity.place] : S.act >= 4 ? nextOnPath() : nearestOpen();
    hud.quest.querySelector('.goal').textContent = goalText();
    const nx = hud.quest.querySelector('.next');
    if (target) {
      const ts = target.spot || target.at;
      const dx = ts.x - controller.pos.x, dz = ts.z - controller.pos.z, d = Math.hypot(dx, dz);
      camera.getWorldDirection(fwd);
      const rel = Math.atan2(dx, dz) - Math.atan2(fwd.x, fwd.z);
      nx.querySelector('.arrow').style.transform = `rotate(${(-rel * 180 / Math.PI - 90).toFixed(0)}deg)`;
      nx.querySelector('.txt').textContent = `${S.activity ? 'Now' : 'Next'}: ${target.name} · ${d > 1000 ? (d / 1000).toFixed(1) + ' km' : Math.round(d) + ' m'}`;
      nx.classList.remove('hidden');
    } else nx.classList.add('hidden');
    hud.quest.querySelector('.sky').textContent = `${clock.state.label}${clock.state.onTheNight ? ' · the night' : ''}`;
  }

  // late joiners get the state from the host
  net.on('join', (id, prof, fromRoster) => {
    if (auth()) net.sendEvent({ k: 'q', s: JSON.parse(JSON.stringify(S)) });
    // the gentlemen arrive by flying ship once she is here
    if (auth() && !fromRoster && prof && prof.gender === 'male' && !prof.mew && S.act >= 2 && !S.finale && !S.activity) {
      const to = places.spotOf(places.byId.B01 || places.list[0]);
      const from = to.clone().add(new THREE.Vector3(700, 600, -1200));
      const trip = { id: Math.random().toString(36).slice(2, 8), from: [from.x, from.y, from.z].map((v) => +v.toFixed(1)), to: [to.x, to.y, to.z].map((v) => +v.toFixed(1)), riders: [id], dest: null };
      emit({ k: 'ship', trip });
      sharedScene('ship_docks', { shipRider: id });
    }
  });
  net.on('event', (id, e) => handle(id, e));
  net.on('status', (s) => { if (s === 'host') publish(); });
  refreshBeacons();

  return {
    update, onKey, onTap, prompt, herView, nameOf, request, openMap, sailTo, playScene, sharedScene,
    get state() { return S; },
    get activity() { return activity; },
    get cutscene() { return cutscene; },
    get busy() { return !!activity || !!cutscene || riding; },
    get riding() { return riding; },
    get finale() { return S.finale; },
    get revealed() { return S.revealed; },
    nextPlace: () => { const p = S.activity ? places.byId[S.activity.place] : nextOnPath(); return p ? (p.spot || p.at) : null; },
    emit,
    blobHit(to) { combat.burst(to, '#ff9bd6', 1.5); if (profile.honoree) { screenSplash(); } },
    mewSend(e) { emit({ k: 'mew', ...e }); },
  };
}
