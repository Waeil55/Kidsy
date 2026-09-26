import React, { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuChevronRight } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { GRADES, GRADE_BY_KEY } from '../data/grades.js';
import { allStoryHeaders } from '../engine/stories.js';
import { generateMath } from '../engine/math.js';
import { vocabFor } from '../data/vocab.js';
import { storyWords } from '../engine/wordbank.js';
import { G3_PDF_WORD_ROWS } from '../data/g3ela.js';
import { Seg, Empty } from '../ui/ui.jsx';
import { Link } from '../ui/router.js';

export default function IndexScreen() {
  const { state } = useStore();
  const grade = state.gradeKey;
  const [type, setType] = useState('stories');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(true);
  const [data, setData] = useState({});
  const c = state.custom;

  useEffect(() => {
    setBusy(true);
    const t = setTimeout(() => {
      const gs = [state.gradeKey];
      const d = { stories: [], math: [], words: [] };
      for (const k of gs) {
        d.stories.push(...allStoryHeaders(k).map((s) => ({ ...s, grade: k })));
        d.math.push(...Array.from({ length: 500 }, (_, i) => generateMath(k, i + 1)).filter(Boolean));
        d.words.push(...vocabFor(k).map((w) => ({ ...w, grade: k })));
        if (k !== 'KG') { const have = new Set(d.words.map((x) => x.w.toLowerCase())); d.words.push(...storyWords(k).filter((x) => !have.has(x.w)).map((x) => ({ w: x.w, def: 'Word from the grade stories. Tap it in a story to explore.', pos: 'story', grade: k }))); }
      }
      setData(d); setBusy(false);
    }, 20);
    return () => clearTimeout(t);
  }, [grade]);

  const ql = q.trim().toLowerCase();
  const stories = useMemo(() => (data.stories || []).filter((s) => !ql || `${s.title} ${s.kind}`.toLowerCase().includes(ql)), [data, ql]);
  const math = useMemo(() => (data.math || []).filter((m) => !ql || m.q.toLowerCase().includes(ql)), [data, ql]);
  const words = useMemo(() => [...(data.words || []), ...c.words.filter((w) => w.grade === grade)].filter((w) => !ql || `${w.w} ${w.def}`.toLowerCase().includes(ql)), [data, ql, c.words, grade]);
  const mineQ = [...c.qa, ...c.math, ...c.fill, ...c.flashcards, ...c.stories].filter((x) => x.grade === grade && (!ql || JSON.stringify(x).toLowerCase().includes(ql)));

  const byLevel = (arr) => { const m = {}; arr.forEach((x) => { (m[x.level] = m[x.level] || []).push(x); }); return Object.entries(m); };
  const counts = { stories: stories.length, math: math.length, words: words.length, mine: mineQ.length };

  return (
    <>
      <div className="col"><h1>📚 Big index</h1><p className="muted">Everything in Kidsy in one place: {GRADES.length * 500} stories, {GRADES.length * 500} math problems, all vocabulary, plus what you added. Search, then tap to open.</p></div>
      <div className="row wrap">
        <div className="grow" style={{ position: 'relative', minWidth: 240 }}><LuSearch style={{ position: 'absolute', left: 14, top: 14 }} /><input style={{ paddingLeft: 42 }} placeholder="Search titles, words, problems…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the index" /></div>
        <span className="pill">🔒 {GRADE_BY_KEY[state.gradeKey].label}</span>
      </div>
      <Seg value={type} onChange={setType} options={[{ key: 'stories', label: `Stories (${counts.stories})` }, { key: 'math', label: `Math (${counts.math})` }, { key: 'words', label: `Words (${counts.words})` }, { key: 'mine', label: `My content (${counts.mine})` }]} />
      {busy && <div className="card empty"><div className="e">⏳</div>Building the index…</div>}
      {!busy && type === 'stories' && (
        ql ? (
          <div className="card scrollx"><table className="tbl"><thead><tr><th>Grade</th><th>#</th><th>Level</th><th>Title</th><th>Kind</th></tr></thead>
            <tbody>{stories.slice(0, 300).map((s) => <tr key={s.id}><td>{s.grade}</td><td>{s.n}</td><td>{s.level}</td><td><Link to={`/read/${s.grade}/${s.n}`}><b>{s.emoji} {s.title}</b></Link></td><td>{s.kind}</td></tr>)}</tbody></table>{stories.length > 300 && <p className="tiny muted">Showing the first 300. Type more of the title to narrow down.</p>}{!stories.length && <Empty e="🔎" title="Nothing found" />}</div>
        ) : (
          <div className="col">{byLevel(stories).map(([lv, arr]) => (
            <div key={lv} className="card" style={{ padding: 14 }}>
              <button className="row" style={{ width: '100%', background: 'none', border: 0, textAlign: 'left' }} onClick={() => setOpen(open === lv ? null : lv)} aria-expanded={open === lv}><LuChevronRight style={{ transform: open === lv ? 'rotate(90deg)' : 'none', transition: '.15s' }} /><b className="grow">Level {lv}</b><span className="tiny muted">{arr.map((x) => x.title).slice(0, 2).join(' · ')}…</span></button>
              {open === lv && <div className="grid gauto" style={{ marginTop: 10, gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>{arr.map((s) => <Link key={s.id} to={`/read/${s.grade}/${s.n}`} className="storycard"><span className="let">{s.letter}</span><span className="grow"><b>{s.emoji} {s.title}</b><small>{s.kind} · #{s.n}</small></span></Link>)}</div>}
            </div>))}</div>
        )
      )}
      {!busy && type === 'math' && (
        <div className="card scrollx"><table className="tbl"><thead><tr><th>Grade</th><th>#</th><th>Level</th><th>Problem</th><th>Answer</th></tr></thead>
          <tbody>{math.slice(0, 500).map((m) => <tr key={m.id}><td>{m.grade}</td><td>{m.n}</td><td><Link to={`/play/math/${m.level}`}>{m.level}</Link></td><td>{m.q}</td><td><b>{m.options[m.answer]}</b></td></tr>)}</tbody></table>{math.length > 250 && <p className="tiny muted">Showing the first 250 of {math.length}. Search to narrow down.</p>}</div>
      )}
      {!busy && type === 'words' && (
        <div className="grid gauto" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))' }}>{words.map((w, i) => <div key={i} className="card" style={{ padding: 14 }}><div className="row"><b className="grow">{w.w}</b><span className="pill">{w.grade}</span></div><div className="tiny muted">{w.pos}</div><div>{w.def}</div></div>)}</div>
      )}
      {!busy && type === 'mine' && (mineQ.length ? <div className="col">{mineQ.map((x) => <div key={x.id} className="card" style={{ padding: 14 }}><span className="pill">{x.grade}</span> {x.q || x.sentence || x.front || x.title}</div>)}</div> : <Empty e="✏️" title="Nothing here yet">Add your own things in the <Link to="/studio">Studio</Link>.</Empty>)}
      {state.gradeKey === 'G3' && <div className="card soft flat"><b>📘 Merola weekly words</b> — {G3_PDF_WORD_ROWS.length} PDF vocabulary words, 4 daily reviews and a practice quiz. <Link to="/g3pack">Open the pack</Link></div>}
    </>
  );
}
