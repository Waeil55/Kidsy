import React, { useState } from 'react';
import { LuPlus, LuTrash2, LuPencil, LuSave } from 'react-icons/lu';
import { useStore, uid } from '../store/store.js';
import { GRADES, GRADE_BY_KEY, SUBJECTS } from '../data/grades.js';
import { passageQuestions } from '../engine/extract.js';
import { normText } from '../lib/rng.js';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Seg, Notice, Empty, Crumb, SpeakBtn, toast } from '../ui/ui.jsx';
import { go } from '../ui/router.js';

const csv = (s) => String(s || '').split(/[,;]/).map((x) => x.trim()).filter(Boolean);
const SUBJ_OPTS = SUBJECTS.filter((s) => s.key !== 'fill');

// Each kind: how the form looks, how a form becomes a stored item, and how a stored item becomes a form.
const KINDS = {
  flashcards: {
    label: 'Flashcards', emoji: '🃏', hint: 'A question or word on the front, the answer on the back.',
    blank: { front: '', back: '', subject: 'other' },
    fields: [['front', 'Front', 'text'], ['back', 'Back', 'area'], ['subject', 'Subject', 'subject']],
    bulk: 'Front | Back',
    toItem: (f) => ({ front: f.front.trim(), back: f.back.trim(), subject: f.subject }),
    check: (f) => (!f.front.trim() || !f.back.trim() ? 'Please fill in the front and the back.' : ''),
    show: (x) => `${x.front} → ${x.back}`,
    fromBulk: (a) => (a[1] ? { front: a[0], back: a.slice(1).join(' | '), subject: 'other' } : null),
  },
  words: {
    label: 'Words', emoji: '🔤', hint: 'Vocabulary words show up in the Words screen, vocabulary quizzes and exams.',
    blank: { w: '', pos: 'noun', def: '', syn: '', ant: '', ex: '' },
    fields: [['w', 'Word', 'text'], ['pos', 'Type', 'pos'], ['def', 'Meaning', 'text'], ['syn', 'Same meaning (comma separated)', 'text'], ['ant', 'Opposite (comma separated)', 'text'], ['ex', 'Example sentence', 'text']],
    bulk: 'word | meaning',
    toItem: (f) => ({ w: f.w.trim().toLowerCase(), pos: f.pos, def: f.def.trim(), syn: csv(f.syn), ant: csv(f.ant), ex: f.ex.trim(), subject: 'vocab' }),
    fromItem: (x) => ({ ...x, syn: (x.syn || []).join(', '), ant: (x.ant || []).join(', ') }),
    check: (f) => (!f.w.trim() || !f.def.trim() ? 'Please add the word and its meaning.' : ''),
    show: (x) => `${x.w} (${x.pos || '–'}): ${x.def}`,
    fromBulk: (a) => (a[1] ? { w: a[0].toLowerCase(), pos: 'noun', def: a.slice(1).join(' | '), syn: [], ant: [], ex: '', subject: 'vocab' } : null),
  },
  qa: {
    label: 'Questions', emoji: '❓', hint: 'Multiple choice (fill 2–4 choices) or leave the choices empty for a typed answer.',
    blank: { q: '', o0: '', o1: '', o2: '', o3: '', correct: '0', typed: '', explain: '', subject: 'reading' },
    fields: [['q', 'Question', 'area'], ['subject', 'Subject', 'subject'], ['o0', 'Choice A', 'text'], ['o1', 'Choice B', 'text'], ['o2', 'Choice C (optional)', 'text'], ['o3', 'Choice D (optional)', 'text'], ['correct', 'Right choice', 'correct'], ['typed', 'Or: typed answer (if no choices)', 'text'], ['explain', 'Why? (optional)', 'text']],
    toItem: (f) => {
      const raw = [f.o0, f.o1, f.o2, f.o3];
      const options = raw.map((x) => x.trim()).filter(Boolean);
      const correctText = (raw[+f.correct] || '').trim();
      return options.length >= 2
        ? { q: f.q.trim(), options, answer: Math.max(0, options.indexOf(correctText)), explain: f.explain, subject: f.subject }
        : { q: f.q.trim(), answer: f.typed.trim(), accept: [f.typed.trim()], explain: f.explain, subject: f.subject };
    },
    fromItem: (x) => ({ q: x.q, o0: x.options?.[0] || '', o1: x.options?.[1] || '', o2: x.options?.[2] || '', o3: x.options?.[3] || '', correct: String(x.options ? x.answer : 0), typed: x.options ? '' : x.answer, explain: x.explain || '', subject: x.subject || 'reading' }),
    check: (f) => {
      if (!f.q.trim()) return 'Please write the question.';
      const raw = [f.o0, f.o1, f.o2, f.o3];
      const opts = raw.filter((x) => x.trim());
      if (opts.length === 1) return 'Add at least two choices, or clear them and type an answer instead.';
      if (opts.length >= 2 && !(raw[+f.correct] || '').trim()) return 'The “right choice” must be one of the choices you filled in.';
      if (!opts.length && !f.typed.trim()) return 'Add choices or a typed answer.';
      return '';
    },
    show: (x) => `${x.q} → ${x.options ? x.options[x.answer] : x.answer}`,
  },
  math: {
    label: 'Math', emoji: '🔢', hint: 'Type a problem and its answer. Kids can type or say the number.',
    blank: { q: '', answer: '', explain: '' },
    fields: [['q', 'Problem (e.g. 12 + 7 = ? or a word problem)', 'area'], ['answer', 'Answer', 'text'], ['explain', 'How to solve it (optional)', 'text']],
    toItem: (f) => ({ q: f.q.trim(), answer: f.answer.trim(), accept: [f.answer.trim()], explain: f.explain, subject: 'math' }),
    check: (f) => (!f.q.trim() || !f.answer.trim() ? 'Please add the problem and the answer.' : ''),
    show: (x) => `${x.q} → ${x.answer}`,
  },
  fill: {
    label: 'Fill in the blank', emoji: '🧩', hint: 'Write the sentence with ____ where the word goes.',
    blank: { sentence: '', answer: '', wrong: '' },
    fields: [['sentence', 'Sentence with ____', 'area'], ['answer', 'Word that fits', 'text'], ['wrong', 'Wrong choices (comma separated, optional)', 'text']],
    toItem: (f) => { const w = csv(f.wrong); return { sentence: f.sentence.trim().replace(/_{2,}/, '_____'), answer: f.answer.trim(), options: w.length ? [f.answer.trim(), ...w] : undefined, subject: 'fill' }; },
    fromItem: (x) => ({ sentence: x.sentence, answer: x.answer, wrong: (x.options || []).filter((o) => normText(o) !== normText(x.answer)).join(', ') }),
    check: (f) => (!/_{2,}/.test(f.sentence) ? 'Put ____ (underscores) where the missing word goes.' : !f.answer.trim() ? 'Type the word that fits.' : ''),
    show: (x) => `${x.sentence} → ${x.answer}`,
  },
  stories: {
    label: 'Stories', emoji: '📖', hint: 'Write a story. Kidsy makes fill-in questions from it, and you can remake them any time.',
    blank: { title: '', text: '' },
    fields: [['title', 'Title', 'text'], ['text', 'Story', 'story']],
    toItem: (f, old) => ({ title: f.title.trim(), text: f.text.trim(), questions: old && old.text === f.text.trim() && old.questions ? old.questions : passageQuestions(f.text.trim()), subject: 'reading' }),
    check: (f) => (!f.title.trim() ? 'Give the story a title.' : f.text.trim().split(/\s+/).length < 20 ? 'Write at least a few sentences (20 words).' : ''),
    show: (x) => `${x.title} (${x.text.split(/\s+/).length} words, ${(x.questions || []).length} questions)`,
  },
};

