import React, { useState } from 'react';
import { LuDownload, LuGift } from 'react-icons/lu';
import { useStore, STICKERS, gradeSummary, exportBackup } from '../store/store.js';
import { GRADES, SUBJECT_BY_KEY } from '../data/grades.js';
import { Bar, Stars, Modal, Notice, toast, confetti, Ring } from '../ui/ui.jsx';
import { ExplainBtn } from '../ui/Explainer.jsx';

const today = () => new Date().toISOString().slice(0, 10);
const RESETS = [
  ['reset-score', 'Reset my score to 0', 'Your points go back to 0. Levels, stars and stickers stay.'],
  ['reset-ratings', 'Reset ratings & levels', 'Removes level stars, finished stories, story ratings and exam history. Points and stickers stay.'],
  ['reset-stats', 'Reset right/wrong counts', 'Clears the accuracy charts and streaks.'],
  ['reset-stickers', 'Reset stickers', 'Empties the sticker stash.'],
  ['reset-all', 'Reset everything', 'Score, ratings, stats, exams and stickers all start again. Your own uploaded and created content is kept.'],
];

export default function Rewards() {
  const { state, dispatch } = useStore();
  const [ask, setAsk] = useState(null);
  const total = state.stats.correct + state.stats.wrong;
  const acc = total ? Math.round((state.stats.correct / total) * 100) : 0;
  const canOpen = state.mystery.last !== today();
  const openBox = () => { dispatch({ type: 'mystery-open' }); confetti(); };
  const download = () => {
    const blob = new Blob([exportBackup(state)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `kidsy-backup-${today()}.json`; a.click();
    toast('Backup saved to your downloads', '💾');
  };
  const subs = Object.entries(state.stats.bySubject);
  return (
    <>
      <section className="hero">
        <div className="row wrap" style={{ justifyContent: 'space-between' }}><span className="pill w">Scoring: right = +1 · wrong = −1 · never below 0</span><ExplainBtn topic="points" small /></div>
        <div className="row wrap gap20" style={{ marginTop: 10 }}>
          <div><div style={{ fontFamily: 'var(--display)', fontSize: '4.5rem', fontWeight: 800, lineHeight: 1 }}>{state.score}</div><div>points now</div></div>
          <div><div style={{ fontFamily: 'var(--display)', fontSize: '2.4rem', fontWeight: 800 }}>{state.best}</div><div>best score</div></div>
          <div><div style={{ fontFamily: 'var(--display)', fontSize: '2.4rem', fontWeight: 800 }}>{state.stats.bestStreak}</div><div>best streak</div></div>
        </div>
      </section>

      <section className="grid g2">
        <div className="card">
          <h3>Accuracy</h3>
          <div className="row gap20" style={{ marginTop: 10 }}>
            <Ring pct={acc} />
            <div className="grow col gap8">
              <div>✅ {state.stats.correct} right · ❌ {state.stats.wrong} missed</div>
              {subs.length === 0 && <p className="muted tiny">Answer a few questions to see your subjects here.</p>}
              {subs.map(([k, v]) => <div key={k}><div className="tiny" style={{ fontWeight: 800 }}>{SUBJECT_BY_KEY[k]?.emoji} {SUBJECT_BY_KEY[k]?.label || k}: {v.c}/{v.c + v.w}</div><Bar pct={Math.round((v.c / (v.c + v.w)) * 100)} /></div>)}
            </div>
          </div>
        </div>
        <div className="card center col" style={{ alignItems: 'center' }}>
          <h3>Mystery box</h3>
          <button className="giftbox" disabled={!canOpen} onClick={openBox} aria-label="Open the mystery box">🎁</button>
          <p className="muted">{canOpen ? 'Tap the box to win a surprise sticker! One box every day.' : 'Come back tomorrow for another surprise.'}</p>
        </div>
      </section>

      <section className="card">
        <div className="row"><h2 className="grow">Sticker stash</h2><span className="pill">{state.stickers.length} / {STICKERS.length}</span></div>
        <div className="stickers" style={{ marginTop: 14 }}>
          {STICKERS.map((s) => { const has = state.stickers.includes(s.id); return <div key={s.id} className={`sticker ${has ? '' : 'lock'}`}><span className="e">{s.e}</span><b>{has ? s.name : '???'}</b><small>{s.hint}</small></div>; })}
        </div>
      </section>

      <section className="card">
        <h2>Level stars by grade</h2>
        <div className="grid gauto" style={{ marginTop: 12 }}>
          {GRADES.map((g) => { const s = gradeSummary(state, g.key); return <div key={g.key} className="card soft flat"><b>{g.emoji} {g.label}</b><div className="tiny muted">{s.cleared}/50 levels cleared · {s.storiesDone} stories</div><Bar pct={(s.stars / s.maxStars) * 100} /><div className="tiny">⭐ {s.stars} / {s.maxStars}</div></div>; })}
        </div>
      </section>

      {state.exams.length > 0 && (
        <section className="card">
          <h2>Recent exams</h2>
          <div className="scrollx"><table className="tbl" style={{ marginTop: 10 }}><thead><tr><th>Date</th><th>Grade</th><th>Score</th><th>Result</th></tr></thead>
            <tbody>{state.exams.slice(0, 8).map((e) => <tr key={e.id}><td>{e.date}</td><td>{e.grade}</td><td>{e.correct}/{e.total}</td><td><Stars n={e.pct >= 90 ? 3 : e.pct >= 70 ? 2 : e.pct >= 50 ? 1 : 0} /> {e.pct}%</td></tr>)}</tbody></table></div>
        </section>
      )}

      <section className="card">
        <h2>Reset (only when you choose)</h2>
        <p className="muted" style={{ margin: '4px 0 12px' }}>Nothing ever resets by itself, not even when you close the page. Save a backup first if you want to keep a copy.</p>
        <div className="row wrap"><button className="btn soft" onClick={download}><LuDownload /> Save a backup file</button></div>
        <div className="grid gauto" style={{ marginTop: 14 }}>
          {RESETS.map(([type, label, desc]) => <div key={type} className="card soft flat col gap8"><b>{label}</b><span className="tiny muted">{desc}</span><button className="btn danger sm" onClick={() => setAsk({ type, label, desc })}>{label}</button></div>)}
        </div>
      </section>
      {ask && (
        <Modal title="Are you sure?" onClose={() => setAsk(null)} actions={<><button className="btn ghost" onClick={() => setAsk(null)}>No, keep it</button><button className="btn danger" onClick={() => { dispatch({ type: ask.type }); setAsk(null); toast('Done', '✅'); }}>Yes, {ask.label.toLowerCase()}</button></>}>
          <p>{ask.desc}</p><Notice kind="warn">This cannot be undone. A backup file can bring your data back.</Notice>
        </Modal>
      )}
    </>
  );
}
