// The gemstone pathway: hexagonal glass tiles that light up, ripple and rise
// under every footstep and every click, for every player.
import * as THREE from 'three';
import { FOG_COLOR } from './sky.js';
import { PORTALS, PLAZA, SPAWN, CASTLE, MAIN } from './layout.js';
import { rng } from './textures.js';

const MAX_STEPS = 32;

function polylineTiles(points, width, spacing, r, out) {
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, az] = points[i], [bx, bz] = points[i + 1];
    const len = Math.hypot(bx - ax, bz - az);
    const nx = -(bz - az) / len, nz = (bx - ax) / len;
    for (let d = 0; d < len; d += spacing) {
      const t = d / len;
      const cx = ax + (bx - ax) * t, cz = az + (bz - az) * t;
      for (let w = -width; w <= width; w += spacing) {
        const j = (Math.floor(d / spacing) % 2) * spacing * 0.5;
        const x = cx + nx * (w + j) + (r() - 0.5) * 0.15, z = cz + nz * (w + j) + (r() - 0.5) * 0.15;
        if (Math.hypot(x - PLAZA.x, z - PLAZA.z) < PLAZA.r - 0.5) continue;
        if (out.some((p) => Math.abs(p[0] - x) < spacing * 0.7 && Math.abs(p[1] - z) < spacing * 0.7)) continue;
        out.push([x, z]);
      }
    }
  }
}

export function createPath(scene) {
  const r = rng(99);
  const tiles = [];
  const fz = CASTLE.z + 20;
  polylineTiles([[SPAWN.x, SPAWN.z + 18], [0, PLAZA.z], [0, fz + 1]], 3.4, 1.15, r, tiles);
  for (const p of PORTALS) {
    const a = Math.atan2(p.z - PLAZA.z, p.x - PLAZA.x);
    const sx = PLAZA.x + Math.cos(a) * (PLAZA.r - 1), sz = PLAZA.z + Math.sin(a) * (PLAZA.r - 1);
    polylineTiles([[sx, sz], [p.x - Math.cos(a) * 3.5, p.z - Math.sin(a) * 3.5]], 1.2, 1.15, r, tiles);
  }
  const usable = tiles.filter(([x, z]) => Math.hypot(x, z) < MAIN.r - 2);

  const geo = new THREE.CylinderGeometry(0.62, 0.62, 0.25, 6);
  const steps = Array.from({ length: MAX_STEPS }, () => new THREE.Vector4(0, 0, -100, 0));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSteps: { value: steps }, uFogColor: { value: FOG_COLOR } },
    vertexShader: /* glsl */`
      uniform float uTime; uniform vec4 uSteps[${MAX_STEPS}];
      varying float vGlow; varying vec3 vN; varying float vHue; varying float vTop; varying float vDist; varying float vR;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5); }
      void main(){
        vec4 c = instanceMatrix * vec4(0., 0., 0., 1.);
        float g = 0.;
        for (int i = 0; i < ${MAX_STEPS}; i++) {
          vec4 s = uSteps[i];
          float age = uTime - s.z;
          if (age < 0. || age > 4.) continue;
          float d = distance(c.xz, s.xy);
          float fade = 1. - age / 4.;
          g += s.w * exp(-d * d * .35) * fade;                                 // pool of light
          g += s.w * .8 * smoothstep(.9, 0., abs(d - age * 7.)) * fade * fade; // expanding ripple
        }
        vGlow = min(g, 2.5);
        vHue = hash(c.xz);
        vN = normalize(normalMatrix * mat3(instanceMatrix) * normal);
        vTop = step(.1, position.y);
        vR = length(position.xz) / .62;
        vec3 p = position;
        p.y += vGlow * .12 * vTop;
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(p, 1.);
        vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime; uniform vec3 uFogColor;
      varying float vGlow; varying vec3 vN; varying float vHue; varying float vTop; varying float vDist; varying float vR;
      vec3 hue(float h){ return clamp(abs(mod(h * 6. + vec3(0., 4., 2.), 6.) - 3.) - 1., 0., 1.); }
      void main(){
        vec3 gem = mix(vec3(.18, .28, .75), hue(.55 + vHue * .35), .35);
        float shimmer = .5 + .5 * sin(uTime * 2. + vHue * 30.);
        vec3 col = gem * (.45 + .25 * shimmer) + vec3(.3, .25, .6) * vTop * .3;
        // a faceted gem: bright table in the middle, darker bevelled rim
        col *= mix(1., mix(1.35, .7, smoothstep(.45, .95, vR)), vTop);
        col += vec3(.6, .8, 1.) * vTop * smoothstep(.35, 0., vR) * .25 * shimmer;
        vec3 glowCol = mix(vec3(1., .78, .35), vec3(.4, .9, 1.), vHue);
        col = mix(col, col * .4 + glowCol, clamp(vGlow * .55, 0., .85));
        col *= .7 + .3 * max(dot(vN, normalize(vec3(.3, 1., .2))), 0.);
        col = mix(col, uFogColor, smoothstep(140., 420., vDist) * .8);
        gl_FragColor = vec4(col, 1.);
      }
    `,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, usable.length);
  const d = new THREE.Object3D();
  usable.forEach(([x, z], i) => {
    d.position.set(x, 0.1, z); d.rotation.y = r() * 0.3; d.scale.set(0.95 + r() * 0.1, 1, 0.95 + r() * 0.1);
    d.updateMatrix(); mesh.setMatrixAt(i, d.matrix);
  });
  mesh.frustumCulled = false;
  scene.add(mesh);

  let cursor = 0;
  return {
    mesh,
    step(x, z, strength = 1) {
      steps[cursor].set(x, z, mat.uniforms.uTime.value, strength);
      cursor = (cursor + 1) % MAX_STEPS;
    },
    update(t) { mat.uniforms.uTime.value = t; },
  };
}
