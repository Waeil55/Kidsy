// Hundreds of real reading words per grade, collected from the grade's own 500 stories.
// Every word is filtered to fit its grade: never longer than a child that age is expected to read,
// so a Kindergarten or Grade 1 list never carries a word borrowed from an older grade.
import { generateStory } from './stories.js';

const STOP = new Set('the and that this with from they them then there their were was have has had for are but not you your his her she him its our out all can will would could should what when where who why how into over under than too very just also more some such about after before because while these those been being does did done each much many most other only same still upon once said says'.split(' '));
const cache = {};

// The longest word a grade is expected to read on its own — keeps every grade's words its own size,
// never mixing in a longer word meant for an older grade.
export const MAX_WORD_LEN = { KG: 4, G1: 6, G2: 8, G3: 10, G4: 12, G5: 14, G6: 99 };
const capFor = (grade) => MAX_WORD_LEN[grade] || 12;

export function storyWords(grade) {
  if (cache[grade]) return cache[grade];
  const min = grade === 'KG' || grade === 'G1' ? 3 : 4;
  const max = capFor(grade);
  const freq = new Map();
  for (let n = 1; n <= 500; n += 2) {
    const s = generateStory(grade, n);
    if (!s) continue;
    for (const raw of s.paragraphs.join(' ').toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []) {
      if (raw.length < min || raw.length > max || STOP.has(raw) || raw.includes("'")) continue;
      freq.set(raw, (freq.get(raw) || 0) + 1);
    }
  }
  cache[grade] = [...freq.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([w, n]) => ({ w, n }));
  return cache[grade];
}

// the most useful words from the 10 stories of one level
export function levelWords(grade, level, max = 18) {
  const cap = capFor(grade);
  const freq = new Map();
  for (let i = 0; i < 10; i++) {
    const s = generateStory(grade, (level - 1) * 10 + i + 1);
    if (!s) continue;
    for (const raw of s.paragraphs.join(' ').toLowerCase().match(/[a-z]+/g) || []) {
      if (raw.length < 4 || raw.length > cap || STOP.has(raw)) continue;
      freq.set(raw, (freq.get(raw) || 0) + 1);
    }
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, max).map(([w]) => w);
}
