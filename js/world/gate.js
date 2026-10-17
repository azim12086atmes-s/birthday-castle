// The mountain gate (sky palace, study thread ridge/cliffs/SKY-PALACE.md): everyone
// arrives on the cloud platform south of the gate massif, the great doors swing open, a
// marble tunnel glows whiter toward its middle, and out of the north portal the sky bridge
// runs through a waterfall gushing from a notch above the portal. The veil parts round the
// deck when someone comes near; two side falls pour off the north face; a ring of cloud
// drifts round the platform; a faint rainbow by day and a roar that hushes while it is open.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { MOOD, FOG_COLOR, SUN_DIR } from './sky.js';

// the main fall in front of the north portal, from the notch at 1040 m down to the valley
const VEIL = { x: -710, y: 520, z: 10380, w: 70, h: 1040, bottom: 90, top: 60, speed: 1.3, deck: 688 };
const SIDE = [[-1010, 950, 30], [-410, 950, 30]];   // x, top, width (at the north face)
const DOORS = { x: -710, y: 688, z: 11878, half: 20, swing: Math.PI * 100 / 180 };
const TUNNEL = { x: -710, z0: 10420, z1: 11880, hw: 20, y: 688 };
const PLATFORM = { x: -710, z: 12020, y: 688 };

function fallMaterial(map, opening) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {
      uMap: { value: map }, uTime: { value: 0 }, uOpen: { value: 0 }, uW: { value: VEIL.w }, uRep: { value: new THREE.Vector2(1.2, 9) }, uSpeed: { value: VEIL.speed },
      uNight: MOOD.night, uFog: { value: FOG_COLOR }, uFogNear: { value: 900 }, uFogFar: { value: 16000 }, uOpening: { value: opening ? 1 : 0 },
    },
    vertexShader: /* glsl */`
      uniform float uOpen, uW, uOpening; varying vec2 vUv; varying float vX; varying float vDist;
      void main(){
        vec3 p = position;
        float g = uOpen * uW * 0.5 * uOpening;
        vX = p.x;
        p.x += sign(p.x) * g * 0.3;                  // each half slides outward as the gap grows
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform float uTime, uOpen, uW, uNight, uFogNear, uFogFar, uOpening, uSpeed; uniform vec2 uRep; uniform vec3 uFog;
      varying vec2 vUv; varying float vX; varying float vDist;
      void main(){
        vec4 c = texture2D(uMap, vec2(vUv.x * uRep.x, vUv.y * uRep.y + uTime * uSpeed));
        vec3 col = c.rgb * vec3(0.92, 0.97, 1.0) * 0.95;
        float a = c.a * smoothstep(0.0, 0.06, vUv.y) * smoothstep(0.0, 0.04, 1.0 - vUv.y);
        float g = uOpen * uW * 0.5 * uOpening;
        a *= mix(1.0, smoothstep(g - 8.0, g + 8.0, abs(vX)), uOpening);
        col *= mix(vec3(1.0), vec3(0.45, 0.55, 0.95), uNight);
        col = mix(col, uFog, smoothstep(uFogNear, uFogFar, vDist));
        gl_FragColor = vec4(col, a);
        #include <colorspace_fragment>
      }`,
  });
}

