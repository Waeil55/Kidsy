// Deterministic story generator. generateStory(grade, 1..500) always returns the same story,
// with exactly 20 questions (set 1 = 10 remember questions, set 2 = 10 think questions).
import { GRADES, gradeIdx, STORIES_PER_GRADE, STORIES_PER_LEVEL, Q_PER_STORY, Q_PER_SET } from '../data/grades.js';
import { makeCtx, sentencesOf } from './kit.js';
import { buildOptions, uniq, cap, words } from '../lib/rng.js';
import { EMO_POS, EMO_NEG, ITEMS, TRAITS } from './pools.js';
import { lost, skill, share, weather, mistake, META, NARRATIVE_IDS, Q } from './plots1.js';
import { animal, team, mystery, fact, howto } from './plots2.js';
import { G3_PDF_WORD_ROWS } from '../data/g3ela.js';
import { getKgBook } from '../data/kgDecodable.js';

// One story of each kind in every level (slot A..J).
export const PLOTS = [lost, animal, skill, fact, share, mystery, weather, howto, mistake, team];
export const SLOT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const KIND_LABEL = { lost: 'Lost & found', animal: 'Animal rescue', skill: 'New skill', fact: 'Animal facts', share: 'Sharing', mystery: 'Mystery', weather: 'Weather', howto: 'How-to', mistake: 'Honesty', team: 'Teamwork' };

const POS_ALL = {
  0: ['glad', 'happy', 'proud', 'excited', 'calm'], 1: ['glad', 'happy', 'proud', 'excited', 'calm'],
  2: ['proud', 'delighted', 'excited', 'calm', 'cheerful', 'relieved'], 3: ['thrilled', 'grateful', 'relieved', 'delighted', 'content', 'hopeful'],
  4: ['elated', 'relieved', 'grateful', 'triumphant', 'content', 'exuberant'],
};
const NEG_ALL = {
  0: ['sad', 'mad', 'scared', 'upset'], 1: ['sad', 'mad', 'scared', 'upset', 'worried', 'lonely'],
  2: ['worried', 'nervous', 'sad', 'upset', 'angry', 'embarrassed'], 3: ['anxious', 'uneasy', 'irritated', 'disappointed', 'discouraged', 'embarrassed'],
  4: ['apprehensive', 'distraught', 'irritated', 'disappointed', 'discouraged', 'embarrassed'],
};
const MEAN_FALLBACK = ['very tired', 'hungry and thirsty', 'cold and wet', 'busy and rushed'];
const FW = {
  0: 'pig drum moon tent lamp nest fork sled milk sock hill rock coat ship corn goat pond rain'.split(' '),
  1: 'ladder pillow blanket whisper marble cactus feather tunnel pumpkin compass anchor basket rainbow'.split(' '),
  2: 'harbor lantern meadow glacier tundra quartz pendulum satellite orchard canyon mosaic parchment'.split(' '),
};

const notIn = (text, arr) => arr.filter((w) => !new RegExp(`\\b${w}\\b`, 'i').test(text));

