// Material-based exam builder: the child (or parent) ticks exactly which material goes on the
// test, and every question comes only from the ticked material.
import { makeRng, buildOptions, cap } from '../lib/rng.js';
import { G3_PDF_WORD_ROWS, G3_WORD_WEEKS } from '../data/g3ela.js';
import { merolaLessons, merolaStories, merolaWordParts } from '../data/merola.js';
import { generateSpecifiedMathQuestion } from './specBuilder.js';
import { kgActivityQuestions } from './math.js';
import { vocabQuiz, grammarQuiz, fillItem, customToItems } from './quizzes.js';
import { generateStory } from './stories.js';

const range = (a, b) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
const splitList = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);

// One question about a word row; only that row can be the right answer.
// type: 0 meaning, 1 which word, 2 sentence blank, 3 synonym, 4 antonym. Returns null if the
// row has no data for that type.
export function wordQuestion(row, type, r) {
  const [w, pos, def, syn, ant, ex] = row;
  const others = G3_PDF_WORD_ROWS.filter((x) => x[0] !== w);
  const syns = splitList(syn);
  const ants = splitList(ant);
  const blank = new RegExp(`\\b${w}\\b`, 'i');
  let q; let correct; let wrong;
  if (type === 0) { q = `What does "${w}" mean?`; correct = cap(def); wrong = others.map((x) => cap(x[2])); }
  else if (type === 1) { q = `Which word means "${def.toLowerCase()}"?`; correct = w; wrong = others.map((x) => x[0]); }
  else if (type === 2) { if (!blank.test(ex)) return null; q = ex.replace(blank, '_____'); correct = w; wrong = others.map((x) => x[0]); }
  else if (type === 3) { if (!syns.length) return null; q = `Which word means the SAME as "${w}"?`; correct = syns[0]; wrong = others.flatMap((x) => splitList(x[3])).filter((t) => !syns.includes(t)); }
  else { if (!ants.length) return null; q = `Which word means the OPPOSITE of "${w}"?`; correct = ants[0]; wrong = others.flatMap((x) => splitList(x[4])).filter((t) => !ants.includes(t)); }
  const { options, answer } = buildOptions(r, correct, wrong, 4);
  return { id: `word-${w}-${type}`, q, options, answer, subject: 'vocab', word: w, explain: `${w} (${pos}): ${def}. ${ex}` };
}

const MATH_OPS = [
  ['add', 'Addition (+)'], ['sub', 'Subtraction (−)'], ['mul', 'Multiplication (×)'], ['div', 'Division (÷)'],
  ['word_problems', 'Word problems'], ['fractions', 'Fractions'],
];

const lessonIdx = (prefix) => merolaLessons.map((l, i) => (l.title.startsWith(prefix) ? i : -1)).filter((i) => i >= 0);

// Every material that can be ticked for this grade, in groups.
export function examMaterials(grade, customCount = 0) {
  const groups = [];
  if (grade === 'KG') {
    groups.push({ title: 'Math', items: [
      { key: 'kg:counting', label: 'Counting 1–10', math: true },
      { key: 'kg:addsub', label: 'Add & subtract within 10', math: true },
      { key: 'kg:shapes', label: 'Shapes & colors' },
    ] });
    groups.push({ title: 'English', items: [{ key: 'kg:letters', label: 'Alphabet & phonics' }] });
  } else {
    groups.push({ title: 'Math', items: MATH_OPS
      .filter(([k]) => grade !== 'G1' || !['div', 'fractions'].includes(k))
      .map(([k, label]) => ({ key: `math:${k}`, label, math: true })) });
    groups.push({ title: 'English', items: [
      { key: 'eng:reading', label: 'Reading stories' },
      { key: 'eng:vocab', label: 'Vocabulary' },
      { key: 'eng:grammar', label: 'Grammar' },
      { key: 'eng:fill', label: 'Fill in the blank' },
    ] });
  }
  if (grade === 'G3') {
    groups.push({ title: 'Merola weekly words', items: G3_WORD_WEEKS.map((wk) => ({ key: `week:${wk.key}`, label: wk.label, note: `${wk.rows.length} words` })) });
    groups.push({ title: 'Merola library', items: [
      { key: 'merola:opp', label: 'Opposites' },
      { key: 'merola:syn', label: 'Synonyms' },
      { key: 'merola:ctx', label: 'Context clues' },
      { key: 'merola:parts', label: 'Prefixes & suffixes' },
      { key: 'merola:stories', label: 'Merola stories' },
    ] });
  }
  if (customCount) groups.push({ title: 'My own', items: [{ key: 'own:all', label: 'My own questions', note: `${customCount}` }] });
  return groups;
}

