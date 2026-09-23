// Global app state. Everything is saved in localStorage and only ever reset by the child/parent
// pressing a reset button. Scoring: correct = +1, wrong = -1, and the score never goes below 0.
import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';

export const STORAGE_KEY = 'kidsy_state_v1';
const OLD_KEYS = ['kidsy_saved_state_v5'];
// ---- family profiles ------------------------------------------------------------------------
// Each child gets their own save (score, progress, stickers, custom content) in its own
// localStorage slot. A small registry (name/avatar/grade only) lists every profile so the
// switcher can show them without loading each child's full save. The very first profile keeps
// the original storage key, so nobody's existing progress moves or is lost.
const PROFILES_KEY = 'kidsy_profiles_v1';
const keyFor = (id) => (!id || id === 'p1' ? STORAGE_KEY : `${STORAGE_KEY}__${id}`);
const newProfileId = () => 'p' + Math.random().toString(36).slice(2, 9);

export const THEMES = [
  { key: 'sky', label: 'Sky', a: '#2f9bec', b: '#5bd5c8', c: '#2389d7' },
  { key: 'coral', label: 'Coral', a: '#f2646f', b: '#ffb14e', c: '#ec5e99' },
  { key: 'mint', label: 'Mint', a: '#22b36b', b: '#a8d95b', c: '#21b9b0' },
  { key: 'sunny', label: 'Sunny', a: '#f28b24', b: '#ffd34e', c: '#e85f5b' },
  { key: 'berry', label: 'Berry', a: '#d94f9a', b: '#f48a96', c: '#a94d9e' },
  { key: 'night', label: 'Night', a: '#5b6be8', b: '#2aa9b9', c: '#355c9a' },
];
export const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🐙', '🦄', '🐯', '🐨', '🐧', '🦉', '🐢', '🐬'];

export const emptyCustom = () => ({ packs: [], flashcards: [], stories: [], qa: [], math: [], fill: [], words: [] });

export const defaultState = (id = 'p1', name = 'Explorer', avatar = '🦊', gradeKey = 'G3') => ({
  v: 1,
  profile: { id, name, avatar, gradeKey },
  gradeKey,
  theme: 'sky',
  settings: { autoRead: false, rate: 0.9, sounds: true, openLevels: false, micLang: 'en-US', bigText: false },
  score: 0,
  best: 0,
  stats: { correct: 0, wrong: 0, bySubject: {}, byGrade: {}, streak: 0, bestStreak: 0 },
  daily: { date: '', correct: 0, wrong: 0 },
  mystery: { last: '' },
  progress: {},
  exams: [],
  stickers: [],
  custom: emptyCustom(),
  createdAt: Date.now(),
});

const today = () => new Date().toISOString().slice(0, 10);

function loadRawState(id) {
  try {
    const raw = localStorage.getItem(keyFor(id));
    if (raw) {
      const s = JSON.parse(raw);
      const d = defaultState(id);
      const profile = { ...d.profile, ...(s.profile || {}), id };
      const gradeKey = profile.gradeKey || s.gradeKey || d.gradeKey;
      return { ...d, ...s, gradeKey, settings: { ...d.settings, ...(s.settings || {}) }, profile: { ...profile, gradeKey }, stats: { ...d.stats, ...(s.stats || {}) }, custom: { ...emptyCustom(), ...(s.custom || {}) } };
    }
  } catch (e) { /* fall through to defaults */ }
  return defaultState(id);
}
function saveRawState(id, s) { try { const { newStickers, ...persist } = s; localStorage.setItem(keyFor(id), JSON.stringify(persist)); } catch (e) { /* storage full or blocked */ } }

function loadRegistry() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) { const r = JSON.parse(raw); if (r && r.list && r.list.length) return r; }
  } catch (e) { /* fall through */ }
  // First run, or upgrading from before multi-profile support: build the registry from
  // whatever single save already exists (or a fresh default), as profile "p1".
  const s = loadRawState('p1');
  const reg = { activeId: 'p1', list: [{ id: 'p1', name: s.profile.name, avatar: s.profile.avatar, gradeKey: s.profile.gradeKey }] };
  saveRegistry(reg);
  return reg;
}
function saveRegistry(reg) { try { localStorage.setItem(PROFILES_KEY, JSON.stringify(reg)); } catch (e) { /* ignore */ } }
export const listProfiles = () => loadRegistry().list;
export const activeProfileId = () => loadRegistry().activeId;

export function loadState() {
  const reg = loadRegistry();
  return loadRawState(reg.activeId);
}

