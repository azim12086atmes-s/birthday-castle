// Floating islands, the plaza and fountain, the magical arch gate, travel
// portals, Lantern Lake and the little landmark on each island.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon, glowBasic, additive, nightGrade } from './materials.js';
import { grassTexture, rockTexture, flagstoneTexture, rosetteTexture, friezeTexture, glowTexture, textTexture, rng } from './textures.js';
import { ISLANDS, PORTALS, RETURNS, PLAZA, LAKE_POND, SPAWN, addCollider, groundAt, terrainHeight, groundHSL } from './layout.js';
import { archFrameGeometry, pointedArchPath } from './castle.js';
import { MOOD } from './sky.js';

// Rolling meadow: a polar grid lifted by the shared hill function, painted
// with vertex colours (sunny hilltops, cool hollows, flowery patches).
function terrainGeometry(isl) {
  const rings = Math.ceil(isl.r / 1.6), segs = isl.main ? 128 : 72;
  const pos = [], col = [], uv = [], idx = [];
  const c = new THREE.Color();
  for (let i = 0; i <= rings; i++) {
    const rr = (i / rings) * isl.r;
    const n = i === 0 ? 1 : segs;
    for (let j = 0; j < n; j++) {
      const a = (j / segs) * Math.PI * 2;
      const x = isl.x + Math.cos(a) * rr, z = isl.z + Math.sin(a) * rr;
      const h = terrainHeight(isl, x, z);
      pos.push(x, isl.y + h, z);
      uv.push(x / 6, z / 6);
      c.setHSL(...groundHSL(isl, x, z, h));
      col.push(c.r, c.g, c.b);
    }
  }
  for (let j = 0; j < segs; j++) idx.push(0, 1 + ((j + 1) % segs), 1 + j);
  for (let i = 1; i < rings; i++) {
    const a0 = 1 + (i - 1) * segs, a1 = 1 + i * segs;
    for (let j = 0; j < segs; j++) {
      const j1 = (j + 1) % segs;
      idx.push(a0 + j, a0 + j1, a1 + j, a0 + j1, a1 + j1, a1 + j);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function islandBody(isl, r) {
  const group = new THREE.Group();
  const grass = grassTexture().clone(); grass.needsUpdate = true;
  grass.repeat.set(isl.r / 6, isl.r / 6);
  const top = new THREE.Mesh(terrainGeometry(isl), nightGrade(new THREE.MeshLambertMaterial({ map: grass, vertexColors: true, emissive: '#10283a', emissiveIntensity: 0.5 }), 'terrain'));
  top.receiveShadow = true;
  const cliff = new THREE.Mesh(new THREE.CylinderGeometry(isl.r, isl.r * 0.96, 3, 72, 1, true), toon('#7a6a9a', { emissive: '#1a1440', emissiveIntensity: 0.6 }));
  cliff.position.set(isl.x, isl.y - 1.5, isl.z);
  group.add(cliff);

  // jagged rocky underside
  const h = isl.r * (isl.main ? 1.1 : 1.5);
  // a lathe profile from the rim down to a point, with smooth bulges so the
  // rock reads as big painted planes (T6)
  const prof = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    prof.push(new THREE.Vector2(Math.max(0.01, isl.r * 0.96 * Math.pow(1 - t, 0.75) * (1 + Math.sin(t * 9) * 0.04)), -t * h));
  }
  const geo = new THREE.LatheGeometry(prof.reverse(), 28);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const a = Math.atan2(z, x);
    const k = 1 + Math.sin(a * 5 + y * 0.3) * 0.08 + Math.sin(a * 11 + y * 0.7 + 1.3) * 0.05;
    pos.setXYZ(i, x * k, y, z * k);
  }
  geo.computeVertexNormals();
  const rock = rockTexture(); rock.repeat.set(4, 2);
  const underMat = new THREE.MeshLambertMaterial({ color: '#a592c8', map: rock, emissive: '#1a1440', emissiveIntensity: 0.7, side: THREE.DoubleSide });
  // some cone faces wind inward once displaced; shade both sides with the outward normal
  underMat.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nnormal = normalize(vNormal);'); };
  underMat.customProgramCacheKey = () => 'island-under';
  const under = new THREE.Mesh(geo, underMat);
  under.position.set(isl.x, isl.y - 3, isl.z);
  group.add(top, under);

  // hanging crystals and glowing vines
  const crystals = [];
  const vines = [];
  const nC = Math.round(isl.r / 3);
  for (let i = 0; i < nC; i++) {
    const a = r() * Math.PI * 2, d = isl.r * (0.3 + r() * 0.55);
    const len = 3 + r() * 7;
    const c = new THREE.ConeGeometry(0.6 + r() * 0.8, len, 5);
    c.rotateX(Math.PI);
    c.translate(isl.x + Math.cos(a) * d, isl.y - 3 - (1 - d / isl.r) * h * 0.55 - len / 2, isl.z + Math.sin(a) * d);
    crystals.push(c);
  }
  for (let i = 0; i < nC * 2; i++) {
    const a = r() * Math.PI * 2, len = 4 + r() * 10;
    const v = new THREE.CylinderGeometry(0.08, 0.02, len, 3);
    v.translate(isl.x + Math.cos(a) * isl.r * 0.97, isl.y - 2 - len / 2, isl.z + Math.sin(a) * isl.r * 0.97);
    vines.push(v);
  }
  const hue = isl.hue ?? 0.55;
  group.add(new THREE.Mesh(mergeGeometries(crystals), glowBasic(new THREE.Color().setHSL(hue, 0.8, 0.65))));
  group.add(new THREE.Mesh(mergeGeometries(vines), additive('#7ff3ff', { opacity: 0.7 })));

  // the rim glows faintly so islands read against the night
  const rim = new THREE.Mesh(new THREE.TorusGeometry(isl.r * 0.99, 0.25, 6, 72), additive(new THREE.Color().setHSL(hue, 0.9, 0.6), { opacity: 0.55 }));
  rim.rotation.x = Math.PI / 2; rim.position.set(isl.x, isl.y - 0.1, isl.z);
  group.add(rim);
  return group;
}

function portalDisk(color) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: /* glsl */`
      uniform float uTime; uniform vec3 uColor; varying vec2 vUv;
      void main(){
        vec2 p = vUv - .5; float r = length(p) * 2.; float a = atan(p.y, p.x);
        float swirl = .5 + .5 * sin(a * 5. + r * 12. - uTime * 3.);
        float edge = smoothstep(1., .85, r);
        vec3 c = mix(uColor, vec3(1.), swirl * (1. - r) * .7);
        gl_FragColor = vec4(c, edge * (.25 + swirl * .45) * (.4 + r * .6));
      }
    `,
  });
}

