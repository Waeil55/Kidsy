// Hundreds of real reading words per grade, collected from the grade's own 500 stories.
import { generateStory } from './stories.js';

const STOP = new Set('the and that this with from they them then there their were was have has had for are but not you your his her she him its our out all can will would could should what when where who why how into over under than too very just also more some such about after before because while these those been being does did done each much many most other only same still upon once said says'.split(' '));
const cache = {};

export function storyWords(grade) {
  if (cache[grade]) return cache[grade];
  const min = grade === 'KG' || grade === 'G1' ? 3 : 4;
  const freq = new Map();
  for (let n = 1; n <= 500; n += 2) {
    const s = generateStory(grade, n);
    if (!s) continue;
    for (const raw of s.paragraphs.join(' ').toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []) {
      if (raw.length < min || STOP.has(raw) || raw.includes("'")) continue;
      freq.set(raw, (freq.get(raw) || 0) + 1);
    }
  }
  cache[grade] = [...freq.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([w, n]) => ({ w, n }));
  return cache[grade];
}
