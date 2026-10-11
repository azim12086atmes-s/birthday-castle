// B01 the Princess Palace, built from build sheet B01 (owner sheet 03, revision 03,
// with sheets 02, 07 and 16). An 800 x 680 m garden palace at the labelled heights
// (drawn heights x H_SCALE): an arcaded rose podium, a 426 m main front with the
// Rose Gate and four great lancets, roof gardens stepping up to the north, the great
// purple onion dome west of centre, a cluster of needle spires to 1100 m, the 700 m
// cone pavilion on the north axis, domed corner pavilions, waterfalls at the rear,
// and the G02 roof court where players walk among roses and fountains.
//
// Laptop plan: the massing is one merged mesh per material; the instanced detail
// (spirelets, trees, lanterns, garlands) and the roof court show within 1500 m.
import * as THREE from 'three';
import { toon, glowBasic, additive, nightGrade } from './materials.js';
import { glowTexture, rng } from './textures.js';
import { Kit, box, cyl, lathe, cap, scaleUV, wallBox, waterMaterial, haloPoints, roseWindowTexture } from './kit.js';
import { pointedArchShape, archFrameGeometry } from './arch.js';
import { PAL, H_SCALE as H, GATE, LANDING, CASCADE, ROOF, PLAZA, addCollider, addPad } from './layout.js';
import {
  IVORY, PEARL, ROSE, GOLD, paint, merge, finialGeo, spireletGeo, cypressGeo, blossomGeo, orangeTreeGeo, roseClumpGeo,
  postLampGeo, hangingLanternGeo, lotusFountainGeo, benchGeo, artifactMaterials, instances,
} from './artifacts.js';
import { MOOD } from './sky.js';

const BY = PAL.y, FZ = PAL.hd, HW = PAL.hw;
const L0 = 45 * H, L1 = 155 * H;                       // podium top, main front top (124 m, 426 m)
const SILL = GATE.sill;

