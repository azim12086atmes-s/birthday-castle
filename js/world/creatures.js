// Gentle magical creatures, all eyeless by design: winged unicorns, a white
// light-fury-style dragon, glowing antlered deer, sky jellyfish and birds.
import * as THREE from 'three';
import { toon, glowBasic, additive } from './materials.js';
import { glowTexture, rng } from './textures.js';
import { ISLANDS, CASTLE, isClearOfBuildings } from './layout.js';

const RAINBOW = ['#ff9bd6', '#c9a6ff', '#7ff3ff', '#8dffb0', '#ffd47a'];

function wingGeometry(len, width, scallops = 5) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(len * 0.3, width * 0.9, len * 0.7, width * 1.1, len, width * 0.6);
  for (let i = 0; i < scallops; i++) {
    const t0 = 1 - i / scallops, t1 = 1 - (i + 1) / scallops;
    s.quadraticCurveTo(len * (t0 + t1) / 2, width * 0.05 * (1 - t1), len * t1, t1 * width * 0.4);
  }
  s.lineTo(0, 0);
  const g = new THREE.ShapeGeometry(s, 8);
  g.rotateX(-Math.PI / 2);
  return g;
}

function makeUnicorn(r) {
  const g = new THREE.Group();
  const white = toon('#fbf7ff', { emissive: '#3a2a6a', emissiveIntensity: 0.6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), white); body.scale.set(0.85, 0.85, 1.7);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.55, 1.6, 10), white);
  neck.position.set(0, 0.85, 1.3); neck.rotation.x = 0.7;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 10), white); head.scale.set(0.9, 0.85, 1.6);
  head.position.set(0, 1.55, 2.05); head.rotation.x = 0.35;
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.11, 1.1, 8), glowBasic('#ffe08a'));
  horn.position.set(0, 2.15, 2.25); horn.rotation.x = 0.6;
  g.add(body, neck, head, horn);
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 5), glowBasic(RAINBOW[i]));
    m.position.set(0, 1.5 - i * 0.22, 1.75 - i * 0.28); m.rotation.x = -1.9; g.add(m);
  }
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.6, 5), glowBasic(RAINBOW[i + 1]));
    m.position.set((i - 1.5) * 0.08, 0.1 - i * 0.1, -2.1); m.rotation.x = -2.2 + i * 0.1; g.add(m);
  }
  const legGeo = new THREE.CylinderGeometry(0.12, 0.09, 1.4, 6); legGeo.translate(0, -0.7, 0);
  const legs = [];
  for (const [x, z] of [[-0.4, 0.9], [0.4, 0.9], [-0.4, -0.9], [0.4, -0.9]]) {
    const l = new THREE.Mesh(legGeo, white); l.position.set(x, -0.45, z); g.add(l); legs.push(l);
  }
  const wingMat = new THREE.MeshToonMaterial({ color: '#f4eeff', emissive: '#6a5aa8', emissiveIntensity: 0.6, side: THREE.DoubleSide });
  const wings = [-1, 1].map((s) => {
    const p = new THREE.Group(); p.position.set(s * 0.5, 0.6, 0.4);
    const w = new THREE.Mesh(wingGeometry(3.6, 2.2), wingMat); w.scale.x = s; w.rotation.y = s * 0.15;
    p.add(w); g.add(p); return p;
  });
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#c9a6ff', transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(7); g.add(halo);
  g.userData = { wings, legs, phase: r() * 10 };
  return g;
}

function makeDragon() {
  const g = new THREE.Group();
  const white = toon('#f6f3ff', { emissive: '#3a3a7a', emissiveIntensity: 0.6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), white); body.scale.set(1, 0.8, 2.4);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.8, 14, 10), white); head.scale.set(1.1, 0.75, 1.3); head.position.set(0, 0.45, 2.7);
  g.add(body, head);
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 5), white); ear.position.set(s * 0.45, 1, 2.3); ear.rotation.set(-0.9, 0, s * 0.4); g.add(ear);
  }
  const tail = [];
  let parent = g, z = -2.2;
  for (let i = 0; i < 7; i++) {
    const seg = new THREE.Group(); seg.position.z = i === 0 ? z : -0.85;
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.55 - i * 0.07, 10, 8), white); m.scale.z = 1.8; seg.add(m);
    // glowing spine plates
    const plate = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.45, 4), glowBasic('#9fe8ff')); plate.position.y = 0.45 - i * 0.05; seg.add(plate);
    parent.add(seg); tail.push(seg); parent = seg;
  }
  const fin = new THREE.Mesh(wingGeometry(1.3, 0.8, 3), white); fin.rotation.y = Math.PI / 2; fin.position.z = -0.6; tail[6].add(fin);
  const wingMat = new THREE.MeshToonMaterial({ color: '#ecebff', emissive: '#4a4a90', emissiveIntensity: 0.6, side: THREE.DoubleSide });
  const wings = [-1, 1].map((s) => {
    const p = new THREE.Group(); p.position.set(s * 0.7, 0.4, 0.5);
    const w = new THREE.Mesh(wingGeometry(7, 3.4, 6), wingMat); w.scale.x = s; p.add(w); g.add(p); return p;
  });
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#9fe8ff', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.scale.setScalar(12); g.add(glow);
  g.userData = { wings, tail };
  g.scale.setScalar(1.4);
  return g;
}

