// Carved architecture on the Birthday Castle, in real relief rather than paint:
// round archivolts, colonnettes and keystones framing every arch of the three
// arcaded levels; pointed hood moulds, colonnettes and finials round the tall
// lancets of the front wall; a corbel table of little arches under its cornice;
// a gothic portal of stepped archivolts round the great gate with a rose window
// and crocketed gable above; and on the grand stair, carved balustrades, urns,
// veiled statues (no faces) and lanterns on every landing.
import * as THREE from 'three';
import { Kit, kitMaterials, box, cyl, lathe, haloPoints } from './kit.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { pointedArchPath, pointedArchShape, archFrameGeometry, greatGlass, CROWN } from './castle.js';
import { CASTLE, TERRACES, TERRACE_REAR, TERRACE_R, STAIR, stairHW } from './layout.js';

const WHITE = '#fbeef4', MARBLE = '#f8e6ee', ROSE = '#e7a9c0', DEEP = '#c9789c', PLUM = '#7a2a5e';
const GX = CASTLE.x, GZ = CASTLE.z, SILL = CASTLE.y, BASE = CASTLE.base;

// the same rounded outline castle.js draws each level along
function stadium(T, off, n = 10) {
  const hw = T.hw + off, fr = T.front + off, R = TERRACE_R + off, rear = TERRACE_REAR;
  const pts = [[-hw, rear], [-hw, fr - R]];
  for (let i = 1; i < n; i++) { const a = Math.PI - (i / n) * (Math.PI / 2); pts.push([-(hw - R) + Math.cos(a) * R, fr - R + Math.sin(a) * R]); }
  pts.push([-(hw - R), fr], [hw - R, fr]);
  for (let i = 1; i < n; i++) { const a = Math.PI / 2 - (i / n) * (Math.PI / 2); pts.push([(hw - R) + Math.cos(a) * R, fr - R + Math.sin(a) * R]); }
  pts.push([hw, fr - R], [hw, rear]);
  return pts;
}
// point, outward normal at arc length s along a polyline
function along(pts, s) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[i + 1], l = Math.hypot(bx - ax, bz - az);
    if (s <= l || i === pts.length - 2) {
      const t = Math.min(1, s / l), dx = (bx - ax) / l, dz = (bz - az) / l;
      return { x: ax + (bx - ax) * t, z: az + (bz - az) * t, ox: -dz, oz: dx };
    }
    s -= l;
  }
}
const length = (pts) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const halfRing = (R, tube, radial, tubular) => new THREE.TorusGeometry(R, tube, radial, tubular, Math.PI);

