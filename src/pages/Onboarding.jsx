import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DinoAvatarVector } from '../components/illustrations/KidsVectors';
import { playPop, playCorrect } from '../utils/audio';

const AGE_GRADE_OPTIONS = [
  { id: 'K', label: '2–4 years (K)' },
  { id: '1', label: '5–6 years (Gr 1)' },
  { id: '3', label: '7–8 years (Gr 3)' },
  { id: '5', label: '9+ years (Gr 4+)' }
];

const AVATAR_OPTIONS = [
  { id: 'rex', emoji: '🦖', label: 'T-Rex Explorer' },
  { id: 'tricera', emoji: '🦕', label: 'Triceratops' },
  { id: 'stego', emoji: '🐊', label: 'Stegosaurus' },
  { id: 'bronto', emoji: '🐢', label: 'Brontosaurus' },
  { id: 'fox', emoji: '🦊', label: 'Foxy Scout' },
  { id: 'dragon', emoji: '🐉', label: 'Dragon' }
];

export function Onboarding({ done, onBack }) {
  const { addChild } = useApp();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('3'); // Default to Grade 3 for MerolaApp
  const [selectedAvatarId, setSelectedAvatarId] = useState('rex');

  const handleCreate = () => {
    if (!name.trim()) return;
    playCorrect();
    const avatarObj = AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId) || AVATAR_OPTIONS[0];
    addChild({
      id: crypto.randomUUID(),
      name: name.trim(),
      grade: grade,
      avatar: avatarObj.emoji,
      avatarId: selectedAvatarId,
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
              className={`avatarCard ${selectedAvatarId === av.id ? 'active' : ''}`}
              onClick={() => {
                playPop();
                setSelectedAvatarId(av.id);
              }}
              title={av.label}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
            >
              <DinoAvatarVector id={av.id} className="w-12 h-12" />
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