function makeDeer(r) {
  const g = new THREE.Group();
  const fur = toon('#d8c7ff', { emissive: '#2a2060', emissiveIntensity: 0.7 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 10), fur); body.scale.set(0.8, 0.8, 1.6); body.position.y = 1.3;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.9, 8), fur); neck.position.set(0, 1.85, 0.75); neck.rotation.x = 0.5;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), fur); head.scale.set(0.9, 0.9, 1.6); head.position.set(0, 2.25, 1.05);
  g.add(body, neck, head);
  const antler = glowBasic('#7ff3ff');
  for (const s of [-1, 1]) {
    const a = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.9, 4), antler); a.position.set(s * 0.18, 2.7, 0.95); a.rotation.z = -s * 0.5; g.add(a);
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.4, 4), antler);
      b.position.set(s * (0.3 + i * 0.08), 2.75 + i * 0.13, 0.95 + (i - 1) * 0.08); b.rotation.z = -s * (1 - i * 0.2); g.add(b);
    }
  }
  const legGeo = new THREE.CylinderGeometry(0.07, 0.05, 1, 5); legGeo.translate(0, -0.5, 0);
  const legs = [];
  for (const [x, z] of [[-0.25, 0.6], [0.25, 0.6], [-0.25, -0.6], [0.25, -0.6]]) {
    const l = new THREE.Mesh(legGeo, fur); l.position.set(x, 1.05, z); g.add(l); legs.push(l);
  }
  // glowing spots along the back
  for (let i = 0; i < 6; i++) {
    const sp = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), glowBasic(RAINBOW[i % 5]));
    sp.position.set((r() - 0.5) * 0.5, 1.75, (r() - 0.5) * 1.5); g.add(sp);
  }
  g.userData = { legs, target: new THREE.Vector3(), wait: 0, speed: 1.4 };
  return g;
}

function makeJelly(r) {
  const g = new THREE.Group();
  const col = new THREE.Color().setHSL(0.5 + r() * 0.4, 0.9, 0.65);
  const bell = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), additive(col, { opacity: 0.45, side: THREE.DoubleSide }));
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), glowBasic(col));
  core.position.y = 0.4;
  g.add(bell, core);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.01, 3 + r() * 2, 3), additive(col, { opacity: 0.6 }));
    t.position.set(Math.cos(a) * 0.8, -1.8, Math.sin(a) * 0.8); g.add(t);
  }
  g.userData = { bell, seed: r() * 10 };
  return g;
}

