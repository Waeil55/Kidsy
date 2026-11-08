import React, { useState } from 'react';
import { LuPlay, LuGraduationCap, LuSparkles, LuRotateCcw, LuSlidersHorizontal } from 'react-icons/lu';
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

export default function CustomLab({ initialMode = 'study', initialOp = 'sub', onBack }) {
  const { state, dispatch } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const defaultMin = g.key === 'KG' ? 0 : 1;
  const defaultMax = g.key === 'KG' ? 10 : g.key === 'G1' ? 20 : 50;

  // Specifications state
  const [mode, setMode] = useState(initialMode); // 'study' | 'exam'
  const [operation, setOperation] = useState(g.key === 'KG' ? 'kg_counting' : initialOp);
  const [rangePreset, setRangePreset] = useState(`${defaultMin}-${defaultMax}`);
  const [minNum, setMinNum] = useState(defaultMin);
  const [maxNum, setMaxNum] = useState(defaultMax);
  const [table, setTable] = useState(0); // 0 = all / random, 1..12 = specific table
  const [levelMin, setLevelMin] = useState(1);
  const [levelMax, setLevelMax] = useState(Math.max(5, currentLevel(state, g.key)));
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

  // Quick 1-tap presets
  const handleQuickPreset = (p) => {
    if (p.op) setOperation(p.op);
    if (p.preset) applyPreset(p.preset);
    if (p.table !== undefined) setTable(p.table);
    if (p.mode) setMode(p.mode);
    if (p.count) setCount(p.count);
  };

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

  // Builder View
  return (
    <div className="col gap20">
      {/* Screen Title */}
      <div className="row wrap gap12" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="col">
          <div className="row gap8" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: '2rem' }}>🎛️</span>
            <h1>Custom Study & Exam Specifications</h1>
          </div>
          <p className="muted" style={{ margin: '4px 0 0 0' }}>
            Customize your learning: pick <b>subtraction only</b>, <b>division only</b>, exact number ranges, times tables, and grade levels!
          </p>
        </div>
        {onBack && (
          <button className="btn ghost sm" onClick={onBack}>
            Back
          </button>
        )}
      </div>

      {/* 1. Mode Switcher (Study vs Exam) */}
      <div className="card col gap12" style={{ borderLeft: '6px solid var(--primary)' }}>
        <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>1. Choose Mode: Study or Exam?</div>
        <div className="row wrap gap12">
          <button
            className={mode === 'study' ? 'btn pri grow' : 'btn ghost grow'}
            style={{ padding: '14px 20px', borderRadius: 14 }}
            onClick={() => setMode('study')}
          >
            <div className="row gap8" style={{ alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>🔬</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800 }}>Study Lab Mode</div>
                <div className="tiny" style={{ opacity: 0.85 }}>Hints, visual aids, audio read-aloud & steps</div>
              </div>
            </div>
          </button>

          <button
            className={mode === 'exam' ? 'btn pri grow' : 'btn ghost grow'}
            style={{ padding: '14px 20px', borderRadius: 14 }}
            onClick={() => setMode('exam')}
          >
            <div className="row gap8" style={{ alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>🎓</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800 }}>Exam Test Mode</div>
                <div className="tiny" style={{ opacity: 0.85 }}>Test questions, score grading & review</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Quick Presets */}
      <div className="card col gap12">
        <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>⚡ Quick 1-Tap Presets</div>
        <div className="row wrap gap8">
          <button className="btn soft sm" onClick={() => handleQuickPreset({ op: 'sub', preset: '1-20' })}>
            ➖ Subtraction Only (1–20)
          </button>
          <button className="btn soft sm" onClick={() => handleQuickPreset({ op: 'sub', preset: '10-100' })}>
            ➖ 2-Digit Subtraction (10–100)
          </button>
          <button className="btn soft sm" onClick={() => handleQuickPreset({ op: 'div', table: 0, preset: '1-50' })}>
            ➗ Division Facts (1–12)
          </button>
          <button className="btn soft sm" onClick={() => handleQuickPreset({ op: 'div', table: 7 })}>
            ➗ Table of 7 Division
          </button>
          <button className="btn soft sm" onClick={() => handleQuickPreset({ op: 'mul', table: 0 })}>
            ✖️ Times Tables (1–12)
          </button>
          <button className="btn soft sm" onClick={() => handleQuickPreset({ op: 'add', preset: '1-20' })}>
            ➕ Addition Within 20
          </button>
          <button className="btn soft sm" onClick={() => handleQuickPreset({ op: 'add', preset: '10-100' })}>
            ➕ Addition Within 100
          </button>
          {g.key === 'G3' && (
            <button className="btn soft sm" style={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 700 }} onClick={() => handleQuickPreset({ op: 'vocab', count: 25 })}>
              🏫 G3 School Vocab (25 Words)
            </button>
          )}
          <button className="btn soft sm" onClick={() => handleQuickPreset({ op: 'word_problems' })}>
            📖 Word Problems Only
          </button>
        </div>
      </div>

      {/* 3. Pick Specific Operation / Subject */}
      <div className="card col gap12">
        <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>2. Pick What to Practice (Operation or Subject)</div>
        <div className="grid g2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {ops.map((o) => {
            const isSel = operation === o.key;
            return (
              <button
                key={o.key}
                className={isSel ? 'tile t1' : 'tile t2'}
                style={{
                  border: isSel ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isSel ? 'rgba(59, 130, 246, 0.08)' : 'var(--card-bg, #fff)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => {
                  setOperation(o.key);
                  if (!['div', 'mul'].includes(o.key)) setTable(0);
                }}
              >
                <span className="ico">{o.emoji}</span>
                <b style={{ color: isSel ? 'var(--primary)' : 'inherit' }}>{o.label}</b>
                <span className="tiny muted">{o.blurb}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Number Range Specifications (When Math) */}
      {['sub', 'add', 'div', 'mixed_math', 'word_problems'].includes(operation) && (
        <div className="card col gap12">
          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>3. From What Number to What Number?</div>
          <div className="row wrap gap8">
            {['0-10', '1-20', '1-50', '10-100', '100-1000', 'custom'].map((p) => (
              <button
                key={p}
                className={rangePreset === p ? 'btn pri sm' : 'btn ghost sm'}
                onClick={() => applyPreset(p)}
              >
                {p === 'custom' ? 'Custom Range ⚙️' : p}
              </button>
            ))}
          </div>

          <div className="row wrap gap16" style={{ alignItems: 'center', marginTop: 6 }}>
            <label className="f" style={{ maxWidth: 160 }}>
              From (Min Number)
              <input
                type="number"
                min="0"
                max="999"
                value={minNum}
                onChange={(e) => {
                  setRangePreset('custom');
                  const next = Math.max(0, Math.min(999, Number(e.target.value) || 0));
                  setMinNum(next);
                  if (next >= maxNum) setMaxNum(next + 1);
                }}
              />
            </label>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: 16 }}>➔</span>
            <label className="f" style={{ maxWidth: 160 }}>
              To (Max Number)
              <input
                type="number"
                min={minNum + 1}
                max="1000"
                value={maxNum}
                onChange={(e) => {
                  setRangePreset('custom');
                  setMaxNum(Math.max(minNum + 1, Math.min(1000, Number(e.target.value) || minNum + 1)));
                }}
              />
            </label>
          </div>
          <span className="tiny muted">
            Use numbers from {minNum} to {maxNum}{operation === 'div' ? ' for the dividend' : ' in the problems'}.
          </span>
          {invalidDivisionRange && (
            <div className="tiny" role="alert" style={{ color: 'var(--bad, #b91c1c)', fontWeight: 700 }}>
              The {table} table has no dividend between {minNum} and {maxNum}. Choose a wider range or another table.
            </div>
          )}
        </div>
      )}

      {/* 5. Times Table / Division Table Selector (When Mul or Div) */}
      {['mul', 'div'].includes(operation) && (
        <div className="card col gap12">
          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
            3. Choose {operation === 'div' ? 'Division' : 'Multiplication'} Table
          </div>
          <div className="row wrap gap8">
            <button
              className={table === 0 ? 'btn pri sm' : 'btn ghost sm'}
              onClick={() => setTable(0)}
            >
              All Tables (1–12)
            </button>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((t) => (
              <button
                key={t}
                className={table === t ? 'btn pri sm' : 'btn ghost sm'}
                style={{ minWidth: 42 }}
                onClick={() => setTable(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="tiny muted">
            {table === 0
              ? 'Questions will cover all facts from 1 to 12.'
              : `Focusing exclusively on ${operation === 'div' ? 'dividing by' : 'multiplying with'} ${table}!`}
          </span>
        </div>
      )}

      {/* 6. Level Range & Question Count */}
      <div className="card col gap16">
        <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>4. Session Size & Level Range</div>
        <div className="row wrap gap16" style={{ alignItems: 'center' }}>
          <div>
            <div className="tiny" style={{ fontWeight: 700, marginBottom: 4 }}>How many questions?</div>
            <Seg
              value={count}
              onChange={setCount}
              options={[5, 10, 15, 20, 25, 30].map((n) => ({ key: n, label: `${n} Qs` }))}
            />
          </div>

          <div className="row wrap gap12">
            <label className="f" style={{ maxWidth: 220 }}>
              From level {levelMin}
              <input
                type="range"
                min="1"
                max={levelMax}
                value={levelMin}
                onChange={(e) => setLevelMin(+e.target.value)}
              />
            </label>
            <label className="f" style={{ maxWidth: 220 }}>
              To level {levelMax}
              <input
                type="range"
                min={levelMin}
                max="50"
                value={levelMax}
                onChange={(e) => setLevelMax(+e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 7. Big Launch Banner */}
      <div className="card row wrap gap12" style={{ justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(99,102,241,0.1) 100%)', border: '2px solid var(--primary)' }}>
        <div className="col">
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>
            Ready with your specifications!
          </h3>
          <p className="tiny muted" style={{ margin: '4px 0 0 0' }}>
            {mode === 'study' ? '🔬 Study Lab Mode with hints & visual aids' : '🎓 Exam Test Mode with score tracking'}
          </p>
        </div>

        <div className="row wrap gap8">
          <button
            className="btn pri"
            style={{ padding: '12px 24px', fontSize: '1.1rem', fontWeight: 800 }}
            disabled={invalidDivisionRange}
            onClick={() => startSession()}
          >
            {mode === 'study' ? <><LuSparkles /> Start Study Lab</> : <><LuPlay /> Start Custom Exam</>}
          </button>
        </div>
      </div>
    </div>
  );
}
