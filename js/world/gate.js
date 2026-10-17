// The white waterfall gate in the gap of the south mountains (study thread,
// design/world-fill/gate/gate.json): a veil of falling water under the arch, which
// parts from the centre when someone rides up to it (or the arrival scene reaches
// the falls), four thin side falls down the cliffs, mist at their feet, a faint
// rainbow by day, and a soft roar that hushes while the veil is open.
import * as THREE from 'three';
import { MOOD, FOG_COLOR, SUN_DIR } from './sky.js';

// the falls fill the V of the gap: narrow at the water, wide at the top
const VEIL = { x: -709.5, y: 100, z: 11250, w: 300, h: 200, bottom: 250, top: 450 };
const SIDE = [[-1010, 248, 28], [-410, 293, 28], [-1170, 400, 22], [-250, 500, 22]];   // x, top, width (all at z 11250)

function fallMaterial(map, opening) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {
      uMap: { value: map }, uTime: { value: 0 }, uOpen: { value: 0 }, uW: { value: VEIL.w }, uRep: { value: new THREE.Vector2(3, 2) },
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
      uniform sampler2D uMap; uniform float uTime, uOpen, uW, uNight, uFogNear, uFogFar, uOpening; uniform vec2 uRep; uniform vec3 uFog;
      varying vec2 vUv; varying float vX; varying float vDist;
      void main(){
        vec4 c = texture2D(uMap, vec2(vUv.x * uRep.x, vUv.y * uRep.y + uTime * 0.45));
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
    f.position.set(x, top / 2, VEIL.z - 6);
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
    const p = { sp, x: fx + (Math.random() - 0.5) * fw, z: VEIL.z + 5 + Math.random() * 25, t: Math.random() * 6, size: 30 + Math.random() * 30 };
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
  bow.position.set(VEIL.x, 4, VEIL.z + 40);
  group.add(bow);
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

  let open = 0, holdOpen = 0;
  return {
    // keep the veil open for a few more seconds (the arrival scene calls this)
    part(seconds = 6) { holdOpen = Math.max(holdOpen, seconds); },
    update(dt, t, cam) {
      const dx = cam.x - VEIL.x, dz = cam.z - VEIL.z, d = Math.hypot(dx, dz);
      group.visible = d < 18000;
      if (!group.visible) { roar(0); return; }
      // a rider coming up the gate axis parts the veil
      if (d < 400 && Math.abs(dx) < VEIL.w && cam.y < VEIL.y + VEIL.h) holdOpen = Math.max(holdOpen, 6);
      holdOpen = Math.max(0, holdOpen - dt);
      open = THREE.MathUtils.clamp(open + (holdOpen > 0 ? dt / 3 : -dt / 3), 0, 1);
      const so = open * open * (3 - 2 * open);
      for (const m of mats) { m.uniforms.uTime.value = t; m.uniforms.uOpen.value = so; }
      for (const p of puffs) {
        p.t += dt;
        if (p.t > 6) p.t -= 6;
        const k = p.t / 6;
        p.sp.position.set(p.x, 8 + k * 12, p.z);
        p.sp.scale.setScalar(p.size * (0.7 + k * 0.6));
        p.sp.material.opacity = 0.35 * Math.sin(k * Math.PI) * (d < 6000 ? 1 : 0);
      }
      bow.material.uniforms.uOpacity.value = 0.2 * (1 - MOOD.night.value) * THREE.MathUtils.smoothstep(SUN_DIR.y, 0.15, 0.45);
      roar(THREE.MathUtils.clamp(1 - d / 900, 0, 1) * (1 - 0.7 * so));
    },
    fog(near, far) { for (const m of mats) { m.uniforms.uFogNear.value = near; m.uniforms.uFogFar.value = far; } },
  };
}
