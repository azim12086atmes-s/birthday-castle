// The tarn and its brook in the beauty slice (Oct 18). Still water is a mirror: what makes a lake
// read as water in a game like Arkenfall is the far shore, the trees and the sky upside down in it,
// broken by little ripples, with the bed showing through only at the very edge. So the tarn renders
// the world reflected in its plane (half resolution, only while you're near and it's in view, with
// the grass and other fine clutter left out), and the brook is a ribbon of quick water running
// down the carved channel (layout.js carveWater) into it.
import * as THREE from 'three';
import { MOOD, SUN_DIR, MOON_DIR, FOG_COLOR } from './sky.js';
import { ATMOS_GLSL, atmosUniforms } from './look.js';
import { MAIN, TARN, BROOK, tarnR, terrainHeight } from './layout.js';

const NOISE = /* glsl */`
  float wHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float wNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(wHash(i), wHash(i + vec2(1, 0)), f.x), mix(wHash(i + vec2(0, 1)), wHash(i + vec2(1, 1)), f.x), f.y); }
`;

// how deep the tarn is at each point (r), baked once over its square, for the colour and the soft shore
function depthTexture(box) {
  const n = 96, data = new Uint8Array(n * n * 4);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = box.x + (i + 0.5) / n * box.s, z = box.z + (j + 0.5) / n * box.s, k = (j * n + i) * 4;
    data[k] = Math.round(Math.min(1, Math.max(0, (TARN.level - terrainHeight(MAIN, x, z)) / 4)) * 255);
    data[k + 3] = 255;
  }
  const t = new THREE.DataTexture(data, n, n, THREE.RGBAFormat);
  t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true;
  return t;
}

