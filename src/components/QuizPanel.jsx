import React, { useMemo, useState } from 'react';
import { genMath, smartQuizForStory, gradeName } from '../data/grades.js';
import { loadCustom } from '../lib/schoolParse.js';


function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Build one smart round for the grade: mix of story quiz, vocab, math, fill, custom */
export function buildRound(gradeKey, story, saved, count = 5) {
  const c = loadCustom();
  const items = [];
  if (story) {
    smartQuizForStory(gradeKey, story, 3).forEach((q) =>
      items.push({ kind: 'story', q: q.q, options: q.options, correct: q.correct })
    );
  }
  // vocab meaning -> word
  const vocabPool = saved.filter((v) => v.grade === gradeKey || !v.grade);
  const dictPool = saved.length > 0 ? saved : [];
  if (dictPool.length > 0) {
    const pick = dictPool[Math.floor(Math.random() * dictPool.length)];
    if (pick && pick.meaning) {
      const others = shuffle(dictPool.filter((v) => v.word !== pick.word)).slice(0, 2).map((v) => v.word);
      while (others.length < 2) others.push(['sun', 'book', 'tree', 'happy'][others.length]);
      const options = shuffle([pick.word, ...others]);
      items.push({ kind: 'vocab', q: `Which word means: "${pick.meaning}"?`, options, correct: options.indexOf(pick.word) });
    }
  }
  // custom Q&A for this grade
  c.qa.filter((x) => x.grade === gradeKey).slice(0, 2).forEach((x) =>
    items.push({ kind: 'custom', q: x.q, options: x.options, correct: x.correct })
  );
  // grade math
  const mi = Math.floor(Math.random() * 500);
  const m = genMath(gradeKey, mi);
  items.push({ kind: 'math', q: m.q, options: m.options.map(String), correct: m.correct, explain: m.explain });
  // custom math
  c.math.filter((x) => x.grade === gradeKey).slice(0, 1).forEach((x) =>
    items.push({ kind: 'math', q: x.q, options: x.options.map(String), correct: x.correct, explain: '' })
  );
  // fill-in
  const fills = c.fills.filter((x) => x.grade === gradeKey);
  if (fills.length > 0) {
    const fl = fills[Math.floor(Math.random() * fills.length)];
    const distract = ['run', 'happy', 'quickly', 'blue'].filter((w) => w !== fl.answer).slice(0, 2);
    const options = shuffle([fl.answer, ...distract]);
    items.push({ kind: 'fill', q: `Fill the blank: "${fl.sentence}"`, options, correct: options.indexOf(fl.answer) });
  } else {
    // generated fill from story words
    if (story) {
      const words = [...new Set(story.paragraphs.join(' ').toLowerCase().replace(/[^a-z' ]/g, '').split(/\s+/).filter((w) => w.length > 3))];
      if (words.length > 0) {
        const w = words[Math.floor(Math.random() * words.length)];
        const sent = story.paragraphs.join(' ').split('.').find((s) => s.toLowerCase().includes(w)) || story.paragraphs[0];
        const blanked = sent.replace(new RegExp(w, 'i'), '___');
        const distract = shuffle(['sun', 'happy', 'quickly', 'blue'].filter((x) => x !== w)).slice(0, 2);
        const options = shuffle([w, ...distract]);
        items.push({ kind: 'fill', q: `Fill the blank: "${blanked.trim()}"`, options, correct: options.indexOf(w) });
      }
    }
  }
  void vocabPool;
  return shuffle(items).slice(0, count);
}

const KIND_META = {
  story: { label: 'Story', icon: 'fa-book-open', bg: 'bg-sky-50' },
  vocab: { label: 'Words', icon: 'fa-spell-check', bg: 'bg-violet-50' },
  math: { label: 'Math', icon: 'fa-plus-minus', bg: 'bg-emerald-50' },
  fill: { label: 'Fill-in', icon: 'fa-pen', bg: 'bg-amber-50' },
  custom: { label: 'School', icon: 'fa-school', bg: 'bg-rose-50' },
};

export default function QuizPanel({ gradeKey, story, saved, onFinish, speak }) {
  const [round, setRound] = useState(0);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);

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

  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === q.correct;
    setResults((r) => [...r, ok]);
    if (ok) speak('Correct! Great job!');
  };

  const next = () => {
    if (picked === null) return;
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      const correct = results.filter(Boolean).length;
      onFinish({ total: questions.length, correct });
      setIdx(0);
      setPicked(null);
      setResults([]);
      setRound((r) => r + 1);
    }
  };

  const meta = KIND_META[q.kind] || KIND_META.story;

  return (
    <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${meta.bg} text-slate-700`}>
          <i className={`fa-solid ${meta.icon} mr-1`}></i> {meta.label} · {gradeName(gradeKey)}
        </span>
        <div className="flex flex-col items-center">
          <span className="text-xs font-display font-black text-slate-700">{idx + 1} / {questions.length} Q</span>
          <div className="flex space-x-1.5 mt-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-4 h-1 rounded-full transition ${i === idx ? 'bg-theme-main' : i < idx ? (results[i] ? 'bg-emerald-400' : 'bg-rose-400') : 'bg-slate-200'}`}></div>
            ))}
          </div>
        </div>
        <button onClick={() => speak(q.q)} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-theme-main hover:bg-slate-50">
          <i className="fa-solid fa-volume-high text-sm"></i>
        </button>
      </div>

      <div className="rounded-3xl p-5 w-full bg-gradient-to-b from-sky-200 via-sky-50 to-emerald-100 border-2 border-white shadow-card-3d text-center shrink-0">
        <span className="text-4xl">{q.kind === 'math' ? '🔢' : q.kind === 'vocab' ? '🔤' : q.kind === 'fill' ? '✏️' : '📖'}</span>
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mt-1">{q.kind === 'math' ? `${gradeName(gradeKey)} math — your level only` : 'Answer carefully'}</p>
      </div>

      <div className="text-center shrink-0">
        <div className="flex items-center justify-center space-x-2.5">
          <h2 className="font-display font-black text-slate-800 text-xl md:text-2xl">{q.q}</h2>
          <button onClick={() => speak(q.q)} className="w-9 h-9 rounded-full bg-theme-light text-theme-main flex items-center justify-center text-sm active:scale-90 shadow-sm shrink-0">
            <i className="fa-solid fa-volume-high"></i>
          </button>
        </div>
        {q.kind === 'math' && q.explain && picked !== null && (
          <p className="text-xs text-slate-500 font-semibold mt-1">{q.explain}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={'rounded-3xl p-4 border-2 shadow-card-3d cursor-pointer transition flex items-center space-x-3 text-left ' + (
              picked === null
                ? 'bg-white border-slate-100 hover:scale-[1.02]'
                : i === q.correct
                  ? 'bg-emerald-50 border-emerald-400'
                  : picked === i
                    ? 'bg-rose-50 border-rose-300'
                    : 'bg-white border-slate-100 opacity-70'
            )}
          >
            <span className="font-display font-black text-slate-800 text-base flex-1">{opt}</span>
            {picked !== null && i === q.correct && (
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0">
                <i className="fa-solid fa-check"></i>
              </span>
            )}
          </button>
        ))}
      </div>

      <button onClick={next} className={'w-full py-4 text-white font-display font-black text-base rounded-2xl shadow-xl transition active:scale-95 shrink-0 flex items-center justify-center space-x-2 ' + (picked === null ? 'bg-slate-300' : 'bg-theme-main hover:opacity-95')}>
        <span>{idx < questions.length - 1 ? 'Next Question' : 'Finish Round'}</span>
        <i className="fa-solid fa-arrow-right text-xs"></i>
      </button>
    </div>
  );
}
