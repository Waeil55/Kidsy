// Text-to-speech (read to me), speech recognition (say your answer / read it aloud) and the
// pure matching helpers that turn what a child says into an answer choice or reading progress.
import { normText } from './rng.js';

const W = typeof window !== 'undefined' ? window : {};
export const ttsSupported = () => !!W.speechSynthesis || typeof Audio !== 'undefined';
export const micSupported = () => !!(W.SpeechRecognition || W.webkitSpeechRecognition);

// ---- voices ---------------------------------------------------------------------------------
// Free AI voices, no login and no key. Best first:
//   1. online AI voices (a natural "story teller" voice, with Google's voice as backup),
//   2. a natural neural voice already on the device (Edge "Natural", Apple "Enhanced/Siri"),
//   3. any plain device voice.
export const ONLINE_VOICES = [
  ['auto', 'Auto (best AI voice)'],
  ['tt:en_us_002', 'Jessie: warm and friendly'],
  ['tt:en_female_emotional', 'Grace: gentle storyteller'],
  ['tt:en_us_006', 'Joey: cheerful boy'],
  ['tt:en_male_narration', 'Story teller: deep narrator'],
  ['tt:en_uk_001', 'Oliver: British narrator'],
  ['tt:en_au_001', 'Matilda: Australian'],
  ['google', 'Clear voice (Google)'],
];
const cfg = { mode: 'auto', accent: 'en', online: 'auto' };
export const setVoiceConfig = (c = {}) => { cfg.mode = c.voiceMode || 'auto'; cfg.accent = c.accent || 'en'; cfg.online = c.onlineVoice || 'auto'; };
const NATURAL = /natural|neural|online|premium|enhanced|siri|jenny|aria|ava|emma/i;

let voiceCache = null;
function pickVoice(natural = false) {
  if (!W.speechSynthesis) return null;
  const vs = W.speechSynthesis.getVoices() || [];
  if (!vs.length) return null;
  const en = vs.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
  const nat = en.filter((v) => NATURAL.test(v.name));
  if (natural) return nat.find((v) => /natural|neural|online/i.test(v.name)) || nat[0] || null;
  if (voiceCache && vs.includes(voiceCache)) return voiceCache;
  voiceCache = nat[0] || en.find((v) => /female|zira|google us/i.test(v.name)) || en.find((v) => v.default) || en[0] || vs[0];
  return voiceCache;
}
const online = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false);

// split into short sentences the free voice services accept (about 170 characters)
function chunks(text) {
  const out = [];
  let pos = 0;
  const parts = text.match(/[^.!?\n]+[.!?]*\s*/g) || [text];
  let cur = '';
  let curStart = 0;
  const flush = () => { if (cur.trim()) out.push({ t: cur, at: curStart }); cur = ''; };
  for (const part of parts) {
    if (cur && (cur + part).length > 170) flush();
    if (!cur) curStart = pos;
    if (part.length > 170) {
      for (let i = 0; i < part.length; i += 160) { cur = part.slice(i, i + 160); curStart = pos + i; flush(); }
    } else cur += part;
    pos += part.length;
  }
  flush();
  return out;
}
const clean = (t) => t.replace(/_{2,}/g, ' blank ').replace(/\s+/g, ' ').trim();

