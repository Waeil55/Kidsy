import React, { useState } from 'react';
import { 
  Flame, 
  Bot, 
  Settings, 
  ChevronDown, 
  Star, 
  BookOpen, 
  Calculator, 
  Atom, 
  Globe2, 
  FolderHeart,
  Heart
} from 'lucide-react';
import { playPop } from '../utils/audio';

export default function HeaderBar({
  activeSubject,
  onSelectSubject,
  streak = 0,
  gems = 450,
  hearts = 5,
  onOpenChat,
  onOpenSettings,
  customCount = 0
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const subjects = [
    { id: 'week5', label: '⭐ Week 5 List', icon: Star, color: 'text-amber-500' },
    { id: 'english', label: '📚 Vocabulary', icon: BookOpen, color: 'text-blue-500' },
    { id: 'math', label: '🔢 Grade 3 Math', icon: Calculator, color: 'text-rose-500' },
    { id: 'science', label: '🔬 Science', icon: Atom, color: 'text-emerald-500' },
    { id: 'social', label: '🌍 Social Studies', icon: Globe2, color: 'text-orange-500' },
    { id: 'custom', label: '📂 My Custom Cards', icon: FolderHeart, badge: customCount, color: 'text-purple-500' },
  ];

  const currentSubjectObj = subjects.find(s => s.id === activeSubject) || subjects[0];

  return (
    <header className="shrink-0 z-40 bg-white border-b-2 border-duo-gray-100 px-4 py-2 relative select-none">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        
        {/* Subject Course Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => { playPop(); setIsMenuOpen(!isMenuOpen); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-duo-gray-100 hover:border-duo-gray-200 bg-white font-fredoka font-bold text-xs sm:text-sm text-duo-gray-700 active:scale-95 transition-all shadow-xs"
          >
            <span>{currentSubjectObj.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-duo-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Subject Dropdown Menu */}
          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <div className="absolute left-0 top-full mt-1.5 z-40 w-56 bg-white rounded-2xl border-2 border-duo-gray-100 shadow-xl p-1.5 pop">
                <span className="text-[10px] font-fredoka font-bold uppercase text-duo-gray-400 px-2 py-1 block">
                  Select Study Course
                </span>
                {subjects.map(s => {
                  const Icon = s.icon;
                  const isSelected = activeSubject === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        playPop();
                        onSelectSubject(s.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-fredoka font-bold transition-all ${
                        isSelected 
                          ? 'bg-duo-blueLight text-duo-blueDark' 
                          : 'text-duo-gray-700 hover:bg-duo-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${s.color}`} />
                        <span>{s.label}</span>
                      </div>
                      {s.badge !== undefined && s.badge > 0 && (
                        <span className="text-[10px] bg-duo-purple text-white px-1.5 py-0.2 rounded-full">
                          {s.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right Status Counters (Duolingo Style: Streak 🔥, Gems 💎, Hearts ❤️, AI 🤖) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Streak Flame */}
          <div className="flex items-center gap-1 font-fredoka font-bold text-xs sm:text-sm text-duo-orange">
            <Flame className="w-4 h-4 fill-current animate-pulse" />
            <span>{streak}</span>
          </div>

          {/* Gem Diamonds */}
          <div className="flex items-center gap-1 font-fredoka font-bold text-xs sm:text-sm text-duo-blue">
            <span className="text-sm">💎</span>
            <span>{gems}</span>
          </div>

          {/* Hearts / Health */}
          <div className="flex items-center gap-1 font-fredoka font-bold text-xs sm:text-sm text-duo-red">
            <Heart className="w-4 h-4 fill-current" />
            <span>{hearts}</span>
          </div>

          {/* AI Sidekick Assistant */}
          <button
            onClick={() => { playPop(); onOpenChat(); }}
            className="w-8 h-8 rounded-xl bg-duo-purpleLight hover:bg-duo-purple/20 text-duo-purpleDark flex items-center justify-center transition-all active:scale-95"
            title="Ask AI Super Tutor"
          >
            <Bot className="w-4 h-4" />
          </button>

          {/* Settings / Governance Gate */}
          <button
            onClick={() => { playPop(); onOpenSettings(); }}
            className="w-8 h-8 rounded-xl bg-duo-gray-50 hover:bg-duo-gray-100 text-duo-gray-500 flex items-center justify-center transition-all active:scale-95"
            title="Institutional Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}
