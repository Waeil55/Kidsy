import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StartScreen from './components/StartScreen';
import StudyMode from './components/StudyMode';
import SentenceMode from './components/SentenceMode';
import QuizMode from './components/QuizMode';
import SpellMode from './components/SpellMode';
import AITutorModal from './components/AITutorModal';
import ParentStudio from './components/ParentStudio';
import { DEFAULT_CURRICULUM } from './data/curriculumData';
import { 
  initAudioSystem, 
  playPop, 
  playCorrect, 
  playIncorrect, 
  fireConfetti, 
  speakText 
} from './utils/audio';
import { 
  getStoredCustomCards, 
  getStoredStats, 
  updateStoredStats 
} from './utils/storage';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeSubject, setActiveSubject] = useState('english'); // 'english' | 'math' | 'science' | 'custom'
  const [activeTab, setActiveTab] = useState('study'); // 'study' | 'sentences' | 'quiz' | 'spell'
  
  const [customCards, setCustomCards] = useState(getStoredCustomCards());
  const [studyIndex, setStudyIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState(getStoredStats());

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParentOpen, setIsParentOpen] = useState(false);

  // Determine active item list
  const activeDeck = activeSubject === 'custom' 
    ? customCards 
    : (DEFAULT_CURRICULUM[activeSubject] || []);

  const currentItem = activeDeck.length > 0 ? activeDeck[studyIndex % activeDeck.length] : null;

  const handleStart = async () => {
    await initAudioSystem();
    setIsStarted(true);
    playPop();
  };

  const handleStreakUpdate = (won) => {
    const container = document.getElementById('streak-container');
    const icon = document.getElementById('streak-icon');

    if (won) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const updatedStats = updateStoredStats(nextStreak);
      setStats(updatedStats);

      if (container) {
        container.classList.add('scale-110', 'border-amber-400', 'bg-amber-100');
        setTimeout(() => {
          container.classList.remove('scale-110', 'border-amber-400', 'bg-amber-100');
        }, 800);
      }

      // Milestone celebrations
      if (nextStreak > 0 && nextStreak % 5 === 0) {
        fireConfetti(true);
        setTimeout(() => {
          speakText(`Amazing! A streak of ${nextStreak}! You are unstoppable!`, 1.1, 1.25);
        }, 600);
      }
    } else {
      setStreak(0);
      if (container) {
        container.classList.add('shake', 'border-rose-400', 'bg-rose-50');
        setTimeout(() => {
          container.classList.remove('shake', 'border-rose-400', 'bg-rose-50');
        }, 600);
      }
    }
  };

  const handleShuffle = () => {
    setStudyIndex(Math.floor(Math.random() * (activeDeck.length || 1)));
  };

  return (
    <div className="relative min-h-screen h-screen overflow-hidden flex flex-col bg-executive-mesh bg-grid-pattern select-none text-slate-900 font-sans">
      
      {/* Soft Teal & Rose Ambient Blooms */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-tealsoft-200/25 via-rosebloom-100/35 to-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-rosebloom-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Start Gateway Modal */}
      {!isStarted && <StartScreen onStart={handleStart} />}

      {/* App Header & Subject/Tab Navigation */}
      <Navbar
        activeSubject={activeSubject}
        onSelectSubject={(sub) => {
          setActiveSubject(sub);
          setStudyIndex(0);
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        streak={streak}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenParent={() => setIsParentOpen(true)}
        customCount={customCards.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-3 flex flex-col justify-start max-w-4xl mx-auto w-full no-scrollbar">
        {activeDeck.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center glass-card-light rounded-3xl my-auto border border-rosebloom-200/70 shadow-sm max-w-md mx-auto">
            <span className="text-4xl mb-3">📁</span>
            <h3 className="text-lg font-black text-slate-800">Your Custom Deck is Empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed font-medium">
              Parents can open the Parent Studio to snap photos of worksheets, upload files, or create cards!
            </p>
            <button
              onClick={() => setIsParentOpen(true)}
              className="mt-5 px-5 py-2.5 rounded-2xl bg-tealsoft-600 hover:bg-tealsoft-500 text-white font-black text-xs shadow-md shadow-tealsoft-600/20 btn-press"
            >
              Open Parent Studio
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'study' && (
              <StudyMode
                items={activeDeck}
                currentIndex={studyIndex}
                onNext={() => setStudyIndex((studyIndex + 1) % activeDeck.length)}
                onPrev={() => setStudyIndex((studyIndex - 1 + activeDeck.length) % activeDeck.length)}
                onShuffle={handleShuffle}
                onStreakUpdate={handleStreakUpdate}
                onOpenChat={() => setIsChatOpen(true)}
              />
            )}

            {activeTab === 'sentences' && (
              <SentenceMode
                items={activeDeck}
                onStreakUpdate={handleStreakUpdate}
                onOpenChat={() => setIsChatOpen(true)}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizMode
                items={activeDeck}
                onStreakUpdate={handleStreakUpdate}
                onOpenChat={() => setIsChatOpen(true)}
              />
            )}

            {activeTab === 'spell' && (
              <SpellMode
                items={activeDeck}
                onStreakUpdate={handleStreakUpdate}
                onOpenChat={() => setIsChatOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* AI Super Tutor Modal */}
      <AITutorModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentItem={currentItem}
        activeTab={activeTab}
        activeSubject={activeSubject}
      />

      {/* Parent & Teacher Studio Modal */}
      <ParentStudio
        isOpen={isParentOpen}
        onClose={() => setIsParentOpen(false)}
        customCards={customCards}
        onUpdateCustomCards={(cards) => setCustomCards(cards)}
      />

    </div>
  );
}
