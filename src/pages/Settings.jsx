import React, { useState } from 'react';
import { Bell, Volume2, Accessibility, Download, RefreshCw, Info, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { useApp } from '../store/AppContext';
import { playPop, toggleAudioSFX, isAudioMuted } from '../utils/audio';

export function Settings() {
  const [voice, setVoice] = useState(true);
  const [notify, setNotify] = useState(true);
  const [large, setLarge] = useState(false);
  const [sfx, setSfx] = useState(!isAudioMuted());
  const { online } = useApp();

  const handleToggleSfx = (val) => {
    toggleAudioSFX();
    setSfx(val);
  };

  const install = () => {
    playPop();
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
    } else {
      alert('To install MerolaApp on your device, tap Share (or browser menu) -> "Add to Home Screen".');
    }
  };

  return (
    <div className={`page ${large ? 'largeText' : ''}`}>
      <div className="pageHead">
        <div>
          <p className="eyebrow">Control Center</p>
          <h1>Settings</h1>
          <p>Customize the learning experience and sound preferences.</p>
        </div>
      </div>

      <div className="settingsGrid">
        <Card>
          <div className="cardTitle">
            <Volume2 />
            <h2>Audio & Feedback</h2>
          </div>
          <Toggle label="Sound Effects & Chimes" value={sfx} set={handleToggleSfx} />
          <Toggle label="Read Questions Aloud (TTS)" value={voice} set={setVoice} />
          <Toggle label="Daily Study Reminders" value={notify} set={setNotify} />
          <Toggle label="Larger Reading Text" value={large} set={setLarge} />
        </Card>

        <Card>
          <div className="cardTitle">
            <Accessibility />
            <h2>Accessibility & Contrast</h2>
          </div>
          <p className="muted">
            High-contrast readable typography, tactile touch targets, keyboard-friendly focus, and
            screen reader compatibility are built directly into every screen.
          </p>
          <button
            className="secondary full"
            onClick={() => {
              playPop();
              setLarge((v) => !v);
            }}
          >
            {large ? 'Use standard text' : 'Increase text size'}
          </button>
        </Card>

        <Card>
          <div className="cardTitle">
            <Download />
            <h2>App & Offline Storage</h2>
          </div>
          <p className="muted">
            Network status: <b>{online ? '🟢 Online' : '🟠 Offline Mode'}</b>. All lessons, Grade 3
            curriculum, and progress records are cached locally for lightning-fast zero-delay offline
            learning.
          </p>
          <button className="secondary full" onClick={install}>
            <Download size={16} /> Install Native PWA
          </button>
          <button
            className="secondary full"
            onClick={() => {
              playPop();
              window.location.reload();
            }}
          >
            <RefreshCw size={16} /> Refresh MerolaApp
          </button>
        </Card>

        <Card>
          <div className="cardTitle">
            <Info />
            <h2>MerolaApp Enterprise</h2>
          </div>
          <p className="muted">Version 2.0.0 · Grade 3 Duolingo & iOS Native Edition.</p>
          <div className="security">
            Powered by modern React 18, Web Audio oscillators, speech synthesis, and offline-first
            storage boundaries.
          </div>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ label, value, set }) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <button
        type="button"
        aria-label={label}
        className={value ? 'on' : ''}
        onClick={() => {
          playPop();
          set(!value);
        }}
      >
        <i />
      </button>
    </label>
  );
}
