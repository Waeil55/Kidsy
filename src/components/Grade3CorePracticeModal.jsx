import React, { useState, useMemo } from 'react';
import { X, Volume2, VolumeX, Sparkles, CheckCircle2, ArrowRight, Lightbulb, Trophy } from 'lucide-react';
import { getGrade3Core500Questions } from '../data/grade3Core500Bank';
import { aiSpeak, stopAudio, playCorrect, playIncorrect, playPop, fireConfetti } from '../utils/audio';
import { OPTION_MARKERS } from '../lib/optionMarkers';
import { shuffleChoices } from '../lib/security';

export function Grade3CorePracticeModal({ onClose }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const categories = [
    { id: 'all', label: '🌟 All 500 Practice Qs' },
    { id: 'Word Definitions', label: '📖 Definitions' },
    { id: 'Sentence Context', label: '📝 Sentence Fill-in' },
    { id: 'Synonym Mastery', label: '✨ Synonyms' },
    { id: 'Antonym Mastery', label: '🔄 Antonyms' },
    { id: 'Story Comprehension', label: '📚 Stories' },
    { id: 'Real-Life Dialogue', label: '💬 Dialogues' },
    { id: 'Critical Thinking', label: '🧠 True / False' }
  ];

  const questions = useMemo(() => {
    return getGrade3Core500Questions(activeCategory, 500);
  }, [activeCategory]);

  const currentQ = questions[currentIdx % Math.max(1, questions.length)] || questions[0];

  const shuffled = useMemo(() => {
    return shuffleChoices(currentQ ? currentQ.choices : [], currentQ ? currentQ.answer : 0);
  }, [currentQ]);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedChoice(idx);
    setIsAnswered(true);

    const isCorrect = idx === shuffled.newAnswerIndex;
    if (isCorrect) {
      playCorrect();
      setSolvedCount(prev => prev + 1);
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

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 9999,
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            fontWeight: 800
          }}
        >
          <X size={18} color="#64748b" />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>⭐</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                Grade 3 Core Words Practice Arena
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                500 Questions on <strong>oppose · snide · heap · diverse · origin</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => {
                playPop();
                setActiveCategory(c.id);
                setCurrentIdx(0);
                setSelectedChoice(null);
                setIsAnswered(false);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '99px',
                border: activeCategory === c.id ? '2px solid #eab308' : '1px solid #cbd5e1',
                background: activeCategory === c.id ? '#fef9c3' : '#ffffff',
                color: activeCategory === c.id ? '#854d0e' : '#475569',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Question Card */}
        {currentQ && (
          <div style={{
            background: '#fffbeb',
            borderRadius: '18px',
            padding: '18px',
            border: '2px solid #fef08a',
            marginBottom: '16px'
          }}>
            {/* Category Tag & Audio Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{
                background: '#fde047',
                color: '#713f12',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {currentQ.category} · Target: {currentQ.targetWord.toUpperCase()}
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => aiSpeak(currentQ.prompt)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    border: 'none',
                    borderRadius: '99px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Volume2 size={12} /> Listen
                </button>

                <button
                  onClick={() => {
                    stopAudio();
                    playPop();
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '99px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <VolumeX size={12} /> Stop
                </button>
              </div>
            </div>

            {/* Question Prompt */}
            <div style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.4,
              marginBottom: '14px',
              whiteSpace: 'pre-line'
            }}>
              {currentQ.prompt}
            </div>

            {/* Hint */}
            {currentQ.hint && (
              <div style={{
                fontSize: '12px',
                color: '#854d0e',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                💡 Teacher Tip: {currentQ.hint}
              </div>
            )}

            {/* Choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {(shuffled ? shuffled.shuffledChoices : currentQ.choices).map((choice, idx) => {
                const isSelected = selectedChoice === idx;
                const isCorrect = idx === (shuffled ? shuffled.newAnswerIndex : currentQ.answer);

                let border = '2px solid #cbd5e1';
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
                    onClick={() => handleSelect(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border,
                      background: bg,
                      color,
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: isAnswered ? 'default' : 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={optionChipStyle(idx, {
                      selected: selectedChoice === idx,
                      correct: isAnswered && idx === correctAnswerIndex,
                      size: 24
                    })}>
                      {OPTION_MARKERS[idx % OPTION_MARKERS.length].emoji}
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
                borderRadius: '10px',
                padding: '10px 12px',
                border: `1px solid ${selectedChoice === currentQ.answer ? '#bbf7d0' : '#fecaca'}`,
                marginBottom: '12px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: selectedChoice === currentQ.answer ? '#166534' : '#991b1b'
              }}>
                {currentQ.explanation}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Next Core Word Practice →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
