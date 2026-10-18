// One shared look for the whole world (Oct 17 look pass, after studying Arkenfall, Genshin and
// Infinity Nikki): every surface, built-in or custom, goes through the same atmosphere, and
// the frame through the same tone curve and grade. That shared pass is most of what makes
// those games feel cohesive: models from many sources sit in one light and one air.
//
// The atmosphere is height fog with aerial perspective: the near world (a few hundred metres)
// stays crisp and saturated, distant ridges sink into a cool haze that warms toward the
// sun or moon, and the haze thins with height so the peaks and the sky palace rise out of it.
import * as THREE from 'three';

// Shared uniform values. Float32Arrays are passed by reference when three.js clones the
// built-in materials' uniforms, so updating these once a frame updates every material.
export const ATMOS = {
  sun: new Float32Array([0, 0.3, -1, 0.6]),          // xyz light direction, w = glow toward it
  sunCol: new Float32Array([1, 0.8, 0.6, 1 / 650]),  // rgb haze colour toward the light, w = height falloff (1/m)
  params: new Float32Array([1 / 9000, 0, 450, 0.92]),// x density at base (1/m), y base height, z clear distance, w max opacity
  mist: new Float32Array([1 / 3000, 160, 500, 0]),    // valley mist: x density (1/m), y top height, z clear distance, w time
};
const U = {
  fogSun: { value: ATMOS.sun }, fogSunCol: { value: ATMOS.sunCol }, fogParams: { value: ATMOS.params }, fogMist: { value: ATMOS.mist },
};

// GLSL: the haze any shader can call with its world position.
export const ATMOS_GLSL = /* glsl */`
  uniform vec4 fogSun; uniform vec4 fogSunCol; uniform vec4 fogParams; uniform vec4 fogMist;
  float mistHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float mistNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mistHash(i), mistHash(i + vec2(1.0, 0.0)), f.x), mix(mistHash(i + vec2(0.0, 1.0)), mistHash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float atmosPath(float d, float d0, float d1) {
    float a = clamp(d - d0, 0.0, d1 - d0);
    return a * a / (2.0 * max(d1 - d0, 1.0)) + max(d - d1, 0.0);
  }
  vec3 atmosHaze(vec3 dir, vec3 ambient) {
    float mu = max(dot(dir, fogSun.xyz), 0.0);
    vec3 c = mix(ambient, fogSunCol.rgb, clamp(mu * mu * mu, 0.0, 1.0));
    return c + fogSunCol.rgb * pow(mu, 18.0) * fogSun.w;
  }
  float atmosAmount(vec3 wpos) {
    if (fogParams.x <= 0.0) return 0.0;
    vec3 rd = wpos - cameraPosition;
    float dist = length(rd);
    float k = fogSunCol.w;
    float h0 = max(cameraPosition.y - fogParams.y, -60.0), h1 = max(wpos.y - fogParams.y, -60.0);
    float dh = h1 - h0;
    float avg = abs(dh) > 1.0 ? (exp(-k * h0) - exp(-k * h1)) / (k * dh) : exp(-k * h0);
    float tau = fogParams.x * avg * atmosPath(dist, fogParams.z * 0.3, fogParams.z * 1.6);
    // valley mist (after Arkenfall): banks lying low out in the valleys, never close round the
    // viewer, broken into drifting banks with open lanes between them
    if (fogMist.x > 0.0) {
      float low = 1.0 - smoothstep(fogMist.y * 0.3, fogMist.y, wpos.y);
      float bank = smoothstep(0.3, 0.7, mistNoise(wpos.xz / 2200.0 + fogMist.w * 0.003) * 0.7 + mistNoise(wpos.xz / 700.0 - fogMist.w * 0.005) * 0.3);
      tau += fogMist.x * max(dist - fogMist.z, 0.0) * low * bank;
    }
    return (1.0 - exp(-tau)) * fogParams.w;
  }
  vec3 atmosApply(vec3 col, vec3 wpos, vec3 ambient) {
    vec3 rd = wpos - cameraPosition;
    float f = atmosAmount(wpos);
    return mix(col, atmosHaze(rd / max(length(rd), 1e-3), ambient), f);
  }
`;

// uniforms to spread into a custom ShaderMaterial that calls atmosApply
export function atmosUniforms(fogColor) {
  return { ...U, uAtmosAmbient: { value: fogColor } };
}

