// A big library of ready-made exams for every grade. Each one is built from a fixed seed, so
// "Level 12 Test" always has the same questions and a child can beat their own best score.
import { buildExam } from './quizzes.js';

export const LIB_TABS = [['level', 'Level tests'], ['chapter', 'Chapter finals'], ['subject', 'By subject'], ['speed', 'Speed rounds'], ['champ', 'Champion']];
const ALL = ['reading', 'math', 'vocab', 'grammar', 'fill'];
const SUB = { reading: ['📖', 'Reading'], math: ['🔢', 'Math'], vocab: ['🔤', 'Vocabulary'], grammar: ['✏️', 'Grammar'], fill: ['🧩', 'Fill in the blank'] };
const CHAPTER = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5'];

export function examLibrary(grade) {
  const out = [];
  const add = (tab, name, emoji, blurb, size, opts) => out.push({ tab, name, emoji, blurb, size, build: () => buildExam({ grade, size, ...opts }) });
  for (let n = 1; n <= 50; n++) add('level', `Level ${n} test`, ['🌱', '🌿', '🌳', '🌟', '🏆'][Math.floor((n - 1) / 10)], `all subjects, level ${n}`, 20, { subjects: ALL, minLevel: n, maxLevel: n, seed: `L${n}` });
  CHAPTER.forEach((c, i) => add('chapter', `${c} final`, ['🏝️', '🌋', '🏰', '🚀', '👑'][i], `levels ${i * 10 + 1}–${i * 10 + 10}`, 30, { subjects: ALL, minLevel: i * 10 + 1, maxLevel: i * 10 + 10, seed: `C${i}` }));
  for (const [k, [emoji, label]] of Object.entries(SUB)) {
    CHAPTER.forEach((c, i) => add('subject', `${label} · ${c}`, emoji, `levels ${i * 10 + 1}–${i * 10 + 10}`, 20, { subjects: [k], minLevel: i * 10 + 1, maxLevel: i * 10 + 10, seed: `S${k}${i}` }));
  }
  for (let n = 1; n <= 12; n++) add('speed', `Speed round ${n}`, '⚡', 'quick mixed quiz', 10, { subjects: ALL, minLevel: 1, maxLevel: Math.min(50, n * 4), seed: `R${n}` });
  add('champ', 'Grade champion exam', '🏆', 'everything, all 50 levels', 50, { subjects: ALL, seed: 'champ' });
  add('champ', 'Reading champion', '📚', 'stories only', 40, { subjects: ['reading'], seed: 'champR' });
  add('champ', 'Math champion', '🧮', 'math only', 40, { subjects: ['math'], seed: 'champM' });
  add('champ', 'Word champion', '🔠', 'vocabulary and grammar', 40, { subjects: ['vocab', 'grammar'], seed: 'champW' });
  return out;
}