export function createCastleArch(scene, preset, castle) {
  const low = preset.grass < 4000;
  const K = new Kit(), group = new THREE.Group();
  const RS = low ? 3 : 5, TS = low ? 8 : 14;              // radial and tubular segments for mouldings

  // --- the three arcaded levels: archivolts, colonnettes, keystones, a cornice of dentils ------
  let below = BASE - 2;
  TERRACES.forEach((T) => {
    const H = T.y - below, pts = stadium(T, 0), L = length(pts);
    const spring = below + H * 0.64, rad = 2.75, foot = below + H * 0.08;
    for (let n = 0; n < Math.floor(L / 9); n++) {
      const p = along(pts, n * 9 + 4.5);
      if (p.z < -30) continue;                                                           // hidden behind the crag
      if (low && p.oz < 0.5) continue;                                                   // laptops: only the arches facing the approach
      if (p.z > T.front - 2 && Math.abs(p.x) < stairHW(T.front) + 3) continue;           // the stair covers it
      K.frame(p.x + p.ox * 0.15, 0, p.z + p.oz * 0.15, Math.atan2(p.ox, p.oz));
      K.add('plain', halfRing(rad, 0.42, RS, TS).translate(0, spring, 0.2), WHITE);       // archivolt
      if (!low) K.add('gold', halfRing(rad + 0.55, 0.14, 3, TS).translate(0, spring, 0.25));   // gilded outer bead
      K.add('plain', box(0.9, 1.5, 0.7, 0, spring + rad - 0.3, 0.35), MARBLE);            // keystone
      for (const s of [-1, 1]) {
        K.add('plain', low ? box(0.7, spring - foot, 0.7, s * rad, foot, 0.35) : cyl(0.36, 0.36, spring - foot, 8, s * rad, foot, 0.35), WHITE);   // colonnette
        K.add('gold', box(1.1, 0.6, 1.1, s * rad, spring - 0.6, 0.35));                            // capital
        K.add('plain', box(1.1, 0.8, 1.1, s * rad, foot - 0.8, 0.35), MARBLE);                     // base
        if (!low) K.add('plain', new THREE.CircleGeometry(0.7, 12).translate(s * 4.5, spring + rad + 1.4, 0.18), DEEP);   // spandrel roundel
      }
    }
    // a frieze of dentils under each white cornice, along the front
    const front = pts.filter(([, z]) => z > T.front - 1);
    const x0 = front[0][0], x1 = front[front.length - 1][0];
    K.frame(0, 0, T.front + 0.6);
    for (let x = x0; x <= x1; x += low ? 2.4 : 1.6) K.add('plain', box(0.7, 0.9, 0.6, x, T.y - 3.3, 0), WHITE);
    below = T.y;
  });

  // --- great windows (castle v4): 42 x 75 m in the front wall, 80 m on the dome and cone towers ----
  // Each is flowing multicolour glass in a deep rose-gold reveal, two lancet lights under an
  // eight-foil rose, seven gilded transoms, stepped white and rose orders and a gold hood mould.
  const WALL_TOP = SILL + CROWN.wallH;
  const glassMat = new THREE.MeshBasicMaterial({ map: greatGlass(), toneMapped: false });
  const panes = [];
  function greatWindow(W, WH, gablet) {
    const parts = [], add = (k, g, c) => parts.push([k, g.index ? g.toNonIndexed() : g, c]);
    const hs = WH - W * 0.866;
    add('plain', archFrameGeometry(W, WH, 0.9, 3.2).translate(0, 0, -1.3), '#d9a07a');          // the deep rose-gold reveal
    [[0, 1.6, WHITE], [3.2, 1.3, ROSE]].forEach(([off, t, col], k) => {
      add('plain', archFrameGeometry(W + off, WH + off * 0.6, t, 1.2 + k * 0.4), col);
      for (const q of [-1, 1]) add('plain', cyl(t * 0.55, t * 0.55, hs, low ? 6 : 8, q * (W / 2 + off / 2 + t / 2), 0, 0.9 + k * 0.4), col);
    });
    add('gold', new THREE.TubeGeometry(pointedArchPath(W + 7, WH + 4), low ? 32 : 48, 0.5, 5, false).translate(0, 0, 1.6));     // hood mould
    add('gold', new THREE.TubeGeometry(pointedArchPath(W - 0.4, WH - 0.3), low ? 32 : 48, 0.3, 4, false).translate(0, 0, 0.5));  // gold trim
    const lw = W / 2 - 1.2, lh = hs + lw * 0.6;
    add('plain', box(1.4, hs + 2, 0.9, 0, 0, 0.3), WHITE);                                         // central mullion
    for (const q of [-1, 1]) {
      add('plain', new THREE.TubeGeometry(pointedArchPath(lw, lh), low ? 20 : 32, 0.5, 4, false).translate(q * (lw / 2 + 0.7), 0, 0.3), WHITE);
      add('plain', box(0.6, lh - lw * 0.8, 0.6, q * (lw / 2 + 0.7), 0, 0.3), WHITE);
    }
    for (let k = 1; k <= 7; k++) add('gold', box(W - 1, 0.45, 0.5, 0, (k * hs) / 8, 0.25));       // seven transoms
    const ry = hs + W * 0.42, rr = W * 0.26;
    add('plain', new THREE.TorusGeometry(rr, 0.7, 5, 32).translate(0, ry, 0.4), WHITE);
    for (let k = 0; k < 8; k++) add('plain', new THREE.TorusGeometry(rr * 0.32, 0.3, 3, 14).translate(Math.cos(k * Math.PI / 4) * rr * 0.62, ry + Math.sin(k * Math.PI / 4) * rr * 0.62, 0.4), WHITE);
    add('gold', new THREE.TorusGeometry(rr * 0.22, 0.35, 3, 14).translate(0, ry, 0.5));
    if (gablet) {
      const gb = WH + 4, gw = W / 2 + 3, gh = 16;
      for (const q of [-1, 1]) {
        add('plain', new THREE.CylinderGeometry(0.6, 0.6, Math.hypot(gw, gh), 6).rotateZ(q * (Math.PI / 2 - Math.atan2(gh, gw))).translate(q * gw / 2, gb + gh / 2, 1.8), WHITE);
        for (let t = 0.15; t < 0.95; t += low ? 0.2 : 0.13) add('plain', new THREE.ConeGeometry(0.6, 2, 5).rotateZ(-q * 0.5).translate(q * gw * (1 - t), gb + gh * t + 0.9, 1.8), WHITE);
      }
      add('plain', cyl(0.7, 0.9, 4, 8, 0, gb + gh, 1.8), WHITE);
      add('gold', new THREE.ConeGeometry(0.7, 5, 8).translate(0, gb + gh + 6.5, 1.8));
    }
    add('plain', box(W + 7, 1.2, 3, 0, -1.2, 1.2), MARBLE);                                        // sill
    const pane = new THREE.ShapeGeometry(pointedArchShape(W, WH), 12), pp = pane.attributes.position, uv = pane.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, (pp.getX(k) + W / 2) / W, pp.getY(k) / WH);
    parts.push(['pane', pane.toNonIndexed().translate(0, 0, -0.2)]);
    return parts;
  }
  // place a window flat on a wall, or wrapped round a tower of radius R facing +z at angle a
  const placeFlat = (parts, x, y, z) => { K.frame(x, y, z); for (const [k, g, c] of parts) k === 'pane' ? panes.push(g.clone().translate(x, y, z)) : K.add(k, g.clone(), c); };
  const placeRound = (parts, cx, y, cz, R, a) => {
    K.frame();
    for (const [k, g0, c] of parts) {
      const g = g0.clone(), p = g.attributes.position;
      for (let v = 0; v < p.count; v++) {
        const an = a + p.getX(v) / R, rr = R + p.getZ(v);
        p.setXYZ(v, cx + rr * Math.sin(an), y + p.getY(v), cz + rr * Math.cos(an));
      }
      g.computeVertexNormals();
      k === 'pane' ? panes.push(g) : K.add(k, g, c);
    }
  };
  {
    const big = greatWindow(CROWN.winW, CROWN.winH, true);
    for (const s of [-1, 1]) for (const wx of CROWN.winX) {
      placeFlat(big, GX + s * wx, SILL + CROWN.winY, GZ + 0.3);
      K.glow(GX + s * wx, SILL + CROWN.winY + CROWN.winH * 0.6, GZ + 2, 26);
    }
    const D = castle.dome, C = castle.cone;
    const domeWin = greatWindow(24, 80, false);
    for (const dx of [-31, 0, 31]) placeRound(domeWin, D.x, SILL + 142, D.z, D.r + 0.4, Math.asin(dx / D.r));
    placeRound(greatWindow(26, 80, false), C.x, SILL + 146, C.z, C.r + 0.4, 0);
  }
  for (const s of [-1, 1]) {
    K.frame(GX, 0, GZ + 0.35);
    for (let x = CROWN.frameHW + 1.5; x < CROWN.wallHW; x += 2.5) {
      K.add('plain', halfRing(1.05, 0.2, 3, low ? 6 : 8).translate(s * x, WALL_TOP - 2.6, 0), WHITE);
      K.add('plain', box(0.5, 1.1, 0.7, s * (x - 1.25), WALL_TOP - 3.6, 0.1), MARBLE);
    }
  }

  // --- the great portal: stepped archivolts, jamb colonnettes, a rose window, crockets --------
  {
    K.frame(GX, SILL, GZ + 2);
    const orders = [[60, 102.5, WHITE, 0.95], [63.5, 105, ROSE, 0.8], [67, 107.5, WHITE, 0.95]];
    orders.forEach(([w, h, col, r], k) => {
      K.add(k === 1 ? 'plain' : 'plain', new THREE.TubeGeometry(pointedArchPath(w, h), low ? 64 : 96, r, low ? 5 : 7, false).translate(0, 0, 0.6 + k * 0.5), col);
      const hs = h - w * 0.866;
      for (const s of [-1, 1]) {
        K.add('plain', cyl(r * 0.9, r * 0.9, hs, low ? 6 : 10, s * w / 2, 0, 0.6 + k * 0.5), col);
        K.add('gold', box(2.6, 1.6, 2.6, s * w / 2, hs - 1.6, 0.6 + k * 0.5));
        K.add('plain', box(2.8, 2.4, 2.8, s * w / 2, 0, 0.6 + k * 0.5), MARBLE);
      }
    });
    K.add('gold', new THREE.TubeGeometry(pointedArchPath(70, 110), low ? 64 : 96, 0.45, 4, false).translate(0, 0, 1.4));
    // a rose-glass lunette over the gate arch and a round flowing-glass oculus above it
    const LY = 112, LR = 12;
    K.add('rose', new THREE.CircleGeometry(LR, 32, 0, Math.PI).translate(0, LY, 0.3));
    K.add('gold', new THREE.TorusGeometry(LR + 0.4, 0.55, 5, 32, Math.PI).translate(0, LY, 0.5));
    K.add('plain', new THREE.TorusGeometry(LR + 1.5, 0.6, 5, 32, Math.PI).translate(0, LY, 0.5), WHITE);
    K.add('plain', box(2 * LR + 3, 1, 1.2, 0, LY - 1, 0.5), WHITE);
    for (let k = 1; k < 8; k++) {
      const a = (k / 8) * Math.PI;
      K.add('gold', box(0.28, LR - 1, 0.3).rotateZ(a - Math.PI / 2).translate(0, LY, 0.6));
      K.add('plain', new THREE.TorusGeometry(0.9, 0.2, 3, 12).translate(Math.cos(a) * (LR + 1.5), LY + Math.sin(a) * (LR + 1.5), 0.7), WHITE);
    }
    const OY = 138, OR = 7.5;
    const oc = new THREE.CircleGeometry(OR, 32).toNonIndexed();
    panes.push(oc.translate(GX, SILL + OY, GZ + 2.3));
    K.add('gold', new THREE.TorusGeometry(OR + 0.4, 0.5, 5, 36).translate(0, OY, 0.5));
    K.add('plain', new THREE.TorusGeometry(OR + 1.4, 0.55, 5, 36).translate(0, OY, 0.5), WHITE);
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      K.add('plain', new THREE.TorusGeometry(0.8, 0.2, 3, 12).translate(Math.cos(a) * (OR + 1.4), OY + Math.sin(a) * (OR + 1.4), 0.7), WHITE);
    }
    K.glow(0, OY, 2, 14); K.glow(0, LY + 5, 2, 14);
    // crockets climbing both gable edges and a gilded finial on top
    for (const s of [-1, 1]) for (let t = 0.08; t < 0.97; t += low ? 0.11 : 0.075) {
      const x = s * 40 * (1 - t), y = CROWN.gableSide + (CROWN.gableTop - CROWN.gableSide) * t + 1;
      K.add('plain', new THREE.ConeGeometry(0.7, 2.4, 5).rotateZ(-s * 0.5).translate(x, y + 0.6, 2.4), WHITE);
    }
    const GT = CROWN.gableTop;
    K.add('plain', cyl(1.2, 1.6, 8, 8, 0, GT, 0), WHITE);
    K.add('gold', new THREE.ConeGeometry(1.2, 8, 8).translate(0, GT + 12, 0));
    K.add('gold', new THREE.TorusGeometry(1.8, 0.35, 4, 16).translate(0, GT + 9.5, 0));
  }

  // --- the grand stair: carved balustrades, urns, statues and lanterns ------------------------
  const P = STAIR.profile;
  const baluster = low ? cyl(0.24, 0.3, 1.42, 5) : lathe([[0.2, 0], [0.22, 0.12], [0.12, 0.25], [0.24, 0.5], [0.12, 0.78], [0.18, 0.9], [0.2, 0.95]], 6);
  baluster.scale(1.5, 1.5, 1.5);
  const urn = lathe([[0, 0], [0.5, 0], [0.35, 0.3], [0.75, 0.9], [0.8, 1.3], [0.55, 1.55], [0.7, 1.7], [0, 1.7]], low ? 8 : 12);
  const veiled = lathe([[0, 0], [1.1, 0], [0.9, 2], [0.6, 3.6], [0.4, 4.2], [0.5, 4.6], [0.38, 5.1], [0, 5.4]], low ? 8 : 12);
  for (let i = 0; i < P.length - 1; i++) {
    const [z0, y0] = P[i], [z1, y1] = P[i + 1];
    const hwA = stairHW((z0 + z1) / 2), len = z0 - z1, slope = (y1 - y0) / (len || 1);
    for (const s of [-1, 1]) {
      const x = s * (hwA + 1);
      K.frame(x, 0, 0);
      // balusters and a moulded rail riding the cheek wall
      for (let z = z0 - 0.6; z > z1 + 0.3; z -= low ? 1.2 : 0.9) K.add('plain', baluster.clone().translate(0, y0 + slope * (z0 - z) + 1.4, z), WHITE);
      if (y1 !== y0) for (let z = z0 - 9; z > z1 + 4; z -= 9) {
        // pedestals part-way up each flight: urns of flowers and twin lanterns in turn
        const yy = y0 + slope * (z0 - z) + 1.4, k = Math.round((z0 - z) / 9);
        K.add('plain', box(1.7, 2.2, 1.7, 0, yy - 0.6, z), MARBLE);
        K.add('gold', box(1.9, 0.25, 1.9, 0, yy + 1.6, z));
        if (k % 2) { K.add('plain', urn.clone().translate(0, yy + 1.85, z), WHITE); K.add('plain', new THREE.IcosahedronGeometry(0.9, 1).scale(1, 0.7, 1).translate(0, yy + 3.85, z), k % 4 === 1 ? '#ff8fc8' : '#c9a2ff'); }
        else { K.add('plain', cyl(0.16, 0.22, 3, 6, 0, yy + 1.85, z), '#3a2a48'); K.add('glow', new THREE.SphereGeometry(0.45, 8, 6).translate(0, yy + 5.2, z), '#ffd49a'); K.glow(0, yy + 5.2, z, 4); }
      }
      const rail = new THREE.BoxGeometry(0.7, 0.3, Math.hypot(len, y1 - y0)).rotateX(Math.atan2(y1 - y0, len)).translate(0, (y0 + y1) / 2 + 2.95, (z0 + z1) / 2);
      K.add('plain', rail, MARBLE);
      // a newel pedestal at the foot of each run, crowned with an urn of flowers or a lantern
      K.add('plain', box(1.8, 2.8, 1.8, 0, y0, z0 - 0.4), MARBLE);
      K.add('gold', box(2.0, 0.3, 2.0, 0, y0 + 2.8, z0 - 0.4));
      if (y1 === y0) {
        // a landing: a veiled statue on a tall plinth, facing the stair
        const sx = -s * 3.4, sz = (z0 + z1) / 2;   // stands on the landing, inside the cheek
        K.add('plain', box(2.6, 3.2, 2.6, sx, y0, sz), MARBLE);
        K.add('plain', veiled.clone().translate(sx, y0 + 3.2, sz), '#f4eaf2');
        K.add('glow', new THREE.SphereGeometry(0.4, 8, 6).translate(sx + s * 0.8, y0 + 9.1, sz), '#ffd49a');
        K.glow(sx + s * 0.8, y0 + 9.1, sz, 4);
      } else if (i % 2 === 0) {
        K.add('plain', urn.clone().translate(0, y0 + 3.1, z0 - 0.4), WHITE);
        K.add('plain', new THREE.IcosahedronGeometry(0.9, 1).scale(1, 0.7, 1).translate(0, y0 + 5.1, z0 - 0.4), s > 0 ? '#ff8fc8' : '#ffb6dc');
      } else {
        K.add('plain', cyl(0.18, 0.24, 3.4, 6, 0, y0 + 3.1, z0 - 0.4), '#3a2a48');
        K.add('gold', box(1.4, 0.2, 0.2, 0, y0 + 6.2, z0 - 0.4));
        for (const k of [-1, 1]) {
          K.add('glow', new THREE.SphereGeometry(0.38, 8, 6).translate(k * 0.65, y0 + 5.7, z0 - 0.4), '#ffd49a');
          K.glow(k * 0.65, y0 + 5.7, z0 - 0.4, 3.5);
        }
      }
    }
    // a carved basin round each landing jet
    if (i > 0 && y0 !== y1) {
      K.frame();
      K.add('plain', new THREE.TorusGeometry(2.6, 0.35, 4, 24).rotateX(Math.PI / 2).translate(0, y0 + 0.4, z0), WHITE);
      K.add('gold', new THREE.TorusGeometry(2.9, 0.12, 3, 24).rotateX(Math.PI / 2).translate(0, y0 + 0.75, z0));
    }
  }

  // rose runners edged in gold climbing the stair either side of the water channel
  {
    K.frame();
    // follows every tread and riser, exactly as castle.js lays the steps
    const strip = (x0, x1, lift) => {
      const pos = [];
      const quad = (ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz) => pos.push(ax, ay, az, bx, by, bz, cx, cy, cz, ax, ay, az, cx, cy, cz, dx, dy, dz);
      for (let i = 0; i < P.length - 1; i++) {
        const [z0, y0] = P[i], [z1, y1] = P[i + 1];
        const steps = Math.max(1, Math.round((y1 - y0) / 0.5));
        let prev = y0;
        for (let k = 0; k < steps; k++) {
          const za = z0 - (z0 - z1) * (k / steps), zb = z0 - (z0 - z1) * ((k + 1) / steps), top = y0 + (y1 - y0) * ((k + 1) / steps) + lift;
          if (top - lift > prev + 0.01) quad(x0, prev + lift, za + 0.005, x1, prev + lift, za + 0.005, x1, top, za + 0.005, x0, top, za + 0.005);   // riser
          quad(x0, top, za, x1, top, za, x1, top, zb, x0, top, zb);                                                                             // tread
          prev = top - lift;
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.computeVertexNormals();
      return g;
    };
    for (const s of [-1, 1]) {
      K.add('cloth', strip(s * 7, s * 13, 0.03), '#d77fa6');
      K.add('cloth', strip(s * 6.6, s * 7, 0.045), '#e8b84a');
      K.add('cloth', strip(s * 13, s * 13.4, 0.045), '#e8b84a');
    }
  }

  group.add(new THREE.Mesh(mergeGeometries(panes), glassMat));
  const mats = kitMaterials();
  K.build(mats, group, 'castle-arch');
  const halos = haloPoints(K.glows, [1, 0.85, 0.75]);
  group.add(halos);
  scene.add(group);
  return {
    update(t) { mats.update(); halos.material.uniforms.uTime.value = t; glassMat.color.setScalar(0.75 + 0.35 * (mats.rose.color.r - 0.6) / 0.45); },
  };
}
