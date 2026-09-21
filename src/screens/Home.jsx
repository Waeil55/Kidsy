import React from 'react';
import { LuArrowRight, LuBookOpen, LuCheck, LuFlame, LuGift, LuLock, LuMap, LuPalette, LuPlay, LuSparkles, LuStar } from 'react-icons/lu';
import { useStore, currentLevel, gradeSummary, STICKERS } from '../store/store.js';
import { GRADE_BY_KEY, chapterOf } from '../data/grades.js';
import { Link } from '../ui/router.js';
import { Bar } from '../ui/ui.jsx';

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
  const d = state.daily.date === new Date().toISOString().slice(0, 10) ? state.daily : { correct: 0, wrong: 0 };
  const chapter = chapterOf(g.key, lv);
  const mapNodes = [
    ['/map', <LuBookOpen />, 'Stories', 'done'],
    ['/practice', <LuSparkles />, 'Word garden', 'done'],
    ['/words', <LuPalette />, 'Word art', 'current'],
    ['/practice', <LuMap />, 'Number cove', 'new'],
    ['/exam', <LuLock />, 'Mystery island', 'locked'],
  ];
  const quickActions = [
    ['/practice', <LuSparkles />, 'Practice', 'pink'],
    ['/rewards', <LuGift />, 'Stickers', 'orange'],
    ['/reels', <LuPlay />, 'Study break', 'blue'],
  ];

  return (
    <div className="home-screen">
      <section className="home-welcome">
        <div className="home-avatar">{state.profile.avatar || 'L'}</div>
        <div className="home-hello"><span>Hi adventurer,</span><b>{state.profile.name}!</b></div>
        <div className="home-stats"><span><LuFlame /> {state.stats.streak}</span><span><LuStar /> {state.score.toLocaleString()}</span></div>
      </section>

      <section className="mission-card">
        <div className="mission-copy"><span>Chapter {lv} · {chapter}</span><h1>Rescue the<br />star whale</h1><Link to={`/level/${lv}`} className="mission-button"><LuPlay size={15} /> Continue</Link></div>
        <div className="whale-art" aria-hidden="true">🐳<i>✦</i><em>✦</em></div>
      </section>

      <section className="home-section-head"><div><span className="eyebrow">{g.label} adventure</span><h2>Adventure map</h2><small>{Math.min(5, Math.max(3, Math.ceil(sum.cleared / 10)))} of 6 islands explored</small></div><Link to="/map" className="see-all">See all <LuArrowRight /></Link></section>
      <section className="adventure-map" aria-label="Adventure map">
        <div className="map-path" aria-hidden="true" />
        {mapNodes.map(([to, icon, label, kind], index) => <Link key={label} to={to} className={`map-node ${kind}`}><span className="map-disc">{kind === 'locked' ? <LuLock /> : icon}{kind === 'done' && <b><LuCheck /></b>}{kind === 'new' && <small>NEW!</small>}</span><strong>{label}</strong></Link>)}
      </section>

      <section className="quick-actions">{quickActions.map(([to, icon, label, kind]) => <Link key={label} to={to} className={`quick-action ${kind}`}><span>{icon}</span><b>{label}</b></Link>)}</section>

      <section className="mystery-card"><span className="mystery-icon"><LuGift /></span><div><b>Daily mystery box</b><small>{d.correct + d.wrong} of 3 challenges done · Opens tomorrow</small><div className="mystery-progress"><i style={{ width: `${Math.min(100, ((d.correct + d.wrong) / 3) * 100)}%` }} /></div></div><LuArrowRight className="mystery-arrow" /></section>

      <section className="collection-strip"><div className="home-section-head"><div><span className="eyebrow">Your collection</span><h2>Sticker stash</h2></div><Link to="/rewards" className="see-all">View all <LuArrowRight /></Link></div><div className="sticker-row">{STICKERS.slice(0, 4).map((s) => <div key={s.id} className={`sticker-mini ${state.stickers.includes(s.id) ? '' : 'locked'}`}><span>{s.e}</span><b>{state.stickers.includes(s.id) ? s.name : '???'}</b></div>)}</div></section>

      <div className="home-progress"><span>{sum.cleared}/50 levels cleared</span><Bar pct={(sum.cleared / 50) * 100} /><small>{g.reading}</small></div>
    </div>
  );
}
