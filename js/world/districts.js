// The landmark areas round the castle (world-layout.md sections 2 and 2A, and the
// architecture sheet): Storybook Valley with the Rose Keep, the Temple Hill temple
// and colosseum ruin, the Lantern River Valley's misty keep and pagoda, the Star
// Chapel on the east cliff, the Red Canyon palace and bazaar under a rock arch,
// the jungle stepped temple, the Ruin Meadows and the Frost Fjord longhouse.
// Each style keeps its own material colour; all of it merges into a few meshes.
import * as THREE from 'three';
import {
  Kit, kitMaterials, box, cyl, body, wallBox, lathe, cap, curvedRoof, gable, archShape, rockArch,
  waterMaterial, ribbonAlong, haloPoints,
} from './kit.js';
import { rng } from './textures.js';
import { MOOD } from './sky.js';
import {
  addCollider, addPad, groundAt, ROSE_KEEP, ROSE_CRAG, STORY, STORY_LINE, STORY_RIVER, TEMPLE, TEMPLE_HILL, COLOSSEUM, PADS_FLAT,
  MISTY_CRAG, MISTY_KEEP, LANTERN_LINE, LANTERN_RIVER, STAR_CHAPEL, CHAPEL_CLIFF, CANYON, CANYON_LINE, CANYON_ARCH, CANYON_PALACE,
  JUNGLE, RUIN_SITES, FJORD, FJORD_LINE, LONGHOUSE, LAGOON, nearestOnLine,
} from './layout.js';

// palette (architecture sheet, "palette by style")
const P = {
  rose: '#eaa7c0', plum: '#7a2a5e', blush: '#f4c8d8', marble: '#f7eef2', lav: '#c9c0e8', slate: '#4a3f78',
  ea: '#f6f1ee', red: '#c0303e', eaRoof: '#45384f', sand: '#e6c08e', redRock: '#b4553e', trav: '#e8d6b6',
  timber: '#5a3a2c', moss: '#90a487', mossDark: '#5f7458', snow: '#f2f6fb', ice: '#bfe3f2', stone: '#a99fb4', grey: '#8c8496',
  pine: '#1f4a3c', leaf: '#2f6a4a', gold: '#e8b84a', warm: '#ffc27a', cyan: '#8ff4ff', pink: '#ff8fc8',
};
const face = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
const gy = (x, z, hint = 0) => groundAt(x, z, hint) ?? hint;

