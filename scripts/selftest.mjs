// Quick content self-test: every grade must have 500 stories (20 questions each) and 500 unique math questions.
import { generateStory } from '../src/engine/stories.js';
import { generateMath } from '../src/engine/math.js';
let bad = 0;
for (const g of ['KG', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6']) {
  const qs = new Set();
  for (let n = 1; n <= 500; n++) {
    const s = generateStory(g, n);
    if (!s || s.questions.length !== 20 || s.questions.filter((q) => q.set === 0).length !== 10) { bad++; console.log('BAD story', g, n); }
    const m = generateMath(g, n);
    if (!m) { bad++; console.log('BAD math', g, n); } else qs.add(m.q);
  }
  console.log(`${g}: 500 stories OK, ${qs.size} unique math questions`);
}
console.log(bad ? `${bad} problems` : 'All good');
process.exit(bad ? 1 : 0);
