import React, { useMemo, useState } from 'react';
import { LuPlay, LuGraduationCap } from 'react-icons/lu';
import { useStore, currentLevel } from '../store/store.js';
import { GRADE_BY_KEY, chapterOf } from '../data/grades.js';
import { storiesInLevel } from '../engine/stories.js';
import { mathInLevel } from '../engine/math.js';
import { grammarQuiz } from '../engine/quizzes.js';
import { levelWords } from '../engine/wordbank.js';
import { vocabFor } from '../data/vocab.js';
import { getKgBook } from '../data/kgDecodable.js';
import { speak } from '../lib/speech.js';
import { SpeakBtn } from '../ui/ui.jsx';
import { ExplainBtn } from '../ui/Explainer.jsx';
import WordSheet from '../ui/WordSheet.jsx';
import { Link } from '../ui/router.js';

export default function Study() {
  const { state } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const [lv, setLv] = useState(currentLevel(state, g.key));
  const [open, setOpen] = useState(null);
  const words = useMemo(() => levelWords(g.key, lv), [g.key, lv]);
  const stories = useMemo(() => storiesInLevel(g.key, lv), [g.key, lv]);
  const math = useMemo(() => mathInLevel(g.key, lv).filter(Boolean).slice(0, 6), [g.key, lv]);
  const grammar = useMemo(() => grammarQuiz(g.key, 5, `study${lv}`), [g.key, lv]);
  const vocab = useMemo(() => vocabFor(g.key).slice(((lv - 1) * 3) % 30, ((lv - 1) * 3) % 30 + 4), [g.key, lv]);
  const kgBook = useMemo(() => (g.key === 'KG' ? getKgBook(lv) : null), [g.key, lv]);
  const book = state.wordbook || { learned: [], learning: [] };
  return (
    <>
      {open && <WordSheet word={open} grade={g.key} rate={state.settings.rate} onClose={() => setOpen(null)} />}
      <div className="col"><h1>📓 Study guides</h1><p className="muted">A study guide for every level: words to learn, story recaps, math tips and grammar rules. 50 guides for {g.label}.</p></div>
      <div className="card row wrap gap8" aria-label={`About ${g.label}`}>
        <span className="pill">Ages {g.age}</span>
        <span className="pill">{g.session}</span>
        <span className="pill">{g.numbers}</span>
      </div>
      <div className="lvgrid" role="tablist" aria-label="Choose a level">{Array.from({ length: 50 }, (_, i) => i + 1).map((n) => <button key={n} role="tab" aria-selected={n === lv} className={n === lv ? 'on' : ''} onClick={() => setLv(n)}>{n}</button>)}</div>
      <section className="hero"><span className="pill w">{chapterOf(g.key, lv)}</span><h1>Level {lv} guide</h1><div className="row wrap"><Link to={`/level/${lv}`} className="btn white sm"><LuPlay /> Play the level</Link><Link to="/exam" className="btn white sm"><LuGraduationCap /> Take the level {lv} test</Link></div></section>

      {g.key === 'KG' && kgBook && (
        <div className="card" style={{ borderLeft: `6px solid ${kgBook.accent_color || 'var(--primary)'}` }}>
          <div className="row wrap" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="row gap8" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '2rem' }}>{kgBook.emoji}</span>
              <div>
                <span className="pill" style={{ background: kgBook.accent_color, color: '#fff', fontWeight: 700 }}>
                  {kgBook.book_code}
                </span>
                <h2 style={{ margin: '4px 0 0 0' }}>{kgBook.title}</h2>
              </div>
            </div>
            <div className="row wrap gap8">
              {kgBook.target_sounds?.map((snd) => (
                <span key={snd} className="pill" style={{ background: 'var(--card-bg, #f1f3f5)', fontWeight: 600 }}>
                  🔊 {snd}
                </span>
              ))}
              <SpeakBtn small text={`${kgBook.title}. Target sound: ${kgBook.target_sounds?.join(', ')}. ${kgBook.sentences.join(' ')}`} label="Read Book" />
            </div>
          </div>

          <div className="row wrap gap16" style={{ marginTop: 16, alignItems: 'flex-start' }}>
            {kgBook.graphic?.svg && (
              <div
                style={{
                  width: 100,
                  height: 100,
                  flexShrink: 0,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
                dangerouslySetInnerHTML={{ __html: kgBook.graphic.svg }}
              />
            )}
            <div className="col grow gap8" style={{ minWidth: 220 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--muted)' }}>📖 Read Sentences:</div>
              <div className="col gap4">
                {kgBook.sentences.map((sent, sIdx) => (
                  <div key={sIdx} className="row wrap gap8" style={{ alignItems: 'center', background: 'var(--bg, #f8f9fa)', padding: '6px 10px', borderRadius: 8 }}>
                    <span className="grow" style={{ fontSize: '1rem', fontWeight: 500 }}>{sent}</span>
                    <SpeakBtn small text={sent} label="Hear" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col gap12" style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6 }}>🔤 Phonics CVC Words:</div>
              <div className="row wrap gap8">
                {kgBook.cvc_words?.map((w) => (
                  <button
                    key={w}
                    className="wchip learned"
                    style={{ fontSize: '1rem', padding: '6px 14px', cursor: 'pointer' }}
                    onClick={() => speak(w, { rate: state.settings.rate })}
                    title="Tap to hear"
                  >
                    🔊 {w}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6 }}>👀 Sight Words:</div>
              <div className="row wrap gap8">
                {kgBook.sight_words?.map((w) => (
                  <button
                    key={w}
                    className="wchip"
                    style={{ fontSize: '0.95rem', padding: '5px 12px', cursor: 'pointer' }}
                    onClick={() => speak(w, { rate: state.settings.rate })}
                    title="Tap to hear"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="row wrap gap8" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
            <Link to={`/read/KG/${(lv - 1) * 10 + 1}`} className="btn pri sm">
              📖 Read Story & Practice
            </Link>
          </div>
        </div>
      )}

      {g.key !== 'KG' && <div className="card"><h2>🔤 Words to learn</h2><p className="muted tiny">Tap a word to hear it, see meanings and examples, and practise it.</p>
        <div className="wordcloud" style={{ marginTop: 10 }}>{words.map((w) => <button key={w} className={`wchip ${book.learned.includes(w) ? 'learned' : book.learning.includes(w) ? 'learning' : ''}`} onClick={() => setOpen(w)}>{w}</button>)}</div>
        {vocab.length > 0 && <div className="col" style={{ marginTop: 12 }}>{vocab.map((v) => <div key={v.w} className="row wrap"><b>{v.w}</b><span className="pill">{v.pos}</span><span className="grow muted">{v.def}</span><SpeakBtn small text={`${v.w}. ${v.def}`} label="Hear it" /></div>)}</div>}
      </div>}
      <div className="card"><h2>📖 {g.key === 'KG' ? 'Phonics Readers' : 'Story recaps'}</h2>
        <div className="examgrid" style={{ marginTop: 10 }}>{stories.map((s, i) => <Link key={s.id} to={`/read/${g.key}/${s.n}`} className={`examcard c${i % 5}`} style={{ textDecoration: 'none' }}><span className="em">{s.emoji}</span><b>{s.title}</b><small>{s.kindLabel} · {s.wordCount} words</small></Link>)}</div>
      </div>
      <div className="card"><div className="row wrap" style={{ justifyContent: 'space-between' }}><h2>{g.key === 'KG' ? '🔤 Letters & numbers' : '🔢 Math corner'}</h2><ExplainBtn topic="math" small /></div><p className="muted tiny">Tap a problem to see how to solve it.</p>
        <div className="col" style={{ marginTop: 10 }}>{math.map((m) => <details key={m.id} className="reveal"><summary>{m.q}</summary><p><b>Answer: {m.options[m.answer]}</b>{m.explain ? ` — ${m.explain}` : ''}</p></details>)}</div>
      </div>
      {g.key !== 'KG' && <div className="card"><div className="row wrap" style={{ justifyContent: 'space-between' }}><h2>✏️ Grammar power</h2><ExplainBtn topic="grammar" small /></div>
        <div className="col" style={{ marginTop: 10 }}>{grammar.map((q) => <details key={q.id} className="reveal"><summary>{q.q}</summary><p><b>Answer: {q.options[q.answer]}</b>{q.explain ? ` — ${q.explain}` : ''}</p></details>)}</div>
      </div>}
    </>
  );
}
