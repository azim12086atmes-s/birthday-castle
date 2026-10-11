// A detail pass on the Birthday Castle: the 70 m gate landing gets an inlaid
// star rosette, a rose runner, twin tiered fountains, flower planters and tall
// banner poles; the front wall gets pilasters, a gallery balcony and merlons;
// pennants wave from the spires and strings of fairy lights hang between towers.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Kit, kitMaterials, box, cyl, lathe, haloPoints } from './kit.js';
import { flagMaterial, additive } from './materials.js';
import { CASTLE, TERRACES } from './layout.js';

const MARBLE = '#f8e6ee', ROSE = '#e7a9c0', PLUM = '#7a2a5e';

export function createCastleDetail(scene, preset) {
  const low = preset.grass < 4000;
  const K = new Kit(), group = new THREE.Group();
  const GX = CASTLE.x, GZ = CASTLE.z, Y = CASTLE.y, FRONT = TERRACES[2].front;

  // --- the gate landing --------------------------------------------------------------
  {
    K.frame();
    const mid = (GZ + FRONT) / 2;
    // an eight-pointed star rosette inlaid in front of the gate
    const star = new THREE.Shape();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, rr = i % 2 ? 13 : 22;
      i ? star.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : star.moveTo(rr, 0);
    }
    K.add('plain', new THREE.ShapeGeometry(star).rotateX(-Math.PI / 2).translate(GX, Y + 0.06, GZ + 30), '#e391b6');
    for (const [rr, w] of [[24, 0.5], [12, 0.4], [6, 0.35]]) K.add('gold', new THREE.RingGeometry(rr - w, rr, 64).rotateX(-Math.PI / 2).translate(GX, Y + 0.08, GZ + 30));
    K.add('plain', new THREE.CircleGeometry(5.6, 32).rotateX(-Math.PI / 2).translate(GX, Y + 0.07, GZ + 30), '#fff2f8');
    // a rose runner from the stair top to the gate, edged in gold
    K.add('plain', box(9, 0.08, FRONT - GZ - 6, GX, Y + 0.02, (GZ + FRONT) / 2 + 3), '#d77fa6');
    for (const s of [-1, 1]) K.add('gold', box(0.5, 0.1, FRONT - GZ - 6, GX + s * 4.7, Y + 0.02, (GZ + FRONT) / 2 + 3));
    // twin tiered fountains with glowing water
    for (const s of [-1, 1]) {
      const fx = GX + s * 42, fz = mid + 6;
      K.add('plain', cyl(11, 11.6, 1.2, 40, fx, Y, fz), MARBLE);
      K.add('glow', cyl(10.2, 10.2, 0.1, 40, fx, Y + 1.0, fz), '#9fd8ff');
      K.add('plain', lathe([[0, 0], [1.6, 0], [1.1, 2.5], [0.9, 4.5], [4.8, 5.0], [4.8, 5.6], [0.9, 5.6], [0.7, 8.5], [2.6, 9], [2.6, 9.5], [0.5, 9.5], [0.4, 11.5], [0, 12]], 20).translate(fx, Y + 1, fz), MARBLE);
      K.add('glow', cyl(4.4, 4.4, 0.1, 24, fx, Y + 6.5, fz), '#bfeaff');
      K.add('gold', new THREE.OctahedronGeometry(0.9, 0).scale(1, 1.6, 1).translate(fx, Y + 14, fz));
      K.glow(fx, Y + 13, fz, 14);
      // jets arching in from the rim
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2, jx = fx + Math.cos(a) * 9.5, jz = fz + Math.sin(a) * 9.5;
        K.add('glow', new THREE.ConeGeometry(0.25, 3.4, 5).rotateZ(Math.cos(a) * 0.5).rotateX(-Math.sin(a) * 0.5).translate(jx, Y + 2.6, jz), '#d8f4ff');
      }
    }
    // flower planters along the landing edges and between the fountains
    for (const s of [-1, 1]) for (let k = 0; k < 6; k++) {
      const px = GX + s * (14 + k * 14), pz = FRONT - 4;
      if (Math.abs(px) < 30) continue;
      K.add('plain', box(6, 1.2, 2.4, px, Y, pz), MARBLE);
      K.add('plain', new THREE.IcosahedronGeometry(1.4, 1).scale(2, 0.6, 0.8).translate(px, Y + 1.6, pz), k % 2 ? '#ff8fc8' : '#ffb6dc');
    }
    // tall banner poles flanking the runner
    const flags = [];
    for (const s of [-1, 1]) for (const fz of [FRONT - 14, mid - 4]) {
      const px = GX + s * 12;
      K.add('plain', cyl(0.35, 0.5, 26, 8, px, Y, fz), '#3a2a48');
      K.add('gold', new THREE.SphereGeometry(0.8, 10, 8).translate(px, Y + 26.6, fz));
      K.add('gold', box(5.4, 0.3, 0.3, px, Y + 24.6, fz));
      flags.push(new THREE.PlaneGeometry(4.8, 14, 1, 8).translate(px, Y + 17.5, fz));
    }
    const banner = new THREE.Mesh(mergeGeometries(flags), new THREE.MeshToonMaterial({ color: PLUM, emissive: '#5a1440', emissiveIntensity: 0.5, side: THREE.DoubleSide }));
    group.add(banner);
    // veiled lamp-bearers along the landing (no faces)
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
      const vx = GX + s * 26, vz = GZ + 12 + k * 15;
      K.add('plain', box(2.4, 1.2, 2.4, vx, Y, vz), MARBLE);
      K.add('plain', lathe([[0, 0], [1.1, 0], [0.9, 2], [0.6, 3.6], [0.4, 4.2], [0.5, 4.6], [0, 5.3]], 10).translate(vx, Y + 1.2, vz), '#f4eaf2');
      K.add('glow', new THREE.SphereGeometry(0.45, 8, 6).translate(vx - s * 0.9, Y + 6.8, vz), '#ffd49a');
      K.glow(vx - s * 0.9, Y + 6.8, vz, 4);
    }
  }

  // --- the front wall: pilasters, a gallery balcony, merlons, gold rosettes -----------
  {
    K.frame();
    const top = Y + 75;
    for (const s of [-1, 1]) {
      for (let x = 50; x <= 100; x += 10) {
        K.add('plain', box(2.2, 75, 1.4, GX + s * x, Y, GZ + 0.7), ROSE);
        K.add('gold', box(2.6, 1.2, 1.8, GX + s * x, Y + 38, GZ + 0.9));
        K.add('plain', new THREE.ConeGeometry(1.1, 5, 6).translate(GX + s * x, top + 4, GZ + 0.7), PLUM);
      }
      // the gallery balcony across the wall, with balusters
      const x0 = 42, x1 = 100, len = x1 - x0, cx = GX + s * (x0 + len / 2);
      K.add('plain', box(len, 1, 4, cx, Y + 26, GZ + 2), MARBLE);
      K.add('plain', box(len, 0.4, 0.4, cx, Y + 28.2, GZ + 3.8), MARBLE);
      for (let x = x0 + 1; x < x1; x += 1.4) K.add('plain', cyl(0.14, 0.18, 1.2, 5, GX + s * x, Y + 27, GZ + 3.8), MARBLE);
      for (let x = x0 + 4; x < x1; x += 8) K.add('plain', new THREE.ConeGeometry(1.6, 1.4, 8).rotateX(Math.PI).translate(GX + s * x, Y + 25.3, GZ + 2), MARBLE);
      // crenellations along the wall top
      for (let x = x0; x <= x1; x += 3) K.add('plain', box(1.6, 2.4, 2, GX + s * x, top + 3, GZ - 0.6), MARBLE);
      // gold rosettes between the lancets
      for (let x = 50; x < 100; x += 10) K.add('gold', new THREE.TorusGeometry(1.6, 0.25, 4, 16).translate(GX + s * x, Y + 60, GZ + 1.6));
    }
  }

  // --- pennants on the spires and fairy lights between towers ---------------------------
  const flagMat = flagMaterial('#ff7fbf');
  {
    const tips = [[52, 515, -42], [-10, 476, -50], [-96, 336, -56], [-70, 311, -10], [96, 346, -58], [118, 311, -16], [-44, 320, 28], [44, 320, 28]];
    const pens = tips.map(([x, y, z]) => new THREE.PlaneGeometry(14, 3.4, 10, 1).translate(x + 7, y, z));
    group.add(new THREE.Mesh(mergeGeometries(pens), flagMat));
    // strings of fairy lights draped from tower to tower across the crown
    const pts = [];
    const string = (a, b, sag, n) => {
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - Math.sin(t * Math.PI) * sag, a[2] + (b[2] - a[2]) * t);
      }
    };
    const SIL = Y;
    const anchors = [[-96, SIL + 112, -40], [-70, SIL + 88, 0], [-44, SIL + 112, 28], [44, SIL + 112, 28], [52, SIL + 168, -18], [96, SIL + 118, -42], [118, SIL + 98, 0]];
    for (let i = 0; i < anchors.length - 1; i++) string(anchors[i], anchors[i + 1], 10, low ? 18 : 30);
    string([-44, SIL + 100, 30], [44, SIL + 100, 30], 16, low ? 30 : 50);   // across the gate gable
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const fairy = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffe0a8', size: 1.3, sizeAttenuation: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    group.add(fairy);
  }

  const mats = kitMaterials();
  K.build(mats, group, 'castle-detail');
  const halos = haloPoints(K.glows, [1, 0.85, 0.75]);
  group.add(halos);
  scene.add(group);
  return {
    update(t) {
      mats.update();
      halos.material.uniforms.uTime.value = t;
      flagMat.uniforms.uTime.value = t;
    },
  };
}
