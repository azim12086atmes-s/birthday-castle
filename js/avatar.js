// Player avatars: modest, faceless (no eyes anywhere in this world), built from
// a few lathe shapes so dozens of players stay cheap to draw.
import * as THREE from 'three';
import { toon, glowBasic } from './world/materials.js';
import { textTexture, glowTexture } from './world/textures.js';

// kind: 'default' outfits everyone can see; 'party' outfits only women can see.
export const OUTFITS = {
  // women — modest everyday gowns
  'rose-gown': { gender: 'female', kind: 'default', name: 'Rose Gown', color: '#e78fb3', trim: '#ffd47a', shape: 'gown' },
  'moon-abaya': { gender: 'female', kind: 'default', name: 'Moonlight Abaya', color: '#26305e', trim: '#c9d4ff', shape: 'abaya' },
  'meadow-dress': { gender: 'female', kind: 'default', name: 'Meadow Dress', color: '#7fb79a', trim: '#fff2c4', shape: 'gown', cape: '#e9f7ee' },
  'lilac-kaftan': { gender: 'female', kind: 'default', name: 'Lilac Kaftan', color: '#b49be0', trim: '#ffd47a', shape: 'abaya' },
  // women — party gowns (visible only to other women)
  'starlight-ballgown': { gender: 'female', kind: 'party', name: 'Starlight Ballgown', color: '#2b3cb0', trim: '#9fe8ff', shape: 'ballgown', sparkle: '#cfe8ff' },
  'aurora-gown': { gender: 'female', kind: 'party', name: 'Aurora Gown', color: '#2fb2a0', trim: '#ff9bd6', shape: 'ballgown', sparkle: '#b8fff0', gradient: '#d65fb5' },
  'golden-princess': { gender: 'female', kind: 'party', name: 'Golden Princess', color: '#e8b54a', trim: '#fff6d8', shape: 'ballgown', sparkle: '#fff2b0', crown: true },
  'sakura-gown': { gender: 'female', kind: 'party', name: 'Sakura Gown', color: '#f6b6cf', trim: '#ffffff', shape: 'ballgown', sparkle: '#ffe0ee', gradient: '#ffffff' },
  // men
  'prince-coat': { gender: 'male', kind: 'default', name: 'Prince Coat', color: '#273a8a', trim: '#ffd47a', shape: 'coat', cape: '#8a1f3a' },
  'royal-sherwani': { gender: 'male', kind: 'default', name: 'Royal Sherwani', color: '#f2ead8', trim: '#d9a441', shape: 'sherwani' },
  'mage-robe': { gender: 'male', kind: 'default', name: 'Star Mage Robe', color: '#4b2a8a', trim: '#9fe8ff', shape: 'robe' },
  'knight-tunic': { gender: 'male', kind: 'default', name: 'Moon Knight', color: '#c9cfe0', trim: '#5b7cff', shape: 'coat', cape: '#2c3f9a' },
};

export const SKINS = ['#f6d7c3', '#e8b896', '#c98e66', '#8d5a3b'];
export const HAIR_COLORS = ['#2a1a14', '#5a3420', '#b07a3c', '#e8d29a', '#1d1d2e'];

export function outfitsFor(gender, kind) {
  return Object.entries(OUTFITS).filter(([, o]) => o.gender === gender && (!kind || o.kind === kind)).map(([id, o]) => ({ id, ...o }));
}

// The outfit a viewer is allowed to see on a player.
export function visibleOutfit(profile, viewerGender) {
  const o = OUTFITS[profile.outfit];
  if (!o) return profile.gender === 'female' ? 'rose-gown' : 'prince-coat';
  if (o.kind === 'party' && viewerGender !== 'female') return OUTFITS[profile.modest] ? profile.modest : 'rose-gown';
  return profile.outfit;
}

let sparkleMap;
function sparkleTex() {
  if (sparkleMap) return sparkleMap;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 128, y = Math.random() * 128, r = Math.random() * 2 + 0.6;
    g.fillStyle = `rgba(255,255,255,${0.5 + Math.random() * 0.5})`;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  sparkleMap = new THREE.CanvasTexture(c);
  sparkleMap.wrapS = sparkleMap.wrapT = THREE.RepeatWrapping;
  sparkleMap.repeat.set(3, 2);
  return sparkleMap;
}

