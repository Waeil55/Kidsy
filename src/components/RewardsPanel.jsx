import React, { useState } from 'react';
import { GRADES, gradeName } from '../data/grades.js';
import { accuracy, overallAccuracy, resetAllScores } from '../store/scores.js';
import VocabDeck from './VocabDeck.jsx';

export default function RewardsPanel({ scores, saved, notify, onScoresChange }) {
  const [deckOpen, setDeckOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const overall = overallAccuracy(scores);

  const trophies = [
    { emoji: '🏆', name: 'Fast Reader', sub: 'Read 10 stories', won: Object.values(scores.grades).reduce((n, g) => n + g.storiesRead.length, 0) >= 10 },
    { emoji: '⭐', name: 'Word Wizard', sub: '15 words learned', won: (scores.vocabLearned || 0) >= 15 || saved.filter((v) => v.status === 'learned').length >= 15 },
    { emoji: '🎯', name: 'Quiz Champion', sub: '85%+ accuracy (5+)', won: (() => {
      let n = 0;
      let c = 0;
      Object.values(scores.grades).forEach((g) => { n += g.quizN; c += g.quizCorrect; });
      return n >= 5 && c / n >= 0.85;
    })() },
    { emoji: '🔢', name: 'Math Star', sub: '50 math solved', won: Object.values(scores.grades).reduce((n, g) => n + g.mathDone, 0) >= 50 },
    { emoji: '🔥', name: 'Streak Blaze', sub: '7-day streak', won: (scores.streak.count || 0) >= 7 },
    { emoji: '💎', name: 'XP Legend', sub: '1000 XP', won: scores.xp >= 1000 },
  ];

  const doReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      notify('Tap RESET again to wipe ALL scores — this cannot be undone');
      setTimeout(() => setConfirmReset(false), 5000);
      return;
    }
    onScoresChange(resetAllScores());
    setConfirmReset(false);
    notify('All scores reset. Fresh start!');
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800">Kid Rewards</h2>
          <p className="text-xs md:text-sm text-slate-400">Celebrate progress and practice vocabulary</p>
        </div>
        <div className="flex items-center space-x-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-display font-black text-sm">
          <i className="fa-solid fa-star text-amber-500"></i>
          <span>{scores.stars} Stars</span>
        </div>
      </div>

      {/* Scores + rates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: '⭐', label: 'Total XP', value: scores.xp, color: '#f59e0b', bg: '#fef3c7' },
          { icon: '🔥', label: 'Day Streak', value: `${scores.streak.count || 0}d`, color: '#ef4444', bg: '#fef2f2' },
          { icon: '🎯', label: 'Accuracy', value: overall === null ? '—' : `${overall}%`, color: '#0ea5e9', bg: '#e0f2fe' },
          { icon: '📚', label: 'Words', value: saved.length, color: '#8b5cf6', bg: '#ede9fe' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-card-3d text-center">
            <div className="text-2xl">{s.icon}</div>
            <div className="font-display font-black text-xl" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px] font-bold text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-grade rates */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card-3d">
        <h3 className="font-display font-black text-sm text-slate-700 uppercase tracking-wider mb-3">Rates per grade</h3>
        <div className="space-y-2">
          {GRADES.map((g) => {
            const gs = scores.grades[g.key] || { quizN: 0, quizCorrect: 0, mathDone: 0, mathCorrect: 0, storiesRead: [], levelsDone: [] };
            const acc = accuracy(gs);
            return (
              <div key={g.key} className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 w-28">{gradeName(g.key)}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden mx-2">
                  <div className="h-full bg-theme-main rounded-full" style={{ width: `${acc === null ? 0 : acc}%` }}></div>
                </div>
                <span className="text-slate-500 w-24 text-right">
                  {acc === null ? 'no data' : `${acc}%`} · Lv{gs.levelsDone.length}/50
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-card-3d">
          <h3 className="font-display font-black text-sm text-slate-700 uppercase tracking-wider mb-4">Trophy Badges</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {trophies.map((t) => (
              <div key={t.name} className={`rounded-2xl p-4 flex flex-col items-center border ${t.won ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                <span className="text-3xl mb-1.5">{t.won ? t.emoji : '🔒'}</span>
                <span className="font-display font-bold text-slate-800 text-xs">{t.name}</span>
                <span className="text-[10px] text-slate-500 font-bold">{t.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-card-3d flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-black text-slate-800 text-base">Vocabulary Deck</h3>
              <p className="text-xs text-slate-400">Words saved for practice</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-theme-light text-theme-main font-black text-xs">{saved.length} Words</span>
          </div>
          <div className="space-y-2.5 flex-1 max-h-72 overflow-y-auto">
            {saved.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                <i className="fa-solid fa-bookmark text-xl mb-1 text-slate-300"></i>
                <p>No saved words yet.</p>
                <p className="text-theme-main mt-0.5">Tap words while reading to save them!</p>
              </div>
            )}
            {saved.slice(0, 12).map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-display font-black text-slate-800 text-sm">{item.word}</span>
                  <p className="text-xs text-slate-600 line-clamp-1">{item.meaning}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === 'learned' ? 'bg-emerald-100 text-emerald-800' : 'bg-theme-light text-theme-main'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => setDeckOpen(true)} className="mt-4 w-full py-3 bg-theme-main text-white font-display font-black text-sm rounded-2xl active:scale-95 transition">
            Open Full Deck
          </button>
        </div>
      </div>

      {/* Manual-only reset */}
      <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-card-3d">
        <h3 className="font-display font-black text-sm text-slate-700">Scores control</h3>
        <p className="text-xs text-slate-400 mb-3">Scores survive refresh and app restarts. They reset ONLY here, manually, with double-tap confirm.</p>
        <button onClick={doReset} className={'w-full py-3 font-display font-black text-sm rounded-2xl transition active:scale-95 ' + (confirmReset ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-50 text-rose-700 border border-rose-200')}>
          {confirmReset ? '⚠ TAP AGAIN TO WIPE EVERYTHING' : 'Reset all scores & rates'}
        </button>
      </div>

      {deckOpen && (
        <div className="fixed inset-0 z-50 flex justify-center">
          <div className="w-full md:max-w-md relative">
            <DeckHost saved={saved} onClose={() => setDeckOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function DeckHost({ saved, onClose }) {
  const [tab, setTab] = useState('study');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const list = saved.length > 0 ? saved : [];
  const item = list[idx % Math.max(1, list.length)];

  const quizPool = saved.length > 0 ? saved : [];
  const qc = quizPool[quizIdx % Math.max(1, quizPool.length)];
  const qOpts = qc
    ? (() => {
        const others = quizPool.filter((v) => v.word !== qc.word).slice(0, 2).map((v) => v.word);
        while (others.length < 2) others.push(['sun', 'book'][others.length]);
        const arr = [qc.word, ...others];
        return arr.sort(() => 0.5 - Math.random());
      })()
    : [];

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col justify-end">
      <div className="bg-[#fafafa] rounded-t-3xl h-[88%] flex flex-col overflow-hidden shadow-2xl">
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-base">Vocabulary Deck</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="flex px-4 pt-3 bg-white border-b border-slate-200 space-x-4">
          {[['study', `Flashcards (${saved.length})`], ['quiz', 'Word Quiz'], ['list', 'Word Bank']].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={'pb-2.5 font-bold text-xs border-b-2 ' + (tab === k ? 'border-ewa-blue text-ewa-darkBlue' : 'border-transparent text-slate-400')}>
              {label}
            </button>
          ))}
        </div>
        {tab === 'study' && (
          <div className="flex-1 p-5 flex flex-col items-center justify-center">
            {!item ? (
              <p className="text-xs font-bold text-slate-400">Save words while reading first!</p>
            ) : (
              <div onClick={() => setFlipped(!flipped)} className="w-full max-w-[310px] min-h-[350px] bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col p-5 text-center cursor-pointer justify-between">
                <div className="flex justify-between text-xs text-slate-400"><span>Card {(idx % list.length) + 1} of {list.length}</span></div>
                <div className="my-auto">
                  <h2 className="font-black text-3xl text-slate-800">{item.word}</h2>
                  <p className="text-xs text-slate-400 font-mono">{item.ipa}</p>
                  {flipped && (
                    <div className="text-left space-y-2 mt-3">
                      <div className="bg-sky-50 rounded-xl p-2.5 text-xs font-semibold text-slate-700">{item.meaning}</div>
                      <div className="bg-slate-50 rounded-xl p-2.5 text-xs italic text-slate-600">{item.sentence}</div>
                    </div>
                  )}
                  {!flipped && <p className="text-[11px] text-slate-400 mt-4">Tap card to flip</p>}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button onClick={(e) => { e.stopPropagation(); setFlipped(false); setIdx(idx + 1); }} className="py-2 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs">Need Practice</button>
                  <button onClick={(e) => { e.stopPropagation(); setFlipped(false); setIdx(idx + 1); }} className="py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">I Know It!</button>
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'quiz' && (
          <div className="flex-1 p-5 flex flex-col items-center justify-center">
            {!qc ? (
              <p className="text-xs font-bold text-slate-400">Save words while reading first!</p>
            ) : (
              <div className="w-full max-w-[310px] bg-white rounded-3xl shadow-xl border border-slate-200 p-5">
                <p className="text-sm font-bold text-slate-800 mb-4 text-center">Which word means: &quot;{qc.meaning}&quot;?</p>
                <div className="space-y-2 mb-3">
                  {qOpts.map((ch) => (
                    <button key={ch} onClick={() => setPicked(ch)} className={'w-full py-2.5 px-4 font-bold text-xs rounded-xl border text-left ' + (picked === ch ? (ch === qc.word ? 'bg-emerald-100 border-emerald-300' : 'bg-rose-50 border-rose-300') : 'bg-slate-50 border-slate-200')}>
                      {ch}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setQuizIdx(quizIdx + 1); setPicked(null); }} className="w-full py-2 bg-ewa-blue text-white font-bold text-xs rounded-xl">Next</button>
              </div>
            )}
          </div>
        )}
        {tab === 'list' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {saved.map((it, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-800 text-sm">{it.word}</span>
                  <p className="text-xs text-slate-600 line-clamp-1">{it.meaning}</p>
                </div>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">{it.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
