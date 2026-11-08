import React, { useState, useEffect } from 'react';
import { LuPlay, LuRotateCcw, LuCheck, LuArrowRight, LuArrowLeft, LuLightbulb, LuBookOpen, LuVolume2, LuSparkles, LuGraduationCap } from 'react-icons/lu';
import { speak, stopSpeaking } from '../lib/speech.js';
import { useStore } from '../store/store.js';
import { confetti } from './ui.jsx';
import { sfx } from './sfx.js';

// Visual aid for math operations and vocab
function VisualAid({ visual }) {
  if (!visual) return null;

  if (visual.type === 'subtraction') {
    const { total, take, remain, emoji } = visual;
    const em = emoji || '🍎';
    const items = Array.from({ length: total }, (_, i) => i < remain);
    return (
      <div className="card" style={{ background: 'var(--bg, #f8f9fa)', border: '1px solid var(--border)', padding: '14px', borderRadius: 14 }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 8 }}>
          👀 Visual Counter ({total} − {take} = {remain}):
        </div>
        <div className="row wrap gap8" style={{ alignItems: 'center' }}>
          {items.map((isRemain, idx) => (
            <div
              key={idx}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                background: isRemain ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                border: isRemain ? '2px solid #10b981' : '2px dashed #ef4444',
                position: 'relative',
                opacity: isRemain ? 1 : 0.45,
              }}
              title={isRemain ? 'Kept' : 'Taken away'}
            >
              <span>{em}</span>
              {!isRemain && (
                <div style={{ position: 'absolute', width: '100%', height: 2, background: '#ef4444', transform: 'rotate(45deg)' }} />
              )}
            </div>
          ))}
        </div>
        <div className="row wrap gap12" style={{ marginTop: 10, fontSize: '0.85rem' }}>
          <span style={{ color: '#10b981', fontWeight: 700 }}>🟢 Remaining: {remain}</span>
          <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ Taken away: {take}</span>
        </div>
      </div>
    );
  }

  if (visual.type === 'division') {
    const { total, groups, perGroup, emoji } = visual;
    const em = emoji || '🍪';
    return (
      <div className="card" style={{ background: 'var(--bg, #f8f9fa)', border: '1px solid var(--border)', padding: '14px', borderRadius: 14 }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 8 }}>
          👀 Equal Sharing Groups ({total} ÷ {groups} = {perGroup}):
        </div>
        <div className="row wrap gap12">
          {Array.from({ length: groups }, (_, gIdx) => (
            <div
              key={gIdx}
              style={{
                border: '2px solid var(--primary)',
                background: 'rgba(59, 130, 246, 0.08)',
                borderRadius: 12,
                padding: '8px 12px',
                minWidth: 70,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                Group {gIdx + 1}
              </div>
              <div className="row wrap gap4" style={{ justifyContent: 'center' }}>
                {Array.from({ length: perGroup }, (_, pIdx) => (
                  <span key={pIdx} style={{ fontSize: '1.2rem' }}>{em}</span>
                ))}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: 4 }}>{perGroup}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual.type === 'array') {
    const { rows, cols, total, emoji } = visual;
    const em = emoji || '⭐';
    return (
      <div className="card" style={{ background: 'var(--bg, #f8f9fa)', border: '1px solid var(--border)', padding: '14px', borderRadius: 14 }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 8 }}>
          👀 Multiplication Array ({rows} rows × {cols} columns = {total}):
        </div>
        <div className="col gap4" style={{ display: 'inline-block' }}>
          {Array.from({ length: rows }, (_, rIdx) => (
            <div key={rIdx} className="row gap4" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', width: 44, fontWeight: 600 }}>
                Row {rIdx + 1}:
              </span>
              {Array.from({ length: cols }, (_, cIdx) => (
                <span key={cIdx} style={{ fontSize: '1.2rem' }}>{em}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual.type === 'addition') {
    const { a, b, total, emoji } = visual;
    const em = emoji || '🍎';
    return (
      <div className="card" style={{ background: 'var(--bg, #f8f9fa)', border: '1px solid var(--border)', padding: '14px', borderRadius: 14 }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 8 }}>
          👀 Joining Groups ({a} + {b} = {total}):
        </div>
        <div className="row wrap gap12" style={{ alignItems: 'center' }}>
          <div className="row wrap gap4" style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '6px 10px', borderRadius: 10 }}>
            {Array.from({ length: a }, (_, i) => <span key={i} style={{ fontSize: '1.2rem' }}>{em}</span>)}
            <b style={{ marginLeft: 6, alignSelf: 'center', color: '#2563eb' }}>{a}</b>
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>+</span>
          <div className="row wrap gap4" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '6px 10px', borderRadius: 10 }}>
            {Array.from({ length: b }, (_, i) => <span key={i} style={{ fontSize: '1.2rem' }}>{em}</span>)}
            <b style={{ marginLeft: 6, alignSelf: 'center', color: '#059669' }}>{b}</b>
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>=</span>
          <b style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{total} total</b>
        </div>
      </div>
    );
  }

  if (visual.type === 'fraction') {
    const { num, denom } = visual;
    return (
      <div className="card" style={{ background: 'var(--bg, #f8f9fa)', border: '1px solid var(--border)', padding: '14px', borderRadius: 14 }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 8 }}>
          👀 Fraction Model ({num} out of {denom} parts):
        </div>
        <div className="row gap4" style={{ maxWidth: 280, height: 36, border: '2px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {Array.from({ length: denom }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i < num ? 'var(--primary)' : '#fff',
                borderRight: i < denom - 1 ? '1px solid var(--border)' : 'none',
              }}
              title={i < num ? 'Eaten / Selected' : 'Remaining'}
            />
          ))}
        </div>
        <div style={{ marginTop: 6, fontWeight: 700, fontSize: '0.9rem' }}>
          {num}/{denom} shaded
        </div>
      </div>
    );
  }

  if (visual.type === 'vocab') {
    const { word, pos, def, syn, ant, ex } = visual;
    return (
      <div className="card" style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '14px', borderRadius: 14 }}>
        <div className="row wrap gap8" style={{ alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>{word}</h3>
          <span className="pill" style={{ background: 'var(--primary)', color: '#fff' }}>{pos}</span>
        </div>
        <p style={{ margin: '6px 0', fontSize: '0.95rem' }}><b>Meaning:</b> {def}</p>
        {ex && <div className="muted tiny" style={{ fontStyle: 'italic', marginTop: 4 }}>Example: “{ex}”</div>}
      </div>
    );
  }

  return null;
}

