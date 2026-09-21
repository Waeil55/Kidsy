// Text-to-speech (read to me), speech recognition (say your answer / read it aloud) and the
// pure matching helpers that turn what a child says into an answer choice or reading progress.
import { normText } from './rng.js';

const W = typeof window !== 'undefined' ? window : {};
export const ttsSupported = () => !!W.speechSynthesis;
export const micSupported = () => !!(W.SpeechRecognition || W.webkitSpeechRecognition);

let voiceCache = null;
function pickVoice(lang = 'en') {
  if (!W.speechSynthesis) return null;
  const vs = W.speechSynthesis.getVoices() || [];
  if (!vs.length) return null;
  if (voiceCache && vs.includes(voiceCache)) return voiceCache;
  const en = vs.filter((v) => v.lang && v.lang.toLowerCase().startsWith(lang));
  voiceCache = en.find((v) => /female|samantha|google us|zira|aria|jenny|natural/i.test(v.name)) || en.find((v) => v.default) || en[0] || vs[0];
  return voiceCache;
}

// speak(text, { rate, onBoundary(charIndex), onEnd }) -> stop()
export function speak(text, o = {}) {
  if (!ttsSupported() || !text) { o.onEnd && o.onEnd(); return () => {}; }
  W.speechSynthesis.cancel();
  const u = new W.SpeechSynthesisUtterance(String(text).replace(/_{2,}/g, 'blank'));
  u.rate = o.rate || 0.9;
  u.pitch = 1.05;
  const v = pickVoice();
  if (v) u.voice = v;
  u.onboundary = (e) => { if (e.name === 'word' || e.charIndex >= 0) o.onBoundary && o.onBoundary(e.charIndex); };
  u.onend = () => o.onEnd && o.onEnd();
  u.onerror = () => o.onEnd && o.onEnd();
  W.speechSynthesis.speak(u);
  return () => { try { W.speechSynthesis.cancel(); } catch (e) { /* ignore */ } };
}
export const stopSpeaking = () => { try { W.speechSynthesis && W.speechSynthesis.cancel(); } catch (e) { /* ignore */ } };

// ---- listening ---------------------------------------------------------------------------
// listen({ lang, continuous, onText(final, interim), onEnd(err) }) -> { stop }
export function listen(o = {}) {
  const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
  if (!SR) { o.onEnd && o.onEnd('unsupported'); return { stop() {} }; }
  const rec = new SR();
  rec.lang = o.lang || 'en-US';
  rec.continuous = !!o.continuous;
  rec.interimResults = true;
  rec.maxAlternatives = 3;
  let finalText = '';
  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      const alts = Array.from(r).map((a) => a.transcript);
      if (r.isFinal) finalText += ' ' + alts[0];
      else interim += alts[0];
      o.onAlternatives && r.isFinal && o.onAlternatives(alts);
    }
    o.onText && o.onText(finalText.trim(), interim.trim());
  };
  rec.onerror = (e) => o.onEnd && o.onEnd(e.error || 'error');
  rec.onend = () => o.onEnd && o.onEnd(null, finalText.trim());
  try { rec.start(); } catch (e) { o.onEnd && o.onEnd('start-failed'); }
  return { stop() { try { rec.stop(); } catch (e) { /* ignore */ } } };
}

// ---- matching ------------------------------------------------------------------------------
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const SPOKEN_FIX = { plus: '+', minus: '-', times: '×', over: '/', point: '.' };

// "twenty five" -> "25", "one hundred and two" -> "102"
export function wordsToNumbers(text) {
  const toks = normText(text).split(' ');
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    let t = toks[i];
    if (ONES.includes(t) || TENS[t] || t === 'hundred') {
      let total = 0, cur = 0, used = false;
      while (i < toks.length) {
        t = toks[i];
        if (ONES.includes(t)) { cur += ONES.indexOf(t); used = true; }
        else if (TENS[t]) { cur += TENS[t]; used = true; }
        else if (t === 'hundred') { cur = (cur || 1) * 100; used = true; }
        else if (t === 'thousand') { total += (cur || 1) * 1000; cur = 0; used = true; }
        else if (t === 'and' && used && (ONES.includes(toks[i + 1]) || TENS[toks[i + 1]])) { /* skip */ }
        else break;
        i++;
      }
      i--;
      out.push(String(total + cur));
    } else out.push(SPOKEN_FIX[t] || t);
  }
  return out.join(' ');
}

