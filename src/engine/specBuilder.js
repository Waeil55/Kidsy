// Engine for building custom specifications for Study and Exams.
// Allows students, teachers and parents to target exact operations (e.g. Subtraction only,
// Division only), exact number ranges (e.g. from 1 to 20, 10 to 100, or custom min/max),
// specific times tables (e.g. 7s table, 8s table), and grade levels.
import { makeRng, buildOptions, uniq, cap } from '../lib/rng.js';
import { G3_PDF_WORD_ROWS } from '../data/g3ela.js';
import { kgActivityQuestions } from './math.js';
import { grammarQuiz, fillItem } from './quizzes.js';

const NAMES = ['Mia', 'Leo', 'Ava', 'Sam', 'Zoe', 'Ben', 'Nora', 'Omar', 'Ella', 'Theo', 'Ruby', 'Kai', 'Lina', 'Owen', 'Maya', 'Finn'];
const ITEMS = ['apples', 'stickers', 'marbles', 'books', 'cards', 'cookies', 'shells', 'pencils', 'balloons', 'coins', 'crayons'];
const FRUITS = ['🍎', '🍌', '🍓', '⭐', '🎈', '🍪', '🌸', '🚗'];

// Formatter for options
const fmt = (n) => String(n);

function numChoices(r, correct, extra = [], minVal = 0) {
  const c = correct;
  const near = [
    c + 1, c - 1, c + 2, c - 2, c + 3, c - 3,
    c + 10, c - 10, c * 2, Math.floor(c / 2),
    ...extra,
  ].filter((x) => Number.isFinite(x) && x !== c && x >= minVal);
  return uniq(near).map(fmt);
}

