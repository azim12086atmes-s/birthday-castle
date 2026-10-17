// The entrance screen and wardrobe: name, lady/gentleman, outfits, colours.
import { CONFIG } from './config.js';
import { OUTFITS, SKINS, HAIR_COLORS, outfitsFor } from './avatar.js';
import { savedQuality } from './quality.js';

const KEY = 'castle.profile';
const $ = (id) => document.getElementById(id);

export function loadProfile() {
  let p = {};
  try { p = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { /* ignore */ }
  const params = new URLSearchParams(location.search);
  const honoree = params.get('key') === CONFIG.honoreeKey;
  const profile = {
    name: p.name || '',
    gender: p.gender || 'female',
    outfit: p.outfit || 'rose-gown',
    modest: p.modest || 'rose-gown',
    hair: p.hair || 'long',
    skin: p.skin || SKINS[0],
    hairColor: p.hairColor || HAIR_COLORS[0],
    scarf: p.scarf || '#f2ead8',
    honoree,
    mew: !!CONFIG.mewKey && params.get('mew') === CONFIG.mewKey,     // the owner, playing her Mew
  };
  if (profile.mew) profile.gender = 'male';
  if (honoree) { profile.gender = 'female'; if (!p.name) profile.name = CONFIG.honoreeName; }
  return profile;
}

export function saveProfile(p) {
  const { honoree, mew, ...rest } = p; void honoree; void mew;
  try { localStorage.setItem(KEY, JSON.stringify(rest)); } catch { /* ignore */ }
}

function card(o, on, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'card' + (on ? ' on' : '');
  if (o) {
    const s = document.createElement('div');
    s.className = o.shape === 'coat' || o.shape === 'sherwani' ? 'coat' : 'dress';
    s.style.background = o.gradient ? `linear-gradient(${o.color}, ${o.gradient})` : `linear-gradient(${o.color}, ${o.color})`;
    s.style.boxShadow = `inset 0 -4px 0 ${o.trim}`;
    if (o.sparkle) s.style.filter = 'drop-shadow(0 0 6px ' + o.sparkle + ')';
    b.append(s, o.name);
  } else {
    const s = document.createElement('div'); s.className = 'none'; s.textContent = '—';
    b.append(s, 'None');
  }
  b.onclick = onClick;
  return b;
}

export function openLobby(profile, { inGame = false, onEnter }) {
  const lobby = $('lobby');
  lobby.classList.remove('hidden');
  $('enter').textContent = inGame ? 'Save' : 'Enter the Castle';
  $('lobby-sub').textContent = profile.honoree
    ? `Welcome, ${CONFIG.honoreeName}. This whole world was made for you.`
    : 'A world of floating islands, made with love.';
  $('gender-field').classList.toggle('hidden', profile.honoree);
  $('name').value = profile.name;
  $('quality').value = savedQuality();

  const render = () => {
    const female = profile.gender === 'female';
    document.querySelectorAll('[data-gender]').forEach((b) => b.classList.toggle('on', b.dataset.gender === profile.gender));
    $('female-opts').classList.toggle('hidden', !female);
    $('male-opts').classList.toggle('hidden', female);
    $('hair-colour-title').textContent = female && profile.hair === 'hijab' ? 'Hijab colour' : 'Hair colour';

    if (female) {
      if (!OUTFITS[profile.modest] || OUTFITS[profile.modest].gender !== 'female') profile.modest = 'rose-gown';
      if (!OUTFITS[profile.outfit] || OUTFITS[profile.outfit].gender !== 'female') profile.outfit = profile.modest;
      const party = OUTFITS[profile.outfit].kind === 'party';
      const ml = $('modest-list'); ml.innerHTML = '';
      for (const o of outfitsFor('female', 'default')) {
        ml.append(card(o, profile.modest === o.id, () => { profile.modest = o.id; if (!party) profile.outfit = o.id; render(); }));
      }
      const pl = $('party-list'); pl.innerHTML = '';
      pl.append(card(null, !party, () => { profile.outfit = profile.modest; render(); }));
      for (const o of outfitsFor('female', 'party')) {
        pl.append(card(o, profile.outfit === o.id, () => { profile.outfit = o.id; render(); }));
      }
      document.querySelectorAll('[data-hair]').forEach((b) => b.classList.toggle('on', b.dataset.hair === profile.hair));
    } else {
      if (!OUTFITS[profile.outfit] || OUTFITS[profile.outfit].gender !== 'male') profile.outfit = 'prince-coat';
      profile.modest = profile.outfit;
      profile.hair = 'short';
      const ml = $('male-list'); ml.innerHTML = '';
      for (const o of outfitsFor('male')) ml.append(card(o, profile.outfit === o.id, () => { profile.outfit = o.id; profile.modest = o.id; render(); }));
    }

    const sk = $('skin-list'); sk.innerHTML = '';
    for (const c of SKINS) {
      const s = document.createElement('button'); s.type = 'button'; s.className = 'swatch' + (profile.skin === c ? ' on' : '');
      s.style.background = c; s.onclick = () => { profile.skin = c; render(); }; sk.append(s);
    }
    const hl = $('hair-list'); hl.innerHTML = '';
    const hairCols = female && profile.hair === 'hijab' ? ['#f2ead8', '#26305e', '#e78fb3', '#7fb79a', '#b49be0', '#1d1d2e'] : HAIR_COLORS;
    for (const c of hairCols) {
      const s = document.createElement('button'); s.type = 'button'; s.className = 'swatch' + ((profile.hair === 'hijab' ? profile.scarf : profile.hairColor) === c ? ' on' : '');
      s.style.background = c;
      s.onclick = () => { if (profile.hair === 'hijab') profile.scarf = c; else profile.hairColor = c; render(); };
      hl.append(s);
    }
  };

  document.querySelectorAll('[data-gender]').forEach((b) => { b.onclick = () => { profile.gender = b.dataset.gender; profile.hair = profile.gender === 'female' ? 'long' : 'short'; render(); }; });
  document.querySelectorAll('[data-hair]').forEach((b) => { b.onclick = () => { profile.hair = b.dataset.hair; render(); }; });
  render();

  $('enter').onclick = () => {
    profile.name = ($('name').value || '').trim().slice(0, 18) || (profile.honoree ? CONFIG.honoreeName : 'Guest');
    saveProfile(profile);
    lobby.classList.add('hidden');
    onEnter(profile, $('quality').value);
  };
  $('name').onkeydown = (e) => { if (e.key === 'Enter') $('enter').click(); };
}
