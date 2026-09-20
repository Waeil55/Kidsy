import React, { useMemo, useRef, useState } from 'react';
import { genMath, smartQuizForStory, gradeName } from '../data/grades.js';
import { loadCustom } from '../lib/schoolParse.js';
import { playChime, speakText } from '../lib/sound.js';
import { micSupported, listenOnce, transcriptMatches } from '../lib/mic.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const KIND_EMOJI = { story: '📖', vocab: '🔤', math: '🔢', fill: '✏️', custom: '🏫' };
const KIND_BG = { story: 'bg-sky-50', vocab: 'bg-violet-50', math: 'bg-emerald-50', fill: 'bg-amber-50', custom: 'bg-rose-50' };

/* Build one smart round for the grade: mix of story quiz, vocab, math, fill, custom */
export function buildRound(gradeKey, story, saved, count = 5) {
  const c = loadCustom();
  const items = [];
  if (story) {
    smartQuizForStory(gradeKey, story, 2).forEach((q) =>
      items.push({ kind: 'story', emoji: '📖', q: q.q, options: q.options.map((t) => ({ name: t, emoji: '📖', iconBg: 'bg-sky-50' })), correct: q.correct })
    );
  }
  if (saved.length > 0) {
    const pickW = saved[Math.floor(Math.random() * saved.length)];
    if (pickW && pickW.meaning) {
      const others = shuffle(saved.filter((v) => v.word !== pickW.word)).slice(0, 3).map((v) => v.word);
      while (others.length < 3) others.push(['sun', 'book', 'tree'][others.length]);
      const names = shuffle([pickW.word, ...others]);
      items.push({
        kind: 'vocab',
        emoji: '🔤',
        q: `Which word means: "${pickW.meaning}"?`,
        audioText: `Which word means: ${pickW.meaning}?`,
        options: names.map((n) => ({ name: n, emoji: '🔤', iconBg: 'bg-violet-50' })),
        correct: names.indexOf(pickW.word),
      });
    }
  }
  c.qa.filter((x) => x.grade === gradeKey).slice(0, 2).forEach((x) =>
    items.push({ kind: 'custom', emoji: '🏫', q: x.q, options: x.options.map((t) => ({ name: t, emoji: '🏫', iconBg: 'bg-rose-50' })), correct: x.correct })
  );
  const mi = Math.floor(Math.random() * 500);
  const m = genMath(gradeKey, mi);
  items.push({
    kind: 'math',
    emoji: '🔢',
    q: m.q,
    audioText: m.q.replace(/×/g, 'times').replace(/÷/g, 'divided by').replace(/−/g, 'minus'),
    options: m.options.map((t) => ({ name: String(t), emoji: '🔢', iconBg: 'bg-emerald-50' })),
    correct: m.correct,
    explain: m.explain,
  });
  c.math.filter((x) => x.grade === gradeKey).slice(0, 1).forEach((x) =>
    items.push({ kind: 'math', emoji: '🔢', q: x.q, options: x.options.map((t) => ({ name: String(t), emoji: '🔢', iconBg: 'bg-emerald-50' })), correct: x.correct, explain: '' })
  );
  const fills = c.fills.filter((x) => x.grade === gradeKey);
  if (fills.length > 0) {
    const fl = fills[Math.floor(Math.random() * fills.length)];
    const distract = ['run', 'happy', 'quickly', 'blue'].filter((w) => w !== fl.answer).slice(0, 3);
    const names = shuffle([fl.answer, ...distract]);
    items.push({ kind: 'fill', emoji: '✏️', q: `Fill the blank: "${fl.sentence}"`, options: names.map((n) => ({ name: n, emoji: '✏️', iconBg: 'bg-amber-50' })), correct: names.indexOf(fl.answer) });
  } else if (story) {
    const words = [...new Set(story.paragraphs.join(' ').toLowerCase().replace(/[^a-z' ]/g, '').split(/\s+/).filter((w) => w.length > 3))];
    if (words.length > 0) {
      const w = words[Math.floor(Math.random() * words.length)];
      const sent = story.paragraphs.join(' ').split('.').find((s) => s.toLowerCase().includes(w)) || story.paragraphs[0];
      const blanked = sent.replace(new RegExp(w, 'i'), '___');
      const distract = shuffle(['sun', 'happy', 'quickly', 'blue'].filter((x) => x !== w)).slice(0, 3);
      const names = shuffle([w, ...distract]);
      items.push({ kind: 'fill', emoji: '✏️', q: `Fill the blank: "${blanked.trim()}"`, options: names.map((n) => ({ name: n, emoji: '✏️', iconBg: 'bg-amber-50' })), correct: names.indexOf(w) });
    }
  }
  return shuffle(items).slice(0, count);
}

export default function QuizPanel({ gradeKey, story, saved, notify, onAnswer, onRoundEnd }) {
  const [round, setRound] = useState(0);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);
  const [listening, setListening] = useState(false);
  const stopMic = useRef(null);

  const questions = useMemo(
    () => buildRound(gradeKey, story, saved, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gradeKey, story && story.id, round]
  );
  const q = questions[idx];

  if (!q) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-sm font-bold text-slate-500">
        No questions for this grade yet — add some in Studio!
      </div>
    );
  }

  const audioText = q.audioText || q.q;

  const choose = (i) => {
    if (picked !== null) return;
    playChime('pop');
    speakText(q.options[i].name);
    setPicked(i);
  };

  const hearAnswer = () => {
    if (!micSupported()) {
      notify('Mic not supported here — tap an answer instead 🎤');
      return;
    }
    if (listening) {
      stopMic.current && stopMic.current();
      setListening(false);
      return;
    }
    setListening(true);
    notify('Listening… say your answer out loud! 🎤');
    stopMic.current = listenOnce({
      onResult: (text) => {
        setListening(false);
        const hit = q.options.findIndex((o) => transcriptMatches(text, o.name));
        if (hit >= 0) {
          choose(hit);
          notify(`Heard you: "${text}" ✅`);
        } else {
          notify(`Heard: "${text}" — try again or tap! 🎤`);
        }
      },
      onError: () => {
        setListening(false);
        notify('Could not hear you — tap an answer instead 🎤');
      },
      onEnd: () => setListening(false),
    });
  };

  const next = () => {
    if (picked === null) {
      notify('Please tap an answer first!');
      return;
    }
    const ok = picked === q.correct;
    const newResults = [...results, ok];
    setResults(newResults);
    if (ok) {
      playChime('success');
      onAnswer(true, q.options[q.correct].name);
    } else {
      playChime('fail');
      onAnswer(false, q.options[q.correct].name);
    }
    setTimeout(() => {
      if (idx < questions.length - 1) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        const correct = newResults.filter(Boolean).length;
        onRoundEnd(correct, questions.length);
        setIdx(0);
        setPicked(null);
        setResults([]);
        setRound((r) => r + 1);
      }
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <button onClick={() => {}} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-600 hover:bg-slate-50 hidden">
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>
        <div className="flex flex-col items-center mx-auto">
          <span className="text-xs font-display font-black text-slate-700">{idx + 1} / {questions.length} Q</span>
          <div className="flex space-x-1.5 mt-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-4 h-1 rounded-full transition ${i === idx ? 'bg-theme-main' : i < idx ? (results[i] ? 'bg-emerald-400' : 'bg-rose-400') : 'bg-slate-200'}`}></div>
            ))}
          </div>
        </div>
        <button onClick={() => speakText(audioText)} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-theme-main hover:bg-slate-50">
          <i className="fa-solid fa-volume-high text-sm"></i>
        </button>
      </div>

      <div className="rounded-3xl h-48 md:h-56 w-full bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 border-2 border-white shadow-card-3d overflow-hidden relative shrink-0 flex items-end justify-center">
        <svg className="w-full h-full" viewBox="0 0 360 180" fill="none">
          <ellipse cx="60" cy="40" rx="30" ry="14" fill="#ffffff" opacity="0.8" />
          <ellipse cx="280" cy="50" rx="40" ry="16" fill="#ffffff" opacity="0.8" />
          <circle cx="180" cy="30" r="16" fill="#fef08a" opacity="0.9" />
          <path d="M-20 150 Q70 100 180 135 T380 120 L380 180 L-20 180 Z" fill="#86efac" />
          <path d="M-20 160 Q100 130 240 155 T380 145 L380 180 L-20 180 Z" fill="#4ade80" />
          <rect x="36" y="105" width="8" height="35" rx="4" fill="#854d0e" />
          <circle cx="40" cy="95" r="22" fill="#15803d" />
          <circle cx="28" cy="100" r="16" fill="#16a34a" />
          <circle cx="52" cy="100" r="16" fill="#16a34a" />
          <rect x="315" y="95" width="10" height="45" rx="4" fill="#854d0e" />
          <circle cx="320" cy="85" r="24" fill="#15803d" />
          <circle cx="305" cy="92" r="18" fill="#16a34a" />
          <circle cx="335" cy="92" r="18" fill="#16a34a" />
          <circle cx="90" cy="165" r="3" fill="#f43f5e" />
          <circle cx="160" cy="160" r="3" fill="#facc15" />
          <circle cx="230" cy="168" r="3" fill="#38bdf8" />
        </svg>
        <span className="absolute top-2 left-3 text-[10px] font-black uppercase tracking-wider text-emerald-900/70">{gradeName(gradeKey)} · your level only</span>
      </div>

      <div className="text-center shrink-0">
        <div className="flex items-center justify-center space-x-2.5">
          <h2 className="font-display font-black text-slate-800 text-xl md:text-2xl">{q.q}</h2>
          <button onClick={() => speakText(audioText)} className="w-9 h-9 rounded-full bg-theme-light text-theme-main flex items-center justify-center text-sm active:scale-90 shadow-sm shrink-0">
            <i className="fa-solid fa-volume-high"></i>
          </button>
          <button onClick={hearAnswer} title="Say your answer out loud" className={`w-9 h-9 rounded-full flex items-center justify-center text-sm active:scale-90 shadow-sm shrink-0 transition ${listening ? 'bg-rose-500 text-white animate-pulse' : 'bg-theme-light text-theme-main'}`}>
            <i className="fa-solid fa-microphone"></i>
          </button>
        </div>
        {listening && <p className="text-xs font-black text-rose-500 mt-1 animate-pulse">🎤 Listening… speak now!</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 flex-1 min-h-[140px]">
        {q.options.map((choice, i) => (
          <div
            key={i}
            onClick={() => choose(i)}
            className={`quiz-choice-card bg-white rounded-3xl p-4 border-2 shadow-card-3d cursor-pointer hover:scale-[1.02] transition flex flex-col items-center justify-between text-center relative ${picked === i ? 'border-theme-main bg-theme-light' : 'border-slate-100'}`}
          >
            <div className={`w-16 h-16 rounded-2xl ${choice.iconBg || 'bg-sky-50'} flex items-center justify-center text-4xl shadow-inner mb-2`}>
              {choice.emoji}
            </div>
            <span className="font-display font-black text-slate-800 text-base">{choice.name}</span>
            <div className={`selection-check absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs transition ${picked === i ? '' : 'opacity-0'}`}>
              <i className="fa-solid fa-check"></i>
            </div>
          </div>
        ))}
      </div>

      <button onClick={next} className="w-full py-4 bg-theme-main text-white font-display font-black text-base rounded-2xl shadow-xl hover:opacity-95 transition active:scale-95 shrink-0 flex items-center justify-center space-x-2">
        <span>{idx < questions.length - 1 ? 'Next Question' : 'Finish Round'}</span>
        <i className="fa-solid fa-arrow-right text-xs"></i>
      </button>
    </div>
  );
}
