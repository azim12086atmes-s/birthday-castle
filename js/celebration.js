// Celebration mode (from midnight on her birthday) and her grand welcome
// cutscene, which plays for everyone in the world when she arrives.
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { toon, glowBasic } from './world/materials.js';
import { textTexture, glowTexture } from './world/textures.js';
import { CASTLE, PLAZA } from './world/layout.js';

function makeCake() {
  const g = new THREE.Group();
  const tiers = [[2.6, 1.3, '#fbe3f0'], [1.9, 1.1, '#e6dcff'], [1.25, 1, '#fff4dc']];
  let y = 0.6;
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.9, 0.6, 32), toon('#efe9ff', { emissive: '#2a2050' }));
  dais.position.y = 0.3; g.add(dais);
  for (const [r, h, c] of tiers) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32), toon(c, { emissive: new THREE.Color(c).multiplyScalar(0.25) }));
    t.position.y = y + h / 2; g.add(t);
    const icing = new THREE.Mesh(new THREE.TorusGeometry(r, 0.12, 6, 40), glowBasic('#ff9bd6'));
    icing.rotation.x = Math.PI / 2; icing.position.y = y + h; g.add(icing);
    const pearls = new THREE.Mesh(new THREE.TorusGeometry(r + 0.02, 0.07, 4, 40), glowBasic('#ffd47a'));
    pearls.rotation.x = Math.PI / 2; pearls.position.y = y + 0.1; g.add(pearls);
    y += h;
  }
  const flames = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2, r = i === 8 ? 0 : 0.8;
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6), toon(['#7ff3ff', '#ff9bd6', '#ffd47a'][i % 3]));
    candle.position.set(Math.cos(a) * r, y + 0.25, Math.sin(a) * r);
    const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffcf6a', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    flame.scale.set(0.35, 0.6, 1); flame.position.set(candle.position.x, y + 0.65, candle.position.z);
    g.add(candle, flame); flames.push(flame);
  }
  g.userData.flames = flames;
  return g;
}

export function createCelebration(scene, effects, sky, castle) {
  const name = CONFIG.honoreeName;
  const bannerTex = textTexture(`Happy Birthday, ${name}!`, { font: '700 96px "Cinzel Decorative", Georgia, serif', color: '#fff3c8', glow: '#ff9bd6', pad: 40 });
  const banner = new THREE.Sprite(new THREE.SpriteMaterial({ map: bannerTex, transparent: true, depthWrite: false, fog: false }));
  banner.scale.set(bannerTex.userData.aspect * 5, 5, 1);
  banner.position.set(CASTLE.x, 36, CASTLE.z + 22);
  const cake = makeCake();
  cake.position.set(PLAZA.x + 15, 0, PLAZA.z + 3);
  const group = new THREE.Group();
  group.add(banner, cake);
  group.visible = false;
  scene.add(group);

  let active = false;
  let fwTimer = 0;
  return {
    get active() { return active; },
    cakePosition: cake.position,
    setActive(on) {
      active = on;
      group.visible = on;
      effects.lanterns.active = on;
      sky.setCelebration(on);
    },
    burst(n = 1, center = new THREE.Vector3(CASTLE.x, 60, CASTLE.z)) {
      for (let i = 0; i < n; i++) {
        effects.fireworks.launch(new THREE.Vector3(center.x + (Math.random() - 0.5) * 90, center.y + Math.random() * 30, center.z + (Math.random() - 0.5) * 60));
      }
    },
    update(t, dt) {
      if (!active) return;
      banner.material.opacity = 0.85 + Math.sin(t * 2) * 0.15;
      for (const f of cake.userData.flames) f.scale.y = 0.55 + Math.random() * 0.15;
      fwTimer -= dt;
      if (fwTimer <= 0) { fwTimer = 1.6 + Math.random() * 2.2; this.burst(1 + (Math.random() < 0.3 ? 1 : 0)); }
    },
  };
}

// ---------------------------------------------------------------------------
// The grand welcome. Camera flies from the sea of clouds, past the unicorns and
// spires, through the gate, and comes to rest on her as fireworks bloom.
export function playWelcome({ camera, castle, celebration, controller, target, ui, onDone }) {
  const name = CONFIG.honoreeName;
  const lines = CONFIG.welcomeLines.map((l) => l.replaceAll('{name}', name));
  const tgt = target.clone();
  const keys = [
    [new THREE.Vector3(40, 150, 300), new THREE.Vector3(0, 40, -48)],
    [new THREE.Vector3(150, 95, 110), new THREE.Vector3(0, 45, -48)],
    [new THREE.Vector3(70, 60, -5), new THREE.Vector3(0, 55, -51)],
    [new THREE.Vector3(-35, 22, 0), new THREE.Vector3(0, 12, -28)],
    [new THREE.Vector3(0, 7, 2), new THREE.Vector3(0, 7, -28)],
    [tgt.clone().add(new THREE.Vector3(0, 3, -7)), tgt.clone().add(new THREE.Vector3(0, 1.6, 0))],
  ];
  const posCurve = new THREE.CatmullRomCurve3(keys.map((k) => k[0]), false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(keys.map((k) => k[1]), false, 'centripetal');
  const DUR = 26;
  let t = 0, lineIdx = -1, done = false;
  const look = new THREE.Vector3();
  controller.locked = true;
  castle.setGate(false, true);
  ui.letterbox(true);
  const wasActive = celebration.active;
  celebration.setActive(true);

  const finish = () => {
    if (done) return;
    done = true;
    ui.letterbox(false);
    ui.cutsceneText('');
    controller.locked = false;
    castle.setGate(true);
    if (!wasActive) setTimeout(() => celebration.setActive(wasActive), 15000);
    onDone && onDone();
  };
  ui.onSkip(finish);

  return {
    get done() { return done; },
    update(dt) {
      if (done) return;
      t += dt;
      const k = Math.min(1, t / DUR);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      camera.position.copy(posCurve.getPointAt(e));
      lookCurve.getPointAt(e, look);
      camera.lookAt(look);
      if (t > 11 && t - dt <= 11) castle.setGate(true);
      const li = Math.min(lines.length - 1, Math.floor((t / DUR) * (lines.length + 0.3)));
      if (li !== lineIdx) { lineIdx = li; ui.cutsceneText(lines[li], li === lines.length - 2); }
      if (t > 15 && Math.random() < dt * 2.5) celebration.burst(1);
      if (t > DUR - 4 && Math.random() < dt * 4) celebration.burst(1, tgt.clone().add(new THREE.Vector3(0, 25, -20)));
      if (t >= DUR + 3) finish();
    },
  };
}