// ---- progress helpers ----------------------------------------------------------------------
const gp = (s, g) => s.progress[g] || { stories: {}, math: {}, fill: {}, words: {}, grammar: {} };
export const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);
export const starsFor = (p) => (p >= 90 ? 3 : p >= 70 ? 2 : p >= 50 ? 1 : 0);

export function storyRec(s, g, n) { return (s.progress[g] && s.progress[g].stories[n]) || null; }
export function levelStats(s, g, level) {
  const p = gp(s, g);
  const from = (level - 1) * 10 + 1;
  let stories = 0, storyBest = 0;
  for (let i = 0; i < 10; i++) { const r = p.stories[from + i]; if (r && r.done) { stories++; storyBest += r.best; } }
  const m = p.math[level], f = p.fill[level];
  const avgStory = stories ? storyBest / stories : 0;
  const parts = [];
  if (stories) parts.push(avgStory);
  if (m) parts.push(m.best);
  if (f) parts.push(f.best);
  const avg = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
  const started = stories > 0 || !!m || !!f;
  const cleared = stories >= 3 || (stories >= 1 && (m && m.best >= 60)) || (m && m.best >= 60 && f && f.best >= 60);
  return { stories, math: m ? m.best : null, fill: f ? f.best : null, avg: Math.round(avg), stars: started ? starsFor(avg) : 0, started, cleared: !!cleared };
}
export function levelUnlocked(s, g, level) {
  if (level <= 1 || s.settings.openLevels) return true;
  return levelStats(s, g, level - 1).cleared;
}
export function gradeSummary(s, g) {
  let stars = 0, cleared = 0, storiesDone = 0;
  for (let l = 1; l <= 50; l++) { const ls = levelStats(s, g, l); stars += ls.stars; if (ls.cleared) cleared++; storiesDone += ls.stories; }
  return { stars, cleared, storiesDone, maxStars: 150 };
}
export function currentLevel(s, g) {
  for (let l = 1; l <= 50; l++) if (!levelStats(s, g, l).cleared) return l;
  return 50;
}

// ---- stickers -------------------------------------------------------------------------------
export const STICKERS = [
  { id: 'first', e: '🌱', name: 'First Step', hint: 'Answer your first question', test: (s) => s.stats.correct + s.stats.wrong >= 1 },
  { id: 's10', e: '⭐', name: 'Ten Points', hint: 'Reach 10 points', test: (s) => s.best >= 10 },
  { id: 's25', e: '🌟', name: 'Twenty-Five', hint: 'Reach 25 points', test: (s) => s.best >= 25 },
  { id: 's50', e: '💫', name: 'Fifty Club', hint: 'Reach 50 points', test: (s) => s.best >= 50 },
  { id: 's100', e: '🏅', name: 'Century', hint: 'Reach 100 points', test: (s) => s.best >= 100 },
  { id: 's250', e: '🥈', name: 'Silver Star', hint: 'Reach 250 points', test: (s) => s.best >= 250 },
  { id: 's500', e: '🥇', name: 'Gold Star', hint: 'Reach 500 points', test: (s) => s.best >= 500 },
  { id: 's1000', e: '👑', name: 'Royal Reader', hint: 'Reach 1000 points', test: (s) => s.best >= 1000 },
  { id: 'streak5', e: '🔥', name: 'On Fire', hint: '5 correct in a row', test: (s) => s.stats.bestStreak >= 5 },
  { id: 'streak10', e: '🚀', name: 'Rocket', hint: '10 correct in a row', test: (s) => s.stats.bestStreak >= 10 },
  { id: 'streak20', e: '🌈', name: 'Rainbow Run', hint: '20 correct in a row', test: (s) => s.stats.bestStreak >= 20 },
  { id: 'story1', e: '📖', name: 'Story Time', hint: 'Finish a story', test: (s) => countDone(s) >= 1 },
  { id: 'story10', e: '📚', name: 'Bookworm', hint: 'Finish 10 stories', test: (s) => countDone(s) >= 10 },
  { id: 'story50', e: '🦉', name: 'Wise Owl', hint: 'Finish 50 stories', test: (s) => countDone(s) >= 50 },
  { id: 'lv3', e: '🗺️', name: 'Explorer', hint: 'Clear 3 levels', test: (s) => clearedTotal(s) >= 3 },
  { id: 'lv10', e: '🧭', name: 'Navigator', hint: 'Clear 10 levels', test: (s) => clearedTotal(s) >= 10 },
  { id: 'lv25', e: '⛰️', name: 'Mountain Climber', hint: 'Clear 25 levels', test: (s) => clearedTotal(s) >= 25 },
  { id: 'perfect', e: '💯', name: 'Perfect Set', hint: 'Get 10 of 10 in a set', test: (s) => !!s.flags?.perfect },
  { id: 'exam', e: '🎓', name: 'Exam Ace', hint: 'Score 90%+ on an exam', test: (s) => s.exams.some((e) => e.pct >= 90) },
  { id: 'exam3', e: '📝', name: 'Test Taker', hint: 'Finish 3 exams', test: (s) => s.exams.length >= 3 },
  { id: 'reader', e: '🎤', name: 'Brave Reader', hint: 'Read a story aloud', test: (s) => !!s.flags?.readAloud },
  { id: 'maker', e: '✏️', name: 'Creator', hint: 'Make your own question', test: (s) => s.custom.qa.length + s.custom.flashcards.length + s.custom.fill.length + s.custom.stories.length + s.custom.math.length + s.custom.words.length > 0 },
  { id: 'upload', e: '📤', name: 'Lesson Loader', hint: 'Save a lesson from an upload', test: (s) => s.custom.packs.some((p) => p.source === 'upload' || p.source === 'paste') },
  { id: 'allgrades', e: '🎒', name: 'Grade Hopper', hint: 'Answer questions in 3 grades', test: (s) => Object.keys(s.stats.byGrade).length >= 3 },
  { id: 'mystery', e: '🎁', name: 'Mystery Opener', hint: 'Open a mystery box', test: (s) => !!s.flags?.mystery },
];
const countDone = (s) => Object.values(s.progress).reduce((n, p) => n + Object.values(p.stories).filter((r) => r.done).length, 0);
const clearedTotal = (s) => Object.keys(s.progress).reduce((n, g) => n + gradeSummary(s, g).cleared, 0);

