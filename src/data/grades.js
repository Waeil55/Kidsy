/* KidLingo grade engine — every grade owns ONLY its level of content.
   KG..G6 each get: 50 levels, 500 stories, 500 math questions.
   All generated deterministically (seeded) so content is stable,
   grade-locked (never harder/easier than the grade), and offline. */

export const GRADES = [
  { key: 'KG', name: 'Kindergarten', short: 'KG' },
  { key: 'G1', name: 'Grade 1', short: 'G1' },
  { key: 'G2', name: 'Grade 2', short: 'G2' },
  { key: 'G3', name: 'Grade 3', short: 'G3' },
  { key: 'G4', name: 'Grade 4', short: 'G4' },
  { key: 'G5', name: 'Grade 5', short: 'G5' },
  { key: 'G6', name: 'Grade 6', short: 'G6' },
];

export const GRADE_KEYS = GRADES.map((g) => g.key);
export const SUBJECTS = ['english', 'math', 'science', 'general'];

export function gradeName(key) {
  const g = GRADES.find((x) => x.key === key);
  return g ? g.name : key;
}

/* ---------- seeded RNG (stable content, no storage cost) ---------- */
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function rngFor(...parts) {
  return mulberry32(hashStr(parts.join('|')));
}
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}
function shuffleSeeded(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- per-grade word pools (grade-locked vocabulary) ---------- */
const POOLS = {
  KG: {
    nouns: ['cat', 'dog', 'sun', 'hat', 'mat', 'rat', 'pig', 'hen', 'bus', 'cup', 'box', 'fox', 'ant', 'bee', 'egg', 'kid'],
    verbs: ['sat', 'ran', 'hop', 'nap', 'sip', 'dig', 'hug', 'jog', 'mix', 'pat'],
    adjs: ['big', 'red', 'fun', 'hot', 'sad', 'glad', 'little', 'happy'],
    names: ['Sam', 'Pam', 'Tom', 'Kim', 'Ben', 'Ana'],
    places: ['mat', 'park', 'den', 'hut', 'garden'],
  },
  G1: {
    nouns: ['cat', 'dog', 'bird', 'fish', 'frog', 'ball', 'book', 'mom', 'dad', 'sun', 'tree', 'cake', 'bike', 'kite', 'star', 'bear'],
    verbs: ['run', 'jump', 'play', 'read', 'sing', 'swim', 'climb', 'laugh', 'help', 'share'],
    adjs: ['happy', 'big', 'little', 'red', 'blue', 'kind', 'funny', 'brave'],
    names: ['Leo', 'Mia', 'Sam', 'Eva', 'Noah', 'Lily'],
    places: ['park', 'school', 'garden', 'pond', 'playground', 'beach'],
  },
  G2: {
    nouns: ['fox', 'owl', 'river', 'forest', 'bridge', 'castle', 'puppy', 'kitten', 'rocket', 'island', 'cave', 'meadow'],
    verbs: ['explore', 'discover', 'rescue', 'whisper', 'gather', 'follow', 'climb', 'paddle'],
    adjs: ['brave', 'curious', 'gentle', 'clever', 'misty', 'golden', 'sleepy', 'wild'],
    names: ['Rusty', 'Luna', 'Finn', 'Ruby', 'Oliver', 'Zoe'],
    places: ['Whispering Woods', 'Sunny Riverbank', 'Misty Hill', 'Coral Cave', 'Maple Village'],
  },
  G3: {
    nouns: ['mystery', 'map', 'key', 'lantern', 'compass', 'bridge', 'telescope', 'journal', 'lighthouse', 'train'],
    verbs: ['investigate', 'decode', 'trace', 'unlock', 'observe', 'predict', 'compare', 'measure'],
    adjs: ['mysterious', 'ancient', 'clever', 'rustic', 'hidden', 'electric', 'curious', 'narrow'],
    names: ['Leo', 'Maya', 'Omar', 'Nora', 'Felix', 'Ava'],
    places: ['Meadowbrook Park', 'Old Lighthouse', 'Cedar Library', 'Willow Station', 'Granite Museum'],
  },
  G4: {
    nouns: ['ecosystem', 'volcano', 'glacier', 'desert', 'oxygen', 'fossil', 'compass', 'harvest', 'energy', 'orbit'],
    verbs: ['analyze', 'erode', 'migrate', 'orbit', 'condense', 'pollinate', 'excavate', 'generate'],
    adjs: ['turquoise', 'arid', 'fragile', 'immense', 'renewable', 'ancient', 'volcanic', 'coastal'],
    names: ['Dr. Amara', 'Captain Reyes', 'Mina', 'Jonas', 'Priya', 'Theo'],
    places: ['Coral Reef', 'Sahara Station', 'Glacier Bay', 'Redwood Lab', 'Nile Delta'],
  },
  G5: {
    nouns: ['invention', 'astrolabe', 'manuscript', 'expedition', 'artifact', 'observatory', 'cipher', 'engine'],
    verbs: ['invent', 'calculate', 'navigate', 'translate', 'calibrate', 'discover', 'restore', 'forecast'],
    adjs: ['ingenious', 'medieval', 'celestial', 'intricate', 'resilient', 'historic', 'precise', 'bold'],
    names: ['Master Gabriel', 'Klara', 'Ibn Battuta', 'Ada', 'Marco', 'Sofia'],
    places: ['Renaissance Prague', 'Alexandria Library', 'Venice Harbor', 'Timbuktu', 'Andes Observatory'],
  },
  G6: {
    nouns: ['adventure', 'character', 'dialogue', 'chapter', 'theme', 'motive', 'frontier', 'legacy'],
    verbs: ['narrate', 'persuade', 'interpret', 'contemplate', 'venture', 'resolve', 'empathize', 'chronicle'],
    adjs: ['timeless', 'valiant', 'wistful', 'resolute', 'vivid', 'humble', 'stern', 'nostalgic'],
    names: ['Tom Sawyer', 'Becky', 'Huck', 'Sid', 'Mary', 'Judge Thatcher'],
    places: ['St. Petersburg', 'Cardiff Hill', 'Mississippi Shore', 'McDougal Cave', 'Widow Douglas Home'],
  },
};

/* ---------- sentence frames per grade (controls difficulty) ---------- */
const FRAMES = {
  KG: [
    (p) => `${p.name} sat on a ${p.place}.`,
    (p) => `A ${p.adj} ${p.noun} ran to ${p.name}.`,
    (p) => `${p.name} can ${p.verb}. Hop, hop, hop!`,
    (p) => `The ${p.noun} is ${p.adj}.`,
  ],
  G1: [
    (p) => `${p.name} can ${p.verb} in the ${p.place}.`,
    (p) => `The ${p.adj} ${p.noun} loves to ${p.verb} all day.`,
    (p) => `${p.name} and friends ${p.verb} near the ${p.place}.`,
    (p) => `Look! A ${p.adj} ${p.noun} is here to ${p.verb}.`,
  ],
  G2: [
    (p) => `${p.name} the ${p.noun} wandered into the ${p.place} one misty morning.`,
    (p) => `With a ${p.adj} heart, ${p.name} decided to ${p.verb} past the old ${p.noun}.`,
    (p) => `Suddenly a cry echoed, and ${p.name} hurried to ${p.verb} a friend in need.`,
    (p) => `From that day on, the ${p.place} felt safer for every ${p.adj} traveler.`,
  ],
  G3: [
    (p) => `${p.name} unfolded the ${p.adj} map inside the ${p.place}.`,
    (p) => `Every clue seemed to ${p.verb} toward the ${p.adj} ${p.noun} hidden below.`,
    (p) => `Carefully, ${p.name} began to ${p.verb} the symbols beside the old ${p.noun}.`,
    (p) => `By sunset, the mystery of the ${p.place} finally started to ${p.verb}.`,
  ],
  G4: [
    (p) => `Beneath the ${p.adj} landscape of the ${p.place}, scientists began to ${p.verb} each layer.`,
    (p) => `The ${p.noun} slowly began to ${p.verb} as temperatures shifted across the ${p.adj} season.`,
    (p) => `${p.name} recorded how the ${p.adj} ${p.noun} helped the whole ${p.place} ${p.verb}.`,
    (p) => `Protecting the ${p.place} means the ${p.noun} will ${p.verb} for years to come.`,
  ],
  G5: [
    (p) => `In the workshop at ${p.place}, ${p.name} prepared to ${p.verb} the ${p.adj} ${p.noun}.`,
    (p) => `Each ${p.adj} measurement helped ${p.name} ${p.verb} the design before dawn.`,
    (p) => `When the ${p.noun} began to ${p.verb}, the whole ${p.place} held its breath.`,
    (p) => `${p.name} wrote down how future builders could ${p.verb} the ${p.adj} ${p.noun}.`,
  ],
  G6: [
    (p) => `${p.name} contemplated the ${p.adj} ${p.noun} while evening settled over the ${p.place}.`,
    (p) => `"We must ${p.verb}," said ${p.name}, with a ${p.adj} resolve none could shake.`,
    (p) => `The ${p.noun} seemed to ${p.verb} every secret the ${p.place} had ever kept.`,
    (p) => `And so ${p.name} learned that a ${p.adj} heart can ${p.verb} any frontier.`,
  ],
};

const TITLES = {
  KG: ['Sam the Cat', 'Hop and Nap', 'Red Hen Fun', 'Big Pig Day', 'Fun in the Sun'],
  G1: ['Run, Play, Read!', 'The Kind Puppy', 'My Red Bike', 'Stars at Night', 'The Funny Frog'],
  G2: ['The Brave Little Fox', 'River of Echoes', 'The Misty Bridge', 'Puppy to the Rescue', 'Songs of the Meadow'],
  G3: ['The Treehouse Mystery', 'Key of Riddles', 'Lanterns Below', 'The Hollow Oak', 'Map of Echoes'],
  G4: ['The Deep Ocean Quest', 'Volcano Watch', 'Glacier Keepers', 'Desert Bloom', 'Orbit of Wonder'],
  G5: ['The Clockwork Alchemist', 'Cipher of Brass', 'Voyage of Ink', 'The Star Engine', 'Harbor of Gears'],
  G6: ['Tom Sawyer Tales', 'The Cave Echo', 'River of Promises', 'The White Fence', 'Frontier Hearts'],
};

/* ---------- story generator: 500 per grade ---------- */
export const STORIES_PER_GRADE = 500;

export function genStory(gradeKey, idx) {
  const pool = POOLS[gradeKey] || POOLS.G1;
  const rng = rngFor('story', gradeKey, idx);
  const frames = FRAMES[gradeKey] || FRAMES.G1;
  const titles = TITLES[gradeKey] || TITLES.G1;

  const p = {
    name: pick(rng, pool.names),
    noun: pick(rng, pool.nouns),
    verb: pick(rng, pool.verbs),
    adj: pick(rng, pool.adjs),
    place: pick(rng, pool.places),
  };
  const p2 = {
    name: pick(rng, pool.names),
    noun: pick(rng, pool.nouns),
    verb: pick(rng, pool.verbs),
    adj: pick(rng, pool.adjs),
    place: pick(rng, pool.places),
  };
  const paraCount = 3 + Math.floor(rng() * 2);
  const paragraphs = [];
  for (let i = 0; i < paraCount; i++) {
    const f = frames[Math.floor(rng() * frames.length)];
    paragraphs.push(f(i % 2 === 0 ? p : p2));
  }
  const title = idx < titles.length ? titles[idx] : `${p.adj[0].toUpperCase() + p.adj.slice(1)} ${p.noun[0].toUpperCase() + p.noun.slice(1)} ${11 + (idx % 490)}`;

  const explains = paragraphs.map((para) =>
    gradeKey === 'KG' || gradeKey === 'G1'
      ? `A gentle moment: ${para.toLowerCase()}`
      : `This part moves the tale forward: ${para.split('.')[0]}.`
  );

  // Smart questions drawn from THIS story's own entities (never mixed grades)
  const questions = [
    {
      q: `Who is a main character here?`,
      options: shuffleSeeded(rng, [p.name, p2.name, pick(rng, pool.places)]).slice(0, 3),
      correct: 0,
    },
    {
      q: `Where does part of this story happen?`,
      options: shuffleSeeded(rng, [p.place, p2.place, pick(rng, pool.nouns)]).slice(0, 3),
      correct: 0,
    },
  ];
  // fix correct indexes after shuffle
  questions[0].correct = questions[0].options.indexOf(p.name);
  questions[1].correct = questions[1].options.indexOf(p.place);

  return {
    id: `${gradeKey}-story-${idx}`,
    gradeKey,
    title,
    subtitle: gradeName(gradeKey),
    level: `${gradeName(gradeKey)} · Story ${idx + 1}`,
    paragraphs,
    sentenceExplains: explains,
    sentenceQuestions: questions,
    illustration: null,
  };
}

export function storyCount() {
  return STORIES_PER_GRADE;
}

/* ---------- math generator: 500 per grade, grade-locked ranges ---------- */
export const MATH_PER_GRADE = 500;

function mathDistractors(rng, answer, spread) {
  const set = new Set([answer]);
  let guard = 0;
  while (set.size < 4 && guard++ < 60) {
    const d = answer + Math.round((rng() * 2 - 1) * spread);
    if (d !== answer) set.add(d);
  }
  let fill = answer + spread + 1;
  while (set.size < 4) set.add(fill++);
  return shuffleSeeded(rng, [...set]);
}

export function genMath(gradeKey, idx) {
  const rng = rngFor('math', gradeKey, idx);
  const ri = (a, b) => a + Math.floor(rng() * (b - a + 1));
  let q, answer, topic, explain;

  switch (gradeKey) {
    case 'KG': {
      const a = ri(1, 5);
      const total = a + ri(0, 5);
      q = `Count the stars: ${'★'.repeat(Math.min(total, 10))} — how many?`;
      answer = total;
      topic = 'counting';
      explain = `Count each star one by one to reach ${total}.`;
      return { q, options: mathDistractors(rng, answer, 3), correct: 0, topic, explain, answer, id: `${gradeKey}-math-${idx}`, gradeKey };
    }
    case 'G1': {
      const a = ri(1, 12);
      const b = ri(1, 12);
      if (rng() < 0.5) {
        q = `${a} + ${b} = ?`;
        answer = a + b;
        topic = 'addition';
        explain = `Add ${a} and ${b} to get ${answer}.`;
      } else {
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        q = `${big} − ${small} = ?`;
        answer = big - small;
        topic = 'subtraction';
        explain = `Take ${small} away from ${big} to get ${answer}.`;
      }
      break;
    }
    case 'G2': {
      const a = ri(5, 60);
      const b = ri(5, 60);
      const r = rng();
      if (r < 0.4) {
        q = `${a} + ${b} = ?`;
        answer = a + b;
        topic = 'addition';
      } else if (r < 0.75) {
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        q = `${big} − ${small} = ?`;
        answer = big - small;
        topic = 'subtraction';
      } else {
        const m = ri(2, 6);
        const n = ri(2, 6);
        q = `${m} × ${n} = ?`;
        answer = m * n;
        topic = 'multiplication';
      }
      explain = `Work it out step by step to reach ${answer}.`;
      break;
    }
    case 'G3': {
      const r = rng();
      if (r < 0.5) {
        const m = ri(3, 9);
        const n = ri(3, 9);
        q = `${m} × ${n} = ?`;
        answer = m * n;
        topic = 'multiplication';
      } else {
        const n = ri(3, 9);
        const ans = ri(2, 9);
        q = `${n * ans} ÷ ${n} = ?`;
        answer = ans;
        topic = 'division';
      }
      explain = `Use times tables to reach ${answer}.`;
      break;
    }
    case 'G4': {
      const r = rng();
      if (r < 0.35) {
        const m = ri(6, 12);
        const n = ri(4, 12);
        q = `${m} × ${n} = ?`;
        answer = m * n;
        topic = 'multiplication';
      } else if (r < 0.6) {
        const den = ri(2, 8);
        const num = ri(1, den - 1);
        const whole = ri(0, 3);
        q = whole > 0 ? `${whole} + ${num}/${den} = ? (as an improper fraction numerator over ${den})` : `Which numerator makes ${num}/${den} with denominator ${den}? (enter numerator)`;
        answer = whole > 0 ? whole * den + num : num;
        topic = 'fractions';
      } else {
        const a = ri(100, 900);
        const b = ri(100, 900);
        q = `${a} + ${b} = ?`;
        answer = a + b;
        topic = 'addition';
      }
      explain = `Solve carefully to reach ${answer}.`;
      break;
    }
    case 'G5': {
      const r = rng();
      if (r < 0.35) {
        const a = ri(2, 20) / 2;
        const b = ri(2, 20) / 2;
        q = `${a} + ${b} = ?`;
        answer = a + b;
        topic = 'decimals';
      } else if (r < 0.65) {
        const pct = [10, 20, 25, 50][ri(0, 3)];
        const base = [40, 60, 80, 100, 200][ri(0, 4)];
        q = `What is ${pct}% of ${base}?`;
        answer = (pct * base) / 100;
        topic = 'percent';
      } else {
        const m = ri(6, 15);
        const n = ri(6, 15);
        q = `${m} × ${n} = ?`;
        answer = m * n;
        topic = 'multiplication';
      }
      explain = `Work it out step by step to reach ${answer}.`;
      break;
    }
    default: {
      // G6
      const r = rng();
      if (r < 0.3) {
        const a = ri(-12, 12);
        const b = ri(-12, 12);
        q = `${a} + (${b}) = ?`;
        answer = a + b;
        topic = 'integers';
      } else if (r < 0.55) {
        const a = ri(2, 12);
        const b = ri(2, 12);
        q = `Simplify ${a * 2}:${b * 2} — what is the first number of the simplest ratio?`;
        const g = gcd(a, b);
        answer = a / g;
        topic = 'ratios';
      } else if (r < 0.8) {
        const x = ri(2, 12);
        const c = ri(1, 20);
        q = `If x + ${c} = ${x + c}, what is x? (x + ${c} − ${c})`;
        answer = x;
        topic = 'pre-algebra';
      } else {
        const m = ri(11, 19);
        const n = ri(11, 19);
        q = `${m} × ${n} = ?`;
        answer = m * n;
        topic = 'multiplication';
      }
      explain = `Solve step by step to reach ${answer}.`;
    }
  }
  const options = mathDistractors(rng, answer, Math.max(3, Math.round(Math.abs(answer) * 0.3)));
  return { q, options, correct: options.indexOf(answer), topic, explain, answer, id: `${gradeKey}-math-${idx}`, gradeKey };
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

/* ---------- levels: 50 per grade, sequential unlock ---------- */
export const LEVELS_PER_GRADE = 50;

export function getLevel(gradeKey, n) {
  // n is 1-based
  return {
    n,
    gradeKey,
    id: `${gradeKey}-L${n}`,
    storyIdx: ((n - 1) * 7) % STORIES_PER_GRADE,
    mathIdx: ((n - 1) * 11) % MATH_PER_GRADE,
    quizCount: 3 + ((n - 1) % 3), // 3-5 smart questions
    xpReward: 20 + (n - 1) * 2,
    title: `Level ${n}`,
  };
}

/* ---------- smart quiz builder (from live story + grade vocab) ---------- */
export function smartQuizForStory(gradeKey, story, count = 4) {
  const rng = rngFor('quiz', story.id);
  const pool = POOLS[gradeKey] || POOLS.G1;
  const out = [...story.sentenceQuestions.map((s) => ({ q: s.q, options: s.options, correct: s.correct }))];
  const words = [...new Set(story.paragraphs.join(' ').toLowerCase().replace(/[^a-z' ]/g, '').split(/\s+/).filter((w) => w.length > 3))];
  let guard = 0;
  while (out.length < count && guard++ < 40 && words.length > 0) {
    const w = pick(rng, words);
    const distract = shuffleSeeded(rng, [pick(rng, pool.nouns), pick(rng, pool.verbs), pick(rng, pool.adjs)]).slice(0, 2);
    const options = shuffleSeeded(rng, [`The word "${w}" appears in the story`, `The story never mentions rainbows`, `The story is about numbers only`]).slice(0, 3);
    out.push({ q: `Which is TRUE about "${w}"?`, options, correct: options.indexOf(`The word "${w}" appears in the story`) });
    void distract;
  }
  return out.slice(0, count);
}
