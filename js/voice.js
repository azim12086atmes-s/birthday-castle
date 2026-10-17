// Proximity voice: microphones are streamed peer-to-peer and played through a
// 3D panner placed at the speaker's avatar, so voices get quieter with distance
// and come from the right direction. With up to 16 players a call is only held
// with players nearby (opened within CALL_M, hung up beyond HANG_M), so nobody
// uploads fifteen copies of their voice. Of each pair, the player with the
// lower id places the call; the answer carries the other voice back.
import { CONFIG } from './config.js';

const CALL_M = 60, HANG_M = 90;

export class Voice {
  constructor() {
    this.ctx = null;
    this.local = null;
    this.peer = null;
    this.remotes = new Map(); // id -> { call, panner, el }
    this.known = new Set();
    this.calling = new Map(); // id -> when we last placed a call
    this.onChange = null;
  }

  // Must be called from a click so browsers allow audio.
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    this.ctx?.resume();
  }

  attachPeer(peer) {
    this.peer = peer;
    for (const r of this.remotes.values()) r.call.close();
    this.remotes.clear();
    peer.on('call', (call) => {
      call.answer(this.local || undefined);
      this.hook(call);
    });
  }

  addPeer(id) { this.known.add(id); }

  removePeer(id) {
    this.known.delete(id);
    const r = this.remotes.get(id);
    if (r) { r.call.close(); this.drop(id); }
  }

  async enableMic() {
    this.unlock();
    this.local = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    // hang up so the calls are placed again carrying this voice
    for (const [id, r] of this.remotes) { r.call.close(); this.drop(id); }
    this.onChange && this.onChange();
  }

  // a silent stream for placing a call before the microphone is on
  silence() {
    if (!this._silent && this.ctx) this._silent = this.ctx.createMediaStreamDestination().stream;
    return this._silent;
  }

  setMuted(muted) {
    if (!this.local) return;
    for (const t of this.local.getAudioTracks()) t.enabled = !muted;
    this.onChange && this.onChange();
  }

  get muted() { return !this.local || !this.local.getAudioTracks().some((t) => t.enabled); }

  callPeer(id) {
    const stream = this.local || this.silence();
    if (!this.peer || !stream || this.peer.destroyed) return;
    const old = this.remotes.get(id);
    if (old) { old.call.close(); this.drop(id); }
    const call = this.peer.call(id, stream);
    this.calling.set(id, performance.now());
    if (call) this.hook(call);
  }

  hook(call) {
    const id = call.peer;
    call.on('stream', (stream) => {
      const prev = this.remotes.get(id);
      if (prev && prev.call !== call) { prev.call.close(); this.drop(id); }
      // Chrome only feeds WebAudio from a remote stream that is also attached to a media element.
      const el = new Audio(); el.srcObject = stream; el.muted = true; el.play().catch(() => {});
      let panner = null;
      if (this.ctx) {
        const src = this.ctx.createMediaStreamSource(stream);
        panner = this.ctx.createPanner();
        panner.panningModel = 'equalpower';
        panner.distanceModel = 'linear';
        panner.refDistance = CONFIG.voice.near;
        panner.maxDistance = CONFIG.voice.far;
        panner.rolloffFactor = 1;
        src.connect(panner).connect(this.ctx.destination);
      } else {
        el.muted = false;
      }
      this.remotes.set(id, { call, panner, el, stream });
      this.onChange && this.onChange();
    });
    call.on('close', () => { if (this.remotes.get(id)?.call === call) this.drop(id); });
    call.on('error', () => { if (this.remotes.get(id)?.call === call) this.drop(id); });
  }

  drop(id) {
    const r = this.remotes.get(id);
    if (!r) return;
    r.el.srcObject = null;
    this.remotes.delete(id);
    this.onChange && this.onChange();
  }

  // positions: Map id -> THREE.Vector3. We listen from our own avatar's head,
  // facing where the camera looks.
  update(camera, positions, head) {
    if (!this.ctx) return;
    const L = this.ctx.listener;
    const p = head || camera.position;
    const f = camera.getWorldDirection(this._f || (this._f = p.clone()));
    if (L.positionX) {
      L.positionX.value = p.x; L.positionY.value = p.y; L.positionZ.value = p.z;
      L.forwardX.value = f.x; L.forwardY.value = f.y; L.forwardZ.value = f.z;
      L.upX.value = 0; L.upY.value = 1; L.upZ.value = 0;
    } else {
      L.setPosition(p.x, p.y, p.z); L.setOrientation(f.x, f.y, f.z, 0, 1, 0);
    }
    // open calls with players who came near, hang up on those who went far
    const now = performance.now();
    if (this.peer && !this.peer.destroyed && now - (this._ranged || 0) > 1000) {
      this._ranged = now;
      for (const id of this.known) {
        const q = positions.get(id);
        if (!q) continue;
        const d = q.distanceTo(p), r = this.remotes.get(id);
        if (r && d > HANG_M) { r.call.close(); this.drop(id); }
        else if (!r && d < CALL_M && this.peer.id < id && now - (this.calling.get(id) || 0) > 5000) this.callPeer(id);
      }
    }
    for (const [id, r] of this.remotes) {
      const q = positions.get(id);
      if (!q || !r.panner) continue;
      if (r.panner.positionX) { r.panner.positionX.value = q.x; r.panner.positionY.value = q.y + 1.6; r.panner.positionZ.value = q.z; }
      else r.panner.setPosition(q.x, q.y + 1.6, q.z);
    }
  }
}