// --- textures (one tile each; the vertex colour tints them) -----------------------------
function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function tex(c, wrap = true) {
  const t = new THREE.CanvasTexture(c);
  if (wrap) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
const R = rng(303);
function marble(g, w, h, base, vein = 'rgba(190,150,160,0.18)') {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  g.strokeStyle = vein; g.lineWidth = 1;
  for (let i = 0; i < 18; i++) { g.beginPath(); const x = R() * w, y = R() * h; g.moveTo(x, y); g.bezierCurveTo(x + R() * 60 - 30, y + R() * 60, x + R() * 80 - 40, y + R() * 120, x + R() * 60 - 30, y + R() * 200); g.stroke(); }
}
// a pointed lancet from its bottom (y1) to its tip (y0)
function lancetPath(g, x, w, y0, y1) {
  const ys = y0 + w * 0.95;
  g.beginPath(); g.moveTo(x, y1); g.lineTo(x, ys);
  g.quadraticCurveTo(x, y0 + w * 0.3, x + w / 2, y0); g.quadraticCurveTo(x + w, y0 + w * 0.3, x + w, ys);
  g.lineTo(x + w, y1); g.closePath();
}
// indigo stained glass with multicolour accents
function glassFill(g, x, y, w, h, glow) {
  const lg = g.createLinearGradient(0, y, 0, y + h);
  lg.addColorStop(0, glow ? '#c8c0ff' : '#5a5ae0'); lg.addColorStop(0.55, glow ? '#a0b4ff' : '#3a44c8'); lg.addColorStop(1, glow ? '#ffd0f0' : '#7a4ac8');
  g.fillStyle = lg; g.fill();
  if (glow) return;
  g.save(); g.clip();
  const cols = ['#6f8cff', '#a77cff', '#ff9ad8', '#ffd36a', '#4ac0ff', '#2a2f9a'];
  for (let i = 0; i < w * h / 90; i++) { g.fillStyle = cols[Math.floor(R() * cols.length)]; g.globalAlpha = 0.35; g.fillRect(x + R() * w, y + R() * h, 3 + R() * 6, 3 + R() * 8); }
  g.globalAlpha = 1; g.restore();
}
function star8(g, x, y, r, fill) {
  g.beginPath();
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 - Math.PI / 2, q = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); }
  g.closePath(); g.fillStyle = fill; g.fill();
}
function pair(draw, w, h) {
  const [c, g] = cv(w, h), [e, ge] = cv(w, h);
  ge.fillStyle = '#000'; ge.fillRect(0, 0, w, h);
  draw(g, false); draw(ge, true);
  return { map: tex(c), glow: tex(e) };
}
// wing wall bay (25 m x 100 m): slim twin lancets with a quatrefoil, gold string courses
const wingTex = () => pair((g, glow) => {
  if (!glow) {
    marble(g, 256, 1024, '#f8efe9');
    g.fillStyle = '#efc4c8'; g.fillRect(0, 0, 256, 34); g.fillRect(0, 984, 256, 40);
    g.fillStyle = '#d9b25a'; g.fillRect(0, 34, 256, 6); g.fillRect(0, 978, 256, 6);
    g.fillStyle = 'rgba(200,150,160,0.25)'; g.fillRect(0, 40, 14, 938); g.fillRect(242, 40, 14, 938);
  }
  for (const x of [56, 140]) { lancetPath(g, x, 60, 250, 900); glassFill(g, x, 250, 60, 650, glow); if (!glow) { g.strokeStyle = '#d9b25a'; g.lineWidth = 5; g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(x + 30, 290); g.lineTo(x + 30, 900); g.stroke(); for (let y = 380; y < 900; y += 130) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 60, y); g.stroke(); } } }
  g.beginPath(); g.arc(128, 160, 40, 0, Math.PI * 2); glassFill(g, 88, 120, 80, 80, glow);
  if (!glow) { g.strokeStyle = '#d9b25a'; g.lineWidth = 5; g.stroke(); star8(g, 128, 160, 24, '#e8c060'); g.fillStyle = '#efc4c8'; g.fillRect(40, 905, 176, 22); for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? '#ff9cc4' : '#5f9a52'; g.beginPath(); g.arc(50 + i * 20, 902, 9, 0, Math.PI * 2); g.fill(); } }
}, 256, 1024);
// podium (24 m x 124 m): two storeys of round-arched arcades with rose planters on every sill
const podiumTex = () => pair((g, glow) => {
  if (!glow) marble(g, 256, 512, '#f2c7c9', 'rgba(255,255,255,0.25)');
  for (const y0 of [0, 256]) {
    const arch = () => { g.beginPath(); g.moveTo(52, y0 + 226); g.lineTo(52, y0 + 108); g.arc(128, y0 + 108, 76, Math.PI, 0); g.lineTo(204, y0 + 226); g.closePath(); };
    arch();
    if (glow) { g.fillStyle = y0 ? '#a07040' : '#604030'; g.fill(); continue; }
    const lg = g.createLinearGradient(0, y0 + 32, 0, y0 + 226); lg.addColorStop(0, '#3a2648'); lg.addColorStop(1, '#a8706a'); g.fillStyle = lg; g.fill();
    g.strokeStyle = '#fbf4ee'; g.lineWidth = 12; g.stroke(); g.strokeStyle = '#d9b25a'; g.lineWidth = 3; arch(); g.stroke();
    g.fillStyle = '#fbf4ee'; g.fillRect(0, y0 + 226, 256, 22); g.fillRect(0, y0, 18, 256); g.fillRect(238, y0, 18, 256);
    for (let i = 0; i < 12; i++) { g.fillStyle = i % 3 ? '#ff9cc4' : (i % 2 ? '#ffe2ee' : '#4f8a46'); g.beginPath(); g.arc(46 + i * 15, y0 + 222, 8, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#d9b25a'; g.fillRect(0, y0 + 248, 256, 5);
  }
}, 256, 512);
// corner pavilion face (one octagon face, the whole shaft): banner panel with a gold star
const towerTex = () => pair((g, glow) => {
  if (!glow) {
    marble(g, 128, 1024, '#f8f0ea');
    g.fillStyle = '#efc4c8'; g.fillRect(0, 0, 10, 1024); g.fillRect(118, 0, 10, 1024); g.fillRect(0, 950, 128, 74);
    g.fillStyle = '#d9b25a'; for (const y of [40, 300, 700, 944]) g.fillRect(0, y, 128, 8);
  }
  g.beginPath(); g.moveTo(64, 340); g.lineTo(98, 380); g.lineTo(98, 640); g.lineTo(64, 680); g.lineTo(30, 640); g.lineTo(30, 380); g.closePath();
  g.fillStyle = glow ? '#202060' : '#2e2f96'; g.fill();
  if (!glow) { g.strokeStyle = '#d9b25a'; g.lineWidth = 5; g.stroke(); }
  star8(g, 64, 510, 26, glow ? '#ffe9a0' : '#f0c860');
  for (const x of [34, 70]) { lancetPath(g, x, 24, 110, 250); glassFill(g, x, 110, 24, 140, glow); }
}, 128, 1024);
// needle spire face: a full-height indigo glass strip in a pearl frame
const spireTex = () => pair((g, glow) => {
  if (!glow) { marble(g, 64, 512, '#faf3ee'); g.fillStyle = '#d9b25a'; g.fillRect(0, 0, 64, 8); g.fillRect(0, 504, 64, 8); g.fillRect(12, 8, 3, 496); g.fillRect(49, 8, 3, 496); }
  g.beginPath(); g.rect(16, 10, 32, 492); glassFill(g, 16, 10, 32, 492, glow);
  if (!glow) { g.fillStyle = '#d9b25a'; for (let y = 40; y < 500; y += 48) g.fillRect(16, y, 32, 3); g.fillRect(31, 10, 2, 492); }
}, 64, 512);
// drum: two rings of arched indigo windows with a gold ring between
const drumTex = () => pair((g, glow) => {
  if (!glow) { marble(g, 128, 256, '#f8efe9'); g.fillStyle = '#d9b25a'; g.fillRect(0, 124, 128, 8); g.fillRect(0, 248, 128, 8); g.fillRect(0, 0, 128, 5); }
  for (const y of [18, 140]) { lancetPath(g, 34, 60, y, y + 98); glassFill(g, 34, y, 60, 98, glow); if (!glow) { g.strokeStyle = '#d9b25a'; g.lineWidth = 4; g.stroke(); } }
}, 128, 256);
// purple dome with a gold rib on each tile edge and a gold neck ring at the foot
function domeTex() {
  const [c, g] = cv(64, 256);
  const lg = g.createLinearGradient(0, 0, 64, 0); lg.addColorStop(0, '#4a2468'); lg.addColorStop(0.45, '#8a5cb4'); lg.addColorStop(1, '#4a2468');
  g.fillStyle = lg; g.fillRect(0, 0, 64, 256);
  g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(22, 0, 8, 256);
  g.fillStyle = '#e2b44c'; g.fillRect(0, 0, 5, 256); g.fillRect(59, 0, 5, 256); g.fillRect(0, 236, 64, 20);
  return tex(c);
}
// roof garden (64 m tile): square beds framed by 3 m paths with gold star inlays
function gardenTex() {
  const [c, g] = cv(512, 512), P = 24;
  g.fillStyle = '#f3dfd8'; g.fillRect(0, 0, 512, 512);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
    const x = i * 128 + P / 2, y = j * 128 + P / 2, s = 128 - P;
    g.fillStyle = '#2f6a3a'; g.fillRect(x, y, s, s);
    g.fillStyle = (i + j) % 2 ? '#4f9a4f' : '#5aa452'; g.fillRect(x + 7, y + 7, s - 14, s - 14);
    if ((i * 3 + j) % 7 === 2) { g.fillStyle = '#7ad0ff'; g.beginPath(); g.arc(x + s / 2, y + s / 2, 26, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#fbf4ee'; g.lineWidth = 5; g.stroke(); continue; }
    for (let k = 0; k < 26; k++) { g.fillStyle = ['#f6a6c8', '#ffe3ef', '#c88ae0', '#ff8fb8'][k % 4]; g.beginPath(); g.arc(x + 12 + R() * (s - 24), y + 12 + R() * (s - 24), 3 + R() * 4, 0, Math.PI * 2); g.fill(); }
  }
  for (let j = 0; j <= 4; j++) for (let i = 0; i <= 4; i++) star8(g, i * 128, j * 128, 11, '#e2b44c');
  return tex(c);
}
// court floor: rose and ivory pavers, gold eight-point star inlays (sheet 16)
function courtFloorTex() {
  const [c, g] = cv(256, 256);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { g.fillStyle = (i + j) % 2 ? '#f6e6de' : '#f0cfd0'; g.fillRect(i * 64, j * 64, 64, 64); }
  g.strokeStyle = 'rgba(200,160,150,0.6)'; g.lineWidth = 2; for (let k = 0; k <= 256; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 256); g.moveTo(0, k); g.lineTo(256, k); g.stroke(); }
  for (const [x, y] of [[0, 0], [128, 128], [256, 0], [0, 256], [256, 256]]) star8(g, x, y, 22, '#e2b44c');
  return tex(c);
}
// A001 great lancet (35 x 198 m): three lancet lights under a rose window, gold tracery
const lancetTex = () => pair((g, glow) => {
  const W = 128, Hh = 704;
  if (!glow) { g.fillStyle = '#e8c870'; g.fillRect(0, 0, W, Hh); }
  lancetPath(g, 8, 112, 8, Hh); if (!glow) { g.fillStyle = '#fbf4ee'; g.fill(); }
  g.beginPath(); g.arc(64, 160, 46, 0, Math.PI * 2); glassFill(g, 18, 114, 92, 92, glow);
  if (!glow) {
    g.strokeStyle = '#d9b25a'; g.lineWidth = 4; g.stroke();
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.beginPath(); g.moveTo(64, 160); g.lineTo(64 + Math.cos(a) * 46, 160 + Math.sin(a) * 46); g.stroke(); }
    g.beginPath(); g.arc(64, 160, 20, 0, Math.PI * 2); g.stroke(); star8(g, 64, 160, 12, '#f0c860');
  }
  for (const x of [16, 50, 84]) {
    lancetPath(g, x, 28, 230, 690); glassFill(g, x, 230, 28, 460, glow);
    if (!glow) { g.strokeStyle = '#d9b25a'; g.lineWidth = 3; g.stroke(); for (let y = 300; y < 690; y += 70) { g.beginPath(); g.arc(x + 14, y, 7, 0, Math.PI * 2); g.stroke(); } }
  }
}, 128, 704);
// the Rose Gate (75 x 275 m): indigo tympanum with a gold star; behind the leaves, the lit hall
const gateTex = () => pair((g, glow) => {
  const W = 128, Hh = 470;
  const hall = g.createLinearGradient(0, 110, 0, Hh); hall.addColorStop(0, glow ? '#ffd890' : '#ffd890'); hall.addColorStop(1, glow ? '#ffb070' : '#ff9a68');
  g.fillStyle = hall; g.fillRect(0, 110, W, Hh - 110);
  g.fillStyle = glow ? '#c09060' : '#f4d7c0'; for (const x of [18, 50, 78, 110]) g.fillRect(x - 3, 150, 6, Hh - 150);
  for (const x of [34, 64, 94]) { g.fillStyle = glow ? '#fff4c0' : '#fff0c0'; g.beginPath(); g.arc(x, 170, 6, 0, Math.PI * 2); g.fill(); }
  g.beginPath(); g.rect(0, 0, W, 112); glassFill(g, 0, 0, W, 112, glow);
  star8(g, 64, 70, 26, glow ? '#ffe9a0' : '#f0c860');
  if (!glow) { g.fillStyle = '#d9b25a'; g.fillRect(0, 108, W, 6); }
}, 128, 470);
// a gate leaf (37.5 x 210 m): fractured blue, yellow and purple glass with gold leading
const leafTex = () => pair((g, glow) => {
  const W = 64, Hh = 358, cols = ['#3b5bdc', '#6f8cff', '#f5d36a', '#ffe08a', '#8a5cd8', '#b48cff', '#4ac0ff'];
  const pts = []; for (let j = 0; j <= 14; j++) for (let i = 0; i <= 4; i++) pts.push([i * 16 + (i % 4 ? (R() - 0.5) * 12 : 0), j * (Hh / 14) + (j % 14 ? (R() - 0.5) * 18 : 0)]);
  for (let j = 0; j < 14; j++) for (let i = 0; i < 4; i++) {
    const a = pts[j * 5 + i], b = pts[j * 5 + i + 1], c = pts[(j + 1) * 5 + i], d = pts[(j + 1) * 5 + i + 1];
    for (const tri of (R() < 0.5 ? [[a, b, d], [a, d, c]] : [[a, b, c], [b, d, c]])) {
      g.beginPath(); g.moveTo(...tri[0]); g.lineTo(...tri[1]); g.lineTo(...tri[2]); g.closePath();
      const col = cols[Math.floor(R() * cols.length)]; g.fillStyle = glow ? col : col; g.fill();
      if (!glow) { g.strokeStyle = '#d9b25a'; g.lineWidth = 2; g.stroke(); }
    }
  }
  if (!glow) { g.strokeStyle = '#e2b44c'; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, Hh - 6); }
}, 64, 358);
// jali rail: gold-framed quatrefoils with a gold star (alpha cut)
function jaliTex() {
  const [c, g] = cv(128, 64);
  g.clearRect(0, 0, 128, 64);
  g.fillStyle = '#fbf4ee'; g.fillRect(0, 0, 128, 64);
  g.globalCompositeOperation = 'destination-out';
  for (const x of [32, 96]) for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2; g.beginPath(); g.arc(x + Math.cos(a) * 9, 32 + Math.sin(a) * 9, 9, 0, Math.PI * 2); g.fill(); }
  g.globalCompositeOperation = 'source-over';
  for (const x of [32, 96]) { g.strokeStyle = '#d9b25a'; g.lineWidth = 3; g.beginPath(); g.arc(x, 32, 22, 0, Math.PI * 2); g.stroke(); star8(g, x, 32, 7, '#e2b44c'); }
  g.fillStyle = '#d9b25a'; g.fillRect(0, 0, 128, 5); g.fillRect(0, 59, 128, 5);
  return tex(c);
}

