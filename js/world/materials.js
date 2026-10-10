// Shared materials. Toon shading with three soft steps gives the painted,
// cel-like look of BotW / Genshin while being cheaper than PBR.
import * as THREE from 'three';
import { MOOD } from './sky.js';
const NIGHT = MOOD.night;

let ramp;
function toonRamp() {
  if (ramp) return ramp;
  const data = new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]);
  ramp = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
  ramp.needsUpdate = true;
  return ramp;
}

// Every toon surface gets a soft moonlit rim, the glowing silhouette edge that
// gives Breath of the Wild and Ghibli backgrounds their painted look.
const RIM = /* glsl */`
  vec3 rimView = normalize(vViewPosition);
  float rim = pow(1.0 - clamp(abs(dot(normal, rimView)), 0.0, 1.0), 3.0);
  vec3 rimUp = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
  rim *= 1.0 - smoothstep(0.4, 0.85, dot(normal, rimUp)); // keep flat ground unwashed
  outgoingLight += vec3(0.55, 0.62, 1.0) * rim * 0.45;
  #include <opaque_fragment>
`;

export function toon(color, opts = {}) {
  const m = new THREE.MeshToonMaterial({ color, gradientMap: toonRamp(), ...opts });
  m.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', RIM); };
  m.customProgramCacheKey = () => 'toon-rim';
  return m;
}

export function glowBasic(color, opts = {}) {
  return new THREE.MeshBasicMaterial({ color, toneMapped: false, ...opts });
}

export function additive(color, opts = {}) {
  return new THREE.MeshBasicMaterial({
    color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, ...opts,
  });
}

// Waving flag / banner: displaces vertices along a travelling sine.
export function flagMaterial(color, map = null) {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uMap: { value: map }, uHasMap: { value: map ? 1 : 0 } },
    vertexShader: /* glsl */`
      uniform float uTime; varying vec2 vUv; varying float vShade;
      void main(){
        vUv = uv;
        vec3 p = position;
        float k = uv.x;
        float w = sin(uv.x * 6. - uTime * 4. + uv.y * 1.5) * 0.35 * k + sin(uv.x * 11. - uTime * 6.) * 0.08 * k;
        p.z += w;
        vShade = 0.75 + 0.25 * cos(uv.x * 6. - uTime * 4.);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uColor; uniform sampler2D uMap; uniform float uHasMap; varying vec2 vUv; varying float vShade;
      void main(){
        vec4 c = vec4(uColor, 1.);
        if (uHasMap > .5) { vec4 t = texture2D(uMap, vUv); c.rgb = mix(c.rgb, t.rgb, t.a); }
        // golden border
        float b = step(vUv.y, .08) + step(.92, vUv.y);
        c.rgb = mix(c.rgb, vec3(1., .82, .35), clamp(b, 0., 1.));
        gl_FragColor = vec4(c.rgb * vShade, 1.);
      }
    `,
  });
}

// Night grade for living surfaces (grass, hedges, canopies): as the aurora night
// falls, greens cool to moonlit teal-blue instead of staying daylight-bright.
export function nightGrade(m, key) {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.uniforms.uNightG = NIGHT;
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uNightG;')
      .replace('#include <opaque_fragment>', 'outgoingLight *= mix(vec3(1.0), vec3(0.36, 0.46, 0.92), uNightG);\n#include <opaque_fragment>');
  };
  m.customProgramCacheKey = () => key + '-ng';
  return m;
}
