import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Star, 
  Flame, 
  Compass,
  Play
} from 'lucide-react';
import { playPop, triggerAudioTone, speakText } from '../utils/audio';

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
  const handlePetMascot = () => {
    playPop();
    const bubble = document.getElementById('journey-mascot-bubble');
    if (bubble) {
      const phrases = [
        "Ready for quest! ⚡",
        "You're a genius! 🌟",
        "Keep the streak alive! 🔥",
        "Let's conquer this stage! 🚀"
      ];
      bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
      bubble.classList.remove('opacity-0');
      bubble.classList.add('opacity-100', 'pop');
      setTimeout(() => {
        bubble.classList.remove('opacity-100', 'pop');
        bubble.classList.add('opacity-0');
      }, 1500);
    }
  };

  // Build nodes based on current curriculum items (up to 5 or item count)
  const displayItems = items.length > 0 ? items.slice(0, 5) : [
    { word: "oppose", displayTitle: "Oppose", image: "🛑" },
    { word: "snide", displayTitle: "Snide", image: "😏" },
    { word: "heap", displayTitle: "Heap", image: "🧺" },
    { word: "diverse", displayTitle: "Diverse", image: "🌈" },
    { word: "origin", displayTitle: "Origin", image: "🏔️" },
  ];

  // Coordinates for nice S-curve positioning
  const xOffsets = [0, 48, -48, 36, 0];

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto no-scrollbar py-1 w-full max-w-lg mx-auto">
      
      {/* Institutional Curriculum Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 p-3.5 text-white shadow-squish-indigo shrink-0 mb-2">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="max-w-[65%]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-fredoka font-semibold uppercase tracking-wider mb-1 text-yellow-300 border border-white/20">
              <Compass className="w-3 h-3" />
              <span>Learning Roadmap</span>
              <span>•</span>
              <span className="capitalize">{activeSubject}</span>
            </div>
            <h2 className="font-fredoka font-bold text-base sm:text-lg leading-tight mb-1 text-white">
              Quest: <span className="text-yellow-300">{displayItems[activeStageIndex % displayItems.length]?.displayTitle || "Mastery Path"}</span>
            </h2>
            <p className="text-[11px] text-indigo-100 font-medium mb-2 line-clamp-1">
              {displayItems[activeStageIndex % displayItems.length]?.definition || "Master all 5 milestone stages!"}
            </p>
            
            <button 
              onClick={() => { playPop(); onLaunchExam(); }}
              className="squish-btn px-3.5 py-1.5 rounded-xl bg-white text-indigo-700 font-fredoka text-xs font-bold shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch Assessment Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Mascot Companion Widget */}
          <div className="flex flex-col items-center">
            <div onClick={handlePetMascot} className="cursor-pointer group relative active:scale-90 transition-transform">
              <div className="w-18 h-18 rounded-2xl bg-white/20 backdrop-blur-md p-1 flex items-center justify-center border border-white/30 animate-bounce-subtle relative">
                <span className="text-4xl">{companionEmoji}</span>
                {companionHat && (
                  <span className="absolute -top-3 text-2xl">{companionHat}</span>
                )}
                <div 
                  id="journey-mascot-bubble" 
                  className="absolute -top-7 -right-2 bg-white text-slate-800 text-[10px] font-fredoka font-bold px-2 py-0.5 rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-300 z-20 border border-slate-200"
                >
                  Ready for quest! ⚡
                </div>
              </div>
            </div>
            <span className="text-[9px] font-fredoka text-indigo-200 mt-1 font-bold">Tap Companion</span>
          </div>
        </div>
      </div>

      {/* Curriculum Level Stage Matrix (Curved Path Canvas) */}
      <div className="flex-1 min-h-[340px] bg-white dark:bg-kid-nightCard rounded-3xl p-3 shadow-squish-card border-2 border-slate-100 dark:border-kid-nightBorder relative overflow-hidden flex flex-col items-center justify-center my-1">
        
        {/* Animated SVG S-Curve Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 380" fill="none" preserveAspectRatio="none">
          <path 
            d="M 180,30 C 270,80 270,140 180,190 C 90,240 90,300 180,350" 
            stroke="#E2E8F0" 
            strokeWidth="10" 
            strokeLinecap="round" 
            className="dark:stroke-slate-800" 
          />
          <path 
            d="M 180,30 C 270,80 270,140 180,190 C 90,240 90,300 180,350" 
            stroke="#4F46E5" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className="journey-path" 
          />
        </svg>

        {/* Milestone Nodes (Top to Bottom: Gate 5 -> Stage 1) */}
        <div className="relative z-10 w-full flex flex-col items-center justify-between h-full py-2">
          {displayItems.map((item, idx) => {
            const stageNum = idx + 1;
            const isCurrent = idx === activeStageIndex;
            const isCompleted = idx < activeStageIndex;
            const isGate = idx === displayItems.length - 1;
            const xShift = xOffsets[idx % xOffsets.length];

            return (
              <div 
                key={item.id || idx}
                style={{ transform: `translateX(${xShift}px)` }}
                className="flex flex-col items-center my-1 transition-transform"
              >
                {/* Current Stage Glowing Pulse Ring */}
                {isCurrent && (
                  <div className="absolute -inset-2 bg-indigo-500/25 rounded-3xl blur-md animate-pulse pointer-events-none" />
                )}

                <button
                  onClick={() => {
                    playPop();
                    onSelectStage(idx);
                  }}
                  className={`squish-btn relative rounded-2xl flex items-center justify-center font-fredoka font-black border-4 transition-all ${
                    isGate 
                      ? 'w-14 h-14 bg-gradient-to-tr from-amber-400 to-orange-500 text-white border-white dark:border-slate-800 shadow-squish-orange text-2xl'
                      : isCurrent
                        ? 'w-15 h-15 bg-gradient-to-tr from-indigo-600 via-brand-500 to-purple-600 text-white border-white dark:border-slate-800 shadow-squish-indigo text-2xl scale-105'
                        : isCompleted
                          ? 'w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white border-white dark:border-slate-800 shadow-squish-emerald text-xl'
                          : 'w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 border-white dark:border-slate-700 shadow-squish-neutral text-lg'
                  }`}
                  title={`Stage ${stageNum}: ${item.displayTitle || item.word}`}
                >
                  {isGate ? (
                    <Trophy className="w-6 h-6 text-yellow-100 animate-bounce-subtle" />
                  ) : isCompleted ? (
                    <Check className="w-6 h-6 text-white stroke-[3]" />
                  ) : isCurrent ? (
                    <span className="text-xl animate-bounce-subtle">{item.image || "⚡"}</span>
                  ) : (
                    <span>{stageNum}</span>
                  )}
                </button>

                {/* Badge underneath node */}
                <div className="mt-1 flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded-full font-fredoka text-[10px] font-bold shadow-xs ${
                    isCurrent 
                      ? 'bg-indigo-600 text-white border border-indigo-400' 
                      : isCompleted
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {item.displayTitle || item.word}
                  </span>
                  {isCompleted && (
                    <span className="text-[9px] text-amber-500">★★★</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Action: Stage Launch Bar */}
      <div className="shrink-0 pt-1.5 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 mt-1">
        <div className="flex items-center gap-1.5 text-xs font-fredoka">
          <span className="text-slate-400">Target:</span>
          <span className="font-bold text-slate-800 dark:text-white capitalize">
            {displayItems[activeStageIndex % displayItems.length]?.word || "Select Node"}
          </span>
        </div>

        <button
          onClick={() => { playPop(); onLaunchExam(); }}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-fredoka font-bold text-xs shadow-squish-emerald squish-btn flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Assessment</span>
        </button>
      </div>

    </div>
  );
}