// --- geometry helpers ------------------------------------------------------------------
// a pointed-arch panel with UVs spanning its box (0..1)
function archPanel(w, h) {
  const g = new THREE.ShapeGeometry(pointedArchShape(w, h), 12), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, p.getY(i) / h);
  return g;
}
// octagonal shaft, flat face forward, one texture tile per face
const oct = (r, h, y = 0) => scaleUV(new THREE.CylinderGeometry(r, r, h, 8, 1, true).rotateY(Math.PI / 8).translate(0, y + h / 2, 0), 8, 1);
const ring = (r, h, y, seg = 24) => new THREE.CylinderGeometry(r, r, h, seg).translate(0, y + h / 2, 0);
const onion = (r, h, seg = 24, ribs = 8) => scaleUV(cap('onion', r, h, seg), ribs, 1);
const tent = (r, h, seg = 24, ribs = 12) => scaleUV(lathe([[r, 0], [r * 0.82, h * 0.12], [r * 0.5, h * 0.42], [r * 0.22, h * 0.75], [0, h]], seg), ribs, 1);
const needle = (r, h, seg = 8) => scaleUV(lathe([[r, 0], [r * 0.6, h * 0.3], [r * 0.25, h * 0.7], [0, h]], seg), seg, 1);
// a sloped flight of stairs: a wedge from (z0, y0) to (z1, y1), half width hw, centred on x
function flight(x, hw, z0, y0, z1, y1) {
  const len = Math.hypot(z1 - z0, y1 - y0), steps = Math.max(1, Math.round(Math.abs(y1 - y0) / 0.45));
  const g = new THREE.BoxGeometry(hw * 2, 1, len, 1, 1, 1);
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i), uv.getY(i) * steps);
  g.rotateX(-Math.atan2(y1 - y0, z1 - z0)).translate(x, (y0 + y1) / 2 - 0.5, (z0 + z1) / 2);
  return g;
}

