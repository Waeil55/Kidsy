// School-lesson extractor. Text (typed, pasted, .txt/.csv/.md, .docx or .pdf) is cleaned, split into
// sections by explicit "Grade N" / subject headings, and parsed into typed items. Every section keeps
// its own grade + subject so content from different grades or subjects can never be mixed together.
// Nothing is saved until the person reviews and confirms it.
import { makeRng, buildOptions, uniq, normText, uid, words } from '../lib/rng.js';

// ---------------------------------------------------------------- reading files
const MOJIBAKE = [['â€™', '’'], ['â€˜', '‘'], ['â€œ', '“'], ['â€\u009d', '”'], ['â€“', '–'], ['â€”', '—'], ['â€¦', '…'], ['Ã©', 'é'], ['Ã¨', 'è'], ['Ã¡', 'á'], ['Ã±', 'ñ'], ['Â ', ' ']];
export function normalizeText(t) {
  let s = String(t || '').normalize('NFC');
  for (const [a, b] of MOJIBAKE) s = s.split(a).join(b);
  s = s.replace(/\u00ad/g, '').replace(/[\u200b-\u200d\ufeff]/g, '').replace(/ﬁ/g, 'fi').replace(/ﬂ/g, 'fl').replace(/ﬀ/g, 'ff').replace(/ﬃ/g, 'ffi').replace(/ﬄ/g, 'ffl');
  s = s.replace(/\r\n?/g, '\n').replace(/\t/g, ' \t ').replace(/[ \u00a0]{2,}/g, (m) => (m.includes('\t') ? m : ' '));
  s = s.replace(/([A-Za-z])-\n([a-z])/g, '$1$2'); // hyphenated line breaks
  s = s.split('\n').map((l) => l.replace(/\s+$/g, '')).filter((l) => !/^\s*(page\s*)?\d{1,3}\s*(of\s*\d+)?\s*$/i.test(l)).join('\n');
  return s.replace(/\n{3,}/g, '\n\n').trim();
}

async function inflateRaw(bytes) {
  const ds = new DecompressionStream('deflate-raw');
  const w = ds.writable.getWriter(); w.write(bytes); w.close();
  return new Uint8Array(await new Response(ds.readable).arrayBuffer());
}
async function docxText(buf) {
  const b = new Uint8Array(buf);
  const dv = new DataView(buf);
  let eocd = -1;
  for (let i = b.length - 22; i >= 0; i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('This does not look like a .docx file.');
  const n = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const dec = new TextDecoder();
  for (let i = 0; i < n; i++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
    const nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
    const name = dec.decode(b.subarray(p + 46, p + 46 + nl));
    if (name === 'word/document.xml') {
      const lnl = dv.getUint16(off + 26, true), lel = dv.getUint16(off + 28, true);
      const data = b.subarray(off + 30 + lnl + lel, off + 30 + lnl + lel + csize);
      const xml = dec.decode(method === 8 ? await inflateRaw(data) : data);
      return xml.replace(/<\/w:p>/g, '\n').replace(/<w:tab\/>/g, '\t').replace(/<w:br\/>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    }
    p += 46 + nl + el + cl;
  }
  throw new Error('Could not find text inside this .docx file.');
}

// pdf.js is bundled with the app; the worker is created from an embedded string so it also works offline.
async function pdfText(buf, onProgress) {
  const pdfjs = await import('pdfjs-dist/build/pdf.min.mjs');
  if (!pdfjs.GlobalWorkerOptions.workerSrc && typeof window !== 'undefined' && window.__KIDSY_PDF_WORKER__) {
    pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([window.__KIDSY_PDF_WORKER__], { type: 'text/javascript' }));
  }
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
  let out = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    let line = '', lastY = null;
    for (const it of tc.items) {
      const y = Math.round(it.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 2) { out += line.trimEnd() + '\n'; line = ''; }
      line += it.str + (it.hasEOL ? '\n' : '');
      if (it.hasEOL) { out += line; line = ''; }
      lastY = y;
    }
    out += line.trimEnd() + '\n\n';
    onProgress && onProgress(i, doc.numPages);
  }
  return out;
}

