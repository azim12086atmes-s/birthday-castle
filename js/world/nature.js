// Lush painterly trees with glowing trunk patterns, bioluminescent pools of
// light beneath them, glowing flowers and grass tufts. All instanced: one draw
// call per kind no matter how many there are.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon, additive } from './materials.js';
import { trunkTexture, glowTexture, leafTexture, rng } from './textures.js';
import { ISLANDS, isClearOfBuildings, addCollider } from './layout.js';

function canopyGeometry(r) {
  const parts = [];
  const blobs = [[0, 0, 0, 1], [0.9, -0.35, 0.3, 0.72], [-0.8, -0.3, -0.4, 0.75], [0.2, 0.55, -0.5, 0.65], [-0.3, -0.25, 0.9, 0.6]];
  for (const [x, y, z, s] of blobs) {
    const g = new THREE.IcosahedronGeometry(s, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const k = 1 + (r() - 0.5) * 0.18; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.85, p.getZ(i) * k); }
    g.translate(x, y, z);
    parts.push(g);
  }
  const g = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)));
  g.computeVertexNormals();
  return g;
}

function scatter(count, r, minEdge = 4, margin = 0) {
  const total = ISLANDS.reduce((s, i) => s + i.r * i.r, 0);
  const pts = [];
  for (const isl of ISLANDS) {
    const n = Math.round((count * isl.r * isl.r) / total);
    let tries = 0, made = 0;
    while (made < n && tries++ < n * 20) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (isl.r - minEdge);
      const x = isl.x + Math.cos(a) * d, z = isl.z + Math.sin(a) * d;
      if (!isClearOfBuildings(x, z, margin)) continue;
      if (isl.id === 'lake' && Math.hypot(x - (isl.x + 26), z - (isl.z - 10)) < 8) continue;
      if (isl.id === 'aurora' && Math.hypot(x - isl.x, z - isl.z) < 9) continue;
      if (pts.some((p) => margin > 0 && Math.hypot(p.x - x, p.z - z) < margin)) continue;
      pts.push({ x, z, y: isl.y, isl });
      made++;
    }
  }
  return pts;
}

