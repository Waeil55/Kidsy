import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, Sparkles, CheckCircle2, XCircle, Trophy, HelpCircle, BookOpen, AlertTriangle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { getChallengeBatch } from '../data/massiveChallengeBank';
import { playCorrect, playIncorrect, playPop, fireConfetti, speakText } from '../utils/audio';
import { shuffleChoices } from '../lib/security';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const LETTER_STYLES = [
  { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' }, // A - Blue
  { bg: '#faf5ff', border: '#e9d5ff', text: '#7e22ce' }, // B - Purple
  { bg: '#fffbeb', border: '#fde68a', text: '#b45309' }, // C - Amber
  { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' }  // D - Emerald
];

export function MarathonChallengePlayer({ onClose, onRewardUnlocked }) {
  const { child, advanceGiftProgress } = useApp();
  const gift = child.giftGoal || {
    title: 'Awesome Toy',
    icon: '🧸',
    targetQuestions: 70,
    progress: 0,
    answeredQuestionIds: []
  };

  const targetGoal = gift.targetQuestions || 70;

  // Load a shuffled batch of non-repeated questions from the Week 5 master bank
  const [questions, setQuestions] = useState(() => {
    return getChallengeBatch(
      Math.max(70, targetGoal),
      gift.answeredQuestionIds || []
    );
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedChoices, setDisplayedChoices] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [lastAnswerWasWrong, setLastAnswerWasWrong] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [antiSpamWarning, setAntiSpamWarning] = useState(null);
  const [comboStreak, setComboStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);

  const currentQ = questions[currentIndex] || questions[0];

  // Anti-Cheat & Dynamic Shuffling on question change
  useEffect(() => {
    if (!currentQ) return;

    // 1. Shuffled choices so correct answer position is unpredictable
    const { shuffledChoices, newAnswerIndex } = shuffleChoices(
      currentQ.choices,
      currentQ.answer
    );
    setDisplayedChoices(shuffledChoices);
    setCorrectIndex(newAnswerIndex);
    setSelectedChoice(null);
    setLastAnswerWasWrong(false);
    setAntiSpamWarning(null);
    setLockoutSeconds(0);

    // 2. Anti-Rush Reading Timer: disable tapping for first 1.5 seconds
    setCanAnswer(false);
    const readingTimer = setTimeout(() => {
      setCanAnswer(true);
    }, 1500);

    return () => clearTimeout(readingTimer);
  }, [currentIndex, currentQ?.id]);

  // Review lockout timer on wrong answer
  useEffect(() => {
    let timer = null;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((s) => Math.max(0, s - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleReadAloud = () => {
    if (!currentQ) return;
    const choicesText = displayedChoices.join(', ');
    const text = `${currentQ.prompt}. Choices are: ${choicesText}`;
    speakText(text);
  };

  const handleSelectChoice = (choiceIdx) => {
    // Prevent changing answer once selected
    if (selectedChoice !== null) return;

    // Anti-Rapid-Guessing guard
    if (!canAnswer) {
      playPop();
      setAntiSpamWarning('📖 Slow down! Read the question carefully to earn points.');
      return;
    }

    setAntiSpamWarning(null);
    setSelectedChoice(choiceIdx);
    const isCorrect = choiceIdx === correctIndex;

    if (isCorrect) {
      setLastAnswerWasWrong(false);
      setComboStreak((s) => s + 1);
      setWrongStreak(0);
      playCorrect();
      advanceGiftProgress(currentQ.id, true);

      // Check if unlocked
      if (gift.progress + 1 >= targetGoal) {
        fireConfetti(true);
        setTimeout(() => {
          if (onRewardUnlocked) onRewardUnlocked();
        }, 1200);
      }
    } else {
      // PENALTY: lost 1 point to prevent answering without studying
      setLastAnswerWasWrong(true);
      setComboStreak(0);
      setWrongStreak((s) => s + 1);
      playIncorrect();
      advanceGiftProgress(currentQ.id, false);

      // Mandatory 3.5s study lockout before Next Challenge unlocks
      setLockoutSeconds(3);
    }
  };

  const handleNext = () => {
    if (lockoutSeconds > 0) return;
    playPop();
    setLastAnswerWasWrong(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((v) => v + 1);
    } else {
      // Reload another shuffled batch from the Week 5 question bank
      const nextBatch = getChallengeBatch(70, gift.answeredQuestionIds || []);
      setQuestions(nextBatch);
      setCurrentIndex(0);
    }
  };

  // Progress to gift
  const currentProg = Math.min(targetGoal, Math.max(0, gift.progress || 0));
  const pct = Math.min(100, Math.round((currentProg / targetGoal) * 100));
  const remaining = Math.max(0, targetGoal - currentProg);

  // Type badge info
  const getTypeBadge = (type) => {
    switch (type) {
      case 'true_false':
        return { label: '⚖️ TRUE OR FALSE', color: '#f59e0b', bg: '#fef3c7' };
      case 'story':
        return { label: '📖 STORY DETECTIVE', color: '#8b5cf6', bg: '#f5f3ff' };
      case 'sentence':
        return { label: '✏️ FILL IN THE BLANK', color: '#0284c7', bg: '#e0f2fe' };
      case 'synonym':
        return { label: '🔄 SYNONYM MATCH', color: '#059669', bg: '#d1fae5' };
      case 'antonym':
        return { label: '⚡ OPPOSITE (ANTONYM)', color: '#dc2626', bg: '#fee2e2' };
      case 'odd_one_out':
        return { label: '🎯 ODD ONE OUT', color: '#d97706', bg: '#fef3c7' };
      case 'spelling':
        return { label: '🔤 SPELLING & PHONICS', color: '#4f46e5', bg: '#e0e7ff' };
      case 'reverse_def':
        return { label: '🕵️ MYSTERY RIDDLE', color: '#9333ea', bg: '#f3e8ff' };
      default:
        return { label: '⭐ WEEK 5 CHALLENGE', color: '#0369a1', bg: '#e0f2fe' };
    }
  };

  const badge = getTypeBadge(currentQ.type);
  const isTrueFalse = currentQ.type === 'true_false' || displayedChoices.length === 2;

  return (
    <div className="modal" style={{ zIndex: 90, padding: '8px' }}>
      <div
        className="modalPanel"
        style={{
          maxWidth: '540px',
          maxHeight: 'min(780px, 98dvh)',
          padding: '16px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}
      >
        <div>
          {/* Top Header Row: Exit + Gift Tracker */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <button
              onClick={() => {
                playPop();
                onClose();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1.5px solid #bfdbfe',
                borderRadius: '12px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              <span>← Back</span>
            </button>

            {/* Gift Icon & Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', padding: '5px 11px', borderRadius: '12px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '17px' }}>{gift.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#92400e' }}>
                {currentProg} / {targetGoal} Points
              </span>
            </div>
          </div>

          {/* Animated Gift Milestone Progress Bar */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '4px' }}>
              <span>Prize: {gift.title}</span>
              <span>{remaining === 0 ? '🎉 Unlocked!' : `${remaining} points left!`}</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 50%, #6366f1 100%)',
                  borderRadius: '99px',
                  transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              />
            </div>
          </div>

          {/* Anti-Spam Warning Alert Banner */}
          {antiSpamWarning && (
            <div
              style={{
                background: '#fffbeb',
                border: '1.5px solid #fde68a',
                color: '#92400e',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px'
              }}
            >
              <AlertTriangle size={16} color="#d97706" />
              <span>{antiSpamWarning}</span>
            </div>
          )}

          {wrongStreak >= 2 && (
            <div
              style={{
                background: '#fef2f2',
                border: '1.5px solid #fca5a5',
                color: '#991b1b',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px'
              }}
            >
              <span>⚠️ Guessing penalty: -1 point! Take a moment to read the clue carefully.</span>
            </div>
          )}

          {/* ================================================================ */}
          {/* THE QUESTION BOARD (DARK HIGH-CONTRAST SLATE-OBSIDIAN CARD)      */}
          {/* VISUALLY UNMISTAKABLE FROM THE ANSWER BUTTONS                   */}
          {/* ================================================================ */}
          <div
            style={{
              background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '20px',
              padding: '14px 16px',
              border: '2px solid #334155',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)',
              marginBottom: '14px',
              position: 'relative'
            }}
          >
            {/* Question Board Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: badge.bg,
                    color: badge.color,
                    padding: '3px 9px',
                    borderRadius: '99px',
                    fontSize: '10px',
                    fontWeight: 900,
                    letterSpacing: '0.06em'
                  }}
                >
                  {badge.label}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>
                  Q{currentIndex + 1}
                </span>
              </div>

              <button
                className="iconBtn"
                onClick={handleReadAloud}
                title="Read question aloud"
                style={{
                  width: '30px',
                  height: '30px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#38bdf8',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Volume2 size={15} />
              </button>
            </div>

            {/* Question Title */}
            <div style={{ color: '#38bdf8', fontSize: '13.5px', fontWeight: 850, marginBottom: '6px' }}>
              {currentQ.title}
            </div>

            {/* If Story Type: Render Narrative Parchment Card */}
            {currentQ.type === 'story' && (
              <div
                style={{
                  background: '#fefce8',
                  borderLeft: '4px solid #f59e0b',
                  color: '#78350f',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  lineHeight: 1.45,
                  marginBottom: '10px',
                  fontStyle: 'italic'
                }}
              >
                {currentQ.prompt.split('\n\n')[0]}
              </div>
            )}

            {/* Question Prompt */}
            <div
              style={{
                color: '#f8fafc',
                fontSize: '14.5px',
                fontWeight: 700,
                lineHeight: 1.45,
                whiteSpace: 'pre-line'
              }}
            >
              {/* For story type, show only question portion */}
              {currentQ.type === 'story'
                ? currentQ.prompt.split('\n\n')[1] || currentQ.prompt
                : currentQ.prompt}
            </div>

            {/* Live Fill-in-the-Blank Preview */}
            {currentQ.type === 'sentence' && selectedChoice !== null && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid #38bdf8',
                  borderRadius: '10px',
                  color: '#7dd3fc',
                  fontSize: '12px',
                  fontWeight: 800
                }}
              >
                Selected word: &ldquo;{displayedChoices[selectedChoice]}&rdquo;
              </div>
            )}

            {/* Anti-Rush Reading Indicator inside Question Board */}
            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 800,
                color: canAnswer ? '#38bdf8' : '#94a3b8'
              }}
            >
              {canAnswer ? (
                <>✨ Ready! Tap your answer below:</>
              ) : (
                <>📖 Read the question carefully...</>
              )}
            </div>
          </div>

          {/* ================================================================ */}
          {/* THE ANSWER CHOICES (BRIGHT TACTILE 3D BUTTONS WITH BADGES)       */}
          {/* ================================================================ */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Choose the right answer:
            </span>
            {comboStreak > 1 && (
              <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#ea580c' }}>
                🔥 {comboStreak} Combo!
              </span>
            )}
          </div>

          {/* True / False 2-Button Grid Layout */}
          {isTrueFalse ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {displayedChoices.map((choiceText, cIdx) => {
                const isSelected = selectedChoice === cIdx;
                const isCorrectChoice = cIdx === correctIndex;
                const isTrue = choiceText.toLowerCase().includes('true');

                let btnBg = isTrue ? '#f0fdf4' : '#fef2f2';
                let btnBorder = isTrue ? '#86efac' : '#fca5a5';
                let btnBottomBorder = isTrue ? '#16a34a' : '#dc2626';
                let btnTextColor = isTrue ? '#166534' : '#991b1b';

                if (selectedChoice !== null) {
                  if (isCorrectChoice) {
                    btnBg = '#dcfce7';
                    btnBorder = '#22c55e';
                    btnBottomBorder = '#15803d';
                  } else if (isSelected) {
                    btnBg = '#fee2e2';
                    btnBorder = '#ef4444';
                    btnBottomBorder = '#b91c1c';
                  }
                }

                return (
                  <button
                    key={cIdx}
                    disabled={selectedChoice !== null}
                    onClick={() => handleSelectChoice(cIdx)}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '16px',
                      background: btnBg,
                      border: `2px solid ${btnBorder}`,
                      borderBottom: `4px solid ${btnBottomBorder}`,
                      cursor: canAnswer ? 'pointer' : 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease',
                      transform: isSelected ? 'translateY(2px)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{isTrue ? '✅' : '❌'}</span>
                    <strong style={{ fontSize: '14.5px', fontWeight: 900, color: btnTextColor }}>
                      {choiceText}
                    </strong>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Standard 4-Choice Tactile List */
            <div className="choices" style={{ display: 'grid', gap: '8px' }}>
              {displayedChoices.map((choiceText, cIdx) => {
                const isSelected = selectedChoice === cIdx;
                const isCorrectChoice = cIdx === correctIndex;
                const styleMeta = LETTER_STYLES[cIdx % LETTER_STYLES.length];

                let cardBg = '#ffffff';
                let cardBorder = '#e2e8f0';
                let cardBottom = '#cbd5e1';
                let cardTextColor = '#1e293b';

                if (selectedChoice !== null) {
                  if (isCorrectChoice) {
                    cardBg = '#f0fdf4';
                    cardBorder = '#86efac';
                    cardBottom = '#22c55e';
                    cardTextColor = '#14532d';
                  } else if (isSelected) {
                    cardBg = '#fef2f2';
                    cardBorder = '#fca5a5';
                    cardBottom = '#ef4444';
                    cardTextColor = '#7f1d1d';
                  }
                }

                return (
                  <button
                    key={cIdx}
                    disabled={selectedChoice !== null}
                    onClick={() => handleSelectChoice(cIdx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '11px 14px',
                      background: cardBg,
                      border: `2px solid ${cardBorder}`,
                      borderBottom: `4px solid ${cardBottom}`,
                      borderRadius: '16px',
                      cursor: canAnswer ? 'pointer' : 'default',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.03)',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      transform: isSelected ? 'translateY(2px)' : 'none'
                    }}
                  >
                    {/* Option Letter Badge A, B, C, D */}
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '10px',
                        background: styleMeta.bg,
                        border: `1.5px solid ${styleMeta.border}`,
                        color: styleMeta.text,
                        fontWeight: 900,
                        fontSize: '13px',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0
                      }}
                    >
                      {OPTION_LETTERS[cIdx]}
                    </div>

                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: cardTextColor, flex: 1, lineHeight: 1.3 }}>
                      {choiceText}
                    </span>

                    {/* Result indicator icons */}
                    {selectedChoice !== null && isCorrectChoice && (
                      <CheckCircle2 size={19} color="#16a34a" strokeWidth={2.5} />
                    )}
                    {selectedChoice !== null && isSelected && !isCorrectChoice && (
                      <XCircle size={19} color="#dc2626" strokeWidth={2.5} />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Explanation & Penalty Feedback with Lockout Review Timer */}
          {selectedChoice !== null && (
            <div
              className="feedback"
              style={{
                marginTop: '12px',
                padding: '12px 14px',
                background: selectedChoice === correctIndex ? '#f0fdf4' : '#fef2f2',
                border: selectedChoice === correctIndex ? '2px solid #86efac' : '2px solid #fca5a5',
                borderRadius: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ color: selectedChoice === correctIndex ? '#166534' : '#991b1b', fontSize: '14px' }}>
                  {selectedChoice === correctIndex ? '🎉 Correct! +1 Point toward Gift!' : '⚠️ Wrong Answer! -1 Point Penalty!'}
                </strong>
                {lastAnswerWasWrong && (
                  <span style={{ fontSize: '11px', background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '8px', fontWeight: 900 }}>
                    -1 pt (Study!)
                  </span>
                )}
              </div>

              <span style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.4, display: 'block', margin: '4px 0 10px' }}>
                {currentQ.explanation}
              </span>

              {/* Next Button with Lockout Countdown on wrong answer */}
              <button
                disabled={lockoutSeconds > 0}
                onClick={handleNext}
                className="glossyPillBtn"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '13.5px',
                  opacity: lockoutSeconds > 0 ? 0.65 : 1,
                  cursor: lockoutSeconds > 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {lockoutSeconds > 0 ? (
                  <>⏳ Review Explanation ({lockoutSeconds}s)...</>
                ) : remaining === 1 && selectedChoice === correctIndex ? (
                  <>🎁 Unlock My 70-Question Prize!</>
                ) : (
                  <>Next Challenge →</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
