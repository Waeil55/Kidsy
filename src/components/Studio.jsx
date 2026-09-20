import React, { useState } from 'react';
import { GRADES, SUBJECTS, gradeName } from '../data/grades.js';
import { parseSchoolUpload, loadCustom, saveCustom } from '../lib/schoolParse.js';

function GradeSubjectPick({ grade, setGrade, subject, setSubject }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Grade (locked)</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-theme-main">
          {GRADES.map((g) => (
            <option key={g.key} value={g.key}>{g.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-theme-main">
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function useCustomRefresh() {
  const [, setTick] = useState(0);
  return () => setTick((t) => t + 1);
}

export function StudioPanel({ notify }) {
  const [kind, setKind] = useState('flashcard');
  const [grade, setGrade] = useState('G1');
  const [subject, setSubject] = useState('english');
  const [f, setF] = useState({});
  const refresh = useCustomRefresh();

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const add = () => {
    const c = loadCustom();
    if (kind === 'flashcard') {
      if (!f.word || !f.meaning) return notify('Flashcard needs a word + meaning');
      c.flashcards.unshift({ id: 'c' + Date.now(), grade, subject, word: f.word.trim(), meaning: f.meaning.trim(), sentence: (f.sentence || '').trim(), ipa: `|${f.word.trim().toLowerCase()}|` });
      notify(`Flashcard saved to ${gradeName(grade)} · ${subject}`);
    } else if (kind === 'story') {
      const paras = String(f.text || '').split(/\n+/).map((p) => p.trim()).filter(Boolean);
      if (!f.title || paras.length === 0) return notify('Story needs a title + at least 1 paragraph');
      c.stories.unshift({ id: 'c' + Date.now(), grade, subject, title: f.title.trim(), subtitle: gradeName(grade), level: `${gradeName(grade)} · My Story`, paragraphs: paras });
      notify(`Story saved to ${gradeName(grade)}`);
    } else if (kind === 'qa') {
      const opts = [f.o1, f.o2, f.o3].filter((x) => x && x.trim());
      if (!f.q || opts.length < 2) return notify('Q&A needs a question + 2 options');
      const ci = Math.max(0, parseInt(f.correct || '0', 10));
      c.qa.unshift({ id: 'c' + Date.now(), grade, subject, q: f.q.trim(), options: opts.map((o) => o.trim()), correct: Math.min(ci, opts.length - 1) });
      notify(`Question saved to ${gradeName(grade)} · ${subject}`);
    } else if (kind === 'math') {
      const ans = parseFloat(f.answer);
      if (!f.q || Number.isNaN(ans)) return notify('Math needs a question + numeric answer');
      const wrong = [f.w1, f.w2, f.w3].map(Number).filter((n) => !Number.isNaN(n) && n !== ans).slice(0, 3);
      while (wrong.length < 3) wrong.push(ans + wrong.length + 1);
      const options = [ans, ...wrong].sort(() => 0.5 - Math.random());
      c.math.unshift({ id: 'c' + Date.now(), grade, subject, q: f.q.trim(), options, correct: options.indexOf(ans), answer: ans, topic: 'custom' });
      notify(`Math saved to ${gradeName(grade)}`);
    } else if (kind === 'fill') {
      if (!f.sentence || !f.sentence.includes('___') || !f.answer) return notify('Fill-sentence needs "___" + answer');
      c.fills.unshift({ id: 'c' + Date.now(), grade, subject, sentence: f.sentence.trim(), answer: f.answer.trim() });
      notify(`Fill-sentence saved to ${gradeName(grade)}`);
    }
    saveCustom(c);
    setF({});
    refresh();
  };

  const counts = (() => {
    const c = loadCustom();
    return { flashcards: c.flashcards.length, stories: c.stories.length, qa: c.qa.length, math: c.math.length, fills: c.fills.length, lessons: c.lessons.length };
  })();

  const tabs = [
    ['flashcard', 'Flashcard'],
    ['story', 'Story'],
    ['qa', 'Q&A'],
    ['math', 'Math'],
    ['fill', 'Fill-in'],
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card-3d">
        <h3 className="font-display font-black text-slate-800 text-base">Add New Content</h3>
        <p className="text-xs text-slate-400 mb-3">Everything is tagged to ONE grade + subject — never mixed.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setKind(k)} className={'px-3 py-1.5 rounded-xl text-xs font-black transition ' + (kind === k ? 'bg-theme-main text-white' : 'bg-slate-100 text-slate-600')}>
              {label}
            </button>
          ))}
        </div>
        <GradeSubjectPick grade={grade} setGrade={setGrade} subject={subject} setSubject={setSubject} />
        <div className="space-y-2 mt-3">
          {kind === 'flashcard' && (
            <>
              <input value={f.word || ''} onChange={(e) => set('word', e.target.value)} placeholder="Word" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              <input value={f.meaning || ''} onChange={(e) => set('meaning', e.target.value)} placeholder="Meaning (kid-friendly)" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              <input value={f.sentence || ''} onChange={(e) => set('sentence', e.target.value)} placeholder="Example sentence (optional)" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
            </>
          )}
          {kind === 'story' && (
            <>
              <input value={f.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="Story title" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              <textarea value={f.text || ''} onChange={(e) => set('text', e.target.value)} rows={5} placeholder="Story paragraphs (blank line = new paragraph)" className="w-full p-3 border border-slate-200 rounded-xl text-sm font-serif focus:outline-none focus:border-theme-main resize-none" />
            </>
          )}
          {kind === 'qa' && (
            <>
              <input value={f.q || ''} onChange={(e) => set('q', e.target.value)} placeholder="Question" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              <input value={f.o1 || ''} onChange={(e) => set('o1', e.target.value)} placeholder="Option 1 (correct if #1 selected)" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              <input value={f.o2 || ''} onChange={(e) => set('o2', e.target.value)} placeholder="Option 2" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              <input value={f.o3 || ''} onChange={(e) => set('o3', e.target.value)} placeholder="Option 3 (optional)" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              <select value={f.correct || '0'} onChange={(e) => set('correct', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold">
                <option value="0">Correct: option 1</option>
                <option value="1">Correct: option 2</option>
                <option value="2">Correct: option 3</option>
              </select>
            </>
          )}
          {kind === 'math' && (
            <>
              <input value={f.q || ''} onChange={(e) => set('q', e.target.value)} placeholder="Question, e.g. 7 × 8 = ?" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              <div className="grid grid-cols-4 gap-2">
                <input value={f.answer || ''} onChange={(e) => set('answer', e.target.value)} placeholder="Answer*" inputMode="decimal" className="px-3 py-2 border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:border-theme-main" />
                <input value={f.w1 || ''} onChange={(e) => set('w1', e.target.value)} placeholder="Wrong 1" inputMode="decimal" className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
                <input value={f.w2 || ''} onChange={(e) => set('w2', e.target.value)} placeholder="Wrong 2" inputMode="decimal" className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
                <input value={f.w3 || ''} onChange={(e) => set('w3', e.target.value)} placeholder="Wrong 3" inputMode="decimal" className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              </div>
            </>
          )}
          {kind === 'fill' && (
            <>
              <input value={f.sentence || ''} onChange={(e) => set('sentence', e.target.value)} placeholder="Sentence with ___ blank, e.g. The cat ___ on the mat." className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
              <input value={f.answer || ''} onChange={(e) => set('answer', e.target.value)} placeholder="Missing word answer" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-theme-main" />
            </>
          )}
        </div>
        <button onClick={add} className="mt-3 w-full py-3 bg-theme-main text-white font-display font-black text-sm rounded-2xl shadow-lg active:scale-95 transition">
          Save to {gradeName(grade)} · {subject}
        </button>
      </div>
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card-3d">
        <h3 className="font-display font-black text-slate-800 text-sm mb-1">My Added Content</h3>
        <p className="text-xs text-slate-400">
          {counts.flashcards} flashcards · {counts.stories} stories · {counts.qa} Q&amp;A · {counts.math} math · {counts.fills} fill-ins · {counts.lessons} school lessons
        </p>
      </div>
    </div>
  );
}

const SAMPLE_UPLOAD = `[GRADE: G3] [SUBJECT: math] [TITLE: Times tables]
MATH: 3 x 4 = ? | 12 | 10 | 14 | 11
MATH: 7 x 7 = ? | 49 | 47 | 51 | 42
Q: What is 3 times 4? | 12 | 10 | 14 | 0

[GRADE: G1] [SUBJECT: english] [TITLE: Sight words]
F: run | To move fast | The children run fast.
F: jump | To leap up | Frogs can jump high.
S: Sam can run and jump all day long.
FILL: The cat ___ on the mat. | sat`;

export function SchoolPanel({ notify }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const refresh = useCustomRefresh();

  const parse = () => {
    const r = parseSchoolUpload(text);
    setResult(r);
    if (r.lessons.length === 0) notify('Nothing valid to import — check the review box');
  };

  const importAll = () => {
    if (!result || result.lessons.length === 0) return;
    const c = loadCustom();
    result.lessons.forEach((L) => {
      L.items.forEach((it) => {
        if (it.type === 'flashcard') c.flashcards.unshift({ id: 's' + Date.now() + Math.random(), grade: L.grade, subject: L.subject, word: it.word, meaning: it.meaning, sentence: it.sentence, ipa: `|${it.word.toLowerCase()}|` });
        else if (it.type === 'qa') c.qa.unshift({ id: 's' + Date.now() + Math.random(), grade: L.grade, subject: L.subject, q: it.q, options: it.options, correct: it.correct });
        else if (it.type === 'math') c.math.unshift({ id: 's' + Date.now() + Math.random(), grade: L.grade, subject: L.subject, q: it.q, options: it.options, correct: it.correct, answer: it.answer, topic: 'school' });
        else if (it.type === 'fill') c.fills.unshift({ id: 's' + Date.now() + Math.random(), grade: L.grade, subject: L.subject, sentence: it.sentence, answer: it.answer });
      });
      const storyParas = result.lessons.length ? L.items.filter((it) => it.type === 'story').flatMap((s) => s.paragraphs) : [];
      if (storyParas.length > 0) {
        c.stories.unshift({ id: L.id, grade: L.grade, subject: L.subject, title: L.title, subtitle: gradeName(L.grade), level: `${gradeName(L.grade)} · School`, paragraphs: storyParas });
      }
      c.lessons.unshift({ id: L.id, grade: L.grade, subject: L.subject, title: L.title, count: L.items.length });
    });
    saveCustom(c);
    notify(`Imported ${result.lessons.reduce((n, L) => n + L.items.length, 0)} items — grade-locked, nothing mixed`);
    setText('');
    setResult(null);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card-3d">
        <h3 className="font-display font-black text-slate-800 text-base">School Lessons Upload</h3>
        <p className="text-xs text-slate-400 mb-3">
          Paste lessons with <b>[GRADE:] [SUBJECT:] [TITLE:]</b> headers. Anything missing a valid grade or subject is
          quarantined — never guessed, never mixed.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={SAMPLE_UPLOAD}
          className="w-full p-3 border border-slate-200 rounded-2xl text-xs font-mono focus:outline-none focus:border-theme-main resize-none"
        />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={() => setText(SAMPLE_UPLOAD)} className="py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-black text-xs">
            Load sample
          </button>
          <button onClick={parse} className="py-2.5 rounded-2xl bg-theme-main text-white font-black text-xs active:scale-95 transition">
            Check &amp; preview
          </button>
        </div>
        <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1">
          <div><b>Q:</b> question | opt | opt | answer-index</div>
          <div><b>F:</b> word | meaning | sentence</div>
          <div><b>S:</b> story paragraph line</div>
          <div><b>MATH:</b> question | right answer | wrong | wrong | wrong</div>
          <div><b>FILL:</b> sentence with ___ | answer</div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          {result.lessons.map((L) => (
            <div key={L.id} className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4">
              <div className="font-black text-emerald-900 text-sm">✓ {L.title}</div>
              <div className="text-xs text-emerald-700 font-bold">{L.grade} · {L.subject} · {L.items.length} items</div>
              {L.errors.length > 0 && (
                <div className="mt-1 text-[11px] text-amber-800 space-y-0.5">
                  {L.errors.map((e, i) => (
                    <div key={i}>⚠ {e}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {result.review.map((r, i) => (
            <div key={i} className="bg-rose-50 border border-rose-200 rounded-3xl p-4">
              <div className="font-black text-rose-900 text-sm">⛔ Quarantined — not imported</div>
              <div className="text-xs text-rose-700">{r.reason}</div>
              {r.errors && r.errors.length > 0 && (
                <div className="mt-1 text-[11px] text-rose-600 space-y-0.5">
                  {r.errors.map((e, j) => (
                    <div key={j}>⚠ {e}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {result.lessons.length > 0 && (
            <button onClick={importAll} className="w-full py-3 bg-emerald-600 text-white font-display font-black text-sm rounded-2xl shadow-lg active:scale-95 transition">
              Import {result.lessons.reduce((n, L) => n + L.items.length, 0)} items into their grades
            </button>
          )}
        </div>
      )}
    </div>
  );
}