export function createDistricts(scene, preset, { pillars = [] } = {}) {
  const low = preset.grass < 4000;
  const S = low ? 12 : 18;                  // round segments
  const far = low ? 650 : 1000;              // draw distance for whole areas
  let K = new Kit();
  // each area builds into its own kit, so far areas can be skipped while drawing
  const sections = [];
  const begin = (x, z, R) => { K = new Kit(); sections.push({ x, z, R, kit: K }); };
  const group = new THREE.Group();
  const anim = [];
  const col = (lx, lz, r) => { const p = K.world(lx, 0, lz); addCollider({ x: p.x, z: p.z, r }); };
  let fjordBeam = null;

  // a round tower: windowed body, gold band, corbel ring, cap and finial
  function tower(x, z, y, r, h, { wall = P.rose, roof = P.plum, kind = 'witch', capH = r * 3.2, mat = 'win', flag = false, seg = S, corbel = true } = {}) {
    K.add(mat, body(r, h, seg, x, y, z, 5, 9), wall);
    K.add('gold', cyl(r + 0.25, r + 0.25, 0.6, seg, x, y + h - 2.2, z));
    if (corbel) K.add('plain', cyl(r + 0.9, r, 1.6, seg, x, y + h - 1.4, z), wall);
    const cr = corbel ? r + 0.9 : r;
    K.add('roof', cap(kind, cr, capH, seg).translate(x, y + h + 0.2, z), roof);
    const tip = y + h + 0.2 + capH;
    K.add('gold', new THREE.ConeGeometry(0.25, 2.4, 6).translate(x, tip + 1, z));
    if (flag) K.add('cloth', new THREE.PlaneGeometry(2.6, 1.4).translate(x + 1.3, tip + 2.6, z), P.gold);
    K.glow(x, tip + 2.2, z, Math.max(3, r * 0.7));
    col(x, z, r + 0.3);
    return tip;
  }
  // crenellations round a circle or along a straight run
  function merlonsRing(x, z, y, R, n, color, w = 1.2, h = 1.4) {
    for (let i = 0; i < n; i++) if (i % 2 === 0) {
      const a = (i / n) * Math.PI * 2;
      K.add('plain', box(w, h, 0.9, 0, 0, 0).rotateY(-a + Math.PI / 2).translate(x + Math.cos(a) * R, y, z + Math.sin(a) * R), color);
    }
  }
  function merlonsRun(x0, z0, x1, z1, y, color, step = 2.4) {
    const L = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(L / step), a = Math.atan2(x1 - x0, z1 - z0);
    for (let i = 0; i <= n; i += 1) if (i % 2 === 0) {
      const t = i / n;
      K.add('plain', box(0.9, 1.3, 1.2).rotateY(a).translate(x0 + (x1 - x0) * t, y, z0 + (z1 - z0) * t), color);
    }
  }
  // an arched doorway of warm light with a stone frame
  function doorway(x, y, z, w, h, pointed = false, frame = P.marble) {
    K.add('glow', new THREE.ShapeGeometry(archShape(w, h, pointed), 8).translate(x, y, z + 0.05), P.warm);
    const outer = archShape(w + 1.2, h + 0.7, pointed);
    outer.holes.push(new THREE.Path(archShape(w, h, pointed).getPoints(16)));
    K.add('plain', new THREE.ExtrudeGeometry(outer, { depth: 0.6, bevelEnabled: false, curveSegments: 8 }).translate(x, y, z - 0.2), frame);
  }
  function column(h, r, seg = low ? 8 : 10) {
    return lathe([[r * 1.35, 0], [r * 1.35, h * 0.04], [r, h * 0.07], [r * 1.03, h * 0.45], [r * 0.9, h * 0.9], [r * 1.35, h * 0.95], [r * 1.4, h], [0, h]], seg);
  }
  function lantern(x, z, y, color = P.warm, s = 1) {
    K.add('plain', cyl(0.12 * s, 0.15 * s, 3.2 * s, 6, x, y, z), P.timber);
    K.add('glow', new THREE.OctahedronGeometry(0.42 * s, 0).translate(x, y + 3.5 * s, z), color);
    K.glow(x, y + 3.5 * s, z, 3 * s);
  }
  function conifer(x, z, y, h, snow = false) {
    K.add('plain', cyl(0.4, 0.6, h * 0.25, 5, x, y, z), P.timber);
    for (let k = 0; k < 3; k++) {
      const r = h * (0.3 - k * 0.07), hh = h * 0.42;
      K.add('plain', new THREE.ConeGeometry(r, hh, 7).translate(x, y + h * 0.22 + k * h * 0.22 + hh / 2, z), P.pine);
      if (snow) K.add('plain', new THREE.ConeGeometry(r * 0.55, hh * 0.45, 7).translate(x, y + h * 0.22 + k * h * 0.22 + hh * 0.78, z), P.snow);
    }
  }
  function broadTree(x, z, y, h, leaf = P.leaf, r0 = h * 0.32) {
    K.add('plain', cyl(h * 0.03, h * 0.05, h * 0.7, 6, x, y, z), P.timber);
    const rr = rng(Math.floor(x * 7 + z));
    r0 *= 0.7;
    for (let k = 0; k < 4; k++) {
      const g = new THREE.IcosahedronGeometry(r0 * (0.7 + rr() * 0.3), 1);
      g.translate(x + (rr() - 0.5) * r0, y + h * 0.65 + rr() * r0 * 0.5, z + (rr() - 0.5) * r0);
      K.add('plain', g, leaf);
    }
  }

  // ======================= Storybook Valley ==================================
  begin(-780, -300, 160);
  {
    const sq = PADS_FLAT.story, y0 = gy(sq.x, sq.z);
    K.frame();
    K.add('plain', cyl(17, 17, 0.4, 24, sq.x, y0 - 0.2, sq.z), '#9c94a6');               // cobbled market square
    // fountain in the square
    K.add('plain', cyl(4.6, 5, 0.9, 16, sq.x, y0, sq.z), P.marble);
    K.add('plain', cyl(0.5, 0.7, 3.2, 8, sq.x, y0, sq.z), P.marble);
    K.add('glow', cyl(4.1, 4.1, 0.1, 16, sq.x, y0 + 0.75, sq.z), '#9fd8ff');
    // half-timbered houses: stone ground floor, jettied timber floors, steep rose and plum roofs
    STORY.houses.forEach(([x, z], i) => {
      const y = gy(x, z), ry = face(x, z, sq.x, sq.z), w = 9 + (i % 2) * 1.5, d = 8;
      K.frame(x, y, z, ry);
      K.add('plain', box(w, 4.5, d, 0, -1, 0), '#b7a9b8');
      K.add('timber', wallBox(w + 0.8, 5, d + 0.6, 0, 3.5, 0, 3.4, 5));
      K.add('timber', wallBox(w + 1.4, 3.6, d + 1.0, 0, 8.5, 0, 3.4, 3.6));
      K.add('roof', gable(w + 1.4, 7.5, d + 1.6, 0, 12.1, 0).rotateY(Math.PI / 2), i % 2 ? P.plum : '#d0577e');
      K.add('plain', box(1.4, 4, 1.4, w * 0.25, 14, 0), '#9a8290');                      // chimney
      K.add('roof', gable(2.6, 2, 2.4, -w * 0.18, 14, d * 0.45 + 0.6), i % 2 ? '#d0577e' : P.plum);   // dormer
      K.add('glow', box(1.4, 1.4, 0.2, -w * 0.18, 14.3, d * 0.45 + 1.4), P.warm);
      doorway(0, -0.2, d / 2 + 0.05, 1.8, 2.8, false, '#d8c8c8');
      K.add('plain', box(w + 1.6, 0.25, 0.8, 0, 3.2, d / 2 + 0.5), P.timber);            // flower box ledge
      K.add('glow', box(w * 0.5, 0.35, 0.5, 0, 3.45, d / 2 + 0.6), P.pink);
      col(0, 0, Math.max(w, d) * 0.62);
    });
    // windmill tower house with lattice sails that turn
    {
      const [x, z] = STORY.mill, y = gy(x, z), ry = face(x, z, sq.x, sq.z);
      K.frame(x, y, z, ry);
      K.add('plain', cyl(5.6, 6.2, 4, 8, 0, -1, 0), '#b7a9b8');
      K.add('timber', body(4.2, 18, 8, 0, 3, 0, 4, 6, 5.4));
      K.add('plain', cyl(4.8, 4.8, 0.6, 8, 0, 21, 0), P.timber);
      K.add('roof', cap('gothic', 4.6, 8, 8).translate(0, 21.4, 0), '#d0577e');
      doorway(0, -0.2, 5.4, 1.8, 2.8, false, '#d8c8c8');
      col(0, 0, 6);
      const sails = new THREE.Group(), sk = new Kit();
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2;
        const arm = new THREE.BoxGeometry(0.5, 12, 0.3).translate(0, 6.5, 0);
        const lat = new THREE.BoxGeometry(2.6, 10, 0.12).translate(1.6, 7, 0);
        sk.add('arm', arm.rotateZ(a), P.timber); sk.add('sail', lat.rotateZ(a), '#f6e8d8');
      }
      sails.userData.kit = sk;
      const hub = K.world(0, 19, 5.6);
      sails.position.copy(hub); sails.rotation.y = ry;
      group.add(sails);
      anim.push((t) => { sails.children.forEach((m) => { m.rotation.z = -t * 0.4; }); });
    }
    // the tower bridge: two round stone towers with red cones and a lit gallery over the river
    {
      const [x, z] = STORY.bridge, q = nearestOnLine(STORY_LINE, x, z, 40).s;
      const i = STORY_LINE.samples.indexOf(q), nb = STORY_LINE.samples[Math.min(STORY_LINE.samples.length - 1, i + 2)];
      const along = Math.atan2(nb.x - q.x, nb.z - q.z), ry = along + Math.PI / 2;     // the span crosses the river
      const half = STORY_RIVER.hw + 8;
      const ya = gy(x + Math.sin(ry) * half, z + Math.cos(ry) * half), yb = gy(x - Math.sin(ry) * half, z - Math.cos(ry) * half);
      const deck = Math.max(ya, yb, q.y + 4) + 0.3;   // level with the higher bank
      K.frame(x, 0, z, ry);
      for (const s of [-1, 1]) {
        const gz = s * half, yy = Math.min(ya, yb) - 3;
        K.add('win', body(5, deck + 26 - yy, S, 0, yy, gz, 5, 8, 5.6), P.lav);
        K.add('gold', cyl(5.3, 5.3, 0.5, S, 0, deck + 23.6, gz));
        K.add('plain', cyl(5.9, 5, 1.6, S, 0, deck + 24.4, gz), P.lav);
        K.add('roof', cap('witch', 5.9, 11, S).translate(0, deck + 26, gz), '#c8455e');
        K.add('gold', new THREE.ConeGeometry(0.25, 2.4, 6).translate(0, deck + 38, gz));
        K.glow(0, deck + 38.5, gz, 4);
        // the road runs through both towers
        doorway(0, deck, gz - s * 5.3, 2.4, 3.6, false, P.lav);
        K.add('glow', new THREE.ShapeGeometry(archShape(2.4, 3.6, false), 6).rotateY(Math.PI).translate(0, deck, gz + s * 5.35), P.warm);
      }
      // the arched span and deck
      const span = new THREE.Shape([new THREE.Vector2(-half, deck - 7), new THREE.Vector2(half, deck - 7), new THREE.Vector2(half, deck), new THREE.Vector2(-half, deck)]);
      span.holes.push(new THREE.Path(archShape(half * 1.6, 10, false).getPoints(20).map((p) => new THREE.Vector2(p.x, p.y + deck - 14))));
      K.add('plain', new THREE.ExtrudeGeometry(span, { depth: 6, bevelEnabled: false }).translate(0, 0, -3).rotateY(Math.PI / 2), P.lav);
      // the covered gallery high between the towers
      K.add('win', wallBox(4, 4, half * 2 - 8, 0, deck + 16, 0, 3, 4), P.lav);
      K.add('roof', gable(5, 2, half * 2 - 8, 0, deck + 20, 0), '#c8455e');
      merlonsRun(-3, -half + 5, -3, half - 5, deck, P.lav); merlonsRun(3, -half + 5, 3, half - 5, deck, P.lav);
      addPad({ x, z, hw: 2.6, hd: half + 4, a: ry, y: deck });
    }
  }

  // ======================= Rose Keep on its crag ===============================
  begin(ROSE_KEEP.x, ROSE_KEEP.z, 110);
  {
    const { x, z } = ROSE_KEEP, y = ROSE_CRAG.y - 0.3, ry = face(x, z, 0, 0);
    K.frame(x, y, z, ry);
    // curtain wall with crenellations and a gate
    K.add('win', body(30, 12, S * 2, 0, -2, 0, 9, 12), P.rose);
    K.add('plain', cyl(30.6, 30.6, 0.8, S * 2, 0, 10, 0, true), P.blush);
    merlonsRing(0, 0, 10.8, 30.2, 64, P.rose);
    doorway(0, -0.2, 30.4, 6, 9, true, P.blush);
    for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; if (Math.abs(Math.sin(a / 2)) < 0.12) continue; col(Math.sin(a) * 30, Math.cos(a) * 30, 3.4); }
    // three pairs of round towers (28, 40, 50 m), the tallest nearest the donjon
    for (const s of [-1, 1]) {
      tower(s * 26, 6, 0, 4.2, 22, { capH: 9, flag: true });
      tower(s * 18, -4, 0, 5, 32, { capH: 12 });
      tower(s * 10, -12, 0, 5.6, 40, { capH: 14, flag: true });
    }
    // the stacked donjon: tall shaft, corbelled upper tier, 18 m plum cone
    K.add('win', body(9, 52, S, 0, 0, -4, 5, 9), P.rose);
    K.add('gold', cyl(9.3, 9.3, 0.8, S, 0, 50, -4));
    K.add('plain', cyl(11.4, 9, 2.4, S, 0, 51.5, -4), P.blush);
    K.add('win', body(11, 9, S, 0, 53.8, -4, 4, 9), P.rose);
    K.add('plain', cyl(12.2, 11, 1.2, S, 0, 62.6, -4), P.blush);
    K.add('roof', cap('witch', 11.6, 18, S).translate(0, 63.6, -4), P.plum);
    K.add('gold', new THREE.ConeGeometry(0.4, 4, 6).translate(0, 83.4, -4));
    K.add('cloth', new THREE.PlaneGeometry(3.6, 1.9).translate(1.8, 85, -4), P.gold);
    K.glow(0, 84, -4, 10);
    col(0, -4, 9.4);
    // girih band round the keep
    K.add('gold', cyl(9.4, 9.4, 0.4, S, 0, 30, -4));
  }

  // ======================= Temple Hill: octastyle temple ========================
  begin(TEMPLE.x, TEMPLE.z, 100);
  {
    const { x, z } = TEMPLE, y = TEMPLE_HILL.y - 0.2, ry = face(x, z, 0, 0);
    K.frame(x, y, z, ry);
    const W = 26, D = 44, H = 14, cr = 0.85;
    for (let k = 0; k < 3; k++) K.add('plain', box(W + 6 - k * 2, 0.7, D + 6 - k * 2, 0, k * 0.7, 0), P.marble);
    const fy = 2.1;
    const front = 8, side = 13;
    for (let i = 0; i < front; i++) {
      const cx = -W / 2 + 1.5 + (i / (front - 1)) * (W - 3);
      for (const cz of [-D / 2 + 1.5, D / 2 - 1.5]) { K.add('plain', column(H, cr).translate(cx, fy, cz), '#fbf0f4'); col(cx, cz, 1); }
    }
    for (let j = 1; j < side - 1; j++) {
      const cz = -D / 2 + 1.5 + (j / (side - 1)) * (D - 3);
      for (const cx of [-W / 2 + 1.5, W / 2 - 1.5]) { K.add('plain', column(H, cr).translate(cx, fy, cz), '#fbf0f4'); col(cx, cz, 1); }
    }
    // glowing cella, entablature with a gold meander frieze, pediments, gold acroteria
    K.add('plain', box(W - 9, H, D - 10, 0, fy, -1), '#f3dde6');
    doorway(0, fy, (D - 10) / 2 - 1 + 0.05, 4.5, 9, false, '#f6e8ee');
    K.add('plain', box(W + 0.4, 1.4, D + 0.4, 0, fy + H, 0), P.marble);
    K.add('gold', box(W + 0.6, 0.7, D + 0.6, 0, fy + H + 1.4, 0));
    K.add('plain', box(W + 0.8, 0.8, D + 0.8, 0, fy + H + 2.1, 0), P.marble);
    K.add('plain', gable(W + 0.8, 4.6, D + 0.8, 0, fy + H + 2.9, 0, 0), P.blush);
    for (const s of [-1, 1]) {
      K.add('gold', new THREE.ConeGeometry(0.8, 1.6, 4).translate(0, fy + H + 8.4, s * (D / 2 + 0.4)));
      for (const t of [-1, 1]) K.add('gold', new THREE.ConeGeometry(0.6, 1.4, 4).translate(t * (W / 2 + 0.4), fy + H + 3.6, s * (D / 2 + 0.4)));
      K.add('gold', new THREE.CircleGeometry(1.1, 12).rotateY(s < 0 ? Math.PI : 0).translate(0, fy + H + 4.8, s * (D / 2 + 0.45)));
    }
    K.glow(0, fy + 4, D / 2 - 6, 8);
    // braziers either side of the steps, cypresses round the hilltop
    for (const s of [-1, 1]) {
      K.add('gold', cyl(1.2, 0.5, 1.4, 10, s * 8, 0, D / 2 + 6));
      K.add('glow', new THREE.ConeGeometry(0.9, 1.8, 7).translate(s * 8, 2.3, D / 2 + 6), '#ffb860');
      K.glow(s * 8, 2.6, D / 2 + 6, 5);
    }
    K.frame();
    const r = rng(41);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + r() * 0.2, d = TEMPLE_HILL.top - 6;
      const cx = TEMPLE_HILL.x + Math.cos(a) * d, cz = TEMPLE_HILL.z + Math.sin(a) * d;
      const cy = gy(cx, cz, TEMPLE_HILL.y);
      K.add('plain', lathe([[0, 0], [1.6, 1], [2, 4], [1.6, 8], [0.8, 11], [0, 13]], 7).translate(cx, cy, cz), '#1f4a38');
    }
  }

  // ======================= Colosseum ruin west of Temple Hill ===================
  begin(COLOSSEUM.x, COLOSSEUM.z, 110);
  {
    const { x, z } = COLOSSEUM, y = PADS_FLAT.coloss.y - 0.3, ry = face(x, z, 0, 0) + 0.6;
    K.frame(x, y, z, ry);
    const A = 62, B = 50, N = low ? 40 : 56, keep = Math.round(N * 0.7), bayH = 12, H = 48;
    const ell = (a, off) => [Math.cos(a) * (A + off), Math.sin(a) * (B + off)];
    for (let i = 0; i < keep; i++) {
      const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
      // the right end breaks down in a stepped ruin profile
      const left = keep - i, top = left > 8 ? H : Math.max(bayH, H * (left / 9) - (i % 2) * 6);
      const tiers = top / bayH;
      for (const [off, flip] of [[0, true], [-5, false]]) {
        const [x0, z0] = ell(a0, off), [x1, z1] = ell(a1, off);
        const yt = off ? Math.min(top, bayH * 3) : top, v1 = off ? Math.min(tiers, 3) / 4 : tiers / 4;
        const g = new THREE.BufferGeometry();
        const pos = flip ? [x0, 0, z0, x1, yt, z1, x1, 0, z1, x0, 0, z0, x0, yt, z0, x1, yt, z1] : [x0, 0, z0, x1, 0, z1, x1, yt, z1, x0, 0, z0, x1, yt, z1, x0, yt, z0];
        const uvs = flip ? [0, 0, 1, v1, 1, 0, 0, 0, 0, v1, 1, v1] : [0, 0, 1, 0, 1, v1, 0, 0, 1, v1, 0, v1];
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        K.add('arcade', g, P.trav);
        // the wall top between the two faces
        const [ix0, iz0] = ell(a0, -5), [ix1, iz1] = ell(a1, -5);
        if (!off) {
          const t = new THREE.BufferGeometry();
          const yi = Math.min(yt, bayH * 3);
          t.setAttribute('position', new THREE.Float32BufferAttribute([x0, yt, z0, ix1, yi, iz1, x1, yt, z1, x0, yt, z0, ix0, yi, iz0, ix1, yi, iz1], 3));
          K.add('plain', t, '#d9c39e');
        }
      }
      const [cx, cz] = ell((a0 + a1) / 2, -2);
      col(cx, cz, 4.2);
    }
    // seating sloping down to the arena
    const seats = new THREE.CylinderGeometry(1, 1, 1, N, 4, true, 0, (keep / N) * Math.PI * 2);
    const p = seats.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const t = p.getY(i) + 0.5, a = Math.atan2(p.getX(i), p.getZ(i));
      const R = 0.6 + 0.4 * t, sx = Math.sin(a), sz = Math.cos(a);
      p.setXYZ(i, sz * (A - 5) * R, t * bayH * 2.6 - 1, sx * (B - 5) * R);
    }
    seats.computeVertexNormals();
    K.add('plain', seats, '#cdb48f');
    // rubble where it broke
    const r = rng(9);
    for (let i = 0; i < 26; i++) {
      const a = ((keep + r() * 6 - 1) / N) * Math.PI * 2, [rx, rz] = ell(a, 4 + r() * 14), s = 1.5 + r() * 3.5;
      K.add('plain', box(s, s * 0.7, s * 1.2, rx, -0.4, rz).rotateY(r() * 3), '#d9c39e');
    }
    for (let i = 0; i < keep; i += 4) { const [lx, lz] = ell(((i + 0.5) / N) * Math.PI * 2, 2); K.glow(lx, 6, lz, 5); }
  }

  // ======================= Lantern River Valley ===================================
  begin(720, -540, 260);
  {
    // the misty keep: 18 m battered stone base, four white tiers with curved roofs
    const { x, z } = MISTY_KEEP, y = MISTY_CRAG.y - 0.3, ry = face(x, z, 0, 0);
    K.frame(x, y, z, ry);
    K.add('plain', lathe([[0, -6], [24, -6], [23, 0], [17, 18], [0, 18]], 4).rotateY(Math.PI / 4), P.stone);
    const tiers = [[14, 9], [11.5, 8], [9, 7], [7, 7]];
    let ty = 18;
    tiers.forEach(([hw, h], i) => {
      K.add('win', wallBox(hw * 2, h, hw * 2, 0, ty, 0, 3.5, h), P.ea);
      K.add('plain', box(hw * 2 + 0.6, 0.6, hw * 2 + 0.6, 0, ty + h - 0.6, 0), P.red);
      ty += h;
      K.add('roof', curvedRoof(hw + 3.5, i === tiers.length - 1 ? 6 : 3.2).translate(0, ty - 0.2, 0), P.eaRoof);
      if (i < 2) K.add('roof', gable(hw * 0.9, 3, 2.5, 0, ty + 0.6, hw + 1.5).rotateY(0), P.eaRoof);   // chidori gable
      if (i === tiers.length - 1) ty += 6;
      else ty += 1.4;
    });
    for (const s of [-1, 1]) K.add('gold', new THREE.ConeGeometry(0.5, 2.8, 5).translate(s * 3.4, ty - 0.6, 0));
    K.glow(0, ty, 0, 12);
    doorway(0, 0, 17.2, 4, 5.5, false, P.grey);
    col(0, 0, 20);
    // the five-tier pagoda beside it
    const [px, pz] = MISTY_KEEP.pagoda;
    K.frame(px, gy(px, pz, MISTY_CRAG.y) - 0.3, pz, ry);
    K.add('plain', box(12, 1.2, 12, 0, 0, 0), P.stone);
    let py = 1.2;
    for (let k = 0; k < 5; k++) {
      const hw = 5 - k * 0.6, h = 5.6;
      K.add('win', wallBox(hw * 2, h, hw * 2, 0, py, 0, 3, h), P.ea);
      for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) K.add('plain', box(0.5, h, 0.5, a * hw, py, b * hw), P.red);
      py += h;
      K.add('roof', curvedRoof(hw + 2.2, 2.4).translate(0, py - 0.3, 0), P.eaRoof);
      K.add('plain', box(hw * 2 + 0.4, 0.4, hw * 2 + 0.4, 0, py - 0.7, 0), P.red);
      py += 1.6;
    }
    K.add('gold', cyl(0.25, 0.35, 6, 6, 0, py, 0));
    for (let k = 0; k < 5; k++) K.add('gold', new THREE.TorusGeometry(0.75 - k * 0.08, 0.12, 4, 10).rotateX(Math.PI / 2).translate(0, py + 1 + k * 0.9, 0));
    K.glow(0, py + 6, 0, 6);
    col(0, 0, 6.5);
    // stone lanterns round the crag top
    K.frame();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2, lx = MISTY_CRAG.x + Math.cos(a) * (MISTY_CRAG.top - 6), lz = MISTY_CRAG.z + Math.sin(a) * (MISTY_CRAG.top - 6);
      const ly = gy(lx, lz, MISTY_CRAG.y);
      K.add('plain', cyl(0.5, 0.7, 1.6, 6, lx, ly, lz), P.grey);
      K.add('glow', box(1.1, 1, 1.1, lx, ly + 1.6, lz), P.warm);
      K.add('plain', new THREE.ConeGeometry(1.2, 0.9, 4).rotateY(Math.PI / 4).translate(lx, ly + 3, lz), P.grey);
      K.glow(lx, ly + 2.1, lz, 3);
    }
    // red torii along the river and at the lantern pond
    const torii = (tx, tz, ry2, s = 1.6) => {
      K.frame(tx, gy(tx, tz), tz, ry2);
      for (const sd of [-1, 1]) K.add('plain', cyl(0.4 * s, 0.5 * s, 6.5 * s, 8, sd * 2.8 * s, -0.5, 0), P.red);
      K.add('plain', box(8.4 * s, 0.5 * s, 0.6 * s, 0, 4.6 * s, 0), P.red);
      const top = new THREE.BoxGeometry(9.6 * s, 0.6 * s, 0.9 * s, 8, 1, 1), tp = top.attributes.position;
      for (let i = 0; i < tp.count; i++) tp.setY(i, tp.getY(i) + Math.pow(tp.getX(i) / (4.8 * s), 2) * 0.6 * s);
      top.computeVertexNormals();
      K.add('plain', top.translate(0, 6.2 * s, 0), '#2a2030');
      K.add('plain', box(9 * s, 0.4 * s, 0.7 * s, 0, 5.6 * s, 0), P.red);
    };
    const LS = LANTERN_LINE.samples;
    for (const f of [0.25, 0.55]) {
      const q = LS[Math.floor(LS.length * f)], q2 = LS[Math.floor(LS.length * f) + 2];
      const a = Math.atan2(q2.x - q.x, q2.z - q.z), off = LANTERN_RIVER.hw + 10;
      torii(q.x + Math.cos(a) * off, q.z - Math.sin(a) * off, a);
    }
    // red arched bridge over the river
    {
      const q = LS[Math.floor(LS.length * 0.7)], q2 = LS[Math.floor(LS.length * 0.7) + 2];
      const a = Math.atan2(q2.x - q.x, q2.z - q.z);
      K.frame(q.x, q.y, q.z, a + Math.PI / 2);
      const L = LANTERN_RIVER.hw + 6;
      const deck = new THREE.BoxGeometry(4, 0.6, L * 2, 1, 1, 16), dp = deck.attributes.position;
      for (let i = 0; i < dp.count; i++) dp.setY(i, dp.getY(i) + 3.5 * Math.cos((dp.getZ(i) / L) * Math.PI / 2));
      deck.computeVertexNormals();
      K.add('plain', deck, P.red);
      for (const sd of [-1, 1]) {
        const rail = new THREE.BoxGeometry(0.25, 0.25, L * 2, 1, 1, 16), rp = rail.attributes.position;
        for (let i = 0; i < rp.count; i++) rp.setY(i, rp.getY(i) + 1.2 + 3.5 * Math.cos((rp.getZ(i) / L) * Math.PI / 2));
        rail.computeVertexNormals();
        K.add('plain', rail.translate(sd * 1.9, 0, 0), P.red);
        for (let k = -2; k <= 2; k++) {
          const zz = (k / 2.5) * L;
          K.add('plain', box(0.3, 1.3, 0.3, sd * 1.9, 3.5 * Math.cos((zz / L) * Math.PI / 2), zz), P.red);
        }
      }
    }
    // the lantern pond at the river's end, with a torii standing in it
    {
      const e = LS[LS.length - 1];
      K.frame();
      torii(e.x + 14, e.z + 4, face(e.x, e.z, 0, 0), 1.3);
      const pr = rng(50);
      K.frame();
      for (let i = 0; i < 28; i++) {
        const a = pr() * Math.PI * 2, d = 6 + pr() * 26, lx = e.x + Math.cos(a) * d, lz = e.z + Math.sin(a) * d;
        K.add('glow', box(0.7, 0.6, 0.7, lx, e.y + 0.1, lz), pr() < 0.5 ? '#ffb070' : '#ff8fb0');
      }
      K.glow(e.x, e.y + 2, e.z, 30);
    }
  }

  // ======================= Star Chapel on the east cliff =========================
  begin(STAR_CHAPEL.x, STAR_CHAPEL.z, 120);
  {
    const { x, z } = STAR_CHAPEL, y = CHAPEL_CLIFF.y - 0.3, ry = face(x, z, 0, 30);
    K.frame(x, y, z, ry);
    const NW = 26, NL = 56, NH = 32, front = 22;
    // nave and aisles
    K.add('lancet', wallBox(NW, NH, NL, 0, 0, front - NL / 2 - 4, 6, NH), P.lav);
    K.add('roof', gable(NW, 16, NL, 0, NH, front - NL / 2 - 4, 0.8), P.slate);
    K.add('lancet', wallBox(NW + 18, 16, NL - 8, 0, 0, front - NL / 2 - 6, 6, 16), P.lav);
    K.add('roof', gable(NW + 18, 5, NL - 8, 0, 15.6, front - NL / 2 - 6, 0.5), P.slate);
    // the gold flèche over the crossing
    K.add('roof', new THREE.ConeGeometry(2.4, 22, 8).translate(0, NH + 16 + 11, front - NL * 0.6), P.slate);
    K.add('gold', new THREE.ConeGeometry(0.6, 6, 6).translate(0, NH + 16 + 25, front - NL * 0.6));
    K.glow(0, NH + 16 + 28, front - NL * 0.6, 7);
    // west front: twin towers with 26 m spires and pinnacles
    for (const s of [-1, 1]) {
      const tx = s * (NW / 2 + 3);
      K.add('lancet', wallBox(10, 62, 10, tx, 0, front - 4, 5, 15.5), P.lav);
      K.add('plain', box(11, 1.2, 11, tx, 62, front - 4), '#ddd6f2');
      K.add('roof', new THREE.ConeGeometry(5.6, 26, 8).rotateY(Math.PI / 8).translate(tx, 63.2 + 13, front - 4), P.slate);
      K.add('gold', new THREE.ConeGeometry(0.35, 3, 6).translate(tx, 63.2 + 27.5, front - 4));
      K.glow(tx, 63.2 + 29, front - 4, 8);
      for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) K.add('roof', new THREE.ConeGeometry(0.8, 6, 6).translate(tx + a * 5, 63.2 + 3, front - 4 + b * 5), P.slate);
      col(tx, front - 4, 7.5);
    }
    // central gable with the 17 m rose window and three deep portals
    K.add('plain', box(NW, 44, 3, 0, 0, front - 1), '#d7cff0');
    K.add('plain', gable(NW, 12, 3, 0, 44, front - 1, 0).rotateY(0), '#d7cff0');
    K.add('gold', new THREE.ConeGeometry(0.6, 5, 6).translate(0, 58.5, front - 1));
    K.add('rose', new THREE.CircleGeometry(8.5, 32).translate(0, 34, front + 0.55));
    K.add('gold', new THREE.TorusGeometry(8.7, 0.45, 6, 32).translate(0, 34, front + 0.6));
    K.glow(0, 34, front + 2, 16);
    doorway(0, 0, front + 0.55, 7, 13, true, '#e6def8');
    for (const s of [-1, 1]) doorway(s * 8.5, 0, front + 0.55, 4, 9, true, '#e6def8');
    // flying buttresses down both sides of the nave
    for (const s of [-1, 1]) for (let k = 0; k < 5; k++) {
      const bz = front - 10 - k * 10.5, px = s * (NW / 2 + 15);
      K.add('plain', box(2.4, 24, 3, px, 0, bz), '#d0c8ec');
      K.add('roof', new THREE.ConeGeometry(1.2, 6, 6).translate(px, 27, bz), P.slate);
      const arm = new THREE.BoxGeometry(1.2, 1.2, 15.5).rotateY(Math.PI / 2).rotateZ(-s * 0.5);
      K.add('plain', arm.translate(s * (NW / 2 + 7.5), 25, bz), '#d0c8ec');
      col(px, bz, 2.2);
    }
    // the castle half: crenellated curtain wall wings and corner turrets
    for (const s of [-1, 1]) {
      const wx = s * (NW / 2 + 28);
      K.add('win', wallBox(16, 13, 30, wx, 0, front - 16, 5, 13), P.lav);
      merlonsRun(wx - 8, front - 1, wx + 8, front - 1, 13, P.lav);
      merlonsRun(wx - 8, front - 31, wx + 8, front - 31, 13, P.lav);
      tower(wx + s * 9, front, 0, 3.6, 20, { wall: P.lav, roof: P.slate, kind: 'gothic', capH: 9, mat: 'lancet', corbel: false });
      col(wx, front - 8, 8); col(wx, front - 22, 8);
    }
    col(0, front - 10, 13); col(0, front - 26, 13); col(0, front - 42, 13);
    // ruined gothic arches nearby
    K.frame(x, y, z, ry);
    for (const [ax, az, h] of [[-46, -30, 18], [-52, -12, 14]]) {
      const sh = archShape(9, h, true), outer = archShape(12, h + 3, true);
      outer.holes.push(new THREE.Path(sh.getPoints(16)));
      K.add('plain', new THREE.ExtrudeGeometry(outer, { depth: 1.6, bevelEnabled: false, curveSegments: 8 }).rotateY(Math.PI / 2).translate(ax, -0.5, az), '#bdb3d8');
    }
  }

  // ======================= Red Canyon: rock arch, bazaar, palace ==================
  begin(650, 740, 220);
  const CS = CANYON_LINE.samples;
  const canyonDir = (x, z) => {
    const q = nearestOnLine(CANYON_LINE, x, z, 200).s, i = CS.indexOf(q), b = CS[Math.min(CS.length - 1, i + 3)], a = CS[Math.max(0, i - 3)];
    return { q, a: Math.atan2(b.x - a.x, b.z - a.z) };
  };
  {
    const { x, z } = CANYON_ARCH, { q, a } = canyonDir(x, z), y = q.y;
    K.frame(x, y, z, a + Math.PI / 2);
    // the 82 m natural arch across the canyon
    const W = CANYON.hw + 18;
    const curve = new THREE.CatmullRomCurve3([[-W - 6, -8], [-W, 20], [-W * 0.78, 52], [-W * 0.4, 76], [0, 82], [W * 0.4, 76], [W * 0.78, 52], [W, 20], [W + 6, -8]].map(([u, v]) => new THREE.Vector3(0, v, u)));
    const arch = rockArch(curve, 11, low ? 40 : 56, low ? 8 : 10, 7);
    K.add('plain', arch, P.redRock);
    // bazaar shops along both sides of the canyon floor, with awnings, under the arch
    const awn = ['#e04f6a', '#ffb84a', '#8a5cff', '#2fbfa8', '#ff7fb0', '#f2e06a'];
    K.frame(x, y, z, a);
    let n = 0;
    for (const s of [-1, 1]) for (let k = -5; k <= 5; k++) {
      const sx = s * (CANYON.hw * 0.62), sz = k * 9, h = 7 + ((k + 7) % 3) * 2.5;
      K.add('win', wallBox(8, h, 8, sx, -0.3, sz, 4, h), P.sand);
      for (let m = 0; m < 4; m++) K.add('plain', box(1.2, 1.2, 1.2, sx + (m - 1.5) * 2, h - 0.3, sz + s * 3.6), '#d4a874');
      const aw = new THREE.PlaneGeometry(3.4, 7.4).rotateX(-Math.PI / 2).rotateZ(s * 0.4).translate(sx - s * 5.6, 4.2, sz);
      K.add('cloth', aw, awn[n++ % awn.length]);
      if (k % 3 === 0) K.add('gold', cap('onion', 2.2, 4, 10).translate(sx, h - 0.3, sz));
      col(sx, sz, 5.4);
    }
    // cloths and lantern strings hung across the canyon
    for (let k = -2; k <= 2; k++) {
      const sz = k * 18 + 4, span = CANYON.hw * 1.24, hy = 12 + (k % 2) * 3;
      for (let i = 0; i <= 16; i++) {
        const t = i / 16, u = -span / 2 + t * span, v = hy - Math.sin(t * Math.PI) * 3.5;
        K.add('glow', new THREE.OctahedronGeometry(0.35, 0).translate(u, v, sz), i % 2 ? '#ffcf6a' : '#ff8fc8');
      }
      K.glow(0, hy - 3, sz, 12);
      const cloth = new THREE.PlaneGeometry(span, 2.2, 12, 1), cp = cloth.attributes.position;
      for (let i = 0; i < cp.count; i++) { const t = (cp.getX(i) + span / 2) / span; cp.setY(i, cp.getY(i) - Math.sin(t * Math.PI) * 5); }
      cloth.computeVertexNormals();
      K.add('cloth', cloth.translate(0, hy + 6, sz + 5), awn[(k + 6) % awn.length]);
    }
    // a thin sky-arch bridge high across the canyon mouth
    {
      const { q: q2, a: a2 } = canyonDir(CANYON_ARCH.x - 60, CANYON_ARCH.z - 85);
      K.frame(q2.x, 0, q2.z, a2 + Math.PI / 2);
      const W2 = CANYON.hw + 30;
      const c2 = new THREE.CatmullRomCurve3([[-W2, 84], [-W2 * 0.5, 104], [0, 110], [W2 * 0.5, 104], [W2, 84]].map(([u, v]) => new THREE.Vector3(0, v, u)));
      K.add('plain', rockArch(c2, 3.2, 28, 7, 3), '#c46a4c');
    }
  }
  {
    // the canyon palace: walled compound, gold onion dome, twin minarets
    const { x, z } = CANYON_PALACE, { q, a } = canyonDir(x, z), y = PADS_FLAT.palace.y - 0.3;
    K.frame(x, y, z, a + Math.PI);
    const Wc = 54;
    for (const [wx, wz, w, d] of [[0, Wc / 2, Wc, 2.4], [0, -Wc / 2, Wc, 2.4], [Wc / 2, 0, 2.4, Wc], [-Wc / 2, 0, 2.4, Wc]]) {
      if (wz > 0) {
        for (const s of [-1, 1]) K.add('win', wallBox(Wc / 2 - 5, 11, d, s * (Wc / 4 + 2.5), 0, wz, 5, 11), P.sand);
        K.add('plain', box(10, 4, d, 0, 9.5, wz), P.sand);
      } else K.add('win', wallBox(w, 11, d, wx, 0, wz, 5, 11), P.sand);
    }
    for (const s of [-1, 1]) {
      merlonsRun(-Wc / 2, s * Wc / 2, Wc / 2, s * Wc / 2, 11, P.sand, 2);
      merlonsRun(s * Wc / 2, -Wc / 2, s * Wc / 2, Wc / 2, 11, P.sand, 2);
      for (const t of [-1, 1]) {
        K.add('win', body(4, 16, 10, s * Wc / 2, 0, t * Wc / 2, 4, 8), P.sand);
        K.add('gold', cap('onion', 4.4, 6, 10).translate(s * Wc / 2, 16, t * Wc / 2));
        col(s * Wc / 2, t * Wc / 2, 4.4);
      }
      for (let k = -2; k <= 2; k++) col(s * Wc / 2, k * 10, 2);
      for (const k of [-2, -1, 1, 2]) col(k * 10, -s * Wc / 2, 2);
    }
    // horseshoe gate
    K.add('glow', new THREE.ShapeGeometry(archShape(6, 9, false), 10).translate(0, 0, Wc / 2 + 1.3), P.warm);
    K.add('gold', new THREE.TorusGeometry(3.4, 0.3, 4, 16, Math.PI * 1.3).rotateZ(-0.15 * Math.PI).translate(0, 6, Wc / 2 + 1.4));
    // the palace block, drum and 16 m gold onion dome
    K.add('win', wallBox(26, 22, 22, 0, 0, -4, 5, 11), P.sand);
    K.add('plain', box(27, 1, 23, 0, 22, -4), '#d4a874');
    K.add('win', body(8.6, 7, S, 0, 23, -4, 4, 7), P.sand);
    K.add('gold', cap('onion', 9.4, 18, S).translate(0, 30, -4));
    K.add('gold', new THREE.ConeGeometry(0.5, 5, 6).translate(0, 50.5, -4));
    K.glow(0, 52, -4, 10);
    doorway(0, 0, 7.05, 5, 8, false, '#f0d7a8');
    col(0, -4, 14);
    // twin 48 m minarets with balconies
    for (const s of [-1, 1]) {
      const mx = s * 18, mz = 12;
      K.add('win', body(2.2, 42, 10, mx, 0, mz, 3, 8, 2.6), P.sand);
      for (const by of [18, 32]) { K.add('plain', cyl(3.4, 2.4, 1.2, 10, mx, by, mz), '#d4a874'); K.add('glow', cyl(3.3, 3.3, 0.2, 10, mx, by + 1.2, mz), '#ffcf8a'); }
      K.add('gold', cap('onion', 2.6, 6, 10).translate(mx, 42, mz));
      K.glow(mx, 48.5, mz, 6);
      col(mx, mz, 2.6);
    }
    // hanging gardens on the canyon walls beside the palace
    K.frame();
    const gr = rng(12);
    for (let i = 0; i < 24; i++) {
      const s = i % 2 ? 1 : -1, t = 0.6 + gr() * 0.35, si = Math.floor(CS.length * t), c = CS[si], c2 = CS[Math.min(CS.length - 1, si + 2)];
      const ang = Math.atan2(c2.x - c.x, c2.z - c.z), nx = Math.cos(ang), nz = -Math.sin(ang), d = CANYON.hw + 6 + gr() * 6;
      const hx = c.x + nx * d * s, hz = c.z + nz * d * s, hy = gy(hx, hz);
      K.add('plain', new THREE.IcosahedronGeometry(3 + gr() * 3, 0).scale(1, 0.5, 1).translate(hx, hy, hz), '#3f7a52');
      if (gr() < 0.5) K.add('glow', new THREE.OctahedronGeometry(0.6, 0).translate(hx, hy + 1.5, hz), P.pink);
    }
  }

  // ======================= Jungle stepped temple =================================
  begin(JUNGLE.x, JUNGLE.z, 140);
  {
    const { x, z } = JUNGLE, y = PADS_FLAT.jungle.y - 0.3, ry = face(x, z, 0, 0);
    K.frame(x, y, z, ry);
    const steps = [[22, 7], [17.5, 6.5], [13, 6], [9, 5.5]];
    let ty = 0;
    for (const [hw, h] of steps) {
      K.add('win', wallBox(hw * 2, h, hw * 2, 0, ty, 0, 4, h), P.moss);
      K.add('gold', box(hw * 2 + 0.3, 0.5, hw * 2 + 0.3, 0, ty + h - 1.2, 0));
      K.add('plain', box(hw * 2 + 0.8, 0.6, hw * 2 + 0.8, 0, ty + h, 0), P.mossDark);
      ty += h + 0.6;
    }
    // central stair up the front
    for (let k = 0; k < 26; k++) K.add('plain', box(6, 1, 1.0, 0, k * 0.97, 22 - k * 0.5), '#b7c2a8');
    // sanctuary with a glowing doorway and a broken roof comb
    K.add('win', wallBox(11, 8, 9, 0, ty, -1, 5.5, 8), P.moss);
    K.add('plain', box(12, 1.2, 10, 0, ty + 8, -1), P.mossDark);
    doorway(0, ty, 3.55, 3, 5, false, '#a8b49a');
    for (const [bx, bw, bh] of [[-3, 2.2, 7], [0.2, 2.6, 9.5], [3.4, 1.8, 5]]) K.add('plain', box(bw, bh, 1.5, bx, ty + 9.2, -2), P.moss);
    K.glow(0, ty + 2, 4, 8);
    col(0, 0, 22);
    // waterfalls pouring off both sides into pools
    const fallMat = waterMaterial(0, true), poolMat = waterMaterial(0.3);
    for (const s of [-1, 1]) {
      const fx = s * 22.4;
      const fall = new THREE.PlaneGeometry(5, 18, 1, 1).rotateY(s * Math.PI / 2).translate(fx, 9, 6);
      const m = new THREE.Mesh(fall.applyMatrix4(K.m), fallMat);
      group.add(m);
      const pool = new THREE.Mesh(new THREE.CircleGeometry(7, 20).rotateX(-Math.PI / 2).translate(fx + s * 5, 0.5, 6).applyMatrix4(K.m), poolMat);
      group.add(pool);
      K.add('plain', new THREE.TorusGeometry(7.2, 0.8, 4, 20).rotateX(Math.PI / 2).translate(fx + s * 5, 0.4, 6), '#7e8f75');
      anim.push((t) => { fallMat.uniforms.uTime.value = t; poolMat.uniforms.uTime.value = t; });
    }
    // ruined lintel gateway, broken pillars and pink-blooming vines
    K.add('plain', box(2.2, 11, 2.2, -7, 0, 40), P.moss); K.add('plain', box(2.2, 9, 2.2, 7, 0, 40), P.moss);
    K.add('plain', box(16, 2, 2.6, 0, 10, 40).rotateZ(0.05), P.mossDark);
    const r = rng(17);
    for (let i = 0; i < 8; i++) { const a = r() * Math.PI * 2, d = 30 + r() * 20; K.add('plain', cyl(1, 1.1, 3 + r() * 7, 8, Math.cos(a) * d, -0.4, Math.sin(a) * d), P.moss); }
    for (let i = 0; i < 40; i++) {
      const sd = r() < 0.5 ? -1 : 1, hw = steps[Math.floor(r() * 3)][0];
      K.add('glow', new THREE.OctahedronGeometry(0.35, 0).translate(sd * (hw + 0.3), 1 + r() * 18, (r() - 0.5) * hw * 1.8), P.pink);
    }
    // jungle trees round the clearing
    K.frame();
    for (let i = 0; i < (low ? 14 : 22); i++) {
      const a = (i / 22) * Math.PI * 2 + r() * 0.3, d = 64 + r() * 40, tx = x + Math.cos(a) * d, tz = z + Math.sin(a) * d;
      broadTree(tx, tz, gy(tx, tz) - 0.5, 26 + r() * 16, i % 3 ? '#2f6a4a' : '#3d7a3a');
    }
  }

  // ======================= Ruin Meadows ==========================================
  begin(-920, 260, 260);
  {
    // ruined triumphal arches
    for (const [ax, az, ry] of RUIN_SITES.arches) {
      K.frame(ax, gy(ax, az) - 0.4, az, ry);
      const sh = new THREE.Shape([[-12, 0], [12, 0], [12, 14], [9, 15], [8, 19.5], [4, 20], [3, 22], [-6, 22], [-7, 21], [-12, 21]].map(([u, v]) => new THREE.Vector2(u, v)));
      sh.holes.push(new THREE.Path(archShape(8, 13, false).getPoints(16)));
      for (const s of [-1, 1]) sh.holes.push(new THREE.Path(archShape(3, 6, false).getPoints(10).map((p) => new THREE.Vector2(p.x + s * 8.3, p.y))));
      K.add('plain', new THREE.ExtrudeGeometry(sh, { depth: 5, bevelEnabled: false, curveSegments: 8 }).translate(0, 0, -2.5), P.trav);
      K.add('plain', box(24.6, 0.9, 5.6, 0, 15, 0), '#d9c39e');
      for (const s of [-1, 1]) { col(s * 10, 0, 3); col(s * 6, 0, 2.5); }
    }
    // standing-stone circle with a glowing heart
    {
      const [sx, sz] = RUIN_SITES.stones, y = gy(sx, sz);
      K.frame(sx, y, sz, 0);
      const r = rng(31);
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2, R = 16;
        const st = box(2.4, 6 + r() * 2.5, 1.3, 0, -0.6, 0).rotateZ((r() - 0.5) * 0.15).rotateY(-a + Math.PI / 2);
        K.add('plain', st.translate(Math.cos(a) * R, 0, Math.sin(a) * R), '#a8a0a8');
        if (i % 2 === 0 && i < 10) K.add('plain', box(2.4, 1.1, 7.6, 0, 7, 0).rotateY(-a - Math.PI / 14 + Math.PI).translate(Math.cos(a + Math.PI / 14) * R, 0, Math.sin(a + Math.PI / 14) * R), '#9a929c');
        col(Math.cos(a) * R, Math.sin(a) * R, 1.4);
      }
      K.add('glow', new THREE.OctahedronGeometry(1.2, 0).scale(1, 1.8, 1).translate(0, 3, 0), '#ffe28a');
      K.glow(0, 3, 0, 14);
    }
    // the natural valley gateway arch
    {
      const [gx, gz] = RUIN_SITES.gateway, y = gy(gx, gz);
      K.frame(gx, y, gz, 0.4);
      const c = new THREE.CatmullRomCurve3([[-24, -6], [-22, 18], [-12, 40], [0, 46], [12, 40], [22, 18], [24, -6]].map(([u, v]) => new THREE.Vector3(u, v, 0)));
      K.add('plain', rockArch(c, 6, 36, 8, 5), '#b49a7a');
    }
    // ruined gothic arch
    {
      const [gx, gz] = RUIN_SITES.gothic, y = gy(gx, gz);
      K.frame(gx, y - 0.4, gz, -0.3);
      const outer = new THREE.Shape([[-9, 0], [9, 0], [9, 18], [6, 26], [2, 31], [-1, 28], [-6, 24], [-9, 17]].map(([u, v]) => new THREE.Vector2(u, v)));
      outer.holes.push(new THREE.Path(archShape(10, 22, true).getPoints(16)));
      K.add('plain', new THREE.ExtrudeGeometry(outer, { depth: 2.4, bevelEnabled: false, curveSegments: 8 }), '#bdb3c8');
      for (const s of [-1, 1]) col(s * 7.5, 1.2, 2);
    }
    // a golden grove
    K.frame();
    const r = rng(23);
    for (let i = 0; i < (low ? 12 : 20); i++) {
      const tx = -940 + r() * 120, tz = 20 + r() * 420;
      broadTree(tx, tz, gy(tx, tz) - 0.4, 14 + r() * 8, i % 2 ? '#e8b84a' : '#f2cf6a');
    }
  }

  // ======================= Frost Fjord ===========================================
  begin(-830, -820, 260);
  {
    // the frozen inlet: one ice sheet with floes
    const ice = ribbonAlong(FJORD_LINE.samples, FJORD.hw * 0.86, () => 0.3, 2);
    K.frame();
    K.add('plain', ice, P.ice);
    const r = rng(61);
    for (let i = 0; i < 26; i++) {
      const q = FJORD_LINE.samples[Math.floor(r() * FJORD_LINE.samples.length)], a = r() * 6.28, d = r() * FJORD.hw * 0.7;
      K.add('plain', new THREE.CylinderGeometry(2 + r() * 4, 2.4 + r() * 4, 0.6, 6).translate(q.x + Math.cos(a) * d, 0.3, q.z + Math.sin(a) * d), '#e6f6fc');
    }
    // the longhouse: log walls, steep snowy roof, crossed bargeboards with carved scrolls
    const { x, z } = LONGHOUSE, y = PADS_FLAT.fjord.y - 0.3, ry = face(x, z, FJORD.pts[0][0], FJORD.pts[0][1]);
    K.frame(x, y, z, ry);
    const W = 13, L = 30;
    K.add('timber', wallBox(W, 4.6, L, 0, 0, 0, 3.2, 4.6), '#8a6248');
    K.add('roof', gable(W + 2, 12, L + 2, 0, 4.2, 0, 1.2).rotateY(0), '#4a3428');
    K.add('plain', gable(W + 3.4, 1.6, L + 2.6, 0, 4.0, 0, 1.6), P.snow);              // snow along the eaves
    K.add('plain', gable(W - 1, 4, 3, 0, 4.6, L / 2 - 0.5, 0), '#6a4a38');            // gable end boards
    for (const s of [-1, 1]) {
      const b = new THREE.BoxGeometry(0.5, 16, 0.5).rotateZ(s * 0.59).translate(s * 3, 10.9, L / 2 + 1.4);
      K.add('plain', b, '#3a2618');
      K.add('gold', new THREE.TorusGeometry(1.1, 0.25, 5, 12, Math.PI * 1.5).rotateZ(s > 0 ? 0 : Math.PI / 2).translate(-s * 2.4, 18.4, L / 2 + 1.4));
    }
    K.add('glow', new THREE.ShapeGeometry(archShape(2.6, 3.4, false), 6).translate(0, 0, L / 2 + 0.06), P.warm);
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) K.add('gold', new THREE.SphereGeometry(0.16, 6, 4).translate(s * 1.8, 0.6 + k * 0.8, L / 2 + 0.2));
    K.add('gold', new THREE.CylinderGeometry(1.1, 1.1, 0.25, 16).rotateX(Math.PI / 2).translate(0, 6.5, L / 2 + 0.6));
    K.add('plain', new THREE.CylinderGeometry(0.75, 0.75, 0.3, 16).rotateX(Math.PI / 2).translate(0, 6.5, L / 2 + 0.7), '#3a5ab8');
    for (const s of [-1, 1]) lantern(s * 4, L / 2 + 2, 0);
    for (let k = -1; k <= 1; k++) col(0, k * 10, 7);
    // the rune monolith and its beam into the aurora
    const [mx, mz] = LONGHOUSE.monolith;
    K.frame(mx, gy(mx, mz) - 0.6, mz, 0.3);
    K.add('plain', new THREE.CylinderGeometry(1.6, 3.2, 19, 5).rotateZ(0.08).translate(0, 9.5, 0), '#b9b4e2');
    for (let k = 0; k < 6; k++) K.add('glow', box(0.9, 0.5, 0.2, 0.2 + k * 0.08, 3 + k * 2.4, 2.75 - k * 0.12), P.cyan);
    K.glow(0, 19, 0, 14);
    col(0, 0, 3.2);
    fjordBeam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 600, 10, 1, true).translate(0, 319, 0).applyMatrix4(K.m));
    // a longship with a carved scroll prow, frozen into the ice
    const q = FJORD_LINE.samples[Math.floor(FJORD_LINE.samples.length * 0.3)];
    K.frame(q.x + 14, 0.2, q.z - 8, 0.8);
    K.add('plain', lathe([[0, -1.4], [2.6, -0.4], [3, 1], [0, 1]], 8).scale(1, 1, 4.2), '#5a3a2c');
    K.add('gold', new THREE.TorusGeometry(1.4, 0.3, 5, 12, Math.PI * 1.6).rotateY(Math.PI / 2).translate(0, 3, 12.6));
    K.add('cloth', new THREE.PlaneGeometry(6, 5).translate(0, 5.5, 0), '#e04f6a');
    K.add('plain', cyl(0.2, 0.2, 9, 5, 0, 0.5, 0), P.timber);
    // snow pines round the shore
    K.frame();
    for (let i = 0; i < (low ? 26 : 44); i++) {
      const s = FJORD_LINE.samples[Math.floor(r() * FJORD_LINE.samples.length * 0.75)], a = r() * 6.28, d = FJORD.hw + 10 + r() * 70;
      const tx = s.x + Math.cos(a) * d, tz = s.z + Math.sin(a) * d;
      if (nearestOnLine(FJORD_LINE, tx, tz, FJORD.hw + 6)) continue;
      if (Math.hypot(tx - x, tz - z) < 22 || Math.hypot(tx - mx, tz - mz) < 8) continue;
      conifer(tx, tz, gy(tx, tz) - 0.5, 12 + r() * 10, true);
    }
  }

  // ======================= Lagoon City block (sheet panel 7) =======================
  begin(LAGOON.x + 20, LAGOON.z + 40, 140);
  {
    // Atlantis stepped white blocks with gold cornices and roof gardens, in the town square
    const bx = LAGOON.x, bz = LAGOON.z, by = gy(bx, bz) - 0.3;
    K.frame(bx, by, bz, face(bx, bz, -650, 790));
    const tiers = [[11, 15], [8, 9], [5.5, 8]];
    let ty = 0;
    tiers.forEach(([hw, h], i) => {
      K.add('win', wallBox(hw * 2, h, hw * 2, 0, ty, 0, 4, 5), P.marble);
      ty += h;
      K.add('gold', box(hw * 2 + 0.6, 0.6, hw * 2 + 0.6, 0, ty - 0.6, 0));
      K.add('plain', box(hw * 2 - 1, 0.5, hw * 2 - 1, 0, ty, 0), '#4f9a4a');
      if (i < 2) for (const s2 of [-1, 1]) K.add('plain', lathe([[0, 0], [0.9, 0.5], [1.1, 2.5], [0.6, 4.5], [0, 5.5]], 6).translate(s2 * (hw - 1.4), ty, hw - 1.4), '#1f4a38');
    });
    K.add('gold', cap('onion', 3.2, 6, 12).translate(0, ty + 0.3, 0));
    K.glow(0, ty + 7, 0, 6);
    doorway(0, 0, 11.05, 4, 6, false, '#fbf3f6');
    col(0, 0, 15);
    // three veiled gold statues on the first tier, no faces
    for (const s2 of [-1, 0, 1]) {
      K.add('gold', lathe([[0, 0], [0.8, 0], [0.6, 1.8], [0.45, 2.6], [0.3, 3.0], [0.38, 3.3], [0, 3.8]], 8).translate(s2 * 5, 15.5, 9.6));
    }
    // the rose-brick campanile with a lit belfry and green-copper spire, 60 m
    const [cx, cz] = [-679, 652], cy = gy(cx, cz) - 0.3;
    K.frame(cx, cy, cz, face(cx, cz, -650, 790));
    K.add('win', wallBox(7, 40, 7, 0, 0, 0, 3.5, 10), '#c96a6a');
    K.add('plain', box(7.8, 1, 7.8, 0, 40, 0), P.marble);
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) K.add('plain', box(1.2, 7, 1.2, a * 3.1, 41, b * 3.1), P.marble);
    K.add('glow', box(5.2, 6, 5.2, 0, 41, 0), '#ffd49a');
    K.add('plain', box(7.8, 1.2, 7.8, 0, 48, 0), P.marble);
    K.add('win', wallBox(5.6, 3, 5.6, 0, 49.2, 0, 2.8, 3), '#c96a6a');
    K.add('plain', new THREE.ConeGeometry(4.3, 9, 4).rotateY(Math.PI / 4).translate(0, 52.2 + 4.5, 0), '#4fb39a');
    K.add('gold', new THREE.OctahedronGeometry(0.8, 0).scale(1, 1.6, 1).translate(0, 62.3, 0));
    K.glow(0, 44, 0, 10); K.glow(0, 62.5, 0, 5);
    col(0, 0, 5);
    // the Mughal pavilion with a teal onion dome and teal chhatris, on the quay
    const [mx, mz] = [-648, 646], my = gy(mx, mz) - 0.3;
    K.frame(mx, my, mz, face(mx, mz, -560, 760));
    K.add('plain', box(20, 1.2, 16, 0, -0.6, 0), P.marble);
    K.add('win', wallBox(14, 10, 12, 0, 0.6, 0, 4.6, 10), P.marble);
    K.add('plain', box(15, 0.8, 13, 0, 10.6, 0), P.marble);
    K.add('win', body(4.6, 3, S, 0, 11.4, 0, 3, 3), P.marble);
    K.add('plain', cap('onion', 5.4, 10, S).translate(0, 14.4, 0), '#3fa6a0');
    K.add('gold', new THREE.ConeGeometry(0.35, 3, 6).translate(0, 25.6, 0));
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      for (const [u, v] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) K.add('plain', cyl(0.2, 0.2, 3, 5, a * 6 + u, 11.4, b * 5 + v), P.marble);
      K.add('plain', cap('onion', 1.6, 2.8, 10).translate(a * 6, 14.4, b * 5), '#3fa6a0');
    }
    doorway(0, 0.6, 6.05, 4.5, 7.5, false, '#fbf3f6');
    K.glow(0, 4, 7, 7);
    col(0, 0, 8.5);
    // mooring poles along the quay
    for (let k = -3; k <= 3; k++) { K.add('plain', cyl(0.18, 0.18, 4, 5, k * 3, -1.5, 10), k % 2 ? '#3a5ab8' : P.marble); K.add('gold', new THREE.SphereGeometry(0.3, 6, 4).translate(k * 3, 2.6, 10)); }
  }

  // ======================= Pillar Reach: pavilion and Stargazer Observatory ===========
  begin(800, 100, 200);
  if (pillars.length > 5) {
    // the 21 m brass drum with a 16 m glass dome, gold ribs and a telescope
    const q = pillars[2], y = q.top + 1;
    K.frame(q.x, y, q.z, face(q.x, q.z, 0, 0));
    K.add('gold', cyl(9.5, 10.5, 2, S, 0, -1, 0));
    K.add('win', body(8.4, 11, S, 0, 1, 0, 3.4, 5.5), '#c99a52');
    K.add('gold', cyl(9, 9, 1, S, 0, 12, 0));
    const dome = new THREE.SphereGeometry(8, S + 4, 10, 0, Math.PI * 2, 0, Math.PI / 2).translate(0, 13, 0);
    K.add('glow', dome, '#a9d4ff');
    for (let k = 0; k < 8; k++) K.add('gold', new THREE.TorusGeometry(8.1, 0.22, 4, 20, Math.PI / 2).rotateY((k / 8) * Math.PI * 2).rotateX(0).translate(0, 13, 0).rotateY(0));
    K.add('gold', cyl(0.9, 1.3, 14, 10, 0, 0, 0).rotateZ(-0.7).translate(3, 15, 0));
    K.glow(0, 20, 0, 18);
    // a red-post pavilion with a sweeping rose roof and lanterns on another top
    const q2 = pillars[5], y2 = q2.top + 1;
    K.frame(q2.x, y2, q2.z, face(q2.x, q2.z, 0, 0));
    K.add('plain', box(14, 1, 11, 0, -0.5, 0), '#c9a87a');
    for (const a of [-1, 1]) for (const b of [-1, 0, 1]) K.add('plain', cyl(0.35, 0.35, 6, 8, a * 5.6, 0.5, b * 4), P.red);
    K.add('roof', curvedRoof(7.4, 5).scale(1, 1, 0.8).translate(0, 6.3, 0), '#d0577e');
    for (const a of [-1, 1]) for (const b of [-1, 1]) { K.add('glow', new THREE.SphereGeometry(0.5, 8, 6).translate(a * 7.5, 5, b * 5.6), '#ff9a6a'); K.glow(a * 7.5, 5, b * 5.6, 4); }
  }

  // ======================= rivers and pools ======================================
  const riverMat = waterMaterial(0.8), stillMat = waterMaterial(0.15);
  for (const [L, R] of [[STORY_LINE, STORY_RIVER], [LANTERN_LINE, LANTERN_RIVER]]) {
    group.add(new THREE.Mesh(ribbonAlong(L.samples, R.hw + 6, (s) => s.y - 0.4, 1), riverMat));
    const e = L.samples[L.samples.length - 1];
    group.add(new THREE.Mesh(new THREE.CircleGeometry(36, 28).rotateX(-Math.PI / 2).translate(e.x, e.y - 0.6, e.z), stillMat));
  }
  {
    // the canyon river runs from the palace fountain down to the lake
    const start = CS.findIndex((s) => Math.hypot(s.x - CANYON_PALACE.x, s.z - CANYON_PALACE.z) < 70);
    const run = CS.slice(0, start).reverse();
    group.add(new THREE.Mesh(ribbonAlong(run, 7, (s) => Math.max(s.y, 0) + 0.25, 1), riverMat));
  }
  anim.push((t) => { riverMat.uniforms.uTime.value = t; stillMat.uniforms.uTime.value = t; });

  // ======================= build ==================================================
  const mats = kitMaterials();
  for (const sec of sections) {
    sec.group = new THREE.Group();
    sec.kit.build(mats, sec.group, 'district');
    group.add(sec.group);
  }
  // windmill sails share the plain and cloth materials
  for (const c of group.children) if (c.isGroup && c.userData.kit) {
    const sk = c.userData.kit; c.clear(); sk.build({ arm: mats.plain, sail: mats.cloth }, c);
  }
  fjordBeam.material = mats.beam; group.add(fjordBeam);
  const halos = haloPoints(sections.flatMap((sec) => sec.kit.glows));
  group.add(halos);
  scene.add(group);

  return {
    group,
    update(t, camera) {
      mats.update();
      // far areas are lost in the haze; skip drawing them
      if (camera) for (const sec of sections) sec.group.visible = Math.hypot(camera.position.x - sec.x, camera.position.z - sec.z) < far + sec.R;
      halos.material.uniforms.uTime.value = t;
      mats.beam.opacity = (0.18 + 0.22 * MOOD.night.value) * (0.85 + 0.15 * Math.sin(t * 1.7));
      for (const f of anim) f(t);
    },
  };
}
