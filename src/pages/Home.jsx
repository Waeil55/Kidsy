import React from 'react';
import { BookOpen, Flame, Star, Trophy, ChevronRight, Play, Target, Clock, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { useApp } from '../store/AppContext';
import { getLessons, subjects } from '../data/curriculum';

export function Home({ go, openSubject }) {
  const { child } = useApp();
  const lessons = getLessons(child.grade);
  const done = child.completed.length;
  const pct = Math.min(100, Math.round((done / Math.max(1, lessons.length)) * 100));

  // Get active quest lesson: first uncompleted lesson, or the first lesson
  const currentLesson = lessons.find((l) => !child.completed.includes(l.id)) || lessons[0];

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Welcome back, {child.name}!</p>
          <h1>Your Grade {child.grade} adventure is ready.</h1>
          <p>Master Week 5 vocabulary words, explore Math & Science, and keep your streak alive!</p>
          <button className="primary" onClick={() => go('learn')}>
            <Play size={18} /> Start learning
          </button>
        </div>
        <div className="heroArt">{child.avatar}</div>
      </section>

      <div className="stats">
        <Card>
          <Flame />
          <b>{child.streak}</b>
          <span>day streak</span>
        </Card>
        <Card>
          <Star />
          <b>{child.xp}</b>
          <span>XP earned</span>
        </Card>
        <Card>
          <Trophy />
          <b>{done}</b>
          <span>lessons done</span>
        </Card>
      </div>

      <div className="sectionTitle">
        <div>
          <p className="eyebrow">Today's Focus</p>
          <h2>Recommended Lesson</h2>
        </div>
        <button className="textBtn" onClick={() => go('learn')}>
          View all <ChevronRight size={15} />
        </button>
      </div>

      {currentLesson && (
        <Card className="lesson">
          <div className="lessonIcon">{currentLesson.emoji || '🚀'}</div>
          <div className="grow">
            <span className="pill">
              {currentLesson.difficulty || 'Featured'} · {currentLesson.duration || 10} min
            </span>
            <h3>{currentLesson.title}</h3>
            <p>{currentLesson.description}</p>
            <small>
              <Target size={13} /> {pct}% curriculum progress ({done}/{lessons.length} complete)
            </small>
          </div>
          <button className="round" onClick={() => go('learn')} title="Start Lesson">
            <ChevronRight />
          </button>
        </Card>
      )}

      <div className="sectionTitle">
        <div>
          <p className="eyebrow">Explore Subjects</p>
          <h2>Grade {child.grade} Curriculum</h2>
        </div>
      </div>

      <div className="subjectGrid">
        {subjects.slice(0, 6).map((s) => {
          const subLessons = lessons.filter((l) => l.subject === s.id);
          return (
            <button
              key={s.id}
              className="subject"
              onClick={() => {
                if (openSubject) openSubject(s.id);
                go('learn');
              }}
            >
              <span>{s.icon}</span>
              <strong>{s.name}</strong>
              <small>{subLessons.length} lessons</small>
            </button>
          );
        })}
      </div>

      <div className="sectionTitle">
        <h2>Quick stats</h2>
      </div>
      <div className="miniGrid">
        <Card>
          <Clock />
          <b>{child.minutes} min</b>
          <span>learning time</span>
        </Card>
        <Card>
          <BookOpen />
          <b>{lessons.length}</b>
          <span>lessons available</span>
        </Card>
      </div>
    </div>
  );
}
