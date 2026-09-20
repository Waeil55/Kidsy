import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GRADES, gradeName, genStory, STORIES_PER_GRADE, ensure20Questions } from './data/grades.js';
import { featuredStory } from './data/gradeStories.js';
import { loadScores, saveScores, gradeScores, touchStreak } from './store/scores.js';
import { loadCustom } from './lib/schoolParse.js';
import Reader from './components/Reader.jsx';
import QuizPanel from './components/QuizPanel.jsx';
import { LevelsStrip, LevelRunner } from './components/Levels.jsx';
import RewardsPanel from './components/RewardsPanel.jsx';
import { StudioPanel, SchoolPanel } from './components/Studio.jsx';


const THEMES = [
  ['purple', 'Purple Magic', '#7551f0'],
  ['blue', 'EWA Sky Blue', '#2db5ff'],
  ['green', 'Mint Green', '#10b981'],
  ['coral', 'Coral Sunset', '#ff6b6b'],
  ['pink', 'Bubblegum Pink', '#f43f5e'],
  ['amber', 'Sunshine Gold', '#f59e0b'],
];
const AVATARS = ['👦', '👧', '🐼', '🦁', '🚀'];

function speakText(text, rate = 0.9) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = rate;
  window.speechSynthesis.speak(utter);
}

let chimeCtx = null;
function playChime(type = 'success') {
  try {
    chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (chimeCtx.state === 'suspended') chimeCtx.resume();
    const osc = chimeCtx.createOscillator();
    const gain = chimeCtx.createGain();
    osc.connect(gain);
    gain.connect(chimeCtx.destination);
    const now = chimeCtx.currentTime;
    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'pop') {
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) { /* silent */ }
}

function loadProfile() {
  try {
    return { name: 'Arab', avatar: '👦', gradeKey: 'G1', theme: 'purple', ...(JSON.parse(localStorage.getItem('kidlingo-profile') || '{}')) };
  } catch (e) {
    return { name: 'Arab', avatar: '👦', gradeKey: 'G1', theme: 'purple' };
  }
}
function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem('ewa-saved-vocab') || '[]');
  } catch (e) {
    return [];
  }
}

const NAV = [
  ['home', 'Home', 'fa-house'],
  ['reader', 'Stories', 'fa-book-open'],
  ['quiz', 'Quiz', 'fa-gamepad'],
  ['rewards', 'Rewards', 'fa-gift'],
  ['profile', 'Profile', 'fa-user'],
];
const BREADCRUMB = {
  home: 'Home Dashboard',
  reader: 'Story Reader & Word Study',
  quiz: 'Smart Quiz — Your Grade Only',
  rewards: 'Stars, Trophies & Flashcards',
  profile: 'Settings & Color Customization',
  school: 'School Lessons Upload',
  studio: 'Content Studio',
};

