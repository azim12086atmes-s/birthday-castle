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

  // You join as her Mew with the link  ...?mew=<mewKey>  (keep it secret; she
  // must not find out until the reveal). Change it before sharing the game.
  mewKey: 'mEw7Tq2Lrv',

  // What she reads when the Mew turns back into you at midnight.
  revealLine: 'Your little Mew… was me, all along. Happy birthday ♥',

  // The heart quiz (the Temple Rotundas and the Bridge Pavilions). Replace these
  // with questions about her and about each other; `right` is the index of the
  // correct answer, counting from 0.
  quiz: [
    { q: 'Which companion never leaves the birthday girl\'s side?', a: ['A dragon', 'A Mew', 'A unicorn', 'A koi'], right: 1 },
    { q: 'What cracked the Great Birthday Lantern?', a: ['A storm', 'The Hush', 'A dragon', 'Fireworks'], right: 1 },
    { q: 'How many star shards fell across the land?', a: ['14', '20', '32', '39'], right: 2 },
    { q: 'When does the celebration begin?', a: ['At sunset', 'At midnight', 'At dawn', 'At noon'], right: 1 },
    { q: 'Where does the Grand Path end?', a: ['The Lighthouse', 'The Princess Palace', 'The Colosseum', 'Lagoon City'], right: 1 },
    { q: 'What has no eyes in this world?', a: ['Every creature', 'Only dragons', 'Only fish', 'Nothing'], right: 0 },
  ],

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
