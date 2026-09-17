import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { grades } from '../data/curriculum';
import { playPop, playCorrect } from '../utils/audio';

export function Onboarding({ done }) {
  const { addChild } = useApp();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('3');
  const [avatar, setAvatar] = useState('🦊');

  const handleCreate = () => {
    if (!name.trim()) return;
    playCorrect();
    addChild({
      id: crypto.randomUUID(),
      name: name.trim(),
      grade,
      avatar,
      xp: 0,
      streak: 1,
      completed: [],
      minutes: 0,
      dailyGoal: 20
    });
    done();
  };

  return (
    <div className="onboard">
      <div className="onboardArt">🚀</div>
      <p className="eyebrow">MerolaApp Enterprise</p>
      <h1>Create your learner profile</h1>
      <p>Personalize your Grade 3 learning adventure with your name and avatar.</p>

      <label>
        Child's name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Merola, Alex, Maya"
          autoFocus
        />
      </label>

      <div className="sectionTitle">
        <h2>Choose a grade</h2>
      </div>
      <div className="gradeChoose">
        {grades.map((g) => (
          <button
            key={g}
            type="button"
            className={grade === g ? 'selected' : ''}
            onClick={() => {
              playPop();
              setGrade(g);
            }}
          >
            Grade {g}
          </button>
        ))}
      </div>

      <div className="sectionTitle">
        <h2>Choose an avatar</h2>
      </div>
      <div className="avatarChoose">
        {['🦊', '🐼', '🦕', '🦉', '🐨', '🐯', '🦁', '🐬'].map((a) => (
          <button
            key={a}
            type="button"
            className={avatar === a ? 'selected' : ''}
            onClick={() => {
              playPop();
              setAvatar(a);
            }}
          >
            {a}
          </button>
        ))}
      </div>

      <button
        className="primary full"
        disabled={!name.trim()}
        onClick={handleCreate}
      >
        <Sparkles size={18} /> Start My Adventure
      </button>
    </div>
  );
}