const PROFILES = {
  gown: [[0.0, 0.02], [0.62, 0.02], [0.5, 0.45], [0.36, 0.9], [0.2, 1.0], [0.22, 1.12], [0.24, 1.32], [0.21, 1.42], [0.08, 1.48], [0, 1.48]],
  abaya: [[0.0, 0.02], [0.52, 0.02], [0.45, 0.5], [0.34, 1.0], [0.27, 1.25], [0.25, 1.4], [0.09, 1.48], [0, 1.48]],
  ballgown: [[0.0, 0.02], [0.95, 0.02], [0.92, 0.18], [0.7, 0.55], [0.4, 0.88], [0.19, 1.0], [0.21, 1.12], [0.24, 1.32], [0.21, 1.42], [0.08, 1.48], [0, 1.48]],
  coat: [[0.0, 0.62], [0.36, 0.62], [0.3, 0.95], [0.25, 1.12], [0.27, 1.38], [0.24, 1.45], [0.09, 1.5], [0, 1.5]],
  sherwani: [[0.0, 0.55], [0.32, 0.55], [0.27, 0.95], [0.25, 1.12], [0.27, 1.38], [0.24, 1.45], [0.09, 1.5], [0, 1.5]],
  robe: [[0.0, 0.02], [0.45, 0.02], [0.36, 0.5], [0.28, 1.0], [0.27, 1.38], [0.24, 1.45], [0.09, 1.5], [0, 1.5]],
};

function garmentMaterial(o) {
  const opts = { emissive: new THREE.Color(o.color).multiplyScalar(0.25) };
  if (o.sparkle) Object.assign(opts, { emissive: new THREE.Color(o.sparkle), emissiveMap: sparkleTex(), emissiveIntensity: 1.2 });
  return toon(o.color, opts);
}

function nameTag(name, honoree) {
  const t = textTexture(name, { font: '600 34px Georgia, serif', color: honoree ? '#ffe9a8' : '#ffffff', glow: honoree ? '#ffbf3c' : '#8f7bff' });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, fog: false }));
  s.scale.set(t.userData.aspect * 0.42, 0.42, 1);
  s.position.y = 2.35;
  s.renderOrder = 5;
  return s;
}

export class Avatar {
  constructor(profile, viewerGender) {
    this.root = new THREE.Group();
    this.body = new THREE.Group();
    this.root.add(this.body);
    this.walk = 0;
    this.emote = 0;
    this.build(profile, viewerGender);
  }