export async function fileToText(file, onProgress) {
  const name = (file.name || '').toLowerCase();
  if (/\.(png|jpe?g|gif|webp|bmp|heic)$/.test(name)) throw new Error('Photos cannot be read offline. Please type or paste the text instead, or upload a PDF, Word (.docx) or text file.');
  let text;
  if (name.endsWith('.pdf')) text = await pdfText(await file.arrayBuffer(), onProgress);
  else if (name.endsWith('.docx')) text = await docxText(await file.arrayBuffer());
  else if (name.endsWith('.json')) { const j = JSON.parse(await file.text()); text = JSON.stringify(j, null, 1); }
  else text = await file.text();
  if (name.endsWith('.csv')) text = text.split('\n').map((l) => (l.split(',').length >= 2 && !/[.?!]$/.test(l) ? l.split(',').map((c) => c.trim().replace(/^"|"$/g, '')).join(' | ') : l)).join('\n');
  const clean = normalizeText(text);
  if (clean.length < 10) throw new Error('No readable text was found in this file. If it is a scan, please type or paste the text instead.');
  return clean;
}

// ---------------------------------------------------------------- detection
const GRADE_WORDS = { kindergarten: 'KG', kg: 'KG', k: 'KG', '1': 'G1', '2': 'G2', '3': 'G3', '4': 'G4', '5': 'G5', '6': 'G6', first: 'G1', second: 'G2', third: 'G3', fourth: 'G4', fifth: 'G5', sixth: 'G6', '1st': 'G1', '2nd': 'G2', '3rd': 'G3', '4th': 'G4', '5th': 'G5', '6th': 'G6' };
const GRADE_RE = /\b(?:grade|gr\.?|year)\s*([1-6]|k|one|two|three|four|five|six)\b|\b(kindergarten|first|second|third|fourth|fifth|sixth|1st|2nd|3rd|4th|5th|6th)[\s-]+grade\b/i;
const NUMWORD = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6' };
function gradeFromLine(line) {
  const m = line.match(GRADE_RE);
  if (!m) return null;
  const w = (m[1] || m[2]).toLowerCase();
  return GRADE_WORDS[NUMWORD[w] || w] || null;
}
const SUBJ_RULES = [
  ['math', /\b(math|mathematics|arithmetic|algebra|geometry|fractions?|multiplication|division|addition|subtraction|equations?)\b/i],
  ['english', /\b(english|ela|language arts|reading|comprehension|passage|story|stories|vocabulary|word\s*bank|word\s*list|spelling|grammar|punctuation|nouns?|verbs?|adjectives?|pronouns?|capitalization|plurals?|synonyms?|antonyms?)\b/i],
  ['science', /\b(science|biology|physics|chemistry|plants?|animals?|planets?|weather|ecosystem|energy|habitat|photosynthesis)\b/i],
  ['social', /\b(social studies|history|geography|government|community|map|culture|economy)\b/i],
];
export function detectSubject(text) {
  const t = text.slice(0, 6000);
  const score = {};
  for (const [k, re] of SUBJ_RULES) { const m = t.match(new RegExp(re.source, 'gi')); score[k] = m ? m.length : 0; }
  const digits = (t.match(/\d+\s*[+\-−×x*÷/]\s*\d+/g) || []).length;
  score.math += digits * 2;
  score.english += (t.match(/^[A-Za-z' -]{2,24}\s*(\([a-z.]+\))?\s*[:–—-]\s+\S.{8,}/gm) || []).length * 0.5;
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const total = ranked.reduce((s, x) => s + x[1], 0);
  if (!ranked[0] || ranked[0][1] === 0) return { subject: 'other', conf: 0.2 };
  return { subject: ranked[0][0], conf: Math.min(0.95, 0.35 + (ranked[0][1] / (total + 1)) * 0.6) };
}
export function detectGrade(text) {
  const counts = {};
  for (const l of text.split('\n').slice(0, 400)) { const g = gradeFromLine(l); if (g) counts[g] = (counts[g] || 0) + 1; }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (ranked.length) return { grade: ranked[0][0], conf: Math.min(0.95, 0.6 + ranked[0][1] * 0.1), why: `The text mentions "${ranked[0][0]}"` };
  const ws = words(text);
  if (ws.length < 30) return { grade: null, conf: 0, why: 'Not enough text to guess the grade' };
  const sents = text.split(/[.!?]+\s/).filter(Boolean);
  const avgSent = ws.length / Math.max(1, sents.length);
  const avgLen = ws.join('').length / ws.length;
  const score = avgSent * 0.5 + avgLen * 2;
  const g = score < 8 ? 'KG' : score < 9.5 ? 'G1' : score < 11 ? 'G2' : score < 12.5 ? 'G3' : score < 14 ? 'G4' : score < 16 ? 'G5' : 'G6';
  return { grade: g, conf: 0.25, why: 'Guessed from sentence and word length (please check)' };
}

// ---------------------------------------------------------------- sections
const SUBJ_KEY = { math: 'math', mathematics: 'math', english: 'english', ela: 'english', 'language arts': 'english', reading: 'english', vocabulary: 'english', grammar: 'english', spelling: 'english', science: 'science', 'social studies': 'social', history: 'social', geography: 'social' };
const SUBJ_WORD = /\b(mathematics|math|english|ela|language arts|reading|vocabulary|grammar|spelling|science|social studies|history|geography)\b/i;
// A heading is a short line with no sentence punctuation that names a grade and/or a subject.
function parseHeading(line) {
  const t = line.trim();
  if (!t || t.length > 70 || words(t).length > 8 || /[.?!,;=]$/.test(t) || /_{2,}/.test(t) || /^\d+[.)]\s/.test(t) || /\d\s*[+\-−×x*÷/]\s*\d/.test(t)) return null;
  if (/^(word\s*bank|word\s*box|fill in|answer|note|example|directions?)\b/i.test(t)) return null;
  const g = gradeFromLine(t);
  const sm = t.match(SUBJ_WORD);
  if (!g && !sm) return null;
  if (!g && sm && (t.length > 30 || /[:]/.test(t) && t.split(':')[1].trim().length > 0)) return null;
  return { grade: g, subject: sm ? SUBJ_KEY[sm[1].toLowerCase()] : null };
}

export function splitSections(text) {
  const lines = text.split('\n');
  const secs = [];
  let cur = { grade: null, subject: null, title: '', lines: [] };
  const flush = () => { if (cur.lines.join('').trim().length > 0) secs.push(cur); };
  for (const line of lines) {
    const h = parseHeading(line);
    if (h) {
      const hasBody = cur.lines.join('').trim().length > 20;
      const changes = (h.grade && cur.grade && h.grade !== cur.grade) || (h.subject && cur.subject && h.subject !== cur.subject);
      if (hasBody && changes) { flush(); cur = { grade: cur.grade, subject: cur.subject, title: '', lines: [] }; }
      if (h.grade) cur.grade = h.grade;
      if (h.subject) cur.subject = h.subject;
      if (!cur.title || !cur.lines.join('').trim()) cur.title = line.trim();
      continue;
    }
    cur.lines.push(line);
  }
  flush();
  return secs.map((s, i) => {
    const body = s.lines.join('\n').trim();
    const dg = s.grade ? { grade: s.grade, conf: 0.95, why: 'Found in a heading' } : detectGrade(body);
    const ds = s.subject ? { subject: s.subject, conf: 0.95 } : detectSubject(body);
    return { id: `sec${i}`, title: s.title || `Section ${i + 1}`, text: body, grade: dg.grade, gradeConf: dg.conf, gradeWhy: dg.why, subject: ds.subject, subjectConf: ds.conf };
  });
}

// ---------------------------------------------------------------- tiny math evaluator (no eval)
function evalExpr(src) {
  const s = src.replace(/×|x(?=\s*\d)|\*/g, '*').replace(/÷|\//g, '/').replace(/−|–/g, '-').replace(/\s+/g, '');
  if (!/^[\d.+\-*/()]+$/.test(s)) return null;
  let i = 0;
  const num = () => { const m = s.slice(i).match(/^\d+(\.\d+)?/); if (!m) return NaN; i += m[0].length; return parseFloat(m[0]); };
  const factor = () => { if (s[i] === '(') { i++; const v = expr(); if (s[i] !== ')') return NaN; i++; return v; } if (s[i] === '-') { i++; return -factor(); } return num(); };
  const term = () => { let v = factor(); while (s[i] === '*' || s[i] === '/') { const o = s[i++]; const r = factor(); v = o === '*' ? v * r : v / r; } return v; };
  const expr = () => { let v = term(); while (s[i] === '+' || s[i] === '-') { const o = s[i++]; const r = term(); v = o === '+' ? v + r : v - r; } return v; };
  const v = expr();
  return i === s.length && Number.isFinite(v) ? Math.round(v * 1e6) / 1e6 : null;
}

// ---------------------------------------------------------------- parsing one section
const POS_MAP = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb', noun: 'noun', verb: 'verb', adjective: 'adjective', adverb: 'adverb' };

export function passageQuestions(text, n = 10) {
  const r = makeRng(text.slice(0, 80));
  const sents = text.split(/(?<=[.!?])\s+/).filter((x) => words(x).length >= 6 && words(x).length <= 26);
  const pool = uniq(words(text).map((w) => w.replace(/[^A-Za-z-]/g, '')).filter((w) => w.length >= 4 && w === w.toLowerCase()));
  const out = [];
  for (const s of r.shuffle(sents)) {
    if (out.length >= n) break;
    const toks = s.split(' ');
    const cand = toks.map((w, i) => ({ w: w.replace(/[^A-Za-z-]/g, ''), i })).filter((o) => o.w.length >= 5 && o.w === o.w.toLowerCase());
    if (!cand.length) continue;
    const pick = cand[r.int(0, cand.length - 1)];
    const wrong = r.sample(pool.filter((w) => w !== pick.w), 3);
    if (wrong.length < 3) continue;
    const { options, answer } = buildOptions(r, pick.w, wrong, 4);
    out.push({ q: toks.map((w, i) => (i === pick.i ? w.replace(pick.w, '_____') : w)).join(' '), options, answer });
  }
  return out;
}

export function parseSection(sec) {
  const { grade, subject } = sec;
  const lines = sec.text.split('\n');
  const items = { words: [], flashcards: [], qa: [], math: [], fill: [], stories: [] };
  const used = new Set();
  const mk = (kind, o, i) => ({ id: uid(kind[0]), kind, grade, subject, ...o, src: lines[i] ? lines[i].trim().slice(0, 140) : '' });

  // 1) numbered multiple-choice questions
  const qStart = /^\s*(\d{1,3})[.)]\s+(.{6,})$/;
  const optRe = /^\s*\(?([A-Da-d])[.)]\s+(.+)$/;
  const inlineOpts = /\s\(?([A-D])[.)]\s+/;
  const qs = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(qStart);
    if (!m) continue;
    let q = m[2], opts = [], ans = null, j = i + 1;
    if (inlineOpts.test(' ' + q) && /\bA[.)]\s.*\bB[.)]\s/.test(q)) {
      const parts = q.split(/\s*\(?\b([A-D])[.)]\s+/);
      q = parts[0].trim();
      for (let k = 1; k < parts.length; k += 2) opts.push(parts[k + 1].trim());
    }
    while (j < lines.length) {
      const om = lines[j].match(optRe);
      const am = lines[j].match(/^\s*(?:answer|ans|correct)\s*[:=]\s*\(?([A-Da-d])\)?/i);
      if (om) {
        const multi = lines[j].trim().split(/\s+(?=\(?[A-D][.)]\s)/).map((x) => x.replace(/^\(?[A-Da-d][.)]\s+/, '').trim()).filter(Boolean);
        if (multi.length >= 2 && /^\(?A[.)]/.test(lines[j].trim())) opts.push(...multi); else opts.push(om[2].trim());
        j++;
      } else if (am) { ans = am[1].toUpperCase().charCodeAt(0) - 65; j++; break; } else break;
    }
    if (opts.length >= 2) { qs.push({ n: +m[1], q: q.trim(), options: opts, answer: ans, line: i, end: j }); for (let k = i; k < j; k++) used.add(k); i = j - 1; }
  }
  const keyIdx = lines.findIndex((l) => /^\s*answer\s*key\b/i.test(l));
  if (keyIdx >= 0) {
    const map = {};
    lines.slice(keyIdx + 1).join(' ').replace(/(\d{1,3})\s*[.):\-–]?\s*([A-Da-d])\b/g, (_, n, l) => { map[+n] = l.toUpperCase().charCodeAt(0) - 65; return ''; });
    qs.forEach((q) => { if (q.answer == null && map[q.n] != null) q.answer = map[q.n]; });
    for (let k = keyIdx; k < lines.length; k++) used.add(k);
  }
  qs.forEach((q) => items.qa.push(mk('qa', { q: q.q, options: q.options, answer: q.answer != null ? q.answer : 0, needsAnswer: q.answer == null }, q.line)));

  // 2) rows / vocabulary "word - definition"
  const vocabRe = /^\s*(?:\d+[.)]\s*)?([A-Za-z][A-Za-z' -]{1,26}?)\s*(?:\(\s*(n|v|adj|adv|noun|verb|adjective|adverb)\.?\s*\))?\s*[:–—=-]\s+(.{6,})$/;
  lines.forEach((l, i) => {
    if (used.has(i)) return;
    const cells = l.split(/\s*\|\s*|\s*\t\s*/).map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 3 && /^[A-Za-z' -]{2,26}$/.test(cells[0]) && cells[0].split(' ').length <= 3) {
      const pos = POS_MAP[cells[1].toLowerCase().replace('.', '')];
      const off = pos ? 2 : 1;
      if (cells[off] && cells[off].length > 5) {
        items.words.push(mk('words', { w: cells[0].toLowerCase(), pos: pos || '', def: cells[off], syn: (cells[off + 1] || '').split(/,\s*/).filter(Boolean), ant: (cells[off + 2] || '').split(/,\s*/).filter(Boolean), ex: cells[off + 3] || '' }, i));
        used.add(i); return;
      }
    }
    const m = l.match(vocabRe);
    if (m && m[1].trim().split(' ').length <= 3 && !/\?$/.test(m[3]) && !/^(q|a|question|answer|answers|name|date|note|example|step|word bank|word box|fill in|challenge|solution|directions?|instructions?)$/i.test(m[1].trim()) && !/_{3,}/.test(m[3])) {
      const raw = { w: m[1].trim().toLowerCase(), pos: m[2] ? POS_MAP[m[2].toLowerCase()] : '', def: m[3].trim(), syn: [], ant: [], ex: '' };
      if (subject === 'english') items.words.push(mk('words', raw, i));
      else items.flashcards.push(mk('flashcards', { front: m[1].trim(), back: m[3].trim() }, i));
      used.add(i);
    }
  });

  // 3) Q: / A: pairs
  for (let i = 0; i < lines.length - 1; i++) {
    if (used.has(i)) continue;
    const q = lines[i].match(/^\s*(?:q|question)\s*\d*\s*[:.)]\s*(.+)$/i), a = lines[i + 1].match(/^\s*(?:a|ans|answer)\s*[:.)]\s*(.+)$/i);
    if (q && a) { items.qa.push(mk('qa', { q: q[1].trim(), answer: a[1].trim(), accept: [a[1].trim()] }, i)); used.add(i); used.add(i + 1); }
  }

  // 4) math lines
  lines.forEach((l, i) => {
    if (used.has(i)) return;
    const t = l.replace(/^\s*\(?\d{1,3}[.)]\s*/, '').trim();
    const m = t.match(/^([\d\s.+\-−–×x*÷/()]+?)\s*=\s*(_+|\?|□|▢|\[\s*\]|[\d.]+)?\s*$/i);
    if (m && /\d/.test(m[1]) && /[+\-−–×x*÷/]/.test(m[1])) {
      const v = evalExpr(m[1]);
      if (v != null) { items.math.push(mk('math', { q: `${m[1].trim()} = ?`, answer: String(v), accept: [String(v)] }, i)); used.add(i); }
    } else if ((subject === 'math') && /\d/.test(t) && /\?$/.test(t) && words(t).length >= 6) {
      items.math.push(mk('math', { q: t, answer: '', accept: [], needsAnswer: true }, i)); used.add(i);
    }
  });

  // 5) fill in the blank
  const bank = (lines.find((l) => /^\s*word\s*(bank|box)\s*[:]/i.test(l)) || '').replace(/^.*[:]/, '').split(/[,;|]/).map((x) => x.trim()).filter(Boolean);
  lines.forEach((l, i) => {
    if (used.has(i)) return;
    const t = l.replace(/^\s*\(?\d{1,3}[.)]\s*/, '').replace(/^(fill in|complete|fill in the blank)\s*[:\-]\s*/i, '').trim();
    if (/_{3,}|\[\s*\]/.test(t) && words(t).length >= 4) {
      const am = t.match(/\(([^()]{1,30})\)\s*[.!?]?$/);
      const sentence = t.replace(/_{3,}|\[\s*\]/, '_____').replace(/\s*\(([^()]{1,30})\)\s*([.!?]?)$/, '$2');
      items.fill.push(mk('fill', { sentence, answer: am && !/^\d/.test(am[1]) ? am[1] : '', options: bank.length >= 3 ? bank : undefined, needsAnswer: !am }, i));
      used.add(i);
    }
  });

  // 6) reading passages: blocks of consecutive unparsed lines with 35+ words
  const blocks = [];
  let curB = [];
  lines.forEach((l, i) => { if (!used.has(i) && l.trim()) curB.push(l.trim()); else { if (curB.length) blocks.push(curB); curB = []; } });
  if (curB.length) blocks.push(curB);
  blocks.forEach((bl) => {
    let title = '';
    let body = bl;
    if (bl.length > 1 && bl[0].length < 60 && !/[.!?:]$/.test(bl[0])) { title = bl[0]; body = bl.slice(1); }
    const text = body.join(' ').replace(/\s+/g, ' ').trim();
    const nsent = (text.match(/[.!?](\s|$)/g) || []).length;
    if (words(text).length >= 35 && nsent >= 2 && !/_{3,}/.test(text)) {
      items.stories.push({ id: uid('s'), kind: 'stories', grade, subject, title: title || `Passage ${items.stories.length + 1}`, text, questions: passageQuestions(text), src: text.slice(0, 100) });
    }
  });

  // 7) leftover "term: definition" style → flashcards for non-English subjects handled above; for English extras nothing.
  const total = Object.values(items).reduce((n, a) => n + a.length, 0);
  const warnings = [];
  if (!total) warnings.push('Nothing could be recognised in this section. Try adding it in the Studio instead, or format lines like "word - meaning", "1. Question? A) ... B) ...", or "12 + 5 = ".');
  if (items.qa.some((x) => x.needsAnswer)) warnings.push('Some questions have no answer marked. Please choose the right answer before saving.');
  if (items.math.some((x) => x.needsAnswer) || items.fill.some((x) => x.needsAnswer)) warnings.push('Some items need an answer typed in before saving.');
  if (!grade) warnings.push('Choose a grade for this section.');
  return { items, total, warnings };
}

export const KIND_LABEL = { words: 'Vocabulary words', flashcards: 'Flashcards', qa: 'Questions', math: 'Math problems', fill: 'Fill-in-the-blank', stories: 'Reading passages' };
