import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { playPop, playCorrect } from '../utils/audio';

const AGE_GRADE_OPTIONS = [
  { id: 'K', label: '2–4 years (K)' },
  { id: '1', label: '5–6 years (Gr 1)' },
  { id: '3', label: '7–8 years (Gr 3)' },
  { id: '5', label: '9+ years (Gr 4+)' }
];

const AVATAR_OPTIONS = [
  { id: 'dino1', emoji: '🦖', label: 'T-Rex' },
  { id: 'dino2', emoji: '🦕', label: 'Bronto' },
  { id: 'fox', emoji: '🦊', label: 'Foxy' },
  { id: 'bunny', emoji: '🐰', label: 'Bunny' },
  { id: 'owl', emoji: '🦉', label: 'Owl' },
  { id: 'dragon', emoji: '🐉', label: 'Dragon' }
];

export function Onboarding({ done, onBack }) {
  const { addChild } = useApp();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('3'); // Default to Grade 3 for MerolaApp
  const [selectedAvatar, setSelectedAvatar] = useState('🦖');

  const handleCreate = () => {
    if (!name.trim()) return;
    playCorrect();
    addChild({
      id: crypto.randomUUID(),
      name: name.trim(),
      grade: grade,
      avatar: selectedAvatar,
      xp: 450,
      streak: 5,
      completed: ['3-week5-0'],
      minutes: 25,
      dailyGoal: 20
    });
    done();
  };

  return (
    <div className="profileScreen">
      <div>
        {/* Top Back Button */}
        {onBack && (
          <button
            className="backCircleBtn"
            onClick={() => {
              playPop();
              onBack();
            }}
            title="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Title & Subtitle */}
        <h1>Create Child Profile</h1>
        <p className="sub">Tell us about your little learner!</p>

        {/* Child's Name */}
        <div className="formSectionTitle">Child's Name</div>
        <input
          className="profileInput"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        {/* Child's Age / Grade Selection Chips */}
        <div className="formSectionTitle">Child's Age & Grade</div>
        <div className="chipRow">
          {AGE_GRADE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`chipBtn ${grade === opt.id ? 'active' : ''}`}
              onClick={() => {
                playPop();
                setGrade(opt.id);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Choose an Avatar */}
        <div className="formSectionTitle">Choose an Avatar</div>
        <div className="avatarGrid">
          {AVATAR_OPTIONS.map((av) => (
            <button
              key={av.id}
              type="button"
              className={`avatarCard ${selectedAvatar === av.emoji ? 'active' : ''}`}
              onClick={() => {
                playPop();
                setSelectedAvatar(av.emoji);
              }}
              title={av.label}
            >
              <span>{av.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div style={{ marginTop: '20px' }}>
        <button
          className="glossyPillBtn"
          disabled={!name.trim()}
          style={{ opacity: !name.trim() ? 0.6 : 1 }}
          onClick={handleCreate}
        >
          Create Profile
        </button>
      </div>
    </div>
  );
}
