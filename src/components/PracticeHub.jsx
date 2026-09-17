import React, { useState } from 'react';
import { 
  Keyboard, 
  Mic, 
  Edit3, 
  Puzzle, 
  CheckSquare, 
  ArrowLeftRight, 
  BookOpen, 
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { playPop } from '../utils/audio';

import SpellMode from './SpellMode';
import SpeechAILab from './SpeechAILab';
import WritingPad from './WritingPad';
import SyntaxBuilder from './SyntaxBuilder';
import SentenceMode from './SentenceMode';
import SynAntMode from './SynAntMode';
import StudyMode from './StudyMode';

export default function PracticeHub({
  items = [],
  onStreakUpdate,
  onScoreUpdate,
  onOpenChat,
  hearts = 5
}) {
  const [activeActivity, setActiveActivity] = useState(null);

  const activities = [
    {
      id: 'spell',
      title: 'Spelling Bee',
      desc: 'Tap letter tiles to spell each word correctly',
      icon: Keyboard,
      color: 'bg-duo-green text-white',
      border: 'border-duo-greenDark',
      tag: 'Phonics'
    },
    {
      id: 'speak',
      title: 'Speech AI Lab',
      desc: 'Pronounce target words into the microphone',
      icon: Mic,
      color: 'bg-duo-blue text-white',
      border: 'border-duo-blueDark',
      tag: 'Speaking'
    },
    {
      id: 'trace',
      title: 'Draw & Trace',
      desc: 'Trace handwriting with finger or stylus',
      icon: Edit3,
      color: 'bg-duo-orange text-white',
      border: 'border-duo-orangeDark',
      tag: 'Motor Skills'
    },
    {
      id: 'syntax',
      title: 'Sentence Builder',
      desc: 'Unscramble words to build full sentences',
      icon: Puzzle,
      color: 'bg-duo-purple text-white',
      border: 'border-duo-purpleDark',
      tag: 'Grammar'
    },
    {
      id: 'context',
      title: 'Fill in Blanks',
      desc: 'Find the right word that fits the context',
      icon: CheckSquare,
      color: 'bg-duo-yellow text-white',
      border: 'border-duo-yellowDark',
      tag: 'Comprehension'
    },
    {
      id: 'synant',
      title: 'Opposites & Equals',
      desc: 'Test your knowledge of synonyms and antonyms',
      icon: ArrowLeftRight,
      color: 'bg-[#00CD9C] text-white',
      border: 'border-[#00A880]',
      tag: 'Vocabulary'
    },
    {
      id: 'study',
      title: 'Flashcard Lab',
      desc: 'Listen to definitions, sentences, and fun facts',
      icon: BookOpen,
      color: 'bg-duo-red text-white',
      border: 'border-duo-redDark',
      tag: 'Study'
    }
  ];

  // If inside an active game session:
  if (activeActivity) {
    const actObj = activities.find(a => a.id === activeActivity);

    return (
      <div className="flex-1 flex flex-col justify-between overflow-hidden p-2 max-w-lg mx-auto w-full">
        {/* Sub-screen Activity Navigation Header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-duo-gray-100 shrink-0">
          <button
            onClick={() => { playPop(); setActiveActivity(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-duo-gray-100 bg-white font-fredoka font-bold text-xs text-duo-gray-600 hover:bg-duo-gray-50 active:scale-95 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Activities</span>
          </button>

          <span className="font-fredoka font-bold text-sm text-duo-gray-800">
            {actObj?.title}
          </span>

          <span className="text-xs font-fredoka font-bold text-duo-red flex items-center gap-1">
            ❤️ {hearts}
          </span>
        </div>

        {/* Render Selected Activity */}
        <div className="flex-1 min-h-0 flex flex-col justify-between pt-1">
          {activeActivity === 'spell' && (
            <SpellMode
              items={items}
              onStreakUpdate={onStreakUpdate}
              onOpenChat={onOpenChat}
            />
          )}

          {activeActivity === 'speak' && (
            <SpeechAILab
              items={items}
              onScoreUpdate={onScoreUpdate}
              onOpenChat={onOpenChat}
            />
          )}

          {activeActivity === 'trace' && (
            <WritingPad
              items={items}
              onScoreUpdate={onScoreUpdate}
              onOpenChat={onOpenChat}
            />
          )}

          {activeActivity === 'syntax' && (
            <SyntaxBuilder
              items={items}
              onScoreUpdate={onScoreUpdate}
              onOpenChat={onOpenChat}
            />
          )}

          {activeActivity === 'context' && (
            <SentenceMode
              items={items}
              onStreakUpdate={onStreakUpdate}
              onOpenChat={onOpenChat}
            />
          )}

          {activeActivity === 'synant' && (
            <SynAntMode
              items={items}
              onStreakUpdate={onStreakUpdate}
              onOpenChat={onOpenChat}
            />
          )}

          {activeActivity === 'study' && (
            <StudyMode
              items={items}
              currentIndex={0}
              onNext={() => {}}
              onPrev={() => {}}
              onShuffle={() => {}}
              onStreakUpdate={onStreakUpdate}
              onOpenChat={onOpenChat}
            />
          )}
        </div>
      </div>
    );
  }

  // Activities Grid Screen
  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar py-2 px-3 max-w-lg mx-auto w-full">
      
      {/* Top Banner */}
      <div className="mb-3">
        <h2 className="font-fredoka font-bold text-xl sm:text-2xl text-duo-gray-800 leading-tight">
          Practice Activities
        </h2>
        <p className="text-xs sm:text-sm font-fredoka text-duo-gray-500 mt-0.5">
          Choose a fun training game to master your current words!
        </p>
      </div>

      {/* Chunky Duolingo Cards Grid */}
      <div className="space-y-2.5 my-auto">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              onClick={() => { playPop(); setActiveActivity(act.id); }}
              className="duo-card p-3 flex items-center justify-between cursor-pointer hover:border-duo-gray-300 active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${act.color} ${act.border} border-b-4 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-fredoka font-bold text-sm sm:text-base text-duo-gray-800 leading-tight">
                      {act.title}
                    </h3>
                    <span className="text-[9px] font-fredoka font-bold uppercase px-1.5 py-0.2 rounded-md bg-duo-gray-100 text-duo-gray-500">
                      {act.tag}
                    </span>
                  </div>
                  <p className="text-xs text-duo-gray-500 font-fredoka mt-0.5 line-clamp-1">
                    {act.desc}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-duo-gray-300 group-hover:text-duo-gray-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          );
        })}
      </div>

    </div>
  );
}
