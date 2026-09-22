import React, { useMemo, useState } from 'react';
import { LuPlay, LuGraduationCap } from 'react-icons/lu';
import { useStore, currentLevel } from '../store/store.js';
import { GRADE_BY_KEY, chapterOf } from '../data/grades.js';
import { storiesInLevel } from '../engine/stories.js';
import { mathInLevel } from '../engine/math.js';
import { grammarQuiz } from '../engine/quizzes.js';
import { levelWords } from '../engine/wordbank.js';
import { vocabFor } from '../data/vocab.js';
import { SpeakBtn } from '../ui/ui.jsx';
import { ExplainBtn } from '../ui/Explainer.jsx';
import WordSheet from '../ui/WordSheet.jsx';
import { Link } from '../ui/router.js';

export default function Study() {
  const { state } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const [lv, setLv] = useState(currentLevel(state, g.key));
  const [open, setOpen] = useState(null);
  const words = useMemo(() => levelWords(g.key, lv), [g.key, lv]);
  const stories = useMemo(() => storiesInLevel(g.key, lv), [g.key, lv]);
  const math = useMemo(() => mathInLevel(g.key, lv).filter(Boolean).slice(0, 6), [g.key, lv]);
  const grammar = useMemo(() => grammarQuiz(g.key, 5, `study${lv}`), [g.key, lv]);
  const vocab = useMemo(() => vocabFor(g.key).slice(((lv - 1) * 3) % 30, ((lv - 1) * 3) % 30 + 4), [g.key, lv]);
  const book = state.wordbook || { learned: [], learning: [] };
  return (
    <>
      {open && <WordSheet word={open} grade={g.key} rate={state.settings.rate} onClose={() => setOpen(null)} />}
      <div className="col"><h1>📓 Study guides</h1><p className="muted">A study guide for every level: words to learn, story recaps, math tips and grammar rules. 50 guides for {g.label}.</p></div>
      <div className="lvgrid" role="tablist" aria-label="Choose a level">{Array.from({ length: 50 }, (_, i) => i + 1).map((n) => <button key={n} role="tab" aria-selected={n === lv} className={n === lv ? 'on' : ''} onClick={() => setLv(n)}>{n}</button>)}</div>
      <section className="hero"><span className="pill w">{chapterOf(g.key, lv)}</span><h1>Level {lv} guide</h1><div className="row wrap"><Link to={`/level/${lv}`} className="btn white sm"><LuPlay /> Play the level</Link><Link to="/exam" className="btn white sm"><LuGraduationCap /> Take the level {lv} test</Link></div></section>
      <div className="card"><h2>🔤 Words to learn</h2><p className="muted tiny">Tap a word to hear it, see meanings and examples, and practise it.</p>
        <div className="wordcloud" style={{ marginTop: 10 }}>{words.map((w) => <button key={w} className={`wchip ${book.learned.includes(w) ? 'learned' : book.learning.includes(w) ? 'learning' : ''}`} onClick={() => setOpen(w)}>{w}</button>)}</div>
        {vocab.length > 0 && <div className="col" style={{ marginTop: 12 }}>{vocab.map((v) => <div key={v.w} className="row wrap"><b>{v.w}</b><span className="pill">{v.pos}</span><span className="grow muted">{v.def}</span><SpeakBtn small text={`${v.w}. ${v.def}`} label="Hear it" /></div>)}</div>}
      </div>
      <div className="card"><h2>📖 Story recaps</h2>
        <div className="examgrid" style={{ marginTop: 10 }}>{stories.map((s, i) => <Link key={s.id} to={`/read/${g.key}/${s.n}`} className={`examcard c${i % 5}`} style={{ textDecoration: 'none' }}><span className="em">{s.emoji}</span><b>{s.title}</b><small>{s.kindLabel} · {s.wordCount} words</small></Link>)}</div>
      </div>
      <div className="card"><div className="row wrap" style={{ justifyContent: 'space-between' }}><h2>🔢 Math corner</h2><ExplainBtn topic="math" small /></div><p className="muted tiny">Tap a problem to see how to solve it.</p>
        <div className="col" style={{ marginTop: 10 }}>{math.map((m) => <details key={m.id} className="reveal"><summary>{m.q}</summary><p><b>Answer: {m.options[m.answer]}</b>{m.explain ? ` — ${m.explain}` : ''}</p></details>)}</div>
      </div>
      <div className="card"><div className="row wrap" style={{ justifyContent: 'space-between' }}><h2>✏️ Grammar power</h2><ExplainBtn topic="grammar" small /></div>
        <div className="col" style={{ marginTop: 10 }}>{grammar.map((q) => <details key={q.id} className="reveal"><summary>{q.q}</summary><p><b>Answer: {q.options[q.answer]}</b>{q.explain ? ` — ${q.explain}` : ''}</p></details>)}</div>
      </div>
    </>
  );
}