function generic(c, s, text) {
  const f = s.facts || {};
  const L = [];
  const noun = s.genre === 'Story' ? 'story' : 'text';
  const narrative = NARRATIVE_IDS.includes(s.id);
  const lvI = Math.min(c.lv, 4);

  if (f.hero && !f.noWho) {
    const ex = c.lv < 2 ? [f.hero, f.helper, f.pal] : [f.hero];
    L.push(Q(c.v('Who is this story about?', 'Who is this story about?', 'Who is the main character?'), f.hero, c.pool('names', ex), 1));
  }
  if (f.hero && !f.noWho && c.g <= 2) {
    const letters = 'ABCDEFGHIJKLMNOPRSTW'.split('').filter((x) => x !== f.hero[0].toUpperCase());
    L.push(Q(`What is the first letter of ${f.hero}’s name?`, f.hero[0].toUpperCase(), letters, 22));
    L.push(Q(`What is the first letter of the word "${f.hero.length > 0 ? (s.facts.topic || c.itn) : ''}"?`, (s.facts.topic || c.itn)[0].toUpperCase(), 'ABCDEFGHIJKLMNOPRSTW'.split('').filter((x) => x !== (s.facts.topic || c.itn)[0].toUpperCase()), 23));
  }
  const names = c.rng.sample(c.pool('names', [f.hero]), 6);
  const nouns = c.rng.sample(c.pool('itemNouns', [c.itn]), 6);
  const wt = s.wrongTitles || names.map((nm, i) => s.titleFn(nm, nouns[i]));
  L.push(Q(`What is the best title for this ${noun}?`, s.title, wt.filter((t) => t !== s.title), 2));

  if (f.midWho) L.push(Q(`How did ${f.midWho} feel when ${f.prob}?`, c.emoMid, POS_ALL[lvI].filter((x) => x !== c.emoMid), 20));
  if (f.endWho) L.push(Q(`How did ${f.endWho} feel at the end?`, c.emoEnd, NEG_ALL[lvI].filter((x) => x !== c.emoEnd), 21));

  if (f.endWho && c.g >= 2 && (new RegExp(`\\b${c.emoMid}\\b`).test(text) || new RegExp(`\\b${c.emoEnd}\\b`).test(text))) {
    const hasMid = new RegExp(`\\b${c.emoMid}\\b`).test(text), hasEnd = new RegExp(`\\b${c.emoEnd}\\b`).test(text);
    const useMid = hasMid && (!hasEnd || c.k % 2 === 1);
    const word = useMid ? c.emoMid : c.emoEnd, mean = useMid ? c.emoMidM : c.emoEndM;
    const opp = (useMid ? EMO_POS : EMO_NEG);
    const wrongM = uniq([...(opp[lvI] || []), ...(opp[Math.max(0, lvI - 1)] || [])].map((e) => e[1]).concat(MEAN_FALLBACK)).filter((m) => m !== mean);
    L.push(Q(`In this ${noun}, what does the word "${word}" mean?`, cap(mean), wrongM.map(cap), 55));
  }
  if (f.trait && c.g >= 2) {
    L.push(Q(`Which word best describes ${f.hero}?`, f.trait[0], (TRAITS[c.lv] || []).map((t) => t[0]).filter((w) => w !== f.trait[0]), 58));
    if (c.g >= 3) L.push(Q(`What does the word "${f.trait[0]}" mean?`, cap(f.trait[1]), (TRAITS[c.lv] || []).map((t) => cap(t[1])).filter((m) => m !== cap(f.trait[1])), 59));
  }

  if (narrative) {
    const m = META[s.id];
    const at = (o) => o[Math.min(c.lv, o.length - 1)];
    const others = NARRATIVE_IDS.filter((x) => x !== s.id).map((x) => META[x]);
    L.push(Q(c.v('What is the lesson of this story?', 'What is the lesson of this story?', 'What lesson does this story teach?', 'What is the theme of this story?', 'Which statement best expresses the theme?'), at(m.theme), others.map((o) => at(o.theme)), 60, 1));
    L.push(Q('What is the main problem in this story?', cap(at(m.problem)), others.map((o) => cap(at(o.problem))), 40, 1));
    L.push(Q('How is the problem solved?', cap(at(m.solution)), others.map((o) => cap(at(o.solution))), 42, 1));
    if (c.g >= 4) {
      L.push(Q('Which sentence best summarizes this story?', m.sum, others.map((o) => o.sum), 61, 4));
      L.push(Q('From which point of view is this story told?', 'Third person', ['First person', 'Second person', 'No point of view'], 52, 4));
    }
  }
  if (c.g >= 2) L.push(Q(`What kind of text is this?`, s.genre, ['Story', 'Informational text', 'How-to text', 'Poem'].filter((x) => x !== s.genre), 45, 2));

  if (s.events) {
    const [e0, e1, e2] = s.events;
    const fk = s.fakes || [];
    L.push(Q('What happened first?', e0, [...(c.lv >= 1 ? [e1] : []), e2, ...fk], 10));
    L.push(Q('What happened in the middle?', e1, [e0, e2, ...fk], 11));
    L.push(Q('What happened last?', e2, [e0, ...(c.lv >= 1 ? [e1] : []), ...fk], 12));
    if (fk.length) L.push(Q('Which of these did NOT happen in the story?', fk[c.k % fk.length], s.events, 30, 1));
  }
  if (s.pron && c.g >= 3) {
    L.push(Q(`Who does the word "${s.pron.w}" mean in this sentence? "${s.pron.sent}"`, s.pron.ans, [...c.pool('names', [s.pron.ans]), ...c.pool('adults', [])], 50, 3));
  }
  if (s.predict && c.g >= 2) L.push(Q(s.predict.q, s.predict.a, s.predict.w, 62, 2));
  if (s.infer && c.g >= 3) L.push(Q(s.infer.q, s.infer.a, s.infer.w, 56, 3));
  if (f.itemCentral) {
    L.push(Q('Which thing is in the story?', c.itn, c.pool('itemNouns', [c.itn]), 6));
    L.push(Q(`What kind of ${c.itn} was it?`, c.item.adj, ITEMS[c.tier].filter((x) => x.adj !== c.item.adj).map((x) => x.adj), 7, 1));
  }
  return L;
}

