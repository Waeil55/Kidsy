import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Sparkles, CheckCircle2, Trophy, HelpCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { getChallengeBatch } from '../data/massiveChallengeBank';
import { playCorrect, playIncorrect, playPop, fireConfetti, speakText } from '../utils/audio';

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
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [lastAnswerWasWrong, setLastAnswerWasWrong] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentQ = questions[currentIndex] || questions[0];

  const handleReadAloud = () => {
    if (!currentQ) return;
    const text = `${currentQ.prompt}. Choices are: ${currentQ.choices.join(', ')}`;
    speakText(text);
  };

  const handleSelectChoice = (choiceIdx) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(choiceIdx);
    const isCorrect = choiceIdx === currentQ.answer;

    if (isCorrect) {
      setLastAnswerWasWrong(false);
      playCorrect();
      // Advance the gift progress in state (+1 point)
      advanceGiftProgress(currentQ.id, true);
      setAnsweredCount((v) => v + 1);

      // Check if unlocked
      if (gift.progress + 1 >= targetGoal) {
        setTimeout(() => {
          if (onRewardUnlocked) onRewardUnlocked();
        }, 1200);
      }
    } else {
      // PENALTY: lost 1 point to prevent answering without studying!
      setLastAnswerWasWrong(true);
      playIncorrect();
      advanceGiftProgress(currentQ.id, false);
    }
  };

  const handleNext = () => {
    playPop();
    setLastAnswerWasWrong(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((v) => v + 1);
      setSelectedChoice(null);
    } else {
      // Reload another shuffled batch from the 105+ Week 5 question bank
      const nextBatch = getChallengeBatch(70, gift.answeredQuestionIds || []);
      setQuestions(nextBatch);
      setCurrentIndex(0);
      setSelectedChoice(null);
    }
  };

  // Progress to gift
  const currentProg = Math.min(targetGoal, Math.max(0, gift.progress || 0));
  const pct = Math.min(100, Math.round((currentProg / targetGoal) * 100));
  const remaining = Math.max(0, targetGoal - currentProg);

  return (
    <div className="modal" style={{ zIndex: 90, padding: '10px' }}>
      <div
        className="modalPanel"
        style={{
          maxWidth: '520px',
          maxHeight: 'min(760px, 96dvh)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', padding: '5px 10px', borderRadius: '12px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '16px' }}>{gift.icon}</span>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#92400e' }}>
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

          {/* Question Category & Audio Speaker */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span
              className="pill"
              style={{
                fontSize: '11px',
                padding: '3px 10px',
                background: '#e0f2fe',
                color: '#0369a1',
                fontWeight: 800
              }}
            >
              {currentQ.category}
            </span>

            <button
              className="iconBtn"
              onClick={handleReadAloud}
              title="Read aloud"
              style={{ width: '32px', height: '32px' }}
            >
              <Volume2 size={15} />
            </button>
          </div>

          {/* Question Title & Prompt */}
          <h2 style={{ fontSize: '16px', fontWeight: 850, margin: '0 0 6px', color: '#0f172a' }}>
            {currentQ.title}
          </h2>
          <div
            style={{
              fontSize: '13.5px',
              fontWeight: 650,
              color: '#334155',
              lineHeight: 1.4,
              whiteSpace: 'pre-line',
              background: '#f8fafc',
              padding: '10px 12px',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              marginBottom: '10px'
            }}
          >
            {currentQ.prompt}
          </div>

          {/* Interactive Multiple-Choice Buttons */}
          <div className="choices" style={{ display: 'grid', gap: '7px' }}>
            {currentQ.choices.map((choiceText, cIdx) => {
              let btnClass = '';
              if (selectedChoice !== null) {
                if (cIdx === currentQ.answer) btnClass = 'correct';
                else if (cIdx === selectedChoice) btnClass = 'wrong';
              }
              return (
                <button
                  key={cIdx}
                  className={btnClass}
                  onClick={() => handleSelectChoice(cIdx)}
                  style={{
                    padding: '10px 14px',
                    fontSize: '13px',
                    lineHeight: 1.25,
                    borderRadius: '12px'
                  }}
                >
                  {choiceText}
                </button>
              );
            })}
          </div>

          {/* Explanation & Penalty Warning */}
          {selectedChoice !== null && (
            <div
              className="feedback"
              style={{
                marginTop: '10px',
                padding: '10px 14px',
                background: selectedChoice === currentQ.answer ? '#f0fdf4' : '#fef2f2',
                border: selectedChoice === currentQ.answer ? '1.5px solid #86efac' : '1.5px solid #fca5a5',
                borderRadius: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ color: selectedChoice === currentQ.answer ? '#166534' : '#991b1b', fontSize: '13.5px' }}>
                  {selectedChoice === currentQ.answer ? '🎉 Correct! +1 Point!' : '⚠️ Wrong Answer! -1 Point Penalty!'}
                </strong>
                {lastAnswerWasWrong && (
                  <span style={{ fontSize: '11px', background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                    -1 pt (Study!)
                  </span>
                )}
              </div>
              <span style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.35, display: 'block' }}>
                {currentQ.explanation}
              </span>
              <button
                className="primary"
                onClick={handleNext}
                style={{ marginTop: '8px', padding: '9px 16px', fontSize: '13.5px', width: '100%', justifyContent: 'center' }}
              >
                {remaining === 1 && selectedChoice === currentQ.answer
                  ? '🎁 Unlock My 70-Question Prize!'
                  : 'Next Challenge →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
