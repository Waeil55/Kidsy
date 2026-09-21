// Deterministic random helpers. Every story / math question / exam is generated from a
// seed string, so the same story number always produces the same story after a refresh.

export function hashStr(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed) {
  const f = mulberry32(typeof seed === 'number' ? seed : hashStr(String(seed)));
  const r = {
    next: f,
    int: (a, b) => a + Math.floor(f() * (b - a + 1)),          // inclusive
    pick: (arr) => arr[Math.floor(f() * arr.length)],
    chance: (p) => f() < p,
    shuffle: (arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(f() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    sample: (arr, n) => r.shuffle(arr).slice(0, n),
  };
  return r;
}

export const uid = (p = 'x') => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ---------- text helpers ----------
export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
export const isVowelStart = (s) => /^[aeiou]/i.test(s) && !/^(uni|use|usu|one|eu)/i.test(s);
export const withA = (s) => (isVowelStart(s) ? 'an ' : 'a ') + s;
export const uniq = (arr) => [...new Set(arr)];
export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export const pad = (n, w = 3) => String(n).padStart(w, '0');

export function normText(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^a-z0-9\s'.\-:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const words = (s) => String(s || '').split(/\s+/).filter(Boolean);
export const wordCount = (s) => words(s).length;

// Build 4 (or n) unique options with the correct one at a random position.
export function buildOptions(rng, correct, wrongPool, n = 4) {
  const seen = new Set([String(correct).toLowerCase()]);
  const wrong = [];
  for (const w of rng.shuffle(wrongPool)) {
    const k = String(w).toLowerCase();
    if (!seen.has(k)) { seen.add(k); wrong.push(w); }
    if (wrong.length === n - 1) break;
  }
  const options = rng.shuffle([correct, ...wrong]);
  return { options, answer: options.indexOf(correct) };
}
