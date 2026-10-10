// Everything you may want to personalise lives in this one file.

export const CONFIG = {
  // Her name, shown in the welcome cutscene and the birthday banner.
  honoreeName: 'Princess',

  // Lines shown one after another during her grand welcome cutscene.
  // {name} is replaced with honoreeName.
  welcomeLines: [
    'Tonight, the stars gathered for one reason…',
    'The castle lit every window, the unicorns took flight…',
    'Welcome, {name}.',
    'Happy Birthday — this whole world is yours.',
  ],

  // When the celebration begins, in each visitor's local time.
  // Before this moment friends can explore; after it, fireworks, lanterns,
  // the cake and the birthday banner appear.
  celebrationStart: '2026-10-23T00:00:00',

  // She joins with the link  ...?key=<honoreeKey>  so the game knows it is her.
  // Change this to something only you know before sharing the game.
  honoreeKey: 'xCOM5xrDuiCU',

  // Players with the same room name meet each other. ?room=xyz overrides it.
  roomId: 'castle-of-starlight-2026',

  // Proximity voice: full volume inside `near`, silent beyond `far` (metres).
  voice: { near: 4, far: 32 },
};

export function celebrationTime() {
  return new Date(CONFIG.celebrationStart).getTime();
}

export function isCelebration(now = Date.now()) {
  const forced = new URLSearchParams(location.search).get('celebrate');
  if (forced === '1') return true;
  return now >= celebrationTime();
}
