import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { AskDidiModal } from '../components/AskDidiModal';
import { HabitsModal } from '../components/HabitsModal';
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

  const handleTileClick = (subjectId) => {
    playPop();
    if (openSubject) openSubject(subjectId);
    go('learn');
  };

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

      {/* Top Mascot Hero Card: Custom Vector Didi the Explorer with "Ask ?" Button */}
      <DidiExplorerHero
        onAsk={() => {
          playCorrect();
          setIsAskOpen(true);
        }}
      />

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
    </div>
  );
}
