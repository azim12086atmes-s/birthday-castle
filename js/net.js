// Multiplayer over WebRTC using the free PeerJS cloud broker: no server of our
// own. The first player in a room becomes the host (a hub that relays
// positions); if the host leaves, someone else takes over automatically.
/* global Peer */

const TICK = 100; // ms between position broadcasts

function safeId(s) { return String(s).toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 40); }

export class Net {
  constructor(room, profile) {
    this.hostId = `castle-${safeId(room)}-host`;
    this.profile = profile;
    this.players = new Map(); // id -> { profile, state }
    this.handlers = {};
    this.state = null;
    this.isHost = false;
    this.peer = null;
    this.conn = null;
    this.clients = new Map();
    this.timer = null;
    this.closed = false;
  }

  on(name, fn) { (this.handlers[name] ||= []).push(fn); return this; }
  emit(name, ...a) { for (const fn of this.handlers[name] || []) fn(...a); }

  get id() { return this.peer?.id; }

  start() {
    if (typeof Peer === 'undefined') { this.emit('status', 'offline'); return; }
    this.tryHost();
  }

  newPeer(id) {
    const p = id ? new Peer(id, { debug: 0 }) : new Peer({ debug: 0 });
    p.on('disconnected', () => { if (!this.closed && !p.destroyed) p.reconnect(); });
    return p;
  }

  tryHost() {
    this.emit('status', 'connecting');
    const p = this.newPeer(this.hostId);
    let settled = false;
    p.on('open', () => {
      settled = true;
      this.peer = p; this.isHost = true;
      this.emit('peer', p);
      this.emit('status', 'host');
      p.on('connection', (c) => this.acceptClient(c));
      clearInterval(this.timer);
      this.timer = setInterval(() => this.hostTick(), TICK);
    });
    p.on('error', (err) => {
      if (!settled && err.type === 'unavailable-id') { settled = true; p.destroy(); this.joinAsClient(); }
      else if (!settled) { settled = true; p.destroy(); this.emit('status', 'offline'); setTimeout(() => !this.closed && this.tryHost(), 5000); }
    });
  }

  joinAsClient() {
    const p = this.newPeer();
    p.on('open', () => {
      this.peer = p; this.isHost = false;
      this.emit('peer', p);
      const c = p.connect(this.hostId, { reliable: true, serialization: 'json' });
      this.conn = c;
      c.on('open', () => {
        this.emit('status', 'connected');
        c.send({ t: 'hello', profile: this.profile, state: this.state });
        clearInterval(this.timer);
        this.timer = setInterval(() => { if (this.state && c.open) c.send({ t: 's', s: this.state }); }, TICK);
      });
      c.on('data', (m) => this.fromHost(m));
      c.on('close', () => this.hostLost());
      c.on('error', () => this.hostLost());
    });
    p.on('error', (err) => {
      if (err.type === 'peer-unavailable') this.hostLost();
    });
  }

  hostLost() {
    if (this.closed || this.reelecting) return;
    this.reelecting = true;
    clearInterval(this.timer);
    for (const id of [...this.players.keys()]) { this.players.delete(id); this.emit('leave', id); }
    try { this.peer?.destroy(); } catch { /* ignore */ }
    this.peer = null; this.conn = null;
    this.emit('status', 'connecting');
    setTimeout(() => { this.reelecting = false; this.tryHost(); }, 500 + Math.random() * 2500);
  }

  // ---- host side ----------------------------------------------------------
  acceptClient(c) {
    c.on('data', (m) => this.fromClient(c, m));
    c.on('close', () => this.dropClient(c.peer));
    c.on('error', () => this.dropClient(c.peer));
    this.clients.set(c.peer, c);
  }

  dropClient(id) {
    this.clients.delete(id);
    if (this.players.delete(id)) { this.emit('leave', id); this.broadcast({ t: 'leave', id }); }
  }

  broadcast(m, except) {
    for (const [id, c] of this.clients) if (id !== except && c.open) c.send(m);
  }

  fromClient(c, m) {
    const id = c.peer;
    if (m.t === 'hello') {
      const roster = [[this.id, this.profile, this.state]];
      for (const [pid, p] of this.players) roster.push([pid, p.profile, p.state]);
      c.send({ t: 'welcome', roster });
      this.players.set(id, { profile: m.profile, state: m.state });
      this.broadcast({ t: 'join', id, profile: m.profile }, id);
      this.emit('join', id, m.profile);
    } else if (m.t === 's') {
      const p = this.players.get(id);
      if (p) p.state = m.s;
    } else if (m.t === 'e') {
      this.broadcast({ t: 'e', id, e: m.e }, id);
      this.emit('event', id, m.e);
    } else if (m.t === 'profile') {
      const p = this.players.get(id);
      if (p) { p.profile = m.profile; this.broadcast({ t: 'profile', id, profile: m.profile }, id); this.emit('profile', id, m.profile); }
    }
  }

  hostTick() {
    const list = [];
    if (this.state) list.push([this.id, this.state]);
    for (const [id, p] of this.players) if (p.state) list.push([id, p.state]);
    this.broadcast({ t: 'S', list });
    this.emit('states', list.filter(([id]) => id !== this.id));
  }

  // ---- client side --------------------------------------------------------
  fromHost(m) {
    if (m.t === 'welcome') {
      for (const [id, profile, state] of m.roster) {
        if (id === this.id) continue;
        this.players.set(id, { profile, state });
        this.emit('join', id, profile, true);
      }
      this.emit('welcomed', m.roster.map((r) => r[0]).filter((id) => id !== this.id));
    } else if (m.t === 'join') {
      if (m.id === this.id) return;
      this.players.set(m.id, { profile: m.profile, state: null });
      this.emit('join', m.id, m.profile);
    } else if (m.t === 'leave') {
      if (this.players.delete(m.id)) this.emit('leave', m.id);
    } else if (m.t === 'S') {
      const list = m.list.filter(([id]) => id !== this.id);
      for (const [id, s] of list) { const p = this.players.get(id); if (p) p.state = s; }
      this.emit('states', list);
    } else if (m.t === 'e') {
      this.emit('event', m.id, m.e);
    } else if (m.t === 'profile') {
      const p = this.players.get(m.id);
      if (p) { p.profile = m.profile; this.emit('profile', m.id, m.profile); }
    }
  }

  // ---- shared API ---------------------------------------------------------
  setState(s) { this.state = s; }

  sendEvent(e) {
    if (this.isHost) this.broadcast({ t: 'e', id: this.id, e });
    else if (this.conn?.open) this.conn.send({ t: 'e', e });
  }

  updateProfile(profile) {
    this.profile = profile;
    if (this.isHost) this.broadcast({ t: 'profile', id: this.id, profile });
    else if (this.conn?.open) this.conn.send({ t: 'profile', profile });
  }

  close() {
    this.closed = true;
    clearInterval(this.timer);
    try { this.peer?.destroy(); } catch { /* ignore */ }
  }
}
