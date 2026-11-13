import React, { useMemo, useState } from 'react';
import { LuPlay, LuCheck } from 'react-icons/lu';
import { useStore, currentLevel, uid } from '../store/store.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { buildMaterialExam, examMaterials } from '../engine/examBuilder.js';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Bar, Seg } from '../ui/ui.jsx';
import { examLibrary, LIB_TABS } from '../engine/examlib.js';

const SIZES = [10, 20, 30, 50];
const RANGES = [[0, 10], [1, 20], [1, 50], [1, 100], [100, 1000]];
const memoryKey = (grade) => `kidsy_exam_pick_${grade}`;
const loadPick = (grade) => { try { return JSON.parse(localStorage.getItem(memoryKey(grade))) || null; } catch { return null; } };
const savePick = (grade, pick) => { try { localStorage.setItem(memoryKey(grade), JSON.stringify(pick)); } catch { /* storage unavailable */ } };

// Score per material (or subject, for library exams).
const breakdown = (log) => {
  const by = {};
  log.forEach((l) => { const s = l.item.material || l.item.subject || 'Other'; by[s] = by[s] || { c: 0, t: 0 }; by[s].t++; if (l.ok) by[s].c++; });
  return by;
};

export default function Exam() {
  const { state, dispatch } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const custom = useMemo(() => [...state.custom.qa, ...state.custom.math, ...state.custom.fill].filter((x) => x.grade === g.key), [state.custom, g.key]);
  const groups = useMemo(() => examMaterials(g.key, custom.length), [g.key, custom.length]);
  const allKeys = groups.flatMap((gr) => gr.items.map((m) => m.key));
  const saved = loadPick(g.key);

  const [tab, setTab] = useState('build');
  const [selected, setSelected] = useState(() => (saved?.selected || []).filter((k) => allKeys.includes(k)));
  const [size, setSize] = useState(saved?.size || 20);
  const [range, setRange] = useState(saved?.range || (g.key === 'KG' ? [0, 10] : [1, 20]));
  const [run, setRun] = useState(null);
  const [libTab, setLibTab] = useState('level');
  const lib = useMemo(() => examLibrary(g.key), [g.key]);

  const toggle = (key) => setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  const toggleGroup = (gr) => {
    const keys = gr.items.map((m) => m.key);
    const allOn = keys.every((k) => selected.includes(k));
    setSelected((s) => (allOn ? s.filter((k) => !keys.includes(k)) : [...new Set([...s, ...keys])]));
  };
  const hasMath = groups.some((gr) => gr.items.some((m) => m.math && m.key.startsWith('math:') && selected.includes(m.key)));
  const chosen = groups.flatMap((gr) => gr.items).filter((m) => selected.includes(m.key));

  const start = () => {
    savePick(g.key, { selected, size, range });
    const items = buildMaterialExam({ grade: g.key, selected, size, minNum: range[0], maxNum: range[1], maxLevel: Math.max(5, currentLevel(state, g.key)), custom });
    setRun({ items, name: chosen.map((m) => m.label).join(' + '), at: Date.now(), again: start });
  };
  const startLib = (ex) => setRun({ items: ex.build(), name: ex.name, at: Date.now(), again: () => startLib(ex) });
  const bestOf = (name) => state.exams.filter((x) => x.grade === g.key && x.name === name).reduce((m, x) => Math.max(m, x.pct), -1);

  if (run) {
    return (
      <div className="exam-run">
        <div className="row"><h1 className="grow exam-run-title">🎓 {run.name}</h1><button className="btn ghost sm" onClick={() => setRun(null)}>Quit</button></div>
        <QuizRunner key={run.at} items={run.items} grade={g.key} subject="exam" title="Exam"
          onFinish={(res) => dispatch({ type: 'exam', exam: { name: run.name, id: uid(), date: new Date().toISOString().slice(0, 10), grade: g.key, total: res.total, correct: res.correct, pct: res.pct, bySubject: breakdown(res.log) } })}
          renderFinish={(res) => (
            <div className="col" style={{ width: '100%', maxWidth: 480 }}>
              {Object.entries(breakdown(res.log)).map(([s, v]) => <div key={s}><div className="tiny" style={{ fontWeight: 800 }}>{s}: {v.c}/{v.t}</div><Bar pct={(v.c / v.t) * 100} /></div>)}
              <div className="row wrap" style={{ justifyContent: 'center', marginTop: 8 }}><button className="btn" onClick={run.again}>Try again</button><button className="btn ghost" onClick={() => setRun(null)}>Back to exams</button></div>
            </div>
          )} />
      </div>
    );
  }

  return (
    <>
      <div className="col"><h1>🎓 Exams</h1><p className="muted">Tick the material you want on the test, choose how many questions, and start.</p></div>
      <Seg value={tab} onChange={setTab} options={[{ key: 'build', label: '✅ Build my exam' }, { key: 'lib', label: `📚 Ready-made (${lib.length})` }]} />

      {tab === 'build' && (
        <>
          {groups.map((gr) => {
            const allOn = gr.items.every((m) => selected.includes(m.key));
            return (
              <section key={gr.title} className="card mat-group">
                <div className="row mat-head"><h3 className="grow">{gr.title}</h3><button className="btn ghost sm" onClick={() => toggleGroup(gr)}>{allOn ? 'Clear' : 'Select all'}</button></div>
                <div className="mat-list">
                  {gr.items.map((m) => {
                    const on = selected.includes(m.key);
                    return (
                      <button key={m.key} type="button" role="checkbox" aria-checked={on} className={`mat-item ${on ? 'on' : ''}`} onClick={() => toggle(m.key)}>
                        <span className="mat-box">{on && <LuCheck />}</span>
                        <span className="mat-label">{m.label}</span>
                        {m.note && <small>{m.note}</small>}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <section className="card col gap12">
            <div><h3>How many questions?</h3><Seg value={size} onChange={setSize} options={SIZES.map((n) => ({ key: n, label: n }))} /></div>
            {hasMath && <div><h3>Math numbers</h3><Seg value={range.join('-')} onChange={(v) => setRange(v.split('-').map(Number))} options={RANGES.map(([a, b]) => ({ key: `${a}-${b}`, label: `${a}–${b}` }))} /></div>}
          </section>

          <div className="exam-start">
            <span className="muted">{chosen.length ? `${size} questions · ${chosen.length} material${chosen.length > 1 ? 's' : ''}` : 'Tick at least one material'}</span>
            <button className="btn pri" disabled={!chosen.length} onClick={start}><LuPlay /> Start exam</button>
          </div>
        </>
      )}

      {tab === 'lib' && (
        <div className="card col">
          <Seg value={libTab} onChange={setLibTab} options={LIB_TABS.map(([k, l]) => ({ key: k, label: `${l} (${lib.filter((x) => x.tab === k).length})` }))} />
          <div className="examgrid">
            {lib.filter((x) => x.tab === libTab).map((ex, i) => {
              const b = bestOf(ex.name);
              return (
                <button key={ex.name} className={`examcard c${i % 5}`} onClick={() => startLib(ex)}>
                  <span className="em">{ex.emoji}</span><b>{ex.name}</b><small>{ex.size} questions · {ex.blurb}</small>
                  {b >= 0 ? <span className="pill ok">Best {b}%</span> : <span className="pill">New</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
