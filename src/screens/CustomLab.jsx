import React, { useState } from 'react';
import { LuPlay, LuSparkles, LuRotateCcw } from 'react-icons/lu';
import { useStore, currentLevel, uid } from '../store/store.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { buildSpecifiedSession } from '../engine/specBuilder.js';
import StudyLabRunner from '../ui/StudyLabRunner.jsx';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Seg, Bar } from '../ui/ui.jsx';

export const OPERATIONS = [
  { key: 'sub', label: 'Subtraction (−)', emoji: '➖', domain: 'math', blurb: 'Practice subtraction facts, borrowing, or missing numbers' },
  { key: 'div', label: 'Division (÷)', emoji: '➗', domain: 'math', blurb: 'Division facts, specific tables, and equal sharing' },
  { key: 'add', label: 'Addition (+)', emoji: '➕', domain: 'math', blurb: 'Addition facts, double-digits, and regrouping' },
  { key: 'mul', label: 'Multiplication (×)', emoji: '✖️', domain: 'math', blurb: 'Times tables, arrays, and product facts' },
  { key: 'mixed_math', label: 'Mixed Math', emoji: '🔀', domain: 'math', blurb: 'Mix of +, −, ×, ÷ within chosen ranges' },
  { key: 'word_problems', label: 'Word Problems', emoji: '📖', domain: 'math', blurb: 'Real-world story problems' },
  { key: 'fractions', label: 'Fractions', emoji: '🍰', domain: 'math', blurb: 'Fraction models, unit fractions, and parts of a whole' },
  { key: 'vocab', label: 'Vocabulary', emoji: '🔤', domain: 'ela', blurb: 'Word definitions, synonyms, and antonyms' },
  { key: 'fill', label: 'Fill in the Blank', emoji: '🧩', domain: 'ela', blurb: 'Complete sentences with context words' },
  { key: 'grammar', label: 'Grammar', emoji: '✏️', domain: 'ela', blurb: 'Plurals, capitalization, and punctuation' },
];

export const KG_OPERATIONS = [
  { key: 'kg_letters', label: 'Alphabet & Phonics', emoji: '🔤', blurb: 'Letter recognition, sounds, and matching' },
  { key: 'kg_counting', label: 'Counting 1–10', emoji: '🔢', blurb: 'Count objects and identify quantities' },
  { key: 'sub', label: 'Subtraction within 10 (−)', emoji: '➖', blurb: 'Simple take-away within 10' },
  { key: 'add', label: 'Addition within 10 (+)', emoji: '➕', blurb: 'Simple combining within 10' },
  { key: 'kg_shapes', label: 'Shapes & Colors', emoji: '🎨', blurb: 'Recognize shapes and colors' },
];

