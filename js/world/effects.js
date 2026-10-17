// Fireworks and rising sky lanterns for the celebration. The stardust and the
// ribbons of light moved to magic.js.
import * as THREE from 'three';
import { glowTexture, rng } from './textures.js';

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
  const fireworks = new Fireworks(scene);
  const lanterns = new Lanterns(scene, preset.key === 'low' ? 60 : 120);
  return {
    fireworks, lanterns,
    update(t, dt, camera) {
      fireworks.update(dt);
      lanterns.update(t, dt, camera);
    },
  };
}
