import React, { useState } from 'react';
import { LuLock, LuPlay, LuCheck } from 'react-icons/lu';
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
  if (!open) return <><Crumb to="/map">Adventure map</Crumb><Notice kind="warn">Level {lv} is locked. Clear level {lv - 1} first, or ask a grown-up to open all levels in settings.</Notice></>;
  return (
    <>
      <Crumb to="/map">Adventure map</Crumb>
      <section className="hero">
        <span className="pill w">{chapterOf(g.key, lv)}</span>
        <h1 style={{ margin: '8px 0' }}>Level {lv}</h1>
        <div className="row wrap"><Stars n={ls.stars} /> <span>{ls.stories}/10 stories · math {ls.math ?? '–'}{ls.math != null ? '%' : ''} · fill {ls.fill ?? '–'}{ls.fill != null ? '%' : ''}</span></div>
        <div style={{ maxWidth: 420, marginTop: 14 }}><Bar pct={ls.stories * 10} /></div>
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
          ? [['math', '🔤', 'Letters & Numbers', 'Alphabet, counting and adding to 10', ls.math]]
          : [['math', '🔢', 'Math set', '10 problems', ls.math], ['fill', '🧩', 'Fill in the blank', '10 sentences', ls.fill], ['vocab', '🔤', 'Word check', '10 vocabulary questions', null], ['grammar', '✏️', 'Grammar check', '10 questions', null]]
        ).map(([k, e, t, s, best]) => (
          <Link key={k} to={`/play/${k}/${lv}`} className="tile t2"><span className="ico">{e}</span><b>{t}</b><span>{s}{best != null ? ` · best ${best}%` : ''}</span></Link>
        ))}
      </section>
    </>
  );
}
