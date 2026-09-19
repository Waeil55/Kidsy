import React, { useState } from 'react';
import { Sparkles, Trophy, Star, Lock, Play, CheckCircle2, Volume2, X, ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { getGradeLevels, getLevelData, getGradeProgressStats, getStageForLevel } from '../data/levelProgressionEngine';
import { aiSpeak, playCorrect, playIncorrect, playPop, fireConfetti } from '../utils/audio';

export function GradeLevelAdventure({ onClose }) {
  const { child, completeGradeLevel } = useApp();
  const gradeKey = String(child.grade || '3').toUpperCase();
  const allLevels = getGradeLevels(gradeKey);

  const completedMap = (child.gradeLevelsProgress && child.gradeLevelsProgress[gradeKey]) || {};
  const stats = getGradeProgressStats(gradeKey, completedMap);

  const [activeStageId, setActiveStageId] = useState('foundation'); // 'foundation' | 'developing' | 'proficient' | 'mastery'
  const [playingLevelNum, setPlayingLevelNum] = useState(null);

  // Highest unlocked level: Level 1 is always unlocked; level N is unlocked if level N-1 is completed
  const isLevelUnlocked = (num) => {
    if (num === 1) return true;
    return !!completedMap[num - 1];
  };

  const currentStageLevels = allLevels.filter(lvl => lvl.stageId === activeStageId);
  const activeLevelData = playingLevelNum ? getLevelData(gradeKey, playingLevelNum) : null;

  return (
    <div className="adventureMapContainer" style={{
      background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)',
      borderRadius: '24px',
      padding: '20px 16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
    }}>
      {/* Header with Grade Title & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🗺️</span>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Grade {gradeKey} Adventure (100 Levels)
            </h2>
            <span style={{
              background: '#3b82f6',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '99px'
            }}>
              STRICT GRADE {gradeKey}
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Start from easy foundations and master all 100 levels step-by-step!
          </p>
        </div>

        {/* Global Progress Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          background: '#ffffff',
          padding: '8px 16px',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>LEVELS COMPLETED</div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
              {stats.completedCount} / 100 <span style={{ fontSize: '12px', color: '#3b82f6' }}>({stats.percent}%)</span>
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>TOTAL STARS</div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#eab308', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ⭐ {stats.totalStars}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '10px',
        background: '#e2e8f0',
        borderRadius: '99px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{
          width: `${stats.percent}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #3b82f6, #10b981)',
          borderRadius: '99px',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* 4 Developmental Stages Navigation Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '8px',
        marginBottom: '20px'
      }}>
        {[
          { id: 'foundation', name: 'Stage 1: Foundation', range: 'Lv 1–25', icon: '🌱', diff: 'Easy', color: '#10b981' },
          { id: 'developing', name: 'Stage 2: Developing', range: 'Lv 26–50', icon: '🌿', diff: 'Medium', color: '#0284c7' },
          { id: 'proficient', name: 'Stage 3: Proficient', range: 'Lv 51–75', icon: '🌳', diff: 'Challenging', color: '#8b5cf6' },
          { id: 'mastery',    name: 'Stage 4: Mastery',    range: 'Lv 76–100', icon: '👑', diff: 'Expert', color: '#f59e0b' }
        ].map(stg => {
          const isActive = activeStageId === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => {
                playPop();
                setActiveStageId(stg.id);
              }}
              style={{
                background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                border: isActive ? `2px solid ${stg.color}` : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '10px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: isActive ? `0 4px 14px ${stg.color}30` : 'none',
                transform: isActive ? 'scale(1.02)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '2px' }}>{stg.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: isActive ? '#0f172a' : '#475569' }}>
                {stg.name}
              </div>
              <div style={{ fontSize: '11px', color: stg.color, fontWeight: 700 }}>
                {stg.range} · {stg.diff}
              </div>
            </button>
          );
        })}
      </div>

      {/* Level Nodes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
        gap: '12px',
        padding: '12px',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0'
      }}>
        {currentStageLevels.map(lvl => {
          const stars = completedMap[lvl.level] || 0;
          const isDone = stars > 0;
          const unlocked = isLevelUnlocked(lvl.level);

          return (
            <button
              key={lvl.level}
              disabled={!unlocked}
              onClick={() => {
                playPop();
                setPlayingLevelNum(lvl.level);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1 / 1',
                borderRadius: '18px',
                border: isDone
                  ? '2px solid #10b981'
                  : unlocked
                  ? '2px solid #3b82f6'
                  : '2px dashed #cbd5e1',
                background: isDone
                  ? 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)'
                  : unlocked
                  ? 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)'
                  : '#f8fafc',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                opacity: unlocked ? 1 : 0.6,
                boxShadow: unlocked ? '0 4px 10px rgba(15, 23, 42, 0.08)' : 'none',
                position: 'relative',
                transition: 'transform 0.15s ease'
              }}
            >
              {/* Level Number */}
              <div style={{
                fontSize: '15px',
                fontWeight: 900,
                color: isDone ? '#065f46' : unlocked ? '#1d4ed8' : '#94a3b8'
              }}>
                {lvl.level}
              </div>

              {/* Status Indicator */}
              <div style={{ fontSize: '11px', marginTop: '2px' }}>
                {isDone ? (
                  <span style={{ color: '#eab308', fontWeight: 800 }}>
                    {'⭐'.repeat(stars)}
                  </span>
                ) : unlocked ? (
                  <span style={{ fontSize: '12px' }}>▶</span>
                ) : (
                  <Lock size={12} color="#94a3b8" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Level Runner Modal */}
      {activeLevelData && (
        <LevelRunnerModal
          levelData={activeLevelData}
          onClose={() => setPlayingLevelNum(null)}
          onCompleted={(stars) => {
            completeGradeLevel(gradeKey, activeLevelData.level, stars, activeLevelData.xp);
            setPlayingLevelNum(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * Interactive Level Runner Modal
 * Walks child through questions with human AI voice reading and feedback
 */
function LevelRunnerModal({ levelData, onClose, onCompleted }) {
  const [qIndex, setQIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions = levelData.questions || [];
  const currentQ = questions[qIndex] || questions[0];

  const handleSelect = (choiceIdx) => {
    if (isAnswered) return;
    setSelectedChoice(choiceIdx);
    setIsAnswered(true);

    const isCorrect = choiceIdx === currentQ.answer;
    if (isCorrect) {
      playCorrect(); // Spoken human AI voice encouragement!
    } else {
      setMistakes(prev => prev + 1);
      playIncorrect(); // Gentle spoken human AI voice guidance!
    }
  };

  const handleNext = () => {
    playPop();
    if (qIndex + 1 < questions.length) {
      setQIndex(prev => prev + 1);
      setSelectedChoice(null);
      setIsAnswered(false);
    } else {
      // Level Complete!
      setIsFinished(true);
      fireConfetti(true);
      aiSpeak("Congratulations! Level complete!");
    }
  };

  const handleFinish = () => {
    const totalQ = Math.max(1, questions.length);
    const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
    onCompleted(stars);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '520px',
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
            cursor: 'pointer'
          }}
        >
          <X size={18} color="#64748b" />
        </button>

        {!isFinished ? (
          <div>
            {/* Level Title Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#eff6ff',
                display: 'grid',
                placeItems: 'center',
                fontSize: '20px'
              }}>
                {levelData.stageIcon || '⭐'}
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase' }}>
                  {levelData.stage} · {levelData.difficulty} · Q{qIndex + 1}/{questions.length}
                </div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
                  {levelData.title}
                </h3>
              </div>
            </div>

            {/* Question Prompt with Human Voice Read Aloud Button */}
            <div style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <p style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 700,
                color: '#1e293b',
                lineHeight: 1.4,
                whiteSpace: 'pre-line'
              }}>
                {currentQ.prompt}
              </p>
              <button
                onClick={() => aiSpeak(currentQ.prompt)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '10px',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  border: 'none',
                  borderRadius: '99px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Volume2 size={14} /> Listen with AI Voice
              </button>
            </div>

            {/* Choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {currentQ.choices.map((ch, idx) => {
                const isSelected = selectedChoice === idx;
                const isCorrect = idx === currentQ.answer;

                let border = '2px solid #e2e8f0';
                let bg = '#ffffff';
                let color = '#1e293b';

                if (isAnswered) {
                  if (isCorrect) {
                    border = '2px solid #10b981';
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
                      gap: '12px',
                      padding: '12px 16px',
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
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isSelected ? (isCorrect ? '#10b981' : '#ef4444') : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#64748b',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '13px',
                      fontWeight: 800
                    }}>
                      {['🦁', '🐸', '🦋', '🐙', '🦊', '🐬', '🐢', '🐝'][idx]}
                    </span>
                    <span style={{ flex: 1 }}>{ch}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button */}
            {isAnswered && (
              <div style={{
                background: selectedChoice === currentQ.answer ? '#f0fdf4' : '#fef2f2',
                borderRadius: '14px',
                padding: '12px 16px',
                border: `1px solid ${selectedChoice === currentQ.answer ? '#bbf7d0' : '#fecaca'}`,
                marginBottom: '16px'
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: selectedChoice === currentQ.answer ? '#166534' : '#991b1b'
                }}>
                  {currentQ.explanation}
                </div>
              </div>
            )}

            {isAnswered && (
              <button
                onClick={handleNext}
                style={{
                  width: '100%',
                  background: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                Continue <ArrowRight size={18} />
              </button>
            )}
          </div>
        ) : (
          /* Level Completed Celebration Screen */
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>🎉</div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
              Level {levelData.level} Mastered!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 600, margin: '0 0 16px' }}>
              {levelData.title}
            </p>

            {/* Stars Awarded */}
            <div style={{ fontSize: '32px', marginBottom: '14px', letterSpacing: '4px' }}>
              {mistakes === 0 ? '⭐⭐⭐' : mistakes === 1 ? '⭐⭐' : '⭐'}
            </div>

            {/* Rewards Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ecfdf5',
              color: '#065f46',
              padding: '6px 16px',
              borderRadius: '99px',
              fontSize: '14px',
              fontWeight: 800,
              marginBottom: '20px'
            }}>
              <Sparkles size={16} /> +{levelData.xp} XP Earned!
            </div>

            <button
              onClick={handleFinish}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              Collect Rewards & Unlock Next Level →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