function label(text, color = '#ffe9b0') {
  const t = textTexture(text, { font: '600 40px Georgia, serif', color, glow: '#b98cff' });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, fog: false }));
  s.scale.set(t.userData.aspect * 1.6, 1.6, 1);
  return s;
}

function portal(x, y, z, angle, color, text) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = -angle + Math.PI / 2;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.28, 8, 48), glowBasic(color));
  ring.position.y = 3.6;
  const disk = new THREE.Mesh(new THREE.CircleGeometry(3.1, 40), portalDisk(color));
  disk.position.y = 3.6;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4, 0.5, 24), toon('#d9d2f5', { emissive: '#261d55' }));
  base.position.y = 0.25;
  const glow = new THREE.Mesh(new THREE.CircleGeometry(4.5, 24), additive(color, { map: glowTexture(), opacity: 0.6 }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = 0.55;
  const l = label(text); l.position.y = 8;
  g.add(ring, disk, base, glow, l);
  return { group: g, disk };
}

function fountain(group) {
  const g = new THREE.Group();
  g.position.set(PLAZA.x, 0, PLAZA.z);
  const stone = toon('#efe9ff', { emissive: '#2a2050' });
  const b1 = new THREE.Mesh(new THREE.CylinderGeometry(6, 6.4, 1.2, 32), stone); b1.position.y = 0.6;
  const water = new THREE.Mesh(new THREE.CircleGeometry(5.5, 32), additive('#5fd6ff', { opacity: 0.55, map: glowTexture() }));
  water.rotation.x = -Math.PI / 2; water.position.y = 1.15;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 4, 16), stone); stem.position.y = 2.6;
  const b2 = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 1.2, 0.8, 24), stone); b2.position.y = 4.6;
  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), glowBasic('#ffe7a8'));
  orb.position.y = 6.2;
  const orbGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffd27a', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  orbGlow.scale.setScalar(7); orbGlow.position.y = 6.2;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(6.2, 0.15, 6, 48), glowBasic('#ffd47a'));
  ring.rotation.x = Math.PI / 2; ring.position.y = 1.2;
  g.add(b1, water, stem, b2, orb, orbGlow, ring);
  group.add(g);
  addCollider({ x: PLAZA.x, z: PLAZA.z, r: 6.4 });
  return orb;
}