export default function StudyLabRunner({ items, spec, onSwitchToExam, onExit }) {
  const { state } = useStore();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [mastered, setMastered] = useState({});
  const [finished, setFinished] = useState(false);

  const item = items[index];
  const isCorrect = selected != null && selected === item.answer;

  useEffect(() => {
    setSelected(null);
    setShowHint(false);
    setShowSteps(false);
    stopSpeaking();
  }, [index]);

  const handleSelect = (idx) => {
    setSelected(idx);
    if (idx === item.answer) {
      if (!mastered[index]) {
        setMastered((prev) => ({ ...prev, [index]: true }));
        confetti();
        state.settings.sounds && sfx.ok();
      }
      setShowSteps(true);
    } else {
      state.settings.sounds && sfx.bad();
    }
  };

  const handleReadAloud = () => {
    if (!item) return;
    const txt = `${item.q}. Choices are: ${item.options.join(', ')}.`;
    speak(txt, { rate: state.settings.rate });
  };

  const handleNext = () => {
    if (index + 1 < items.length) {
      setIndex(index + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="card col" style={{ alignItems: 'center', textAlign: 'center', padding: 32 }}>
        <span style={{ fontSize: '3rem' }}>🤔</span>
        <h2>No questions match these specifications</h2>
        <button className="btn pri" onClick={onExit}>Change Specifications</button>
      </div>
    );
  }

  if (finished) {
    const masteredCount = Object.keys(mastered).length;
    return (
      <div className="card col gap16" style={{ alignItems: 'center', textAlign: 'center', padding: '36px 20px', maxWidth: 540, margin: '0 auto' }}>
        <span style={{ fontSize: '4rem' }}>🌟</span>
        <h1 style={{ margin: 0 }}>Study Session Complete!</h1>
        <p className="muted" style={{ fontSize: '1.05rem', margin: 0 }}>
          You explored <b>{items.length} problems</b> with step-by-step guidance and mastered <b>{masteredCount}</b>!
        </p>

        <div className="row wrap gap12" style={{ justifyContent: 'center', marginTop: 12 }}>
          <button
            className="btn pri"
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setFinished(false);
            }}
          >
            <LuRotateCcw /> Practice Again
          </button>
          {onSwitchToExam && (
            <button className="btn soft" onClick={onSwitchToExam}>
              <LuGraduationCap /> Test Yourself in Exam Mode
            </button>
          )}
          <button className="btn ghost" onClick={onExit}>
            Back to Specifications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="col gap16" style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Top Header */}
      <div className="card row wrap gap12" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px' }}>
        <div className="row gap8" style={{ alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>🔬</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Study Lab</div>
            <div className="tiny muted">
              Problem {index + 1} of {items.length} · {Object.keys(mastered).length} Mastered ⭐
            </div>
          </div>
        </div>
        <div className="row gap8">
          <button className="btn ghost sm" onClick={handleReadAloud} title="Read question aloud">
            <LuVolume2 /> Hear Problem
          </button>
          <button className="btn ghost sm" onClick={onExit}>
            Exit Lab
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="card col gap16">
        <div className="row wrap gap8" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="pill" style={{ background: 'var(--primary)', color: '#fff', fontWeight: 700 }}>
            {item.subject === 'math' ? `Math · ${item.operation?.toUpperCase()}` : item.subject?.toUpperCase()}
          </span>
          {mastered[index] && (
            <span className="pill ok" style={{ fontWeight: 700 }}>
              <LuSparkles /> Mastered (+1 Star)
            </span>
          )}
        </div>

        <h2 style={{ fontSize: '1.35rem', margin: '4px 0', lineHeight: 1.4 }}>{item.q}</h2>

        {/* Visual Aid component */}
        {item.visual && <VisualAid visual={item.visual} />}

        {/* Multiple Choice Options */}
        <div className="col gap8" style={{ marginTop: 8 }}>
          {item.options.map((opt, optIdx) => {
            let btnStyle = { textAlign: 'left', padding: '12px 18px', fontSize: '1.05rem', fontWeight: 600, borderRadius: 12 };
            let extraClass = 'btn ghost';

            if (selected === optIdx) {
              if (optIdx === item.answer) {
                extraClass = 'btn pri';
                btnStyle = { ...btnStyle, background: '#10b981', color: '#fff', borderColor: '#10b981' };
              } else {
                extraClass = 'btn soft';
                btnStyle = { ...btnStyle, background: '#fee2e2', color: '#b91c1c', borderColor: '#fca5a5' };
              }
            } else if (selected != null && optIdx === item.answer && showSteps) {
              btnStyle = { ...btnStyle, border: '2px solid #10b981', color: '#10b981' };
            }

            return (
              <button
                key={optIdx}
                className={extraClass}
                style={btnStyle}
                onClick={() => handleSelect(optIdx)}
              >
                <div className="row gap8" style={{ alignItems: 'center' }}>
                  <span style={{ opacity: 0.6 }}>{String.fromCharCode(65 + optIdx)}.</span>
                  <span className="grow">{opt}</span>
                  {selected === optIdx && optIdx === item.answer && <LuCheck size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Note */}
        {selected != null && (
          <div
            className="card"
            style={{
              background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${isCorrect ? '#10b981' : '#f87171'}`,
              padding: '12px 16px',
              borderRadius: 12,
            }}
          >
            {isCorrect ? (
              <div style={{ color: '#047857', fontWeight: 700 }}>
                🎉 Excellent! You solved it correctly! Review the steps below.
              </div>
            ) : (
              <div style={{ color: '#b91c1c', fontWeight: 600 }}>
                💡 Good try! Review the visual model above, check the hint, and tap your new answer!
              </div>
            )}
          </div>
        )}

        {/* Hint Accordion */}
        {item.hint && (
          <div className="col gap8">
            <button
              className="btn ghost sm"
              style={{ alignSelf: 'flex-start', color: '#d97706', fontWeight: 700 }}
              onClick={() => setShowHint(!showHint)}
            >
              <LuLightbulb /> {showHint ? 'Hide Hint' : 'Show Strategy Hint'}
            </button>
            {showHint && (
              <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 14px', borderRadius: 10, color: '#92400e', fontSize: '0.95rem' }}>
                <b>Hint:</b> {item.hint}
              </div>
            )}
          </div>
        )}

        {/* Step-by-Step Breakdown */}
        <div className="col gap8">
          <button
            className="btn ghost sm"
            style={{ alignSelf: 'flex-start', color: 'var(--primary)', fontWeight: 700 }}
            onClick={() => setShowSteps(!showSteps)}
          >
            <LuBookOpen /> {showSteps ? 'Hide Step-by-Step Solution' : 'Show Step-by-Step Solution'}
          </button>
          {showSteps && (
            <div className="card col gap8" style={{ background: 'var(--bg, #f8f9fa)', border: '1px solid var(--border)', padding: '14px', borderRadius: 12 }}>
              <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                📖 Step-by-Step Walkthrough:
              </div>
              {item.steps && item.steps.length > 0 ? (
                item.steps.map((st, sIdx) => (
                  <div key={sIdx} className="row gap8" style={{ alignItems: 'flex-start', fontSize: '0.92rem' }}>
                    <span className="pill" style={{ padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {sIdx + 1}
                    </span>
                    <span className="grow">{st}</span>
                  </div>
                ))
              ) : (
                <p style={{ margin: 0 }}>{item.explain}</p>
              )}
              {item.explain && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4, fontWeight: 700, fontSize: '0.95rem' }}>
                  Result: {item.explain}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation bottom row */}
        <div className="row wrap gap8" style={{ justifyContent: 'space-between', marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <button className="btn ghost sm" disabled={index === 0} onClick={handlePrev}>
            <LuArrowLeft /> Previous
          </button>
          <button className="btn pri" onClick={handleNext}>
            {index + 1 < items.length ? (
              <>
                Next Problem <LuArrowRight />
              </>
            ) : (
              'Finish Session 🏆'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
