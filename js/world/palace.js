// B01 the Princess Palace, measured off owner sheet 03 (south elevation and roof plan,
// with crops 01-10 of build sheet B01) and built in drawn metres, then scaled by the
// world scale S = 2.75 so the spires reach their labelled 840 to 1100 m and the plan
// spans about 2.3 x 1.9 km. Four stepped garden tiers: the arcaded rose podium cut by
// the cascade court, the great-lancet storey with the Rose Gate, the dome terrace and
// the crown garden. Domed corner pavilions, the great purple onion dome west of the
// gate, the needle-spire cluster behind it and the tall glass spires to the east,
// conservatories, wheel parterres and water channels on the roofs, and the human-scale
// G02 roof court on the crown garden.
//
// Laptop plan: the massing is one merged mesh per material; the instanced detail
// (spirelets, trees, lanterns, garlands) shows within about 5 km.
import * as THREE from 'three';
import { toon, glowBasic, additive, nightGrade } from './materials.js';
import { glowTexture, rng } from './textures.js';
import { Kit, box, cyl, lathe, cap, scaleUV, wallBox, waterMaterial, haloPoints, roseWindowTexture } from './kit.js';
import { pointedArchShape, archFrameGeometry } from './arch.js';
import { S, PAL, PALACE_TIERS, GATE, CASTLE, CASCADE, PLAZA, PORTALS, addCollider, addPad } from './layout.js';
import {
  IVORY, PEARL, ROSE, GOLD, paint, merge, finialGeo, spireletGeo, cypressGeo, blossomGeo, orangeTreeGeo, roseClumpGeo,
  postLampGeo, hangingLanternGeo, lotusFountainGeo, benchGeo, artifactMaterials, instances, tiledInstances,
} from './artifacts.js';
import { MOOD } from './sky.js';

const BY = PAL.y;

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
// a sloped flight of stairs: a wedge top from (z0, y0) to (z1, y1), half width hw, centred on x;
// `rise` is one step's height in these units
function flight(x, hw, z0, y0, z1, y1, rise = 0.45) {
  const len = Math.hypot(z1 - z0, y1 - y0), steps = Math.max(1, Math.round(Math.abs(y1 - y0) / rise));
  const g = new THREE.BoxGeometry(hw * 2, 1, len, 1, 1, 1);
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i), uv.getY(i) * steps);
  g.rotateX(-Math.atan2(y1 - y0, z1 - z0)).translate(x, (y0 + y1) / 2 - 0.5, (z0 + z1) / 2);
  return g;
}
// world metres from the palace's drawn metres
const wx = (x) => x * S, wz = (z) => z * S, wy = (y) => BY + y * S;