// Replace three's fog chunks so every built-in material (models, palace, trees, grass,
// sprites, points) gets the same haze. Call once before anything renders.
export function installAtmosphere() {
  const C = THREE.ShaderChunk;
  C.fog_pars_vertex = '#ifdef USE_FOG\n varying vec3 vAtmosW;\n#endif';
  // world position from the view-space position (works for meshes, instances, sprites and points)
  C.fog_vertex = '#ifdef USE_FOG\n vAtmosW = cameraPosition + transpose(mat3(viewMatrix)) * mvPosition.xyz;\n#endif';
  C.fog_pars_fragment = '#ifdef USE_FOG\n uniform vec3 fogColor; varying vec3 vAtmosW;\n' + ATMOS_GLSL + '\n#endif';
  C.fog_fragment = '#ifdef USE_FOG\n gl_FragColor.rgb = atmosApply(gl_FragColor.rgb, vAtmosW, fogColor);\n#endif';
  for (const lib of Object.values(THREE.ShaderLib)) {
    if (lib.uniforms && lib.uniforms.fogColor) Object.assign(lib.uniforms, U);
  }
}

const _c = new THREE.Color();
// mood: 0 day / dusk, 1 night. golden: 0..1 low sun. lightDir: the key light's direction.
export function updateAtmosphere(mood, golden, lightDir, fogColor) {
  ATMOS.sun[0] = lightDir.x; ATMOS.sun[1] = lightDir.y; ATMOS.sun[2] = lightDir.z;
  ATMOS.sun[3] = THREE.MathUtils.lerp(0.55 + golden * 0.6, 0.25, mood);
  // day: soft blue-lilac air with a warm glow toward the sun; night: deep indigo, silver toward the moon
  _c.set('#ffd2a6').lerp(new THREE.Color('#ff9f6a'), golden).lerp(new THREE.Color('#7f86d6'), mood);
  ATMOS.sunCol[0] = _c.r; ATMOS.sunCol[1] = _c.g; ATMOS.sunCol[2] = _c.b;
  ATMOS.sunCol[3] = 1 / THREE.MathUtils.lerp(1100, 900, mood);
  ATMOS.params[0] = 1 / THREE.MathUtils.lerp(3000, 4500, mood);      // thick enough to swallow far towns (owner, Oct 18)
  ATMOS.params[2] = THREE.MathUtils.lerp(320, 260, mood);
  ATMOS.mist[0] = THREE.MathUtils.lerp(1 / 4500, 1 / 6000, mood); ATMOS.mist[3] = performance.now() / 1000;
  ATMOS.params[3] = 0.94;
  fogColor.set('#a8c0ec').lerp(new THREE.Color('#d8b7c8'), golden * 0.6).lerp(new THREE.Color('#1d1a4a'), mood);
}

// ---------------------------------------------------------------- grade --
// Filmic tone curve plus a light grade: warm highlights, cool shadows, a touch more colour,
// and a soft vignette, as in the stills of Genshin and Infinity Nikki.
export const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uNight: { value: 0 }, uVignette: { value: 0.22 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse; uniform float uNight, uVignette; varying vec2 vUv;
    void main(){
      vec4 t = texture2D(tDiffuse, vUv);
      vec3 c = t.rgb;
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      // split toning: cool lilac in the shadows, warm gold in the light (night: teal/violet)
      vec3 sh = mix(vec3(0.94, 0.97, 1.08), vec3(0.9, 0.95, 1.12), uNight);
      vec3 hi = mix(vec3(1.06, 1.01, 0.93), vec3(1.0, 0.97, 1.05), uNight);
      c *= mix(sh, hi, smoothstep(0.05, 0.6, l));
      // vibrance: lift muted colours more than saturated ones
      float mx = max(c.r, max(c.g, c.b)), mn = min(c.r, min(c.g, c.b));
      float sat = (mx - mn) / max(mx, 1e-4);
      c = mix(vec3(l), c, 1.0 + 0.22 * (1.0 - sat));
      // soft vignette
      vec2 q = vUv - 0.5;
      c *= 1.0 - uVignette * smoothstep(0.25, 0.85, dot(q, q) * 2.2);
      gl_FragColor = vec4(max(c, 0.0), t.a);
    }`,
};
