import React, { useMemo, useState } from 'react';
import { LuBrain, LuCheck, LuChevronRight, LuFlipHorizontal, LuLightbulb, LuRotateCcw, LuSparkles, LuX } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { G3_PDF_WORD_ROWS, G3_WORD_WEEKS, G3_NOUNS, G3_PLURALS, G3_RULES, G3_DAILY, G3_QUIZ, G3_KEY, G3_QUIZ_KEY } from '../data/g3ela.js';
import { g3PdfQuiz } from '../engine/quizzes.js';
import { buildMaterialExam } from '../engine/examBuilder.js';
import { normText } from '../lib/rng.js';
import { speak } from '../lib/speech.js';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Seg, SpeakBtn, Notice, Crumb, toast } from '../ui/ui.jsx';
import { go } from '../ui/router.js';

const TABS = [['words', 'Word list'], ['flashcards', 'Flashcards'], ['smart', 'Smart review'], ['quiz', 'Quiz'], ['workbook', 'Workbook']];
const WORKBOOK = [['daily', 'Daily review'], ['nouns', 'Nouns & plurals'], ['rules', 'Rules'], ['pdfquiz', 'Practice quiz'], ['key', 'Answer key']];
const WEEK_OPTIONS = [{ key: 'all', label: 'All weeks' }, ...G3_WORD_WEEKS.map((w) => ({ key: w.key, label: w.label }))];
const rowsOfWeek = (week) => (week === 'all' ? G3_WORD_WEEKS.flatMap((w) => w.rows) : (G3_WORD_WEEKS.find((w) => w.key === week) || { rows: G3_PDF_WORD_ROWS }).rows);
const sameAns = (a, list) => list.some((x) => normText(x).replace(/[^a-z0-9 ]/g, '') === normText(a).replace(/[^a-z0-9 ]/g, ''));

