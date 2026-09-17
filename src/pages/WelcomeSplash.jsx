import React from 'react';
import { playPop, playCorrect } from '../utils/audio';

export function WelcomeSplash({ onContinue, onSkip }) {
  return (
    <div className="splashScreen">
      {/* Background Floating Study Doodles */}
      <div className="splashDoodles">
        <span className="doodleItem" style={{ top: '8%', left: '8%', fontSize: '24px' }}>💡</span>
        <span className="doodleItem" style={{ top: '6%', right: '10%', fontSize: '26px' }}>🪐</span>
        <span className="doodleItem" style={{ top: '22%', left: '4%', fontSize: '22px' }}>📖</span>
        <span className="doodleItem" style={{ top: '20%', right: '5%', fontSize: '22px' }}>🎨</span>
        <span className="doodleItem" style={{ top: '34%', left: '8%', fontSize: '20px' }}>⭐</span>
        <span className="doodleItem" style={{ top: '32%', right: '8%', fontSize: '22px' }}>🎵</span>
      </div>

      {/* Top Header */}
      <div className="splashHeader">
        <h1>Fun activities<br />for your child</h1>
      </div>

      {/* Central Illustration: Rocket + Fox + Bunny + Owl on Grassy Hill */}
      <div className="splashHeroArt">
        <div className="grassyHill" />
        <div className="charactersCluster">
          {/* Rocket in Center */}
          <div className="rocketLaunch">🚀</div>
          {/* Friendly Animal Companions */}
          <div className="foxChar" title="Foxy Explorer">🦊</div>
          <div className="bunnyChar" title="Smart Bunny">🐰</div>
          <div className="owlChar" title="Wise Owl">🦉</div>
        </div>
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