export default function CustomLab({ initialMode = 'study', initialOp = 'auto', onBack, studyOnly = false }) {
  const { state, dispatch } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const defaultMin = g.key === 'KG' ? 0 : 1;
  const defaultMax = g.key === 'KG' ? 10 : g.key === 'G1' ? 20 : 50;

  // Specifications state
  const [mode, setMode] = useState(initialMode); // 'study' | 'exam'
  const [operation, setOperation] = useState(initialOp === 'auto' ? (g.key === 'KG' ? 'kg_counting' : 'sub') : initialOp);
  const [rangePreset, setRangePreset] = useState(`${defaultMin}-${defaultMax}`);
  const [minNum, setMinNum] = useState(defaultMin);
  const [maxNum, setMaxNum] = useState(defaultMax);
  const [table, setTable] = useState(0); // 0 = all / random, 1..12 = specific table
  const levelMin = 1;
  const levelMax = Math.max(5, currentLevel(state, g.key));
  const [count, setCount] = useState(10);
  const [running, setRunning] = useState(null); // { items, mode, title }

  // Adjust min/max when preset changes
  const applyPreset = (preset) => {
    setRangePreset(preset);
    if (preset === '0-10') { setMinNum(0); setMaxNum(10); }
    else if (preset === '1-20') { setMinNum(1); setMaxNum(20); }
    else if (preset === '1-50') { setMinNum(1); setMaxNum(50); }
    else if (preset === '10-100') { setMinNum(10); setMaxNum(100); }
    else if (preset === '100-1000') { setMinNum(100); setMaxNum(1000); }
  };

  const ops = g.key === 'KG' ? KG_OPERATIONS : OPERATIONS;
  const invalidDivisionRange = operation === 'div' && table > 0
    && Math.ceil(Math.max(1, minNum) / table) > Math.floor(maxNum / table);

  const startSession = (sessionMode = mode) => {
    if (invalidDivisionRange) return;
    const spec = {
      grade: g.key,
      operation: g.key === 'G3' && operation === 'vocab' ? 'g3_vocab' : operation,
      minNum,
      maxNum,
      table: +table || 0,
      levelMin: +levelMin || 1,
      levelMax: +levelMax || 50,
      count: +count || 10,
      seed: `custom-${Date.now()}`,
    };

    const items = buildSpecifiedSession(spec);
    const opObj = ops.find((o) => o.key === operation) || { label: operation };
    let titleDesc = opObj.label;
    if (['sub', 'add', 'div'].includes(operation)) titleDesc += ` (${spec.minNum} to ${spec.maxNum})`;
    if (['div', 'mul'].includes(operation) && spec.table > 0) titleDesc += ` (Table of ${spec.table})`;

    setRunning({
      items,
      mode: sessionMode,
      spec,
      title: `${sessionMode === 'exam' ? '🎓 Exam' : '🔬 Study'}: ${titleDesc}`,
    });
  };

  // If in active study session
  if (running && running.mode === 'study') {
    return (
      <StudyLabRunner
        items={running.items}
        spec={running.spec}
        onSwitchToExam={() => startSession('exam')}
        onExit={() => setRunning(null)}
      />
    );
  }

  // If in active exam session
  if (running && running.mode === 'exam') {
    return (
      <div className="col gap16" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="row wrap gap12" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{running.title}</h2>
          <div className="row gap8">
            <button className="btn soft sm" onClick={() => startSession('study')}>
              Switch to Study Mode 🔬
            </button>
            <button className="btn ghost sm" onClick={() => setRunning(null)}>
              Exit Exam
            </button>
          </div>
        </div>

        <QuizRunner
          items={running.items}
          grade={g.key}
          subject="exam"
          title={running.title}
          onFinish={(res) => {
            dispatch({
              type: 'exam',
              exam: {
                name: running.title,
                id: uid(),
                date: new Date().toISOString().slice(0, 10),
                grade: g.key,
                total: res.total,
                correct: res.correct,
                pct: res.pct,
                bySubject: { [operation]: { c: res.correct, t: res.total } },
              },
            });
          }}
          renderFinish={(res) => (
            <div className="col gap12" style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
              <div className="card col gap8" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '3rem' }}>{res.pct >= 80 ? '🎉' : '👏'}</span>
                <h3>{running.title} Result</h3>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: res.pct >= 70 ? '#10b981' : '#f59e0b' }}>
                  {res.pct}% ({res.correct}/{res.total})
                </div>
                <Bar pct={res.pct} />
              </div>
              <div className="row wrap gap8" style={{ justifyContent: 'center', marginTop: 8 }}>
                <button className="btn pri" onClick={() => startSession('exam')}>
                  <LuRotateCcw /> Take Another Exam
                </button>
                <button className="btn soft" onClick={() => startSession('study')}>
                  Study These in Lab 🔬
                </button>
                <button className="btn ghost" onClick={() => setRunning(null)}>
                  Change Specifications
                </button>
              </div>
            </div>
          )}
        />
      </div>
    );
  }

  // Builder view: four short steps and one start bar.
  // The icon already shows the sign, so "Subtraction (−)" is shown as "Subtraction".
  const shortLabel = (label) => label.replace(/ \([^)]*\)$/, '');
  const RANGE_OPTIONS = g.key === 'KG' ? ['0-10'] : ['0-10', '1-20', '1-50', '10-100', '100-1000'];
  const usesRange = ['sub', 'add', 'div', 'mixed_math', 'word_problems'].includes(operation);
  const usesTable = ['mul', 'div'].includes(operation);
  const current = ops.find((o) => o.key === operation) || ops[0];
  return (
    <div className="col gap16 lab">
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="col grow"><h1>🎛️ Custom practice</h1><p className="muted" style={{ margin: 0 }}>Choose exactly what to practise.</p></div>
        {onBack && <button className="btn ghost sm" onClick={onBack}>Back</button>}
      </div>

      <section className="card col gap12">
        <h3 className="lab-step"><span>1</span> What?</h3>
        <div className="mat-list">
          {ops.map((o) => (
            <button key={o.key} type="button" role="radio" aria-checked={operation === o.key} className={`mat-item ${operation === o.key ? 'on' : ''}`}
              onClick={() => { setOperation(o.key); if (!['div', 'mul'].includes(o.key)) setTable(0); }}>
              <span className="lab-emoji" aria-hidden="true">{o.emoji}</span>
              <span className="mat-label">{shortLabel(o.label)}</span>
            </button>
          ))}
        </div>
      </section>

      {usesRange && (
        <section className="card col gap12">
          <h3 className="lab-step"><span>2</span> Numbers</h3>
          <Seg value={rangePreset} onChange={(p) => (p === 'custom' ? setRangePreset('custom') : applyPreset(p))}
            options={[...RANGE_OPTIONS.map((p) => ({ key: p, label: p.replace('-', '–') })), { key: 'custom', label: 'Other' }]} />
          {rangePreset === 'custom' && (
            <div className="row gap12" style={{ alignItems: 'flex-end' }}>
              <label className="f" style={{ maxWidth: 130 }}>From
                <input type="number" min="0" max="999" value={minNum} onChange={(e) => { const n = Math.max(0, Math.min(999, Number(e.target.value) || 0)); setMinNum(n); if (n >= maxNum) setMaxNum(n + 1); }} />
              </label>
              <label className="f" style={{ maxWidth: 130 }}>To
                <input type="number" min={minNum + 1} max="1000" value={maxNum} onChange={(e) => setMaxNum(Math.max(minNum + 1, Math.min(1000, Number(e.target.value) || minNum + 1)))} />
              </label>
            </div>
          )}
          {invalidDivisionRange && <div className="tiny" role="alert" style={{ color: 'var(--bad, #b91c1c)', fontWeight: 700 }}>The {table} table has no number between {minNum} and {maxNum}. Pick a wider range or another table.</div>}
        </section>
      )}

      {usesTable && (
        <section className="card col gap12">
          <h3 className="lab-step"><span>{usesRange ? 3 : 2}</span> Times table</h3>
          <Seg value={table} onChange={setTable} options={[{ key: 0, label: 'All' }, ...Array.from({ length: 12 }, (_, i) => ({ key: i + 1, label: String(i + 1) }))]} />
        </section>
      )}

      <section className="card col gap12">
        <h3 className="lab-step"><span>{1 + 1 + (usesRange ? 1 : 0) + (usesTable ? 1 : 0)}</span> How many questions?</h3>
        <Seg value={count} onChange={setCount} options={[5, 10, 20, 30].map((n) => ({ key: n, label: String(n) }))} />
      </section>

      <div className="exam-start">
        <span className="muted">{count} × {shortLabel(current.label)}{usesTable && table ? ` · table of ${table}` : ''}{usesRange ? ` · ${minNum}–${maxNum}` : ''}</span>
        <button className="btn pri" disabled={invalidDivisionRange} onClick={() => startSession()}>
          {mode === 'study' ? <><LuSparkles /> Start</> : <><LuPlay /> Start exam</>}
        </button>
      </div>
    </div>
  );
}