function Flashcards({ rows }) {
  const { state, dispatch } = useStore();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const card = rows[index % rows.length];
  const mark = (value) => {
    setKnown((old) => old.includes(card[0]) ? old : [...old, card[0]]);
    dispatch({ type: 'answer', grade: 'G3', subject: 'flashcards', correct: value });
    setFlipped(false); setIndex((n) => n + 1);
  };
  return <div className="g3-study-mode">
    <div className="study-mode-head"><div><span className="eyebrow">Active recall</span><h2>Flashcard flight</h2><p>Think first, flip second. Move through the words at your own pace.</p></div><span className="study-counter"><b>{known.length}</b> / {rows.length}<small>mastered</small></span></div>
    <button className={`g3-flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)} aria-label={flipped ? 'Show word' : 'Show meaning'}>
      <span className="flashcard-face front"><small>What word matches this meaning?</small><b>{flipped ? card[0] : card[2]}</b><em><LuFlipHorizontal /> Tap to flip</em></span>
      <span className="flashcard-face back"><small>{card[1]}</small><b>{card[0]}</b><span>{card[2]}</span><em>Example: {card[5]}</em></span>
    </button>
    <div className="flashcard-actions"><button className="btn soft" onClick={() => mark(false)}><LuRotateCcw /> Practice again</button><button className="btn" onClick={() => mark(true)}><LuCheck /> I know it</button></div>
    <div className="study-progress"><i style={{ width: `${(known.length / rows.length) * 100}%` }} /></div>
    <p className="tiny muted center">Card {index % rows.length + 1} of {rows.length} · Your progress is saved with your score.</p>
  </div>;
}

function SmartReview({ rows }) {
  const { dispatch } = useStore();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const cards = rows;
  const card = cards[index % cards.length];
  const options = useMemo(() => {
    const pool = G3_PDF_WORD_ROWS.filter((x) => x[0] !== card[0]);
    const others = pool.slice((index * 3) % (pool.length - 3), (index * 3) % (pool.length - 3) + 3);
    return [card, ...others].sort((a, b) => a[0].localeCompare(b[0]));
  }, [card, cards, index]);
  const choose = (word) => {
    if (picked) return;
    const ok = word === card[0]; setPicked(word); setScore((n) => n + (ok ? 1 : 0));
    dispatch({ type: 'answer', grade: 'G3', subject: 'smart-review', correct: ok });
  };
  const next = () => { setPicked(null); setIndex((n) => n + 1); };
  return <div className="g3-study-mode smart-review"><div className="study-mode-head"><div><span className="eyebrow">Adaptive practice</span><h2>Smart review</h2><p>Quick questions mix meaning, word type, synonyms, and examples.</p></div><span className="study-counter"><b>{score}</b> / {index + (picked ? 1 : 0)}<small>correct</small></span></div><div className="smart-question"><span className="pill"><LuBrain /> Question {index + 1}</span><h3>Which word means:</h3><p>“{card[2]}”</p><button className="smart-listen" onClick={() => speak(card[2])}>🔊 Hear the clue</button></div><div className="smart-options">{options.map((option) => <button key={option[0]} className={picked ? option[0] === card[0] ? 'right' : option[0] === picked ? 'wrong' : 'quiet' : ''} onClick={() => choose(option[0])} disabled={!!picked}><b>{option[0]}</b><small>{option[1]}</small></button>)}</div>{picked && <div className={`notice ${picked === card[0] ? 'info' : 'warn'}`}><span>{picked === card[0] ? '🎉' : '💡'}</span><div><b>{picked === card[0] ? 'Great thinking!' : `The answer is ${card[0]}.`}</b><div className="tiny">{card[5]}</div></div></div>}<button className="btn" disabled={!picked} onClick={next}><LuChevronRight /> Next smart question</button></div>;
}

function Daily({ d, key_ }) {
  const { state, dispatch } = useStore();
  const [v, setV] = useState({ pron: '', edit: '', p0: '', p1: '', title: '', sort: {} });
  const [res, setRes] = useState(null);
  const check = () => {
    const r = {
      pron: normText(v.pron).includes(normText(d.pronoun.answer)) && normText(d.pronoun.answer).length > 0,
      edit: sameAns(v.edit, d.edit.answers),
      p0: normText(v.p0) === normText(d.plurals[0].pl), p1: normText(v.p1) === normText(d.plurals[1].pl),
      title: sameAns(v.title, d.title.answers),
    };
    const sortOk = d.sort.words.map((w) => (v.sort[w] === 'abstract') === d.sort.abstract.includes(w) && v.sort[w] != null);
    r.sort = sortOk;
    if (!res) [r.pron, r.edit, r.p0, r.p1, r.title, ...sortOk].forEach((ok) => dispatch({ type: 'answer', grade: 'G3', subject: 'grammar', correct: ok }));
    setRes(r);
    toast(res ? 'Checked again (points only count the first time)' : 'Checked!', '📝');
  };
  const Mark = ({ ok }) => (res ? (ok ? <LuCheck color="#16a34a" /> : <LuX color="#e11d48" />) : null);
  return (
    <div className="card col">
      <h2>{d.day}</h2>
      <label className="f">1. Pronoun: in “{d.pronoun.text}” who or what does <u>{d.pronoun.underlined}</u> mean? <Mark ok={res?.pron} />
        <input value={v.pron} onChange={(e) => setV({ ...v, pron: e.target.value })} /></label>
      <label className="f">2. Fix this sentence: “{d.edit.text}” <Mark ok={res?.edit} />
        <input value={v.edit} onChange={(e) => setV({ ...v, edit: e.target.value })} /></label>
      <div className="grid g2">
        {d.plurals.map((p, k) => <label key={k} className="f">3. Plural of “{p.sg}” <Mark ok={res?.['p' + k]} /><input value={v['p' + k]} onChange={(e) => setV({ ...v, ['p' + k]: e.target.value })} /></label>)}
      </div>
      <label className="f">4. Write this book title correctly: “{d.title.text}” <Mark ok={res?.title} />
        <input value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></label>
      <div className="f">5. Sort the nouns
        {d.sort.words.map((w, k) => (
          <div key={w} className="row" style={{ marginTop: 6 }}>
            <b style={{ minWidth: 110 }}>{w}</b>
            <div className="seg">{['abstract', 'concrete'].map((t) => <button key={t} className={v.sort[w] === t ? 'on' : ''} onClick={() => setV({ ...v, sort: { ...v.sort, [w]: t } })}>{t}</button>)}</div>
            <Mark ok={res?.sort[k]} />
          </div>
        ))}
      </div>
      <p className="tiny muted"><b>Challenge:</b> {d.challenge}</p>
      <div className="row wrap"><button className="btn" onClick={check}>Check my answers</button></div>
      {res && (
        <div className="notice info"><span>🔑</span><div>
          {G3_KEY.find((k) => k.day === d.day).lines.map((l, k) => <div key={k}>{l}</div>)}
          <div className="tiny" style={{ marginTop: 6 }}>{G3_KEY.find((k) => k.day === d.day).analysis}</div>
        </div></div>
      )}
    </div>
  );
}

export default function G3Pack({ tab }) {
  const { state } = useStore();
  const t = TABS.find((x) => x[0] === tab) ? tab : 'words';
  const [week, setWeek] = useState('all');
  const [book, setBook] = useState('daily');
  const [sec, setSec] = useState('A');
  const [quizAt, setQuizAt] = useState(Date.now());
  const rows = rowsOfWeek(week);
  const quizItems = useMemo(() => buildMaterialExam({ grade: 'G3', selected: week === 'all' ? G3_WORD_WEEKS.map((w) => `week:${w.key}`) : [`week:${week}`], size: Math.min(20, rows.length * 4), seed: `wk-${quizAt}` }), [week, quizAt, rows.length]);
  if (state.gradeKey !== 'G3') return <Notice kind="warn">Merola weekly words belongs to Grade 3.</Notice>;
  return (
    <>
      <Seg value={t} onChange={(x) => go('/g3pack/' + x)} options={TABS.map(([key, label]) => ({ key, label }))} />
      {t !== 'workbook' && <div className="week-pick"><span className="muted tiny">Week</span><Seg value={week} onChange={setWeek} options={WEEK_OPTIONS} /></div>}

      {t === 'words' && (
        <div className="wk-cards">
          {rows.map((r) => (
            <div key={r[0]} className="card wk-card">
              <div className="row"><b className="grow wk-card-w">{r[0]}</b><span className="pill">{r[1]}</span><SpeakBtn small text={`${r[0]}. ${r[2]}`} label="Hear it" /></div>
              <p className="wk-card-def">{r[2]}</p>
              <div className="wk-card-sa"><span><small>Same</small>{r[3]}</span><span><small>Opposite</small>{r[4]}</span></div>
              <p className="tiny muted"><i>{r[5]}</i></p>
            </div>
          ))}
        </div>
      )}

      {t === 'flashcards' && <Flashcards key={week} rows={rows} />}
      {t === 'smart' && <SmartReview key={week} rows={rows} />}
      {t === 'quiz' && <QuizRunner key={`${week}-${quizAt}`} items={quizItems} grade="G3" subject="vocab" title={`${WEEK_OPTIONS.find((w) => w.key === week).label} quiz`}
        renderFinish={() => <button className="btn" onClick={() => setQuizAt(Date.now())}>New quiz</button>} />}

      {t === 'workbook' && (
        <>
          <p className="muted">Grammar workbook from the Weeks 5–6 guide.</p>
          <Seg value={book} onChange={setBook} options={WORKBOOK.map(([key, label]) => ({ key, label }))} />
          {book === 'daily' && <div className="col gap20">{G3_DAILY.map((d) => <Daily key={d.day} d={d} />)}</div>}
          {book === 'nouns' && (
            <div className="grid g2">
              <div className="card col"><h3>Concrete nouns</h3><div className="row wrap">{G3_NOUNS.concrete.map((w) => <span key={w} className="pill ok">{w}</span>)}</div><h3 style={{ marginTop: 12 }}>Abstract nouns</h3><div className="row wrap">{G3_NOUNS.abstract.map((w) => <span key={w} className="pill gold">{w}</span>)}</div></div>
              <div className="card scrollx"><h3>Plural spelling</h3><table className="tbl" style={{ marginTop: 8 }}><thead><tr><th>One</th><th>Rule</th><th>More than one</th></tr></thead><tbody>{G3_PLURALS.map((p) => <tr key={p.sg}><td>{p.sg}</td><td>{p.rule}</td><td><b>{p.pl}</b></td></tr>)}</tbody></table></div>
            </div>
          )}
          {book === 'rules' && <div className="grid g2">{G3_RULES.map((r) => <div key={r.id} className="card col"><h3>{r.title}</h3>{r.intro && <p>{r.intro}</p>}<ul style={{ margin: 0, paddingLeft: 20 }}>{r.bullets.map((b, k) => <li key={k} style={{ marginBottom: 6 }}>{b}</li>)}</ul></div>)}</div>}
          {book === 'pdfquiz' && (
            <>
              <Seg value={sec} onChange={setSec} options={['A', 'B', 'C', 'D'].map((k) => ({ key: k, label: `${k}. ${G3_QUIZ[k].title}` }))} />
              {sec === 'A' && <Notice>{G3_QUIZ.A.instruction} (choose the word that matches each meaning)</Notice>}
              {sec === 'C' && <Notice>Word box: {G3_QUIZ.C.wordBox.join(', ')}</Notice>}
              <QuizRunner key={sec} items={g3PdfQuiz(sec)} grade="G3" subject={{ A: 'vocab', B: 'vocab', C: 'fill', D: 'grammar' }[sec]} title={`Section ${sec}`}
                renderFinish={() => <div className="notice info"><span>🔑</span><div><b>Answer key:</b> {G3_QUIZ_KEY[sec]}</div></div>} />
            </>
          )}
          {book === 'key' && (
            <div className="grid g2">
              {G3_KEY.map((k) => <div key={k.day} className="card col"><h3>{k.day}</h3>{k.lines.map((l, i) => <div key={i}>{l}</div>)}<p className="tiny muted"><b>Error analysis:</b> {k.analysis}</p>{k.note && <p className="tiny muted">{k.note}</p>}</div>)}
              <div className="card col"><h3>Practice quiz key</h3>{Object.entries(G3_QUIZ_KEY).map(([s, v]) => <div key={s}><b>{s}.</b> {v}</div>)}</div>
            </div>
          )}
        </>
      )}
    </>
  );
}
