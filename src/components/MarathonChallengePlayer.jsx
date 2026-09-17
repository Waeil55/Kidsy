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
    targetQuestions: 20,
    progress: 0,
    answeredQuestionIds: []
  };

  // Load a shuffled batch of non-repeated questions
  const [questions, setQuestions] = useState(() => {
    return getChallengeBatch(
      Math.max(15, gift.targetQuestions),
      gift.answeredQuestionIds || []
    );
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
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
      playCorrect();
      // Advance the gift progress in state
      advanceGiftProgress(currentQ.id, true);
      setAnsweredCount((v) => v + 1);

      // Check if unlocked
      if (gift.progress + 1 >= gift.targetQuestions) {
        setTimeout(() => {
          if (onRewardUnlocked) onRewardUnlocked();
        }, 1200);
      }
    } else {
      playIncorrect();
      advanceGiftProgress(currentQ.id, false);
    }
  };

  const handleNext = () => {
    playPop();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((v) => v + 1);
      setSelectedChoice(null);
    } else {
      // Reload another shuffled batch if the child wants to keep learning endlessly!
      const nextBatch = getChallengeBatch(20, gift.answeredQuestionIds || []);
      setQuestions(nextBatch);
      setCurrentIndex(0);
      setSelectedChoice(null);
    }
  };

  // Progress to gift
  const currentProg = Math.min(gift.targetQuestions, gift.progress);
  const pct = Math.min(100, Math.round((currentProg / gift.targetQuestions) * 100));
  const remaining = Math.max(0, gift.targetQuestions - currentProg);

  return (
    <div className="modal" style={{ zIndex: 90 }}>
      <div
        className="modalPanel"
        style={{
          maxWidth: '560px',
          maxHeight: '94vh',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Top Header Row: Exit + Gift Tracker */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <button
              className="back"
              onClick={() => {
                playPop();
                onClose();
              }}
              style={{ fontSize: '13px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '12px' }}
            >
              <ArrowLeft size={15} /> Exit Challenge
            </button>

            {/* Gift Icon & Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', padding: '6px 12px', borderRadius: '14px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '18px' }}>{gift.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#92400e' }}>
                {currentProg} / {gift.targetQuestions} Solved
              </span>
            </div>
          </div>

          {/* Animated Gift Milestone Progress Bar */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '5px' }}>
              <span>Target: {gift.title}</span>
              <span>{remaining === 0 ? '🎉 Unlocked!' : `${remaining} left to win!`}</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span
              className="pill"
              style={{
                fontSize: '11.5px',
                padding: '4px 12px',
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
              style={{ width: '36px', height: '36px' }}
            >
              <Volume2 size={16} />
            </button>
          </div>

          {/* Question Title & Prompt */}
          <h2 style={{ fontSize: '18px', fontWeight: 850, margin: '0 0 8px', color: '#0f172a' }}>
            {currentQ.title}
          </h2>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 650,
              color: '#334155',
              lineHeight: 1.45,
              whiteSpace: 'pre-line',
              background: '#f8fafc',
              padding: '14px 16px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              marginBottom: '16px'
            }}
          >
            {currentQ.prompt}
          </div>

          {/* 4 Interactive Multiple-Choice Buttons */}
          <div className="choices">
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
                    padding: '13px 16px',
                    fontSize: '14px',
                    lineHeight: 1.3
                  }}
                >
                  {choiceText}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {selectedChoice !== null && (
            <div className="feedback" style={{ marginTop: '14px' }}>
              <strong>
                {selectedChoice === currentQ.answer ? '🎉 Fantastic Thinking!' : '💡 Good Try! Keep Going!'}
              </strong>
              <span style={{ fontSize: '13px', color: '#334155' }}>
                {currentQ.explanation}
              </span>
              <button
                className="primary"
                onClick={handleNext}
                style={{ marginTop: '6px' }}
              >
                {remaining === 1 && selectedChoice === currentQ.answer
                  ? '🎁 Unlock My Gift!'
                  : 'Next Challenge →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