// 102 more collectible stickers: three families that unlock as the child keeps learning
const ANIMALS = '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🦆 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🐢 🐍 🦎 🐙 🦑 🦐 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🐘 🦛 🦏 🐪 🦒 🦘 🐃 🐎 🐑 🦙 🐐 🦌 🐕 🐩 🐈 🐓 🦃 🦚 🦜 🦢 🦩 🕊️ 🐇 🦝 🦨 🦡 🦦 🦥 🐿️ 🦔 🌵 🌲 🌴 🍄 🌻 🌷 🌹 🍎 🍌 🍇 🍓 🍉 🍕 🍩 🍪 🧁 🚗 🚀 🛸 ⛵ 🎈 🎸'.split(' ').filter(Boolean);
const NAMES = 'Puppy Kitty Mousey Hammy Bunny Foxy Bear Panda Koala Tiger Lion Moo Piggy Froggy Monkey Chick Penguin Birdie Ducky Hoot Batty Wolfie Boar Pony Unicorn Buzzy Wormy Flutter Snail Ladybug Antsy Turtle Slither Gecko Octo Squid Shrimpy Crabby Puffer Goldie Fishy Dolphin Whale Whaley Shark Croc Tigra Leopard Zebra Gorilla Ellie Hippo Rhino Camel Giraffe Roo Buffalo Horsey Lamb Llama Goat Deer Doggo Poodle Tabby Rooster Turkey Peacock Parrot Swan Flamingo Dove Hopper Raccoon Skunk Badger Otter Sloth Squirrel Hedgehog Cactus Pine Palm Mushroom Sunny Tulip Rose Apple Banana Grape Berry Melon Pizza Donut Cookie Cupcake Car Rocket UFO Boat Balloon Guitar'.split(' ');
ANIMALS.slice(0, 102).forEach((e, i) => {
  const k = Math.floor(i / 3) + 1, fam = i % 3, name = NAMES[i] || 'Buddy';
  if (fam === 0) STICKERS.push({ id: 'pt' + k, e, name: name + ' Pal', hint: `Reach ${k * 20} points`, test: (s) => s.best >= k * 20 });
  else if (fam === 1) STICKERS.push({ id: 'st' + k, e, name: name + ' Reader', hint: `Finish ${k * 3} stories`, test: (s) => countDone(s) >= k * 3 });
  else STICKERS.push({ id: 'ans' + k, e, name: name + ' Ace', hint: `Answer ${k * 15} questions right`, test: (s) => s.stats.correct >= k * 15 });
});
export const stickerCount = () => STICKERS.length;

function withStickers(s) {
  const have = new Set(s.stickers);
  const gained = [];
  for (const st of STICKERS) if (!have.has(st.id) && st.test(s)) { have.add(st.id); gained.push(st.id); }
  return gained.length ? { ...s, stickers: [...have], newStickers: gained } : s;
}

// ---- reducer --------------------------------------------------------------------------------
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
export { uid };

