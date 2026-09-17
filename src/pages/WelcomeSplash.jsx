import React from 'react';
import { RocketSceneIllustration } from '../components/illustrations/KidsVectors';
import { playPop, playCorrect } from '../utils/audio';

export function WelcomeSplash({ onContinue, onSkip }) {
  return (
    <div className="splashScreen">
      {/* Background Floating Study Doodles */}
      <div className="splashDoodles">
        <span className="doodleItem" style={{ top: '8%', left: '8%', fontSize: '26px' }}>💡</span>
        <span className="doodleItem" style={{ top: '6%', right: '10%', fontSize: '28px' }}>🪐</span>
        <span className="doodleItem" style={{ top: '22%', left: '4%', fontSize: '24px' }}>📖</span>
        <span className="doodleItem" style={{ top: '20%', right: '5%', fontSize: '24px' }}>🎨</span>
        <span className="doodleItem" style={{ top: '34%', left: '8%', fontSize: '22px' }}>⭐</span>
        <span className="doodleItem" style={{ top: '32%', right: '8%', fontSize: '24px' }}>🎵</span>
      </div>

      {/* Top Header */}
      <div className="splashHeader">
        <h1>Fun activities<br />for your child</h1>
      </div>

      {/* Central Illustration: High-End Vector Rocket, Fox, Bunny & Owl Scene */}
      <div className="splashHeroArt" style={{ width: '100%', marginBottom: '10px' }}>
        <RocketSceneIllustration />
      </div>

      {/* Bottom Action Area */}
      <div>
        {/* 3 Pagination Indicator Dots */}
        <div className="paginationDots">
          <div className="dot active" />
          <div className="dot" />
          <div className="dot" />
        </div>

        {/* Glossy Pill Continue Button */}
        <button
          className="glossyPillBtn"
          onClick={() => {
            playCorrect();
            onContinue();
          }}
        >
          Continue
        </button>

        {/* Skip Button */}
        <button
          className="skipBtn"
          onClick={() => {
            playPop();
            onSkip();
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
