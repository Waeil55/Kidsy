// Quick content self-test: every grade must have 500 stories (20 questions each) and 500 unique math questions.
import assert from 'node:assert/strict';
import { generateStory } from '../src/engine/stories.js';
import { generateMath } from '../src/engine/math.js';
import { buildSpecifiedSession } from '../src/engine/specBuilder.js';
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

for (const operation of ['sub', 'div', 'add', 'mul', 'mixed_math', 'word_problems', 'fractions']) {
  const items = buildSpecifiedSession({
    grade: 'G3',
    operation,
    minNum: 10,
    maxNum: 100,
    table: operation === 'div' ? 7 : 0,
    levelMin: 1,
    levelMax: 50,
    count: 12,
    seed: `selftest-${operation}`,
  });
  assert.equal(items.length, 12, `${operation} should generate the requested number of questions`);
  for (const item of items) {
    assert.ok(item.q, `${operation} questions should have prompt text`);
    assert.ok(item.options?.length >= 3, `${operation} questions should have answer choices`);
    assert.ok(item.answer >= 0 && item.answer < item.options.length, `${operation} answers should point to an option`);
    assert.equal(new Set(item.options).size, item.options.length, `${operation} choices should be unique`);
    if (operation === 'word_problems') {
      assert.ok(item.q.includes('?') && !item.q.includes(' = ?'), 'word-problem sessions should contain story questions only');
    }
  }
}

const division = buildSpecifiedSession({
  grade: 'G3', operation: 'div', minNum: 20, maxNum: 100, table: 7,
  levelMin: 1, levelMax: 50, count: 12, seed: 'division-range',
});
for (const item of division) {
  const [, dividend, divisor] = item.explain.match(/^(\d+) ÷ (\d+) = /) || [];
  assert.ok(dividend, 'division explanations should include a dividend');
  assert.ok(+dividend >= 20 && +dividend <= 100, 'division dividends should stay in the selected range');
  assert.equal(+divisor, 7, 'division questions should use the selected table');
}
assert.throws(() => buildSpecifiedSession({
  grade: 'G3', operation: 'div', minNum: 10, maxNum: 12, table: 7,
  levelMin: 1, levelMax: 1, count: 5, seed: 'invalid-division-range',
}), RangeError, 'division should reject a table with no matching dividend');

const easySubtraction = buildSpecifiedSession({
  grade: 'G3', operation: 'sub', minNum: 10, maxNum: 20, levelMin: 1, levelMax: 1, count: 10, seed: 'levels',
});
const advancedSubtraction = buildSpecifiedSession({
  grade: 'G3', operation: 'sub', minNum: 10, maxNum: 20, levelMin: 50, levelMax: 50, count: 10, seed: 'levels',
});
assert.ok(easySubtraction.every((item) => item.q.includes(' = ?')), 'early levels should use direct arithmetic questions');
assert.ok(advancedSubtraction.some((item) => item.q.includes('had')), 'advanced levels should include word problems');
console.log('Custom Study/Exam specifications OK');
process.exit(bad ? 1 : 0);
