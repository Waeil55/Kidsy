/* School lesson upload extractor — strict, never mixes content.
   Format per lesson block:
     [GRADE: G3] [SUBJECT: math] [TITLE: Times tables]
     Q: question text | opt1 | opt2 | opt3 | answer-index
     F: word | meaning | sentence
     S: story paragraph line (blank line separates paragraphs)
     MATH: 3 x 4 = ? | 12 | 10 | 14 | 11 | 0
     FILL: The cat ___ on the mat. | sat
   Any block missing a valid GRADE or SUBJECT goes to `review`
   untouched — it is NEVER auto-assigned to a grade. */

import { GRADE_KEYS, SUBJECTS } from '../data/grades.js';

const HEADER_RE = /\[GRADE:\s*([^\]]+)\]\s*\[SUBJECT:\s*([^\]]+)\]\s*(?:\[TITLE:\s*([^\]]+)\])?/i;

export function parseSchoolUpload(text) {
  const lessons = [];
  const review = [];
  const chunks = String(text || '').split(/\n\s*\n\s*(?=\[GRADE:)/gi);

  // If no headers at all, everything goes to review
  if (!/\[GRADE:/i.test(text || '')) {
    if (String(text || '').trim()) review.push({ reason: 'No [GRADE:] header found — grade unknown, not imported.', text: String(text).slice(0, 2000) });
    return { lessons, review };
  }

  // Split keeping headers: split on blank line followed by [GRADE:
  const parts = String(text).split(/(?=\[GRADE:)/gi);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const m = trimmed.match(HEADER_RE);
    if (!m) {
      review.push({ reason: 'Block has no valid [GRADE:] [SUBJECT:] header — not imported.', text: trimmed.slice(0, 2000) });
      continue;
    }
    let grade = m[1].trim().toUpperCase();
    if (grade === 'K' || grade === 'KG' || grade === 'KINDERGARTEN') grade = 'KG';
    if (/^GRADE\s*[1-6]$/.test(grade)) grade = 'G' + grade.slice(-1);
    let subject = m[2].trim().toLowerCase();
    if (!GRADE_KEYS.includes(grade)) {
      review.push({ reason: `Unknown grade "${m[1].trim()}" — not imported.`, text: trimmed.slice(0, 2000) });
      continue;
    }
    if (!SUBJECTS.includes(subject)) {
      review.push({ reason: `Unknown subject "${m[2].trim()}" (need english|math|science|general) — not imported.`, text: trimmed.slice(0, 2000) });
      continue;
    }
    const title = (m[3] || 'School Lesson').trim();
    const body = trimmed.slice(m[0].length);
    const items = [];
    const errors = [];
    const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
    let storyBuf = [];
    const flushStory = () => {
      if (storyBuf.length > 0) {
        items.push({ type: 'story', paragraphs: [...storyBuf] });
        storyBuf = [];
      }
    };
    lines.forEach((line, i) => {
      const tag = line.slice(0, line.indexOf(':') > 0 ? line.indexOf(':') : 0).toUpperCase();
      const rest = line.includes(':') ? line.slice(line.indexOf(':') + 1).trim() : line;
      if (tag === 'Q') {
        flushStory();
        const cells = rest.split('|').map((c) => c.trim());
        const ansIdx = parseInt(cells[cells.length - 1], 10);
        const options = cells.slice(1, -1);
        if (cells.length < 4 || Number.isNaN(ansIdx) || ansIdx < 0 || ansIdx >= options.length) {
          errors.push(`Line ${i + 1}: Q: needs "question | opt | opt | answer-index". Skipped.`);
        } else {
          items.push({ type: 'qa', q: cells[0], options, correct: ansIdx });
        }
      } else if (tag === 'F') {
        flushStory();
        const cells = rest.split('|').map((c) => c.trim());
        if (cells.length < 2) {
          errors.push(`Line ${i + 1}: F: needs "word | meaning | sentence?". Skipped.`);
        } else {
          items.push({ type: 'flashcard', word: cells[0], meaning: cells[1], sentence: cells[2] || '' });
        }
      } else if (tag === 'S') {
        storyBuf.push(rest);
      } else if (tag === 'MATH') {
        flushStory();
        const cells = rest.split('|').map((c) => c.trim());
        if (cells.length < 3) {
          errors.push(`Line ${i + 1}: MATH: needs "question | right-answer | wrong...". Skipped.`);
        } else {
          const answer = parseFloat(cells[1]);
          const options = cells.slice(1).map(Number);
          items.push({ type: 'math', q: cells[0], options, correct: 0, answer, topic: 'school' });
        }
      } else if (tag === 'FILL') {
        flushStory();
        const cells = rest.split('|').map((c) => c.trim());
        if (cells.length < 2 || !cells[0].includes('___')) {
          errors.push(`Line ${i + 1}: FILL: needs "sentence with ___ | answer". Skipped.`);
        } else {
          items.push({ type: 'fill', sentence: cells[0], answer: cells[1] });
        }
      } else {
        errors.push(`Line ${i + 1}: unknown tag "${tag || '(none)'}", expected Q:|F:|S:|MATH:|FILL:. Skipped.`);
      }
    });
    flushStory();
    if (items.length === 0) {
      review.push({ reason: `Lesson "${title}" had 0 valid items (${errors.length} bad lines) — not imported.`, text: trimmed.slice(0, 2000), errors });
      continue;
    }
    lessons.push({ id: `school-${grade}-${subject}-${Date.now()}-${lessons.length}`, grade, subject, title, items, errors });
  }
  return { lessons, review };
}

const CUSTOM_KEY = 'kidlingo-custom-v1';

export function loadCustom() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return { flashcards: [], stories: [], qa: [], math: [], fills: [], lessons: [] };
    return { flashcards: [], stories: [], qa: [], math: [], fills: [], lessons: [], ...JSON.parse(raw) };
  } catch (e) {
    return { flashcards: [], stories: [], qa: [], math: [], fills: [], lessons: [] };
  }
}

export function saveCustom(c) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(c));
  } catch (e) { /* ignore */ }
}

export function resetCustom() {
  const c = { flashcards: [], stories: [], qa: [], math: [], fills: [], lessons: [] };
  saveCustom(c);
  return c;
}
