import React, { useMemo, useState } from 'react';
import { LuArrowRight, LuRotateCcw } from 'react-icons/lu';
import { useStore, levelUnlocked, currentLevel } from '../store/store.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { mathInLevel, mathNo } from '../engine/math.js';
import { fillLevel, vocabQuiz, grammarQuiz, customToItems } from '../engine/quizzes.js';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Crumb, Seg, Notice } from '../ui/ui.jsx';
import { Link, go } from '../ui/router.js';

export const KINDS = [
  { key: 'math', label: 'Math', emoji: '🔢', blurb: '10 problems per level, 500 in all' },
  { key: 'fill', label: 'Fill in the blank', emoji: '🧩', blurb: 'Choose the word that fits the sentence' },
  { key: 'vocab', label: 'Vocabulary', emoji: '🔤', blurb: 'Meanings, synonyms and antonyms' },
  { key: 'grammar', label: 'Grammar', emoji: '✏️', blurb: 'Plurals, tenses, punctuation and more' },
];

export function PracticeHub() {
  const { state } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const [lv, setLv] = useState(currentLevel(state, g.key));
  const levels = Array.from({ length: 50 }, (_, i) => i + 1).filter((l) => levelUnlocked(state, g.key, l));
  return (
    <>
      <div className="col"><h1>🎯 Practice</h1><p className="muted">Pick a level, then pick a game to play. Every right answer wins you a point!</p></div>
      <div className="card row wrap">
        <label className="f" style={{ minWidth: 200 }}>Level<select value={lv} onChange={(e) => setLv(+e.target.value)}>{levels.map((l) => <option key={l} value={l}>Level {l}</option>)}</select></label>
        <span className="muted tiny">Grade: {g.label}</span>
      </div>
      <div className="grid g2">
        {KINDS.map((k) => <Link key={k.key} to={`/play/${k.key}/${lv}`} className="tile t2"><span className="ico">{k.emoji}</span><b>{k.label}</b><span>{k.blurb}</span></Link>)}
      </div>
      <Notice>Looking for stories? Open the <Link to="/map">Adventure map</Link>. Want a test? Try <Link to="/exam">Exams</Link>. Want a level-by-level review sheet? Open <Link to="/study">Study guides</Link>, or search everything in the <Link to="/index">Big index</Link>.</Notice>
    </>
  );
}

export function PlayScreen({ kind, level }) {
  const { state, dispatch } = useStore();
  const grade = state.gradeKey;
  const lv = level || currentLevel(state, grade);
  const [attempt, setAttempt] = useState(0);
  const k = KINDS.find((x) => x.key === kind) || KINDS[0];
  const extraWords = state.custom.words.filter((w) => w.grade === grade);
  const customQ = customToItems(state.custom.qa.filter((q) => q.grade === grade && q.subject === kind));

  const items = useMemo(() => {
    if (kind === 'math') return mathInLevel(grade, lv).filter(Boolean).map((m) => ({ id: m.id, q: m.q, options: m.options, answer: m.answer, subject: 'math', explain: m.explain }));
    if (kind === 'fill') {
      const mine = customToItems(state.custom.fill.filter((f) => f.grade === grade)).map((x) => ({ ...x, subject: 'fill' }));
      return [...fillLevel(grade, lv), ...mine.slice(0, 3)].slice(0, 12);
    }
    if (kind === 'vocab') return vocabQuiz(grade, 10, `L${lv}-${attempt}`, extraWords.map((w) => ({ w: w.w, pos: w.pos || 'noun', def: w.def, syn: w.syn || [], ant: w.ant || [], ex: w.ex || '' })));
    return grammarQuiz(grade, 10, `L${lv}-${attempt}`);
    // eslint-disable-next-line
  }, [kind, grade, lv, attempt]);

  const onFinish = (res) => { if (kind === 'math' || kind === 'fill') dispatch({ type: 'set-done', grade, area: kind, level: lv, correct: res.correct, total: res.total }); };
  return (
    <>
      <Crumb to={`/level/${lv}`}>Level {lv}</Crumb>
      <div className="row wrap"><h1 className="grow">{k.emoji} {k.label}</h1><Seg value={kind} onChange={(x) => go(`/play/${x}/${lv}`)} options={KINDS.map((x) => ({ key: x.key, label: x.label }))} /></div>
      <QuizRunner key={`${kind}-${lv}-${attempt}`} items={items} grade={grade} subject={kind} title={`${k.label} · level ${lv}`} onFinish={onFinish}
        renderFinish={() => (
          <div className="row wrap" style={{ justifyContent: 'center' }}>
            {lv < 50 && levelUnlocked(state, grade, lv + 1) && <Link to={`/play/${kind}/${lv + 1}`} className="btn">Level {lv + 1} <LuArrowRight /></Link>}
            <button className="btn soft" onClick={() => setAttempt(attempt + 1)}><LuRotateCcw /> New questions</button>
            <Link to={`/level/${lv}`} className="btn ghost">Back to level {lv}</Link>
          </div>
        )} />
    </>
  );
}
