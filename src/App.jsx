import React, { useState, useMemo } from 'react';
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
  const [activeSubject, setActiveSubject] = useState('english'); // 'english' | 'math' | 'science' | 'social' | 'custom'
  const [activeTab, setActiveTab] = useState('study'); // 'study' | 'sentences' | 'quiz' | 'spell'
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [customCards, setCustomCards] = useState(getStoredCustomCards());
  const [studyIndex, setStudyIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState(getStoredStats());

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParentOpen, setIsParentOpen] = useState(false);

  // Raw list for active subject
  const rawSubjectDeck = activeSubject === 'custom' 
    ? customCards 
    : (DEFAULT_CURRICULUM[activeSubject] || []);

  // Compute unique categories for active subject
  const categories = useMemo(() => {
    const cats = new Set(rawSubjectDeck.map(item => item.category).filter(Boolean));
    return Array.from(cats);
  }, [rawSubjectDeck]);

  // Filtered deck based on topic filter chip
  const activeDeck = useMemo(() => {
    if (selectedCategory === 'all') return rawSubjectDeck;
    return rawSubjectDeck.filter(item => item.category === selectedCategory);
  }, [rawSubjectDeck, selectedCategory]);

  const currentItem = activeDeck.length > 0 ? activeDeck[studyIndex % activeDeck.length] : null;

  const handleStart = async () => {
    await initAudioSystem();
    setIsStarted(true);
    playPop();
  };

  const handleStreakUpdate = (won) => {
    const container = document.getElementById('streak-container');

    if (won) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const updatedStats = updateStoredStats(nextStreak);
      setStats(updatedStats);

      if (container) {
        container.classList.add('scale-110', 'border-amber-400', 'bg-amber-100');
        setTimeout(() => {
          container.classList.remove('scale-110', 'border-amber-400', 'bg-amber-100');
        }, 700);
      }

      if (nextStreak > 0 && nextStreak % 5 === 0) {
        fireConfetti(true);
        setTimeout(() => {
          speakText(`Amazing! A streak of ${nextStreak}! You are unstoppable!`, 1.1, 1.25);
        }, 500);
      }
    } else {
      setStreak(0);
      if (container) {
        container.classList.add('shake', 'border-rose-400', 'bg-rose-50');
        setTimeout(() => {
          container.classList.remove('shake', 'border-rose-400', 'bg-rose-50');
        }, 500);
      }
    }
  };

  const handleShuffle = () => {
    setStudyIndex(Math.floor(Math.random() * (activeDeck.length || 1)));
  };

  const handleSubjectChange = (sub) => {
    setActiveSubject(sub);
    setSelectedCategory('all');
    setStudyIndex(0);
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col bg-executive-mesh select-none text-slate-900 font-sans">
      
      {/* Soft Ambient Blooms */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-tealsoft-200/25 via-rosebloom-100/35 to-amber-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 right-5 w-60 h-60 bg-rosebloom-100/25 rounded-full blur-2xl -z-10 pointer-events-none" />

      {/* Start Gateway Modal */}
      {!isStarted && <StartScreen onStart={handleStart} />}

      {/* App Header & Navigation */}
      <Navbar
        activeSubject={activeSubject}
        onSelectSubject={handleSubjectChange}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        streak={streak}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenParent={() => setIsParentOpen(true)}
        customCount={customCards.length}
      />

      {/* Main Game Screen Area (Zero Scroll, Always Fits!) */}
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between px-2 sm:px-3 py-1 max-w-2xl mx-auto w-full">
        {activeDeck.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center glass-card-light rounded-3xl my-auto border border-rosebloom-200 shadow-sm max-w-sm mx-auto">
            <span className="text-3xl mb-2">📁</span>
            <h3 className="text-base font-black text-slate-800">No Cards Found in Topic</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Try choosing "All" topics above, or open Parent Studio to create cards!
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-3 px-4 py-2 rounded-xl bg-tealsoft-600 text-white font-black text-xs btn-press"
            >
              Show All Topics
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
