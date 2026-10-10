// Proximity voice: every player's microphone is streamed peer-to-peer and
// played through a 3D panner placed at their avatar, so voices get quieter
// with distance and come from the right direction.
import { CONFIG } from './config.js';

export class Voice {
  constructor() {
    this.ctx = null;
    this.local = null;
    this.peer = null;
    this.remotes = new Map(); // id -> { call, panner, el }
    this.known = new Set();
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
    if (this.local) for (const id of this.known) this.callPeer(id);
  }

  addPeer(id) {
    this.known.add(id);
    if (this.local && this.peer) this.callPeer(id);
  }

  removePeer(id) {
    this.known.delete(id);
    const r = this.remotes.get(id);
    if (r) { r.call.close(); this.drop(id); }
  }

  async enableMic() {
    this.unlock();
    this.local = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    if (this.peer) for (const id of this.known) this.callPeer(id);
    this.onChange && this.onChange();
  }

  setMuted(muted) {
    if (!this.local) return;
    for (const t of this.local.getAudioTracks()) t.enabled = !muted;
    this.onChange && this.onChange();
  }

  get muted() { return !this.local || !this.local.getAudioTracks().some((t) => t.enabled); }

  callPeer(id) {
    if (!this.peer || !this.local || this.peer.destroyed) return;
    const old = this.remotes.get(id);
    if (old) { old.call.close(); this.drop(id); }
    const call = this.peer.call(id, this.local);
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
    for (const [id, r] of this.remotes) {
      const q = positions.get(id);
      if (!q || !r.panner) continue;
      if (r.panner.positionX) { r.panner.positionX.value = q.x; r.panner.positionY.value = q.y + 1.6; r.panner.positionZ.value = q.z; }
      else r.panner.setPosition(q.x, q.y + 1.6, q.z);
    }
  }
}
