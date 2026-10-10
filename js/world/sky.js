// Night sky: gradient, stars, milky way, aurora, moon, a supernova, a moonbow,
// a painterly sea of clouds below the islands and drifting cloud puffs.
import * as THREE from 'three';
import { glowTexture, sparkleTexture, cloudTexture, rng } from './textures.js';

export const FOG_COLOR = new THREE.Color('#2b2466');

const NOISE = /* glsl */`
  float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float hash13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
    return mix(mix(hash12(i), hash12(i+vec2(1,0)), f.x), mix(hash12(i+vec2(0,1)), hash12(i+vec2(1,1)), f.x), f.y); }
  float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < OCT; i++){ s += a * vnoise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
`;

function skyDome(preset) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    defines: { OCT: preset.skyOctaves },
    uniforms: { uTime: { value: 0 }, uCelebrate: { value: 0 } },
    vertexShader: /* glsl */`
      varying vec3 vDir;
      void main(){ vDir = position; vec4 p = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w * 0.9999; }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime; uniform float uCelebrate; varying vec3 vDir;
      ${NOISE}
      void main(){
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 zenith = vec3(0.02, 0.02, 0.09);
        vec3 mid = vec3(0.09, 0.06, 0.26);
        vec3 horizon = vec3(0.24, 0.17, 0.46);
        vec3 col = mix(horizon, mid, smoothstep(-0.05, 0.25, h));
        col = mix(col, zenith, smoothstep(0.25, 0.9, h));
        col = mix(col, vec3(0.17, 0.14, 0.40), smoothstep(0.0, -0.3, h));

        // milky way band
        vec3 n = normalize(vec3(0.35, 0.25, 1.0));
        float band = dot(d, n);
        float mw = exp(-band * band * 18.) * smoothstep(-0.1, 0.15, h);
        float dust = fbm(vec2(atan(d.z, d.x) * 3., d.y * 6.) + 3.);
        col += mw * (vec3(0.35, 0.22, 0.55) * dust + vec3(0.25, 0.35, 0.6) * dust * dust) * 0.9;
        col -= mw * smoothstep(0.55, 0.75, fbm(vec2(atan(d.z, d.x) * 9., d.y * 20.))) * 0.12; // dark lanes

        // stars, denser inside the milky way
        vec3 sp = d * 220.;
        vec3 id = floor(sp); vec3 f = fract(sp) - .5;
        float rnd = hash13(id);
        float thresh = 0.975 - mw * 0.05;
        float star = step(thresh, rnd) * smoothstep(0.22, 0.0, length(f - (hash13(id + 7.) - .5) * .5));
        float tw = .6 + .4 * sin(uTime * (1. + rnd * 4.) + rnd * 60.);
        vec3 starCol = mix(vec3(1., .85, .7), vec3(.7, .85, 1.), hash13(id + 3.));
        col += star * tw * starCol * smoothstep(-0.02, 0.1, h) * 1.4;

        // aurora curtains
        if (h > 0.0) {
          vec2 uv = d.xz / (h + 0.12);
          float t = uTime * 0.03;
          float acc = 0.;
          vec3 aur = vec3(0.);
          for (int i = 0; i < 3; i++) {
            float fi = float(i);
            float wave = sin(uv.x * (0.35 + fi * 0.1) + t * (1. + fi) + fbm(uv * 0.25 + fi + t) * 3.) * 1.2;
            float rib = abs(uv.y - (1.6 + fi * 0.9) - wave);
            float curtain = exp(-rib * 2.2);
            float streak = 0.55 + 0.45 * vnoise(vec2(uv.x * 9. + t * 8. + fi * 13., fi));
            float a = curtain * streak;
            vec3 c = mix(vec3(0.1, 0.95, 0.6), vec3(0.2, 0.7, 1.0), fi * 0.5);
            c = mix(c, vec3(0.9, 0.35, 0.95), smoothstep(0.3, 0.9, fract(uv.x * 0.05 + fi * 0.33)) * 0.6);
            aur += c * a;
            acc += a;
          }
          col += aur * smoothstep(0.02, 0.25, h) * smoothstep(0.95, 0.5, h) * (0.8 + uCelebrate * 0.3);
        }
        gl_FragColor = vec4(col, 1.);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), mat);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return mesh;
}

function cloudSea(preset) {
  const mat = new THREE.ShaderMaterial({
    fog: false, depthWrite: true,
    defines: { OCT: Math.max(2, preset.skyOctaves) },
    uniforms: { uTime: { value: 0 }, uFog: { value: FOG_COLOR } },
    vertexShader: /* glsl */`
      varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime; uniform vec3 uFog; varying vec3 vW;
      ${NOISE}
      void main(){
        vec2 p = vW.xz * 0.006 + vec2(uTime * 0.004, uTime * 0.002);
        float n = fbm(p) + 0.35 * fbm(p * 2.7 - uTime * 0.01);
        // toon steps give the painted, Zelda-like cloud tops
        float s = smoothstep(0.45, 0.5, n) * 0.35 + smoothstep(0.62, 0.66, n) * 0.35 + smoothstep(0.78, 0.82, n) * 0.3;
        vec3 low = vec3(0.20, 0.16, 0.42);
        vec3 high = vec3(0.78, 0.74, 0.98);
        vec3 col = mix(low, high, s);
        col += vec3(0.25, 0.35, 0.6) * pow(s, 3.) * 0.4; // moonlit rims
        float dist = length(vW.xz - cameraPosition.xz);
        col = mix(col, vec3(0.24, 0.18, 0.46), smoothstep(250., 850., dist));
        gl_FragColor = vec4(col, 1.);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400, 1, 1).rotateX(-Math.PI / 2), mat);
  mesh.position.y = -75;
  return mesh;
}

