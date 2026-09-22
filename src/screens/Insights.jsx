import React, { useMemo } from 'react';
import { LuArrowRight, LuAward, LuBookOpen, LuBrain, LuCheck, LuFlame, LuGauge, LuMic, LuSparkles, LuTarget } from 'react-icons/lu';
import { useStore, currentLevel, gradeSummary, levelStats } from '../store/store.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { Link } from '../ui/router.js';
import { Bar } from '../ui/ui.jsx';

const SUBJECTS = [
  ['reading', 'Stories', '📖', '#20b7df', '/map'],
  ['vocab', 'Words', '🔤', '#ff9d42', '/words'],
  ['math', 'Math', '🔢', '#73cf55', '/practice'],
  ['grammar', 'Grammar', '✏️', '#f47778', '/practice'],
  ['speaking', 'Speaking', '🎙️', '#9a78e8', '/speaking'],
];

export default function Insights() {
  const { state } = useStore();
  const grade = GRADE_BY_KEY[state.gradeKey];
  const level = currentLevel(state, state.gradeKey);
  const summary = gradeSummary(state, state.gradeKey);
  const levelInfo = levelStats(state, state.gradeKey, level);
  const subjectStats = useMemo(() => SUBJECTS.map(([key, label, emoji, color, to]) => {
    const item = state.stats.bySubject[key] || { c: 0, w: 0 };
    const total = item.c + item.w;
    return { key, label, emoji, color, to, total, pct: total ? Math.round((item.c / total) * 100) : 0, correct: item.c };
  }), [state.stats.bySubject]);
  const recommendation = subjectStats.filter((x) => x.total).sort((a, b) => a.pct - b.pct)[0] || subjectStats[0];
  return <div className="insights-page">
    <section className="insights-hero"><div><span className="eyebrow">Your learning command center</span><h1>{grade.emoji} {grade.label} progress</h1><p>A simple view of what you know, what to practise next, and how far you have travelled.</p><div className="row wrap gap8" style={{ marginTop: 8 }}><span className="pill w">Ages {grade.age}</span><span className="pill w">{grade.session}</span></div></div><div className="insights-level"><span>Level</span><b>{level}</b><small>of 50</small></div></section>
    <section className="insights-kpis"><div><LuFlame /><b>{state.stats.streak}</b><small>day streak</small></div><div><LuTarget /><b>{state.score}</b><small>points</small></div><div><LuAward /><b>{summary.stars}</b><small>stars earned</small></div><div><LuCheck /><b>{summary.cleared}</b><small>levels cleared</small></div></section>
    <section className="insights-grid">
      <div className="card insights-panel"><div className="panel-title"><div><span className="eyebrow">Mastery map</span><h2>Skills snapshot</h2></div><LuGauge /></div><div className="mastery-list">{subjectStats.map((item) => <Link key={item.key} to={item.to} className="mastery-row"><span className="mastery-icon" style={{ background: item.color }}>{item.emoji}</span><span className="mastery-name"><b>{item.label}</b><small>{item.total ? `${item.correct} correct answers` : 'Ready to begin'}</small></span><span className="mastery-value">{item.pct}%</span><span className="mastery-bar"><i style={{ width: `${item.pct}%`, background: item.color }} /></span><LuArrowRight /></Link>)}</div></div>
      <div className="card insights-panel next-panel"><div className="panel-title"><div><span className="eyebrow">Smart recommendation</span><h2>Next best step</h2></div><LuSparkles /></div><div className="recommendation"><span className="recommendation-art">{recommendation.emoji}</span><div><small>Build confidence in</small><h3>{recommendation.label}</h3><p>{recommendation.pct ? `You are at ${recommendation.pct}%. A short practice round will strengthen this skill.` : 'Start with a short activity and unlock your first mastery score.'}</p><Link to={recommendation.to} className="btn sm"><LuArrowRight /> Start now</Link></div></div><div className="level-mini"><span>Current level progress</span><b>{levelInfo.cleared ? 'Cleared!' : `${levelInfo.stories}/10 stories complete`}</b><Bar pct={levelInfo.cleared ? 100 : levelInfo.stories * 10} /></div></div>
    </section>
    <section className="card insights-panel"><div className="panel-title"><div><span className="eyebrow">Learning history</span><h2>Recent assessments</h2></div><LuBookOpen /></div>{state.exams.length ? <div className="assessment-list">{state.exams.slice(0, 5).map((exam, index) => <div className="assessment-row" key={`${exam.date || index}-${index}`}><span className="assessment-dot"><LuCheck /></span><div className="grow"><b>{exam.title || 'Mixed assessment'}</b><small>{exam.date || 'Completed assessment'} · {exam.pct}%</small></div><strong>{exam.correct}/{exam.total}</strong></div>)}</div> : <div className="insights-empty"><LuBrain /><b>Your learning history starts here.</b><span>Complete a practice round or exam and your progress will appear on this page.</span></div>}</section>
    <div className="insights-footer"><LuMic /> Every grade stays private to this {grade.short} profile.</div>
  </div>;
}
