import React from 'react';
import { LuArrowLeft, LuBookOpen, LuPenLine, LuPuzzle, LuSpellCheck } from 'react-icons/lu';
import { Link } from '../ui/router.js';
import { G3_PDF_WORD_ROWS } from '../data/g3ela.js';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Rich } from '../ui/ui.jsx';
import { merolaCounts, merolaLessons, merolaStories, merolaWordParts, readingSentences, spellingWords } from '../data/merola.js';

const tabs = [
  ['lessons', 'Lesson quizzes', LuPuzzle],
  ['stories', 'Reading stories', LuBookOpen],
  ['parts', 'Word parts', LuSpellCheck],
  ['words', 'Reading & spelling', LuPenLine],
];

const Back = () => <Link to="/merola" className="btn ghost sm"><LuArrowLeft /> All Merola content</Link>;

function GroupList({ groups, kind, label }) {
  return <div className="grid g2">{groups.map((group, index) => <Link key={group.title} to={`/merola/${kind}/${index}`} className="card tile t2" style={{ textDecoration: 'none' }}><b>{group.title}</b><span>{group.instr}</span><small>{group.items.length} questions</small></Link>)}</div>;
}

export default function MerolaPack({ section, index = 0 }) {
  if ((section === 'lessons' || section === 'parts') && index !== null) {
    const groups = section === 'lessons' ? merolaLessons : merolaWordParts;
    const group = groups[index];
    if (!group) return <><Back /><p className="muted">That content group was not found.</p></>;
    return <><Back /><div className="col"><span className="pill">Merola library</span><h1>{group.title}</h1><p className="muted"><Rich text={group.instr} /></p></div><QuizRunner items={group.items} grade="G3" subject="vocab" title="Practice" /></>;
  }

  if (section === 'stories' && index !== null) {
    const story = merolaStories[index];
    if (!story) return <><Back /><p className="muted">That story was not found.</p></>;
    return <><Back /><article className="card story"><span className="pill">Merola reading</span><h1>{story.title}</h1><p><Rich text={story.passage} /></p></article><QuizRunner items={story.items} grade="G3" subject="reading" title="Check your reading" /></>;
  }

  if (section === 'words') return <><Back /><div className="col"><span className="pill">Merola library</span><h1>Reading and spelling bank</h1><p className="muted">{readingSentences.length} reading sentences and {spellingWords.length} spelling words from the Merola collection.</p></div><section className="card"><h2>Reading sentences</h2><div className="grid g3">{readingSentences.map((sentence, index) => <p className="soft" style={{ padding: 10, margin: 0 }} key={`${sentence}-${index}`}>{sentence}</p>)}</div></section><section className="card"><h2>Spelling words</h2><div className="chips">{spellingWords.map((word, index) => <span className="pill" key={`${word}-${index}`}>{word}</span>)}</div></section></>;

  if (section === 'lessons' || section === 'parts' || section === 'stories') {
    const groups = section === 'lessons' ? merolaLessons : section === 'parts' ? merolaWordParts : merolaStories;
    const kind = section === 'parts' ? 'parts' : section;
    return <><Back /><div className="col"><span className="pill">Merola library</span><h1>{section === 'lessons' ? 'Lesson quizzes' : section === 'parts' ? 'Word parts' : 'Reading stories'}</h1><p className="muted">Choose a group to start.</p></div><GroupList groups={groups} kind={kind} label={section} /></>;
  }

  return <><section className="hero"><span className="emoji">📚</span><span className="pill w">Imported content collection</span><h1>Merola library</h1><p>More lessons, stories, word parts, reading sentences and spelling practice inside Kidsy.</p></section><div className="grid g4">{tabs.map(([key, label, Icon]) => <Link key={key} to={`/merola/${key}`} className="tile t2"><Icon className="ico" /><b>{label}</b><span>{key === 'lessons' ? `${merolaCounts.lessons} groups · ${merolaCounts.lessonQuestions} questions` : key === 'stories' ? `${merolaCounts.stories} stories` : key === 'parts' ? `${merolaCounts.wordParts} word-part groups` : `${merolaCounts.readingSentences} sentences · ${merolaCounts.spellingWords} words`}</span></Link>)}<Link to="/g3pack" className="tile t2"><LuBookOpen className="ico" /><b>Weekly words</b><span>{G3_PDF_WORD_ROWS.length} vocabulary words, daily review and a practice quiz</span></Link></div>{!section && <><h2>Lesson quizzes</h2><GroupList groups={merolaLessons.slice(0, 4)} kind="lessons" label="Lesson quizzes" /><h2>Reading stories</h2><GroupList groups={merolaStories} kind="stories" label="Reading stories" /></>}</>;
}