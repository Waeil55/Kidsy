import React, { useState } from 'react';
import { 
  Keyboard, 
  Mic, 
  Edit3, 
  Puzzle, 
  CheckSquare, 
  ArrowLeftRight, 
  Target,
  Sparkles
} from 'lucide-react';
import { playPop } from '../utils/audio';

import SpellMode from './SpellMode';
import SpeechAILab from './SpeechAILab';
import WritingPad from './WritingPad';
import SyntaxBuilder from './SyntaxBuilder';
import SentenceMode from './SentenceMode';
import SynAntMode from './SynAntMode';
import QuizMode from './QuizMode';

export default function AssessmentHub({
  items = [],
  onStreakUpdate,
  onScoreUpdate,
  onOpenChat,
  initialMode = 'spelling'
}) {
  const [examMode, setExamMode] = useState(initialMode); // 'spelling' | 'speak' | 'writing' | 'syntax' | 'fillblanks' | 'synant' | 'match'

  const examTabs = [
    { id: 'spelling', label: '🔤 Spelling Design', icon: Keyboard },
    { id: 'speak', label: '🎙️ Speech AI Lab', icon: Mic },
    { id: 'writing', label: '✍️ Vector Tracing', icon: Edit3 },
    { id: 'syntax', label: '🧩 Syntax Builder', icon: Puzzle },
    { id: 'fillblanks', label: '📝 Fill Blanks', icon: CheckSquare },
    { id: 'synant', label: '🔄 Syn & Ant', icon: ArrowLeftRight },
    { id: 'match', label: '🎯 Match Quiz', icon: Target },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto">
      
      {/* Institutional Exam Header & Navigation */}
      <div className="flex items-center justify-between px-1 shrink-0 mb-1">
        <div>
          <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            Assessment Engine Active
          </span>
          <h3 className="font-fredoka text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
            <span>Enterprise Examination Suite</span>
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-fredoka text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <span>Rule:</span>
          <span className="text-rose-500 font-bold">-1 error</span>
          <span>•</span>
          <span className="text-emerald-500 font-bold">+10 win</span>
        </div>
      </div>

      {/* Mode Carousel Bar (Tactile Squish Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-1 px-1 shrink-0">
        {examTabs.map((tab) => {
          const isActive = examMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { playPop(); setExamMode(tab.id); }}
              className={`squish-btn px-3 py-1.5 rounded-2xl font-fredoka text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-squish-indigo'
                  : 'bg-white dark:bg-kid-nightCard text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Exam Lab Body */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between">
        {examMode === 'spelling' && (
          <SpellMode
            items={items}
            onStreakUpdate={onStreakUpdate}
            onOpenChat={onOpenChat}
          />
        )}

        {examMode === 'speak' && (
          <SpeechAILab
            items={items}
            onScoreUpdate={onScoreUpdate}
            onOpenChat={onOpenChat}
          />
        )}

        {examMode === 'writing' && (
          <WritingPad
            items={items}
            onScoreUpdate={onScoreUpdate}
            onOpenChat={onOpenChat}
          />
        )}

        {examMode === 'syntax' && (
          <SyntaxBuilder
            items={items}
            onScoreUpdate={onScoreUpdate}
            onOpenChat={onOpenChat}
          />
        )}

        {examMode === 'fillblanks' && (
          <SentenceMode
            items={items}
            onStreakUpdate={onStreakUpdate}
            onOpenChat={onOpenChat}
          />
        )}

        {examMode === 'synant' && (
          <SynAntMode
            items={items}
            onStreakUpdate={onStreakUpdate}
            onOpenChat={onOpenChat}
          />
        )}

        {examMode === 'match' && (
          <QuizMode
            items={items}
            onStreakUpdate={onStreakUpdate}
            onOpenChat={onOpenChat}
          />
        )}
      </div>

    </div>
  );
}