// --- the palace ----------------------------------------------------------------------------
// Everything below is in drawn metres off sheet 03 (gate axis x = 0, podium front z = 340),
// built into `body`, which is scaled by S. Human-scale things (stair lamps, the roof court)
// go straight into `group` in world metres.
export function createPalace(scene, preset, { makePortal } = {}) {
  const group = new THREE.Group(); group.name = 'palace';
  const body = new THREE.Group(); body.name = 'palace-body'; body.position.set(0, BY, 0); body.scale.setScalar(S);
  const detail = new THREE.Group(); detail.name = 'palace-detail';
  body.add(detail); group.add(body);
  const kit = new Kit();
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
    paving: toon('#ffffff', { map: courtFloorTex(), vertexColors: true, emissive: '#2a1838', emissiveIntensity: 0.3 }),
    steps: toon('#ffffff', { map: steps, vertexColors: true, emissive: '#2a1838', emissiveIntensity: 0.3 }),
    rose: new THREE.MeshBasicMaterial({ map: roseWindowTexture(), toneMapped: false }),
    jali: toon('#ffffff', { map: jali, alphaTest: 0.5, side: THREE.DoubleSide, vertexColors: true, emissive: '#2a1838', emissiveIntensity: 0.3 }),
    water: waterMaterial(0.3),
    fall: waterMaterial(1, true),
    glass: additive('#bfe4ff', { opacity: 0.32, side: THREE.DoubleSide }),
  };
  // drawn-metre lists (inside the scaled body)
  const water = [], falls = [], sprays = [], fountains = [];
  const spirelets = [], cypress = [], blossoms = [], clumps = [], hanging = [], oranges = [];
  const solids = [];                                                  // colliders in drawn metres
  const taken = [];                                                   // [x, z, r] kept clear of trees and turrets
  const clear = (x, z, r) => taken.every(([tx, tz, tr]) => Math.hypot(x - tx, z - tz) > tr + r);
  const roofAt = (x, z) => { let h = 0; for (const [x0, x1, z0, z1, t] of PALACE_TIERS) if (x >= x0 && x <= x1 && z >= z0 && z <= z1 && t > h) h = t; return h; };
  // world-metre lists (human scale)
  const lamps = [];
  const GW = GATE.w / S, GH = GATE.h / S, SILL = GATE.sill / S, GZ = GATE.z / S, FRONT = 191;
  const CZ0 = CASCADE.z0 / S, CZ1 = CASCADE.z1 / S, CW = CASCADE.water / S, CHW = CASCADE.hw / S;

  // ---- landmarks first, so the garden planting keeps clear of them ----
  const CORNERS = [[-356, 92], [420, 183], [-356, -305], [420, -305]];          // purple-domed corner pavilions
  // the front boundary (z 335): towers linked by low arcades, round a forecourt garden on either side of the cascade
  // Two stepped layers rising toward the gate, towers of uneven height and spacing: [x, z, purple onion?, height, radius]
  const BOUNDARY = [[-372, 330, 1, 42, 13], [-318, 338, 0, 35, 10], [-262, 326, 1, 50, 14], [-190, 334, 0, 44, 12], [-148, 322, 1, 62, 15], [-122, 338, 0, 53, 12],
    [124, 336, 0, 55, 12], [152, 320, 1, 67, 16], [214, 333, 0, 46, 12], [262, 340, 1, 40, 11], [318, 327, 1, 54, 14], [384, 336, 0, 37, 11], [436, 324, 1, 47, 13]];
  const INNER = [[-330, 282, 1, 69, 14], [-236, 276, 0, 60, 12], [-160, 268, 1, 79, 15], [170, 266, 1, 82, 16], [246, 280, 0, 62, 12], [352, 274, 1, 73, 14], [420, 286, 0, 57, 12]];
  const BZ = 335;
  const FRONT_TOWERS = [[235, 207, 22, 170, 30], [-272, 207, 16, 150, 20]];     // [x, z, r, dome base, dome height]
  const GREAT_DOME = { x: -190, z: -100, r: 40 };
  // needle spires [x, z, top, width]: the cluster behind the gate, the slim western spires, the tall glass spires east
  const SPIRES = [[-20, 150, 394, 26], [-50, 162, 345, 16], [12, 162, 347, 16], [-80, 170, 316, 12],
    [155, 60, 258, 8], [-303, 40, 290, 12], [-253, 20, 260, 8],
    [206, -120, 316, 16], [228, -60, 278, 12], [281, -200, 287, 18], [322, -215, 333, 22], [351, -190, 353, 26], [380, -210, 295, 18]];
  const DOME_TOWERS = [[35, 60, 16, 258, 23], [113, 0, 17, 252, 20]];           // [x, z, r, dome base, dome height]
  const CONE = { x: 0, z: -280, r: 22, top: 255 };
  const COURT = { x: -70, z: -150, r: 30 };                                      // the human-scale roof court on the crown garden
  const CONSERVATORIES = [[290, -100, 90], [290, 40, 90]];
  const WHEELS = [[176, -160], [176, 75]];
  for (const [x, z] of CORNERS) taken.push([x, z, 36]);
  for (const [x, z, , , r] of [...BOUNDARY, ...INNER]) taken.push([x, z, r + 5]);
  for (const [x, z, r] of FRONT_TOWERS) taken.push([x, z, r + 3]);
  taken.push([GREAT_DOME.x, GREAT_DOME.z, GREAT_DOME.r + 18], [CONE.x, CONE.z, CONE.r + 4], [COURT.x, COURT.z, COURT.r]);
  for (const [x, z, , w] of SPIRES) taken.push([x, z, w * 0.75 + 3]);
  for (const [x, z, r] of DOME_TOWERS) taken.push([x, z, r + 3]);
  for (const [x, z, L] of CONSERVATORIES) taken.push([x, z - L / 4, 26], [x, z + L / 4, 26]);
  for (const [x, z] of WHEELS) taken.push([x, z, 32]);
  taken.push([0, 120, 32], [-198, 62, 26], [-295, -184, 26]);
  taken.push([-290, 306, 9], [-200, 306, 9], [205, 306, 9], [290, 306, 9]);                 // forecourt fountains                  // channel pool, west pool, glass pavilion

  // ---- the four stepped garden tiers ----
  const LOOK = [['podium', PEARL, 24, 52], ['wing', IVORY, 25, 76], ['podium', IVORY, 24, 69], ['wing', PEARL, 25, 33]];
  const BASE = [-4, 50, 126, 195];
  PALACE_TIERS.forEach(([x0, x1, z0, z1, t], k) => {
    const [key, tint, tw, th] = LOOK[k], w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    kit.add(key, wallBox(w, t - BASE[k], d, cx, BASE[k], cz, tw, th), tint);
    kit.add('garden', scaleUV(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2).translate(cx, t + 0.15, cz), w / 64, d / 64), '#ffffff');
    kit.add('ivory', box(w + 2, 2.2, d + 2, cx, t - 2.2, cz), PEARL);                                  // cornice
    kit.add('gold', box(w + 2.4, 0.5, d + 2.4, cx, t - 2.9, cz), GOLD);
    // jali parapet with a gold rail and rose garlands; none where a tier meets the one beside it
    for (const [px, pz, len, ry, side] of [[cx, z1 - 0.6, w, 0, 'front'], [cx, z0 + 0.6, w, 0, 'back'], [x0 + 0.6, cz, d, Math.PI / 2, 'side'], [x1 - 0.6, cz, d, Math.PI / 2, 'side']]) {
      if (k === 0 && side === 'front') {                                     // open where the cascade arrives
        for (const sd of [-1, 1]) { const l = (sd > 0 ? x1 : -x0) - CHW, c = sd * (CHW + l / 2); kit.add('jali', scaleUV(new THREE.PlaneGeometry(l, 3).translate(c, t + 1.5, pz), l / 3, 1), IVORY); kit.add('gold', box(l, 0.6, 0.8, c, t + 3, pz), GOLD); }
        continue;
      }
      kit.add('jali', scaleUV(new THREE.PlaneGeometry(len, 3).rotateY(ry).translate(px, t + 1.5, pz), len / 3, 1), IVORY);
      kit.add('gold', box(ry ? 0.8 : len, 0.6, ry ? len : 0.8, px, t + 3, pz), GOLD);
      if (side === 'back') continue;
      for (let u = -len / 2 + 7; u < len / 2; u += 14) clumps.push([ry ? px : px + u, t + 3.3, ry ? pz + u : pz, 5 + R() * 2, R() * 6]);   // rose garlands on the parapet
    }
    // along every terrace front, as drawn: tall cypresses with pink blossom trees between them, set in carved planters
    for (let x = x0 + 8, i = 0; x < x1 - 6; x += 10, i++) {
      const z = z1 - 7;
      if ((k === 0 && Math.abs(x) < CHW + 6) || roofAt(x, z) !== t || !clear(x, z, 4)) continue;
      if (i % 3 === 1) { kit.add('ivory', box(7, 2, 7, x, t, z), PEARL); blossoms.push([x, t + 2, z, 1 + R() * 0.3, R() * 6]); }
      else cypress.push([x, t, z, 26 + R() * 12, 0]);
    }
    for (const sx of [x0 + 7, x1 - 7]) for (let z = z0 + 14, i = 0; z < z1 - 10; z += 14, i++) {
      if (roofAt(sx, z) !== t || !clear(sx, z, 4)) continue;
      if (i % 3 === 1) blossoms.push([sx, t, z, 0.9 + R() * 0.3, R() * 6]); else cypress.push([sx, t, z, 22 + R() * 10, 0]);
    }
  });
  // the gate landing: rose and ivory paving with gold stars
  kit.add('paving', scaleUV(new THREE.PlaneGeometry(CHW * 2, CZ0 - FRONT).rotateX(-Math.PI / 2).translate(0, SILL + 0.25, (FRONT + CZ0) / 2), CHW / 4, (CZ0 - FRONT) / 8), '#ffffff');

  // ---- the great-lancet front: buttress pinnacles, four great lancets (A001) ----
  for (let x = -317.5; x <= 390; x += 25) {
    if (Math.abs(x) < 62 || [92, 158].some((c) => Math.abs(Math.abs(x) - c) < 26) || !clear(x, FRONT + 3, 2)) continue;
    kit.add('ivory', box(4, 82, 6, x, 50, FRONT + 3), IVORY);
    spirelets.push([x, 132, FRONT + 3, 1.1, 0]);
  }
  for (const x of [-158, -92, 92, 158]) {
    const w = 35, h = 69, y = 58;
    kit.add('lancet', archPanel(w, h).translate(x, y, FRONT + 0.5), '#ffffff');
    kit.add('gold', archFrameGeometry(w, h, 1.2, 1.2).translate(x, y, FRONT + 0.9), GOLD);
    kit.add('ivory', archFrameGeometry(w + 4, h + 4, 1.6, 2).translate(x, y - 1, FRONT + 1.2), PEARL);     // carved hood
    kit.add('ivory', box(w + 6, 2, 3, x, y - 2, FRONT + 1.5), PEARL);                                     // sill
    for (const sd of [-1, 1]) {
      kit.add('ivory', box(3, h * 0.9, 3, x + sd * (w / 2 + 4), y, FRONT + 2), IVORY);
      spirelets.push([x + sd * (w / 2 + 4), y + h * 0.9, FRONT + 2, 0.9, 0]);
    }
    spirelets.push([x, y + h + 4, FRONT + 2, 1, 0]);
  }

  // ---- the Rose Gate (A003): gate block, five archivolt orders, crocketed gable with a rose, leaves ----
  kit.add('wing', wallBox(100, 90, GZ - FRONT, 0, 50, (FRONT + GZ) / 2, 25, 90), PEARL);
  kit.add('gate', archPanel(GW, GH).translate(0, SILL, GZ + 0.2), '#ffffff');
  for (let k = 0; k < 5; k++) {
    const w = GW + 3 + k * 4, h = GH + 2 + k * 3;
    kit.add(k % 2 ? 'gold' : 'ivory', archFrameGeometry(w, h, 1.6, 1 + k * 0.4).translate(0, SILL - 0.5, GZ + 0.6 + k * 0.5), k % 2 ? GOLD : (k ? ROSE : PEARL));
  }
  kit.add('gold', lathe([[0, 0], [2, 1], [3.2, 3], [1.6, 5], [0, 6.5]], 10).translate(0, SILL + GH + 13, GZ + 3), GOLD);   // lotus keystone
  const gTop = 140, apex = 182 - gTop, roseY = gTop + 24;
  {
    const gs = new THREE.Shape(); gs.moveTo(-52, 0); gs.lineTo(52, 0); gs.lineTo(0, apex); gs.lineTo(-52, 0);
    const hole = new THREE.Path(); hole.absarc(0, roseY - gTop, 8, 0, Math.PI * 2, true); gs.holes.push(hole);
    kit.add('ivory', new THREE.ExtrudeGeometry(gs, { depth: 3, bevelEnabled: false }).translate(0, gTop, GZ - 2), PEARL);
    kit.add('gold', new THREE.TorusGeometry(8.5, 0.8, 6, 40).translate(0, roseY, GZ + 1.2), GOLD);
    const rose = new THREE.Mesh(new THREE.CircleGeometry(8, 40), mats.rose); rose.position.set(0, roseY, GZ - 1.5); body.add(rose);
    for (let i = 1; i < 9; i++) for (const sd of [-1, 1]) { const t = i / 9; spirelets.push([sd * 52 * (1 - t), gTop + apex * t, GZ + 1, 0.45, 0]); }
    spirelets.push([0, gTop + apex, GZ + 1, 1.4, 0]);
    for (const sd of [-1, 1]) {                                                 // twin pinnacle towers flanking the gate
      kit.frame(sd * 57, 0, GZ - 2);
      kit.add('spire', oct(5, 128, 50), PEARL);
      kit.add('gold', ring(5.6, 1.2, 140, 8).rotateY(Math.PI / 8), GOLD);
      kit.add('dome', needle(5.5, 30).translate(0, 178, 0), '#ffffff');
      kit.add('gold', finialGeo(1.6).translate(0, 207, 0), GOLD);
      kit.frame();
    }
  }
  const lt = leafTex(), leafMat = toon('#ffffff', { map: lt.map, emissiveMap: lt.glow, emissive: '#b0a0ff', emissiveIntensity: 0.6, side: THREE.DoubleSide });
  const hs = GH - GW * 0.866;
  const leaves = [-1, 1].map((sd) => {
    const pivot = new THREE.Group(); pivot.position.set(sd * GW / 2, SILL, GZ + 0.4);
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(GW / 2, hs).translate(-sd * GW / 4, hs / 2, 0), leafMat);
    pivot.add(leaf); body.add(pivot);
    return { pivot, s: sd };
  });

  // ---- the cascade court: a three-basin water stair between twin flights, down to the upper terrace ----
  const flightLen = Math.hypot(CZ1 - CZ0, SILL), flightA = Math.atan2(SILL, CZ1 - CZ0);
  for (const [fx, fhw] of CASCADE.flights) kit.add('steps', flight(fx / S, fhw / S, CZ0, SILL, CZ1, 0, 0.45 / S), '#ffffff');
  for (const sd of [-1, 1]) {
    const xa = sd > 0 ? CW : -CHW, xb = sd > 0 ? CHW : -CW;
    const wedge = new THREE.Shape([new THREE.Vector2(CZ0, 0), new THREE.Vector2(CZ1, 0), new THREE.Vector2(CZ0, SILL)]);
    kit.add('podium', scaleUV(new THREE.ExtrudeGeometry(wedge, { depth: xb - xa, bevelEnabled: false }).rotateY(-Math.PI / 2).translate(xb, 0, 0), 0.04, 0.02), ROSE);
    for (const rx of [sd * (CW + 0.5), sd * 95.5]) {
      const rail = new THREE.PlaneGeometry(flightLen, 1.2).rotateZ(-flightA).rotateY(-Math.PI / 2);
      kit.add('jali', scaleUV(rail, flightLen / 1.2, 1).translate(rx, SILL / 2 + 0.7, (CZ0 + CZ1) / 2), IVORY);
      for (let t = 0; t <= 1.001; t += 1 / 12) lamps.push([wx(rx), wy(SILL * (1 - t)), wz(CZ0 + (CZ1 - CZ0) * t), 1, 0]);
    }
    for (let t = 0.06; t < 0.97; t += 0.075) cypress.push([sd * 103, SILL * (1 - t), CZ0 + (CZ1 - CZ0) * t, 9 + R() * 3, 0]);   // planted margin
  }
  {
    const basins = [[CZ0, 270, SILL * 2 / 3], [270, 305, SILL / 3], [305, CZ1, 1]];
    let yTop = SILL;
    for (const [z0, z1, y] of basins) {
      kit.add('podium', wallBox(CW * 2, y + 4, z1 - z0, 0, -4, (z0 + z1) / 2, 24, 52), ROSE);
      water.push(new THREE.PlaneGeometry(CW * 2 - 2, z1 - z0 - 1).rotateX(-Math.PI / 2).translate(0, y + 0.2, (z0 + z1) / 2));
      falls.push(new THREE.PlaneGeometry(CW * 2 - 4, yTop - y, 1, 8).translate(0, (yTop + y) / 2, z0 + 0.3));
      for (const x of [-18, -6, 6, 18]) sprays.push([x, y + 0.2, (z0 + z1) / 2, 1.4]);
      yTop = y;
    }
  }

  // ---- corner pavilions: rose pedestal, starred banner shaft, gallery, drum, purple onion dome ----
  for (const [x, z] of CORNERS) {
    kit.frame(x, 0, z);
    kit.add('ivory', oct(33, 44, -4), ROSE);
    kit.add('tower', oct(29, 87, 40), IVORY);
    for (const y of [40, 90, 127]) kit.add('gold', ring(30.2, 1.6, y - 0.8, 8).rotateY(Math.PI / 8), GOLD);
    kit.add('ivory', ring(33, 4, 127, 8).rotateY(Math.PI / 8), PEARL);
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(24, 25, 18, 16, 1, true).translate(0, 140, 0), 8, 1), IVORY);
    kit.add('gold', ring(26, 1.6, 148), GOLD);
    kit.add('dome', onion(27, 32).translate(0, 149, 0), '#ffffff');
    kit.add('gold', finialGeo(4.6).translate(0, 180, 0), GOLD);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8, p = kit.world(Math.cos(a) * 32, 0, Math.sin(a) * 32); spirelets.push([p.x, 131, p.z, 0.7, 0]); }
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {                // crystal lanterns on gold bracket arms
      kit.add('gold', box(Math.abs(dx) * 8 + 1, 1, Math.abs(dz) * 8 + 1, dx * 33, 110, dz * 33), GOLD);
      const p = kit.world(dx * 37, 0, dz * 37); hanging.push([p.x, 110, p.z, 3.2, 0]);
    }
    kit.frame();
    solids.push({ x, z, r: 33, y0: -10, y1: 200 });
  }
  // ---- the front boundary: domed towers linked by two-storey open arcades, round the forecourt gardens ----
  const boundaryTower = (x, z, purple, h, r) => {
    kit.frame(x, 0, z);
    kit.add('ivory', oct(r + 3, 14, -4), PEARL);
    kit.add('tower', oct(r, h - 10, 10), IVORY);
    for (const y of [10, h * 0.42, h - 2]) kit.add('gold', ring(r + 1, 1.3, y, 8).rotateY(Math.PI / 8), GOLD);
    kit.add('ivory', ring(r + 2.5, 3, h, 8).rotateY(Math.PI / 8), PEARL);
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(r * 0.82, r * 0.86, 9, 16, 1, true).translate(0, h + 7.5, 0), 6, 0.5), IVORY);
    if (purple) kit.add('dome', onion(r * 0.95, r * 1.6).translate(0, h + 12, 0), '#ffffff');
    else kit.add('gold', cap('dome', r * 0.95, r * 1.1, 20).translate(0, h + 12, 0), GOLD);
    kit.add('gold', finialGeo(r * 0.14).translate(0, h + 12 + (purple ? r * 1.6 : r * 1.1) - 1, 0), GOLD);
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + Math.PI / 8, p = kit.world(Math.cos(a) * (r + 2), 0, Math.sin(a) * (r + 2)); spirelets.push([p.x, h + 3, p.z, 0.5, 0]); }
    for (const dx of [-1, 1]) { const p = kit.world(dx * (r + 4), 0, 3); hanging.push([p.x, h * 0.72, p.z, 2.4, 0]); kit.add('gold', box(5, 0.8, 0.8, dx * (r + 2), h * 0.72 + 0.5, 3), GOLD); }
    kit.frame();
    solids.push({ x, z, r: r + 2, y0: -10, y1: h + 40 });
  };
  // an arcade between two towers, at its own height, stepped with the layer
  const arcade = (ax, az, ar, bx, bz, br, h) => {
    const dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz) - ar - br, a = Math.atan2(dz, dx), mx = ax + Math.cos(a) * (ar + L / 2), mz = az + Math.sin(a) * (ar + L / 2);
    if (L < 4) return;
    kit.frame(mx, 0, mz, -a);
    kit.add('podium', wallBox(L, h + 4, 5, 0, -4, 0, 12, h + 4), PEARL);
    kit.add('ivory', box(L, 2, 8, 0, h - 4, 0), PEARL);
    kit.add('jali', scaleUV(new THREE.PlaneGeometry(L, 3).translate(0, h - 0.5, 2), L / 3, 1), IVORY);
    for (let u = -L / 2 + 5; u < L / 2 - 2; u += 11) { const p = kit.world(u, 0, 2.5), q = kit.world(u + 5, 0, 5); clumps.push([p.x, h + 1, p.z, 4.5 + R() * 1.5, R() * 6], [q.x, 2, q.z, 4 + R(), R() * 6]); }
    kit.frame();
    const n = Math.ceil(L / 20);
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, cx = ax + Math.cos(a) * (ar + L * t), cz = az + Math.sin(a) * (ar + L * t); solids.push({ x: cx, z: cz, r: L / n / 2 + 1, y0: -10, y1: h + 4 }); }
  };
  for (const list of [BOUNDARY, INNER]) list.forEach(([x, z, purple, h, r], i) => {
    boundaryTower(x, z, purple, h, r);
    const nb = list[i + 1];
    if (!nb || (x < 0 && nb[0] > 0)) return;
    arcade(x, z, r, nb[0], nb[1], nb[4], Math.round(Math.min(h, nb[3]) * 0.38 + (list === INNER ? 14 : 4)));
  });
  // short stepped arcades joining the outer layer to the inner one at each end, at uneven lengths
  for (const [o, n] of [[0, 0], [5, 2], [6, 3], [12, 6]]) { const A = BOUNDARY[o], B = INNER[n]; arcade(A[0], A[1], A[4], B[0], B[1], B[4], 30); }
  for (const x of [-385, 450]) {                                              // the side arcades back to the ground storey
    kit.add('podium', wallBox(5, 30, BZ - 235, x, -4, (BZ + 235) / 2, 12, 34), PEARL);
    solids.push({ minX: x - 3, maxX: x + 3, minZ: 235, maxZ: BZ, y0: -10, y1: 34 });
  }
  // the forecourt gardens: lawns and rose beds, cypress walks, blossom trees, lotus fountains
  for (const sd of [-1, 1]) {
    const xa = sd > 0 ? CHW + 4 : -381, xb = sd > 0 ? 446 : -CHW - 4, w = xb - xa, cx = (xa + xb) / 2;
    kit.add('garden', scaleUV(new THREE.PlaneGeometry(w, BZ - 238).rotateX(-Math.PI / 2).translate(cx, 0.3, (BZ + 238) / 2), w / 40, (BZ - 238) / 40), '#ffffff');
    for (let x = xa + 12, i = 0; x < xb - 8; x += 13, i++) {
      for (const z of [246, 306]) {
        if (!clear(x, z, 5)) continue;
        if (i % 3 === 1) blossoms.push([x, 0, z, 1 + R() * 0.3, R() * 6]); else cypress.push([x, 0, z, 24 + R() * 10, 0]);
      }
    }
  }
  // the tall purple-domed towers standing against the lancet front
  for (const [x, z, r, yb, dh] of FRONT_TOWERS) {
    kit.frame(x, 0, z);
    kit.add('tower', oct(r, yb + 4, -4), IVORY);
    for (const y of [52, 110, yb - 2]) kit.add('gold', ring(r + 1.2, 1.4, y, 8).rotateY(Math.PI / 8), GOLD);
    kit.add('ivory', ring(r + 3, 3, yb - 3, 8).rotateY(Math.PI / 8), PEARL);
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(r * 0.86, r * 0.9, 10, 16, 1, true).translate(0, yb + 5, 0), 6, 0.5), IVORY);
    kit.add('dome', onion(r * 1.05, dh).translate(0, yb + 10, 0), '#ffffff');
    kit.add('gold', needle(r * 0.09, 16, 6).translate(0, yb + 10 + dh - 2, 0), GOLD);
    kit.add('gold', finialGeo(r * 0.14).translate(0, yb + 10 + dh + 13, 0), GOLD);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8, p = kit.world(Math.cos(a) * (r + 3), 0, Math.sin(a) * (r + 3)); spirelets.push([p.x, yb, p.z, 0.55, 0]); }
    for (const dx of [-1, 1]) { const p = kit.world(dx * (r + 5), 0, 4); hanging.push([p.x, yb - 25, p.z, 2.6, 0]); }
    kit.frame();
    solids.push({ x, z, r: r + 1, y0: -10, y1: yb + dh + 20 });
  }

  // ---- the great onion dome, west of the gate: drum with window rings, gold-ribbed purple bulb ----
  {
    const { x, z, r } = GREAT_DOME, y0 = roofAt(x, z);
    kit.frame(x, 0, z);
    kit.add('ivory', ring(r + 6, 4, y0, 24), PEARL);
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(r, r + 1, 44, 24, 1, true).translate(0, y0 + 26, 0), 14, 2), IVORY);
    for (const y of [y0 + 4, y0 + 26, y0 + 47]) kit.add('gold', ring(r + 1.2, 1.4, y - 0.7), GOLD);
    kit.add('ivory', ring(r + 3, 3, y0 + 46, 24), PEARL);
    kit.add('dome', onion(r + 4, 58, 32, 12).translate(0, y0 + 48, 0), '#ffffff');
    kit.add('gold', ring(r * 0.86, 2, y0 + 47), GOLD);
    kit.add('gold', needle(2.2, 32, 8).translate(0, y0 + 104, 0), GOLD);
    kit.add('gold', finialGeo(4).translate(0, y0 + 134, 0), GOLD);
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2, p = kit.world(Math.cos(a) * (r + 5), 0, Math.sin(a) * (r + 5)); spirelets.push([p.x, y0 + 4, p.z, 0.9, 0]); }
    for (let i = 0; i < 4; i++) {                                               // four slim turrets round the drum
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      kit.frame(x + Math.cos(a) * (r + 12), 0, z + Math.sin(a) * (r + 12));
      kit.add('drum', scaleUV(new THREE.CylinderGeometry(5, 5, 40, 10, 1, true).translate(0, y0 + 20, 0), 3, 1), IVORY);
      kit.add('gold', ring(5.6, 1, y0 + 40, 10), GOLD);
      kit.add('dome', needle(5.5, 16, 10).translate(0, y0 + 41, 0), '#ffffff');
      kit.add('gold', finialGeo(1).translate(0, y0 + 56, 0), GOLD);
      solids.push({ x: x + Math.cos(a) * (r + 12), z: z + Math.sin(a) * (r + 12), r: 5.5, y0: y0 - 4, y1: y0 + 60 });
    }
    kit.frame();
    solids.push({ x, z, r: r + 6, y0: y0 - 4, y1: 350 });
  }

  // ---- needle spires: stacked glass-strip shafts with lantern balconies, an open lantern, a purple needle ----
  for (const [x, z, topY, w] of SPIRES) {
    const y0 = roofAt(x, z), needleH = Math.min(topY * 0.16, (topY - y0) * 0.32), lantH = 1.4 * w, shaftTop = topY - needleH - lantH;
    kit.frame(x, 0, z);
    const stages = shaftTop - y0 > 90 ? 3 : 2, sh = (shaftTop - y0) / stages;
    for (let k = 0; k < stages; k++) {
      const ww = w * (1 - k * 0.12), yb = y0 + k * sh;
      kit.add('spire', scaleUV(new THREE.BoxGeometry(ww, sh - 2, ww).translate(0, yb + (sh - 2) / 2, 0), 1, Math.max(1, Math.round((sh - 2) / 45))), IVORY);
      kit.add('ivory', box(ww + 2.4, 2, ww + 2.4, 0, yb + sh - 2, 0), PEARL);
      kit.add('gold', box(ww + 2.8, 0.5, ww + 2.8, 0, yb + sh - 0.3, 0), GOLD);
      for (const [cx, cz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const p = kit.world(cx * (ww / 2 + 0.8), 0, cz * (ww / 2 + 0.8)); spirelets.push([p.x, yb + sh, p.z, ww / 30, 0]); }
      if (w >= 12) hanging.push([x + ww / 2 + 1.4, yb + sh - 2, z, 1.4, 0]);
    }
    const lw = w * 0.5;
    kit.add('drum', scaleUV(new THREE.CylinderGeometry(lw, lw, lantH, 8, 1, true).translate(0, shaftTop + lantH / 2, 0), 4, 1), IVORY);
    kit.add('gold', ring(lw + 0.4, 0.6, shaftTop + lantH - 0.6, 8), GOLD);
    kit.add('dome', needle(lw * 1.15, needleH, 8).translate(0, shaftTop + lantH, 0), '#ffffff');
    kit.add('gold', finialGeo(Math.max(0.8, w * 0.12)).translate(0, topY - 1, 0), GOLD);
    kit.frame();
    solids.push({ x, z, r: w * 0.72, y0: y0 - 4, y1: topY });
  }
  // purple-domed towers on the dome terrace and the crown garden
  for (const [x, z, r, yb, dh] of DOME_TOWERS) {
    const y0 = roofAt(x, z);
    kit.frame(x, 0, z);
    kit.add('tower', oct(r, yb - y0, y0), IVORY);
    kit.add('ivory', ring(r + 2.5, 2.5, yb - 2.5, 8).rotateY(Math.PI / 8), PEARL);
    kit.add('gold', ring(r + 0.8, 1.2, yb, 16), GOLD);
    kit.add('dome', onion(r + 1, dh).translate(0, yb + 1, 0), '#ffffff');
    kit.add('gold', finialGeo(r * 0.2).translate(0, yb + dh, 0), GOLD);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8, p = kit.world(Math.cos(a) * (r + 2), 0, Math.sin(a) * (r + 2)); spirelets.push([p.x, yb, p.z, 0.45, 0]); }
    kit.frame();
    solids.push({ x, z, r: r + 1, y0: y0 - 4, y1: yb + dh + 8 });
  }
  {  // the cone pavilion on the north axis: arcaded drum and a gold-ribbed purple tent cone
    const { x, z, r, top } = CONE, y0 = roofAt(x, z);
    kit.frame(x, 0, z);
    kit.add('podium', scaleUV(new THREE.CylinderGeometry(r, r + 1, 22, 24, 1, true).translate(0, y0 + 11, 0), 12, 0.42), PEARL);
    kit.add('gold', ring(r + 1.5, 1.4, y0 + 22), GOLD);
    kit.add('dome', tent(r + 2, top - y0 - 33, 32, 16).translate(0, y0 + 23, 0), '#ffffff');
    kit.add('gold', finialGeo(3.4).translate(0, top - 11, 0), GOLD);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, p = kit.world(Math.cos(a) * (r + 3), 0, Math.sin(a) * (r + 3)); spirelets.push([p.x, y0, p.z, 0.8, 0]); }
    kit.frame();
    solids.push({ x, z, r: r + 2, y0: y0 - 4, y1: top });
  }
  // drum turrets with small onion domes or slim cones at the tier corners and along the tier fronts
  {
    const spots = [];
    for (const k of [1, 2, 3]) {
      const [x0, x1, z0, z1] = PALACE_TIERS[k];
      spots.push([x0 + 5, z1 - 5], [x1 - 5, z1 - 5], [x0 + 5, z0 + 5], [x1 - 5, z0 + 5]);
      for (let x = x0 + 55; x < x1 - 40; x += 70) spots.push([x, z1 - 5]);
    }
    spots.forEach(([x, z], i) => {
      const r = 6 + (i % 3) * 1.5;
      if ((Math.abs(x) < 64 && z > 100) || !clear(x, z, r + 2)) return;
      const y0 = roofAt(x, z), h = r * 4.2, cone = i % 3 === 1;
      kit.frame(x, 0, z);
      kit.add('drum', scaleUV(new THREE.CylinderGeometry(r, r, h + 3, 12, 1, true).translate(0, y0 - 3 + (h + 3) / 2, 0), 4, 1), IVORY);
      kit.add('gold', ring(r + 0.8, 1, y0 + h - 1, 12), GOLD);
      if (cone) kit.add('dome', needle(r * 1.15, r * 3.6, 12).translate(0, y0 + h, 0), '#ffffff');
      else kit.add('dome', onion(r * 1.05, r * 2.4, 16).translate(0, y0 + h, 0), '#ffffff');
      kit.add('gold', finialGeo(r * 0.25).translate(0, y0 + h + (cone ? r * 3.6 : r * 2.4) - 1, 0), GOLD);
      kit.frame();
      taken.push([x, z, r + 1]);
      solids.push({ x, z, r: r + 0.5, y0: y0 - 4, y1: y0 + h + r * 4 });
    });
  }

  // ---- garden pavilions on the lancet storey and the dome terrace: arched loggias with small purple domes ----
  for (const [k, zf] of [[1, 150], [2, 75]]) {
    const [x0, x1, , , t] = PALACE_TIERS[k];
    for (let x = x0 + 30; x < x1 - 20; x += 46) {
      if (Math.abs(x) < 70 || !clear(x, zf, 14)) continue;
      const w = 22, h = 24 + (Math.abs(x) % 3) * 4;
      kit.frame(x, 0, zf);
      kit.add('wing', wallBox(w, h, 16, 0, t, 0, w / 2, h), IVORY);
      kit.add('ivory', box(w + 3, 2, 19, 0, t + h, 0), PEARL);
      kit.add('gold', box(w + 3.4, 0.5, 19.4, 0, t + h + 2, 0), GOLD);
      kit.add('gold', ring(6.6, 1, t + h + 2.4, 12), GOLD);
      kit.add('dome', onion(7, 10, 16).translate(0, t + h + 3, 0), '#ffffff');
      kit.add('gold', finialGeo(1.2).translate(0, t + h + 12.5, 0), GOLD);
      for (const sd of [-1, 1]) for (const dz of [-9, 9]) spirelets.push([x + sd * (w / 2 + 1), t + h + 2, zf + dz, 0.6, 0]);
      kit.frame();
      taken.push([x, zf, 15]);
      solids.push({ minX: x - w / 2, maxX: x + w / 2, minZ: zf - 8, maxZ: zf + 8, y0: t - 4, y1: t + h + 14 });
    }
  }

  // ---- roof gardens (crop 08): the water channel down the axis, wheel parterres, conservatories, pools ----
  for (const [z0, z1, y] of [[-195, 38, 228], [42, 108, 197]]) {
    kit.add('ivory', box(24, 0.8, z1 - z0, 0, y, (z0 + z1) / 2), PEARL);
    water.push(new THREE.PlaneGeometry(20, z1 - z0 - 1).rotateX(-Math.PI / 2).translate(0, y + 0.9, (z0 + z1) / 2));
    for (let z = z0 + 12; z < z1; z += 26) sprays.push([0, y + 0.9, z, 1.6]);
  }
  falls.push(new THREE.PlaneGeometry(18, 31, 1, 6).translate(0, 212.5, 40.8), new THREE.PlaneGeometry(18, 69, 1, 12).translate(0, 162.5, 110.8));
  kit.add('ivory', box(64, 1, 26, 0, 128, 123), PEARL);                                  // the pool at the foot of the spires
  water.push(new THREE.PlaneGeometry(60, 22).rotateX(-Math.PI / 2).translate(0, 129.1, 123));
  fountains.push([0, 129, 123, 0.55]);
  {  // eight-spoke wheel parterres
    const [c, g] = cv(256, 256);
    g.fillStyle = '#f3dfd8'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#d9b25a'; g.beginPath(); g.arc(128, 128, 124, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#4f9a4f'; g.beginPath(); g.arc(128, 128, 116, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; g.strokeStyle = '#f3dfd8'; g.lineWidth = 12; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + Math.cos(a) * 116, 128 + Math.sin(a) * 116); g.stroke(); }
    for (let i = 0; i < 160; i++) { const a = R() * 6.28, d = 30 + R() * 80; g.fillStyle = ['#f6a6c8', '#ff7fb0', '#ffe3ef'][i % 3]; g.beginPath(); g.arc(128 + Math.cos(a) * d, 128 + Math.sin(a) * d, 4, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#fbf4ee'; g.beginPath(); g.arc(128, 128, 30, 0, Math.PI * 2); g.fill();
    const wheel = new THREE.MeshLambertMaterial({ map: tex(c, false), transparent: true, alphaTest: 0.1 });
    for (const [x, z] of WHEELS) {
      const m = new THREE.Mesh(new THREE.CircleGeometry(30, 48).rotateX(-Math.PI / 2), wheel);
      m.position.set(x, roofAt(x, z) + 0.4, z); body.add(m);
      fountains.push([x, roofAt(x, z), z, 0.4]);
    }
  }
  for (const [x, zc, L] of CONSERVATORIES) {                                   // glass barrel vaults with a cross gable, gold ribs, orange trees
    const y = roofAt(x, zc), r = 21;
    const vault = new THREE.CylinderGeometry(r, r, L, 20, 1, true, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).translate(x, y + 6, zc);
    const crossV = new THREE.CylinderGeometry(r * 0.8, r * 0.8, r * 2.6, 16, 1, true, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2).translate(x, y + 6, zc);
    detail.add(new THREE.Mesh(merge([vault, crossV]), mats.glass));
    kit.add('ivory', box(r * 2 + 2, 6, L + 2, x, y, zc), PEARL);
    for (let k = 0; k <= 10; k++) kit.add('gold', new THREE.TorusGeometry(r, 0.5, 4, 20, Math.PI).rotateY(Math.PI / 2).translate(x, y + 6, zc - L / 2 + (k * L) / 10), GOLD);
    kit.add('gold', box(1, 1, L, x, y + 6 + r - 0.5, zc), GOLD);
    for (let k = 0; k < 12; k++) oranges.push([x + ((k % 2) - 0.5) * 18, y + 6, zc - L / 2 + 8 + (k >> 1) * 14, 2.2, k]);
    solids.push({ minX: x - r, maxX: x + r, minZ: zc - L / 2, maxZ: zc + L / 2, y0: y - 4, y1: y + 6 + r });
  }
  {  // the hexagonal glass pavilion in the west garden
    const x = -295, z = -184, y = roofAt(x, z);
    detail.add(new THREE.Mesh(merge([new THREE.CylinderGeometry(20, 20, 24, 6, 1, true).translate(x, y + 12, z), new THREE.ConeGeometry(21, 14, 6, 1, true).translate(x, y + 31, z)]), mats.glass));
    for (const yy of [y, y + 23.5]) kit.add('gold', ring(20.5, 0.8, yy, 6), GOLD);
    kit.add('gold', finialGeo(1.6).translate(x, y + 37, z), GOLD);
    for (let k = 0; k < 5; k++) oranges.push([x + Math.cos(k * 1.26) * 9, y, z + Math.sin(k * 1.26) * 9, 2.4, k]);
    solids.push({ x, z, r: 21, y0: y - 4, y1: y + 40 });
  }
  {  // the west mirror pool
    const x = -198, z = 62, y = roofAt(x, z);
    kit.add('ivory', box(44, 1, 28, x, y, z), PEARL);
    water.push(new THREE.PlaneGeometry(40, 24).rotateX(-Math.PI / 2).translate(x, y + 1.1, z));
    fountains.push([x, y + 1, z, 0.5]);
    solids.push({ minX: x - 22, maxX: x + 22, minZ: z - 14, maxZ: z + 14, y0: y - 4, y1: y + 2 });
  }
  for (const [x, z] of [[-290, 306], [-200, 306], [205, 306], [290, 306], [100, 150], [-140, 150], [-70, 80], [40, -150]]) fountains.push([x, roofAt(x, z), z, 0.7]);
  // blossom trees in carved planters across every terrace
  for (let i = 0, tries = 0; i < 50 && tries < 900; tries++) {
    const x = -380 + R() * 825, z = -330 + R() * 665, t = roofAt(x, z);
    if (!t || Math.abs(x) < 18 || (Math.abs(x) < CHW + 6 && z > FRONT - 4) || !clear(x, z, 8)) continue;
    const [x0, x1, z0, z1] = PALACE_TIERS.find(([a, b, c, d, h]) => h === t && x >= a && x <= b && z >= c && z <= d);
    if (x - x0 < 8 || x1 - x < 8 || z - z0 < 8 || z1 - z < 8) continue;
    kit.add('ivory', box(6, 1.6, 6, x, t, z), PEARL);
    blossoms.push([x, t + 1.6, z, 0.85 + R() * 0.3, R() * 6]);
    taken.push([x, z, 5]); i++;
  }

  // ---- the rear: waterfalls off the podium's north and east edges into pools ----
  for (const [x, w] of [[-150, 18], [60, 24], [220, 16]]) {
    falls.push(new THREE.PlaneGeometry(w, 52, 1, 12).rotateY(Math.PI).translate(x, 26, -338.6));
    water.push(new THREE.CircleGeometry(w * 1.1, 24).rotateX(-Math.PI / 2).translate(x, 0.2, -338 - w * 1.1));
    kit.add('ivory', new THREE.TorusGeometry(w * 1.1, 0.6, 4, 24).rotateX(Math.PI / 2).translate(x, 0.2, -338 - w * 1.1), PEARL);
  }
  for (const z of [-250, 100]) {
    falls.push(new THREE.PlaneGeometry(16, 52, 1, 12).rotateY(Math.PI / 2).translate(450.6, 26, z));
    water.push(new THREE.CircleGeometry(17, 24).rotateX(-Math.PI / 2).translate(468, 0.2, z));
  }

  // ---- lotus fountains (A035) on the roofs ----
  {
    const fstone = [], fgold = [], fwater = [], fbud = [];
    for (const [x, y, z, s] of fountains) {
      const f = lotusFountainGeo(9 * s);
      fstone.push(f.stone.translate(x, y, z)); fgold.push(f.gold.translate(x, y, z)); fwater.push(f.water.translate(x, y, z)); fbud.push(f.bud.translate(x, y, z));
      for (const [sx, sy, sz, sr] of f.sprays) sprays.push([x + sx, y + sy, z + sz, sr]);
      solids.push({ x, z, r: 9 * s, y0: y - 4, y1: y + 12 * s });
    }
    detail.add(new THREE.Mesh(merge(fstone), am.lit), new THREE.Mesh(merge(fgold), mats.gold), new THREE.Mesh(merge(fwater), mats.water), new THREE.Mesh(merge(fbud), am.crystal));
  }

  // ---- build the body ----
  kit.build(mats, body, 'palace');
  body.add(new THREE.Mesh(merge(water), mats.water), new THREE.Mesh(merge(falls), mats.fall));
  const spr = spireletGeo(), hang = hangingLanternGeo();
  // drawn-metre tiles, each hidden beyond its range (world metres) from the camera
  const tiled = [
    [tiledInstances(spr, am.lit, spirelets, 'spirelets', 120), 3000],
    [tiledInstances(cypressGeo(), am.leaf, cypress, 'cypress', 120), 7000],
    [tiledInstances(blossomGeo(), am.leaf, blossoms, 'blossoms', 120), 7000],
    [tiledInstances(roseClumpGeo(), am.leaf, clumps, 'rose-clumps', 120), 1100],
    [tiledInstances(orangeTreeGeo(), am.leaf, oranges, 'orange-trees', 120), 800],
    [tiledInstances(hang.body, am.lit, hanging, 'lantern-body', 120), 1200], [tiledInstances(hang.glass, am.crystal, hanging, 'lantern-glass', 120), 1200],
  ];
  for (const [g] of tiled) detail.add(g);
  const sprayMat = additive('#cfeaff', { opacity: 0.28, side: THREE.DoubleSide });
  detail.add(new THREE.Mesh(merge(sprays.map(([x, y, z, r]) => new THREE.ConeGeometry(r * 0.5, r * 1.6, 6, 1, true).translate(x, y + r * 0.8, z))), sprayMat));

  // ---- the lotus basin at the foot of the cascade (world metres) ----
  {
    const f = lotusFountainGeo(PLAZA.r);
    for (const [g, m] of [[f.stone, am.lit], [f.gold, mats.gold], [f.water, mats.water], [f.bud, am.crystal]]) group.add(new THREE.Mesh(g.translate(PLAZA.x, PLAZA.y, PLAZA.z), m));
    addCollider({ x: PLAZA.x, z: PLAZA.z, r: PLAZA.r * 0.95 });
  }

  // ---- G02 roof court (sheet 16) on the crown garden, at human scale ----
  const courtOut = { lamps, hanging: [], cypress: [], blossoms: [], clumps: [], fountains: [], oranges: [] };
  const court = buildRoofCourt(group, mats, am, courtOut, wx(COURT.x), wy(roofAt(COURT.x, COURT.z)), wz(COURT.z));
  {
    const fstone = [], fgold = [], fwater = [], fbud = [], csprays = [];
    for (const [x, y, z, s] of courtOut.fountains) {
      const f = lotusFountainGeo(9 * s);
      fstone.push(f.stone.translate(x, y, z)); fgold.push(f.gold.translate(x, y, z)); fwater.push(f.water.translate(x, y, z)); fbud.push(f.bud.translate(x, y, z));
      for (const [sx, sy, sz, sr] of f.sprays) csprays.push(new THREE.ConeGeometry(sr * 0.5, sr * 1.6, 6, 1, true).translate(x + sx, y + sy + sr * 0.8, z + sz));
    }
    group.add(new THREE.Mesh(merge(fstone), am.lit), new THREE.Mesh(merge(fgold), mats.gold), new THREE.Mesh(merge(fwater), mats.water), new THREE.Mesh(merge(fbud), am.crystal), new THREE.Mesh(merge(csprays), sprayMat));
  }
  const lamp = postLampGeo();
  group.add(
    instances(lamp.body, am.lit, lamps, 'lamp-body'), instances(lamp.glass, am.crystal, lamps, 'lamp-glass'),
    instances(cypressGeo(), am.leaf, courtOut.cypress, 'court-cypress'), instances(blossomGeo(), am.leaf, courtOut.blossoms, 'court-blossoms'),
    instances(roseClumpGeo(), am.leaf, courtOut.clumps, 'court-roses'), instances(orangeTreeGeo(), am.leaf, courtOut.oranges, 'court-oranges'),
    instances(hang.body, am.lit, courtOut.hanging, 'court-lantern-body'), instances(hang.glass, am.crystal, courtOut.hanging, 'court-lantern-glass'),
  );
  // glow halos in world metres
  const glows = [];
  for (const [x, y, z, s] of lamps) glows.push([x, y + 5.3 * s, z, 2.2 * s]);
  for (const [x, y, z, s] of courtOut.hanging) glows.push([x, y - 1.15 * s, z, 2.4 * s]);
  for (const [x, y, z, s] of hanging) glows.push([wx(x), wy(y - 1.15 * s), wz(z), 2.4 * s * S]);
  const halos = haloPoints(glows, [1, 0.85, 0.7]);
  group.add(halos);
  group.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = o.material !== mats.glass; } });

  // ---- colliders, in world metres ----
  for (const [x0, x1, z0, z1, t] of PALACE_TIERS) addCollider({ minX: wx(x0), maxX: wx(x1), minZ: wz(z0), maxZ: wz(z1), y0: 0, y1: wy(t) - 3 });
  addCollider({ minX: wx(-52), maxX: wx(52), minZ: wz(FRONT), maxZ: wz(GZ + 1), y0: 0, y1: wy(182) });             // the gate block
  addCollider({ minX: -CASCADE.water, maxX: CASCADE.water, minZ: CASCADE.z0, maxZ: CASCADE.z1, y0: 0, y1: CASTLE.y - 2 });   // the water stair
  for (const c of solids) {
    if (c.r !== undefined) addCollider({ x: wx(c.x), z: wz(c.z), r: c.r * S, y0: wy(c.y0), y1: wy(c.y1) });
    else addCollider({ minX: wx(c.minX), maxX: wx(c.maxX), minZ: wz(c.minZ), maxZ: wz(c.maxZ), y0: wy(c.y0), y1: wy(c.y1) });
  }
  scene.add(group);

  // portals: from the upper terrace up to the roof court and back down
  const portals = [];
  if (makePortal) {
    const up = { x: -150 * S, z: 505 * S, y: BY }, down = { x: court.x, z: court.returnZ, y: court.y };
    const a = makePortal(up.x, up.y, up.z, Math.PI, '#ff9bd6', '✦ Palace Roof Garden');
    const b = makePortal(down.x, down.y, down.z, 0, '#ffd47a', '✦ Down to the Terraces');
    group.add(a.group, b.group);
    portals.push(
      { ...up, kind: 'to', disk: a.disk, land: { x: court.x, y: court.y, z: court.returnZ - 10, name: 'Palace Roof Garden', facing: Math.PI } },
      { ...down, kind: 'back', disk: b.disk, land: { x: up.x, y: BY, z: up.z + 12, name: 'Upper Terrace', facing: Math.PI } },
    );
  }

  const centre = new THREE.Vector3(wx(30), wy(150), 0);
  let gateOpen = 1, gateTarget = 1;
  return {
    group, portals,
    gatePosition: new THREE.Vector3(0, CASTLE.y, GATE.z),
    rosePosition: new THREE.Vector3(0, wy(roseY), wz(GZ)),
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
      sprayMat.opacity = 0.22 + 0.06 * Math.sin(t * 3);
      for (const p of portals) p.disk.material.uniforms.uTime.value = t;
      if (camera) {
        detail.visible = camera.position.distanceTo(centre) < 5200;
        for (const [g, range] of tiled) g.userData.cull(camera.position.x / S, camera.position.z / S, range / S);
      }
      court.update(t);
    },
  };
}

