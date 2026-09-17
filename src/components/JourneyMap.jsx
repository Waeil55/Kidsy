import React, { useState } from 'react';
import { 
  Trophy, 
  Check, 
  Play, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { playPop, playCorrect } from '../utils/audio';

export default function JourneyMap({
  activeSubject,
  items = [],
  activeStageIndex = 0,
  onSelectStage,
  onLaunchExam,
  companionEmoji = "🦊",
  companionName = "Captain Pip",
  companionHat = "👑"
}) {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);

  const displayItems = items.length > 0 ? items.slice(0, 5) : [
    { word: "oppose", displayTitle: "Oppose", definition: "To be against something", image: "🛑" },
    { word: "snide", displayTitle: "Snide", definition: "To do something in a mean or nasty way", image: "😏" },
    { word: "heap", displayTitle: "Heap", definition: "A large collection of things thrown into a pile", image: "🧺" },
    { word: "diverse", displayTitle: "Diverse", definition: "Different from one another", image: "🌈" },
    { word: "origin", displayTitle: "Origin", definition: "The start of something", image: "🏔️" },
  ];

  // Natural Duolingo horizontal zigzag offsets
  const xOffsets = [0, 45, -45, 30, 0];

  const handleNodeClick = (idx) => {
    playPop();
    setSelectedNodeIndex(selectedNodeIndex === idx ? null : idx);
  };

  const startStage = (idx) => {
    playPop();
    onSelectStage(idx);
    setSelectedNodeIndex(null);
    onLaunchExam();
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar py-2 px-4 max-w-lg mx-auto w-full relative select-none">
      
      {/* Duolingo Section Unit Header Banner */}
      <div className="duo-card bg-duo-green text-white p-3.5 border-duo-greenDark mb-4 flex items-center justify-between shrink-0 shadow-sm">
        <div>
          <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider text-duo-greenLight block">
            Current Unit • {activeSubject.toUpperCase()}
          </span>
          <h2 className="font-fredoka font-bold text-lg leading-tight text-white mt-0.5">
            Unit 1: Grade 3 Power Words
          </h2>
          <p className="text-xs text-white/90 font-fredoka mt-0.5">
            5 Lessons • Master all words to claim the Trophy!
          </p>
        </div>

        {/* Mascot Companion Mini Widget */}
        <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl relative animate-bounce-subtle shrink-0">
          <span>{companionEmoji}</span>
          {companionHat && (
            <span className="absolute -top-2.5 text-lg">{companionHat}</span>
          )}
        </div>
      </div>

      {/* S-Curve Stepping Stones Roadmap */}
      <div className="relative py-4 flex flex-col items-center my-auto min-h-[360px]">
        
        {/* Animated Connecting SVG Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 380" fill="none" preserveAspectRatio="none">
          <path 
            d="M 180,30 C 270,80 270,140 180,190 C 90,240 90,300 180,350" 
            stroke="#E5E5E5" 
            strokeWidth="12" 
            strokeLinecap="round" 
          />
          <path 
            d="M 180,30 C 270,80 270,140 180,190 C 90,240 90,300 180,350" 
            stroke="#58CC02" 
            strokeWidth="6" 
            strokeLinecap="round" 
            className="journey-path" 
          />
        </svg>

        {/* Nodes (Stepping Stones) */}
        <div className="relative z-10 w-full flex flex-col items-center justify-between h-full py-2">
          {displayItems.map((item, idx) => {
            const isCompleted = idx < activeStageIndex;
            const isCurrent = idx === activeStageIndex;
            const isGate = idx === displayItems.length - 1;
            const xShift = xOffsets[idx % xOffsets.length];

            return (
              <div 
                key={item.id || idx}
                style={{ transform: `translateX(${xShift}px)` }}
                className="flex flex-col items-center my-2 relative"
              >
                {/* Active Tooltip Speech Callout */}
                {isCurrent && (
                  <div className="absolute -top-8 px-2.5 py-1 rounded-xl bg-duo-green text-white font-fredoka text-[10px] font-bold shadow-md animate-bounce-subtle whitespace-nowrap z-20">
                    <span>START HERE!</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-duo-green" />
                  </div>
                )}

                {/* Stepping Stone Button */}
                <button
                  onClick={() => handleNodeClick(idx)}
                  className={`duo-btn relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isGate 
                      ? 'bg-duo-yellow border-b-4 border-duo-yellowDark text-white' 
                      : isCompleted
                        ? 'bg-duo-green border-b-4 border-duo-greenDark text-white'
                        : isCurrent
                          ? 'bg-duo-blue border-b-4 border-duo-blueDark text-white scale-105 ring-4 ring-duo-blueLight'
                          : 'bg-duo-gray-100 border-b-4 border-duo-gray-300 text-duo-gray-400'
                  }`}
                >
                  {isGate ? (
                    <Trophy className="w-8 h-8 fill-current text-white animate-bounce-subtle" />
                  ) : isCompleted ? (
                    <Check className="w-8 h-8 stroke-[3.5] text-white" />
                  ) : isCurrent ? (
                    <span className="text-2xl">{item.image || "⚡"}</span>
                  ) : (
                    <span className="text-xl font-bold">{idx + 1}</span>
                  )}
                </button>

                {/* Word Label Pill */}
                <span className={`mt-1.5 px-2 py-0.5 rounded-lg font-fredoka text-[11px] font-bold border ${
                  isCurrent 
                    ? 'bg-duo-blue text-white border-duo-blueDark' 
                    : isCompleted
                      ? 'bg-duo-greenLight text-duo-greenDark border-duo-green'
                      : 'bg-white text-duo-gray-500 border-duo-gray-100'
                }`}>
                  {item.displayTitle || item.word}
                </span>

                {/* Popover Card when Node is Tapped */}
                {selectedNodeIndex === idx && (
                  <div className="absolute top-full mt-2 z-30 w-52 duo-card p-3 text-center pop shadow-2xl bg-white">
                    <span className="text-2xl block mb-1">{item.image || "🌟"}</span>
                    <h3 className="font-fredoka font-bold text-sm text-duo-gray-800 capitalize">
                      {item.displayTitle || item.word}
                    </h3>
                    <p className="text-[11px] font-fredoka text-duo-gray-500 my-1 line-clamp-2">
                      "{item.definition}"
                    </p>
                    <button
                      onClick={() => startStage(idx)}
                      className="duo-btn duo-btn-green w-full py-2 text-xs mt-1"
                    >
                      <span>PRACTICE (+10 XP)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Direct Action Bottom Bar */}
      <div className="shrink-0 pt-2 border-t-2 border-duo-gray-100 mt-2 flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] font-fredoka font-bold uppercase text-duo-gray-400 block">
            Next Milestone
          </span>
          <span className="font-fredoka font-bold text-sm text-duo-gray-800 capitalize">
            {displayItems[activeStageIndex % displayItems.length]?.word || "Complete Unit"}
          </span>
        </div>

        <button
          onClick={() => { playPop(); onLaunchExam(); }}
          className="duo-btn duo-btn-green px-5 py-2.5 text-xs flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>START LESSON</span>
        </button>
      </div>

    </div>
  );
}