function tarnMesh(rt) {
  // the surface: a disc a little wider than the widest shore, its edge hidden by the soft depth fade
  const R = TARN.r * 1.3, box = { x: TARN.x - R, z: TARN.z - R, s: 2 * R };
  const geo = new THREE.CircleGeometry(R, 48).rotateX(-Math.PI / 2);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: true,
    uniforms: {
      tRefl: { value: rt.texture }, uTexM: { value: new THREE.Matrix4() }, uDepth: { value: depthTexture(box) }, uBox: { value: new THREE.Vector3(box.x, box.z, box.s) },
      uTime: { value: 0 }, uNight: MOOD.night, uSun: { value: SUN_DIR }, uMoon: { value: MOON_DIR }, ...atmosUniforms(FOG_COLOR),
    },
    vertexShader: /* glsl */`
      uniform mat4 uTexM; varying vec4 vR; varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vR = uTexM * vec4(position, 1.); gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`
      uniform sampler2D tRefl, uDepth; uniform vec3 uBox; uniform float uTime, uNight; uniform vec3 uSun, uMoon, uAtmosAmbient;
      varying vec4 vR; varying vec3 vW;
      ${ATMOS_GLSL}
      ${NOISE}
      void main(){
        float depth = texture2D(uDepth, (vW.xz - uBox.xy) / uBox.z).r * 4.0;
        if (depth < 0.01) discard;
        vec2 p = vW.xz;
        // cat's-paw ripples from the breeze, stiller in the lee of the shore
        vec2 g = vec2(wNoise(p * 0.9 + vec2(uTime * 0.35, uTime * 0.2)), wNoise(p * 0.9 - vec2(uTime * 0.25, -uTime * 0.3) + 7.)) - 0.5;
        g += (vec2(wNoise(p * 3.1 + uTime * 0.8), wNoise(p * 2.9 - uTime * 0.7 + 3.)) - 0.5) * 0.4;
        g *= 0.16 * (0.4 + 0.6 * smoothstep(0.35, 0.7, wNoise(p * 0.05 + uTime * 0.02)));
        vec3 n = normalize(vec3(g.x, 1., g.y));
        vec3 V = normalize(cameraPosition - vW);
        float fres = 0.04 + 0.96 * pow(1. - max(dot(n, V), 0.), 5.);
        // the world upside down in the water, shaken by the ripples
        vec2 ruv = vR.xy / vR.w + n.xz * 0.045;
        vec3 refl = texture2D(tRefl, ruv).rgb;
        // the water itself: peaty brown-green in the shallows, dark teal in the deep
        vec3 body = mix(vec3(0.09, 0.1, 0.05), vec3(0.012, 0.035, 0.04), smoothstep(0.2, 2.6, depth));
        vec3 c = mix(atmosApply(body, vW, uAtmosAmbient), refl, clamp(0.35 + fres, 0., 1.));
        vec3 L = normalize(mix(uSun, uMoon, uNight));
        float sd = max(dot(reflect(-V, n), L), 0.);
        c += mix(vec3(1., .86, .66), vec3(.7, .78, 1.), uNight) * (pow(sd, 600.) * 4. + pow(sd, 60.) * .25);
        // night: drifting motes of light on the black water
        c += vec3(.25, .85, .8) * smoothstep(.93, 1., wNoise(p * 1.7 + uTime * .1)) * uNight * .6;
        gl_FragColor = vec4(c, smoothstep(0.0, 0.3, depth));
      }`,
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.set(TARN.x, TARN.level, TARN.z);
  m.name = 'tarn';
  return m;
}

// the brook: a ribbon down the middle of its channel, its surface always falling toward the tarn
function brookMesh() {
  const pts = [];
  for (let k = 0; k < BROOK.length - 1; k++) {
    const [ax, az] = BROOK[k], [bx, bz] = BROOK[k + 1], L = Math.hypot(bx - ax, bz - az), n = Math.ceil(L / 2);
    for (let i = 0; i < n; i++) pts.push([ax + (bx - ax) * i / n, az + (bz - az) * i / n]);
  }
  pts.push(BROOK[BROOK.length - 1]);
  const pos = [], uv = [], idx = [];
  let y = Infinity, run = 0;
  pts.forEach(([x, z], i) => {
    const [px, pz] = pts[Math.max(0, i - 1)], [nx, nz] = pts[Math.min(pts.length - 1, i + 1)];
    let tx = nx - px, tz = nz - pz; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    y = Math.min(y, terrainHeight(MAIN, x, z) + 0.45);
    y = Math.max(y, TARN.level);
    if (i) run += Math.hypot(x - pts[i - 1][0], z - pts[i - 1][1]);
    const w = (1.35 + 0.3 * Math.sin(run * 0.11)) * (0.3 + 0.7 * Math.min(1, run / 40));   // a trickle at the spring
    pos.push(x - tz * w, y, z + tx * w, x + tz * w, y, z - tx * w);
    uv.push(0, run, 1, run);
    if (i) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  const mat = new THREE.ShaderMaterial({
    transparent: true, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uNight: MOOD.night, uSun: { value: SUN_DIR }, ...atmosUniforms(FOG_COLOR) },
    vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: /* glsl */`
      uniform float uTime, uNight; uniform vec3 uSun, uAtmosAmbient; varying vec2 vUv; varying vec3 vW;
      ${ATMOS_GLSL}
      ${NOISE}
      void main(){
        float edge = 1. - abs(vUv.x * 2. - 1.);
        // quick water: streaks racing downstream, chattering over the stones in the middle
        float flow = vUv.y - uTime * 1.6;
        float s = wNoise(vec2(vUv.x * 6., flow * 0.9)) * 0.6 + wNoise(vec2(vUv.x * 14., flow * 2.3)) * 0.4;
        vec3 V = normalize(cameraPosition - vW);
        float fres = pow(1. - max(V.y, 0.), 4.);
        vec3 sky = mix(pow(uAtmosAmbient, vec3(.4545)), vec3(.5, .62, .8), 0.4);
        // clear, shallow and dark: the stony bed shows through, the sky only glances off it
        vec3 c = mix(vec3(0.16, 0.15, 0.09), vec3(0.05, 0.08, 0.06), edge) * (0.8 + 0.4 * wNoise(vW.xz * 1.3));
        // running water is never still enough to mirror: it reads by the sky caught on its ripples
        float rip = wNoise(vec2(vUv.x * 9., flow * 1.7)) * 0.5 + wNoise(vW.xz * 2.2 + vec2(0., -uTime * 1.2)) * 0.5;
        c = mix(c, sky, clamp(0.3 + fres * 0.5 + (rip - 0.5) * 0.5, 0., 0.9));
        c += vec3(0.9) * smoothstep(0.7, 0.9, s) * edge * 0.5;
        float glint = pow(max(dot(reflect(-V, normalize(vec3((rip - 0.5) * 0.6, 1., (s - 0.5) * 0.6))), uSun), 0.), 200.);
        c += vec3(1., .9, .7) * glint * 2.5 * (1. - uNight);
        c *= mix(1., .45, uNight);
        c = pow(c, vec3(2.2));
        gl_FragColor = vec4(atmosApply(c, vW, uAtmosAmbient), smoothstep(0.0, 0.35, edge) * 0.92);
      }`,
  });
  const m = new THREE.Mesh(g, mat);
  m.name = 'brook';
  return m;
}

export function createBrook(scene, quality) {
  const size = quality.trees >= 200 ? 1024 : quality.trees >= 120 ? 640 : 0;
  const rt = new THREE.WebGLRenderTarget(Math.max(size, 2), Math.max(size >> 1, 2), { type: THREE.HalfFloatType });
  const tarn = tarnMesh(rt), brook = brookMesh();
  scene.add(tarn, brook);
  tarn.updateMatrixWorld();
  const vc = new THREE.PerspectiveCamera();
  const tgt = new THREE.Vector3(), dir = new THREE.Vector3(), plane = new THREE.Plane(), clip = new THREE.Vector4(), q = new THREE.Vector4();
  const bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
  const sphere = new THREE.Sphere(new THREE.Vector3(TARN.x, TARN.level, TARN.z), TARN.r * 1.3), frustum = new THREE.Frustum(), pm = new THREE.Matrix4();
  let hide = [], hideAt = -1;
  return {
    update(t) { tarn.material.uniforms.uTime.value = t; brook.material.uniforms.uTime.value = t; },
    // the tarn's mirror, drawn just before the frame
    mirror(renderer, scene, camera, t) {
      const near = camera.position.distanceTo(sphere.center) < 700;
      tarn.visible = brook.visible = camera.position.distanceTo(sphere.center) < 3000;
      if (!size || !near || camera.position.y < TARN.level) return;
      frustum.setFromProjectionMatrix(pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
      if (!frustum.intersectsSphere(sphere)) return;
      // the camera reflected in the water's plane
      const L = TARN.level;
      camera.getWorldDirection(dir);
      vc.position.set(camera.position.x, 2 * L - camera.position.y, camera.position.z);
      tgt.copy(camera.position).add(dir); tgt.y = 2 * L - tgt.y;
      vc.up.set(0, 1, 0).applyQuaternion(camera.quaternion); vc.up.y = -vc.up.y;
      vc.lookAt(tgt);
      vc.far = camera.far;
      vc.updateMatrixWorld();
      vc.projectionMatrix.copy(camera.projectionMatrix);
      tarn.material.uniforms.uTexM.value.copy(bias).multiply(vc.projectionMatrix).multiply(vc.matrixWorldInverse).multiply(tarn.matrixWorld);
      // clip away everything below the water (an oblique near plane)
      plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, L, 0)).applyMatrix4(vc.matrixWorldInverse);
      clip.set(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant);
      const e = vc.projectionMatrix.elements;
      q.set((Math.sign(clip.x) + e[8]) / e[0], (Math.sign(clip.y) + e[9]) / e[5], -1, (1 + e[10]) / e[14]);
      clip.multiplyScalar(2 / clip.dot(q));
      e[2] = clip.x; e[6] = clip.y; e[10] = clip.z + 1 - 0.003; e[14] = clip.w;
      // the grass and the drifting motes are too fine to see in a ripple: leave them out
      if (t - hideAt > 2) { hideAt = t; hide = []; scene.traverse((o) => { if (o.userData.noReflect) hide.push(o); }); }
      const was = hide.map((o) => o.visible);
      for (const o of hide) o.visible = false;
      tarn.visible = brook.visible = false;
      const prevT = renderer.getRenderTarget(), prevS = renderer.shadowMap.autoUpdate;
      renderer.shadowMap.autoUpdate = false;
      renderer.setRenderTarget(rt);
      renderer.clear();
      renderer.render(scene, vc);
      renderer.setRenderTarget(prevT);
      renderer.shadowMap.autoUpdate = prevS;
      hide.forEach((o, i) => { o.visible = was[i]; });
      tarn.visible = brook.visible = true;
    },
  };
}
