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

            <h2>{lesson.title}</h2>
            <p className="question" style={{ whiteSpace: 'pre-line' }}>
              {question.prompt}
            </p>

            <div className="choices">
              {question.choices.map((choiceText, cIdx) => {
                let statusClass = '';
                if (answeredIndex !== null) {
                  if (cIdx === question.answer) statusClass = 'correct';
                  else if (cIdx === answeredIndex) statusClass = 'wrong';
                }
                return (
                  <button
                    key={cIdx}
                    className={statusClass}
                    onClick={() => choose(cIdx)}
                  >
                    {choiceText}
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
