// Cinematic touches borrowed from environment-art practice, all nearly free:
// soft god rays slanting from the moon through the scene, light pouring out of
// the rose window, and low mist hugging the island edges for depth.
import * as THREE from 'three';
import { rng } from './textures.js';
import { CASTLE, ISLANDS } from './layout.js';
import { MOOD } from './sky.js';

function shaftMaterial(color, strength) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uStrength: { value: strength } },
    vertexShader: 'varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: /* glsl */`
      uniform float uTime; uniform vec3 uColor; uniform float uStrength; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float along = smoothstep(0., .25, vUv.y) * smoothstep(1., .55, vUv.y);    // fade at both ends
        float edge = pow(abs(dot(vN, vV)), 1.5);                                    // soft cylinder edges
        float flick = .8 + .2 * sin(uTime * .7 + vUv.x * 12.);
        gl_FragColor = vec4(uColor, along * edge * flick * uStrength);
      }
    `,
  });
}

export function createAtmosphere(scene, preset) {
  const group = new THREE.Group();
  const r = rng(404);
  const mats = [];
  const moonDir = new THREE.Vector3(-260, 330, -520).normalize();

  // moonbeams: long soft cylinders tilted along the moonlight
  for (let i = 0; i < preset.shafts; i++) {
    const m = shaftMaterial(i % 2 ? '#a9b8ff' : '#d9c4ff', 0.07 + r() * 0.05);
    mats.push(m);
    const len = 160 + r() * 80;
    const geo = new THREE.CylinderGeometry(4 + r() * 6, 10 + r() * 10, len, 16, 1, true);
    geo.translate(0, len / 2, 0);
    const beam = new THREE.Mesh(geo, m);
    const target = new THREE.Vector3((r() - 0.5) * 220, -10, (r() - 0.5) * 220 - 30);
    beam.position.copy(target);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), moonDir);
    group.add(beam);
  }

  // warm light spilling from the rose window and gate
  const roseBeam = new THREE.CylinderGeometry(4.5, 9, 26, 20, 1, true);
  roseBeam.translate(0, 13, 0);
  const rm = shaftMaterial('#ffcf8a', 0.16); mats.push(rm);
  const rose = new THREE.Mesh(roseBeam, rm);
  rose.position.set(CASTLE.x, CASTLE.y + 17 * CASTLE.s, CASTLE.z + 13 * CASTLE.s);
  rose.rotation.x = Math.PI / 2 + 0.35;
  group.add(rose);

  // mist rings around each floating island, for depth and scale
  for (const isl of ISLANDS) {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(isl.r * 0.85, isl.r * 1.6, 48, 1),
      new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { uR0: { value: isl.r * 0.85 }, uR1: { value: isl.r * 1.6 } },
        vertexShader: 'varying float vR; void main(){ vR = length(position.xy); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
        fragmentShader: 'uniform float uR0; uniform float uR1; varying float vR; void main(){ float k = (vR - uR0) / (uR1 - uR0); gl_FragColor = vec4(.78,.74,.98, smoothstep(0.,.25,k) * smoothstep(1.,.3,k) * .22); }',
      }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(isl.x, isl.y - 6, isl.z);
    group.add(m);
  }

  scene.add(group);
  // moonbeams belong to the night; at dusk they fade to a faint warm haze
  return { update(t) { for (const m of mats) { m.uniforms.uTime.value = t; m.userData.base ??= m.uniforms.uStrength.value; m.uniforms.uStrength.value = m.userData.base * (0.25 + 0.75 * MOOD.night.value); } } };
}