export function createGate(scene) {
  const group = new THREE.Group();
  group.name = 'waterfall-gate';
  const tex = new THREE.TextureLoader().load('data/world/gate/waterfall-512x1024.png');
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace;
  const mats = [];

  const veilMat = fallMaterial(tex, true); mats.push(veilMat);
  const veilGeo = new THREE.PlaneGeometry(VEIL.w, VEIL.h, 24, 1);
  const vp = veilGeo.attributes.position;
  for (let i = 0; i < vp.count; i++) { const k = (vp.getY(i) + VEIL.h / 2) / VEIL.h; vp.setX(i, vp.getX(i) / VEIL.w * (VEIL.bottom + (VEIL.top - VEIL.bottom) * k)); }
  const veil = new THREE.Mesh(veilGeo, veilMat);
  veil.position.set(VEIL.x, VEIL.y, VEIL.z);
  group.add(veil);

  for (const [x, top, w] of SIDE) {
    const m = fallMaterial(tex, false); m.uniforms.uRep.value.set(0.6, top / 100); mats.push(m);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(w, top), m);
    f.position.set(x, top / 2, VEIL.z);
    group.add(f);
  }

  // mist along the foot of the veil and of each side fall
  const mistTex = new THREE.TextureLoader().load('data/world/gate/mist-256.png');
  mistTex.colorSpace = THREE.SRGBColorSpace;
  const puffs = [];
  const feet = [[VEIL.x, VEIL.w], ...SIDE.map(([x, , w]) => [x, w * 2])];
  for (let i = 0; i < 40; i++) {
    const [fx, fw] = feet[i % feet.length];
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTex, transparent: true, depthWrite: false, opacity: 0 }));
    const p = { sp, x: fx + (Math.random() - 0.5) * fw, z: VEIL.z - 5 - Math.random() * 40, t: Math.random() * 6, size: 40 + Math.random() * 40 };
    group.add(sp); puffs.push(p);
  }

  // a faint rainbow in the spray by day
  const bow = new THREE.Mesh(new THREE.RingGeometry(70, 82, 64, 1, 0, Math.PI), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uOpacity: { value: 0.2 } },
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform float uOpacity; varying vec2 vP;
      vec3 hue(float h){ return clamp(abs(mod(h * 6. + vec3(0., 4., 2.), 6.) - 3.) - 1., 0., 1.); }
      void main(){ float r = (length(vP) - 70.) / 12.; gl_FragColor = vec4(hue(r * .8), smoothstep(0., .2, r) * smoothstep(1., .8, r) * uOpacity); }`,
  }));
  bow.position.set(VEIL.x, VEIL.deck - 60, VEIL.z - 60); bow.rotation.y = Math.PI;
  group.add(bow);

  // spray where the fall hits the bridge deck
  const spray = [];
  for (let i = 0; i < 14; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTex, transparent: true, depthWrite: false, opacity: 0 }));
    group.add(sp); spray.push({ sp, x: VEIL.x + (Math.random() - 0.5) * VEIL.w, z: VEIL.z - Math.random() * 30, t: Math.random() * 4, size: 24 + Math.random() * 24 });
  }

  // the great south doors: two marble and gold leaves, hinged at the portal's sides, swinging into the tunnel
  const leaves = [];
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('data/world/near/GateDoor.glb', (g) => {
    for (const s of [1, -1]) {
      const leaf = s > 0 ? g.scene : g.scene.clone();
      leaf.scale.x = s;
      leaf.position.set(DOORS.x - s * DOORS.half, DOORS.y, DOORS.z);
      group.add(leaf); leaves.push({ leaf, s });
    }
  });

  // a ring of cloud round the platform, a few drifting below the deck
  const clouds = [];
  for (let i = 0; i < 46; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTex, transparent: true, depthWrite: false, opacity: 0.55, color: '#fff6fb' }));
    const below = i % 5 === 0;
    clouds.push({ sp, a: Math.random() * Math.PI * 2, r: 160 + Math.random() * 260, y: below ? 520 + Math.random() * 120 : 600 + Math.random() * 120, size: 110 + Math.random() * 140, w: (Math.random() < 0.5 ? -1 : 1) * (0.004 + Math.random() * 0.006) });
    group.add(sp);
  }

  // the tunnel's white light: brighter toward its middle, washing the screen as you walk through
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse at center, #fff 0%, #fffaf2 55%, #fff4fb 100%);opacity:0;z-index:4;transition:opacity .2s';
  document.body.appendChild(glow);
  scene.add(group);

  // the roar: filtered noise, louder as you come close, hushed while the veil is open
  let audio = null;
  function roar(level) {
    if (!audio) {
      if (level < 0.01) return;
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
        let last = 0;
        for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
        const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
        const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
        const gain = ac.createGain(); gain.gain.value = 0;
        src.connect(lp).connect(gain).connect(ac.destination); src.start();
        audio = { ac, gain };
      } catch { audio = { gain: null }; }
    }
    if (audio.gain && audio.ac.state === 'suspended' && level > 0.01) audio.ac.resume();
    if (audio.gain) audio.gain.gain.setTargetAtTime(level * 0.25, audio.ac.currentTime, 0.4);
  }

  let open = 0, holdOpen = 0, doors = 0, holdDoors = 0;
  return {
    // open the doors and part the falls for a few more seconds (the arrival scene calls this)
    part(seconds = 6) { holdOpen = Math.max(holdOpen, seconds); holdDoors = Math.max(holdDoors, seconds + 20); },
    update(dt, t, cam) {
      const dx = cam.x - VEIL.x, dz = cam.z - VEIL.z, d = Math.hypot(dx, dz, cam.y - VEIL.deck);
      group.visible = Math.hypot(dx, dz) < 18000;
      if (!group.visible) { roar(0); glow.style.opacity = 0; return; }
      // anyone near the deck parts the falls; anyone near the doors opens them
      if (d < 150) holdOpen = Math.max(holdOpen, 4);
      if (Math.hypot(cam.x - DOORS.x, cam.z - DOORS.z) < 140 && Math.abs(cam.y - DOORS.y) < 80) holdDoors = Math.max(holdDoors, 4);
      holdOpen = Math.max(0, holdOpen - dt); holdDoors = Math.max(0, holdDoors - dt);
      doors = THREE.MathUtils.clamp(doors + (holdDoors > 0 ? dt / 4 : -dt / 5), 0, 1);
      const sd = doors * doors * (3 - 2 * doors);
      for (const { leaf, s } of leaves) leaf.rotation.y = s * DOORS.swing * sd;
      for (const c of clouds) {
        c.a += c.w * dt;
        c.sp.position.set(PLATFORM.x + Math.cos(c.a) * c.r, c.y + Math.sin(t * 0.1 + c.a * 3) * 6, PLATFORM.z + Math.sin(c.a) * c.r);
        c.sp.scale.setScalar(c.size);
        c.sp.material.color.setRGB(1, 1, 1).lerp(new THREE.Color(0.55, 0.6, 0.95), MOOD.night.value * 0.7);
      }
      for (const p of spray) {
        p.t += dt; if (p.t > 4) p.t -= 4;
        const k = p.t / 4;
        p.sp.position.set(p.x, VEIL.deck + 2 + k * 14, p.z - k * 20);
        p.sp.scale.setScalar(p.size * (0.6 + k));
        p.sp.material.opacity = 0.4 * Math.sin(k * Math.PI);
      }
      // inside the tunnel: whiter toward the middle
      const inT = Math.abs(cam.x - TUNNEL.x) < TUNNEL.hw + 4 && cam.z > TUNNEL.z0 && cam.z < TUNNEL.z1 && Math.abs(cam.y - TUNNEL.y - 3) < 30;
      const u = inT ? (cam.z - TUNNEL.z0) / (TUNNEL.z1 - TUNNEL.z0) : 0;
      glow.style.opacity = inT ? (0.12 + 0.4 * Math.sin(u * Math.PI) ** 2).toFixed(3) : 0;
      open = THREE.MathUtils.clamp(open + (holdOpen > 0 ? dt / 3 : -dt / 3), 0, 1);
      const so = open * open * (3 - 2 * open);
      for (const m of mats) { m.uniforms.uTime.value = t; m.uniforms.uOpen.value = so; }
      for (const p of puffs) {
        p.t += dt;
        if (p.t > 6) p.t -= 6;
        const k = p.t / 6;
        p.sp.position.set(p.x, 8 + k * 30, p.z);
        p.sp.scale.setScalar(p.size * (0.7 + k * 0.6));
        p.sp.material.opacity = 0.35 * Math.sin(k * Math.PI) * (d < 6000 ? 1 : 0);
      }
      bow.material.uniforms.uOpacity.value = 0.2 * (1 - MOOD.night.value) * THREE.MathUtils.smoothstep(SUN_DIR.y, 0.15, 0.45);
      roar(THREE.MathUtils.clamp(1 - d / 900, 0, 1) * (1 - 0.5 * so));
    },
    fog(near, far) { for (const m of mats) { m.uniforms.uFogNear.value = near; m.uniforms.uFogFar.value = far; } },
  };
}
