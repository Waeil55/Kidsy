import React from 'react';
import { LuBookOpen, LuFlame, LuGift, LuMic, LuPalette, LuPlay, LuPuzzle, LuSparkles, LuStar, LuVolume2 } from 'react-icons/lu';
import { useStore, currentLevel, gradeSummary } from '../store/store.js';
import { GRADE_BY_KEY, chapterOf } from '../data/grades.js';
import { Link } from '../ui/router.js';
import { speak } from '../lib/speech.js';

export default function Home() {
  const { state } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const lv = currentLevel(state, g.key);
  const sum = gradeSummary(state, g.key);
  const d = state.daily.date === new Date().toISOString().slice(0, 10) ? state.daily : { correct: 0, wrong: 0 };
  const chapter = chapterOf(g.key, lv);

  const sayMascot = () => {
    speak(`Hi ${state.profile.name}! I am your learning buddy. Ready to have fun and explore today?`, { rate: state.settings.rate });
  };

  return (
    <div className="home-screen-bf">
      {/* Hanging clubhouse banner & mascot */}
      <header className="bf-hero-bar">
        <div className="bf-branch">
          <span className="bf-leaf l1">🍃</span>
          <div className="bf-sign">
            <span>Kidsy</span>
          </div>
          <span className="bf-leaf l2">🍃</span>
        </div>

        <div className="bf-mascot-row">
          <button className="bf-mascot-avatar" onClick={sayMascot} aria-label="Tap mascot to hear greeting" title="Tap to hear me!">
            <span className="bf-avatar-emoji">{state.profile.avatar || '🦊'}</span>
            <span className="bf-mascot-mic"><LuVolume2 size={14} /></span>
          </button>
          <div className="bf-mascot-info">
            <button className="bf-tap-bubble" onClick={sayMascot}>
              <span>Tap to hear me!</span>
            </button>
            <div className="bf-badge-row">
              <span className="bf-pill-age">For ages {g.age}</span>
              <span className="bf-streak-pill"><LuFlame /> {state.stats.streak}</span>
              <span className="bf-score-pill"><LuStar /> {state.score.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cheerful Question Heading */}
      <div className="bf-heading-section">
        <h1 className="bf-title">What do you want to do?</h1>
      </div>

      {/* 2x2 Chunky Playful Activity Cards (Numbers, Reading, Puzzles, Drawing) */}
      <section className="bf-activity-grid" aria-label="Main activities">
        {/* 1. Numbers / Math */}
        <Link to={`/play/math/${lv}`} className="bf-card bf-orange" aria-label="Numbers and Math">
          <div className="bf-card-head">
            <span className="bf-card-title">Numbers</span>
          </div>
          <div className="bf-card-art">
            <span className="bf-toy-numbers" aria-hidden="true">123</span>
          </div>
          <span className="bf-card-sub">Math & Counting</span>
        </Link>

        {/* 2. Reading / Stories */}
        <Link to={`/map`} className="bf-card bf-blue" aria-label="Reading and Stories">
          <div className="bf-card-head">
            <span className="bf-card-title">Reading</span>
          </div>
          <div className="bf-card-art">
            <span className="bf-toy-book" aria-hidden="true">📖</span>
          </div>
          <span className="bf-card-sub">Stories & Adventures</span>
        </Link>

        {/* 3. Puzzles / Practice */}
        <Link to="/practice" className="bf-card bf-green" aria-label="Puzzles and Practice">
          <div className="bf-card-head">
            <span className="bf-card-title">Puzzles</span>
          </div>
          <div className="bf-card-art">
            <span className="bf-toy-puzzle" aria-hidden="true">🧩</span>
          </div>
          <span className="bf-card-sub">Brain Games</span>
        </Link>

        {/* 4. Drawing / Words */}
        <Link to="/words" className="bf-card bf-purple" aria-label="Words and Flashcards">
          <div className="bf-card-head">
            <span className="bf-card-title">Drawing</span>
          </div>
          <div className="bf-card-art">
            <span className="bf-toy-pencil" aria-hidden="true">✏️</span>
          </div>
          <span className="bf-card-sub">Words & Flashcards</span>
        </Link>
      </section>

      {/* Compact Secondary Launch Strip: Continue level & daily mystery */}
      <section className="bf-sub-strip">
        <Link to={`/level/${lv}`} className="bf-continue-pill" aria-label="Continue current adventure">
          <span className="bf-play-disc"><LuPlay size={16} /></span>
          <div className="bf-continue-text">
            <b>Continue Chapter {lv}</b>
            <small>{chapter}</small>
          </div>
        </Link>

        <Link to="/rewards" className="bf-mystery-pill" aria-label="Daily mystery gift">
          <span className="bf-gift-icon"><LuGift size={16} /></span>
          <div className="bf-mystery-text">
            <b>Daily Mystery Box</b>
            <small>{d.correct + d.wrong} / 3 done</small>
          </div>
        </Link>
      </section>
    </div>
  );
}
