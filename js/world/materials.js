// Shared materials. Toon shading with three soft steps gives the painted,
// cel-like look of BotW / Genshin while being cheaper than PBR.
import * as THREE from 'three';

let ramp;
function toonRamp() {
  if (ramp) return ramp;
  const data = new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]);
  ramp = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
  ramp.needsUpdate = true;
  return ramp;
}

export function toon(color, opts = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: toonRamp(), ...opts });
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