function Form({ kind, initial, onSave, onCancel }) {
  const K = KINDS[kind];
  const [f, setF] = useState(initial || K.blank);
  const [err, setErr] = useState('');
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const save = () => { const e = K.check(f); if (e) { setErr(e); return; } setErr(''); onSave(f); if (!initial) setF(K.blank); };
  return (
    <div className="card col">
      <h3>{initial ? 'Change it' : 'Make a new one'}</h3>
      <div className="grid g2">
        {K.fields.map(([k, label, type]) => (
          <label key={k} className="f" style={type === 'area' || type === 'story' ? { gridColumn: '1 / -1' } : null}>{label}
            {type === 'area' ? <textarea rows={2} value={f[k]} onChange={(e) => set(k, e.target.value)} />
              : type === 'story' ? <textarea rows={7} value={f[k]} onChange={(e) => set(k, e.target.value)} />
              : type === 'subject' ? <select value={f[k]} onChange={(e) => set(k, e.target.value)}>{SUBJ_OPTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}</select>
              : type === 'pos' ? <select value={f[k]} onChange={(e) => set(k, e.target.value)}>{['noun', 'verb', 'adjective', 'adverb'].map((p) => <option key={p}>{p}</option>)}</select>
              : type === 'correct' ? <select value={f[k]} onChange={(e) => set(k, e.target.value)}>{['A', 'B', 'C', 'D'].map((l, i) => <option key={l} value={i}>{l}</option>)}</select>
              : <input value={f[k]} onChange={(e) => set(k, e.target.value)} />}
          </label>
        ))}
      </div>
      {err && <Notice kind="err">{err}</Notice>}
      <div className="row wrap"><button className="btn" onClick={save}><LuSave /> {initial ? 'Save changes' : 'Add it'}</button>{onCancel && <button className="btn ghost" onClick={onCancel}>Cancel</button>}</div>
    </div>
  );
}

const MANUAL_PACK = { id: 'manual', name: 'Made in the Studio', source: 'studio', createdAt: 0 };