// --- G02 the palace roof court ---------------------------------------------------------------
// About 120 x 90 m on the crown garden, at human scale: West Rose Terrace, North Fountain
// Loggia, East Conservatory Garden, with walks of rose and ivory paving and gold star inlays.
// X, Y, Z: the court's centre in world metres; everything it adds is in world metres.
function buildRoofCourt(group, mats, am, out, X, Y, Z) {
  const HX = 60, HZ = 45, top = Y + 0.5, low = Y - 30, high = Y + 400;
  const kit = new Kit().frame(X, Y, Z);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(HX * 2, HZ * 2).rotateX(-Math.PI / 2), toon('#ffffff', { map: (() => { const t = courtFloorTex(); t.repeat.set(HX / 8, HZ / 8); return t; })(), emissive: '#2a1838', emissiveIntensity: 0.3 }));
  floor.position.set(X, top, Z); group.add(floor);
  addPad({ x: X, z: Z, hw: HX, hd: HZ, y: top, y0: low });
  // lotus balustrade round the court, open on the south side
  for (const [x, z, w, d] of [[0, -HZ, HX * 2, 0.6], [-HX, 0, 0.6, HZ * 2], [HX, 0, 0.6, HZ * 2]]) {
    kit.add('ivory', box(w, 1.1, d, x, 0.5, z), PEARL);
    kit.add('gold', box(w + 0.2, 0.12, d + 0.2, x, 1.6, z), GOLD);
  }
  for (let x = -HX + 3; x <= HX - 3; x += 3) out.clumps.push([X + x, Y + 1.9, Z - HZ, 0.9, x]);
  // kiosks with purple domes at the four corners
  for (const [x, z] of [[-HX + 4, -HZ + 4], [HX - 4, -HZ + 4], [-HX + 4, HZ - 4], [HX - 4, HZ - 4]]) {
    kit.add('ivory', oct(2.8, 4.5, 0.5).translate(x, 0, z), IVORY);
    kit.add('gold', ring(3.1, 0.3, 5, 8).translate(x, 0, z), GOLD);
    kit.add('dome', onion(3, 4.2, 12, 8).translate(x, 5.3, z), '#ffffff');
    kit.add('gold', finialGeo(0.6).translate(x, 9.4, z), GOLD);
    addCollider({ x: X + x, z: Z + z, r: 3, y0: low, y1: high });
  }
  // cypresses round the edges
  for (let x = -HX + 10; x <= HX - 10; x += 10) out.cypress.push([X + x, top, Z - HZ + 2.5, 9 + (Math.abs(x) % 3), 0]);
  for (let z = -HZ + 12; z <= HZ - 8; z += 10) for (const s of [-1, 1]) out.cypress.push([X + s * (HX - 2.5), top, Z + z, 9, 0]);

  // West Rose Terrace: 18 m three-tier lotus fountain in an eight-lobed basin, round rose beds, blossom trees
  out.fountains.push([X - 35, top, Z + 2, 1]);
  addCollider({ x: X - 35, z: Z + 2, r: 9.5, y0: low, y1: high });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, x = -35 + Math.cos(a) * 16, z = 2 + Math.sin(a) * 16;
    if (x > -20) continue;
    kit.add('ivory', cyl(2.6, 2.7, 0.6, 16, x, 0.5, z), PEARL);
    for (let k = 0; k < 5; k++) out.clumps.push([X + x + Math.cos(k * 1.3) * 1.4, Y + 1.2, Z + z + Math.sin(k * 1.3) * 1.4, 1.1, k]);
  }
  for (const [x, z] of [[-52, -30], [-52, 30], [-20, -30], [-20, 30]]) {
    kit.add('ivory', box(4, 1.4, 4, x, 0.5, z), PEARL);
    kit.add('gold', box(4.2, 0.2, 4.2, x, 1.9, z), GOLD);
    out.blossoms.push([X + x, Y + 1.9, Z + z, 0.5, x]);
  }
  // North Fountain Loggia: five pointed arches on lotus-capital columns, a wall fountain inside, roses draped over
  const lz = -HZ + 6, lw = 12;
  kit.add('ivory', box(lw * 5 + 4, 9, 1, 0, 0.5, lz - 5), PEARL);
  kit.add('ivory', box(lw * 5 + 4, 0.8, 7, 0, 9.5, lz - 2), PEARL);
  for (let i = 0; i <= 5; i++) {
    const x = -lw * 2.5 + i * lw;
    kit.add('ivory', cyl(0.45, 0.5, 6, 10, x, 0.5, lz + 1), PEARL);
    kit.add('gold', lathe([[0.45, 0], [0.9, 0.5], [1.1, 1.0], [0.8, 1.3]], 10).translate(x, 6.5, lz + 1), GOLD);
    addCollider({ x: X + x, z: Z + lz + 1, r: 0.7, y0: low, y1: high });
  }
  for (let i = 0; i < 5; i++) {
    const x = -lw * 2 + i * lw;
    kit.add('ivory', archFrameGeometry(lw - 1.6, 3.4, 0.6, 1).translate(x, 6.8, lz + 1), PEARL);
    kit.add('gold', archFrameGeometry(lw - 1.2, 3.6, 0.15, 1.1).translate(x, 6.8, lz + 1.2), GOLD);
    out.hanging.push([X + x, Y + 9.6, Z + lz + 1, 1, 0]);
    for (let k = 0; k < 4; k++) out.clumps.push([X + x - 4 + k * 2.6, Y + 10.2, Z + lz + 2.6, 1.2, k]);
  }
  out.fountains.push([X, top, Z + lz - 2.5, 0.22]);
  // East Conservatory Garden: a 30 x 12 m mirror pool with lotuses beside a long glass barrel vault
  kit.add('ivory', box(13, 0.5, 31, 25, 0.5, 0), PEARL);
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(12, 30).rotateX(-Math.PI / 2), mats.water);
  pool.position.set(X + 25, Y + 0.85, Z); group.add(pool);
  for (let i = 0; i < 12; i++) { const pad = new THREE.Mesh(new THREE.CircleGeometry(0.7, 10).rotateX(-Math.PI / 2), toon(i % 3 ? '#4f9a4f' : '#ff9cc4')); pad.position.set(X + 25 + Math.sin(i * 7.1) * 4.5, Y + 0.9, Z + (i - 6) * 2.3); group.add(pad); }
  addCollider({ minX: X + 18.5, maxX: X + 31.5, minZ: Z - 15.5, maxZ: Z + 15.5, y0: low, y1: high });
  {
    const x = 47, L = 52, r = 7;
    const vault = new THREE.CylinderGeometry(r, r, L, 16, 1, true, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).translate(X + x, Y + 2.5, Z);
    group.add(new THREE.Mesh(vault, mats.glass));
    kit.add('ivory', box(r * 2, 2, L, x, 0.5, 0), PEARL);
    for (let k = 0; k <= 13; k++) kit.add('gold', new THREE.TorusGeometry(r, 0.12, 4, 16, Math.PI).rotateY(Math.PI / 2).translate(x, 2.5, -L / 2 + (k * L) / 13), GOLD);
    for (let k = 0; k <= 13; k += 13) kit.add('gold', new THREE.SphereGeometry(0.5, 8, 6).translate(x, 2.5 + r, -L / 2 + (k * L) / 13), GOLD);
    for (let k = 0; k < 8; k++) out.oranges.push([X + x, Y + 2.5, Z - L / 2 + 4 + k * 6.4, 1, k]);
    addCollider({ minX: X + x - r, maxX: X + x + r, minZ: Z - L / 2, maxZ: Z + L / 2, y0: low, y1: high });
  }
  // curved marble benches and crystal lamps along the walks
  const benches = [];
  for (const [x, z, a] of [[-35, -12, 0], [-35, 16, Math.PI], [-48, 2, Math.PI / 2], [10, -20, -Math.PI / 2], [10, 20, -Math.PI / 2]]) benches.push([X + x, top, Z + z, 1, a]);
  group.add(instances(benchGeo(), am.lit, benches, 'court-benches'));
  for (const [x, z] of [[-8, 40], [8, 40], [-8, 10], [8, 10], [-8, -20], [8, -20]]) out.lamps.push([X + x, top, Z + z, 0.6, 0]);
  kit.build(mats, group, 'court');
  return { x: X, y: top, returnZ: Z + HZ - 8, update() {} };
}