// --- the palace ----------------------------------------------------------------------------
export function createPalace(scene, preset, { makePortal } = {}) {
  const group = new THREE.Group(); group.name = 'palace';
  const detail = new THREE.Group(); detail.name = 'palace-detail';
  group.add(detail);
  const kit = new Kit().frame(0, BY, 0);
  const am = artifactMaterials();
  const tile = (t, emissive, opts = {}) => toon('#ffffff', { map: t.map, emissiveMap: t.glow, emissive, emissiveIntensity: 0.5, vertexColors: true, ...opts });
  const steps = (() => { const [c, g] = cv(64, 64); g.fillStyle = '#fbf3ee'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#e8c9c6'; g.fillRect(0, 50, 64, 14); g.fillStyle = '#d9b25a'; g.fillRect(0, 48, 64, 2); return tex(c); })();
  const garden = gardenTex(), dome = domeTex(), jali = jaliTex();
  const mats = {
    ivory: toon('#ffffff', { vertexColors: true, emissive: '#2a1838', emissiveIntensity: 0.3 }),
    podium: tile(podiumTex(), '#ffb070'),
    wing: tile(wingTex(), '#a99bff'),
    tower: tile(towerTex(), '#ffd36a'),
    spire: tile(spireTex(), '#9fa8ff'),
    drum: tile(drumTex(), '#a99bff'),
    lancet: tile(lancetTex(), '#b0a8ff', { side: THREE.DoubleSide }),
    gate: tile(gateTex(), '#ffc890', { side: THREE.DoubleSide }),
    dome: toon('#ffffff', { map: dome, vertexColors: true, emissive: '#2a1040', emissiveIntensity: 0.4 }),
    gold: toon('#ffffff', { vertexColors: true, emissive: '#6a4a10', emissiveIntensity: 0.55 }),
    garden: nightGrade(new THREE.MeshLambertMaterial({ map: garden, vertexColors: true, emissive: '#10202a', emissiveIntensity: 0.4 }), 'roof-garden'),
    steps: toon('#ffffff', { map: steps, vertexColors: true, emissive: '#2a1838', emissiveIntensity: 0.3 }),
    rose: new THREE.MeshBasicMaterial({ map: roseWindowTexture(), toneMapped: false }),
    jali: toon('#ffffff', { map: jali, alphaTest: 0.5, side: THREE.DoubleSide, vertexColors: true, emissive: '#2a1838', emissiveIntensity: 0.3 }),
    water: waterMaterial(0.3),
    fall: waterMaterial(1, true),
    glass: additive('#bfe4ff', { opacity: 0.32, side: THREE.DoubleSide }),
  };
  const water = [], falls = [], sprays = [], glows = [];
  const spirelets = [], cypress = [], blossoms = [], clumps = [], lamps = [], hanging = [];

  // ---- L0 podium and L1 main block, then the roof tiers stepping up to the north ----
  kit.add('podium', wallBox(HW * 2, L0, FZ * 2, 0, 0, 0, 24, 124), ROSE);
  kit.add('wing', wallBox(HW * 2, L1 - L0, FZ * 2, 0, L0, 0, 25, 100), IVORY);
  for (let k = 1; k < ROOF.length; k++) {                // each higher tier: an arcaded storey set back from the one below
    const z1 = ROOF[k][1], y = ROOF[k][2], yPrev = ROOF[k - 1][2];
    kit.add('podium', wallBox(HW * 2 - 8 * k, y - yPrev, z1 + FZ, 0, yPrev, (z1 - FZ) / 2, 24, 124), ROSE);
  }
  ROOF.forEach(([z0, z1, y], k) => {
    const w = HW * 2 - 8 * k - 4, d = z1 - z0;
    const g = new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2).translate(0, y + 0.4, (z0 + z1) / 2);
    kit.add('garden', scaleUV(g, w / 64, d / 64), '#ffffff');
    // rose-garland parapet along each tier's front edge, cypresses about every 15 m
    kit.add('jali', scaleUV(new THREE.PlaneGeometry(w, 8).translate(0, y + 4, z1 - 1), w / 8, 1), IVORY);
    kit.add('gold', box(w, 1, 2, 0, y + 8, z1 - 1), GOLD);
    for (let x = -w / 2 + 8; x < w / 2 - 6; x += 10) clumps.push([x, BY + y + 8.6, z1 - 1, 5.5 + R() * 1.5, R() * 6]);
    for (let x = -w / 2 + 10; x < w / 2 - 6; x += 15) if (Math.abs(x) > 100 || k > 0) cypress.push([x, BY + y + 0.4, z1 - 8, 28 + R() * 8, 0]);
  });

  // ---- buttresses with pinnacles along the main front and the sides ----
  const front = FZ + 0.5;
  for (let x = -HW + 12.5; x <= HW - 12.5; x += 25) {
    const ax = Math.abs(x);
    if (ax < 100 || ax > HW - 60 || Math.abs(ax - 125) < 24 || Math.abs(ax - 220) < 24) continue;
    kit.add('ivory', box(5, L1 - L0 + 10, 8, x, L0, front + 3), IVORY);
    spirelets.push([x, BY + L1 + 10, front + 3, 2.6, 0]);
  }
  for (const s of [-1, 1]) for (let z = -FZ + 40; z < FZ - 40; z += 40) {
    kit.add('ivory', box(8, L1 - L0, 5, s * (HW + 3), L0, z), IVORY);
    spirelets.push([s * (HW + 3), BY + L1, z, 2.4, 0]);
  }
  // podium: buttress piers and a gold string course between the storeys
  kit.add('gold', box(HW * 2 + 2, 2, FZ * 2 + 2, 0, L0 / 2, 0), GOLD);
  kit.add('gold', box(HW * 2 + 4, 3, FZ * 2 + 4, 0, L0 - 1, 0), GOLD);
  kit.add('ivory', box(HW * 2 + 6, 5, FZ * 2 + 6, 0, L1 - 2, 0), IVORY);

  // ---- the four great lancets (A001) ----
  for (const x of [-220, -125, 125, 220]) {
    const w = 35, h = 72 * H, y = L0 + 14;
    kit.add('lancet', archPanel(w, h).translate(x, y, front + 1.2), '#ffffff');
    kit.add('gold', archFrameGeometry(w, h, 2.4, 3).translate(x, y, front + 2), GOLD);
    kit.add('ivory', archFrameGeometry(w + 6, h + 6, 3, 5).translate(x, y - 2, front + 2.5), PEARL);      // carved hood
    kit.add('ivory', box(w + 10, 4, 7, x, y - 4, front + 3), PEARL);                                     // sill
    for (const s of [-1, 1]) {                                                                            // flanking pinnacles
      kit.add('ivory', box(5, h * 0.92, 5, x + s * (w / 2 + 7), y, front + 3), IVORY);
      spirelets.push([x + s * (w / 2 + 7), BY + y + h * 0.92, front + 3, 3, 0]);
    }
    spirelets.push([x, BY + y + h + 9, front + 3, 2.4, 0]);
  }

  // ---- the Rose Gate (A003): pavilion, five archivolt orders, gable with a rose, leaves ----
  const GW = GATE.w, GH = GATE.h, gz = FZ + 14;
  kit.add('wing', wallBox(170, L1 - L0, 14, 0, L0, FZ + 7, 25, 100), PEARL);
  kit.add('podium', wallBox(170, L0, 14, 0, 0, FZ + 7, 24, 124), ROSE);
  kit.add('gate', archPanel(GW, GH).translate(0, SILL, gz + 0.3), '#ffffff');
  for (let k = 0; k < 5; k++) {
    const w = GW + 4 + k * 8, h = GH + 3 + k * 5;
    kit.add(k % 2 ? 'gold' : 'ivory', archFrameGeometry(w, h, 3.6, 3 + k * 0.8).translate(0, SILL - 1, gz + 1 + k * 0.9), k % 2 ? GOLD : (k ? ROSE : PEARL));
  }
  kit.add('gold', lathe([[0, 0], [5, 2], [8, 7], [4, 12], [0, 16]], 10).translate(0, SILL + GH + 22, gz + 6), GOLD);   // lotus keystone
  {
    const gs = new THREE.Shape(); gs.moveTo(-92, 0); gs.lineTo(92, 0); gs.lineTo(0, 190 * H - SILL - GH + 28); gs.lineTo(-92, 0);
    const hole = new THREE.Path(); hole.absarc(0, 70, 30, 0, Math.PI * 2, true); gs.holes.push(hole);
    const top = SILL + GH - 28;
    kit.add('ivory', new THREE.ExtrudeGeometry(gs, { depth: 5, bevelEnabled: false }).translate(0, top, gz - 1), PEARL);
    kit.add('gold', new THREE.TorusGeometry(31, 2.2, 6, 48).translate(0, top + 70, gz + 3.5), GOLD);
    const rose = new THREE.Mesh(new THREE.CircleGeometry(30, 48), mats.rose); rose.position.set(0, BY + top + 70, gz + 0.5); group.add(rose);
    const apex = 190 * H - SILL - GH + 28;
    for (let i = 1; i < 10; i++) for (const s of [-1, 1]) { const t = i / 10; spirelets.push([s * 92 * (1 - t), BY + top + apex * t, gz + 2, 1.2, 0]); }
    spirelets.push([0, BY + top + apex, gz + 2, 3.2, 0]);
    // twin gold pinnacle towers flanking the gate
    for (const s of [-1, 1]) {
      kit.frame(s * 80, BY, gz + 4);
      kit.add('spire', oct(7, 190 * H - L0 + 20, L0), PEARL);
      kit.add('gold', needle(8, 90).translate(0, 190 * H + 20, 0), GOLD);
      kit.add('gold', finialGeo(6).translate(0, 190 * H + 108, 0), GOLD);
      kit.frame(0, BY, 0);
    }
  }
  // the two gate leaves open outward on their hinges
  const lt = leafTex(), leafMat = toon('#ffffff', { map: lt.map, emissiveMap: lt.glow, emissive: '#b0a0ff', emissiveIntensity: 0.6, side: THREE.DoubleSide });
  const hs = GH - GW * 0.866;
  const leaves = [-1, 1].map((s) => {
    const pivot = new THREE.Group(); pivot.position.set(s * GW / 2, BY + SILL, gz + 0.8);
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(GW / 2, hs).translate(-s * GW / 4, hs / 2, 0), leafMat);
    pivot.add(leaf); group.add(pivot);
    return { pivot, s };
  });

  // ---- the gate landing and the cascade stair: a 3-tier water stair between twin flights ----
  kit.add('podium', wallBox(LANDING.hw * 2, L0, LANDING.z1 - FZ, 0, 0, (LANDING.z1 + FZ) / 2, 24, 124), ROSE);
  kit.add('steps', new THREE.PlaneGeometry(LANDING.hw * 2, LANDING.z1 - FZ).rotateX(-Math.PI / 2).translate(0, L0 + 0.05, (LANDING.z1 + FZ) / 2), '#ffffff');
  const tiers = [[CASCADE.z0, 420, L0 * 2 / 3], [420, 478, L0 / 3], [478, CASCADE.z1, 1.2]];
  let yTop = L0;
  for (const [z0, z1, y] of tiers) {
    kit.add('podium', wallBox(80, y, z1 - z0, 0, 0, (z0 + z1) / 2, 24, 124), ROSE);
    water.push(new THREE.PlaneGeometry(76, z1 - z0 - 2).rotateX(-Math.PI / 2).translate(0, BY + y + 0.3, (z0 + z1) / 2));
    falls.push(new THREE.PlaneGeometry(70, yTop - y, 1, 8).translate(0, BY + (yTop + y) / 2, z0 + 0.6));
    for (const x of [-30, -10, 10, 30]) sprays.push([x, BY + y + 0.3, (z0 + z1) / 2, 3]);
    yTop = y;
  }
  addCollider({ minX: -40, maxX: 40, minZ: CASCADE.z0, maxZ: CASCADE.z1, y0: 0, y1: BY + L0 - 2 });
  for (const cx of CASCADE.xs) {
    kit.add('steps', flight(cx, CASCADE.hw, CASCADE.z0, L0, CASCADE.z1, 0), '#ffffff');
    // the wedge beneath the flight
    const wedge = new THREE.Shape([new THREE.Vector2(CASCADE.z0, 0), new THREE.Vector2(CASCADE.z1, 0), new THREE.Vector2(CASCADE.z0, L0)]);
    kit.add('podium', scaleUV(new THREE.ExtrudeGeometry(wedge, { depth: CASCADE.hw * 2, bevelEnabled: false }).rotateY(-Math.PI / 2).translate(cx + CASCADE.hw, 0, 0), 0.04, 0.008), ROSE);
    for (const s of [-1, 1]) {                                     // jali balustrades and lamp posts on both sides
      const x = cx + s * (CASCADE.hw + 0.6), len = Math.hypot(CASCADE.z1 - CASCADE.z0, L0);
      const rail = new THREE.PlaneGeometry(len, 2.2).rotateZ(-Math.atan2(L0, CASCADE.z1 - CASCADE.z0)).rotateY(-Math.PI / 2);
      kit.add('jali', scaleUV(rail, len / 2.2, 1).translate(x, L0 / 2 + 1.3, (CASCADE.z0 + CASCADE.z1) / 2), IVORY);
      for (let t = 0; t <= 1.001; t += 1 / 8) lamps.push([x, BY + L0 * (1 - t) + 0.5, CASCADE.z0 + (CASCADE.z1 - CASCADE.z0) * t, 1, 0]);
    }
  }
  for (const x of [-70, -30, 30, 70]) lamps.push([x, BY + L0, LANDING.z1 - 2, 1.2, 0]);

  // ---- corner pavilion towers (x4) and the gold-domed towers mid-east and mid-west ----
  const towers = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) towers.push([sx * (HW - 28), sz * (FZ - 28)]);
  for (const [x, z] of towers) {
    kit.frame(x, BY, z);
    const top = 140 * H;
    kit.add('ivory', oct(34, 22, 0), ROSE);
    kit.add('tower', oct(30, top - 22, 22), IVORY);
    for (const y of [L0, 90 * H, top]) kit.add('gold', ring(31.5, 3, y, 8).rotateY(Math.PI / 8), GOLD);
    kit.add('ivory', ring(34, 8, top, 8).rotateY(Math.PI / 8), PEARL);                       // gallery
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(27, 28, 32, 16, 1, true).translate(0, top + 24, 0), 8, 1), IVORY);
    kit.add('gold', ring(29, 3, top + 40), GOLD);
    kit.add('dome', onion(30, 95).translate(0, top + 42, 0), '#ffffff');
    kit.add('gold', finialGeo(9).translate(0, top + 134, 0), GOLD);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8, p = kit.world(Math.cos(a) * 33, 0, Math.sin(a) * 33); spirelets.push([p.x, BY + top + 8, p.z, 1.4, 0]); }
    // crystal lanterns on gold bracket arms from each outward face
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      kit.add('gold', box(Math.abs(dx) * 16 + 2, 2, Math.abs(dz) * 16 + 2, dx * 36, 100 * H, dz * 36), GOLD);
      const p = kit.world(dx * 43, 0, dz * 43); hanging.push([p.x, BY + 100 * H, p.z, 5, 0]);
    }
    kit.frame(0, BY, 0);
    addCollider({ x, z, r: 34, y0: 0, y1: BY + top + 140 });
  }
  for (const s of [-1, 1]) {
    const x = s * (HW + 2), z = 0, top = 115 * H;
    kit.frame(x, BY, z);
    kit.add('tower', oct(24, top, 0), IVORY);
    kit.add('gold', ring(25, 3, top, 8).rotateY(Math.PI / 8), GOLD);
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(21, 22, 26, 16, 1, true).translate(0, top + 13, 0), 6, 1), IVORY);
    kit.add('gold', cap('dome', 23, 46, 20).translate(0, top + 26, 0), GOLD);
    kit.add('gold', finialGeo(7).translate(0, top + 72, 0), GOLD);
    kit.frame(0, BY, 0);
    addCollider({ x, z, r: 26, y0: 0, y1: BY + top + 80 });
  }

  // ---- roof crown: great onion dome, needle spires, cone pavilion, drum turrets ----
  const roofAt = (z) => { for (const [z0, z1, y] of ROOF) if (z >= z0 && z <= z1) return y; return ROOF[0][2]; };
  const roofColliders = [];
  {  // the great onion dome, west of centre: drum with two window rings, gold-ribbed purple bulb
    const x = -214, z = -95, y0 = roofAt(z), drumTop = y0 + 125, r = 44;
    kit.frame(x, BY, z);
    kit.add('ivory', ring(r + 6, 10, y0, 24), PEARL);
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(r, r + 2, drumTop - y0 - 10, 24, 1, true).translate(0, (y0 + 10 + drumTop) / 2, 0), 14, 2), IVORY);
    for (const y of [y0 + 10, (y0 + drumTop) / 2 + 5, drumTop]) kit.add('gold', ring(r + 2.5, 3, y - 1.5), GOLD);
    kit.add('dome', onion(r, 190, 32, 12).translate(0, drumTop + 2, 0), '#ffffff');
    kit.add('gold', ring(r * 0.85, 6, drumTop - 2), GOLD);
    kit.add('gold', needle(5, 80, 8).translate(0, drumTop + 188, 0), GOLD);
    kit.add('gold', finialGeo(12).translate(0, drumTop + 258, 0), GOLD);
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2, p = kit.world(Math.cos(a) * (r + 5), 0, Math.sin(a) * (r + 5)); spirelets.push([p.x, BY + y0 + 10, p.z, 2, 0]); }
    kit.frame(0, BY, 0);
    roofColliders.push({ x, z, r: r + 6 });
  }
  // needle spires: slim square shafts with full-height glass strips, open lantern stages, gold needles
  const SPIRES = [[30, -235, 1100, 26], [-120, -250, 960, 22], [175, -245, 840, 21], [95, -195, 700, 15], [-185, -205, 690, 15]];
  for (const [x, z, top, w] of SPIRES) {
    const y0 = roofAt(z), needleH = Math.min(top * 0.13, (top - y0) * 0.3), shaftTop = top - needleH - 3 * w;
    kit.frame(x, BY, z);
    const stages = shaftTop - y0 > 200 ? 4 : 2, sh = (shaftTop - y0) / stages;
    for (let k = 0; k < stages; k++) {
      const ww = w * (1 - k * 0.12), yb = y0 + k * sh;
      const s = scaleUV(new THREE.BoxGeometry(ww, sh - 6, ww).translate(0, yb + (sh - 6) / 2, 0), 1, Math.max(1, Math.round((sh - 6) / 120)));
      kit.add('spire', s, IVORY);
      kit.add('ivory', box(ww + 6, 6, ww + 6, 0, yb + sh - 6, 0), PEARL);           // open lantern balcony
      kit.add('gold', box(ww + 7, 1.2, ww + 7, 0, yb + sh - 0.6, 0), GOLD);
      for (const [cx, cz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const p = kit.world(cx * (ww / 2 + 2), 0, cz * (ww / 2 + 2)); spirelets.push([p.x, BY + yb + sh, p.z, ww / 14, 0]); }
      hanging.push([kit.world(ww / 2 + 3, 0, 0).x, BY + yb + sh - 6, z, 3.5, 0]);
    }
    const lw = w * 0.5;                                               // the open lantern stage and the needle
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(lw, lw, 3 * w, 8, 1, true).translate(0, shaftTop + 1.5 * w, 0), 4, 1), IVORY);
    kit.add('dome', scaleUV(needle(lw * 1.1, needleH, 8), 1, 1).translate(0, shaftTop + 3 * w, 0), '#ffffff');
    kit.add('gold', finialGeo(w * 0.35).translate(0, top - 2, 0), GOLD);
    kit.frame(0, BY, 0);
    roofColliders.push({ x, z, r: w * 0.75 });
  }
  {  // the cone pavilion on the north axis: arcaded drum, gold-ribbed purple tent cone, 700 m
    const x = 0, z = -285, y0 = roofAt(z), r = 50;
    kit.frame(x, BY, z);
    kit.add('podium', scaleUV(new THREE.CylinderGeometry(r, r + 2, 40, 24, 1, true).translate(0, y0 + 20, 0), 12, 0.33), PEARL);
    kit.add('gold', ring(r + 3, 3, y0 + 40), GOLD);
    kit.add('dome', tent(r + 4, 700 - y0 - 40 - 30, 32, 16).translate(0, y0 + 42, 0), '#ffffff');
    kit.add('gold', finialGeo(10).translate(0, 700 - 32, 0), GOLD);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, p = kit.world(Math.cos(a) * (r + 6), 0, Math.sin(a) * (r + 6)); spirelets.push([p.x, BY + y0, p.z, 2.2, 0]); }
    kit.frame(0, BY, 0);
    roofColliders.push({ x, z, r: r + 4 });
  }
  // drum turrets along the roofline, with small onion domes or slim cones
  const TURRETS = [[-300, 322, 14], [-160, 322, 10], [160, 322, 10], [300, 322, 14], [-330, 165, 12], [330, 165, 12], [-80, 165, 9], [80, 165, 9],
    [-330, 5, 15], [330, 5, 15], [-60, 5, 10], [60, 5, 10], [-330, -175, 13], [330, -175, 13]];
  TURRETS.forEach(([x, z, r], i) => {
    const y0 = roofAt(z + 1), h = r * 4.5;
    kit.frame(x, BY, z);
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(r, r, h, 12, 1, true).translate(0, y0 + h / 2, 0), 4, 1), IVORY);
    kit.add('gold', ring(r + 1, 1.5, y0 + h - 1.5, 12), GOLD);
    if (i % 3 === 1) kit.add('dome', needle(r * 1.15, r * 4, 12).translate(0, y0 + h, 0), '#ffffff');
    else kit.add('dome', onion(r * 1.05, r * 2.6, 16).translate(0, y0 + h, 0), '#ffffff');
    kit.add('gold', finialGeo(r * 0.3).translate(0, y0 + h + (i % 3 === 1 ? r * 4 : r * 2.6) - 1, 0), GOLD);
    kit.frame(0, BY, 0);
    roofColliders.push({ x, z, r: r + 1 });
  });
  for (const c of roofColliders) addCollider({ ...c, y0: BY + 300, y1: BY + 2000 });

  // ---- roof gardens: water channels, wheel parterres, conservatories, fountains, trees ----
  const fountains = [];
  for (const [z0, z1] of [[190, 330], [30, 170]]) {
    const y = roofAt(z0 + 1);
    kit.add('ivory', box(16, 1.2, z1 - z0, -20, y, (z0 + z1) / 2), PEARL);
    water.push(new THREE.PlaneGeometry(13, z1 - z0 - 3).rotateX(-Math.PI / 2).translate(-20, BY + y + 1.0, (z0 + z1) / 2));
    for (let z = z0 + 18; z < z1; z += 35) sprays.push([-20, BY + y + 1, z, 2.5]);
  }
  for (const [x, z] of [[120, -230], [120, 90], [-110, 250], [200, 250]]) fountains.push([x, roofAt(z), z, 0.9]);
  {  // two eight-spoke wheel parterres in the east half
    const [c, g] = cv(256, 256);
    g.fillStyle = '#f3dfd8'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#d9b25a'; g.beginPath(); g.arc(128, 128, 124, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#4f9a4f'; g.beginPath(); g.arc(128, 128, 116, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; g.strokeStyle = '#f3dfd8'; g.lineWidth = 12; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + Math.cos(a) * 116, 128 + Math.sin(a) * 116); g.stroke(); }
    for (let i = 0; i < 160; i++) { const a = R() * 6.28, d = 30 + R() * 80; g.fillStyle = ['#f6a6c8', '#ff7fb0', '#ffe3ef'][i % 3]; g.beginPath(); g.arc(128 + Math.cos(a) * d, 128 + Math.sin(a) * d, 4, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#fbf4ee'; g.beginPath(); g.arc(128, 128, 30, 0, Math.PI * 2); g.fill();
    const wheel = new THREE.MeshLambertMaterial({ map: tex(c, false), transparent: true, alphaTest: 0.1 });
    for (const z of [-197, 77]) {
      const m = new THREE.Mesh(new THREE.CircleGeometry(34, 48).rotateX(-Math.PI / 2), wheel);
      m.position.set(120, BY + roofAt(z) + 0.6, z); group.add(m);
      fountains.push([120, roofAt(z), z, 0.55]);
    }
  }
  // two glass conservatories in the north-east: barrel vaults with a cross gable, gold ribs, orange trees inside
  const oranges = [];
  for (const zc of [-105, 35]) {
    const x = 285, y = roofAt(zc), L = 110, r = 28;
    const vault = new THREE.CylinderGeometry(r, r, L, 20, 1, true, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).translate(x, BY + y + 8, zc);
    const cross = new THREE.CylinderGeometry(r * 0.8, r * 0.8, r * 2.6, 16, 1, true, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2).translate(x, BY + y + 8, zc);
    detail.add(new THREE.Mesh(merge([vault, cross]), mats.glass));
    kit.add('ivory', box(r * 2 + 2, 8, L + 2, x, y, zc), PEARL);
    for (let k = 0; k <= 10; k++) kit.add('gold', new THREE.TorusGeometry(r, 0.7, 4, 20, Math.PI).rotateY(Math.PI / 2).translate(x, y + 8, zc - L / 2 + (k * L) / 10), GOLD);
    kit.add('gold', box(1.4, 1.4, L, x, y + 8 + r - 0.7, zc), GOLD);
    for (let k = 0; k < 14; k++) oranges.push([x + ((k % 2) - 0.5) * 22, BY + y + 8, zc - L / 2 + 8 + (k >> 1) * 14, 2.4, k]);
    addCollider({ minX: x - r, maxX: x + r, minZ: zc - L / 2, maxZ: zc + L / 2, y0: BY + 300, y1: BY + 2000 });
  }
  // pink blossom trees in carved planters on every terrace; cypress rows at the tier fronts already placed
  const rr = rng(77);
  for (let i = 0; i < 70; i++) {
    const x = (rr() - 0.5) * (HW * 2 - 60), z = (rr() - 0.5) * (FZ * 2 - 40), y = roofAt(z);
    if (Math.hypot(x + 214, z + 95) < 70 || Math.abs(x + 20) < 14 || (x > 240 && z < 100 && z > -170) || (Math.abs(x) < 70 && z > -110 && z < -10)) continue;
    if (SPIRES.some(([sx, sz, , w]) => Math.hypot(x - sx, z - sz) < w + 12) || Math.hypot(x, z + 285) < 64) continue;
    kit.add('ivory', box(9, 3, 9, x, y, z), PEARL);
    blossoms.push([x, BY + y + 3, z, 0.9 + rr() * 0.35, rr() * 6]);
  }

  // ---- the rear: waterfalls spilling off the north and east terrace edges into pools ----
  for (const [x, w] of [[-150, 26], [60, 34], [220, 24]]) {
    const top = ROOF[3][2];
    falls.push(new THREE.PlaneGeometry(w, top, 1, 24).rotateY(Math.PI).translate(x, BY + top / 2, -FZ - 1.2));
    water.push(new THREE.CircleGeometry(w * 1.1, 24).rotateX(-Math.PI / 2).translate(x, BY + 0.6, -FZ - w * 1.1));
    kit.add('ivory', new THREE.TorusGeometry(w * 1.1, 1.2, 4, 24).rotateX(Math.PI / 2).translate(x, 0.6, -FZ - w * 1.1), PEARL);
  }
  for (const z of [-250, 100]) {
    const top = roofAt(z);
    falls.push(new THREE.PlaneGeometry(24, top, 1, 24).rotateY(Math.PI / 2).translate(HW + 1.2, BY + top / 2, z));
    water.push(new THREE.CircleGeometry(26, 24).rotateX(-Math.PI / 2).translate(HW + 27, BY + 0.6, z));
  }

  // ---- G02 roof court (sheet 16) on the 509 m tier at the foot of the spires: human scale ----
  const court = buildRoofCourt(detail, mats, am, { lamps, hanging, cypress, blossoms, clumps, fountains, sprays, oranges });

  // ---- lotus fountains (A035) ----
  const fstone = [], fgold = [], fwater = [], fbud = [];
  for (const [x, y, z, s] of fountains) {
    const f = lotusFountainGeo(9 * s);
    fstone.push(f.stone.translate(x, BY + y, z)); fgold.push(f.gold.translate(x, BY + y, z)); fwater.push(f.water.translate(x, BY + y, z)); fbud.push(f.bud.translate(x, BY + y, z));
    for (const [sx, sy, sz, sr] of f.sprays) sprays.push([x + sx, BY + y + sy, z + sz, sr]);
  }
  if (fstone.length) {
    detail.add(new THREE.Mesh(merge(fstone), am.lit), new THREE.Mesh(merge(fgold), mats.gold), new THREE.Mesh(merge(fwater), mats.water), new THREE.Mesh(merge(fbud), am.crystal));
  }
  // the cascade's lotus basin at the stair foot
  {
    const f = lotusFountainGeo(PLAZA.r);
    const add = (g, m) => { const mesh = new THREE.Mesh(g.translate(PLAZA.x, PLAZA.y, PLAZA.z), m); group.add(mesh); };
    add(f.stone, am.lit); add(f.gold, mats.gold); add(f.water, mats.water); add(f.bud, am.crystal);
    for (const [sx, sy, sz, sr] of f.sprays) sprays.push([PLAZA.x + sx, PLAZA.y + sy, PLAZA.z + sz, sr]);
    addCollider({ x: PLAZA.x, z: PLAZA.z, r: PLAZA.r * 0.95 });
  }

  // ---- build the meshes ----
  kit.build(mats, group, 'palace');
  if (water.length) group.add(new THREE.Mesh(merge(water), mats.water));
  if (falls.length) group.add(new THREE.Mesh(merge(falls), mats.fall));
  const spr = spireletGeo(), lamp = postLampGeo(), hang = hangingLanternGeo();
  detail.add(
    instances(spr, am.lit, spirelets, 'spirelets'),
    instances(cypressGeo(), am.leaf, cypress.map(([x, y, z, h, a]) => [x, y, z, h, a])),
    instances(blossomGeo(), am.leaf, blossoms, 'blossomGeoblossoms'),
    instances(roseClumpGeo(), am.leaf, clumps, 'roseClumpGeoclumps'),
    instances(orangeTreeGeo(), am.leaf, oranges, 'orangeTreeGeooranges'),
    instances(lamp.body, am.lit, lamps, 'lamp.bodylamps'), instances(lamp.glass, am.crystal, lamps, 'lamp.glasslamps'),
    instances(hang.body, am.lit, hanging, 'hang.bodyhanging'), instances(hang.glass, am.crystal, hanging, 'hang.glasshanging'),
  );
  for (const [x, y, z, s] of lamps) glows.push([x, y + 5.3 * s, z, 2.2 * s]);
  for (const [x, y, z, s] of hanging) glows.push([x, y - 1.15 * s, z, 2.4 * s]);
  // spray plumes over every fountain jet
  const sprayGeo = merge(sprays.map(([x, y, z, r]) => new THREE.ConeGeometry(r * 0.5, r * 1.6, 6, 1, true).translate(x, y + r * 0.8, z)));
  const sprayMesh = new THREE.Mesh(sprayGeo, additive('#cfeaff', { opacity: 0.28, side: THREE.DoubleSide }));
  detail.add(sprayMesh);
  const halos = haloPoints(glows, [1, 0.85, 0.7]);
  detail.add(halos);
  group.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = o.material !== mats.glass; } });

  // the palace body: solid up to the main roof, so the gardens up top stay walkable
  addCollider({ minX: -HW, maxX: HW, minZ: -FZ, maxZ: FZ, y0: 0, y1: BY + L1 - 30 });
  addCollider({ minX: -85, maxX: 85, minZ: FZ, maxZ: gz, y0: 0, y1: BY + L1 - 30 });
  scene.add(group);

  // portals: up to the roof court and back down to the upper terrace
  const portals = [];
  if (makePortal) {
    const up = { x: -230, z: 520, y: BY }, down = { x: 0, z: court.returnZ, y: court.y };
    const a = makePortal(up.x, up.y, up.z, Math.PI, '#ff9bd6', '✦ Palace Roof Garden');
    const b = makePortal(down.x, down.y, down.z, 0, '#ffd47a', '✦ Down to the Terraces');
    group.add(a.group, b.group);
    portals.push(
      { ...up, kind: 'to', disk: a.disk, land: { x: 0, y: court.y, z: court.returnZ - 10, name: 'Palace Roof Garden', facing: Math.PI } },
      { ...down, kind: 'back', disk: b.disk, land: { x: up.x, y: BY, z: up.z + 12, name: 'Upper Terrace', facing: Math.PI } },
    );
  }

  let gateOpen = 1, gateTarget = 1;
  return {
    group, portals,
    gatePosition: new THREE.Vector3(0, BY + SILL, gz),
    rosePosition: new THREE.Vector3(0, BY + SILL + GH * 0.6, gz),
    setGate(open, instant = false) { gateTarget = open ? 1 : 0; if (instant) gateOpen = gateTarget; },
    update(t, dt, camera) {
      gateOpen += (gateTarget - gateOpen) * Math.min(1, (dt || 0.016) * 0.6);
      for (const { pivot, s } of leaves) pivot.rotation.y = s * gateOpen * 1.45;
      mats.water.uniforms.uTime.value = t; mats.fall.uniforms.uTime.value = t;
      halos.material.uniforms.uTime.value = t;
      const n = MOOD.night.value;
      for (const k of ['podium', 'wing', 'tower', 'spire', 'drum', 'lancet', 'gate']) mats[k].emissiveIntensity = 0.3 + 0.75 * n;
      leafMat.emissiveIntensity = 0.45 + 0.6 * n;
      mats.rose.color.setScalar(0.65 + 0.45 * n);
      sprayMesh.material.opacity = 0.22 + 0.06 * Math.sin(t * 3);
      for (const p of portals) p.disk.material.uniforms.uTime.value = t;
      if (camera) detail.visible = Math.hypot(camera.position.x, camera.position.z) < 1600 + camera.position.y * 0.3;
      court.update(t);
    },
  };
}