export function createNature(scene, preset) {
  const r = rng(7);
  const group = new THREE.Group();
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  // --- trees ---
  const spots = scatter(preset.trees, r, 5, 3.2);
  const trunkGeo = new THREE.CylinderGeometry(0.35, 0.6, 1, 7);
  trunkGeo.translate(0, 0.5, 0);
  const tTex = trunkTexture(); tTex.repeat.set(1, 2);
  const trunks = new THREE.InstancedMesh(trunkGeo, toon('#ffffff', { map: tTex, emissive: '#ffffff', emissiveMap: tTex, emissiveIntensity: 0.9 }), spots.length);
  const canopy = new THREE.InstancedMesh(canopyGeometry(r), toon('#ffffff', { map: leafTexture(), emissive: '#0d2236', emissiveIntensity: 0.9 }), spots.length);
  const pools = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), additive('#ffffff', { map: glowTexture(), opacity: 0.55 }), spots.length);
  const palette = [
    [0.36, 0.55, 0.42], [0.40, 0.6, 0.38], [0.30, 0.5, 0.40], // lush greens
    [0.88, 0.55, 0.70], [0.78, 0.45, 0.68], [0.50, 0.6, 0.55], [0.13, 0.75, 0.62], // pink, violet, teal, gold
  ];
  spots.forEach((s, i) => {
    const h = 4 + r() * 5, scale = 2.2 + r() * 2.2;
    dummy.position.set(s.x, s.y, s.z); dummy.rotation.set(0, r() * 6.28, 0); dummy.scale.set(1 + r() * 0.4, h, 1 + r() * 0.4);
    dummy.updateMatrix(); trunks.setMatrixAt(i, dummy.matrix);
    dummy.position.y = s.y + h + scale * 0.35; dummy.scale.setScalar(scale);
    dummy.updateMatrix(); canopy.setMatrixAt(i, dummy.matrix);
    const p = palette[(s.isl.main && r() < 0.6) ? Math.floor(r() * 3) : Math.floor(r() * palette.length)];
    color.setHSL(p[0] + (r() - 0.5) * 0.04, p[1], p[2] + (r() - 0.5) * 0.1);
    canopy.setColorAt(i, color);
    dummy.position.set(s.x, s.y + 0.06, s.z); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(scale * 3.4);
    dummy.updateMatrix(); pools.setMatrixAt(i, dummy.matrix);
    pools.setColorAt(i, color.setHSL(r() < 0.5 ? 0.5 : 0.8, 0.9, 0.55));
    addCollider({ x: s.x, z: s.z, r: 0.75, y0: s.y, y1: s.y + h });
  });
  group.add(trunks, canopy, pools);

  // --- glowing flowers & mushrooms ---
  const fspots = scatter(preset.flowers, r, 2, 0);
  const bulbGeo = new THREE.IcosahedronGeometry(0.22, 0);
  const flowers = new THREE.InstancedMesh(bulbGeo, new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), fspots.length);
  const stemGeo = new THREE.ConeGeometry(0.25, 0.9, 4); stemGeo.translate(0, 0.45, 0);
  const tufts = new THREE.InstancedMesh(stemGeo, toon('#3f9a6a', { emissive: '#0b2a2a' }), fspots.length);
  const fcols = ['#7ff3ff', '#ff9bd6', '#ffd47a', '#c9a6ff', '#8dffb0'];
  fspots.forEach((s, i) => {
    const h = 0.4 + r() * 0.6;
    dummy.position.set(s.x, s.y + h, s.z); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(0.7 + r() * 0.8);
    dummy.updateMatrix(); flowers.setMatrixAt(i, dummy.matrix);
    flowers.setColorAt(i, color.set(fcols[Math.floor(r() * fcols.length)]));
    dummy.position.set(s.x + 0.4, s.y, s.z + 0.2); dummy.rotation.set((r() - 0.5) * 0.3, r() * 6, (r() - 0.5) * 0.3); dummy.scale.set(1, 0.6 + r(), 1);
    dummy.updateMatrix(); tufts.setMatrixAt(i, dummy.matrix);
  });
  group.add(flowers, tufts);

  // --- wind-swept grass: Genshin / Ghibli meadows, swaying in the vertex shader ---
  const gspots = scatter(preset.grass, r, 1.5, 0);
  const n = gspots.length;
  const gp = new Float32Array(n * 9), gc = new Float32Array(n * 9), gw = new Float32Array(n * 3);
  gspots.forEach((s, i) => {
    const a = r() * Math.PI, w = 0.09 + r() * 0.06, h = 0.45 + r() * 0.7;
    const dx = Math.cos(a) * w, dz = Math.sin(a) * w, lean = (r() - 0.5) * 0.3;
    gp.set([s.x - dx, s.y, s.z - dz, s.x + dx, s.y, s.z + dz, s.x + lean, s.y + h, s.z + lean], i * 9);
    const base = color.setHSL(0.36 + (r() - 0.5) * 0.08, 0.55, 0.22);
    const tip = new THREE.Color().setHSL(r() < 0.12 ? 0.5 : 0.33 + r() * 0.06, 0.6, 0.48 + r() * 0.12);
    gc.set([base.r, base.g, base.b, base.r, base.g, base.b, tip.r, tip.g, tip.b], i * 9);
    gw.set([0, 0, 1], i * 3);
  });
  const gg = new THREE.BufferGeometry();
  gg.setAttribute('position', new THREE.BufferAttribute(gp, 3));
  gg.setAttribute('color', new THREE.BufferAttribute(gc, 3));
  gg.setAttribute('aTip', new THREE.BufferAttribute(gw, 1));
  const grassMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide, vertexColors: true,
    uniforms: { uTime: { value: 0 }, uFog: { value: new THREE.Color('#2b2466') } },
    vertexShader: /* glsl */`
      uniform float uTime; attribute float aTip; varying vec3 vC; varying float vDist;
      void main(){
        vec3 p = position;
        float gust = sin(p.x * .08 + uTime * 1.3) * .5 + sin(p.z * .11 + uTime * .9) * .5;
        p.x += aTip * (.18 + .22 * gust); p.z += aTip * .1 * sin(uTime * 2. + p.x);
        vC = color * (1. + aTip * .25 * gust);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uFog; varying vec3 vC; varying float vDist;
      void main(){ gl_FragColor = vec4(mix(vC, uFog, smoothstep(60., 300., vDist) * .7), 1.); }
    `,
  });
  const grass = new THREE.Mesh(gg, grassMat);
  group.add(grass);

  scene.add(group);
  return {
    update(t) {
      grassMat.uniforms.uTime.value = t;
      // canopies breathe with a soft bioluminescent pulse
      canopy.material.emissiveIntensity = 0.85 + Math.sin(t * 0.8) * 0.15;
      pools.material.opacity = 0.45 + Math.sin(t * 1.1) * 0.12;
    },
  };
}
