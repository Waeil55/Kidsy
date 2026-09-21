import React, { useRef, useState } from 'react';
import { LuUpload, LuFileText, LuCheck, LuTrash2, LuPlay } from 'react-icons/lu';
import { useStore, uid } from '../store/store.js';
import { GRADES, GRADE_BY_KEY, SUBJECTS } from '../data/grades.js';
import { fileToText, normalizeText, splitSections, parseSection, KIND_LABEL } from '../engine/extract.js';
import { customToItems, vocabQuiz } from '../engine/quizzes.js';
import { makeRng, buildOptions, uniq } from '../lib/rng.js';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Notice, Modal, Crumb, Empty, toast, confetti } from '../ui/ui.jsx';
import { Link, go } from '../ui/router.js';

const SUBJ = [['english', 'English (ELA)'], ['math', 'Math'], ['science', 'Science'], ['social', 'Social studies'], ['other', 'Other']];
const STORE_KIND = { words: 'words', flashcards: 'flashcards', qa: 'qa', math: 'math', fill: 'fill', stories: 'stories' };
const keyOf = (k, x) => `${k}|${x.grade}|${(x.w || x.front || x.q || x.sentence || x.title || '').toLowerCase().replace(/\s+/g, ' ')}`;
const summary = (k, x) => (k === 'words' ? `${x.w}${x.pos ? ' (' + x.pos + ')' : ''}: ${x.def}` : k === 'flashcards' ? `${x.front} → ${x.back}` : k === 'qa' ? x.q : k === 'math' ? x.q : k === 'fill' ? x.sentence : `${x.title} — ${x.text.split(/\s+/).length} words`);