function moonAndStars(group) {
  const moonPos = new THREE.Vector3(-260, 330, -520);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#b9c8ff', transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  halo.position.copy(moonPos); halo.scale.setScalar(340);
  const disk = new THREE.Mesh(new THREE.CircleGeometry(38, 48), new THREE.MeshBasicMaterial({ color: '#fff6e0', fog: false }));
  disk.position.copy(moonPos); disk.lookAt(0, 0, 0);
  group.add(halo, disk);

  // a supernova that slowly breathes
  const nova = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkleTexture(), color: '#ffd4ff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  nova.position.set(420, 380, -260); nova.scale.setScalar(150);
  const novaGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ff7ad9', transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  novaGlow.position.copy(nova.position); novaGlow.scale.setScalar(260);
  group.add(nova, novaGlow);

  // moonbow: a faint rainbow arc
  const bow = new THREE.Mesh(
    new THREE.RingGeometry(380, 430, 96, 1, 0, Math.PI),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
      uniforms: { uOpacity: { value: 0.14 } },
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: /* glsl */`
        uniform float uOpacity; varying vec2 vP;
        vec3 hue(float h){ return clamp(abs(mod(h * 6. + vec3(0., 4., 2.), 6.) - 3.) - 1., 0., 1.); }
        void main(){ float r = (length(vP) - 380.) / 50.; float edge = smoothstep(0., .15, r) * smoothstep(1., .85, r);
          gl_FragColor = vec4(hue(r * .8), edge * uOpacity * smoothstep(0., 60., vP.y)); }
      `,
    }),
  );
  bow.position.set(120, -60, -620);
  group.add(bow);
  return { nova, novaGlow, bow };
}

function cloudPuffs(group, preset) {
  const r = rng(77);
  const map = cloudTexture();
  const puffs = [];
  for (let i = 0; i < preset.clouds; i++) {
    const a = r() * Math.PI * 2, d = 230 + r() * 420;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map, color: new THREE.Color().setHSL(0.7 + r() * 0.1, 0.5, 0.72 + r() * 0.15),
      transparent: true, opacity: 0.85, depthWrite: false, fog: true,
    }));
    s.position.set(Math.cos(a) * d, -55 + r() * 110, Math.sin(a) * d);
    const sc = 90 + r() * 140;
    s.scale.set(sc, sc * 0.6, 1);
    s.userData = { a, d, speed: (0.004 + r() * 0.006) * (r() < 0.5 ? 1 : -1) };
    group.add(s); puffs.push(s);
  }
  return puffs;
}

export function createSky(scene, preset) {
  const group = new THREE.Group();
  const dome = skyDome(preset);
  const sea = cloudSea(preset);
  group.add(dome, sea);
  const extras = moonAndStars(group);
  const puffs = cloudPuffs(group, preset);
  scene.add(group);

  return {
    dome, sea,
    update(t, camera) {
      dome.material.uniforms.uTime.value = t;
      sea.material.uniforms.uTime.value = t;
      dome.position.copy(camera.position);
      const k = 1 + Math.sin(t * 0.7) * 0.15;
      extras.nova.scale.setScalar(150 * k);
      extras.novaGlow.material.opacity = 0.35 + Math.sin(t * 0.7) * 0.15;
      for (const p of puffs) {
        p.userData.a += p.userData.speed * 0.016;
        p.position.x = Math.cos(p.userData.a) * p.userData.d;
        p.position.z = Math.sin(p.userData.a) * p.userData.d;
      }
    },
    setCelebration(on) {
      dome.material.uniforms.uCelebrate.value = on ? 1 : 0;
      extras.bow.material.uniforms.uOpacity.value = on ? 0.32 : 0.14;
    },
  };
}