// ---------------------------------------------------------------- MATH GENERATOR BY SPEC
export function generateSpecifiedMathQuestion(spec, index, rng) {
  const r = rng || makeRng(`${spec.grade}|${spec.operation}|${spec.seed ?? 'spec'}|${index}`);
  const op = spec.operation || 'sub';
  const minN = Number.isFinite(+spec.minNum) ? Math.max(0, Math.trunc(+spec.minNum)) : 1;
  const maxN = Number.isFinite(+spec.maxNum) ? Math.max(minN + 1, Math.trunc(+spec.maxNum)) : 20;
  const table = +spec.table || 0;
  const tableMin = +spec.tableMin || 1;
  const tableMax = +spec.tableMax || 12;
  const level = Math.max(1, Math.min(50, +spec.level || 1));
  const name = r.pick(NAMES);
  const thing = r.pick(ITEMS);
  const emoji = r.pick(FRUITS);
  const nOpt = spec.grade === 'KG' || spec.grade === 'G1' ? 3 : 4;

  let q = '';
  let ans = 0;
  let wrong = [];
  let explain = '';
  let hint = '';
  let steps = [];
  let visual = null;

  // 1. SUBTRACTION ONLY
  if (op === 'sub') {
    const type = spec.forceWordProblem ? 2 : level < 10 ? 0 : level < 25 ? index % 2 : index % 4;
    const minA = Math.min(maxN, Math.max(minN + 1, 2));
    const a = r.int(minA, maxN);
    const b = r.int(minN, a);
    ans = a - b;

    if (type === 0) {
      q = `${a} − ${b} = ?`;
      hint = `Start at ${a} and count backwards ${b} steps.`;
      steps = [`Start with ${a}.`, `Take away ${b}.`, `${a} − ${b} = ${ans}.`];
    } else if (type === 1) {
      q = `${a} − ? = ${ans}`;
      hint = `What number must you take away from ${a} to get ${ans}? Think: ${a} − ${ans} = ?`;
      steps = [`We know the start is ${a} and the remainder is ${ans}.`, `Subtract: ${a} − ${ans} = ${b}.`, `So ${a} − ${b} = ${ans}.`];
      const correctVal = b;
      wrong = numChoices(r, correctVal, [ans, a, correctVal + 1, correctVal - 1]);
      const { options, answer } = buildOptions(r, fmt(correctVal), wrong, nOpt);
      return {
        id: `spec-sub-${index + 1}`,
        q,
        options,
        answer,
        subject: 'math',
        operation: 'sub',
        explain: `${a} − ${b} = ${ans}.`,
        hint,
        steps,
        visual: a <= 24 ? { type: 'subtraction', total: a, take: b, remain: ans, emoji } : null,
      };
    } else if (type === 2) {
      q = `${name} had ${a} ${thing}. ${name} gave away ${b} of them. How many ${thing} are left?`;
      hint = `Subtract the ones given away from the starting amount: ${a} − ${b}.`;
      steps = [`${name} started with ${a} ${thing}.`, `${b} were given away.`, `${a} − ${b} = ${ans} ${thing} left.`];
    } else {
      const friend = r.pick(NAMES.filter((x) => x !== name));
      q = `${name} has ${a} ${thing}. ${friend} has ${b} ${thing}. How many more ${thing} does ${name} have?`;
      hint = `Find the difference by subtracting: ${a} − ${b}.`;
      steps = [`Compare ${a} and ${b}.`, `Find difference: ${a} − ${b} = ${ans}.`, `${name} has ${ans} more ${thing}.`];
    }

    wrong = numChoices(r, ans, [a + b, a, b, ans + 1, ans - 1, Math.abs(a - b - 1)]);
    explain = `${a} − ${b} = ${ans}.`;
    visual = a <= 24 ? { type: 'subtraction', total: a, take: b, remain: ans, emoji } : null;
  }

  // 2. DIVISION ONLY
  else if (op === 'div') {
    const type = spec.forceWordProblem ? 2 : level < 10 ? 0 : level < 25 ? index % 2 : index % 3;
    const minDividend = Math.max(1, minN);
    const divisors = table > 0
      ? [table]
      : Array.from({ length: Math.min(tableMax, maxN) - tableMin + 1 }, (_, i) => i + tableMin);
    const validDivisors = divisors.filter((d) => (
      d > 0 && Math.ceil(minDividend / d) <= Math.floor(maxN / d)
    ));
    if (!validDivisors.length) {
      throw new RangeError(`No division facts fit the selected number range (${minN}–${maxN}) and table.`);
    }
    const divisor = r.pick(validDivisors);
    const minQuotient = Math.max(1, Math.ceil(minDividend / divisor));
    const maxQuotient = Math.floor(maxN / divisor);
    const quotient = r.int(minQuotient, maxQuotient);
    const dividend = divisor * quotient;
    ans = quotient;

    if (type === 0) {
      q = `${dividend} ÷ ${divisor} = ?`;
      hint = `Think of multiplication: What number times ${divisor} equals ${dividend}?`;
      steps = [
        `We have ${dividend} items split into ${divisor} equal groups.`,
        `Since ${divisor} × ${quotient} = ${dividend},`,
        `${dividend} ÷ ${divisor} = ${quotient}.`,
      ];
    } else if (type === 1) {
      q = `${dividend} ÷ ? = ${quotient}`;
      hint = `How many groups of ${quotient} are in ${dividend}?`;
      steps = [`Divide ${dividend} by ${quotient}: ${dividend} ÷ ${quotient} = ${divisor}.`, `So ${dividend} ÷ ${divisor} = ${quotient}.`];
      const correctVal = divisor;
      wrong = numChoices(r, correctVal, [quotient, dividend, correctVal + 1, correctVal - 1]);
      const { options, answer } = buildOptions(r, fmt(correctVal), wrong, nOpt);
      return {
        id: `spec-div-${index + 1}`,
        q,
        options,
        answer,
        subject: 'math',
        operation: 'div',
        explain: `${dividend} ÷ ${divisor} = ${quotient}.`,
        hint,
        steps,
        visual: dividend <= 36 ? { type: 'division', total: dividend, groups: divisor, perGroup: quotient, emoji } : null,
      };
    } else {
      q = `${name} shares ${dividend} ${thing} equally among ${divisor} friends. How many does each friend get?`;
      hint = `Share ${dividend} equally into ${divisor} groups: ${dividend} ÷ ${divisor}.`;
      steps = [
        `Total ${thing}: ${dividend}.`,
        `Number of friends: ${divisor}.`,
        `${dividend} ÷ ${divisor} = ${quotient} ${thing} each.`,
      ];
    }

    wrong = numChoices(r, ans, [divisor, dividend, ans + 1, ans - 1, ans + 2]);
    explain = `${dividend} ÷ ${divisor} = ${quotient}. (${divisor} × ${quotient} = ${dividend})`;
    visual = dividend <= 36 ? { type: 'division', total: dividend, groups: divisor, perGroup: quotient, emoji } : null;
  }

  // 3. ADDITION ONLY
  else if (op === 'add') {
    const type = spec.forceWordProblem ? 2 : level < 10 ? 0 : level < 25 ? index % 2 : index % 3;
    const a = r.int(minN, Math.max(minN, Math.floor(maxN * 0.75)));
    const b = r.int(minN, Math.max(minN, maxN - a));
    ans = a + b;

    if (type === 0) {
      q = `${a} + ${b} = ?`;
      hint = `Start with ${Math.max(a, b)} and count up ${Math.min(a, b)} more.`;
      steps = [`Start with ${a}.`, `Add ${b} more.`, `${a} + ${b} = ${ans}.`];
    } else if (type === 1) {
      q = `${a} + ? = ${ans}`;
      hint = `What number added to ${a} equals ${ans}? Think: ${ans} − ${a}.`;
      steps = [`Subtract the known part: ${ans} − ${a} = ${b}.`, `So ${a} + ${b} = ${ans}.`];
      const correctVal = b;
      wrong = numChoices(r, correctVal, [ans, a, correctVal + 1, correctVal - 1]);
      const { options, answer } = buildOptions(r, fmt(correctVal), wrong, nOpt);
      return {
        id: `spec-add-${index + 1}`,
        q,
        options,
        answer,
        subject: 'math',
        operation: 'add',
        explain: `${a} + ${b} = ${ans}.`,
        hint,
        steps,
        visual: ans <= 24 ? { type: 'addition', a, b, total: ans, emoji } : null,
      };
    } else {
      q = `${name} has ${a} ${thing}. ${name} finds ${b} more. How many ${thing} does ${name} have now?`;
      hint = `Combine the two amounts together: ${a} + ${b}.`;
      steps = [`Started with ${a}.`, `Added ${b} more.`, `${a} + ${b} = ${ans} ${thing}.`];
    }

    wrong = numChoices(r, ans, [Math.abs(a - b), ans + 1, ans - 1, ans + 10]);
    explain = `${a} + ${b} = ${ans}.`;
    visual = ans <= 24 ? { type: 'addition', a, b, total: ans, emoji } : null;
  }

  // 4. MULTIPLICATION ONLY
  else if (op === 'mul') {
    const type = spec.forceWordProblem ? 2 : level < 10 ? 0 : level < 25 ? index % 2 : index % 3;
    const a = table > 0 ? table : r.int(tableMin, tableMax);
    const b = r.int(1, 12);
    ans = a * b;

    if (type === 0) {
      q = `${a} × ${b} = ?`;
      hint = `Think of ${a} groups of ${b}, or add ${b} repeatedly ${a} times.`;
      steps = [`${a} groups with ${b} in each group.`, `${a} × ${b} = ${ans}.`];
    } else if (type === 1) {
      q = `${a} × ? = ${ans}`;
      hint = `Divide the product by ${a}: ${ans} ÷ ${a}.`;
      steps = [`We know the product is ${ans}.`, `Divide: ${ans} ÷ ${a} = ${b}.`, `So ${a} × ${b} = ${ans}.`];
      const correctVal = b;
      wrong = numChoices(r, correctVal, [a, ans, correctVal + 1, correctVal - 1]);
      const { options, answer } = buildOptions(r, fmt(correctVal), wrong, nOpt);
      return {
        id: `spec-mul-${index + 1}`,
        q,
        options,
        answer,
        subject: 'math',
        operation: 'mul',
        explain: `${a} × ${b} = ${ans}.`,
        hint,
        steps,
        visual: a <= 10 && b <= 10 ? { type: 'array', rows: a, cols: b, total: ans, emoji } : null,
      };
    } else {
      q = `There are ${a} bags. Each bag contains ${b} ${thing}. How many ${thing} are there altogether?`;
      hint = `Multiply the number of bags by the items in each bag: ${a} × ${b}.`;
      steps = [`${a} bags × ${b} ${thing} each = ${ans} ${thing}.`];
    }

    wrong = numChoices(r, ans, [a + b, ans + a, ans - b, ans + 1, ans - 1]);
    explain = `${a} × ${b} = ${ans}.`;
    visual = a <= 10 && b <= 10 ? { type: 'array', rows: a, cols: b, total: ans, emoji } : null;
  }

  // 5. WORD PROBLEMS ONLY
  else if (op === 'word_problems') {
    const subOp = ['add', 'sub', 'mul', 'div'][index % 4];
    return generateSpecifiedMathQuestion({ ...spec, operation: subOp, forceWordProblem: true }, 2, r);
  }

  // 6. FRACTIONS ONLY
  else if (op === 'fractions') {
    const denom = r.pick([2, 3, 4, 5, 6, 8, 10]);
    const num = r.int(1, denom - 1);
    const whole = denom * r.int(2, 6);
    const type = index % 2;

    if (type === 0) {
      q = `What is 1/${denom} of ${whole}?`;
      ans = whole / denom;
      hint = `Divide ${whole} by the denominator ${denom}.`;
      steps = [`${whole} ÷ ${denom} = ${ans}.`, `So 1/${denom} of ${whole} is ${ans}.`];
      wrong = numChoices(r, ans, [whole - denom, denom, ans + 1, ans - 1]);
      explain = `1/${denom} of ${whole} = ${whole} ÷ ${denom} = ${ans}.`;
    } else {
      q = `A pizza has ${denom} equal slices. ${name} eats ${num} slices. What fraction of the pizza was eaten?`;
      const fracStr = `${num}/${denom}`;
      const wrongFracs = uniq([
        `${denom - num}/${denom}`,
        `${num}/${denom + 1}`,
        `${denom}/${num}`,
        `1/${denom}`,
      ]).filter((x) => x !== fracStr);
      const { options, answer } = buildOptions(r, fracStr, wrongFracs, nOpt);
      return {
        id: `spec-frac-${index + 1}`,
        q,
        options,
        answer,
        subject: 'math',
        operation: 'fractions',
        explain: `${num} out of ${denom} equal parts is written as ${num}/${denom}.`,
        hint: `Write the parts eaten over the total number of parts.`,
        steps: [`Total parts: ${denom}.`, `Parts eaten: ${num}.`, `Fraction: ${num}/${denom}.`],
        visual: { type: 'fraction', num, denom },
      };
    }
  }

  // 7. MIXED MATH
  else {
    const ops = spec.grade === 'KG' || spec.grade === 'G1' ? ['add', 'sub'] : ['add', 'sub', 'mul', 'div'];
    const chosenOp = ops[index % ops.length];
    return generateSpecifiedMathQuestion({ ...spec, operation: chosenOp }, index, r);
  }

  const { options, answer } = buildOptions(r, fmt(ans), wrong, nOpt);
  return {
    id: `spec-math-${index + 1}`,
    q,
    options,
    answer,
    subject: 'math',
    operation: op,
    explain,
    hint,
    steps,
    visual,
  };
}

