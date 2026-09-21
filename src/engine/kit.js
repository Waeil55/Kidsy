import { makeRng, cap, withA, uniq } from '../lib/rng.js';
import { NAMES, ITEMS, PLACES, HELPERS, EMO_POS, EMO_NEG } from './pools.js';
import { GRADES } from '../data/grades.js';

export const tierOf = (g) => (g <= 1 ? 0 : g <= 3 ? 1 : 2);

const SMALL = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'and', 'to', 'for', 'at', 'by', 'with']);
export const titleCase = (s) =>
  String(s).split(' ').map((w, i) => (i > 0 && SMALL.has(w) ? w : cap(w))).join(' ');

const PRON = {
  f: { he: 'she', He: 'She', him: 'her', his: 'her', His: 'Her' },
  m: { he: 'he', He: 'He', him: 'him', his: 'his', His: 'His' },
};

// Beat helper: returns null when the beat is above this grade.
export const B = (c, minG, para, text, x = {}) =>
  c.g < minG ? null : { para, text: Array.isArray(text) ? c.v(...text) : text, ...x };

export function makeCtx(gradeKey, g, n, plot, k) {
  const lv = GRADES[g].lv;
  const tier = tierOf(g);
  const rng = makeRng(`${gradeKey}|story|${n}`);
  const pr = makeRng(`${gradeKey}|${plot.id}|pool`);
  const F = pr.shuffle(NAMES[tier].f).map((nm) => ({ n: nm, s: 'f' }));
  const M = pr.shuffle(NAMES[tier].m).map((nm) => ({ n: nm, s: 'm' }));
  const roster = [];
  for (let i = 0; i < Math.max(F.length, M.length); i++) { if (F[i]) roster.push(F[i]); if (M[i]) roster.push(M[i]); }
  const H = roster.length;
  const heroO = roster[k % H];
  const palO = roster[(k + 7 + Math.floor(k / H) * 3) % H];
  const items = pr.shuffle(ITEMS[tier]);
  const itemO = items[(Math.floor(k / H) + (k % H) * 7) % items.length];
  const places = rng.sample(PLACES[tier], 3);
  const adult = HELPERS[tier][(k * 3 + Math.floor(k / H)) % HELPERS[tier].length];
  const emoEnd = rng.pick(EMO_POS[lv]);
  const emoMid = rng.pick(EMO_NEG[lv]);
  const hp = PRON[heroO.s], pp = PRON[palO.s];
  const it = `${itemO.adj} ${itemO.n}`;

  const c = {
    g, lv, tier, k, n, rng, grade: gradeKey, cap, titleCase, withA,
    hero: heroO.n, heroS: heroO.s, he: hp.he, He: hp.He, him: hp.him, his: hp.his, His: hp.His,
    pal: palO.n, palS: palO.s, phe: pp.he, pHe: pp.He, phim: pp.him, phis: pp.his,
    adult, item: itemO, it, itn: itemO.n, aIt: withA(it), Itn: titleCase(itemO.n), ITn: titleCase(it),
    p1: places[0], p2: places[1], p3: places[2],
    emoEnd: emoEnd[0], emoEndM: emoEnd[1], emoMid: emoMid[0], emoMidM: emoMid[1],
    // pick a variant by language level; missing entries fall back to the level below
    v: (...a) => {
      for (let i = Math.min(lv, a.length - 1); i >= 0; i--) if (a[i] !== undefined && a[i] !== null) return a[i];
      return a[a.length - 1];
    },
    // deterministic scenario pick so consecutive stories cycle through every scenario
    sc: (list, salt = 0) => list[(k * 5 + salt + Math.floor(k / list.length)) % list.length],
    scAt: (list, salt = 0) => (k * 5 + salt + Math.floor(k / list.length)) % list.length,
    pick: (arr) => rng.pick(arr),
    roster: roster.map((r) => r.n),
  };

  // distractor pools -------------------------------------------------------
  c.pool = (key, exclude = []) => {
    const ex = new Set([].concat(exclude).map((x) => String(x).toLowerCase()));
    let arr = [];
    if (key === 'names') arr = roster.map((r) => r.n).filter((x) => x !== c.hero);
    else if (key === 'places') arr = PLACES[tier].map(cap);
    else if (key === 'items') arr = ITEMS[tier].filter((x) => x.n !== c.itn).map((x) => cap(withA(`${x.adj} ${x.n}`)));
    else if (key === 'itemNouns') arr = ITEMS[tier].filter((x) => x.n !== c.itn).map((x) => x.n);
    else if (key === 'emos') arr = uniq([...EMO_POS[lv], ...EMO_NEG[lv], ...(EMO_POS[Math.max(0, lv - 1)] || []), ...(EMO_NEG[Math.max(0, lv - 1)] || [])].map((e) => e[0]));
    else if (key === 'adults') arr = HELPERS[tier].filter((x) => x !== c.adult);
    return arr.filter((x) => !ex.has(String(x).toLowerCase()));
  };
  return c;
}

export const sentencesOf = (text) =>
  String(text).replace(/\s+/g, ' ').split(/(?<=[.!?]["”]?)\s+(?=["“]?[A-Z])/).map((s) => s.trim()).filter(Boolean);
