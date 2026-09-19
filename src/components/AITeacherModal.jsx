import React, { useState } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Brain,
  MessageSquare,
  Send,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { speakText, playPop, playCorrect, playIncorrect, fireConfetti } from '../utils/audio';

export function AITeacherModal({ entry, onClose, onMasteryComplete }) {
  // Tabs: 0 = Discover & Story, 1 = Mnemonic & Memory, 2 = Ask AI Tutor, 3 = Mastery Challenge
  const [currentStep, setCurrentStep] = useState(0);

  // AI Tutor chat state
  const [activeAIAnswer, setActiveAIAnswer] = useState(
    entry.aiPrompts?.[0]?.a || `Hello explorer! Let's master the word "${entry.word}" together!`
  );
  const [customAIQuestion, setCustomAIQuestion] = useState('');

  // Practice & Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [eliminatedChoices, setEliminatedChoices] = useState([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const quiz = entry.quiz || {
    prompt: `What does "${entry.word}" mean?`,
    choices: [entry.kidDefinition, 'To sleep quietly', 'To run fast', 'To make noise'],
    answer: 0,
    hint: `Think about how "${entry.word}" was used in our story!`,
    explanation: entry.kidDefinition
  };

  const handleSpeak = (text) => {
    playPop();
    speakText(text);
  };

  const handleAskAIPrompt = (promptObj) => {
    playCorrect();
    setActiveAIAnswer(promptObj.a);
    speakText(promptObj.a);
  };

  const handleCustomAISubmit = (e) => {
    e.preventDefault();
    if (!customAIQuestion.trim()) return;
    playPop();
    const answer = `Great question about "${entry.word}"! In simple words: ${entry.kidDefinition} A fun way to use it: "${entry.teacherSentence}"`;
    setActiveAIAnswer(answer);
    speakText(answer);
    setCustomAIQuestion('');
  };

  const handleUse5050Hint = () => {
    playPop();
    setShowHint(true);
    setHintLevel((l) => l + 1);

    if (eliminatedChoices.length === 0) {
      // Eliminate two wrong choices
      const wrongIndices = quiz.choices
        .map((_, idx) => idx)
        .filter((idx) => idx !== quiz.answer);
      // Pick first two wrong ones to eliminate
      setEliminatedChoices(wrongIndices.slice(0, 2));
    }
  };

  const handleChooseAnswer = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === quiz.answer) {
      playCorrect();
      fireConfetti(true);
      if (onMasteryComplete) onMasteryComplete(entry.id);
    } else {
      playIncorrect();
    }
  };

  return (
    <div className="modal" style={{ zIndex: 95, padding: '8px' }}>
      <div
        className="modalPanel"
        style={{
          maxWidth: '560px',
          maxHeight: 'min(780px, 98dvh)',
          padding: '16px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}
      >
        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <button
              onClick={() => {
                playPop();
                onClose();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, background: '#fef08a', color: '#854d0e', padding: '3px 9px', borderRadius: '99px' }}>
                🌟 AI MASTER TEACHER
              </span>
              <button
                onClick={() => {
                  playPop();
                  onClose();
                }}
                style={{
                  border: 0,
                  background: '#f1f5f9',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Word Hero Showcase Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: '20px',
              padding: '16px 18px',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
              border: '2px solid #334155',
              marginBottom: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, color: '#38bdf8', letterSpacing: '-0.5px' }}>
                    {entry.word}
                  </h1>
                  <button
                    onClick={() => handleSpeak(`${entry.word}. ${entry.kidDefinition}`)}
                    style={{
                      background: 'rgba(56, 189, 248, 0.2)',
                      border: '1.5px solid #38bdf8',
                      color: '#38bdf8',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer'
                    }}
                    title="Pronounce word"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>
                    {entry.phonetic || ''}
                  </span>
                  <span style={{ fontSize: '11px', background: '#334155', color: '#e2e8f0', padding: '2px 7px', borderRadius: '6px', fontWeight: 800 }}>
                    {entry.partOfSpeech}
                  </span>
                  <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                    {entry.syllables}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10.5px', background: '#0284c7', color: '#ffffff', padding: '3px 8px', borderRadius: '8px', fontWeight: 900 }}>
                  Grade {entry.grade} Core
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', margin: '10px 0 0', lineHeight: 1.4, color: '#f8fafc', fontWeight: 650 }}>
              &ldquo;{entry.kidDefinition}&rdquo;
            </p>
          </div>

          {/* 4 Pedagogical Phase Steps Navigation */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {[
              { label: '1. Story & Sound', icon: BookOpen },
              { label: '2. Memory Superpower', icon: Brain },
              { label: '3. Ask AI Tutor', icon: MessageSquare },
              { label: '4. Mastery Quiz', icon: Trophy }
            ].map((step, sIdx) => {
              const isActive = currentStep === sIdx;
              const IconComp = step.icon;
              return (
                <button
                  key={sIdx}
                  onClick={() => {
                    playPop();
                    setCurrentStep(sIdx);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '12px',
                    border: isActive ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                    background: isActive ? '#e0f2fe' : '#ffffff',
                    color: isActive ? '#0369a1' : '#64748b',
                    fontSize: '11px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <IconComp size={14} />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* STEP 1: STORY & SOUND */}
          {currentStep === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '14px 16px'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase', marginBottom: '4px' }}>
                  📖 Story in Action
                </div>
                <p style={{ fontSize: '13.5px', color: '#1e293b', lineHeight: 1.5, margin: 0 }}>
                  {entry.funStory}
                </p>
              </div>

              <div
                style={{
                  background: '#fef3c7',
                  border: '1.5px solid #fde68a',
                  borderRadius: '16px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#92400e', textTransform: 'uppercase', marginBottom: '4px' }}>
                  🎯 Teacher Guide Sentence
                </div>
                <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#78350f', lineHeight: 1.4, margin: 0 }}>
                  &ldquo;{entry.teacherSentence}&rdquo;
                </p>
              </div>

              <button
                className="glossyPillBtn"
                onClick={() => {
                  playPop();
                  setCurrentStep(1);
                }}
                style={{ width: '100%', marginTop: '4px' }}
              >
                Learn Memory Superpower →
              </button>
            </div>
          )}

          {/* STEP 2: MNEMONIC SUPERPOWER & SYNONYM WEB */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  background: '#f5f3ff',
                  border: '1.5px solid #ddd6fe',
                  borderRadius: '16px',
                  padding: '14px 16px'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#6d28d9', textTransform: 'uppercase', marginBottom: '4px' }}>
                  🧠 AI Memory Superpower
                </div>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#4c1d95', lineHeight: 1.4, margin: 0 }}>
                  {entry.mnemonicTrick}
                </p>
              </div>

              {/* Synonyms & Antonyms Chips */}
              <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#059669', marginBottom: '6px', textTransform: 'uppercase' }}>
                  ✨ Synonyms (Same Meaning) - Tap to hear:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {(entry.synonyms || []).map((syn) => (
                    <button
                      key={syn}
                      onClick={() => handleSpeak(syn)}
                      style={{
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#065f46',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      🔊 {syn}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '11px', fontWeight: 900, color: '#dc2626', marginBottom: '6px', textTransform: 'uppercase' }}>
                  ⚡ Antonyms (Opposite Meaning) - Tap to hear:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(entry.antonyms || []).map((ant) => (
                    <button
                      key={ant}
                      onClick={() => handleSpeak(ant)}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#991b1b',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      🔊 {ant}
                    </button>
                  ))}
                </div>
              </div>

              {entry.commonMistake && (
                <div style={{ background: '#fffbeb', border: '1.5px solid #fef08a', borderRadius: '12px', padding: '10px 12px' }}>
                  <strong style={{ fontSize: '11.5px', color: '#854d0e', display: 'block', marginBottom: '2px' }}>
                    ⚠️ Common Mistake to Avoid:
                  </strong>
                  <span style={{ fontSize: '12.5px', color: '#713f12', lineHeight: 1.35 }}>
                    {entry.commonMistake}
                  </span>
                </div>
              )}

              <button
                className="glossyPillBtn"
                onClick={() => {
                  playPop();
                  setCurrentStep(2);
                }}
                style={{ width: '100%', marginTop: '4px' }}
              >
                Ask AI Tutor Anything →
              </button>
            </div>
          )}

          {/* STEP 3: ASK DIDI AI TUTOR */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Mascot Bubble */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                  border: '1.5px solid #bae6fd',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ fontSize: '36px' }}>🦖</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Didi AI Explorer Companion
                  </div>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#0f172a', fontWeight: 700, lineHeight: 1.45 }}>
                    {activeAIAnswer}
                  </p>
                  <button
                    onClick={() => handleSpeak(activeAIAnswer)}
                    style={{
                      marginTop: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#0284c7',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Volume2 size={13} /> Listen to Answer
                  </button>
                </div>
              </div>

              {/* Instant Interactive AI Prompts */}
              <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#475569', textTransform: 'uppercase', margin: '2px 0' }}>
                Tap to Ask Didi:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {(entry.aiPrompts || []).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAIPrompt(p)}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '8px 10px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#1e293b',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    💡 {p.q}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <form onSubmit={handleCustomAISubmit} style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <input
                  value={customAIQuestion}
                  onChange={(e) => setCustomAIQuestion(e.target.value)}
                  placeholder={`Ask anything about "${entry.word}"...`}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="primary small"
                  style={{ borderRadius: '12px', padding: '0 14px' }}
                >
                  <Send size={15} />
                </button>
              </form>

              <button
                className="glossyPillBtn"
                onClick={() => {
                  playPop();
                  setCurrentStep(3);
                }}
                style={{ width: '100%', marginTop: '4px' }}
              >
                Test My Mastery (Quiz) →
              </button>
            </div>
          )}

          {/* STEP 4: MASTERY QUIZ (HIGH-CONTRAST QUESTION BOARD VS 3D CHOICES) */}
          {currentStep === 3 && (
            <div>
              {/* Question Board */}
              <div
                style={{
                  background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
                  borderRadius: '18px',
                  padding: '14px 16px',
                  border: '2px solid #334155',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)',
                  marginBottom: '12px',
                  color: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ background: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '99px', fontSize: '9.5px', fontWeight: 900, textTransform: 'uppercase' }}>
                    ❓ MASTERY CHALLENGE
                  </span>
                  <button
                    onClick={handleUse5050Hint}
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid #f59e0b',
                      color: '#fbbf24',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Lightbulb size={13} /> AI 50/50 Hint
                  </button>
                </div>

                <p style={{ margin: 0, fontSize: '14.5px', fontWeight: 750, lineHeight: 1.45, color: '#f8fafc' }}>
                  {quiz.prompt}
                </p>

                {showHint && (
                  <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', borderRadius: '8px', fontSize: '11.5px', color: '#fde68a' }}>
                    💡 Clue: {quiz.hint}
                  </div>
                )}
              </div>

              {/* 3D Answer Choices */}
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Tap your answer:
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {quiz.choices.map((choiceText, cIdx) => {
                  const letters = ['🦁', '🐸', '🦋', '🐙'];
                  const isEliminated = eliminatedChoices.includes(cIdx);
                  const isSelected = selectedAnswer === cIdx;
                  const isCorrect = cIdx === quiz.answer;

                  if (isEliminated && selectedAnswer === null) {
                    return (
                      <div
                        key={cIdx}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '14px',
                          border: '1.5px dashed #cbd5e1',
                          color: '#94a3b8',
                          fontSize: '12px',
                          background: '#f8fafc',
                          textDecoration: 'line-through'
                        }}
                      >
                        {letters[cIdx]}. {choiceText} (Eliminated by AI Hint)
                      </div>
                    );
                  }

                  let cardBg = '#ffffff';
                  let cardBorder = '#e2e8f0';
                  let cardBottom = '#cbd5e1';
                  let cardTextColor = '#1e293b';

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
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
                      disabled={selectedAnswer !== null}
                      onClick={() => handleChooseAnswer(cIdx)}
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
                        cursor: selectedAnswer === null ? 'pointer' : 'default',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          fontWeight: 900,
                          fontSize: '13px',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0
                        }}
                      >
                        {letters[cIdx]}
                      </div>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: cardTextColor, flex: 1, lineHeight: 1.3 }}>
                        {choiceText}
                      </span>
                      {selectedAnswer !== null && isCorrect && <CheckCircle2 size={18} color="#16a34a" strokeWidth={2.5} />}
                      {selectedAnswer !== null && isSelected && !isCorrect && <XCircle size={18} color="#dc2626" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback banner */}
              {selectedAnswer !== null && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px 14px',
                    background: selectedAnswer === quiz.answer ? '#f0fdf4' : '#fef2f2',
                    border: `2px solid ${selectedAnswer === quiz.answer ? '#86efac' : '#fca5a5'}`,
                    borderRadius: '16px'
                  }}
                >
                  <strong style={{ color: selectedAnswer === quiz.answer ? '#166534' : '#991b1b', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    {selectedAnswer === quiz.answer ? '🎉 Mastered! Outstanding Job!' : '💡 Good Try! Review the Clue:'}
                  </strong>
                  <span style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.4 }}>
                    {quiz.explanation}
                  </span>
                  <button
                    className="glossyPillBtn"
                    onClick={() => {
                      playPop();
                      onClose();
                    }}
                    style={{ width: '100%', marginTop: '10px' }}
                  >
                    Finish & Return to Hub ✓
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