// The pool of questions for one ticked material.
function poolFor(key, { grade, n, seed, minNum, maxNum, maxLevel, custom }) {
  const r = makeRng(`${grade}|${key}|${seed}`);
  const [kind, sub] = key.split(':');
  if (kind === 'math') {
    return range(0, n - 1).map((i) => generateSpecifiedMathQuestion({ grade, operation: sub, minNum, maxNum, level: r.int(1, maxLevel), seed }, i, makeRng(`${seed}|${key}|${i}`)));
  }
  if (kind === 'kg') return kgActivityQuestions(sub, n, seed);
  if (kind === 'eng') {
    const nums = r.sample(range(1, maxLevel * 10), n * 2);
    if (sub === 'reading') {
      return r.shuffle(nums.slice(0, 4).flatMap((num) => {
        const s = generateStory(grade, num);
        return s.questions.map((q) => ({ id: `${grade}-S${num}-${q.id}`, q: q.q, options: q.options, answer: q.answer, subject: 'reading', source: s.title }));
      }));
    }
    if (sub === 'vocab') return vocabQuiz(grade, n, seed);
    if (sub === 'grammar') return grammarQuiz(grade, n, seed);
    if (sub === 'fill') return nums.map((num) => fillItem(grade, num)).filter(Boolean);
  }
  if (kind === 'week') {
    const rows = (G3_WORD_WEEKS.find((w) => w.key === sub) || { rows: [] }).rows;
    if (!rows.length) return [];
    return r.shuffle(rows.flatMap((row) => range(0, 4).map((t) => wordQuestion(row, t, makeRng(`${seed}|${key}|${row[0]}|${t}`)))).filter(Boolean));
  }
  if (kind === 'merola') {
    if (sub === 'parts') return r.shuffle(merolaWordParts.flatMap((g) => g.items));
    if (sub === 'stories') return r.shuffle(merolaStories.flatMap((s) => s.items.map((it) => ({ ...it, source: s.title }))));
    const idx = lessonIdx({ opp: 'Opposites', syn: 'Synonyms', ctx: 'Context' }[sub]);
    return r.shuffle(idx.flatMap((i) => merolaLessons[i].items));
  }
  if (kind === 'own') return r.shuffle(customToItems(custom));
  return [];
}

// Split `size` questions evenly across the ticked materials, never repeating a question.
export function buildMaterialExam({ grade, selected, size = 20, minNum = 1, maxNum = 20, maxLevel = 10, custom = [], seed = `exam-${Date.now()}` }) {
  const all = examMaterials(grade, custom.length).flatMap((g) => g.items);
  const mats = all.filter((m) => selected.includes(m.key));
  if (!mats.length) return [];
  const r = makeRng(seed);
  const base = Math.floor(size / mats.length);
  let extra = size - base * mats.length;
  const out = [];
  for (const m of mats) {
    const want = base + (extra-- > 0 ? 1 : 0);
    if (!want) continue;
    const seen = new Set();
    const pool = poolFor(m.key, { grade, n: want + 6, seed, minNum, maxNum, maxLevel, custom })
      .filter((q) => q && q.q && !seen.has(q.q) && seen.add(q.q));
    out.push(...pool.slice(0, want).map((q) => ({ ...q, material: m.label })));
  }
  return r.shuffle(out).map((q, i) => ({ ...q, id: `${q.id}#${i}` }));
}
