import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Sparkles, Volume2, VolumeX, Lightbulb, CheckCircle2, ArrowRight, RotateCcw, Timer, Trophy, Star } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { getGradeMathQuestions, getMathCategories } from '../data/mathMasterBank';
import { aiSpeak, stopAudio, playCorrect, playIncorrect, playPop, fireConfetti } from '../utils/audio';

export function MathLabSection({ onClose }) {
  const { child, complete } = useApp();
  const gradeKey = String(child.grade || '3').toUpperCase();

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMode, setActiveMode] = useState('trainer'); // 'trainer' | 'speed' | 'drill'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  // Speed Math Blitz State
  const [speedTimeLeft, setSpeedTimeLeft] = useState(60);
  const [isSpeedActive, setIsSpeedActive] = useState(false);
  const [speedScore, setSpeedScore] = useState(0);

  // Load questions for child's grade
  const questions = useMemo(() => {
    return getGradeMathQuestions(gradeKey, 500, activeCategory);
  }, [gradeKey, activeCategory]);

  const categories = useMemo(() => {
    return getMathCategories(gradeKey);
  }, [gradeKey]);

  const currentQ = questions[currentIdx % Math.max(1, questions.length)] || questions[0];

  // Speed timer countdown
  useEffect(() => {
    let timer = null;
    if (isSpeedActive && speedTimeLeft > 0) {
      timer = setInterval(() => {
        setSpeedTimeLeft(t => t - 1);
      }, 1000);
    } else if (speedTimeLeft === 0 && isSpeedActive) {
      setIsSpeedActive(false);
      fireConfetti(true);
      complete('math-speed-win', speedScore * 10, 3);
      aiSpeak(`Time's up! Awesome job! You scored ${speedScore} points in Grade ${gradeKey} math!`);
    }
    return () => clearInterval(timer);
  }, [isSpeedActive, speedTimeLeft, speedScore]);

  const handleSelectChoice = (idx) => {
    if (isAnswered) return;
    setSelectedChoice(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.answer;
    if (isCorrect) {
      playCorrect();
      setSolvedCount(prev => prev + 1);
      if (isSpeedActive) {
        setSpeedScore(prev => prev + 10);
      }
    } else {
      playIncorrect();
    }
  };

  const handleNext = () => {
    playPop();
    setCurrentIdx(prev => (prev + 1) % questions.length);
    setSelectedChoice(null);
    setIsAnswered(false);
    setShowHint(false);
  };

  const handleStartSpeedBlitz = () => {
    playPop();
    setSpeedScore(0);
    setSpeedTimeLeft(60);
    setIsSpeedActive(true);
    setCurrentIdx(Math.floor(Math.random() * questions.length));
    setSelectedChoice(null);
    setIsAnswered(false);
    aiSpeak("Starting 60 second Math Blitz! Go, champion!");
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
      borderRadius: '24px',
      padding: '20px',
      border: '1px solid #bbf7d0',
      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.08)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: '#dcfce7',
            color: '#15803d',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px'
          }}>
            🧮
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                Grade {gradeKey} Math Lab
              </h2>
              <span style={{
                background: '#16a34a',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '99px'
              }}>
                500 QUESTIONS
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Tailored specifically for Grade {gradeKey}. No mixing with other grades!
            </p>
          </div>
        </div>

        {/* Global Stop Voice & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              stopAudio();
              playPop();
            }}
            title="Stop AI Voice Speech"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fca5a5',
              borderRadius: '99px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <VolumeX size={14} /> Stop Voice ⏹️
          </button>

          <div style={{
            background: '#ffffff',
            padding: '6px 12px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            fontWeight: 800,
            color: '#0f172a'
          }}>
            Solved: <span style={{ color: '#16a34a' }}>{solvedCount}</span> / {questions.length}
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { id: 'trainer', label: '🎯 500 Question Trainer', desc: 'Step-by-step with hints' },
          { id: 'speed', label: '⚡ 60s Speed Blitz', desc: 'Fast timed drill' }
        ].map(m => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                playPop();
                setActiveMode(m.id);
                if (m.id === 'speed' && !isSpeedActive) {
                  handleStartSpeedBlitz();
                }
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '14px',
                border: isActive ? '2px solid #16a34a' : '1px solid #e2e8f0',
                background: isActive ? '#f0fdf4' : '#ffffff',
                color: isActive ? '#15803d' : '#475569',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800 }}>{m.label}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{m.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Category Filter Pills (Trainer Mode) */}
      {activeMode === 'trainer' && (
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                playPop();
                setActiveCategory(cat);
                setCurrentIdx(0);
                setSelectedChoice(null);
                setIsAnswered(false);
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '99px',
                border: activeCategory === cat ? '2px solid #16a34a' : '1px solid #cbd5e1',
                background: activeCategory === cat ? '#dcfce7' : '#ffffff',
                color: activeCategory === cat ? '#166534' : '#475569',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat === 'all' ? '🌟 All Math Topics' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Speed Blitz Timer Bar */}
      {activeMode === 'speed' && (
        <div style={{
          background: '#ecfdf5',
          borderRadius: '16px',
          padding: '12px 16px',
          marginBottom: '16px',
          border: '1px solid #a7f3d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 900, color: '#065f46' }}>
            <Timer size={20} color="#10b981" />
            <span>Time Left: {speedTimeLeft}s</span>
          </div>
          <div style={{ fontSize: '15px', fontWeight: 900, color: '#047857' }}>
            Score: ⭐ {speedScore}
          </div>
          {!isSpeedActive && (
            <button
              onClick={handleStartSpeedBlitz}
              style={{
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Restart Blitz 🔄
            </button>
          )}
        </div>
      )}

      {/* Main Question Card */}
      {currentQ && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
          position: 'relative'
        }}>
          {/* Tag & Counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{
              background: '#f1f5f9',
              color: '#334155',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '8px'
            }}>
              {currentQ.category} · Question {currentQ.number} of 500
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => aiSpeak(currentQ.prompt)}
                title="Listen with AI"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  border: 'none',
                  borderRadius: '99px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Volume2 size={13} /> Listen
              </button>

              {currentQ.hint && (
                <button
                  onClick={() => {
                    playPop();
                    setShowHint(prev => !prev);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#fef3c7',
                    color: '#b45309',
                    border: 'none',
                    borderRadius: '99px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Lightbulb size={13} /> {showHint ? 'Hide Hint' : 'Hint'}
                </button>
              )}
            </div>
          </div>

          {/* Prompt */}
          <div style={{
            fontSize: '17px',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.5,
            marginBottom: '16px',
            whiteSpace: 'pre-line'
          }}>
            {currentQ.prompt}
          </div>

          {/* Hint Drawer */}
          {showHint && currentQ.hint && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '14px',
              fontSize: '13px',
              color: '#92400e',
              fontWeight: 700
            }}>
              💡 Teacher Hint: {currentQ.hint}
            </div>
          )}

          {/* Choices Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            {currentQ.choices.map((choice, idx) => {
              const isSelected = selectedChoice === idx;
              const isCorrect = idx === currentQ.answer;

              let border = '2px solid #e2e8f0';
              let bg = '#ffffff';
              let color = '#1e293b';

              if (isAnswered) {
                if (isCorrect) {
                  border = '2px solid #16a34a';
                  bg = '#ecfdf5';
                  color = '#065f46';
                } else if (isSelected) {
                  border = '2px solid #ef4444';
                  bg = '#fef2f2';
                  color = '#991b1b';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectChoice(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px',
                    borderRadius: '14px',
                    border,
                    background: bg,
                    color,
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: isAnswered ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isSelected ? (isCorrect ? '#16a34a' : '#ef4444') : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                    flexShrink: 0
                  }}>
                    {['🦁', '🐸', '🦋', '🐙', '🦊', '🐬', '🐢', '🐝'][idx]}
                  </span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div style={{
              background: selectedChoice === currentQ.answer ? '#f0fdf4' : '#fef2f2',
              borderRadius: '12px',
              padding: '12px 14px',
              border: `1px solid ${selectedChoice === currentQ.answer ? '#bbf7d0' : '#fecaca'}`,
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: 700,
              color: selectedChoice === currentQ.answer ? '#166534' : '#991b1b'
            }}>
              {currentQ.explanation}
            </div>
          )}

          {/* Continue / Next Button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Next Math Question →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
