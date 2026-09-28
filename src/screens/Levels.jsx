import React, { useState } from 'react';
import { LuLock, LuPlay, LuCheck, LuArrowRight } from 'react-icons/lu';
import { useStore, levelStats, levelUnlocked, currentLevel, storyRec } from '../store/store.js';
import { GRADE_BY_KEY, chapterOf } from '../data/grades.js';
import { storiesInLevel, storyNo } from '../engine/stories.js';
import { Link, go } from '../ui/router.js';
import { Stars, Crumb, Bar, Notice } from '../ui/ui.jsx';

export function MapScreen() {
  const { state, dispatch } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const cur = currentLevel(state, g.key);
  const [ch, setCh] = useState(Math.floor((cur - 1) / 10));
  const levels = Array.from({ length: 10 }, (_, i) => ch * 10 + i + 1);
  return (
    <>
      <div className="col">
        <h1>{g.emoji} {g.label} adventure</h1>
        <p className="muted">50 levels. Each level has 10 stories, 10 math problems and 10 fill-in-the-blanks. Clear a level to open the next one.</p>
      </div>
      <div className="chapters" role="tablist">
        {g.chapters.map((c, i) => {
          const done = Array.from({ length: 10 }, (_, k) => levelStats(state, g.key, i * 10 + k + 1).cleared).filter(Boolean).length;
          return <button key={c} className={i === ch ? 'on' : ''} onClick={() => setCh(i)} role="tab" aria-selected={i === ch}>{['🌲', '🏖️', '🏰', '🌋', '🚀'][i]} {c}<small>Levels {i * 10 + 1}–{i * 10 + 10} · {done}/10</small></button>;
        })}
      </div>
      <div className="card">
        <div className="trail">
          {levels.map((l) => {
            const ls = levelStats(state, g.key, l);
            const open = levelUnlocked(state, g.key, l);
            const cls = !open ? 'locked' : ls.cleared ? 'cleared' : l === cur ? 'cur' : '';
            return (
              <button key={l} className={`node ${cls}`} onClick={() => open && go(`/level/${l}`)} aria-label={`Level ${l}${open ? '' : ' (locked)'}`} disabled={!open}>
                <span className="disc">{open ? (ls.cleared ? <LuCheck size={34} /> : l) : <LuLock size={28} />}</span>
                {open ? <Stars n={ls.stars} /> : <small>Locked</small>}
                <small>Level {l}</small>
              </button>
            );
          })}
        </div>
      </div>
      {!state.settings.openLevels && <Notice>Tip: a grown-up can open every level at once in <Link to="/me">Me &amp; settings</Link>.</Notice>}
    </>
  );
}

export function LevelScreen({ level }) {
  const { state } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const lv = Math.max(1, Math.min(50, level));
  const open = levelUnlocked(state, g.key, lv);
  const ls = levelStats(state, g.key, lv);
  const stories = storiesInLevel(g.key, lv);
  if (!open) {
    return (
      <>
        <Crumb to="/map">Adventure map</Crumb>
        <div className="card col gap16" style={{ textAlign: 'center', padding: '36px 20px', alignItems: 'center' }}>
          <span style={{ fontSize: '3.5rem' }}>🔒</span>
          <h2 style={{ margin: 0 }}>Level {lv} is locked</h2>
          <p className="muted" style={{ maxWidth: 420 }}>Complete Level {lv - 1} first to unlock this adventure, or ask a grown-up to open all levels.</p>
          <div className="row wrap gap12" style={{ justifyContent: 'center', marginTop: 8 }}>
            <Link to={`/level/${lv - 1}`} className="btn pri" style={{ fontWeight: 800 }}>Play Level {lv - 1} <LuArrowRight /></Link>
            <Link to="/map" className="btn ghost">Go to Adventure Map</Link>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Crumb to="/map">Adventure map</Crumb>

      {ls.cleared && lv < 50 && (
        <div className="card level-cleared-banner" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', padding: '18px 24px', borderRadius: 20, marginBottom: 16 }}>
          <div className="row wrap" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
            <div className="row gap12" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>🎉</span>
              <div>
                <h2 style={{ margin: 0, color: '#fff' }}>Level {lv} Complete!</h2>
                <p style={{ margin: '4px 0 0 0', opacity: 0.95, fontSize: '0.95rem' }}>Great job! Level {lv + 1} is now unlocked.</p>
              </div>
            </div>
            <Link to={`/level/${lv + 1}`} className="btn white" style={{ fontWeight: 800, fontSize: '1.05rem', padding: '10px 22px' }}>
              Next: Level {lv + 1} <LuArrowRight />
            </Link>
          </div>
        </div>
      )}

      <section className="hero">
        <span className="pill w">{chapterOf(g.key, lv)}</span>
        <h1 style={{ margin: '8px 0' }}>Level {lv}</h1>
        <div className="row wrap"><Stars n={ls.stars} /> <span>{ls.stories}/10 stories · {ls.activitiesDone} practice sets completed</span></div>
        <div style={{ maxWidth: 420, marginTop: 14 }}><Bar pct={Math.min(100, Math.max(ls.stories * 10, ls.cleared ? 100 : ls.activitiesDone * 25))} /></div>
        <div className="row wrap gap8" style={{ marginTop: 12 }}>
          {lv < 50 && (ls.cleared || levelUnlocked(state, g.key, lv + 1)) && (
            <Link to={`/level/${lv + 1}`} className="btn white sm" style={{ fontWeight: 800 }}>
              Move to Level {lv + 1} <LuArrowRight />
            </Link>
          )}
          <Link to="/map" className="btn ghost white sm">Map</Link>
        </div>
      </section>

      <section className="col">
        <h2>📖 Stories <span className="tiny muted">(each has 20 questions in 2 sets of 10)</span></h2>
        <div className="grid gauto" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
          {stories.map((s) => {
            const r = storyRec(state, g.key, s.n);
            return (
              <Link key={s.id} to={`/read/${g.key}/${s.n}`} className={`storycard ${r && r.done ? 'done' : ''}`}>
                <span className="let">{s.letter}</span>
                <span className="grow"><b>{s.emoji} {s.title}</b><small>{s.kindLabel} · {s.wordCount} words</small></span>
                <span className="col" style={{ gap: 2, alignItems: 'flex-end' }}>
                  {r ? <span className="pill ok">{r.sets[0] != null ? `S1 ${r.sets[0]}%` : ''}{r.sets[1] != null ? ` S2 ${r.sets[1]}%` : ''}</span> : <LuPlay />}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid g3">
        {(g.key === 'KG'
          ? [
              ['letters', '🔤', 'Alphabet A–Z', 'Learn letters & sounds', null],
              ['counting', '🔢', 'Numbers 1–10', 'Count objects & discover numbers', null],
              ['addsub', '➕', 'Add & Subtract', 'Simple + and − within 10', null],
              ['shapes', '🎨', 'Shapes & Colors', 'Shapes, colors & patterns', null]
            ]
          : [
              ['math', '🔢', 'Math set', '10 problems', ls.math],
              ['fill', '🧩', 'Fill in the blank', '10 sentences', ls.fill],
              ['vocab', '🔤', 'Word check', '10 vocabulary questions', null],
              ['grammar', '✏️', 'Grammar check', '10 questions', null]
            ]
        ).map(([k, e, t, s, best]) => (
          <Link key={k} to={`/play/${k}/${lv}`} className="tile t2"><span className="ico">{e}</span><b>{t}</b><span>{s}{best != null ? ` · best ${best}%` : ''}</span></Link>
        ))}
      </section>
    </>
  );
}