export default function Studio() {
  const { state, dispatch } = useStore();
  const [grade, setGrade] = useState(state.gradeKey);
  const [kind, setKind] = useState('flashcards');
  const [edit, setEdit] = useState(null);
  const [bulk, setBulk] = useState('');
  const K = KINDS[kind];
  const list = state.custom[kind].filter((x) => x.grade === grade);

  const add = (f) => {
    dispatch({ type: 'c-add', kind, items: [{ id: uid(), packId: 'manual', grade, ...K.toItem(f) }], pack: MANUAL_PACK });
    toast('Added!', '✅');
  };
  const saveEdit = (f) => { dispatch({ type: 'c-edit', kind, id: edit.id, patch: K.toItem(f, edit) }); setEdit(null); toast('Saved', '✅'); };
  const addBulk = () => {
    const items = bulk.split('\n').map((l) => l.split('|').map((x) => x.trim())).map((a) => (K.fromBulk ? K.fromBulk(a) : null)).filter(Boolean).map((x) => ({ id: uid(), packId: 'manual', grade, ...x }));
    if (!items.length) { toast('No lines found. Use: ' + K.bulk, '⚠️'); return; }
    dispatch({ type: 'c-add', kind, items, pack: MANUAL_PACK });
    setBulk(''); toast(`${items.length} added`, '✅');
  };
  const autoQ = (x) => { dispatch({ type: 'c-edit', kind, id: x.id, patch: { questions: passageQuestions(x.text) } }); toast('Made new fill-in questions', '🧩'); };

  return (
    <>
      <div className="col"><h1>✏️ Create &amp; upload</h1><p className="muted">Make your own flashcards, words, questions, math problems, fill-in sentences and stories, or upload a lesson from school. Each thing you make belongs to one grade, so grades never get mixed up.</p></div>
      <div className="row wrap">
        <label className="f" style={{ minWidth: 200 }}>Make it for<select value={grade} onChange={(e) => { setGrade(e.target.value); setEdit(null); }}>{GRADES.map((g) => <option key={g.key} value={g.key}>{g.emoji} {g.label}</option>)}</select></label>
        <Seg value={kind} onChange={(k) => { setKind(k); setEdit(null); }} options={Object.entries(KINDS).map(([key, v]) => ({ key, label: `${v.emoji} ${v.label}` }))} />
      </div>
      <p className="muted">{K.hint}</p>
      {!edit && <Form key={kind + grade} kind={kind} onSave={add} />}
      {K.bulk && !edit && (
        <details className="card"><summary style={{ fontWeight: 800, cursor: 'pointer' }}>Add many at once</summary>
          <div className="col" style={{ marginTop: 10 }}><p className="tiny muted">One per line, like: <code>{K.bulk}</code></p><textarea rows={5} value={bulk} onChange={(e) => setBulk(e.target.value)} /><div><button className="btn sm" onClick={addBulk}><LuPlus /> Add all</button></div></div></details>
      )}
      {edit && <Form key={edit.id} kind={kind} initial={K.fromItem ? K.fromItem(edit) : edit} onSave={saveEdit} onCancel={() => setEdit(null)} />}
      <section className="col">
        <h2>My {K.label.toLowerCase()} for {GRADE_BY_KEY[grade].label} ({list.length})</h2>
        {!list.length && <Empty e={K.emoji} title="Nothing yet">Fill in the form above to add your first one.</Empty>}
        {list.map((x) => (
          <div key={x.id} className="card row" style={{ padding: 14 }}>
            <div className="grow"><div style={{ fontWeight: 700 }}>{K.show(x)}</div>{x.packId !== 'manual' && <span className="pill tiny">from an uploaded lesson</span>}</div>
            {kind === 'stories' && <><button className="btn soft sm" onClick={() => go(`/mystory/${x.id}`)}>Read &amp; answer</button><button className="btn ghost sm" onClick={() => autoQ(x)}>New questions</button></>}
            <button className="iconbtn" onClick={() => { setEdit(x); window.scrollTo(0, 0); }} aria-label="Edit"><LuPencil /></button>
            <button className="iconbtn" onClick={() => dispatch({ type: 'c-del', kind, id: x.id })} aria-label="Delete"><LuTrash2 /></button>
          </div>
        ))}
      </section>
    </>
  );
}

// Read a story you made (or uploaded) and answer its questions
export function MyStory({ id }) {
  const { state } = useStore();
  const st = state.custom.stories.find((s) => s.id === id);
  if (!st) return <><Crumb to="/studio">Studio</Crumb><Notice kind="warn">That story could not be found.</Notice></>;
  const items = (st.questions || []).map((q, i) => ({ id: `${st.id}-${i}`, q: q.q, options: q.options, answer: q.answer, subject: 'reading' }));
  return (
    <>
      <Crumb to="/studio">Studio</Crumb>
      <div className="reader">
        <article className="card story"><span className="pill">My story · {st.grade}</span><h2>{st.title}</h2><div className="tools" style={{ marginBottom: 10 }}><SpeakBtn text={st.text} /></div>{st.text.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}</article>
        <QuizRunner items={items} grade={st.grade} subject="reading" title="Questions" />
      </div>
    </>
  );
}