export default function App() {
  const [profile, setProfile] = useState(loadProfile);
  const [screen, setScreen] = useState('home');
  const [scores, setScores] = useState(loadScores);
  const [saved, setSaved] = useState(loadSaved);
  const [book, setBook] = useState(() => {
    const p = loadProfile();
    return ensure20Questions({ ...featuredStory(p.gradeKey), gradeKey: p.gradeKey }, p.gradeKey);
  });
  const [readerMode, setReaderMode] = useState('read');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [toast, setToast] = useState(null);
  const [clock, setClock] = useState('9:41');
  const [phonePreview, setPhonePreview] = useState(false);
  const [levelN, setLevelN] = useState(null);
  const [libCount, setLibCount] = useState(50);
  const toastTimer = useRef(null);

  const gradeKey = profile.gradeKey;

  useEffect(() => {
    localStorage.setItem('kidlingo-profile', JSON.stringify(profile));
    document.body.setAttribute('data-theme', profile.theme);
  }, [profile]);
  useEffect(() => {
    localStorage.setItem('ewa-saved-vocab', JSON.stringify(saved));
  }, [saved]);
  useEffect(() => {
    setScores((prev) => {
      const next = touchStreak({ ...prev, streak: { ...prev.streak } });
      saveScores(next);
      return next;
    });
  }, []);
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setClock(`${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`);
    }, 10000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('device-phone-preview', phonePreview);
  }, [phonePreview]);

  const notify = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const updateScores = useCallback((fn) => {
    setScores((prev) => {
      const next = fn(structuredClone(prev));
      saveScores(next);
      return next;
    });
  }, []);

  const setGrade = (gk) => {
    playChime('pop');
    setProfile((p) => ({ ...p, gradeKey: gk }));
    setBook(ensure20Questions({ ...featuredStory(gk), gradeKey: gk }, gk));
    setReaderMode('read');
    setLibCount(50);
    notify(`Switched to ${gradeName(gk)}!`);
  };

  const setTheme = (t) => {
    playChime('pop');
    setProfile((p) => ({ ...p, theme: t }));
  };

  const go = (s) => {
    playChime('pop');
    setScreen(s);
  };

  const saveWord = useCallback((data, status) => {
    if (!data) return;
    const word = data.word.toLowerCase();
    setSaved((prev) => {
      const i = prev.findIndex((v) => v.word.toLowerCase() === word);
      const item = { word: data.word, ipa: data.ipa, meaning: data.meaning, sentence: data.sentence, question: data.question, status, grade: gradeKey, timestamp: Date.now() };
      if (i >= 0) {
        const next = [...prev];
        const wasLearned = next[i].status === 'learned';
        next[i] = item;
        if (status === 'learned' && !wasLearned) {
          updateScores((s) => { s.vocabLearned = (s.vocabLearned || 0) + 1; s.xp += 5; s.stars += 2; return s; });
        }
        return next;
      }
      if (status === 'learned') {
        updateScores((s) => { s.vocabLearned = (s.vocabLearned || 0) + 1; s.xp += 5; s.stars += 2; return s; });
      }
      return [item, ...prev];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeKey]);

  // Exact design rule: +20 XP & +10 stars per CORRECT answer, immediately.
  const answerQuiz = useCallback((ok, name) => {
    if (ok) {
      updateScores((s) => {
        s.xp += 20;
        s.stars += 10;
        return s;
      });
      notify('★ Correct! +20 XP Earned!');
    } else {
      notify(`The correct answer was ${name}!`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishQuizRound = useCallback(({ total, correct }) => {
    updateScores((s) => {
      const g = gradeScores(s, gradeKey);
      g.quizN += total;
      g.quizCorrect += correct;
      return s;
    });
    if (correct === total) {
      notify('🎉 Quiz Finished! Super Job! +bonus 10 XP');
      updateScores((s) => {
        s.xp += 10;
        return s;
      });
    } else {
      notify(`Round done: ${correct}/${total} — keep going!`);
    }
    go('rewards');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeKey]);

  const finishStoryQuiz = useCallback(({ total, correct }) => {
    updateScores((s) => {
      const g = gradeScores(s, gradeKey);
      g.quizN += total;
      g.quizCorrect += correct;
      const gained = correct * 10;
      s.xp += gained;
      s.stars += correct * 2;
      return s;
    });
    playChime('success');
    notify(correct === total ? `🏆 Perfect story quiz! +${correct * 10} XP` : `Story quiz: ${correct}/${total} — +${correct * 10} XP`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeKey]);

  const completeLevel = useCallback((n, reward) => {
    updateScores((s) => {
      const g = gradeScores(s, gradeKey);
      if (!g.levelsDone.includes(n)) g.levelsDone.push(n);
      if (!g.storiesRead.includes(`${gradeKey}-story-${((n - 1) * 7) % 500}`)) g.storiesRead.push(`${gradeKey}-story-${((n - 1) * 7) % 500}`);
      g.mathDone += 1;
      g.mathCorrect += 1;
      s.xp += reward.xp;
      s.stars += reward.stars;
      return s;
    });
    playChime('success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeKey]);

  // Grade story list: custom + featured + generated (paged).
  // EVERY story is topped up to 20 questions — grade-locked, never mixed.
  const storyList = useMemo(() => {
    const c = loadCustom();
    const custom = c.stories.filter((s) => s.grade === gradeKey).map((s) => ensure20Questions(s, gradeKey));
    const feat = ensure20Questions({ ...featuredStory(gradeKey), id: `${gradeKey}-featured`, gradeKey }, gradeKey);
    const gen = [];
    for (let i = 0; i < Math.min(libCount, STORIES_PER_GRADE); i++) {
      const s = genStory(gradeKey, i);
      gen.push({ ...s, title: s.title, subtitle: `${gradeName(gradeKey)} · Story ${i + 1}`, level: `${gradeName(gradeKey)} · #${i + 1}` });
    }
    return [...custom, feat, ...gen];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeKey, libCount, screen]);

  const selectStory = (s) => {
    if (s.library) {
      setLibCount((cur) => Math.min(cur + 100, STORIES_PER_GRADE));
      notify(`Library expanded — ${Math.min(libCount + 100, STORIES_PER_GRADE)} of ${STORIES_PER_GRADE} ${gradeName(gradeKey)} stories`);
      return;
    }
    playChime('pop');
    setBook(ensure20Questions(s, gradeKey));
    setLibraryOpen(false);
    setReaderMode('read');
    go('reader');
  };

  const themeLabel = (THEMES.find(([k]) => k === profile.theme) || THEMES[0])[1];

  const navBtn = (id, icon, label, extra = '') => (
    <button
      key={id}
      onClick={() => go(id)}
      className={`flex flex-col items-center justify-center space-y-1 transition ${extra} ${screen === id ? 'text-theme-main' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <i className={`fa-solid ${icon} text-lg`}></i>
      <span className={`text-[10px] font-display ${screen === id ? 'font-black' : 'font-bold'}`}>{label}</span>
    </button>
  );

  return (
    <div id="appRoot" className="w-full h-full flex flex-col md:flex-row bg-white overflow-hidden relative shadow-sm transition-all duration-300">
      {/* Desktop sidebar */}
      <aside id="desktopSidebar" className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 select-none z-30 justify-between p-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-theme-main text-white flex items-center justify-center font-display font-black text-xl shadow-md">K</div>
              <div>
                <h1 className="font-display font-black text-lg text-slate-800 leading-tight">KidLingo</h1>
                <span className="text-[11px] font-bold text-slate-400">EWA Kids Reader</span>
              </div>
            </div>
            <button onClick={() => setPhonePreview(!phonePreview)} className="text-[11px] p-2 rounded-xl bg-slate-100 hover:bg-theme-light text-slate-600 hover:text-theme-main transition" title="Toggle Phone Frame Simulator">
              <i className={`fa-solid ${phonePreview ? 'fa-desktop' : 'fa-mobile-screen'}`}></i>
            </button>
          </div>

          <div onClick={() => go('profile')} className="bg-slate-50 border border-slate-200/80 rounded-3xl p-3.5 flex items-center space-x-3 cursor-pointer hover:bg-theme-light/50 transition">
            <div className="w-11 h-11 rounded-2xl bg-amber-200 border-2 border-white shadow-sm flex items-center justify-center text-2xl">{profile.avatar}</div>
            <div className="flex-1 min-w-0">
              <span className="font-display font-black text-slate-800 text-sm truncate block">Hi, {profile.name}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-theme-light text-theme-main inline-block">{gradeName(gradeKey)}</span>
            </div>
            <i className="fa-solid fa-gear text-slate-400 text-xs"></i>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">Grade Level:</div>
            <div className="grid grid-cols-4 gap-1.5">
              {GRADES.map((g) => (
                <button
                  key={g.key}
                  onClick={() => setGrade(g.key)}
                  className={`py-1 px-1 text-center rounded-xl font-display font-black text-[11px] transition ${g.key === gradeKey ? 'bg-theme-main text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {g.short}
                </button>
              ))}
            </div>
          </div>

          <nav className="space-y-1.5">
            {[...NAV.map(([id, label, icon]) => ({ id, label, icon })), { id: 'school', label: 'School Lessons', icon: 'fa-school' }, { id: 'studio', label: 'Create Content', icon: 'fa-wand-magic-sparkles' }].map((t) => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-2xl font-display text-sm transition text-left ${screen === t.id ? 'text-theme-main bg-theme-light font-black' : 'text-slate-500 hover:bg-slate-50 font-bold'}`}
              >
                <i className={`fa-solid ${t.icon} text-base w-5 text-center`}></i>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/70 rounded-3xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⭐</span>
            <div>
              <span className="font-display font-black text-xs text-amber-900 block">{scores.stars} Stars</span>
              <span className="text-[10px] text-amber-700 font-bold">Streak: {scores.streak.count || 0} Days · {scores.xp} XP</span>
            </div>
          </div>
          <button onClick={() => go('profile')} className="w-8 h-8 rounded-xl bg-white border border-amber-200 text-amber-600 flex items-center justify-center text-xs hover:bg-amber-100" title="Quick Theme">
            <i className="fa-solid fa-palette"></i>
          </button>
        </div>
      </aside>

      {/* Main stage */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div id="mobileStatusBar" className="h-6 w-full bg-transparent px-7 flex md:hidden items-center justify-between text-[11px] font-bold text-slate-500 shrink-0 z-30 pt-1">
          <span>{clock}</span>
          <div className="flex items-center space-x-1.5">
            <i className="fa-solid fa-signal text-[9px]"></i>
            <i className="fa-solid fa-wifi text-[10px]"></i>
            <i className="fa-solid fa-battery-full text-xs"></i>
          </div>
        </div>

        <header id="desktopTopHeader" className="hidden md:flex h-16 bg-white border-b border-slate-200 px-6 items-center justify-between shrink-0 z-20">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-400">Current Section:</span>
            <span className="font-display font-black text-sm text-slate-800">{BREADCRUMB[screen] || 'KidLingo'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 bg-theme-light text-theme-main px-3 py-1.5 rounded-full font-display font-black text-xs border border-theme-light">
              <i className="fa-solid fa-graduation-cap"></i>
              <span>{gradeName(gradeKey)}</span>
            </div>
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
              <span className="text-xs text-slate-400 font-bold">Theme:</span>
              <div className="flex space-x-1.5">
                {THEMES.slice(0, 4).map(([k, , color]) => (
                  <button key={k} onClick={() => setTheme(k)} className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition" style={{ background: color }} title={k}></button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div id="screensViewport" className="flex-1 overflow-hidden relative bg-[#faf9f6]">
          {screen === 'home' && (
            <section className="absolute inset-0 overflow-y-auto pb-20 p-4 md:p-8 space-y-5">
              <div className="flex md:hidden items-center justify-between pt-1">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => go('profile')}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-white shadow-md flex items-center justify-center text-2xl overflow-hidden">{profile.avatar}</div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-display font-black text-slate-800 text-base">Hi, {profile.name}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-theme-light text-theme-main border border-theme-light">{gradeName(gradeKey)}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Let&apos;s learn something new!</p>
                  </div>
                </div>
                <button onClick={() => go('profile')} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 transition active:scale-95" title="Change Theme Color">
                  <i className="fa-solid fa-palette text-sm"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-6 rounded-3xl bg-theme-main p-6 text-white shadow-xl relative overflow-hidden flex items-center justify-between min-h-[160px]">
                  <i className="fa-solid fa-star absolute top-3 right-36 text-amber-300 text-xs animate-pulse"></i>
                  <i className="fa-solid fa-star absolute bottom-4 left-36 text-amber-300 text-sm"></i>
                  <div className="max-w-[60%] z-10">
                    <h3 className="font-display font-black text-2xl leading-tight">Daily<br />Challenge</h3>
                    <p className="text-xs text-white/85 font-medium my-2.5">Complete a quiz and earn 20 XP &amp; stars!</p>
                    <button onClick={() => go('quiz')} className="py-2.5 px-6 bg-white text-theme-main font-display font-black text-xs rounded-xl shadow-md hover:bg-amber-100 transition active:scale-95">
                      Let&apos;s Go
                    </button>
                  </div>
                  <div className="w-32 h-32 relative flex items-center justify-center">
                    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
                      <rect x="42" y="94" width="36" height="12" rx="4" fill="#d97706" />
                      <polygon points="50,94 70,94 65,78 55,78" fill="#b45309" />
                      <path d="M30 30 C30 70, 90 70, 90 30 Z" fill="#fbbf24" />
                      <path d="M35 30 C35 64, 85 64, 85 30 Z" fill="#fde047" />
                      <circle cx="60" cy="46" r="10" fill="#f59e0b" />
                      <polygon points="60,39 63,45 69,45 64,49 66,55 60,51 54,55 56,49 51,45 57,45" fill="#ffffff" />
                      <path d="M30 36 C18 36, 18 56, 33 60" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" fill="none" />
                      <path d="M90 36 C102 36, 102 56, 87 60" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>
                </div>

                <div className="md:col-span-6 bg-white rounded-3xl p-5 border border-slate-100 shadow-card-3d flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-display">Featured Story for {gradeName(gradeKey)}</span>
                    </div>
                    <button onClick={() => setLibraryOpen(true)} className="text-xs font-black text-theme-main hover:underline">
                      Change Story
                    </button>
                  </div>
                  <div onClick={() => go('reader')} className="bg-[#fef9ee] rounded-2xl p-4 border border-amber-200/70 flex items-center justify-between cursor-pointer hover:bg-amber-50 transition">
                    <div className="space-y-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-amber-700">{book.subtitle}</div>
                      <h4 className="font-serif font-black text-slate-900 text-lg">{book.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                        <span><i className="fa-solid fa-book-open text-theme-main mr-1"></i> Tap any word for meaning</span>
                        <span><i className="fa-solid fa-volume-high text-emerald-500 mr-1"></i> Audio</span>
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-theme-solid text-white flex items-center justify-center text-lg shadow-md shrink-0 ml-3">
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-black text-xl text-slate-800">Categories</h3>
                  <span className="text-xs font-bold text-slate-400">Choose a world to explore</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { cat: 'abc', bg: 'bg-amber-100/70', body: (<span><span className="text-emerald-500">A</span><span className="text-rose-500">B</span><span className="text-sky-500">C</span></span>), title: 'ABC', sub: 'Phonics & Letters', go: 'reader' },
                    { cat: 'numbers', bg: 'bg-sky-100/70', body: (<span><span className="text-rose-500">1</span><span className="text-amber-500">2</span><span className="text-purple-500">3</span></span>), title: 'Numbers', sub: 'Counting Fun', go: 'quiz' },
                    { cat: 'animals', bg: 'bg-emerald-100/70', body: '🦁', title: 'Animals', sub: 'World & Sounds', go: 'quiz' },
                    { cat: 'shapes', bg: 'bg-rose-100/70', body: '⭐', title: 'Shapes', sub: '& Colors', go: 'reader' },
                  ].map((c) => (
                    <div key={c.cat} onClick={() => go(c.go)} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card-3d cursor-pointer hover:scale-[1.03] transition flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-2xl ${c.bg} flex items-center justify-center text-3xl font-display font-black tracking-tighter shadow-inner mb-3`}>
                        {c.body}
                      </div>
                      <span className="font-display font-black text-slate-800 text-base">{c.title}</span>
                      <span className="text-xs text-slate-400 font-bold">{c.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <LevelsStrip gradeKey={gradeKey} scores={scores} onPlay={(n) => setLevelN(n)} />

              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => go('school')} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card-3d cursor-pointer hover:scale-[1.02] transition flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-xl">🏫</div>
                  <div>
                    <div className="font-display font-black text-slate-800 text-sm">School Lessons</div>
                    <div className="text-xs text-slate-400 font-bold">Upload &amp; extract</div>
                  </div>
                </div>
                <div onClick={() => go('studio')} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card-3d cursor-pointer hover:scale-[1.02] transition flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-xl">✨</div>
                  <div>
                    <div className="font-display font-black text-slate-800 text-sm">Create Content</div>
                    <div className="text-xs text-slate-400 font-bold">Cards · stories · math</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {screen === 'reader' && (
            <section className="absolute inset-0 flex flex-col bg-[#fdfbf7]">
              <header className="bg-white/95 backdrop-blur px-4 md:px-8 py-3 flex items-center justify-between border-b border-slate-200 shrink-0 z-20">
                <div className="flex items-center space-x-3">
                  <button onClick={() => go('home')} className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-theme-main px-2 py-0.5 rounded-full bg-theme-light">{gradeName(gradeKey)}</span>
                    <h3 className="font-display font-bold text-slate-800 text-sm md:text-base">{book.title}</h3>
                  </div>
                </div>
                <button onClick={() => setLibraryOpen(true)} className="px-3.5 py-1.5 rounded-full bg-theme-light text-theme-main flex items-center space-x-2 font-display font-bold text-xs hover:opacity-80 transition" title="Select Story">
                  <i className="fa-solid fa-book-bookmark"></i>
                  <span className="hidden md:inline">Change Story</span>
                </button>
              </header>
              <Reader
                book={book}
                gradeKey={gradeKey}
                saved={saved}
                onSaveWord={saveWord}
                fontSize={fontSize}
                mode={readerMode}
                setMode={setReaderMode}
                onStoryQuizFinish={finishStoryQuiz}
                notify={notify}
              />
            </section>
          )}

          {screen === 'quiz' && (
            <section className="absolute inset-0 flex flex-col bg-[#fbfaff] p-4 md:p-8 overflow-y-auto">
              <QuizPanel gradeKey={gradeKey} story={book} saved={saved} notify={notify} onAnswer={answerQuiz} onRoundEnd={finishQuizRound} />
            </section>
          )}

          {screen === 'rewards' && (
            <section className="absolute inset-0 flex flex-col bg-[#faf9f6] p-4 md:p-8 overflow-y-auto pb-24">
              <RewardsPanel scores={scores} saved={saved} notify={notify} onScoresChange={setScores} />
            </section>
          )}

          {screen === 'profile' && (
            <section className="absolute inset-0 flex flex-col bg-[#faf9f6] p-4 md:p-8 overflow-y-auto pb-24">
              <div className="max-w-3xl mx-auto w-full space-y-6">
                <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800 pt-1">Kid&apos;s Profile &amp; Themes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card-3d flex flex-col items-center text-center space-y-4">
                    <div className="w-24 h-24 rounded-3xl bg-amber-200 border-4 border-white shadow-lg flex items-center justify-center text-5xl">{profile.avatar}</div>
                    <div className="text-xs text-slate-400 font-bold">Tap an avatar to choose:</div>
                    <div className="flex space-x-2">
                      {AVATARS.map((a) => (
                        <button key={a} onClick={() => { playChime('pop'); setProfile((p) => ({ ...p, avatar: a })); }} className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-amber-100 text-2xl flex items-center justify-center">
                          {a}
                        </button>
                      ))}
                    </div>
                    <div className="w-full text-left pt-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Child&apos;s Name</label>
                      <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value || 'Kid' }))} type="text" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-display font-bold text-slate-800 focus:outline-none focus:border-theme-main text-sm" />
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card-3d space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Current Grade Level</label>
                      <span className="text-xs font-black text-theme-main">{gradeName(gradeKey)}</span>
                    </div>
                    <p className="text-xs text-slate-400">Pick any grade to instantly adjust stories, phonics, and challenges!</p>
                    <div className="grid grid-cols-4 gap-2">
                      {GRADES.map((g) => (
                        <button key={g.key} onClick={() => setGrade(g.key)} className={`py-2 px-1 text-center rounded-2xl font-display font-black text-xs transition border ${g.key === gradeKey ? 'bg-theme-main text-white border-theme-main shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}>
                          {g.short}
                        </button>
                      ))}
                    </div>
                    <div className="pt-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Text Font Size</label>
                      <div className="flex space-x-2">
                        <button onClick={() => setFontSize((f) => Math.max(14, f - 2))} className="flex-1 py-1.5 bg-slate-100 rounded-lg text-xs font-bold">A−</button>
                        <button onClick={() => setFontSize(18)} className="flex-1 py-1.5 bg-slate-100 rounded-lg text-xs font-bold">Normal</button>
                        <button onClick={() => setFontSize((f) => Math.min(26, f + 2))} className="flex-1 py-1.5 bg-slate-100 rounded-lg text-xs font-bold">A+</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card-3d space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Favorite App Color Palette</label>
                    <span className="text-xs font-black text-slate-500">{themeLabel}</span>
                  </div>
                  <p className="text-xs text-slate-400">Pick any color palette for buttons, cards, and stories!</p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 pt-1">
                    {THEMES.map(([k, label, color]) => (
                      <button key={k} onClick={() => setTheme(k)} className={`p-3.5 rounded-2xl border-2 flex flex-col items-center space-y-1.5 transition active:scale-95 ${profile.theme === k ? 'border-slate-800 bg-slate-50' : 'border-slate-100'}`}>
                        <span className="w-7 h-7 rounded-full shadow-sm" style={{ background: color }}></span>
                        <span className="text-xs font-bold text-slate-700">{label.split(' ')[0] === 'EWA' ? 'EWA Blue' : label.split(' ')[0] === 'Bubblegum' ? 'Bubble Pink' : label.split(' ')[0] === 'Sunshine' ? 'Sunshine' : label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {screen === 'school' && (
            <section className="absolute inset-0 flex flex-col bg-[#faf9f6] p-4 md:p-8 overflow-y-auto pb-24">
              <div className="max-w-3xl mx-auto w-full">
                <h2 className="font-display font-black text-2xl text-slate-800 pt-1 mb-1">School Lessons</h2>
                <p className="text-xs text-slate-400 mb-4">Upload once — the app files every item into its exact grade + subject.</p>
                <SchoolPanel notify={notify} />
              </div>
            </section>
          )}

          {screen === 'studio' && (
            <section className="absolute inset-0 flex flex-col bg-[#faf9f6] p-4 md:p-8 overflow-y-auto pb-24">
              <div className="max-w-3xl mx-auto w-full">
                <h2 className="font-display font-black text-2xl text-slate-800 pt-1 mb-1">Content Studio</h2>
                <p className="text-xs text-slate-400 mb-4">Flashcards, stories, Q&amp;A, math, fill-in sentences — grade-locked.</p>
                <StudioPanel notify={notify} />
              </div>
            </section>
          )}
        </div>

        <nav id="mobileNavBar" className="h-16 bg-white/95 backdrop-blur border-t border-slate-200/80 px-4 flex md:hidden items-center justify-around shrink-0 z-30">
          {NAV.map(([id, label, icon]) => navBtn(id, icon, label))}
        </nav>
      </div>

      {levelN && (
        <LevelRunner
          gradeKey={gradeKey}
          levelN={levelN}
          onClose={() => setLevelN(null)}
          onComplete={(reward) => completeLevel(levelN, reward)}
        />
      )}

      {/* Grade library modal — exact design, works from Home AND Reader */}
      {libraryOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col justify-end" style={{ position: 'fixed' }}>
          <div className="bg-white rounded-t-3xl max-h-[85%] flex flex-col overflow-hidden shadow-2xl p-4 w-full sm:max-w-md mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display font-black text-slate-800 text-lg">Grade Stories &amp; Books</h3>
                <p className="text-xs text-slate-400">Choose a story for your grade</p>
              </div>
              <button onClick={() => setLibraryOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="space-y-2.5 py-3 overflow-y-auto">
              {storyList.map((s) => (
                <div
                  key={s.id}
                  onClick={() => selectStory(s)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${s.id === book.id ? 'border-theme-main bg-theme-light' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-theme-main">{s.level}</span>
                    <h4 className="font-display font-black text-slate-800 text-sm">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{s.subtitle}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={'absolute top-9 inset-x-6 z-[70] bg-slate-900/90 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl text-center pointer-events-none transition-all duration-300 ' + (toast ? '' : 'opacity-0 -translate-y-2')}>
        {toast || 'Toast notification'}
      </div>
    </div>
  );
}