export function createCreatures(scene, preset) {
  const r = rng(8);
  const group = new THREE.Group();

  const unicorns = [0, 1, 2, 3].map((i) => {
    const u = makeUnicorn(r);
    u.userData.orbit = { R: 55 + i * 22, y: 30 + i * 9, speed: (0.09 + r() * 0.05) * (i % 2 ? -1 : 1), off: i * 1.7, cx: CASTLE.x, cz: CASTLE.z + 10 };
    group.add(u); return u;
  });
  // two unicorns grazing in the meadow
  const meadow = ISLANDS.find((i) => i.id === 'meadow');
  const grazers = [0, 1].map((i) => {
    const u = makeUnicorn(r);
    u.position.set(meadow.x + (i ? 8 : -6), meadow.y + 1.9, meadow.z + (i ? -4 : 6));
    u.rotation.y = i ? 2.2 : -0.6;
    u.userData.wings.forEach((w, k) => { w.rotation.z = (k ? -1 : 1) * -0.9; });
    group.add(u); return u;
  });

  const dragon = makeDragon();
  group.add(dragon);

  const deer = [];
  const deerHomes = ISLANDS.filter((i) => i.id !== 'star' && i.id !== 'aurora');
  for (let i = 0; i < 6; i++) {
    const d = makeDeer(r);
    const home = deerHomes[i % deerHomes.length];
    d.userData.home = home;
    d.position.set(home.x + (r() - 0.5) * home.r, home.y, home.z + (r() - 0.5) * home.r);
    if (!isClearOfBuildings(d.position.x, d.position.z)) d.position.set(home.x + home.r * 0.6, home.y, home.z);
    group.add(d); deer.push(d);
  }

  const jellies = [];
  for (let i = 0; i < 10; i++) {
    const j = makeJelly(r);
    const a = r() * Math.PI * 2, d = 110 + r() * 160;
    j.userData.base = new THREE.Vector3(Math.cos(a) * d, 10 + r() * 60, Math.sin(a) * d);
    group.add(j); jellies.push(j);
  }

  // instanced bird flock: wings flap in the vertex shader
  const birdGeo = new THREE.BufferGeometry();
  birdGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0.5, -1.2, 0, -0.2, 0, 0, -0.4, 0, 0, 0.5, 0, 0, -0.4, 1.2, 0, -0.2]), 3));
  const birdMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide, uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */`
      uniform float uTime; varying float vW;
      void main(){ vec3 p = position; float ph = float(gl_InstanceID) * 1.7;
        p.y += abs(p.x) * sin(uTime * 9. + ph) * .7; vW = abs(p.x);
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.); }
    `,
    fragmentShader: 'varying float vW; void main(){ gl_FragColor = vec4(mix(vec3(1.,.9,.7), vec3(.6,.9,1.), vW), 1.); }',
  });
  const birds = new THREE.InstancedMesh(birdGeo, birdMat, preset.birds);
  birds.frustumCulled = false;
  const birdSeeds = Array.from({ length: preset.birds }, () => [r() * 6, r() * 8, r() * 8, r() * 6]);
  group.add(birds);

  scene.add(group);
  const d3 = new THREE.Object3D();
  const v = new THREE.Vector3(), v2 = new THREE.Vector3();

  return {
    unicorns, dragon,
    update(t, dt) {
      for (const u of unicorns) {
        const o = u.userData.orbit, a = t * o.speed + o.off;
        u.position.set(o.cx + Math.cos(a) * o.R, o.y + Math.sin(t * 0.8 + o.off) * 3, o.cz + Math.sin(a) * o.R);
        v.set(-Math.sin(a) * Math.sign(o.speed), 0, Math.cos(a) * Math.sign(o.speed));
        u.rotation.y = Math.atan2(v.x, v.z);
        u.rotation.z = -Math.sign(o.speed) * 0.25;
        const f = Math.sin(t * 4 + u.userData.phase) * 0.7;
        u.userData.wings[0].rotation.z = -f; u.userData.wings[1].rotation.z = f;
        u.userData.legs.forEach((l, k) => { l.rotation.x = (k < 2 ? -1 : 1) * 0.8; });
      }
      for (const g of grazers) {
        g.children[3].rotation.x = 0.6 + Math.sin(t * 0.7 + g.position.x) * 0.1;
      }

      // dragon: a lazy figure-eight over the islands
      const da = t * 0.06;
      dragon.position.set(Math.sin(da) * 170, 70 + Math.sin(da * 3) * 15, Math.sin(da * 2) * 120);
      v2.set(Math.sin(da + 0.01) * 170, 70 + Math.sin((da + 0.01) * 3) * 15, Math.sin((da + 0.01) * 2) * 120);
      dragon.lookAt(v2);
      const df = Math.sin(t * 2.2) * 0.6;
      dragon.userData.wings[0].rotation.z = -df; dragon.userData.wings[1].rotation.z = df;
      dragon.userData.tail.forEach((s, i) => { s.rotation.y = Math.sin(t * 2 - i * 0.6) * 0.15; });

      for (const d of deer) {
        const u = d.userData;
        if (u.wait > 0) { u.wait -= dt; continue; }
        if (u.target.lengthSq() === 0 || d.position.distanceTo(u.target) < 0.5) {
          const h = u.home;
          for (let k = 0; k < 8; k++) {
            const a = Math.random() * Math.PI * 2, rr = Math.random() * (h.r - 6);
            const x = h.x + Math.cos(a) * rr, z = h.z + Math.sin(a) * rr;
            if (isClearOfBuildings(x, z, 2)) { u.target.set(x, h.y, z); break; }
          }
          u.wait = 2 + Math.random() * 5;
          continue;
        }
        v.subVectors(u.target, d.position); v.y = 0;
        const step = Math.min(v.length(), u.speed * dt);
        v.normalize();
        d.position.addScaledVector(v, step);
        d.rotation.y = Math.atan2(v.x, v.z);
        u.legs.forEach((l, k) => { l.rotation.x = Math.sin(t * 8 + k * Math.PI * 0.5) * 0.4; });
      }

      for (const j of jellies) {
        const s = j.userData.seed;
        j.position.copy(j.userData.base).add(v.set(Math.sin(t * 0.1 + s) * 8, Math.sin(t * 0.5 + s) * 3, Math.cos(t * 0.1 + s) * 8));
        const p = 1 + Math.sin(t * 2 + s) * 0.12;
        j.userData.bell.scale.set(p, 2 - p, p);
      }

      birdMat.uniforms.uTime.value = t;
      birdSeeds.forEach((b, i) => {
        const a = t * 0.15 + b[0];
        d3.position.set(Math.cos(a) * (80 + b[1] * 6), 35 + Math.sin(t * 0.4 + b[2]) * 6 + b[3] * 2, Math.sin(a) * (80 + b[1] * 6) - 20);
        d3.rotation.set(0, -a, 0);
        d3.scale.setScalar(0.8);
        d3.updateMatrix();
        birds.setMatrixAt(i, d3.matrix);
      });
      birds.instanceMatrix.needsUpdate = true;
    },
  };
}