  build(profile, viewerGender) {
    this.profile = profile;
    this.viewerGender = viewerGender;
    while (this.body.children.length) this.body.remove(this.body.children[0]);
    if (this.tag) this.root.remove(this.tag);

    const outfitId = visibleOutfit(profile, viewerGender);
    const o = OUTFITS[outfitId];
    const skin = toon(profile.skin || SKINS[0], { emissive: '#3a2030', emissiveIntensity: 0.4 });
    const cloth = garmentMaterial(o);
    const trim = glowBasic(o.trim);
    const B = this.body;

    const pts = PROFILES[o.shape].map(([x, y]) => new THREE.Vector2(x, y));
    const garment = new THREE.Mesh(new THREE.LatheGeometry(pts, 18), cloth);
    B.add(garment);
    this.skirt = garment;
    if (o.gradient) {
      const over = new THREE.Mesh(new THREE.LatheGeometry(pts.filter((p) => p.y < 0.6).concat([new THREE.Vector2(0, 0.6)]), 18), toon(o.gradient, { transparent: true, opacity: 0.45, emissive: o.gradient, emissiveIntensity: 0.4 }));
      over.scale.set(1.02, 1, 1.02); B.add(over);
    }
    // hem and waist trims
    const hemR = pts[1].x;
    const hem = new THREE.Mesh(new THREE.TorusGeometry(hemR, 0.03, 4, 32), trim);
    hem.rotation.x = Math.PI / 2; hem.position.y = pts[1].y + 0.02; B.add(hem);
    const waistY = o.shape === 'ballgown' || o.shape === 'gown' ? 1.0 : 1.12;
    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 4, 24), trim);
    belt.rotation.x = Math.PI / 2; belt.position.y = waistY; B.add(belt);

    // legs (only visible below short coats)
    this.legs = [];
    if (o.shape === 'coat' || o.shape === 'sherwani') {
      const legMat = toon(o.shape === 'sherwani' ? '#f7f1e3' : '#1d2140', { emissive: '#0d0d20' });
      for (const s of [-1, 1]) {
        const g = new THREE.Group(); g.position.set(s * 0.11, 0.85, 0);
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.85, 8), legMat); leg.position.y = -0.42;
        const boot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.28), toon('#3a2a20')); boot.position.set(0, -0.82, 0.05);
        g.add(leg, boot); B.add(g); this.legs.push(g);
      }
    }

    // arms with long sleeves
    this.arms = [];
    for (const s of [-1, 1]) {
      const g = new THREE.Group(); g.position.set(s * 0.27, 1.4, 0);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.1, 0.62, 8), cloth); sleeve.position.y = -0.3;
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 4, 12), trim); cuff.rotation.x = Math.PI / 2; cuff.position.y = -0.6;
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), skin); hand.position.y = -0.68;
      g.rotation.z = s * 0.12;
      g.add(sleeve, cuff, hand); B.add(g); this.arms.push(g);
    }

    // head: smooth and faceless
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), skin);
    head.scale.set(0.95, 1.08, 1);
    head.position.y = 1.67;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 8), skin); neck.position.y = 1.52;
    B.add(head, neck);
    const hairMat = toon(profile.hairColor || HAIR_COLORS[0], { emissive: '#120a10' });
    const style = profile.hair || (profile.gender === 'female' ? 'long' : 'short');
    if (style === 'hijab') {
      const scarfMat = toon(profile.scarf || o.trim, { emissive: new THREE.Color(profile.scarf || o.trim).multiplyScalar(0.2) });
      const wrap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12, Math.PI * 0.62, Math.PI * 1.76), scarfMat);
      wrap.position.y = 1.68; wrap.scale.set(1, 1.1, 1.05);
      const drape = new THREE.Mesh(new THREE.ConeGeometry(0.33, 0.42, 16, 1, true), scarfMat); drape.position.y = 1.45;
      B.add(wrap, drape);
    } else if (style === 'long') {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.185, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
      cap.position.y = 1.69; cap.rotation.x = -0.25;
      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.62, 12, 1, true, Math.PI * 0.5, Math.PI), hairMat);
      back.position.set(0, 1.42, -0.04); back.rotation.y = Math.PI;
      B.add(cap, back);
    } else {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.182, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMat);
      cap.position.y = 1.7; cap.rotation.x = -0.3;
      B.add(cap);
    }
    if (o.cape) {
      const cape = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.5, 1.2, 14, 1, true, Math.PI * 0.6, Math.PI * 0.8), toon(o.cape, { side: THREE.DoubleSide, emissive: new THREE.Color(o.cape).multiplyScalar(0.2) }));
      cape.position.set(0, 0.85, -0.04); cape.rotation.y = Math.PI; B.add(cape);
      this.cape = cape;
    } else this.cape = null;
    if (o.crown || profile.honoree) {
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.09, 8, 1, true), glowBasic('#ffd47a', { side: THREE.DoubleSide }));
      crown.position.y = 1.86; B.add(crown);
      for (let i = 0; i < 8; i++) {
        const sp = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.07, 4), glowBasic('#ffd47a'));
        const a = (i / 8) * Math.PI * 2; sp.position.set(Math.cos(a) * 0.115, 1.94, Math.sin(a) * 0.115); B.add(sp);
      }
    }
    if (profile.honoree) {
      const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffcf6a', transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
      aura.scale.set(2.6, 3.6, 1); aura.position.y = 1; B.add(aura);
    }
    this.body.traverse((o) => { if (o.isMesh && o.material.isMeshToonMaterial) o.castShadow = true; });
    this.tag = nameTag(profile.name || 'Guest', profile.honoree);
    this.root.add(this.tag);
  }

  // speed in m/s drives the walk cycle
  animate(dt, speed, t) {
    this.walk += dt * (2 + speed * 1.6);
    const sw = Math.min(speed / 4, 1);
    this.arms[0].rotation.x = Math.sin(this.walk) * 0.6 * sw;
    this.arms[1].rotation.x = -Math.sin(this.walk) * 0.6 * sw;
    for (let i = 0; i < this.legs.length; i++) this.legs[i].rotation.x = (i ? -1 : 1) * Math.sin(this.walk) * 0.7 * sw;
    this.skirt.rotation.y = Math.sin(this.walk) * 0.06 * sw;
    this.body.position.y = Math.abs(Math.sin(this.walk)) * 0.05 * sw + Math.sin(t * 2) * 0.008;
    if (this.cape) this.cape.rotation.x = -0.1 - sw * 0.35;
    if (this.emote > 0) {
      this.emote -= dt;
      this.body.rotation.y += dt * 9;
      this.arms[0].rotation.z = 1.3; this.arms[1].rotation.z = -1.3;
      if (this.emote <= 0) { this.body.rotation.y = 0; this.arms[0].rotation.z = -0.12; this.arms[1].rotation.z = 0.12; }
    }
  }

  twirl() { this.emote = 1.4; }
}