// ---------------------------------------------------------------- G3 SCHOOL VOCAB QUESTIONS
export function generateG3VocabQuestion(index, rng) {
  const r = rng || makeRng(`G3|spec-vocab|${index}`);
  const row = G3_PDF_WORD_ROWS[index % G3_PDF_WORD_ROWS.length];
  const [w, pos, def, syn, ant, ex] = row;
  const others = G3_PDF_WORD_ROWS.filter((x) => x[0] !== w);
  const type = index % 4;

  let q = '';
  let correct = '';
  let wrong = [];
  let explain = '';
  let hint = `Part of speech: ${pos}. Definition: ${def}.`;

  if (type === 0) {
    q = `What is the definition of "${w}"?`;
    correct = cap(def);
    wrong = r.shuffle(others.map((x) => cap(x[2]))).slice(0, 3);
    explain = `"${w}" (${pos}) means: ${def}.`;
  } else if (type === 1) {
    q = `Which word means "${def}"?`;
    correct = w;
    wrong = r.shuffle(others.map((x) => x[0])).slice(0, 3);
    explain = `${w}: ${def}.`;
  } else if (type === 2 && ex && new RegExp(`\\b${w}\\b`, 'i').test(ex)) {
    q = ex.replace(new RegExp(`\\b${w}\\b`, 'i'), '_____');
    correct = w;
    wrong = r.shuffle(others.map((x) => x[0])).slice(0, 3);
    explain = ex;
    hint = `Which word correctly fits this school sentence? Meaning: ${def}.`;
  } else {
    const synList = syn.split(',').map((s) => s.trim()).filter(Boolean);
    const antList = ant.split(',').map((a) => a.trim()).filter(Boolean);
    const askSyn = synList.length > 0 && (antList.length === 0 || r.chance(0.5));

    if (askSyn && synList.length) {
      q = `Which word is a synonym (same meaning) for "${w}"?`;
      correct = synList[0];
      const otherSyns = others.flatMap((x) => x[3].split(',').map((s) => s.trim())).filter((x) => x && !synList.includes(x));
      wrong = r.shuffle(otherSyns).slice(0, 3);
      explain = `"${synList[0]}" is a synonym for "${w}" (${def}).`;
    } else if (antList.length) {
      q = `Which word is an antonym (opposite meaning) for "${w}"?`;
      correct = antList[0];
      const otherAnts = others.flatMap((x) => x[4].split(',').map((a) => a.trim())).filter((x) => x && !antList.includes(x));
      wrong = r.shuffle(otherAnts).slice(0, 3);
      explain = `"${antList[0]}" is an antonym for "${w}".`;
    } else {
      q = `What part of speech is "${w}"?`;
      correct = pos;
      wrong = ['noun', 'verb', 'adjective', 'adverb'].filter((p) => p !== pos);
      explain = `"${w}" is a ${pos}.`;
    }
  }

  const { options, answer } = buildOptions(r, correct, wrong, 4);
  return {
    id: `spec-g3vocab-${index + 1}`,
    q,
    options,
    answer,
    subject: 'vocab',
    operation: 'g3_vocab',
    word: w,
    pos,
    definition: def,
    explain,
    hint,
    steps: [`Word: ${w}`, `Part of speech: ${pos}`, `Meaning: ${def}`, `Example: ${ex}`],
    visual: { type: 'vocab', word: w, pos, def, syn, ant, ex },
  };
}