function Section({ sec, idx, onChange, onSave, saved }) {
  const total = Object.values(sec.items).reduce((n, a) => n + a.length, 0);
  const all = Object.entries(sec.items).flatMap(([k, arr]) => arr.map((x) => ({ k, x })));
  const chosen = all.filter(({ x }) => sec.checked[x.id]);
  const unresolved = chosen.filter(({ k, x }) => x.needsAnswer && !(x.edited));
  const setItem = (k, id, patch) => onChange({ ...sec, items: { ...sec.items, [k]: sec.items[k].map((y) => (y.id === id ? { ...y, ...patch } : y)) } });
  const canSave = sec.grade && chosen.length > 0 && !unresolved.length && !saved;
  const lowG = sec.gradeConf < 0.6;
  return (
    <div className={`card col ${saved ? 'soft' : ''}`} style={{ borderColor: !sec.grade || lowG ? '#f59e0b' : undefined }}>
      <div className="row wrap">
        <h2 className="grow">{sec.title}</h2>
        {saved && <span className="pill ok"><LuCheck size={14} /> saved</span>}
      </div>
      <div className="grid g3">
        <label className="f">Grade<select value={sec.grade || ''} disabled={saved} onChange={(e) => onChange({ ...sec, grade: e.target.value, gradeConf: 1, gradeWhy: 'You chose this' })}><option value="">— choose —</option>{GRADES.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select></label>
        <label className="f">Subject<select value={sec.subject} disabled={saved} onChange={(e) => onChange({ ...sec, subject: e.target.value })}>{SUBJ.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
        <label className="f">Lesson name<input value={sec.packName} disabled={saved} onChange={(e) => onChange({ ...sec, packName: e.target.value })} /></label>
      </div>
      {(!sec.grade || lowG) && !saved && <Notice kind="warn"><b>Please check the grade.</b> {sec.gradeWhy}. Everything in this section will be saved for the grade you choose, and only that grade.</Notice>}
      {sec.parsed.warnings.filter((w) => !/grade|answer/i.test(w)).map((w, i) => <Notice key={i} kind="warn">{w}</Notice>)}
      {total === 0 && <Notice kind="info">Nothing recognisable here. You can add these by hand in the <Link to="/studio">Studio</Link>.</Notice>}
      {Object.entries(sec.items).map(([k, arr]) => arr.length > 0 && (
        <div key={k}>
          <div className="row" style={{ marginBottom: 6 }}><h3 className="grow">{KIND_LABEL[k]} ({arr.length})</h3>
            {!saved && <><button className="btn ghost sm" onClick={() => onChange({ ...sec, checked: { ...sec.checked, ...Object.fromEntries(arr.map((x) => [x.id, true])) } })}>All</button><button className="btn ghost sm" onClick={() => onChange({ ...sec, checked: { ...sec.checked, ...Object.fromEntries(arr.map((x) => [x.id, false])) } })}>None</button></>}</div>
          <div className="col gap8" style={{ maxHeight: 340, overflow: 'auto' }}>
            {arr.map((x) => (
              <div key={x.id} className={`check ${sec.checked[x.id] ? '' : 'off'}`}>
                <input type="checkbox" checked={!!sec.checked[x.id]} disabled={saved} onChange={(e) => onChange({ ...sec, checked: { ...sec.checked, [x.id]: e.target.checked } })} aria-label="Keep this" />
                <div className="grow col" style={{ gap: 4 }}>
                  <div>{summary(k, x)}</div>
                  {k === 'qa' && x.options && <div className="tiny muted">{x.options.map((o, i) => `${'ABCD'[i]}) ${o}`).join('  ')}</div>}
                  {k === 'qa' && x.options && x.needsAnswer && !saved && <label className="tiny">Right answer: <select value={x.edited ? x.answer : ''} onChange={(e) => setItem(k, x.id, { answer: +e.target.value, edited: true })}><option value="">— choose —</option>{x.options.map((o, i) => <option key={i} value={i}>{'ABCD'[i]}</option>)}</select></label>}
                  {(k === 'math' || k === 'fill') && x.needsAnswer && !saved && <label className="tiny">Answer: <input style={{ padding: '4px 10px', width: 160 }} value={x.answer} onChange={(e) => setItem(k, x.id, { answer: e.target.value, accept: [e.target.value], edited: !!e.target.value.trim() })} /></label>}
                  {k === 'stories' && <div className="tiny muted">{x.questions.length} fill-in questions will be made from this passage.</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <details><summary className="tiny muted" style={{ cursor: 'pointer' }}>Show the original text of this section</summary><pre style={{ whiteSpace: 'pre-wrap', maxHeight: 220, overflow: 'auto', fontFamily: 'inherit', fontSize: '.85rem' }}>{sec.text}</pre></details>
      {!saved && (
        <div className="row wrap">
          <button className="btn" disabled={!canSave} onClick={() => onSave(idx)}><LuCheck /> Save {chosen.length} to {sec.grade ? GRADE_BY_KEY[sec.grade].short : '…'} · {SUBJ.find((s) => s[0] === sec.subject)[1]}</button>
          {unresolved.length > 0 && <span className="tiny" style={{ color: 'var(--bad)', fontWeight: 800 }}>{unresolved.length} item(s) still need an answer (or untick them).</span>}
        </div>
      )}
    </div>
  );
}

export default function Upload() {
  const { state, dispatch } = useStore();
  const fileRef = useRef(null);
  const [text, setText] = useState('');
  const [secs, setSecs] = useState(null);
  const [saved, setSaved] = useState({});
  const [src, setSrc] = useState({ source: 'paste', file: '' });
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [over, setOver] = useState(false);
  const [del, setDel] = useState(null);

  const analyze = (raw, source, file) => {
    const clean = normalizeText(raw);
    const list0 = splitSections(clean);
    const list = list0.map((s, i) => {
      const parsed = parseSection(s);
      const checked = {};
      Object.entries(parsed.items).forEach(([k, arr]) => arr.forEach((x) => { checked[x.id] = k === 'stories' ? arr.length <= 3 : true; }));
      return { ...s, title: list0.length === 1 && /^Section/.test(s.title) ? (file || 'Pasted text') : s.title, items: parsed.items, parsed, checked, packName: `${file || 'Pasted lesson'}${s.title && !/^Section/.test(s.title) ? ' · ' + s.title : ''}`.slice(0, 60) };
    });
    setSrc({ source, file }); setSaved({}); setSecs(list);
    if (!list.length) setErr('There was no text to read.');
  };
  const onFile = async (f) => {
    setErr(''); setBusy(`Reading ${f.name}…`);
    try { const t = await fileToText(f, (p, n) => setBusy(`Reading page ${p} of ${n}…`)); analyze(t, 'upload', f.name); } catch (e) { setErr(e.message || 'That file could not be read.'); }
    setBusy('');
  };
  const savePack = (idx) => {
    const sec = secs[idx];
    const id = uid('pack');
    const existing = new Set(Object.entries(state.custom).filter(([k]) => STORE_KIND[k]).flatMap(([k, arr]) => arr.map((x) => keyOf(k, x))));
    const groups = {}; const counts = {}; let dup = 0;
    Object.entries(sec.items).forEach(([k, arr]) => {
      const keep = arr.filter((x) => sec.checked[x.id]).map(({ kind, src: _s, needsAnswer, edited, ...rest }) => ({ ...rest, id: uid(), packId: id, grade: sec.grade, subject: sec.subject }));
      const fresh = keep.filter((x) => { const kk = keyOf(k, x); if (existing.has(kk)) { dup++; return false; } existing.add(kk); return true; });
      if (fresh.length) { groups[STORE_KIND[k]] = fresh; counts[k] = fresh.length; }
    });
    const n = Object.values(counts).reduce((a, b) => a + b, 0);
    if (!n) { toast('Everything in this section was already saved before', 'ℹ️'); setSaved({ ...saved, [idx]: true }); return; }
    dispatch({ type: 'c-add-many', groups, pack: { id, name: sec.packName, grade: sec.grade, subject: sec.subject, source: src.source, file: src.file, createdAt: Date.now(), counts } });
    setSaved({ ...saved, [idx]: id });
    toast(`Saved ${n} items to ${GRADE_BY_KEY[sec.grade].short} · ${SUBJ.find((s) => s[0] === sec.subject)[1]}${dup ? ` (${dup} already existed)` : ''}`, '✅'); confetti();
  };

  const packs = state.custom.packs.filter((p) => p.source === 'upload' || p.source === 'paste').sort((a, b) => b.createdAt - a.createdAt);
  const savedCount = Object.keys(saved).length;
  return (
    <>
      <div className="col"><h1>📤 Upload a lesson</h1><p className="muted">Add a PDF, Word file or text from school. Kidsy splits it by grade and subject, shows you what it found, and only saves what you approve. Each saved lesson stays in its own grade and subject, so nothing gets mixed up.</p></div>
      {!secs && (
        <>
          <div className={`drop ${over ? 'over' : ''}`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); e.dataTransfer.files[0] && onFile(e.dataTransfer.files[0]); }}>
            <LuUpload size={40} /><h3>Drop a file here</h3><p className="muted">PDF, Word (.docx), .txt, .md or .csv</p>
            <button className="btn" onClick={() => fileRef.current.click()} disabled={!!busy}><LuFileText /> Choose a file</button>
            <input ref={fileRef} type="file" className="hide" accept=".pdf,.docx,.txt,.md,.csv,.json" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
            {busy && <b>{busy}</b>}
          </div>
          <div className="card col"><h3>Or paste text</h3>
            <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder={'Paste text here. Tips:\nGrade 3 Math\n12 + 7 = ___\nGrade 3 Vocabulary\nbrave - not afraid of danger\n1. Which word means “big”?\nA) tiny B) huge C) quiet\nAnswer: B'} />
            <div><button className="btn" disabled={text.trim().length < 10} onClick={() => { setErr(''); analyze(text, 'paste', ''); }}>Read my text</button></div></div>
          {err && <Notice kind="err">{err}</Notice>}
          <Notice>Photos and scans cannot be read offline. Type or paste the text, or add things by hand in the <Link to="/studio">Studio</Link>.</Notice>
        </>
      )}
      {secs && (
        <>
          <div className="row wrap"><h2 className="grow">Review what I found ({secs.length} section{secs.length === 1 ? '' : 's'})</h2><button className="btn ghost sm" onClick={() => { setSecs(null); setText(''); setSaved({}); }}>Start over</button></div>
          {secs.length > 1 && <Notice>This document has {secs.length} parts. Each part is checked and saved <b>separately</b> under its own grade and subject.</Notice>}
          {err && <Notice kind="err">{err}</Notice>}
          {secs.map((s, i) => <Section key={s.id} sec={s} idx={i} saved={saved[i]} onChange={(n) => setSecs(secs.map((x, j) => (j === i ? n : x)))} onSave={savePack} />)}
          {savedCount > 0 && <div className="card soft row wrap"><b className="grow">✅ {savedCount} section(s) saved.</b><Link to="/studio" className="btn soft sm">See in Studio</Link>{Object.values(saved).filter((v) => typeof v === 'string')[0] && <Link to={`/pack/${Object.values(saved).filter((v) => typeof v === 'string')[0]}`} className="btn sm"><LuPlay /> Practice it now</Link>}</div>}
        </>
      )}
      <section className="col">
        <h2>My saved lessons ({packs.length})</h2>
        {!packs.length && <Empty e="📂" title="No lessons yet">Lessons you upload will be listed here.</Empty>}
        {packs.map((p) => (
          <div key={p.id} className="card row wrap" style={{ padding: 14 }}>
            <div className="grow"><b>{p.name}</b><div className="tiny muted">{Object.entries(p.counts || {}).map(([k, n]) => `${n} ${KIND_LABEL[k].toLowerCase()}`).join(' · ')}</div></div>
            <span className="pill">{GRADE_BY_KEY[p.grade]?.short}</span><span className="pill gold">{SUBJ.find((s) => s[0] === p.subject)?.[1] || p.subject}</span>
            <Link to={`/pack/${p.id}`} className="btn sm"><LuPlay /> Practice</Link>
            <button className="iconbtn" onClick={() => setDel(p)} aria-label={`Delete ${p.name}`}><LuTrash2 /></button>
          </div>
        ))}
      </section>
      {del && <Modal title="Delete this lesson?" onClose={() => setDel(null)} actions={<><button className="btn ghost" onClick={() => setDel(null)}>No</button><button className="btn danger" onClick={() => { dispatch({ type: 'c-del-pack', id: del.id }); setDel(null); toast('Lesson deleted', '🗑️'); }}>Yes, delete</button></>}><p><b>{del.name}</b> and everything saved from it will be removed.</p></Modal>}
    </>
  );
}

// Practice one saved lesson
export function PackPlay({ id }) {
  const { state } = useStore();
  const pack = state.custom.packs.find((p) => p.id === id);
  if (!pack) return <><Crumb to="/upload">Upload</Crumb><Notice kind="warn">That lesson could not be found.</Notice></>;
  const mine = (k) => state.custom[k].filter((x) => x.packId === id);
  const r = makeRng('pack|' + id);
  const items = [...customToItems([...mine('qa'), ...mine('math'), ...mine('fill')])];
  mine('stories').forEach((s) => (s.questions || []).forEach((q, i) => items.push({ id: `${s.id}-${i}`, q: `${s.title}: ${q.q}`, options: q.options, answer: q.answer, subject: pack.subject })));
  const words = mine('words');
  const defs = words.map((w) => w.def);
  words.forEach((w) => { if (defs.length >= 3) { const { options, answer } = buildOptions(r, w.def, defs.filter((d) => d !== w.def), Math.min(4, defs.length)); items.push({ id: w.id, q: `What does “${w.w}” mean?`, options, answer, subject: 'vocab' }); } });
  const cards = mine('flashcards');
  const backs = uniq(cards.map((c) => c.back));
  cards.forEach((c) => { if (backs.length >= 3) { const { options, answer } = buildOptions(r, c.back, backs.filter((b) => b !== c.back), Math.min(4, backs.length)); items.push({ id: c.id, q: c.front, options, answer, subject: pack.subject }); } });
  const list = r.shuffle(items).slice(0, 20);
  return (
    <>
      <Crumb to="/upload">My lessons</Crumb>
      <h1>{pack.name}</h1>
      <div className="row wrap"><span className="pill">{GRADE_BY_KEY[pack.grade]?.label}</span><span className="pill gold">{SUBJ.find((s) => s[0] === pack.subject)?.[1]}</span></div>
      {list.length ? <QuizRunner items={list} grade={pack.grade} subject={pack.subject} title="My lesson" /> : <Empty e="🤔" title="Not enough to quiz yet">This lesson needs questions, or at least 3 words or flashcards.</Empty>}
    </>
  );
}
