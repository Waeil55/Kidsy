import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import StartScreen from './components/StartScreen';
import JourneyMap from './components/JourneyMap';
import AssessmentHub from './components/AssessmentHub';
import EnterpriseTelemetry from './components/EnterpriseTelemetry';
import CompanionSuite from './components/CompanionSuite';
import StudyMode from './components/StudyMode';
import AITutorModal from './components/AITutorModal';
import ParentStudio from './components/ParentStudio';
import SeatSwitcherModal from './components/SeatSwitcherModal';
import EducatorGateModal from './components/EducatorGateModal';
import { DEFAULT_CURRICULUM } from './data/curriculumData';
import { 
  initAudioSystem, 
  playPop, 
  playCorrect, 
  playIncorrect, 
  fireConfetti, 
  speakText,
  triggerAudioTone,
  toggleAudioSFX,
  isAudioMuted
} from './utils/audio';
import { 
  getStoredCustomCards, 
  getStoredStats, 
  updateStoredStats 
} from './utils/storage';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeSubject, setActiveSubject] = useState('week5'); // 'week5' | 'english' | 'math' | 'science' | 'social' | 'custom'
  const [activeTab, setActiveTab] = useState('journey'); // 'journey' | 'assessments' | 'telemetry' | 'companion' | 'study'
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Multi-Seat Profile State
  const [activeSeat, setActiveSeat] = useState({
    id: 'seat-1',
    seatNum: '01',
    name: 'Merola [STUDENT_4082]',
    emoji: '🦊',
    cohort: 'COHORT_ALPHA'
  });
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);

  // Companion State
  const [companionEmoji, setCompanionEmoji] = useState('🦊');
  const [companionName, setCompanionName] = useState('Captain Pip');
  const [companionHat, setCompanionHat] = useState('👑');

  // Score & Economy State
  const [score, setScore] = useState(100);
  const [gems, setGems] = useState(450);
  const [penalties, setPenalties] = useState(0);
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  // Educator Governance & Settings
  const [isEducatorGateOpen, setIsEducatorGateOpen] = useState(false);
  const [isPenaltyEnabled, setIsPenaltyEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(isAudioMuted());

  // Existing cards & stats
  const [customCards, setCustomCards] = useState(getStoredCustomCards());
  const [studyIndex, setStudyIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState(getStoredStats());

  // Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParentOpen, setIsParentOpen] = useState(false);

  // Synchronize dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  // Enterprise Score & Penalty Engine with floating chip delta
  const handleScoreAdjustment = (delta, reason = 'Exam Activity') => {
    // If penalty system is disabled and delta is negative, ignore
    if (delta < 0 && !isPenaltyEnabled) return;

    setScore(prev => Math.max(0, prev + delta));

    const chip = document.getElementById('hud-delta-chip');
    if (chip) {
      if (delta < 0) {
        chip.textContent = `${delta}`;
        chip.className = 'absolute -top-3 -right-2 font-fredoka text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white shadow-md transition-all duration-300 scale-125 opacity-100 z-30';
      } else {
        chip.textContent = `+${delta}`;
        chip.className = 'absolute -top-3 -right-2 font-fredoka text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white shadow-md transition-all duration-300 scale-125 opacity-100 z-30';
      }
      setTimeout(() => {
        chip.classList.remove('scale-125', 'opacity-100');
        chip.classList.add('opacity-0');
      }, 1100);
    }

    if (delta > 0) {
      setGems(prev => prev + 2);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const updatedStats = updateStoredStats(nextStreak);
      setStats(updatedStats);

      if (nextStreak > 0 && nextStreak % 5 === 0) {
        fireConfetti(true);
        setTimeout(() => {
          speakText(`Amazing! A streak of ${nextStreak}! You are unstoppable!`, 1.1, 1.25);
        }, 500);
      }
    } else {
      setPenalties(prev => prev + 1);
      setStreak(0);
    }

    // Append to live session telemetry stream
    setTelemetryLogs(prev => [
      {
        text: reason,
        result: delta > 0 ? `+${delta} Pts (Success)` : `${delta} Pt (Penalty)`,
        isWin: delta > 0
      },
      ...prev
    ]);
  };

  const handleStreakUpdate = (won) => {
    const container = document.getElementById('streak-container');

    if (won) {
      handleScoreAdjustment(10, 'Assessment Verified');
      if (container) {
        container.classList.add('scale-110', 'border-amber-400', 'bg-amber-100');
        setTimeout(() => {
          container.classList.remove('scale-110', 'border-amber-400', 'bg-amber-100');
        }, 700);
      }
    } else {
      handleScoreAdjustment(-1, 'Assessment Miss');
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

  const handleToggleAudio = () => {
    const active = toggleAudioSFX();
    setIsMuted(!active);
  };

  return (
    <div className={`relative h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col select-none transition-colors duration-300 font-sans ${
      isDarkMode ? 'bg-kid-night text-slate-100' : 'bg-executive-mesh text-slate-900'
    }`}>
      
      {/* Soft Ambient Glows */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-tealsoft-200/20 via-indigo-500/15 to-purple-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 right-5 w-60 h-60 bg-pink-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />

      {/* Start Gateway Modal */}
      {!isStarted && <StartScreen onStart={handleStart} />}

      {/* Institutional Enterprise Header & Navigation */}
      <Navbar
        activeSubject={activeSubject}
        onSelectSubject={handleSubjectChange}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        streak={streak}
        score={score}
        gems={gems}
        activeSeat={activeSeat}
        onOpenSeatSwitcher={() => setIsSeatModalOpen(true)}
        onOpenEducatorGate={() => setIsEducatorGateOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        customCount={customCards.length}
      />

      {/* Main Workspace Area (Zero Scroll, Always Fits!) */}
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between px-2 sm:px-3 py-1 max-w-2xl mx-auto w-full">
        {activeDeck.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center glass-card-light dark:bg-kid-nightCard rounded-3xl my-auto border border-indigo-200 dark:border-indigo-800 shadow-sm max-w-sm mx-auto">
            <span className="text-3xl mb-2">📁</span>
            <h3 className="text-base font-fredoka font-bold text-slate-800 dark:text-white">No Cards Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-fredoka">
              Try selecting "All" topics above, or launch Parent Studio to add cards!
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-fredoka font-bold text-xs squish-btn shadow-squish-indigo"
            >
              Show All Topics
            </button>
          </div>
        ) : (
          <>
            {/* Page 1: Curriculum Journey Map (Roadmap) */}
            {activeTab === 'journey' && (
              <JourneyMap
                activeSubject={activeSubject}
                items={activeDeck}
                activeStageIndex={studyIndex}
                onSelectStage={(idx) => {
                  setStudyIndex(idx);
                  setActiveTab('assessments');
                }}
                onLaunchExam={() => setActiveTab('assessments')}
                companionEmoji={companionEmoji}
                companionName={companionName}
                companionHat={companionHat}
              />
            )}

            {/* Page 2: Enterprise Assessment Hub (7 Exam Labs) */}
            {activeTab === 'assessments' && (
              <AssessmentHub
                items={activeDeck}
                onStreakUpdate={handleStreakUpdate}
                onScoreUpdate={handleScoreAdjustment}
                onOpenChat={() => setIsChatOpen(true)}
                initialMode="spelling"
              />
            )}

            {/* Page 3: Enterprise Telemetry & Institutional Analytics */}
            {activeTab === 'telemetry' && (
              <EnterpriseTelemetry
                stats={stats}
                telemetryLogs={telemetryLogs}
                activeStudentName={activeSeat.name}
                cohort={activeSeat.cohort}
                score={score}
                penalties={penalties}
                onResetStats={() => {
                  setScore(100);
                  setGems(450);
                  setPenalties(0);
                  setTelemetryLogs([]);
                }}
              />
            )}

            {/* Page 4: Mascot Companion & Customizer Suite */}
            {activeTab === 'companion' && (
              <CompanionSuite
                companionEmoji={companionEmoji}
                setCompanionEmoji={setCompanionEmoji}
                companionName={companionName}
                setCompanionName={setCompanionName}
                companionHat={companionHat}
                setCompanionHat={setCompanionHat}
                gems={gems}
                score={score}
              />
            )}

            {/* Page 5: Flashcard Study Lab */}
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
          </>
        )}
      </main>

      {/* Multi-Seat Switcher Modal */}
      <SeatSwitcherModal
        isOpen={isSeatModalOpen}
        onClose={() => setIsSeatModalOpen(false)}
        activeSeat={activeSeat}
        setActiveSeat={setActiveSeat}
      />

      {/* Educator & Parent Institutional Governance Gate Modal */}
      <EducatorGateModal
        isOpen={isEducatorGateOpen}
        onClose={() => setIsEducatorGateOpen(false)}
        isPenaltyEnabled={isPenaltyEnabled}
        setIsPenaltyEnabled={setIsPenaltyEnabled}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMuted={isMuted}
        onToggleAudio={handleToggleAudio}
        onOpenParentStudio={() => setIsParentOpen(true)}
        onResetStats={() => {
          setScore(100);
          setGems(450);
          setPenalties(0);
        }}
      />

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