// --- G02 the palace roof court ---------------------------------------------------------------
// About 120 x 90 m on the 509 m tier: West Rose Terrace, North Fountain Loggia,
// East Conservatory Garden, with 3 m walks of rose and ivory paving and gold star inlays.
function buildRoofCourt(group, mats, am, out) {
  const tierY = ROOF[2][2], Y = BY + tierY, cz = -60, HX = 60, HZ = 45;
  const kit = new Kit().frame(0, Y, cz);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(HX * 2, HZ * 2).rotateX(-Math.PI / 2), toon('#ffffff', { map: (() => { const t = courtFloorTex(); t.repeat.set(HX / 8, HZ / 8); return t; })(), emissive: '#2a1838', emissiveIntensity: 0.3 }));
  floor.position.set(0, Y + 0.5, cz); group.add(floor);
  addPad({ x: 0, z: cz, hw: HX, hd: HZ, y: Y + 0.5, y0: BY + 300 });
  // lotus balustrade round the court, open on the south side
  for (const [x, z, w, d] of [[0, -HZ, HX * 2, 0.6], [-HX, 0, 0.6, HZ * 2], [HX, 0, 0.6, HZ * 2]]) {
    kit.add('ivory', box(w, 1.1, d, x, 0.5, z), PEARL);
    kit.add('gold', box(w + 0.2, 0.12, d + 0.2, x, 1.6, z), GOLD);
  }
  for (let x = -HX + 3; x <= HX - 3; x += 3) out.clumps.push([x, Y + 1.9, cz - HZ, 0.9, x]);
  // kiosks with purple domes at the four corners
  for (const [x, z] of [[-HX + 4, -HZ + 4], [HX - 4, -HZ + 4], [-HX + 4, HZ - 4], [HX - 4, HZ - 4]]) {
    kit.add('ivory', oct(2.8, 4.5, 0.5).translate(x, 0, z), IVORY);
    kit.add('gold', ring(3.1, 0.3, 5, 8).translate(x, 0, z), GOLD);
    kit.add('dome', onion(3, 4.2, 12, 8).translate(x, 5.3, z), '#ffffff');
    kit.add('gold', finialGeo(0.6).translate(x, 9.4, z), GOLD);
    addCollider({ x, z: z + cz, r: 3, y0: BY + 300, y1: BY + 2000 });
  }
  // cypresses round the edges
  for (let x = -HX + 10; x <= HX - 10; x += 10) out.cypress.push([x, Y + 0.5, cz - HZ + 2.5, 9 + (x % 3), 0]);
  for (let z = -HZ + 12; z <= HZ - 8; z += 10) for (const s of [-1, 1]) out.cypress.push([s * (HX - 2.5), Y + 0.5, cz + z, 9, 0]);

  // West Rose Terrace: 18 m three-tier lotus fountain in an eight-lobed basin, round rose beds, blossom trees
  out.fountains.push([-35, tierY + 0.5, cz + 2, 1]);
  addCollider({ x: -35, z: cz + 2, r: 9.5, y0: BY + 300, y1: BY + 2000 });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, x = -35 + Math.cos(a) * 16, z = 2 + Math.sin(a) * 16;
    if (x > -20) continue;
    kit.add('ivory', cyl(2.6, 2.7, 0.6, 16, x, 0.5, z), PEARL);
    for (let k = 0; k < 5; k++) out.clumps.push([x + Math.cos(k * 1.3) * 1.4, Y + 1.2, cz + z + Math.sin(k * 1.3) * 1.4, 1.1, k]);
  }
  for (const [x, z] of [[-52, -30], [-52, 30], [-20, -30], [-20, 30]]) {
    kit.add('ivory', box(4, 1.4, 4, x, 0.5, z), PEARL);
    kit.add('gold', box(4.2, 0.2, 4.2, x, 1.9, z), GOLD);
    out.blossoms.push([x, Y + 1.9, cz + z, 0.5, x]);
  }
  // North Fountain Loggia: five pointed arches on lotus-capital columns, a wall fountain inside, roses draped over
  const lz = -HZ + 6, lw = 12;
  kit.add('ivory', box(lw * 5 + 4, 9, 1, 0, 0.5, lz - 5), PEARL);                           // back wall
  kit.add('ivory', box(lw * 5 + 4, 0.8, 7, 0, 9.5, lz - 2), PEARL);                         // roof slab
  for (let i = 0; i <= 5; i++) {
    const x = -lw * 2.5 + i * lw;
    kit.add('ivory', cyl(0.45, 0.5, 6, 10, x, 0.5, lz + 1), PEARL);
    kit.add('gold', lathe([[0.45, 0], [0.9, 0.5], [1.1, 1.0], [0.8, 1.3]], 10).translate(x, 6.5, lz + 1), GOLD);   // lotus capital
    addCollider({ x, z: cz + lz + 1, r: 0.7, y0: BY + 300, y1: BY + 2000 });
  }
  for (let i = 0; i < 5; i++) {
    const x = -lw * 2 + i * lw;
    kit.add('ivory', archFrameGeometry(lw - 1.6, 3.4, 0.6, 1).translate(x, 6.8, lz + 1), PEARL);
    kit.add('gold', archFrameGeometry(lw - 1.2, 3.6, 0.15, 1.1).translate(x, 6.8, lz + 1.2), GOLD);
    out.hanging.push([x, Y + 9.6, cz + lz + 1, 1, 0]);
    for (let k = 0; k < 4; k++) out.clumps.push([x - 4 + k * 2.6, Y + 10.2, cz + lz + 2.6, 1.2, k]);
  }
  out.fountains.push([0, tierY + 0.5, cz + lz - 2.5, 0.22]);
  // East Conservatory Garden: a 30 x 12 m mirror pool with lotuses beside a long glass barrel vault
  kit.add('ivory', box(13, 0.5, 31, 25, 0.5, 0), PEARL);
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(12, 30).rotateX(-Math.PI / 2), mats.water);
  pool.position.set(25, Y + 0.85, cz); group.add(pool);
  for (let i = 0; i < 12; i++) { const pad = new THREE.Mesh(new THREE.CircleGeometry(0.7, 10).rotateX(-Math.PI / 2), toon(i % 3 ? '#4f9a4f' : '#ff9cc4')); pad.position.set(25 + (Math.sin(i * 7.1) * 4.5), Y + 0.9, cz + (i - 6) * 2.3); group.add(pad); }
  addCollider({ minX: 18.5, maxX: 31.5, minZ: cz - 15.5, maxZ: cz + 15.5, y0: BY + 300, y1: BY + 2000 });
  {
    const x = 47, L = 52, r = 7;
    const vault = new THREE.CylinderGeometry(r, r, L, 16, 1, true, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).translate(x, Y + 2.5, cz);
    group.add(new THREE.Mesh(vault, mats.glass));
    kit.add('ivory', box(r * 2, 2, L, x, 0.5, 0), PEARL);
    for (let k = 0; k <= 13; k++) kit.add('gold', new THREE.TorusGeometry(r, 0.12, 4, 16, Math.PI).rotateY(Math.PI / 2).translate(x, 2.5, -L / 2 + (k * L) / 13), GOLD);
    for (let k = 0; k <= 13; k += 13) kit.add('gold', new THREE.SphereGeometry(0.5, 8, 6).translate(x, 2.5 + r, -L / 2 + (k * L) / 13), GOLD);   // rosette bosses
    for (let k = 0; k < 8; k++) out.oranges?.push([x, Y + 2.5, cz - L / 2 + 4 + k * 6.4, 1, k]);
    addCollider({ minX: x - r, maxX: x + r, minZ: cz - L / 2, maxZ: cz + L / 2, y0: BY + 300, y1: BY + 2000 });
  }
  // curved marble benches and crystal lamps along the walks
  const benches = [];
  for (const [x, z, a] of [[-35, -12, 0], [-35, 16, Math.PI], [-48, 2, Math.PI / 2], [10, -20, -Math.PI / 2], [10, 20, -Math.PI / 2]]) benches.push([x, Y + 0.5, cz + z, 1, a]);
  group.add(instances(benchGeo(), am.lit, benches, 'benchGeobenches'));
  for (const [x, z] of [[-8, 40], [8, 40], [-8, 10], [8, 10], [-8, -20], [8, -20]]) out.lamps.push([x, Y + 0.5, cz + z, 0.6, 0]);
  kit.build(mats, group, 'court');
  return { y: Y + 0.5, returnZ: cz + HZ - 8, update() {} };
}