// filler questions built from the story text itself (always available)
function fillers(c, text) {
  const out = [];
  const tier = Math.min(2, c.tier);
  const fw = notIn(text, FW[tier]);
  const uniqWords = uniq(words(text).map((w) => w.replace(/[^A-Za-z-]/g, '')).filter((w) => w.length >= 4 && w === w.toLowerCase()));
  const wsQ = ['Which of these words is in the text?', 'Which word did you read in the text?', 'Find a word that is in the text.', 'Which word appears in the text?'];
  for (let i = 0; i < 4; i++) {
    const real = c.rng.pick(uniqWords);
    if (!real) break;
    out.push(Q(wsQ[i], real, fw, 70 + i * 0.01));
  }
  if (c.g === 0) {
    const letters = 'ABCDEFGHIJKLMNOPRSTW'.split('');
    for (let i = 0; i < 4 && uniqWords.length; i++) {
      const w = uniqWords[(c.k + i * 2) % uniqWords.length];
      const first = w[0].toUpperCase();
      const wrong = c.rng.sample(letters.filter((x) => x !== first), 2);
      out.push(Q(`Which letter does "${w}" start with?`, first, wrong, 71 + i * 0.01));
    }
    return out;
  }
  const sents = sentencesOf(text).filter((x) => words(x).length >= 4 && words(x).length <= 16);
  const ssQ = ['Which sentence is from the text?', 'Which of these sentences did you read?', 'Which sentence appears in the text?', 'Find the sentence from the text.'];
  for (let i = 0; i < 4 && sents.length; i++) {
    const sent = sents[(c.k + i * 3) % sents.length];
    const ws = sent.split(' ');
    const idxs = ws.map((w, j) => (/^[a-z]{4,}[.,!?"]?$/.test(w) && !(j > 0 && /^(a|an)$/i.test(ws[j - 1])) ? j : -1)).filter((j) => j >= 0);
    if (!idxs.length) continue;
    const j = idxs[c.rng.int(0, idxs.length - 1)];
    const punct = ws[j].replace(/^[a-z]+/, '');
    const wr = c.rng.sample(fw, 3).map((rep) => { const cp = ws.slice(); cp[j] = rep + punct; return cp.join(' '); });
    out.push(Q(ssQ[i], sent, wr, 71 + i * 0.01));
  }
  return out;
}

function finalize(c, cand) {
  const nOpt = c.lv === 0 ? 3 : 4;
  const wrong = uniq(cand.w.filter((x) => x != null && String(x).toLowerCase() !== String(cand.a).toLowerCase()));
  if (wrong.length < nOpt - 1) return null;
  const { options, answer } = buildOptions(c.rng, cand.a, wrong, nOpt);
  return { q: cand.q, options, answer, ord: cand.ord };
}

function buildQuestions(c, s, text) {
  const cands = [...generic(c, s, text), ...(s.qs || [])].filter((x) => x.minG <= c.g);
  const seen = new Set();
  const fin = [];
  const take = (arr) => {
    for (const cand of arr) {
      const key = (cand.q + '|' + cand.a).toLowerCase();
      if (seen.has(key)) continue;
      const f = finalize(c, cand);
      if (f) { seen.add(key); fin.push(f); }
    }
  };
  take(cands);
  const easy = fin.filter((x) => x.ord < 40);
  const hard = fin.filter((x) => x.ord >= 40 && x.ord < 70);
  const fill = [];
  const minHard = c.g === 0 ? 0 : Math.min(hard.length, 3 + c.stage * 2 + (c.g >= 4 ? 1 : 0));
  const picked = [];
  const hs = c.rng.shuffle(hard);
  picked.push(...hs.slice(0, minHard));
  for (const x of c.rng.shuffle(easy)) if (picked.length < Q_PER_STORY) picked.push(x);
  for (const x of hs.slice(minHard)) if (picked.length < Q_PER_STORY) picked.push(x);
  if (picked.length < Q_PER_STORY) {
    const before = fin.length;
    take(fillers(c, text));
    fill.push(...fin.slice(before));
    for (const x of fill) if (picked.length < Q_PER_STORY) picked.push(x);
  }
  // last resort: never return fewer than 20 questions
  let guard = 0;
  while (picked.length < Q_PER_STORY && guard++ < 10) {
    const before = fin.length;
    take(fillers(c, text));
    for (const x of fin.slice(before)) if (picked.length < Q_PER_STORY) picked.push(x);
  }
  const sorted = picked.map((x, i) => ({ x, i })).sort((a, b) => a.x.ord - b.x.ord || a.i - b.i).map((o) => o.x);
  return sorted.slice(0, Q_PER_STORY).map((x, i) => ({ id: i + 1, q: x.q, options: x.options, answer: x.answer, set: i < Q_PER_SET ? 0 : 1 }));
}

const cache = new Map();
export const levelOf = (n) => Math.floor((n - 1) / STORIES_PER_LEVEL) + 1;
export const storyNo = (level, slot) => (level - 1) * STORIES_PER_LEVEL + slot + 1;

function g3ContextSentence(word, hero) {
  const map = {
    oppose: `${hero} knew that some might oppose the idea, but explained the benefits patiently.`,
    snide: `${hero} stayed cheerful and chose to ignore any snide remarks from others.`,
    heap: `All the supplies were gathered together into a neat heap on the worktable.`,
    diverse: `The group celebrated having diverse ideas because different viewpoints helped them succeed.`,
    origin: `They were eager to uncover the origin of the mystery and find where it all began.`,
    assemble: `Together, the team worked carefully to assemble all the pieces into place.`,
    grumble: `${hero} did not grumble or complain, even when the chore took extra time.`,
    calculate: `It was wise to calculate the numbers and plan every step before getting started.`,
    elegant: `The final creation looked elegant, neat, and truly beautiful.`,
    privilege: `Everyone agreed it was a special privilege to be chosen for this adventure.`,
    fragile: `The materials were fragile, so everyone held them gently with both hands.`,
    research: `They went to the books to research the facts and learn more about the topic.`,
    defend: `${hero} used clear evidence and good reasons to defend the final choice.`,
    specific: `They agreed on a specific time and location so nobody would get confused.`,
    pledge: `Each member made a sincere pledge to protect nature and help one another.`,
    redundant: `They organized their notes so no words or efforts were redundant.`,
    gesture: `${hero} made a welcoming gesture with a friendly wave and a bright smile.`,
    acknowledge: `The teacher stopped to acknowledge their teamwork and praise their effort.`,
    clutch: `${hero} kept a firm clutch on the handle until everyone arrived safely.`,
    persevere: `Even when the task was hard, they decided to persevere and finish it together.`,
    literal: `${hero} made sure everyone understood the literal meaning of each clue.`,
    dialogue: `${hero} engaged in a thoughtful dialogue to listen to every friend's point of view.`,
    rival: `${hero} showed great sportsmanship and greeted their rival warmly before the game.`,
    passion: `${hero} pursued the project with true passion and gave it their absolute best effort.`,
    claim: `${hero} gathered solid facts before anyone would claim to know the complete truth.`,
  };
  return map[word] || `${hero} worked hard and learned the true meaning of the word ${word}.`;
}

function generateKgStory(n, level, slot) {
  const book = getKgBook(level);
  const cvcs = book.cvc_words && book.cvc_words.length ? book.cvc_words : ['cat', 'sat', 'mat'];
  const sights = book.sight_words && book.sight_words.length ? book.sight_words : ['the', 'a', 'and'];
  const targetSound = book.target_sounds?.[0] || 'short-a';
  const mainWord = cvcs[0];
  const secondWord = cvcs[1] || cvcs[0];
  const thirdWord = cvcs[2] || secondWord;
  const firstLetter = mainWord[0].toUpperCase();
  const lastLetter = mainWord[mainWord.length - 1].toUpperCase();

  const title = slot === 0 ? book.title : `${book.title} (Reader ${SLOT_LABELS[slot]})`;
  const paragraphs = book.sentences;
  const text = paragraphs.join(' ');

  const wrongSound = targetSound === 'short-a' ? 'short-u' : 'short-a';
  const wrongLetters = ['B', 'M', 'T', 'S', 'P', 'D', 'R', 'F', 'H', 'L'].filter((l) => l !== firstLetter);
  const wrongLast = ['T', 'N', 'D', 'P', 'G', 'M', 'S', 'K', 'B'].filter((l) => l !== lastLetter);
  const wrongSecLetters = ['A', 'B', 'M', 'T', 'S', 'P', 'D', 'R', 'F'].filter((l) => l !== secondWord[0].toUpperCase());

  // 10 Remember / Letter & Sound questions (Set 0: id 1..10)
  const qSet0 = [
    {
      q: 'Who or what is this story about?',
      options: [`${book.emoji} ${cap(book.theme)}`, '🚀 Big rocket', '🦖 Huge dinosaur'],
      answer: 0,
    },
    {
      q: `What target phonics sound are we learning in "${book.title}"?`,
      options: [`Sound: ${targetSound}`, `Sound: ${wrongSound}`, 'Sound: silent-z'],
      answer: 0,
    },
    {
      q: 'Which 3-letter word is in this book?',
      options: [mainWord, 'watermelon', 'helicopter'],
      answer: 0,
    },
    {
      q: `What is the first letter of the word "${mainWord}"?`,
      options: [firstLetter, wrongLetters[0], wrongLetters[1]],
      answer: 0,
    },
    {
      q: 'Which word is in our reading list for this book?',
      options: [secondWord, 'dinosaur', 'alligator'],
      answer: 0,
    },
    {
      q: 'Which sight word is in this story?',
      options: [sights[0], 'yesterday', 'tomorrow'],
      answer: 0,
    },
    {
      q: `What letter does "${secondWord}" start with?`,
      options: [secondWord[0].toUpperCase(), wrongSecLetters[0], wrongSecLetters[1]],
      answer: 0,
    },
    {
      q: 'Which book code is this phonics reader?',
      options: [book.book_code, 'Book 99 - z', 'Book 100 - x'],
      answer: 0,
    },
    {
      q: 'Which sentence did we read in the book?',
      options: [paragraphs[0], 'A blue alien flew to Mars.', 'The polar bear drove a racing truck.'],
      answer: 0,
    },
    {
      q: `Is "${mainWord}" a fun phonics word to read?`,
      options: ['Yes! 😊', 'No 😢'],
      answer: 0,
    },
  ];

  // 10 Think / Phonics Practice questions (Set 1: id 11..20)
  const qSet1 = [
    {
      q: 'Find another sentence from this book:',
      options: [paragraphs[1] || paragraphs[0], 'A shark danced on top of the house.', 'The robot baked a huge chocolate pizza.'],
      answer: 0,
    },
    {
      q: `What is the last letter of the word "${mainWord}"?`,
      options: [lastLetter, wrongLast[0], wrongLast[1]],
      answer: 0,
    },
    {
      q: 'Which of these is a sight word we practiced?',
      options: [sights[1] || sights[0], 'supermarket', 'submarine'],
      answer: 0,
    },
    {
      q: `How many letters are in the CVC word "${mainWord}"?`,
      options: [`${mainWord.length} letters`, '1 letter', '12 letters'],
      answer: 0,
    },
    {
      q: `Find a word with the "${targetSound}" sound:`,
      options: [mainWord, 'zigzag', 'quantum'],
      answer: 0,
    },
    {
      q: 'Which sentence is in this story?',
      options: [paragraphs[paragraphs.length - 1], 'The monster ate a giant cloud.', 'The enchanted castle floated away.'],
      answer: 0,
    },
    {
      q: `What sound does the letter "${firstLetter}" make?`,
      options: [`/${firstLetter.toLowerCase()}/`, '/zz/', '/th/'],
      answer: 0,
    },
    {
      q: `Can you read the word "${mainWord}" out loud?`,
      options: [`Yes! "${mainWord}" 🗣️`, 'I need more practice'],
      answer: 0,
    },
    {
      q: `Which word did we read: "${thirdWord}"?`,
      options: [thirdWord, 'triangle', 'skyscraper'],
      answer: 0,
    },
    {
      q: `Great job reading Level ${level}! How many stars do you give this story?`,
      options: ['⭐⭐⭐ Three Stars!', '⭐ One Star', 'No stars'],
      answer: 0,
    },
  ];

  const questions = [
    ...qSet0.map((q, i) => ({ id: i + 1, q: q.q, options: q.options, answer: q.answer, set: 0 })),
    ...qSet1.map((q, i) => ({ id: i + 11, q: q.q, options: q.options, answer: q.answer, set: 1 })),
  ];

  return {
    id: `KG-S${String(n).padStart(3, '0')}`,
    n,
    grade: 'KG',
    level,
    slot,
    letter: SLOT_LABELS[slot],
    kind: 'phonics',
    kindLabel: 'Phonics Reader',
    title,
    emoji: book.emoji,
    genre: 'Phonics Story',
    paragraphs,
    text,
    wordCount: words(text).length,
    questions,
    book,
  };
}

export function generateStory(gradeKey, n) {
  if (n < 1 || n > STORIES_PER_GRADE) return null;
  const key = `${gradeKey}|${n}`;
  if (cache.has(key)) return cache.get(key);
  const level = levelOf(n);
  const slot = (n - 1) % STORIES_PER_LEVEL;

  if (gradeKey === 'KG') {
    const story = generateKgStory(n, level, slot);
    cache.set(key, story);
    return story;
  }

  const g = gradeIdx(gradeKey);
  const plot = PLOTS[slot];
  const c = makeCtx(gradeKey, g, n, plot, level - 1);
  c.level = level;
  c.stage = level <= 17 ? 0 : level <= 34 ? 1 : 2;
  const spec = plot.build(c);
  spec.id = plot.id;

  // Grade 3 stories systematically teach the 20 master vocabulary words in context
  if (g === 3) {
    const row = G3_PDF_WORD_ROWS[(n - 1) % G3_PDF_WORD_ROWS.length];
    const hero = spec.facts?.hero || 'The friends';
    const sent = g3ContextSentence(row[0], hero);
    spec.paras = [...spec.paras, sent];
    const wrongDefs = G3_PDF_WORD_ROWS.filter((r) => r[0] !== row[0]).map((r) => cap(r[2]));
    const wrongWords = G3_PDF_WORD_ROWS.filter((r) => r[0] !== row[0]).map((r) => r[0]);
    spec.qs = spec.qs || [];
    spec.qs.push(Q(`In this text, what does the word "${row[0]}" mean?`, cap(row[2]), wrongDefs, 48, 3));
    spec.qs.push(Q(`Which word from the story completes this sentence? "${sent.replace(new RegExp('\\b' + row[0] + '\\b', 'i'), '_____')}"`, row[0], wrongWords, 49, 3));
  }

  const text = spec.paras.join(' ');
  const questions = buildQuestions(c, spec, text);
  const story = {
    id: `${gradeKey}-S${String(n).padStart(3, '0')}`, n, grade: gradeKey, level, slot, letter: SLOT_LABELS[slot], kind: plot.id, kindLabel: KIND_LABEL[plot.id],
    title: spec.title, emoji: spec.emoji, genre: spec.genre, paragraphs: spec.paras, text, wordCount: words(text).length, questions,
  };
  cache.set(key, story);
  return story;
}

export const storiesInLevel = (grade, level) => Array.from({ length: STORIES_PER_LEVEL }, (_, i) => generateStory(grade, storyNo(level, i)));
export const allStoryHeaders = (grade) => Array.from({ length: STORIES_PER_GRADE }, (_, i) => { const s = generateStory(grade, i + 1); return { id: s.id, n: s.n, level: s.level, letter: s.letter, title: s.title, kind: s.kindLabel, words: s.wordCount, emoji: s.emoji }; });