function reducer(s, a) {
  switch (a.type) {
    case 'set': return { ...s, ...a.patch, gradeKey: a.patch.gradeKey || s.gradeKey };
    case 'settings': return { ...s, settings: { ...s.settings, ...a.patch } };
    case 'profile': {
      const profile = { ...s.profile, ...a.patch };
      const gradeKey = profile.gradeKey || s.gradeKey;
      const reg = loadRegistry();
      reg.list = reg.list.map((p) => (p.id === profile.id ? { ...p, name: profile.name, avatar: profile.avatar, gradeKey } : p));
      saveRegistry(reg);
      return { ...s, profile: { ...profile, gradeKey }, gradeKey };
    }
    // ---- family profiles: add a new child, switch, edit any child's details, or delete one ----
    case 'profile-add': {
      const id = newProfileId();
      const name = (a.name || 'Explorer').trim() || 'Explorer';
      const avatar = a.avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)];
      const gradeKey = a.gradeKey || 'G3';
      const fresh = defaultState(id, name, avatar, gradeKey);
      saveRawState(id, fresh);
      const reg = loadRegistry();
      reg.list = [...reg.list, { id, name, avatar, gradeKey }];
      reg.activeId = id;
      saveRegistry(reg);
      return fresh;
    }
    case 'profile-switch': {
      if (a.id === s.profile.id) return s;
      saveRawState(s.profile.id, s);
      const reg = loadRegistry();
      if (!reg.list.some((p) => p.id === a.id)) return s;
      reg.activeId = a.id;
      saveRegistry(reg);
      return loadRawState(a.id);
    }
    case 'profile-edit': { // { id, patch: { name?, avatar?, gradeKey? } }
      const reg = loadRegistry();
      reg.list = reg.list.map((p) => (p.id === a.id ? { ...p, ...a.patch } : p));
      saveRegistry(reg);
      if (a.id === s.profile.id) {
        const profile = { ...s.profile, ...a.patch };
        const gradeKey = profile.gradeKey || s.gradeKey;
        return { ...s, profile: { ...profile, gradeKey }, gradeKey };
      }
      const other = loadRawState(a.id);
      const profile = { ...other.profile, ...a.patch };
      const gradeKey = profile.gradeKey || other.gradeKey;
      saveRawState(a.id, { ...other, profile: { ...profile, gradeKey }, gradeKey });
      return s;
    }
    case 'profile-delete': {
      const reg = loadRegistry();
      if (reg.list.length <= 1) return s; // always keep at least one profile
      reg.list = reg.list.filter((p) => p.id !== a.id);
      try { localStorage.removeItem(keyFor(a.id)); } catch (e) { /* ignore */ }
      if (reg.activeId === a.id) reg.activeId = reg.list[0].id;
      saveRegistry(reg);
      return a.id === s.profile.id ? loadRawState(reg.activeId) : s;
    }
    case 'answer': {
      const { grade, subject, correct } = a;
      const t = today();
      const daily = s.daily.date === t ? s.daily : { date: t, correct: 0, wrong: 0 };
      const score = Math.max(0, s.score + (correct ? 1 : -1));
      const st = s.stats;
      const sub = st.bySubject[subject] || { c: 0, w: 0 };
      const gr = st.byGrade[grade] || { c: 0, w: 0 };
      const streak = correct ? st.streak + 1 : 0;
      const next = {
        ...s, score, best: Math.max(s.best, score),
        daily: { ...daily, correct: daily.correct + (correct ? 1 : 0), wrong: daily.wrong + (correct ? 0 : 1) },
        stats: {
          ...st, correct: st.correct + (correct ? 1 : 0), wrong: st.wrong + (correct ? 0 : 1), streak, bestStreak: Math.max(st.bestStreak, streak),
          bySubject: { ...st.bySubject, [subject]: { c: sub.c + (correct ? 1 : 0), w: sub.w + (correct ? 0 : 1) } },
          byGrade: { ...st.byGrade, [grade]: { c: gr.c + (correct ? 1 : 0), w: gr.w + (correct ? 0 : 1) } },
        },
      };
      return withStickers(next);
    }
    case 'story-set': { // { grade, n, set(0|1), correct, total }
      const p = gp(s, a.grade);
      const rec = p.stories[a.n] || { sets: [null, null], best: 0, done: false };
      const sets = rec.sets.slice();
      const pc = pct(a.correct, a.total);
      sets[a.set] = Math.max(sets[a.set] ?? 0, pc);
      const done = sets[0] != null && sets[1] != null;
      const best = done ? Math.round((sets[0] + sets[1]) / 2) : Math.round(sets[a.set]);
      const flags = a.correct === a.total && a.total >= 10 ? { ...(s.flags || {}), perfect: true } : s.flags;
      return withStickers({ ...s, flags, progress: { ...s.progress, [a.grade]: { ...p, stories: { ...p.stories, [a.n]: { sets, best, done: done || rec.done } } } } });
    }
    case 'set-done': { // { grade, area:'math'|'fill', level, correct, total }
      const p = gp(s, a.grade);
      const cur = p[a.area][a.level];
      const pc = pct(a.correct, a.total);
      const flags = a.correct === a.total && a.total >= 10 ? { ...(s.flags || {}), perfect: true } : s.flags;
      return withStickers({ ...s, flags, progress: { ...s.progress, [a.grade]: { ...p, [a.area]: { ...p[a.area], [a.level]: { best: Math.max(cur ? cur.best : 0, pc), tries: (cur ? cur.tries : 0) + 1 } } } } });
    }
    case 'flag': return withStickers({ ...s, flags: { ...(s.flags || {}), [a.key]: true } });
    case 'exam': return withStickers({ ...s, exams: [a.exam, ...s.exams].slice(0, 400) });
    case 'mystery-open': {
      const locked = STICKERS.filter((x) => !s.stickers.includes(x.id));
      const pick = locked.length ? locked[Math.floor(Math.random() * locked.length)].id : null;
      return { ...s, mystery: { last: today() }, flags: { ...(s.flags || {}), mystery: true }, stickers: pick ? [...s.stickers, pick] : s.stickers, newStickers: pick ? ['mystery', pick] : ['mystery'] };
    }
    case 'clear-new': return { ...s, newStickers: undefined };
    // custom content
    case 'c-add': { // { kind, items, pack? }
      const c = s.custom;
      const packs = a.pack ? [...c.packs.filter((p) => p.id !== a.pack.id), a.pack] : c.packs;
      return withStickers({ ...s, custom: { ...c, packs, [a.kind]: [...c[a.kind], ...a.items] } });
    }
    case 'c-add-many': { // { groups: {kind: items[]}, pack }
      const c = { ...s.custom, packs: [...s.custom.packs, a.pack] };
      for (const k of Object.keys(a.groups)) c[k] = [...c[k], ...a.groups[k]];
      return withStickers({ ...s, custom: c });
    }
    case 'c-del': return { ...s, custom: { ...s.custom, [a.kind]: s.custom[a.kind].filter((x) => x.id !== a.id) } };
    case 'c-edit': return { ...s, custom: { ...s.custom, [a.kind]: s.custom[a.kind].map((x) => (x.id === a.id ? { ...x, ...a.patch } : x)) } };
    case 'c-del-pack': {
      const c = { ...s.custom, packs: s.custom.packs.filter((p) => p.id !== a.id) };
      for (const k of ['flashcards', 'stories', 'qa', 'math', 'fill', 'words']) c[k] = c[k].filter((x) => x.packId !== a.id);
      return { ...s, custom: c };
    }
    // manual resets
    case 'reset-score': return { ...s, score: 0, daily: { date: today(), correct: 0, wrong: 0 }, stats: { ...s.stats, streak: 0 } };
    case 'reset-ratings': return { ...s, progress: {}, exams: [] };
    case 'reset-stats': return { ...s, stats: { correct: 0, wrong: 0, bySubject: {}, byGrade: {}, streak: 0, bestStreak: 0 }, daily: { date: today(), correct: 0, wrong: 0 } };
    case 'reset-stickers': return { ...s, stickers: [], flags: {}, mystery: { last: '' } };
    case 'reset-all': return { ...defaultState(), profile: s.profile, theme: s.theme, settings: s.settings, custom: s.custom };
    case 'wipe-custom': return { ...s, custom: emptyCustom() };
    case 'import': {
      const next = { ...defaultState(), ...a.state };
      const gradeKey = next.profile?.gradeKey || next.gradeKey || 'G3';
      return { ...next, gradeKey, profile: { ...next.profile, gradeKey } };
    }
    default: return s;
  }
}

const Ctx = createContext(null);
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; }
    saveRawState(state.profile.id, state);
  }, [state]);
  return React.createElement(Ctx.Provider, { value: { state, dispatch } }, children);
}
export const useStore = () => useContext(Ctx);

export const exportBackup = (state) => JSON.stringify({ app: 'kidsy', exportedAt: new Date().toISOString(), state }, null, 2);
export function parseBackup(text) {
  const o = JSON.parse(text);
  if (o.app !== 'kidsy' || !o.state) throw new Error('This file is not a Kidsy backup.');
  return o.state;
}