function archGate(group, x, z, w = 8, h = 10) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const frame = new THREE.Mesh(archFrameGeometry(w, h, 1.4, 1.6), toon('#f4efff', { emissive: '#2a2050', emissiveIntensity: 0.7 }));
  const trim = new THREE.Mesh(new THREE.TubeGeometry(pointedArchPath(w + 0.2, h + 0.1), 64, 0.16, 6, false), glowBasic('#ffd47a'));
  trim.position.z = 0.85;
  const trim2 = trim.clone(); trim2.position.z = -0.85;
  const fz = friezeTexture().clone(); fz.needsUpdate = true; fz.repeat.set(1, 1);
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(w, h), additive('#b98cff', { map: glowTexture(), opacity: 0.25, side: THREE.DoubleSide }));
  veil.position.y = h / 2;
  g.add(frame, trim, trim2, veil);
  group.add(g);
  addCollider({ x: x - w / 2 - 0.7, z, r: 1.2 });
  addCollider({ x: x + w / 2 + 0.7, z, r: 1.2 });
  return g;
}

function landmarks(group, r) {
  const byId = Object.fromEntries(ISLANDS.map((i) => [i.id, i]));
  const items = { spinning: [] };

  // Crystal Garden: towering crystal clusters
  const gI = byId.garden;
  const crystalMats = ['#7ff3ff', '#c9a6ff', '#ff9bd6'].map((c) => glowBasic(c));
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + r(), d = 8 + r() * 18;
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), crystalMats[i % 3]);
    const hgt = 3 + r() * 6;
    m.scale.set(1 + r(), hgt, 1 + r());
    m.position.set(gI.x + Math.cos(a) * d, 0, gI.z + Math.sin(a) * d);
    m.position.y = (groundAt(m.position.x, m.position.z) ?? gI.y) + hgt * 0.8;
    m.rotation.set((r() - 0.5) * 0.4, r() * 3, (r() - 0.5) * 0.4);
    group.add(m);
    addCollider({ x: m.position.x, z: m.position.z, r: 1.4 });
  }

  // Aurora Peak: an open pavilion with an onion dome, for stargazing
  const aI = byId.aurora;
  const pav = new THREE.Group(); pav.position.set(aI.x, aI.y, aI.z);
  const stone = toon('#f1ecff', { emissive: '#2a2050' });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 7, 8), stone);
    p.position.set(Math.cos(a) * 6, 3.5, Math.sin(a) * 6); pav.add(p);
  }
  const ringTop = new THREE.Mesh(new THREE.CylinderGeometry(6.8, 6.8, 1, 24), stone); ringTop.position.y = 7.5;
  const domePts = [[0, 0], [6.6, 0], [7.2, 2.4], [6.2, 5], [3.4, 7.6], [1, 9.4], [0, 10.6]].map(([x, y]) => new THREE.Vector2(x, y));
  const dome = new THREE.Mesh(new THREE.LatheGeometry(domePts, 24), toon('#2fb2b8', { emissive: '#0d3a4a' }));
  dome.position.y = 8;
  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.25, 2.4, 6), glowBasic('#ffd47a')); finial.position.y = 19.6;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(6.6, 8), additive('#7ff3ff', { map: glowTexture(), opacity: 0.4 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.05;
  pav.add(ringTop, dome, finial, floor);
  group.add(pav);

  // Lantern Lake: a shimmering pond and the wish pavilion
  const lI = byId.lake;
  // A sky mirror (references U25 / U34, technique T19): the water reflects the
  // dusk or aurora sky with a fresnel blend, rippled by moving wavelets, with a
  // bright glowing shoreline (T11). No render-to-texture, so it costs nothing.
  const pond = new THREE.Mesh(new THREE.CircleGeometry(LAKE_POND.r, 64), new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uNight: MOOD.night },
    vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: /* glsl */`
      uniform float uTime; uniform float uNight; varying vec2 vUv; varying vec3 vW;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 p = vUv - .5; float r = length(p) * 2.;
        // wavelets bend the reflection
        vec2 q = vW.xz;
        vec3 n = normalize(vec3(
          sin(q.x * .9 + uTime * 1.3) * .5 + sin(q.x * 2.3 - q.y * 1.7 + uTime * 2.1) * .25,
          6.,
          sin(q.y * 1.1 - uTime * 1.1) * .5 + sin(q.y * 2.7 + q.x * 1.3 + uTime * 1.7) * .25));
        vec3 v = normalize(vW - cameraPosition);
        vec3 rd = reflect(v, n);
        float up = clamp(rd.y, 0., 1.);
        vec3 duskSky = mix(vec3(.98, .72, .62), vec3(.55, .46, .78), pow(up, .6));
        vec3 nightSky = mix(vec3(.20, .17, .45), vec3(.04, .04, .14), pow(up, .6));
        // aurora ribbons mirrored in the water at night
        nightSky += vec3(.2, .9, .7) * smoothstep(.6, 1., sin(rd.x * 6. + rd.z * 3. + uTime * .3)) * smoothstep(.15, .5, up) * .18;
        vec3 sky = mix(duskSky, nightSky, uNight);
        vec3 deep = mix(vec3(.10, .22, .32), vec3(.02, .05, .16), uNight);
        float fres = .25 + .75 * pow(1. - abs(v.y), 3.);
        vec3 c = mix(deep, sky, fres);
        // drifting star glints
        vec2 g = floor(vUv * 110.); float s = step(.988, h(g)) * (.5 + .5 * sin(uTime * 3. + h(g + 1.) * 40.));
        c += vec3(1., .9, .7) * s * (.3 + .7 * uNight);
        // glowing shoreline
        c += vec3(.4, .95, 1.) * smoothstep(.86, 1., r) * (.35 + .4 * uNight);
        gl_FragColor = vec4(c, 1.);
      }
    `,
  }));
  pond.rotation.x = -Math.PI / 2; pond.position.set(LAKE_POND.x, lI.y + 0.06, LAKE_POND.z);
  group.add(pond);
  items.pond = pond;

  const shrine = new THREE.Group();
  const sx = lI.x + 26, sz = lI.z - 10;
  shrine.position.set(sx, lI.y, sz);
  for (const [px, pz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 5, 8), toon('#c0392b', { emissive: '#3a0a0a' }));
    p.position.set(px, 2.5, pz); shrine.add(p);
  }
  const roof = new THREE.Mesh(new THREE.ConeGeometry(5.6, 3, 4), toon('#3d3aa8', { emissive: '#1a1440' }));
  roof.position.y = 6.4; roof.rotation.y = Math.PI / 4; shrine.add(roof);
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 10), glowBasic('#ffb347'));
  lantern.scale.y = 1.3; lantern.position.y = 3.6; shrine.add(lantern);
  const lg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffb347', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  lg.scale.setScalar(7); lg.position.y = 3.6; shrine.add(lg);
  const l = label('Wish Lantern Shrine'); l.position.y = 9; shrine.add(l);
  group.add(shrine);
  items.shrine = new THREE.Vector3(sx, lI.y, sz);

  // Starfall Isle: a smaller arch gate and a floating star
  const st = byId.star;
  archGate(group, st.x, st.z - 6, 6, 8).position.y = st.y;
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(1.6, 0), glowBasic('#fff2b0'));
  star.position.set(st.x, st.y + 6, st.z - 6);
  group.add(star);
  items.spinning.push(star);
  return items;
}

