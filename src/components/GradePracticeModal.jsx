import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { getGradePracticeQuestions } from '../data/gradePracticeBank';
import { useApp } from '../store/AppContext';
import MarkerChip from './MarkerChip';
import { aiSpeak, stopAudio, playCorrect, playIncorrect, playPop } from '../utils/audio';
import { shuffleChoices } from '../lib/security';

export function GradePracticeModal({ onClose }) {
  const { child } = useApp();
  const gradeKey = String(child.grade || '3').toUpperCase();
  const questions = useMemo(() => getGradePracticeQuestions(gradeKey), [gradeKey]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [shuffled, setShuffled] = useState([]);
  const [finished, setFinished] = useState(false);

  const currentQ = questions[index];
  const total = questions.length;

  useEffect(() => {
    if (!currentQ) return;
    const { shuffledChoices, newAnswerIndex } = shuffleChoices(currentQ.choices, currentQ.answer);
    setShuffled(shuffledChoices);
    setCorrectIndex(newAnswerIndex);
    setSelected(null);
  }, [currentQ]);

  const speakQuestion = useCallback(() => {
    if (!currentQ) return;
    const text = `${currentQ.prompt}. Choices: ${currentQ.choices.join('. ')}`;
    aiSpeak(text);
  }, [currentQ]);

  useEffect(() => {
    const t = setTimeout(speakQuestion, 250);
    return () => clearTimeout(t);
  }, [speakQuestion]);

  const handleAnswer = (choiceIdx) => {
    if (selected !== null) return;
    setSelected(choiceIdx);
    if (choiceIdx === correctIndex) {
      playCorrect();
      const ns = streak + 1;
      setStreak(ns);
      if (ns > bestStreak) setBestStreak(ns);
      setScore(s => s + 1);
    } else {
      playIncorrect();
      setStreak(0);
    }
  };

  const next = () => {
    playPop();
    if (index + 1 >= total) {
      setFinished(true);
      fireConfetti();
      return;
    }
    setIndex(i => i + 1);
  };

  const close = () => {
    stopAudio();
    if (onClose) onClose();
  };

  const restart = () => {
    stopAudio();
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setFinished(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(15, 23, 42, 0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }} onClick={close}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px', maxHeight: '92vh', overflowY: 'auto',
          background: '#ffffff', borderRadius: '24px', padding: '22px',
          border: '1px solid #e2e8f0', boxShadow: '0 20px 50px rgba(15,23,42,0.35)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              color: '#fff', display: 'grid', placeItems: 'center', fontSize: '20px'
            }}>
              🎯
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                {finished ? 'Practice Complete!' : `Grade ${gradeKey} Practice Quest`}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                {total} unique questions · {score}/{total} correct · best streak {bestStreak} 🔥
              </div>
            </div>
          </div>
          <button onClick={close} style={{
            background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '8px',
            cursor: 'pointer', color: '#475569', display: 'grid', placeItems: 'center'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', marginBottom: '18px' }}>
          <div style={{
            height: '100%', width: `${finished ? 100 : (index / total) * 100}%`,
            background: 'linear-gradient(90deg, #8b5cf6, #f59e0b)', transition: 'width 0.3s'
          }} />
        </div>

        {finished ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '56px', lineHeight: 1 }}>🏆</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
              {score === total ? 'PERFECT! You are a word wizard!' : 'Quest complete!'}
            </div>
            <div style={{ fontSize: '16px', color: '#475569', fontWeight: 700, marginTop: '4px' }}>
              {score} out of {total} correct
            </div>
            {score >= total * 0.8 && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#b45309', fontWeight: 700 }}>
                ⭐ Amazing job — that is Grade-level mastery!
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px' }}>
              <button onClick={restart} style={{
                background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '12px',
                padding: '10px 18px', fontSize: '14px', fontWeight: 800, cursor: 'pointer'
              }}>
                🔁 Practice Again
              </button>
              <button onClick={close} style={{
                background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px',
                padding: '10px 18px', fontSize: '14px', fontWeight: 800, cursor: 'pointer'
              }}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Question */}
            <div style={{
              background: '#f8fafc', borderRadius: '16px', padding: '16px',
              border: '1px solid #e2e8f0', marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  background: '#ede9fe', color: '#6d28d9', fontSize: '11px', fontWeight: 800,
                  padding: '2px 8px', borderRadius: '99px', textTransform: 'uppercase'
                }}>
                  {currentQ.type === 'definition' ? 'Meaning' : currentQ.type === 'reverse' ? 'Word Match' : 'In Context'}
                </span>
                <button onClick={speakQuestion} title="Read question" style={{
                  background: '#e0e7ff', border: 'none', borderRadius: '8px', padding: '6px',
                  color: '#4f46e5', cursor: 'pointer', display: 'grid', placeItems: 'center'
                }}>
                  <Volume2 size={16} />
                </button>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', lineHeight: '1.45' }}>
                {currentQ.prompt}
              </div>
            </div>

            {/* Choices */}
            <div style={{ display: 'grid', gap: '10px' }}>
              {shuffled.map((choice, idx) => {
                let bg = '#ffffff';
                let border = '1px solid #cbd5e1';
                let color = '#1e293b';
                if (selected !== null) {
                  if (idx === correctIndex) { bg = '#dcfce7'; border = '2px solid #22c55e'; color = '#166534'; }
                  else if (idx === selected) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#991b1b'; }
                  else { bg = '#f8fafc'; border = '1px solid #e2e8f0'; color = '#94a3b8'; }
                }
                return (
                  <button
                    key={idx}
                    disabled={selected !== null}
                    onClick={() => handleAnswer(idx)}
                    style={{
                      textAlign: 'left', background: bg, border, borderRadius: '12px',
                      padding: '12px 14px', fontSize: '15px', fontWeight: 700, color, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px'
                    }}
                  >
                    <span style={{
                      width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
                      background: selected !== null && idx === correctIndex ? '#22c55e' : selected !== null && idx === selected ? '#ef4444' : '#e2e8f0',
                      color: selected !== null && (idx === correctIndex || idx === selected) ? '#fff' : '#64748b',
                      display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 900
                    }}>
                      {<MarkerChip idx={idx} selected={selected === idx} correct={selected !== null && idx === correctIndex} /> }
                    </span>
                    {choice}
                  </button>
                );
              })}
            </div>

            {/* Explanation + next */}
            {selected !== null && (
              <div style={{ marginTop: '14px' }}>
                <div style={{
                  background: selected === correctIndex ? '#f0fdf4' : '#fff7ed',
                  borderRadius: '12px', padding: '10px 12px', fontSize: '13px',
                  color: selected === correctIndex ? '#166534' : '#9a3412', fontWeight: 700,
                  border: selected === correctIndex ? '1px solid #bbf7d0' : '1px solid #fed7aa'
                }}>
                  {selected === correctIndex ? '✅ Correct!' : '💡 Not quite.'} {currentQ.explanation}
                </div>
                <button onClick={next} style={{
                  marginTop: '12px', width: '100%', background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  color: '#fff', border: 'none', borderRadius: '14px', padding: '13px', fontSize: '15px',
                  fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 18px rgba(139,92,246,0.35)'
                }}>
                  {index + 1 >= total ? 'Finish & See Score 🏆' : 'Next Question →'}
                </button>
              </div>
            )}

            {/* Stop voice */}
            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <button onClick={() => { stopAudio(); playPop(); }} title="Stop AI Voice Speech" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fee2e2',
                color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '99px',
                padding: '6px 12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer'
              }}>
                <VolumeX size={14} /> Stop Voice ⏹️
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}