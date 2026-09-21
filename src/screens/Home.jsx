import React from 'react';
import { LuPlay, LuFlame, LuTarget, LuMap } from 'react-icons/lu';
import { useStore, currentLevel, gradeSummary, levelStats, STICKERS } from '../store/store.js';
import { GRADE_BY_KEY, chapterOf } from '../data/grades.js';
import { Link } from '../ui/router.js';
import { Bar, Stars, Ring } from '../ui/ui.jsx';

const TILES = [
  ['/map', '📖', 'Stories', '500 stories, 20 questions each', 't1'],
  ['/practice', '🔢', 'Math', '500 problems, 50 levels', 't2'],
  ['/words', '🔤', 'Vocabulary', 'Word bank and flashcards', 't3'],
  ['/practice', '✏️', 'Grammar & fill-in', 'Sentences and blanks', 't4'],
  ['/exam', '🎓', 'Exams', 'Mixed tests with results', 't1'],
  ['/index', '📚', 'Big index', 'Search everything', 't2'],
  ['/merola', '🧠', 'Merola library', 'Extra lessons and reading', 't1'],
  ['/upload', '📤', 'Upload a lesson', 'PDF, Word or text from school', 't3'],
  ['/studio', '✏️', 'Studio', 'Make cards, stories, quizzes', 't4'],
];

export default function Home() {
  const { state } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const lv = currentLevel(state, g.key);
  const sum = gradeSummary(state, g.key);
  const ls = levelStats(state, g.key, lv);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const d = state.daily.date === new Date().toISOString().slice(0, 10) ? state.daily : { correct: 0, wrong: 0 };
  const chapter = chapterOf(g.key, lv);
  const tiles = state.gradeKey === 'G3' ? [['/g3pack', '📘', 'Grade 3 ELA pack', 'Your PDF study guide, in full', 't1'], ...TILES] : TILES;

  return (
    <>
      <section className="hero">
        <span className="emoji" aria-hidden="true">{g.emoji}</span>
        <span className="pill w">{g.label} · age {g.age}</span>
        <h1 style={{ margin: '10px 0 6px' }}>{greet}, {state.profile.name}!</h1>
        <p style={{ maxWidth: 560, opacity: .95, fontSize: '1.1rem' }}>Ready to keep going in <b>{chapter}</b>? You are on level <b>{lv}</b> of 50.</p>
        <div className="row wrap" style={{ marginTop: 20 }}>
          <Link to={`/level/${lv}`} className="btn white"><LuPlay /> Continue level {lv}</Link>
          <Link to="/map" className="btn ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}><LuMap /> Adventure map</Link>
        </div>
        <div className="row wrap" style={{ marginTop: 22, gap: 10 }}>
          <span className="pill w"><LuFlame size={15} /> Streak {state.stats.streak}</span>
          <span className="pill w"><LuTarget size={15} /> Today: {d.correct} right, {d.wrong} missed</span>
          <span className="pill w">🎒 {sum.cleared}/50 levels cleared</span>
        </div>
      </section>

      <section className="grid g4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))' }}>
        {tiles.map(([to, e, t, s, cls]) => (
          <Link key={t} to={to} className={`tile ${cls}`}><span className="ico">{e}</span><b>{t}</b><span>{s}</span></Link>
        ))}
      </section>

      <section className="grid g2">
        <div className="card">
          <div className="row"><h3 className="grow">Your {g.short} adventure</h3><Stars n={Math.min(3, Math.round(sum.stars / 50))} /></div>
          <p className="muted" style={{ margin: '6px 0 14px' }}>{g.reading}</p>
          <div className="row gap20">
            <Ring pct={Math.round((sum.cleared / 50) * 100)} />
            <div className="grow col gap8">
              <div className="tiny muted">Level {lv} progress: {ls.stories}/10 stories done</div>
              <Bar pct={ls.stories * 10} />
              <div className="tiny muted">⭐ {sum.stars} of {sum.maxStars} level stars · 📖 {sum.storiesDone} stories finished</div>
            </div>
          </div>
        </div>
        <div className="card">
          <h3>Sticker stash</h3>
          <p className="muted tiny" style={{ marginBottom: 10 }}>{state.stickers.length} of {STICKERS.length} collected</p>
          <div className="row wrap" style={{ gap: 8 }}>
            {STICKERS.slice(0, 12).map((s) => <span key={s.id} title={s.name} style={{ fontSize: 30, filter: state.stickers.includes(s.id) ? 'none' : 'grayscale(1) opacity(.25)' }}>{s.e}</span>)}
          </div>
          <Link to="/rewards" className="btn soft sm" style={{ marginTop: 14 }}>Open my stash</Link>
        </div>
      </section>
    </>
  );
}
