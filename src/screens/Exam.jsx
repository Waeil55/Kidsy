import React, { useState } from 'react';
import { LuPlay } from 'react-icons/lu';
import { useStore, currentLevel, uid } from '../store/store.js';
import { GRADE_BY_KEY, SUBJECT_BY_KEY } from '../data/grades.js';
import { buildExam, EXAM_SUBJECTS, customToItems, g3PdfAll } from '../engine/quizzes.js';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Bar, Seg, Notice } from '../ui/ui.jsx';
import { Link } from '../ui/router.js';

export default function Exam() {
  const { state, dispatch } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const [size, setSize] = useState(20);
  const [subs, setSubs] = useState(['reading', 'math', 'vocab', 'grammar', 'fill']);
  const [maxLevel, setMaxLevel] = useState(Math.max(5, currentLevel(state, g.key)));
  const [run, setRun] = useState(null);
  const custom = customToItems([...state.custom.qa, ...state.custom.math, ...state.custom.fill].filter((x) => x.grade === g.key));
  const toggle = (k) => setSubs(subs.includes(k) ? subs.filter((x) => x !== k) : [...subs, k]);

  const start = (kind) => {
    const words = state.custom.words.filter((w) => w.grade === g.key).map((w) => ({ w: w.w, pos: w.pos || 'noun', def: w.def, syn: w.syn || [], ant: w.ant || [], ex: w.ex || '' }));
    const items = kind === 'g3pdf' ? g3PdfAll() : buildExam({ grade: g.key, size, subjects: subs, maxLevel, custom, extraWords: words });
    setRun({ items, kind, at: Date.now() });
  };

  if (run) {
    return (
      <>
        <div className="row"><h1 className="grow">🎓 {run.kind === 'g3pdf' ? 'Grade 3 PDF practice exam' : `${g.label} exam`}</h1><button className="btn ghost sm" onClick={() => setRun(null)}>Quit exam</button></div>
        <QuizRunner key={run.at} items={run.items} grade={g.key} subject="exam" title="Exam"
          onFinish={(res) => {
            const by = {};
            res.log.forEach((l) => { const s = l.item.subject || 'other'; by[s] = by[s] || { c: 0, t: 0 }; by[s].t++; if (l.ok) by[s].c++; });
            dispatch({ type: 'exam', exam: { id: uid(), date: new Date().toISOString().slice(0, 10), grade: g.key, total: res.total, correct: res.correct, pct: res.pct, bySubject: by } });
          }}
          renderFinish={(res) => {
            const by = {};
            res.log.forEach((l) => { const s = l.item.subject || 'other'; by[s] = by[s] || { c: 0, t: 0 }; by[s].t++; if (l.ok) by[s].c++; });
            return (
              <div className="col" style={{ width: '100%', maxWidth: 480 }}>
                {Object.entries(by).map(([s, v]) => <div key={s}><div className="tiny" style={{ fontWeight: 800 }}>{SUBJECT_BY_KEY[s]?.emoji} {SUBJECT_BY_KEY[s]?.label || s}: {v.c}/{v.t}</div><Bar pct={(v.c / v.t) * 100} /></div>)}
                <div className="row wrap" style={{ justifyContent: 'center', marginTop: 8 }}><button className="btn" onClick={() => start(run.kind)}>New exam</button><button className="btn ghost" onClick={() => setRun(null)}>Exam menu</button></div>
              </div>
            );
          }} />
      </>
    );
  }
  return (
    <>
      <div className="col"><h1>🎓 Exams</h1><p className="muted">A mixed test for {g.label}. Every answer still counts +1 or −1 toward your score, and each exam is saved in your history.</p></div>
      <div className="card col gap20">
        <div><h3>How many questions?</h3><Seg value={size} onChange={setSize} options={[10, 20, 30, 50].map((n) => ({ key: n, label: n }))} /></div>
        <div><h3>What is on the test?</h3>
          <div className="row wrap" style={{ marginTop: 8 }}>{EXAM_SUBJECTS.map((s) => <label key={s.key} className={`check ${subs.includes(s.key) ? '' : 'off'}`} style={{ padding: '8px 14px', cursor: 'pointer' }}><input type="checkbox" checked={subs.includes(s.key)} onChange={() => toggle(s.key)} disabled={s.key === 'custom' && !custom.length} /> {s.label}{s.key === 'custom' ? ` (${custom.length})` : ''}</label>)}</div></div>
        <label className="f" style={{ maxWidth: 260 }}>Use levels 1 to {maxLevel}<input type="range" min="1" max="50" value={maxLevel} onChange={(e) => setMaxLevel(+e.target.value)} /></label>
        <div className="row wrap"><button className="btn" disabled={!subs.length} onClick={() => start('mixed')}><LuPlay /> Start exam</button>
          {g.key === 'G3' && <button className="btn soft" onClick={() => start('g3pdf')}>📘 Grade 3 PDF practice exam (20)</button>}</div>
      </div>
      {!custom.length && <Notice>Want your own questions in the exam? Add some in the <Link to="/studio">Studio</Link> or <Link to="/upload">upload a lesson</Link>.</Notice>}
    </>
  );
}
