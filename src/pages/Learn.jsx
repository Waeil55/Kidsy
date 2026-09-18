import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Play,
  ArrowLeft,
  Volume2,
  Sparkles,
  Star,
  Tag,
  BookOpen,
  Brain,
  Layers,
  Award,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { Card } from '../components/Card';
import { getLessons, grades, subjects } from '../data/curriculum';
import { WORD_ENCYCLOPEDIA, searchEncyclopedia } from '../data/wordEncyclopedia';
import { AITeacherModal } from '../components/AITeacherModal';
import { useApp } from '../store/AppContext';
import { playCorrect, playIncorrect, playPop, fireConfetti, speakText } from '../utils/audio';

export function Learn({ initialSubject = 'all' }) {
  const { child, complete } = useApp();

  // Mode: 'curriculum' | 'encyclopedia' | 'arena'
  const [activeTab, setActiveTab] = useState('encyclopedia');

  // Curriculum State
  const [grade, setGrade] = useState(child.grade || '3');
  const [subject, setSubject] = useState(initialSubject);
  const [query, setQuery] = useState('');

  // Encyclopedia State
  const [dictQuery, setDictQuery] = useState('');
  const [selectedWordEntry, setSelectedWordEntry] = useState(null);

  // Arena Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Lesson Player State
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (initialSubject && initialSubject !== 'all') {
      setSubject(initialSubject);
      setActiveTab('curriculum');
    }
  }, [initialSubject]);

  // Filtered curriculum lessons
  const lessonList = useMemo(() => {
    return getLessons(grade, subject === 'all' ? undefined : subject).filter((l) => {
      const text = `${l.title} ${l.description} ${l.word || ''} ${(l.synonyms || []).join(' ')}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [grade, subject, query]);

  // Filtered encyclopedia words
  const encyclopediaResults = useMemo(() => {
    return searchEncyclopedia(dictQuery);
  }, [dictQuery]);

  const currentFlashcard = WORD_ENCYCLOPEDIA[cardIndex % WORD_ENCYCLOPEDIA.length];

  const handleOpenWordEntry = (entry) => {
    playPop();
    setSelectedWordEntry(entry);
  };

  const handleSpeak = (text) => {
    playPop();
    speakText(text);
  };

  return (
    <div className="page" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Page Header */}
      <div className="pageHead" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, marginBottom: '6px' }}>
            <Sparkles size={13} />
            <span>AI MASTER TEACHER SUITE</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '2px 0 6px', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Intelligent Learning Hub
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px' }}>
            Master Week 5 vocabulary with mnemonic superpowers, phonics audio, and interactive AI teacher lessons.
          </p>
        </div>
      </div>

      {/* Main Tool Mode Navigation Switcher */}
      <div
        style={{
          display: 'flex',
          background: '#e2e8f0',
          padding: '4px',
          borderRadius: '16px',
          gap: '4px',
          marginBottom: '16px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <button
          onClick={() => {
            playPop();
            setActiveTab('encyclopedia');
          }}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'encyclopedia' ? '#ffffff' : 'transparent',
            color: activeTab === 'encyclopedia' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'encyclopedia' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '12.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <BookOpen size={16} color={activeTab === 'encyclopedia' ? '#0284c7' : '#64748b'} />
          <span>AI Word Index</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('curriculum');
          }}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'curriculum' ? '#ffffff' : 'transparent',
            color: activeTab === 'curriculum' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'curriculum' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '12.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={16} color={activeTab === 'curriculum' ? '#0284c7' : '#64748b'} />
          <span>Curriculum Journey</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('arena');
          }}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'arena' ? '#ffffff' : 'transparent',
            color: activeTab === 'arena' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'arena' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '12.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <Brain size={16} color={activeTab === 'arena' ? '#0284c7' : '#64748b'} />
          <span>Flashcard Arena</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODE 1: AI WORD ENCYCLOPEDIA (EXPANSIVE WORD INDEX & DICTIONARY)     */}
      {/* ==================================================================== */}
      {activeTab === 'encyclopedia' && (
        <div>
          {/* Smart Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              border: '2px solid #cbd5e1',
              borderRadius: '16px',
              padding: '10px 14px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <Search size={18} color="#0284c7" />
            <input
              type="text"
              value={dictQuery}
              onChange={(e) => setDictQuery(e.target.value)}
              placeholder="Search words (oppose, snide, heap, diverse, origin)..."
              style={{
                border: 0,
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                fontWeight: 650,
                background: 'transparent'
              }}
            />
            {dictQuery && (
              <button
                onClick={() => setDictQuery('')}
                style={{ border: 0, background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '13px', fontWeight: 800 }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Word Pills Filter */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px', minWidth: 0 }}>
            {['All Words', 'oppose', 'snide', 'heap', 'diverse', 'origin'].map((w) => {
              const isSelected = (w === 'All Words' && !dictQuery) || dictQuery.toLowerCase() === w.toLowerCase();
              return (
                <button
                  key={w}
                  onClick={() => {
                    playPop();
                    setDictQuery(w === 'All Words' ? '' : w);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '99px',
                    border: isSelected ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                    background: isSelected ? '#e0f2fe' : '#ffffff',
                    color: isSelected ? '#0369a1' : '#475569',
                    fontSize: '12px',
                    fontWeight: 850,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {w}
                </button>
              );
            })}
          </div>

          {/* Results Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
            {encyclopediaResults.map((entry) => (
              <div
                key={entry.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '16px',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                          {entry.word}
                        </h3>
                        <button
                          onClick={() => handleSpeak(entry.word)}
                          style={{
                            background: '#e0f2fe',
                            border: 0,
                            color: '#0284c7',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer'
                          }}
                          title="Listen"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>
                        {entry.phonetic} · {entry.partOfSpeech}
                      </div>
                    </div>

                    <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 900 }}>
                      Gr {entry.grade}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#334155', margin: '8px 0', lineHeight: 1.35, fontWeight: 650 }}>
                    {entry.kidDefinition}
                  </p>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      fontSize: '11.5px',
                      color: '#475569',
                      lineHeight: 1.35,
                      borderLeft: '3px solid #0284c7',
                      marginBottom: '8px'
                    }}
                  >
                    <strong>Mnemonic:</strong> {entry.mnemonicTrick}
                  </div>
                </div>

                <button
                  className="primary full"
                  onClick={() => handleOpenWordEntry(entry)}
                  style={{
                    padding: '9px 12px',
                    fontSize: '12.5px',
                    fontWeight: 850,
                    borderRadius: '12px',
                    marginTop: '8px'
                  }}
                >
                  <Sparkles size={15} /> Learn with AI Master Teacher
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 2: CURRICULUM JOURNEY (GRADES & SUBJECTS)                       */}
      {/* ==================================================================== */}
      {activeTab === 'curriculum' && (
        <div>
          {/* Grade Selector */}
          <div className="gradeRail" style={{ maxWidth: '100%', minWidth: 0 }}>
            {grades.map((x) => (
              <button
                key={x}
                className={grade === x ? 'selected' : ''}
                onClick={() => {
                  playPop();
                  setGrade(x);
                }}
              >
                Grade {x}
              </button>
            ))}
          </div>

          {/* Subject Tabs */}
          <div className="subjectTabs" style={{ maxWidth: '100%', minWidth: 0 }}>
            <button
              className={subject === 'all' ? 'selected' : ''}
              onClick={() => {
                playPop();
                setSubject('all');
              }}
            >
              All subjects
            </button>
            {subjects.map((x) => (
              <button
                key={x.id}
                className={subject === x.id ? 'selected' : ''}
                onClick={() => {
                  playPop();
                  setSubject(x.id);
                }}
              >
                {x.icon} {x.name}
              </button>
            ))}
          </div>

          {/* Lessons Grid */}
          <div className="lessonGrid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {lessonList.map((l) => {
              const isDone = child.completed.includes(l.id);
              // Check if matching word in encyclopedia exists
              const matchedWord = WORD_ENCYCLOPEDIA.find((w) => w.word.toLowerCase() === (l.word || l.title).toLowerCase());

              return (
                <Card key={l.id}>
                  <div className="cardTop">
                    <span>
                      {subjects.find((x) => x.id === l.subject)?.icon}{' '}
                      {subjects.find((x) => x.id === l.subject)?.name || l.subject}
                    </span>
                    <span>{l.duration} min</span>
                  </div>

                  {l.imageUrl ? (
                    <img src={l.imageUrl} alt={l.title} className="lessonImg" loading="lazy" />
                  ) : (
                    <div className="bigEmoji">{l.emoji}</div>
                  )}

                  <h3 style={{ fontSize: '18px', fontWeight: 850 }}>{l.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{l.description}</p>

                  {(l.synonyms?.length > 0 || l.partOfSpeech) && (
                    <div className="metaPills">
                      {l.partOfSpeech && <span className="tagPill pos">{l.partOfSpeech}</span>}
                      {l.synonyms?.slice(0, 2).map((s) => (
                        <span key={s} className="tagPill syn">
                          syn: {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="cardFoot">
                    <span className="pill">+{l.xp} XP</span>
                    <button
                      className="primary small"
                      onClick={() => {
                        playPop();
                        if (matchedWord) {
                          setSelectedWordEntry(matchedWord);
                        } else {
                          setActiveLesson(l);
                        }
                      }}
                    >
                      {isDone ? <CheckCircle2 size={14} /> : <Play size={14} />}
                      {matchedWord ? 'AI Teach' : isDone ? 'Review' : 'Open'}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 3: FLASHCARD ARENA                                              */}
      {/* ==================================================================== */}
      {activeTab === 'arena' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>
              Card {((cardIndex % WORD_ENCYCLOPEDIA.length) + 1)} of {WORD_ENCYCLOPEDIA.length} · Tap Card to Flip
            </div>

            {/* Interactive Flip Card */}
            <div
              onClick={() => {
                playPop();
                setCardFlipped(!cardFlipped);
              }}
              style={{
                minHeight: '220px',
                background: cardFlipped ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'linear-gradient(135deg, #ffffff, #f0f9ff)',
                color: cardFlipped ? '#ffffff' : '#0f172a',
                border: cardFlipped ? '2px solid #334155' : '2px solid #bae6fd',
                borderRadius: '24px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '14px', right: '16px', fontSize: '11px', fontWeight: 900, color: cardFlipped ? '#38bdf8' : '#0284c7' }}>
                {cardFlipped ? '🧠 MEMORY BACK' : '🔍 FRONT'}
              </div>

              {!cardFlipped ? (
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 6px', color: '#0284c7' }}>
                    {currentFlashcard.word}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700 }}>
                    {currentFlashcard.phonetic} · {currentFlashcard.partOfSpeech}
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                    Tap card to reveal definition & mnemonic!
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Kid-Friendly Definition
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 750, margin: '0 0 12px', lineHeight: 1.4, color: '#f8fafc' }}>
                    &ldquo;{currentFlashcard.kidDefinition}&rdquo;
                  </p>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: '#fde68a' }}>
                    💡 {currentFlashcard.mnemonicTrick}
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  playPop();
                  setCardFlipped(false);
                  setCardIndex((i) => (i - 1 + WORD_ENCYCLOPEDIA.length) % WORD_ENCYCLOPEDIA.length);
                }}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '14px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                ← Previous
              </button>

              <button
                onClick={() => handleSpeak(`${currentFlashcard.word}. ${currentFlashcard.kidDefinition}`)}
                style={{
                  background: '#e0f2fe',
                  border: '1.5px solid #bae6fd',
                  borderRadius: '14px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#0369a1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Volume2 size={16} /> Listen
              </button>

              <button
                onClick={() => {
                  playPop();
                  setCardFlipped(false);
                  setCardIndex((i) => (i + 1) % WORD_ENCYCLOPEDIA.length);
                }}
                className="glossyPillBtn"
                style={{ padding: '10px 20px', fontSize: '13px' }}
              >
                Next Card →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Master Teacher Modal */}
      {selectedWordEntry && (
        <AITeacherModal
          entry={selectedWordEntry}
          onClose={() => setSelectedWordEntry(null)}
          onMasteryComplete={(entryId) => {
            complete(`word-${entryId}`, 25, 4);
          }}
        />
      )}

      {/* Standard Lesson Player */}
      {activeLesson && (
        <LessonPlayer
          lesson={activeLesson}
          close={() => {
            playPop();
            setActiveLesson(null);
          }}
          done={(xp, min) => {
            complete(activeLesson.id, xp, min);
            setActiveLesson(null);
          }}
        />
      )}
    </div>
  );
}

function LessonPlayer({ lesson, close, done }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredIndex, setAnsweredIndex] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = lesson.questions[index] || {
    prompt: `What did you learn about ${lesson.title}?`,
    choices: [lesson.description, 'None of the above', 'Skip', 'Try later'],
    answer: 0,
    explanation: lesson.description
  };

  const handleReadAloud = () => {
    const textToRead = `${question.prompt}. Choices are: ${question.choices.join(', ')}`;
    speakText(textToRead);
  };

  const choose = (choiceIdx) => {
    if (answeredIndex !== null) return;
    setAnsweredIndex(choiceIdx);
    if (choiceIdx === question.answer) {
      playCorrect();
      setScore((v) => v + 1);
    } else {
      playIncorrect();
    }
  };

  const next = () => {
    playPop();
    if (index < lesson.questions.length - 1) {
      setIndex((v) => v + 1);
      setAnsweredIndex(null);
    } else {
      fireConfetti(true);
      setFinished(true);
    }
  };

  return (
    <div className="modal" style={{ zIndex: 90 }}>
      <div className="modalPanel">
        <button
          onClick={close}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#eff6ff',
            color: '#1d4ed8',
            border: '1.5px solid #bfdbfe',
            borderRadius: '12px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>← Back to Lessons</span>
        </button>

        {!finished ? (
          <>
            <div className="playerTop">
              <span className="pill">
                Question {index + 1} of {lesson.questions.length}
              </span>
              <button
                className="iconBtn"
                onClick={handleReadAloud}
                title="Read question aloud"
              >
                <Volume2 size={18} />
              </button>
            </div>

            {lesson.imageUrl ? (
              <img src={lesson.imageUrl} alt={lesson.title} className="playerImg" />
            ) : (
              <div className="bigEmoji">{lesson.emoji}</div>
            )}

            {/* Question Board (Dark High-Contrast Card) */}
            <div
              style={{
                background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '18px',
                padding: '14px 16px',
                border: '2px solid #334155',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)',
                margin: '12px 0 16px',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '99px',
                    fontSize: '9.5px',
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}
                >
                  QUESTION BOARD
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>
                  {lesson.title}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 750,
                  lineHeight: 1.45,
                  color: '#f8fafc',
                  whiteSpace: 'pre-line'
                }}
              >
                {question.prompt}
              </p>
            </div>

            {/* Answer Choices (Tactile 3D Buttons with Badges) */}
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Choose your answer:
            </div>
            <div className="choices" style={{ display: 'grid', gap: '8px' }}>
              {question.choices.map((choiceText, cIdx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const letterStyles = [
                  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
                  { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
                  { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
                  { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' }
                ];
                const lStyle = letterStyles[cIdx % letterStyles.length];

                let cardBg = '#ffffff';
                let cardBorder = '#e2e8f0';
                let cardBottom = '#cbd5e1';
                let cardTextColor = '#1e293b';

                if (answeredIndex !== null) {
                  if (cIdx === question.answer) {
                    cardBg = '#f0fdf4';
                    cardBorder = '#86efac';
                    cardBottom = '#22c55e';
                    cardTextColor = '#14532d';
                  } else if (cIdx === answeredIndex) {
                    cardBg = '#fef2f2';
                    cardBorder = '#fca5a5';
                    cardBottom = '#ef4444';
                    cardTextColor = '#7f1d1d';
                  }
                }

                return (
                  <button
                    key={cIdx}
                    disabled={answeredIndex !== null}
                    onClick={() => choose(cIdx)}
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
                      cursor: answeredIndex === null ? 'pointer' : 'default',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.03)',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '10px',
                        background: lStyle.bg,
                        border: `1.5px solid ${lStyle.border}`,
                        color: lStyle.text,
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
                  </button>
                );
              })}
            </div>

            {answeredIndex !== null && (
              <div className="feedback">
                <strong>
                  {answeredIndex === question.answer ? '🎉 Great job!' : '💡 Keep trying!'}
                </strong>
                <span>{question.explanation}</span>
                <button className="primary" onClick={next}>
                  {index === lesson.questions.length - 1 ? 'Finish Lesson' : 'Next Question'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="finish">
            <Trophy size={60} color="#10b981" />
            <h2>Lesson Completed!</h2>
            <p>You earned +{lesson.xp} XP and advanced your learning streak!</p>
            <button
              className="primary"
              onClick={() => done(lesson.xp, lesson.duration)}
            >
              Collect Rewards & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