const LETTER_WORDS = { a: 0, ay: 0, eh: 0, b: 1, be: 1, bee: 1, c: 2, see: 2, sea: 2, d: 3, dee: 3 };
const ORD = { first: 0, second: 1, third: 2, fourth: 3, one: 0, two: 1, three: 2, four: 3 };

function sim(a, b) {
  a = normText(a); b = normText(b);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const A = new Set(a.split(' ')), B = new Set(b.split(' '));
  let inter = 0; A.forEach((w) => { if (B.has(w)) inter++; });
  const jac = inter / (A.size + B.size - inter);
  const lev = 1 - levenshtein(a, b) / Math.max(a.length, b.length);
  return Math.max(jac, lev * 0.9);
}
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

// which option did the child say? returns index or -1
export function matchOption(transcripts, options) {
  const list = [].concat(transcripts).filter(Boolean);
  let best = -1, bestScore = 0;
  for (const raw of list) {
    const t = normText(raw).replace(/^(option|choice|letter|answer|the answer is|it is|its|number) /, '');
    // "a", "b", "option c"
    if (options.length <= 6 && LETTER_WORDS[t] !== undefined && LETTER_WORDS[t] < options.length) return LETTER_WORDS[t];
    if (ORD[t] !== undefined && /first|second|third|fourth/.test(t) && ORD[t] < options.length) return ORD[t];
    const tn = wordsToNumbers(raw);
    options.forEach((op, i) => {
      const s = Math.max(sim(t, op), sim(tn, wordsToNumbers(op)), normText(op) && t.includes(normText(op)) && normText(op).length > 1 ? 0.95 : 0);
      if (s > bestScore) { bestScore = s; best = i; }
    });
  }
  return bestScore >= 0.6 ? best : -1;
}

export function matchTyped(transcripts, accept) {
  const list = [].concat(transcripts).filter(Boolean);
  for (const raw of list) {
    for (const a of accept) if (sim(raw, a) >= 0.8 || sim(wordsToNumbers(raw), wordsToNumbers(a)) >= 0.9) return raw;
  }
  return list[0] || '';
}

// ---- read-aloud tracking ------------------------------------------------------------------
export const tokenize = (text) => String(text).split(/\s+/).filter(Boolean).map((raw) => ({ raw, norm: normText(raw).replace(/[^a-z0-9']/g, '') }));

// Move forward through the story words as the child reads. `pos` = number of words confirmed so far.
// Tolerates skipped/misheard words by looking ahead a few words. Returns { pos, hits, skipped }.
export function alignRead(tokens, spoken, pos = 0, hits = [], lookahead = 3) {
  const said = normText(spoken).split(' ').filter(Boolean);
  const h = hits.slice();
  let p = pos;
  let cursor = 0;
  for (const w of said) {
    let found = -1;
    for (let k = 0; k <= lookahead && p + k < tokens.length; k++) {
      const t = tokens[p + k].norm;
      if (t === w || (t.length > 3 && w.length > 3 && levenshtein(t, w) <= 1)) { found = p + k; break; }
    }
    if (found >= 0) {
      for (let j = p; j < found; j++) h[j] = 'skip';
      h[found] = 'ok';
      p = found + 1;
    }
    cursor++;
  }
  return { pos: p, hits: h, spokenWords: said.length };
}
export function readingScore(hits, total) {
  const ok = hits.filter((x) => x === 'ok').length;
  return { ok, total, pct: total ? Math.round((ok / total) * 100) : 0 };
}
