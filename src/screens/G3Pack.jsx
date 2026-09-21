import React, { useState } from 'react';
import { LuCheck, LuX } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { G3_PDF_META, G3_PDF_WORD_ROWS, G3_NOUNS, G3_PLURALS, G3_RULES, G3_DAILY, G3_QUIZ, G3_KEY, G3_QUIZ_KEY } from '../data/g3ela.js';
import { g3PdfQuiz } from '../engine/quizzes.js';
import { normText } from '../lib/rng.js';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Seg, SpeakBtn, Notice, Crumb, toast } from '../ui/ui.jsx';
import { go } from '../ui/router.js';

const TABS = [['overview', 'Overview'], ['vocab', 'Vocabulary'], ['nouns', 'Nouns & plurals'], ['rules', 'Rules'], ['daily', 'Daily review'], ['quiz', 'Practice quiz'], ['key', 'Answer key']];
const sameAns = (a, list) => list.some((x) => normText(x).replace(/[^a-z0-9 ]/g, '') === normText(a).replace(/[^a-z0-9 ]/g, ''));

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
  const t = TABS.find((x) => x[0] === tab) ? tab : 'overview';
  const [sec, setSec] = useState('A');
  if (state.gradeKey !== 'G3') return <Notice kind="warn">The Grade 3 ELA pack belongs to Grade 3. Switch to <b>G3</b> in the menu to open it.</Notice>;
  return (
    <>
      <div className="col"><h1>📘 {G3_PDF_META.title}</h1><p className="muted">{G3_PDF_META.subtitle}</p></div>
      <Seg value={t} onChange={(x) => go('/g3pack/' + x)} options={TABS.map(([key, label]) => ({ key, label }))} />

      {t === 'overview' && (
        <div className="grid g2">
          <div className="card col"><h3>About this pack</h3>
            <p>Everything in this pack comes straight from your PDF <b>{G3_PDF_META.source}</b>, word for word: {G3_PDF_META.units}.</p>
            <ul><li>{G3_PDF_WORD_ROWS.length} vocabulary words with meanings, synonyms, antonyms and examples</li><li>Concrete and abstract nouns, plural spelling rules</li><li>4 days of daily spiral review worksheets</li><li>A practice quiz (A–D) and the full answer key</li></ul>
            <p className="muted tiny">The words also appear in Grade 3 vocabulary practice, exams and the big index.</p></div>
          <div className="card col"><h3>Start here</h3>
            {[['vocab', '🔤 Learn the words'], ['daily', '📝 Do a daily review'], ['quiz', '🎯 Take the practice quiz']].map(([k, l]) => <button key={k} className="btn soft" onClick={() => go('/g3pack/' + k)}>{l}</button>)}</div>
        </div>
      )}

      {t === 'vocab' && (
        <div className="card scrollx"><table className="tbl"><thead><tr><th>Word</th><th>Type</th><th>Meaning</th><th>Synonyms</th><th>Antonyms</th><th>Example</th></tr></thead>
          <tbody>{G3_PDF_WORD_ROWS.map((r) => <tr key={r[0]}><td><b>{r[0]}</b> <SpeakBtn small text={`${r[0]}. ${r[2]}`} label="Hear it" /></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td><i>{r[5]}</i></td></tr>)}</tbody></table></div>
      )}

      {t === 'nouns' && (
        <div className="grid g2">
          <div className="card col"><h3>Concrete nouns</h3><div className="row wrap">{G3_NOUNS.concrete.map((w) => <span key={w} className="pill ok">{w}</span>)}</div><h3 style={{ marginTop: 12 }}>Abstract nouns</h3><div className="row wrap">{G3_NOUNS.abstract.map((w) => <span key={w} className="pill gold">{w}</span>)}</div></div>
          <div className="card scrollx"><h3>Plural spelling</h3><table className="tbl" style={{ marginTop: 8 }}><thead><tr><th>One</th><th>Rule</th><th>More than one</th></tr></thead><tbody>{G3_PLURALS.map((p) => <tr key={p.sg}><td>{p.sg}</td><td>{p.rule}</td><td><b>{p.pl}</b></td></tr>)}</tbody></table></div>
        </div>
      )}

      {t === 'rules' && (
        <div className="grid g2">{G3_RULES.map((r) => <div key={r.id} className="card col"><h3>{r.title}</h3>{r.intro && <p>{r.intro}</p>}<ul style={{ margin: 0, paddingLeft: 20 }}>{r.bullets.map((b, k) => <li key={k} style={{ marginBottom: 6 }}>{b}</li>)}</ul></div>)}</div>
      )}

      {t === 'daily' && <div className="col gap20">{G3_DAILY.map((d) => <Daily key={d.day} d={d} />)}</div>}

      {t === 'quiz' && (
        <>
          <Seg value={sec} onChange={setSec} options={['A', 'B', 'C', 'D'].map((k) => ({ key: k, label: `${k}. ${G3_QUIZ[k].title}` }))} />
          {sec === 'A' && <Notice>{G3_QUIZ.A.instruction} (choose the word that matches each meaning)</Notice>}
          {sec === 'C' && <Notice>Word box: {G3_QUIZ.C.wordBox.join(', ')}</Notice>}
          <QuizRunner key={sec} items={g3PdfQuiz(sec)} grade="G3" subject={{ A: 'vocab', B: 'vocab', C: 'fill', D: 'grammar' }[sec]} title={`Section ${sec}`}
            renderFinish={() => <div className="notice info"><span>🔑</span><div><b>Answer key:</b> {G3_QUIZ_KEY[sec]}</div></div>} />
        </>
      )}

      {t === 'key' && (
        <div className="grid g2">
          {G3_KEY.map((k) => <div key={k.day} className="card col"><h3>{k.day}</h3>{k.lines.map((l, i) => <div key={i}>{l}</div>)}<p className="tiny muted"><b>Error analysis:</b> {k.analysis}</p>{k.note && <p className="tiny muted">{k.note}</p>}</div>)}
          <div className="card col"><h3>Practice quiz key</h3>{Object.entries(G3_QUIZ_KEY).map(([s, v]) => <div key={s}><b>{s}.</b> {v}</div>)}</div>
        </div>
      )}
    </>
  );
}