// ---------------------------------------------------------------- MASTER BUILDER
export function buildSpecifiedSession(spec) {
  const count = Math.max(5, Math.min(50, +spec.count || 10));
  const grade = spec.grade || 'G3';
  const op = spec.operation || 'sub';
  const seed = spec.seed || `spec-${Date.now()}`;

  const items = [];

  for (let i = 0; i < count; i++) {
    const saltRng = makeRng(`${grade}|${op}|${seed}|item-${i}`);
    const minLevel = Math.max(1, Math.min(50, +spec.levelMin || 1));
    const maxLevel = Math.max(minLevel, Math.min(50, +spec.levelMax || 50));
    const level = saltRng.int(minLevel, maxLevel);
    const levelSpec = { ...spec, grade, level };

    if (op === 'g3_vocab' || (grade === 'G3' && op === 'vocab')) {
      items.push(generateG3VocabQuestion(i, saltRng));
    } else if (['sub', 'div', 'add', 'mul', 'mixed_math', 'word_problems', 'fractions'].includes(op)) {
      items.push(generateSpecifiedMathQuestion(levelSpec, i, saltRng));
    } else if (op === 'fill') {
      const n = (level - 1) * 10 + (i % 10) + 1;
      const f = fillItem(grade, n);
      if (f) items.push({ ...f, id: `spec-fill-${i + 1}`, hint: 'Read the whole sentence and look for clues.', steps: [f.explain] });
      else items.push(generateSpecifiedMathQuestion({ ...levelSpec, operation: 'add' }, i, saltRng));
    } else if (op === 'grammar') {
      const q = grammarQuiz(grade, 1, `spec-g-${seed}-${i}`)[0];
      if (q) items.push({ ...q, id: `spec-gram-${i + 1}`, hint: 'Think about grammar rules and word endings.', steps: [q.explain] });
      else items.push(generateSpecifiedMathQuestion({ ...levelSpec, operation: 'add' }, i, saltRng));
    } else if (op.startsWith('kg_')) {
      const act = op.replace('kg_', '');
      const q = kgActivityQuestions(act, 1, `spec-${seed}-${i}`)[0];
      if (q) items.push({ ...q, id: `spec-kg-${i + 1}`, hint: 'Take your time and look carefully!', steps: [q.explain] });
      else items.push(generateSpecifiedMathQuestion({ ...levelSpec, operation: 'add', minNum: 1, maxNum: 10 }, i, saltRng));
    } else {
      // General math fallback
      items.push(generateSpecifiedMathQuestion(levelSpec, i, saltRng));
    }
  }

  return items;
}
