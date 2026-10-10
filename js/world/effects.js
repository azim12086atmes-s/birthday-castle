// Air full of magic: golden and bioluminescent stardust, flowing ribbons of
// light, fireworks and rising sky lanterns. Animated entirely on the GPU.
import * as THREE from 'three';
import { glowTexture, rng } from './textures.js';

function motes(count) {
  const r = rng(5);
  const pos = new Float32Array(count * 3), seed = new Float32Array(count), col = new Float32Array(count * 3);
  const gold = new THREE.Color('#ffd27a'), blue = new THREE.Color('#6fe8ff'), pink = new THREE.Color('#ff9bd6');
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (r() - 0.5) * 120; pos[i * 3 + 1] = r() * 40 - 4; pos[i * 3 + 2] = (r() - 0.5) * 120;
    seed[i] = r();
    const c = r() < 0.45 ? gold : r() < 0.8 ? blue : pink;
    col.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    uniforms: { uTime: { value: 0 }, uMap: { value: glowTexture() }, uCenter: { value: new THREE.Vector3() }, uScale: { value: 1 } },
    vertexShader: /* glsl */`
      uniform float uTime; uniform vec3 uCenter; uniform float uScale; attribute float aSeed; varying vec3 vC; varying float vA;
      void main(){
        vec3 p = position;
        p += vec3(sin(uTime * .3 + aSeed * 40.) * 2., sin(uTime * .5 + aSeed * 20.) * 1.5 + uTime * (.2 + aSeed * .3), cos(uTime * .25 + aSeed * 30.) * 2.);
        // wrap the field around the viewer so stardust is always nearby
        vec3 rel = mod(p - uCenter + vec3(60., 4., 60.), vec3(120., 40., 120.)) - vec3(60., 4., 60.);
        vec4 mv = modelViewMatrix * vec4(uCenter + rel, 1.);
        gl_Position = projectionMatrix * mv;
        float tw = .55 + .45 * sin(uTime * (1.5 + aSeed * 3.) + aSeed * 50.);
        gl_PointSize = (8. + aSeed * 14.) * tw * uScale * (60. / max(-mv.z, 1.));
        vC = color; vA = tw * smoothstep(60., 30., length(rel.xz));
      }
    `,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; varying vec3 vC; varying float vA;
      void main(){ gl_FragColor = vec4(vC, texture2D(uMap, gl_PointCoord).a * vA); }
    `,
  });
  const pts = new THREE.Points(g, mat);
  pts.frustumCulled = false;
  return pts;
}

function strokes(count) {
  const SEG = 70;
  const verts = count * (SEG + 1) * 2;
  const aS = new Float32Array(verts), aSide = new Float32Array(verts), aSeed = new Float32Array(verts);
  const index = [];
  const r = rng(13);
  let v = 0;
  for (let k = 0; k < count; k++) {
    const seed = r();
    for (let i = 0; i <= SEG; i++) {
      for (const side of [-1, 1]) { aS[v] = i / SEG; aSide[v] = side; aSeed[v] = seed + k; v++; }
      if (i < SEG) { const b = k * (SEG + 1) * 2 + i * 2; index.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts * 3), 3));
  g.setAttribute('aS', new THREE.BufferAttribute(aS, 1));
  g.setAttribute('aSide', new THREE.BufferAttribute(aSide, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
  g.setIndex(index);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */`
      uniform float uTime; attribute float aS; attribute float aSide; attribute float aSeed; varying float vS; varying float vSeed;
      vec3 curve(float u, float k){
        float R = 30. + fract(k * 7.31) * 70.;
        float y0 = 8. + fract(k * 3.17) * 45.;
        vec3 c = vec3(sin(k * 5.) * 30., 0., -20. + cos(k * 3.) * 30.);
        return c + vec3(R * cos(u), y0 + sin(u * 2.3 + k) * 10., R * .75 * sin(u * 1.3));
      }
      void main(){
        float k = aSeed;
        float head = uTime * (.06 + fract(k * 1.7) * .05) * (fract(k * 9.1) > .5 ? 1. : -1.) + k * 10.;
        float u = head - aS * .9;
        vec3 p = curve(u, k);
        vec3 t = normalize(curve(u + .01, k) - p);
        vec3 view = normalize(cameraPosition - p);
        vec3 side = normalize(cross(t, view));
        float w = (1. - aS) * (.35 + .25 * sin(aS * 20. - uTime * 3.));
        p += side * aSide * w;
        vS = aS; vSeed = k;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }
    `,
    fragmentShader: /* glsl */`
      varying float vS; varying float vSeed;
      void main(){
        vec3 gold = vec3(1., .8, .4), blue = vec3(.4, .9, 1.), pink = vec3(1., .5, .9);
        vec3 c = mix(gold, fract(vSeed * 3.3) > .5 ? blue : pink, vS);
        gl_FragColor = vec4(c, (1. - vS) * (1. - vS) * .9);
      }
    `,
  });
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;
  return mesh;
}

class Fireworks {
  constructor(scene, pool = 8, per = 180) {
    this.bursts = [];
    const r = rng(31);
    for (let b = 0; b < pool; b++) {
      const vel = new Float32Array(per * 3), seed = new Float32Array(per);
      for (let i = 0; i < per; i++) {
        const u = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - u * u), sp = 14 + r() * 4;
        vel.set([Math.cos(a) * s * sp, u * sp, Math.sin(a) * s * sp], i * 3);
        seed[i] = r();
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(per * 3), 3));
      g.setAttribute('aVel', new THREE.BufferAttribute(vel, 3));
      g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
      const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uT: { value: 99 }, uOrigin: { value: new THREE.Vector3() }, uColor: { value: new THREE.Color() }, uColor2: { value: new THREE.Color() }, uMap: { value: glowTexture() } },
        vertexShader: /* glsl */`
          uniform float uT; uniform vec3 uOrigin; attribute vec3 aVel; attribute float aSeed; varying float vA; varying float vSeed;
          void main(){
            float t = uT;
            float drag = (1. - exp(-t * 1.6)) / 1.6;
            vec3 p = uOrigin + aVel * drag + vec3(0., -2.5 * t * t, 0.);
            vec4 mv = modelViewMatrix * vec4(p, 1.);
            gl_Position = projectionMatrix * mv;
            vA = clamp(1. - t / 2.6, 0., 1.) * (.6 + .4 * sin(t * 30. + aSeed * 40.));
            vSeed = aSeed;
            gl_PointSize = 26. * (1. - t / 3.) * (60. / max(-mv.z, 1.));
          }
        `,
        fragmentShader: /* glsl */`
          uniform sampler2D uMap; uniform vec3 uColor; uniform vec3 uColor2; varying float vA; varying float vSeed;
          void main(){ gl_FragColor = vec4(mix(uColor, uColor2, step(.5, vSeed)), texture2D(uMap, gl_PointCoord).a * vA); }
        `,
      });
      const pts = new THREE.Points(g, mat);
      pts.frustumCulled = false; pts.visible = false;
      scene.add(pts);
      this.bursts.push(pts);
    }
    this.next = 0;
    this.palette = ['#ffd27a', '#ff6fb5', '#7ff3ff', '#b98cff', '#8dffb0', '#ffffff'];
  }
  launch(pos, c1, c2) {
    const b = this.bursts[this.next]; this.next = (this.next + 1) % this.bursts.length;
    const u = b.material.uniforms;
    u.uOrigin.value.copy(pos); u.uT.value = 0;
    u.uColor.value.set(c1 || this.palette[Math.floor(Math.random() * this.palette.length)]);
    u.uColor2.value.set(c2 || this.palette[Math.floor(Math.random() * this.palette.length)]);
    b.visible = true;
  }
  update(dt) {
    for (const b of this.bursts) {
      if (!b.visible) continue;
      b.material.uniforms.uT.value += dt;
      if (b.material.uniforms.uT.value > 3) b.visible = false;
    }
  }
}

class Lanterns {
  constructor(scene, count = 120) {
    const r = rng(23);
    this.mesh = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.45, 0.32, 0.9, 6),
      new THREE.MeshBasicMaterial({ color: '#ffb347', toneMapped: false }),
      count,
    );
    this.glow = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ff9a3c', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7 }),
      count,
    );
    this.items = Array.from({ length: count }, () => ({
      x: (r() - 0.5) * 220, z: (r() - 0.5) * 220, y: -10 - r() * 80, speed: 1 + r() * 1.5, seed: r() * 10,
    }));
    this.mesh.visible = this.glow.visible = false;
    this.mesh.frustumCulled = this.glow.frustumCulled = false;
    scene.add(this.mesh, this.glow);
    this.d = new THREE.Object3D();
  }
  set active(on) { this.mesh.visible = this.glow.visible = on; }
  update(t, dt, camera) {
    if (!this.mesh.visible) return;
    const d = this.d;
    this.items.forEach((it, i) => {
      it.y += it.speed * dt;
      if (it.y > 140) it.y = -20;
      d.position.set(it.x + Math.sin(t * 0.3 + it.seed) * 3, it.y, it.z + Math.cos(t * 0.2 + it.seed) * 3);
      d.quaternion.identity(); d.scale.setScalar(1);
      d.updateMatrix(); this.mesh.setMatrixAt(i, d.matrix);
      d.quaternion.copy(camera.quaternion); d.scale.setScalar(1 + Math.sin(t * 3 + it.seed) * 0.1);
      d.updateMatrix(); this.glow.setMatrixAt(i, d.matrix);
    });
    this.mesh.instanceMatrix.needsUpdate = true;
    this.glow.instanceMatrix.needsUpdate = true;
  }
}

export function createEffects(scene, preset) {
  const m = motes(preset.particles);
  const s = strokes(preset.strokes);
  scene.add(m, s);
  const fireworks = new Fireworks(scene);
  const lanterns = new Lanterns(scene, preset.key === 'low' ? 60 : 120);
  return {
    fireworks, lanterns,
    update(t, dt, camera, pixelRatio = 1) {
      m.material.uniforms.uTime.value = t;
      m.material.uniforms.uCenter.value.copy(camera.position);
      m.material.uniforms.uScale.value = pixelRatio;
      s.material.uniforms.uTime.value = t;
      fireworks.update(dt);
      lanterns.update(t, dt, camera);
    },
  };
}