// one playable, fully loaded clip from one provider; rejects when the provider fails
const b64ToUrl = (b64) => { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return URL.createObjectURL(new Blob([u], { type: 'audio/mpeg' })); };
const ready = (a) => new Promise((res, rej) => {
  const t = setTimeout(() => rej(new Error('timeout')), 9000);
  a.oncanplay = () => { clearTimeout(t); res(a); };
  a.onerror = () => { clearTimeout(t); rej(new Error('audio')); };
  a.load();
});
const clipCache = new Map();
function getClip(id, text) {
  const key = `${id}|${cfg.accent}|${text}`;
  if (clipCache.has(key)) return clipCache.get(key).then((u) => ready(new Audio(u)));
  const p = (async () => {
    if (id === 'google') return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(cfg.accent)}&q=${encodeURIComponent(clean(text))}`;
    const r = await fetch('https://ottsy.weilbyte.dev/api/generation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: clean(text), voice: id.slice(3) }), referrerPolicy: 'no-referrer' });
    const j = await r.json();
    if (!j || !j.success || !j.data) throw new Error('tts');
    return b64ToUrl(j.data);
  })();
  clipCache.set(key, p);
  if (clipCache.size > 80) clipCache.delete(clipCache.keys().next().value);
  p.catch(() => clipCache.delete(key));
  return p.then((u) => ready(new Audio(u)));
}
const chain = () => {
  const first = cfg.online === 'auto' ? 'tt:en_us_002' : cfg.online;
  return [...new Set([first, 'google', 'tt:en_us_002'])];
};
async function clipFor(text) {
  for (const id of chain()) { try { return await getClip(id, text); } catch (e) { /* try the next voice */ } }
  throw new Error('no online voice');
}

let token = 0;
let current = null; // the audio element that is playing

function speakDevice(text, o, natural) {
  if (!W.speechSynthesis) { o.onEnd && o.onEnd(); return () => {}; }
  W.speechSynthesis.cancel();
  const u = new W.SpeechSynthesisUtterance(String(text).replace(/_{2,}/g, 'blank'));
  u.rate = o.rate || 0.9;
  u.pitch = 1.03;
  const v = pickVoice(natural);
  if (v) { u.voice = v; u.lang = v.lang; }
  u.onboundary = (e) => { if (e.name === 'word' || e.charIndex >= 0) o.onBoundary && o.onBoundary(e.charIndex); };
  u.onend = () => o.onEnd && o.onEnd();
  u.onerror = () => o.onEnd && o.onEnd();
  W.speechSynthesis.speak(u);
  return () => { try { W.speechSynthesis.cancel(); } catch (e) { /* ignore */ } };
}

function speakOnline(text, o) {
  const my = ++token;
  const full = String(text);
  const list = chunks(full);
  if (!list.length) { o.onEnd && o.onEnd(); return () => {}; }
  const rate = Math.min(1.5, Math.max(0.6, o.rate || 0.9));
  let failed = false;
  const fallback = (i) => {
    if (failed || my !== token) return;
    failed = true;
    const from = list[i] ? list[i].at : 0;
    speakDevice(full.slice(from), { ...o, onBoundary: (ci) => o.onBoundary && o.onBoundary(ci + from) }, true);
  };
  const clips = [];
  const fetchClip = (i) => { if (i < list.length && !clips[i]) { clips[i] = clipFor(list[i].t); clips[i].catch(() => {}); } };
  fetchClip(0); fetchClip(1);
  const play = async (i) => {
    if (my !== token) return;
    if (i >= list.length) { current = null; o.onEnd && o.onEnd(); return; }
    let a;
    try { a = await clips[i]; } catch (e) { fallback(i); return; }
    if (my !== token) return;
    fetchClip(i + 1); fetchClip(i + 2);
    current = a;
    a.playbackRate = rate;
    let lastWord = -1;
    a.ontimeupdate = () => {
      if (!o.onBoundary || !a.duration) return;
      const c = list[i];
      const abs = c.at + Math.floor((a.currentTime / a.duration) * c.t.length);
      if (abs !== lastWord) { lastWord = abs; o.onBoundary(abs); }
    };
    a.onended = () => play(i + 1);
    a.onerror = () => fallback(i);
    try { await a.play(); } catch (e) { fallback(i); }
  };
  play(0);
  return () => { if (my === token) token++; try { current && current.pause(); } catch (e) { /* ignore */ } };
}

// speak(text, { rate, onBoundary(charIndex), onEnd }) -> stop()
export function speak(text, o = {}) {
  text = String(text || '').replace(/<[^>]*>/g, '');
  if (!text.trim()) { o.onEnd && o.onEnd(); return () => {}; }
  stopSpeaking();
  if (cfg.mode === 'device') return speakDevice(text, o, false);
  if (typeof Audio !== 'undefined' && online()) return speakOnline(text, o);
  return speakDevice(text, o, true);
}
export const stopSpeaking = () => {
  token++;
  try { if (current) current.pause(); current = null; } catch (e) { /* ignore */ }
  try { W.speechSynthesis && W.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
};

// short cheerful human voice lines for right and wrong answers (online voice only, never a robot)
const CHEER = ['Great job!', 'You got it!', 'Awesome!', 'Fantastic!', 'Well done!', 'Super!', 'Yes, that is right!', 'Brilliant!'];
const TRY = ['Nice try!', 'Almost! Try the next one.', 'Good try, keep going!', 'Not quite, you can do it!'];
export function sayPraise(ok) {
  if (typeof Audio === 'undefined' || !online() || cfg.mode === 'device') return;
  const list = ok ? CHEER : TRY;
  clipFor(list[Math.floor(Math.random() * list.length)]).then((a) => { a.volume = 0.9; return a.play(); }).catch(() => {});
}

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