// Island signatures from the world build plan (U137, U96, U124): rubble
// orbiting every island, a waterfall pouring off its edge into the clouds, and
// a light pillar in each island's colour so you can see where to travel.
function islandExtras(group, r, preset) {
  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  const rockMat = new THREE.MeshLambertMaterial({ color: '#a592c8', emissive: '#1a1440', emissiveIntensity: 0.7 });
  const perIsland = preset.particles > 1000 ? 14 : 8;
  const ring = new THREE.InstancedMesh(rockGeo, rockMat, ISLANDS.length * perIsland);
  const orbit = [];
  let k = 0;
  for (const isl of ISLANDS) {
    for (let i = 0; i < perIsland; i++, k++) {
      orbit.push({ isl, a: r() * Math.PI * 2, d: isl.r * (1.15 + r() * 0.35), y: isl.y - 4 - r() * isl.r * 0.35, s: 0.8 + r() * (isl.main ? 3.2 : 2), sp: (0.02 + r() * 0.03) * (r() < 0.5 ? 1 : -1), bob: r() * 6.28 });
    }
  }
  group.add(ring);

  // waterfalls: a curved ribbon with scrolling streaks, fading into mist below
  const fallMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uNight: MOOD.night },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: /* glsl */`
      uniform float uTime; uniform float uNight; varying vec2 vUv;
      float h(float x){ return fract(sin(x * 91.7) * 4375.5); }
      void main(){
        float col = floor(vUv.x * 28.);
        float streak = fract(vUv.y * 3. + uTime * (0.6 + h(col) * 0.5) + h(col + 3.));
        float s = smoothstep(0.0, 0.6, streak) * (0.55 + 0.45 * h(col + 7.));
        float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
        float fade = smoothstep(0.0, 0.55, vUv.y);
        vec3 c = mix(vec3(0.85, 0.9, 1.0), vec3(0.45, 0.85, 1.0), uNight);
        gl_FragColor = vec4(c * (0.75 + 0.35 * s), (0.35 + 0.45 * s) * edge * fade);
      }
    `,
  });
  const falls = [];
  for (const isl of ISLANDS) {
    const a = isl.main ? -2.2 : Math.atan2(-isl.z, -isl.x) + Math.PI * 0.6;
    const w = isl.main ? 9 : 5, drop = isl.main ? 70 : 40;
    const g = new THREE.PlaneGeometry(w, drop, 1, 12);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const t = (p.getY(i) + drop / 2) / drop;   // 1 at top, 0 at bottom
      p.setZ(i, Math.pow(1 - t, 1.6) * drop * 0.18);       // arcs outward as it falls
    }
    g.translate(0, -drop / 2, 0);
    const m = new THREE.Mesh(g, fallMat);
    m.position.set(isl.x + Math.cos(a) * (isl.r + 0.3), isl.y + 0.2, isl.z + Math.sin(a) * (isl.r + 0.3));
    m.rotation.y = Math.PI / 2 - a;
    falls.push(m); group.add(m);
  }

  // beacon pillars, one colour per island
  const beaconGeo = new THREE.CylinderGeometry(1.6, 2.4, 160, 12, 1, true); beaconGeo.translate(0, 80, 0);
  const beaconMats = [];
  for (const isl of ISLANDS) {
    if (isl.main) continue;
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color().setHSL(isl.hue, 0.85, 0.62) }, uNight: MOOD.night },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: /* glsl */`
        uniform float uTime; uniform vec3 uColor; uniform float uNight; varying vec2 vUv;
        void main(){
          float a = (1. - vUv.y) * (0.6 + 0.4 * sin(vUv.y * 30. - uTime * 2.));
          gl_FragColor = vec4(uColor, a * (0.12 + 0.18 * uNight));
        }
      `,
    });
    beaconMats.push(mat);
    const b = new THREE.Mesh(beaconGeo, mat);
    b.position.set(isl.x, isl.y, isl.z);
    b.renderOrder = 2;
    group.add(b);
  }

  const d = new THREE.Object3D();
  return {
    update(t) {
      fallMat.uniforms.uTime.value = t;
      for (const m of beaconMats) m.uniforms.uTime.value = t;
      orbit.forEach((o, i) => {
        const a = o.a + t * o.sp;
        d.position.set(o.isl.x + Math.cos(a) * o.d, o.y + Math.sin(t * 0.5 + o.bob) * 1.2, o.isl.z + Math.sin(a) * o.d);
        d.rotation.set(t * 0.1 + o.bob, t * 0.07, 0); d.scale.set(o.s, o.s * 0.8, o.s);
        d.updateMatrix(); ring.setMatrixAt(i, d.matrix);
      });
      ring.instanceMatrix.needsUpdate = true;
    },
  };
}

