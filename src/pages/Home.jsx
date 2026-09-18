import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Trophy, Gift } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { AskDidiModal } from '../components/AskDidiModal';
import { HabitsModal } from '../components/HabitsModal';
import { GiftSelectorModal } from '../components/GiftSelectorModal';
import { GiftUnboxingModal } from '../components/GiftUnboxingModal';
import { MarathonChallengePlayer } from '../components/MarathonChallengePlayer';
import { GeminiAIStudio } from '../components/GeminiAIStudio';
import { SmartStudyHabitsModal } from '../components/SmartStudyHabitsModal';
import { SchoolWordsSection } from '../components/SchoolWordsSection';
import {
  DidiExplorerHero,
  Palette3DIcon,
  Shapes3DIcon,
  Jellyfish3DIcon,
  NumberBlocks3DIcon,
  Tooth3DIcon,
  Clock3DIcon,
  Moon3DIcon,
  Bulb3DIcon,
  DinoAvatarVector
} from '../components/illustrations/KidsVectors';
import { playPop, playCorrect } from '../utils/audio';

export function Home({ go, openSubject }) {
  const { child } = useApp();
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [habitType, setHabitType] = useState(null); // 'teeth' | 'routine' | 'night' | 'light' | null
  const [isGiftSelectorOpen, setIsGiftSelectorOpen] = useState(false);
  const [isChallengePlayerOpen, setIsChallengePlayerOpen] = useState(false);
  const [isUnboxingOpen, setIsUnboxingOpen] = useState(false);
  const [isGeminiStudioOpen, setIsGeminiStudioOpen] = useState(false);
  const [isSmartHabitsOpen, setIsSmartHabitsOpen] = useState(false);
  const [isSchoolBagOpen, setIsSchoolBagOpen] = useState(false);

  // Auto-prompt child to pick their gift ONLY IF they haven't picked yet
  useEffect(() => {
    if (child && child.giftGoal && !child.giftGoal.hasPicked) {
      setIsGiftSelectorOpen(true);
    }
  }, [child?.id, child?.giftGoal?.hasPicked]);

  // Open unboxing modal if the child reached their goal
  useEffect(() => {
    if (child?.giftGoal?.isUnlocked) {
      setIsUnboxingOpen(true);
    }
  }, [child?.giftGoal?.isUnlocked]);

  const handleTileClick = (subjectId) => {
    playPop();
    if (openSubject) openSubject(subjectId);
    go('learn');
  };

  const handleGiftConfirmed = () => {
    setIsGiftSelectorOpen(false);
    // Immediately launch marathon challenge!
    setIsChallengePlayerOpen(true);
  };

  const gift = child.giftGoal || {
    category: 'toy',
    title: 'Awesome Fun Toy 🧸',
    icon: '🧸',
    targetQuestions: 70,
    progress: 0,
    isUnlocked: false
  };

  const currentProg = Math.min(gift.targetQuestions, gift.progress || 0);
  const percentComplete = Math.min(100, Math.round((currentProg / Math.max(1, gift.targetQuestions)) * 100));
  const remainingCount = Math.max(0, gift.targetQuestions - currentProg);
  const isGoalReached = gift.isUnlocked || currentProg >= gift.targetQuestions;

  return (
    <div className="dashboardScreen">
      {/* Top Bar Header with Settings Gear */}
      <div className="dashTopBar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#e0f2fe',
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden'
            }}
          >
            <DinoAvatarVector id={child.avatarId || 'rex'} className="w-9 h-9" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {child.name || 'Explorer'}
            </div>
            <small style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
              Grade {child.grade} · {child.streak} Day Streak 🔥
            </small>
          </div>
        </div>

        <button
          className="gearBtn"
          onClick={() => {
            playPop();
            go('settings');
          }}
          title="App Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Hero Mascot & Motivation Section - Responsive Side-by-Side on Tablet/Desktop */}
      <div className="dashHeroRow">
        {/* Mascot Hero Card: Custom Vector Didi the Explorer with "Ask ?" Button */}
        <DidiExplorerHero
          onAsk={() => {
            playCorrect();
            setIsAskOpen(true);
          }}
        />

        {/* Gift Quest Motivation & Progress Bar */}
        <div className="giftQuestCard">
          <div className="giftQuestHeader">
            <div className="giftQuestTag">
              <Sparkles size={13} />
              <span>SPECIAL REWARD QUEST</span>
            </div>
            <button
              className="giftChangeBtn"
              onClick={() => {
                playPop();
                setIsGiftSelectorOpen(true);
              }}
            >
              Change Prize 🎁
            </button>
          </div>

          <div className="giftQuestBody">
            <div className="giftIconCircle">
              {gift.icon || '🎁'}
            </div>
            <div className="giftQuestDetails">
              <div className="giftQuestTitle">
                {gift.title || 'Special Gift'}
              </div>
              <div className="giftQuestStats">
                <span className="count">{currentProg} / {gift.targetQuestions} Solved</span>
                <span className="remaining">
                  {isGoalReached ? '🎉 Ready to Unbox!' : `${remainingCount} left to win!`}
                </span>
              </div>
            </div>
          </div>

          {/* Milestone Progress Bar */}
          <div className="giftProgressBarTrack">
            <div
              className="giftProgressBarFill"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          {/* Action Button: Start Marathon */}
          <button
            className="giftMarathonBtn"
            onClick={() => {
              playCorrect();
              if (isGoalReached) {
                setIsUnboxingOpen(true);
              } else {
                setIsChallengePlayerOpen(true);
              }
            }}
          >
            {isGoalReached ? (
              <>🎁 Tap to Unbox Reward!</>
            ) : (
              <>
                <Sparkles size={17} /> Start Marathon Challenge ({remainingCount} left) →
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modern AI & Smart Vacation Habits Feature Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <button
          onClick={() => { playPop(); setIsGeminiStudioOpen(true); }}
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            color: '#ffffff',
            border: '2px solid rgba(167, 139, 250, 0.4)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px',
            flexShrink: 0
          }}>
            🤖
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.02em' }}>GEMINI AI STUDIO</span>
              <span style={{ fontSize: '10px', background: '#ec4899', color: '#fff', padding: '1px 6px', borderRadius: '8px', fontWeight: 800 }}>PRO</span>
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Lesson Planner, Materials & Differentiation
            </div>
          </div>
        </button>

        <button
          onClick={() => { playPop(); setIsSmartHabitsOpen(true); }}
          style={{
            background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
            color: '#ffffff',
            border: '2px solid rgba(52, 211, 153, 0.4)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px',
            flexShrink: 0
          }}>
            🏖️
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.02em' }}>10 SMART VACATION TIPS</span>
              <span style={{ fontSize: '10px', background: '#f59e0b', color: '#fff', padding: '1px 6px', borderRadius: '8px', fontWeight: 800 }}>KIDS</span>
            </div>
            <div style={{ fontSize: '11px', color: '#d1fae5', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Daily Checklist, Play & Productive Habits
            </div>
          </div>
        </button>

        <button
          onClick={() => { playPop(); setIsSchoolBagOpen(true); }}
          style={{
            background: 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #4f46e5 100%)',
            color: '#ffffff',
            border: '2px solid rgba(165, 180, 252, 0.4)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px',
            flexShrink: 0
          }}>
            🎒
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.02em' }}>MY SCHOOL BAG</span>
              <span style={{ fontSize: '10px', background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: '8px', fontWeight: 800 }}>AI SCAN</span>
            </div>
            <div style={{ fontSize: '11px', color: '#e0e7ff', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Upload Worksheet & Weekly Homework Words
            </div>
          </div>
        </button>

        <button
          onClick={() => { playPop(); go('learn'); }}
          style={{
            background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
            color: '#ffffff',
            border: '2px solid rgba(45, 212, 191, 0.4)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px',
            flexShrink: 0
          }}>
            🗺️
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.02em' }}>100-LEVEL ADVENTURE</span>
              <span style={{ fontSize: '10px', background: '#3b82f6', color: '#fff', padding: '1px 6px', borderRadius: '8px', fontWeight: 800 }}>GRADE {child.grade}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#ccfbf1', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Easy to Expert Progressive Roadmap
            </div>
          </div>
        </button>
      </div>

      {/* 2x2 Large Rounded Colorful Gradient Activity Cards with 3D Vector Icons */}
      <div className="activitiesGrid">
        {/* 1. Top Left: Colors & Week 5 Vocab (Warm Yellow / Orange Gradient) */}
        <button
          className="activityTile tile-colors"
          onClick={() => handleTileClick('week5')}
        >
          <div className="tileIcon">
            <Palette3DIcon className="w-14 h-14" />
          </div>
          <div>
            <h3>Colors & Words</h3>
            <p className="tileSub">⭐ Week 5 Focus</p>
          </div>
        </button>

        {/* 2. Top Right: Shapes & Math (Vivid Violet / Purple Gradient) */}
        <button
          className="activityTile tile-shapes"
          onClick={() => handleTileClick('math')}
        >
          <div className="tileIcon">
            <Shapes3DIcon className="w-14 h-14" />
          </div>
          <div>
            <h3>Shapes & Math</h3>
            <p className="tileSub">Grade 3 Challenges</p>
          </div>
        </button>

        {/* 3. Bottom Left: Animals & Science (Fresh Green Gradient) */}
        <button
          className="activityTile tile-animals"
          onClick={() => handleTileClick('science')}
        >
          <div className="tileIcon">
            <Jellyfish3DIcon className="w-14 h-14" />
          </div>
          <div className="tileBadge">
            <span style={{ fontSize: '12px' }}>★</span>
          </div>
          <div>
            <h3>Animals & Nature</h3>
            <p className="tileSub">Science Lab</p>
          </div>
        </button>

        {/* 4. Bottom Right: Numbers & Social (Radiant Cyan / Blue Gradient) */}
        <button
          className="activityTile tile-numbers"
          onClick={() => handleTileClick('social')}
        >
          <div className="tileIcon">
            <NumberBlocks3DIcon className="w-14 h-14" />
          </div>
          <div className="tileBadge">
            <span style={{ fontSize: '12px' }}>★</span>
          </div>
          <div>
            <h3>Numbers & World</h3>
            <p className="tileSub">Social & Continents</p>
          </div>
        </button>
      </div>

      {/* Bottom Quick Habits / Daily Routine Rail (Matching Screenshot) */}
      <div className="routinesRail">
        <button
          className="routineItem"
          onClick={() => {
            playPop();
            setHabitType('teeth');
          }}
        >
          <div className="routineCircle">
            <Tooth3DIcon className="w-7 h-7" />
          </div>
          <span>Brushing<br />teeth</span>
        </button>

        <button
          className="routineItem"
          onClick={() => {
            playPop();
            setHabitType('routine');
          }}
        >
          <div className="routineCircle">
            <Clock3DIcon className="w-7 h-7" />
          </div>
          <span>Daily<br />routine</span>
        </button>

        <button
          className="routineItem"
          onClick={() => {
            playPop();
            setHabitType('night');
          }}
        >
          <div className="routineCircle">
            <Moon3DIcon className="w-7 h-7" />
          </div>
          <span>Good<br />night</span>
        </button>

        <button
          className="routineItem"
          onClick={() => {
            playPop();
            setHabitType('light');
          }}
        >
          <div className="routineCircle">
            <Bulb3DIcon className="w-7 h-7" />
          </div>
          <span>Blue<br />light</span>
        </button>
      </div>

      {/* Interactive Modals */}
      {isAskOpen && <AskDidiModal onClose={() => setIsAskOpen(false)} />}
      {habitType && <HabitsModal type={habitType} onClose={() => setHabitType(null)} />}

      {/* Gift Quest Modals */}
      {isGiftSelectorOpen && (
        <GiftSelectorModal
          onClose={() => setIsGiftSelectorOpen(false)}
          onConfirm={handleGiftConfirmed}
        />
      )}

      {isChallengePlayerOpen && (
        <MarathonChallengePlayer
          onClose={() => setIsChallengePlayerOpen(false)}
          onRewardUnlocked={() => {
            setIsChallengePlayerOpen(false);
            setIsUnboxingOpen(true);
          }}
        />
      )}

      {isUnboxingOpen && (
        <GiftUnboxingModal
          onClose={() => setIsUnboxingOpen(false)}
          onPickNext={() => {
            setIsUnboxingOpen(false);
            setIsGiftSelectorOpen(true);
          }}
        />
      )}

      {/* Gemini AI Studio Pro Modal */}
      {isGeminiStudioOpen && (
        <GeminiAIStudio onClose={() => setIsGeminiStudioOpen(false)} />
      )}

      {/* 10 Smart Vacation Tips Modal */}
      {isSmartHabitsOpen && (
        <SmartStudyHabitsModal onClose={() => setIsSmartHabitsOpen(false)} />
      )}

      {/* School Words Homework Modal */}
      {isSchoolBagOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          overflowY: 'auto',
          padding: '16px'
        }}>
          <div style={{ maxWidth: '720px', margin: '20px auto', position: 'relative' }}>
            <button
              onClick={() => setIsSchoolBagOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800
              }}
            >
              ✕
            </button>
            <SchoolWordsSection onClose={() => setIsSchoolBagOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
