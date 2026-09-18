import React, { useMemo, useState, useEffect } from 'react';
import { Search, CheckCircle2, Play, ArrowLeft, Volume2, Sparkles, Star, Tag } from 'lucide-react';
import { Card } from '../components/Card';
import { getLessons, grades, subjects } from '../data/curriculum';
import { useApp } from '../store/AppContext';
import { playCorrect, playIncorrect, playPop, fireConfetti, speakText } from '../utils/audio';

export function Learn({ initialSubject = 'all' }) {
  const { child, complete } = useApp();
  const [grade, setGrade] = useState(child.grade);
  const [subject, setSubject] = useState(initialSubject);
  const [query, setQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialSubject]);

  const list = useMemo(() => {
    return getLessons(grade, subject === 'all' ? undefined : subject).filter((l) => {
      const text = `${l.title} ${l.description} ${l.word || ''} ${(l.synonyms || []).join(' ')}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [grade, subject, query]);

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <p className="eyebrow">Interactive Learning Library</p>
          <h1>Explore Grade {grade === 'K' ? 'K' : grade}</h1>
          <p>Master Week 5 vocabulary words, Math operations, Science facts & Social Studies.</p>
        </div>
        <label className="search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words, math, science…"
          />
        </label>
      </div>

      <div className="gradeRail">
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

      <div className="subjectTabs">
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

      <div className="lessonGrid">
        {list.map((l) => {
          const isDone = child.completed.includes(l.id);
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

              <h3>{l.title}</h3>
              <p>{l.description}</p>

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
                    setActiveLesson(l);
                  }}
                >
                  {isDone ? <CheckCircle2 size={14} /> : <Play size={14} />}
                  {isDone ? 'Review' : 'Open'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

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
    <div className="modal">
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
            <Sparkles size={55} />
            <h2>Adventure complete!</h2>
            <p>
              You scored <b>{score}/{lesson.questions.length}</b> and earned <b>+{lesson.xp} XP</b>!
            </p>
            <button
              className="primary"
              onClick={() => {
                playPop();
                done(lesson.xp, lesson.duration);
              }}
            >
              <CheckCircle2 size={18} /> Save progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
