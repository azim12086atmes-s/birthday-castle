// The game clock (schema: clock). On the night of the 22nd the sky follows the
// real timeline, morning at 20:30 through to night at 23:30 and midnight. On
// every other day the sky runs a 30 minute day so friends exploring early see
// the whole cycle. ?time=21:40 pretends it is that time on the night;
// ?phase=noon pins a phase.
import * as THREE from 'three';
import { SUN_DIR } from '../world/sky.js';

const params = new URLSearchParams(location.search);
const SUN_AZ = Math.atan2(SUN_DIR.z, SUN_DIR.x);

const hm = (s) => { const [h, m] = s.split(':').map(Number); return (h < 12 ? h + 24 : h) * 60 + m; };  // 00:00 counts as 24:00

export function createClock(data) {
  const C = data.clock;
  const phases = Object.fromEntries(C.phases.map((p) => [p.id, p]));
  const celebrationAt = new Date(data.meta.celebrationAt).getTime();
  const nightStart = celebrationAt - (24 * 60 - hm(C.timeline[0].at)) * 60000;   // 20:30 the evening before

  // sun elevation anchors through the night, in minutes after 12:00 of the 22nd
  const anchors = [
    [hm('20:30'), phases.morning.sunElevDeg],
    [hm('21:00'), phases.noon.sunElevDeg],
    [hm('21:10'), phases.noon.sunElevDeg],
    [hm('23:00'), phases.afternoon.sunElevDeg],
    [hm('23:30'), phases.dusk.sunElevDeg],
    [hm('23:45'), phases.night.sunElevDeg],
  ];

  const forcedTime = params.get('time');
  const forcedPhase = params.get('phase');

  function nightMinutes(now) {
    if (forcedTime) return hm(forcedTime);
    return hm('20:30') + (now - nightStart) / 60000;
  }

  function elevAtNight(min) {
    if (min <= anchors[0][0]) return anchors[0][1];
    for (let i = 1; i < anchors.length; i++) {
      const [m1, e1] = anchors[i];
      if (min <= m1) { const [m0, e0] = anchors[i - 1]; return e0 + (e1 - e0) * (min - m0) / (m1 - m0); }
    }
    return phases.night.sunElevDeg;
  }

  function elevCycle(now) {
    // morning -> noon -> golden -> dusk -> night, minutes from the schema, looping
    const total = C.phases.reduce((s, p) => s + p.minutes, 0);
    let m = ((now / 60000) % total + total) % total;
    for (let i = 0; i < C.phases.length; i++) {
      const p = C.phases[i], q = C.phases[(i + 1) % C.phases.length];
      if (m <= p.minutes) return p.sunElevDeg + (q.sunElevDeg - p.sunElevDeg) * THREE.MathUtils.smoothstep(m / p.minutes, 0.6, 1);
      m -= p.minutes;
    }
    return 0;
  }

  const state = { elev: 30, phase: 'noon', night: 0, golden: 0, onTheNight: false, minutes: 0, label: '' };

  function phaseOf(elev) {
    if (elev > 40) return 'noon';
    if (elev > 18) return 'morning';
    if (elev > 2) return 'afternoon';
    if (elev > -12) return 'dusk';
    return 'night';
  }

  return {
    state,
    nightStart,
    // what the timeline says should be happening (for auto-triggered acts)
    timelineEvent(now = Date.now()) {
      const min = nightMinutes(now);
      let ev = null;
      for (const e of C.timeline) if (min >= hm(e.at)) ev = e;
      return { minutes: min, event: ev, onTheNight: forcedTime ? true : (now >= nightStart && now < celebrationAt + 6 * 3600000) };
    },
    update(now = Date.now(), celebrating = false) {
      const tl = this.timelineEvent(now);
      state.onTheNight = tl.onTheNight;
      state.minutes = tl.minutes;
      let elev;
      if (forcedPhase && phases[forcedPhase]) elev = phases[forcedPhase].sunElevDeg;
      else if (celebrating || now >= celebrationAt) elev = phases.night.sunElevDeg;
      else if (tl.onTheNight) elev = elevAtNight(tl.minutes);
      else elev = elevCycle(now);
      state.elev += (elev - state.elev) * 0.02;            // glide, never jump
      if (Math.abs(elev - state.elev) > 40 || forcedPhase) state.elev = elev;   // a pinned phase shows at once
      const e = state.elev;
      state.phase = phaseOf(e);
      state.night = THREE.MathUtils.smoothstep(-e, -10, 8);       // 0 day .. 1 night (dusk, with the sun just down, is mostly night)
      state.golden = Math.max(0, 1 - Math.abs(e - 5) / 12) * (1 - state.night);
      // the sun swings up and down on its fixed bearing; every sky shader reads SUN_DIR
      const r = Math.cos(THREE.MathUtils.degToRad(Math.max(e, 3)));
      SUN_DIR.set(Math.cos(SUN_AZ) * r, Math.sin(THREE.MathUtils.degToRad(Math.max(e, 3))), Math.sin(SUN_AZ) * r).normalize();
      state.label = phases[state.phase]?.name || state.phase;
      return state;
    },
  };
}