// The forecourt's golden armillary (U380): three gold rings turning slowly
// around the fountain's glowing orb.
function armillarySphere(group, orb) {
  const g = new THREE.Group();
  const gold = toon('#e0b040', { emissive: '#6a4a10', emissiveIntensity: 0.9 });
  const rings = [2.2, 1.9, 1.6].map((rad, i) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.08, 6, 48), gold);
    g.add(m);
    return m;
  });
  rings[1].rotation.x = Math.PI / 2;
  g.position.set(PLAZA.x, orb.position.y, PLAZA.z);
  group.add(g);
  return {
    update(t, y) {
      g.position.set(PLAZA.x, y, PLAZA.z);
      rings[0].rotation.y = t * 0.3;
      rings[1].rotation.z = t * 0.22;
      rings[2].rotation.set(t * 0.17, 0, Math.PI / 4);
    },
  };
}

export function createIslands(scene, preset) {
  const group = new THREE.Group();
  const r = rng(42);
  for (const isl of ISLANDS) group.add(islandBody(isl, r));
  const islandLife = islandExtras(group, r, preset);

  // plaza of warm pale flagstones with an eight-fold star inlay round the fountain
  const flag = flagstoneTexture(); flag.repeat.set(PLAZA.r / 5, PLAZA.r / 5);
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(PLAZA.r, 64), new THREE.MeshLambertMaterial({ map: flag, emissive: '#2a2050', emissiveIntensity: 0.35 }));
  plaza.rotation.x = -Math.PI / 2; plaza.position.set(PLAZA.x, 0.03, PLAZA.z);
  plaza.receiveShadow = true;
  const inlay = new THREE.Mesh(new THREE.CircleGeometry(14, 64), new THREE.MeshLambertMaterial({ map: rosetteTexture(), emissive: '#2a2050', emissiveIntensity: 0.35, polygonOffset: true, polygonOffsetFactor: -1 }));
  inlay.rotation.x = -Math.PI / 2; inlay.position.set(PLAZA.x, 0.05, PLAZA.z);
  inlay.receiveShadow = true;
  group.add(inlay);
  const plazaRing = new THREE.Mesh(new THREE.RingGeometry(PLAZA.r - 0.4, PLAZA.r, 96), additive('#ffd47a', { opacity: 0.8 }));
  plazaRing.rotation.x = -Math.PI / 2; plazaRing.position.set(PLAZA.x, 0.05, PLAZA.z);
  group.add(plaza, plazaRing);
  const fountainOrb = fountain(group);
  const armillary = armillarySphere(group, fountainOrb);

  // the magical arch gate you walk through after arriving
  archGate(group, SPAWN.x, SPAWN.z - 12, 9, 11);

  // travel portals and their way back
  const disks = [];
  const portals = PORTALS.map((p) => {
    const isl = ISLANDS.find((i) => i.id === p.to);
    const col = new THREE.Color().setHSL(isl.hue, 0.85, 0.62);
    const pt = portal(p.x, p.y, p.z, p.angle, col, '✦ ' + p.name);
    group.add(pt.group); disks.push(pt.disk);
    return { ...p, kind: 'to' };
  });
  const returns = RETURNS.map((p) => {
    const pt = portal(p.x, p.y, p.z, p.angle, '#ffd47a', '✦ Back to the Castle');
    group.add(pt.group); disks.push(pt.disk);
    return { ...p, kind: 'back' };
  });

  const items = landmarks(group, r);
  scene.add(group);

  return {
    portals, returns, shrine: items.shrine,
    update(t) {
      for (const d of disks) d.material.uniforms.uTime.value = t;
      items.pond.material.uniforms.uTime.value = t;
      fountainOrb.position.y = 6.2 + Math.sin(t * 1.5) * 0.3;
      islandLife.update(t);
      armillary.update(t, fountainOrb.position.y);
      for (const s of items.spinning) { s.rotation.y = t; s.position.y += Math.sin(t * 2) * 0.01; }
    },
  };
}
