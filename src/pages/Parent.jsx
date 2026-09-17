import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, BarChart3, BookOpen, Sparkles, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { useApp } from '../store/AppContext';
import { grades } from '../data/curriculum';
import { playPop, playCorrect } from '../utils/audio';

export function Parent() {
  const { child, children, setChild, addChild, updateChild, role } = useApp();
  const [addingChild, setAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildGrade, setNewChildGrade] = useState('3');

  // Custom flashcard state
  const [customWord, setCustomWord] = useState('');
  const [customDef, setCustomDef] = useState('');
  const [customSentence, setCustomSentence] = useState('');
  const [customList, setCustomList] = useState(() => {
    try {
      const raw = localStorage.getItem('merola_parent_cards');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleAddChild = () => {
    if (!newChildName.trim()) return;
    const avatars = ['🦕', '🦊', '🐼', '🦉', '🐨', '🐯', '🦁', '🐬'];
    const created = {
      id: crypto.randomUUID(),
      name: newChildName.trim(),
      grade: newChildGrade,
      avatar: avatars[children.length % avatars.length],
      xp: 0,
      streak: 1,
      completed: [],
      minutes: 0,
      dailyGoal: 20
    };
    addChild(created);
    setNewChildName('');
    setAddingChild(false);
    playCorrect();
  };

  const handleAddCustomCard = (e) => {
    e.preventDefault();
    if (!customWord.trim()) return;
    const newCard = {
      id: Date.now().toString(),
      word: customWord.trim(),
      definition: customDef.trim() || 'Custom parent-assigned card',
      sentence: customSentence.trim(),
      subject: 'reading',
      image: '✏️'
    };
    const updated = [newCard, ...customList];
    setCustomList(updated);
    localStorage.setItem('merola_parent_cards', JSON.stringify(updated));
    setCustomWord('');
    setCustomDef('');
    setCustomSentence('');
    playCorrect();
  };

  const handleDeleteCustomCard = (id) => {
    const updated = customList.filter((c) => c.id !== id);
    setCustomList(updated);
    localStorage.setItem('merola_parent_cards', JSON.stringify(updated));
    playPop();
  };

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <p className="eyebrow">{role === 'parent' ? 'Family Center' : 'Organization Console'}</p>
          <h1>{role === 'parent' ? 'Parent & Educator Portal' : 'Learning Operations'}</h1>
          <p>Manage learner profiles, daily study goals, and create custom homework flashcards.</p>
        </div>
        <button
          className="primary"
          onClick={() => {
            playPop();
            setAddingChild(true);
          }}
        >
          <Plus size={16} /> Add learner
        </button>
      </div>

      <div className="parentGrid">
        <Card>
          <div className="cardTitle">
            <Users />
            <h2>Learner Profiles</h2>
          </div>
          {children.map((k) => (
            <button
              className={`childRow ${k.id === child.id ? 'chosen' : ''}`}
              key={k.id}
              onClick={() => {
                playPop();
                setChild(k.id);
              }}
            >
              <span>{k.avatar}</span>
              <div className="grow">
                <b>{k.name}</b>
                <small>
                  Grade {k.grade} · {k.xp} XP · {k.streak} day streak
                </small>
              </div>
            </button>
          ))}
        </Card>

        <Card>
          <div className="cardTitle">
            <BarChart3 />
            <h2>Active Learner: {child.name}</h2>
          </div>
          <div className="detailHero">
            <span>{child.avatar}</span>
            <div>
              <h2>{child.name}</h2>
              <p>Grade {child.grade} Curriculum</p>
            </div>
          </div>
          <div className="adminStats">
            <span>
              <b>{child.completed.length}</b> lessons
            </span>
            <span>
              <b>{child.minutes}</b> min
            </span>
            <span>
              <b>{child.xp}</b> XP
            </span>
          </div>
          <label className="field">
            Daily goal (minutes)
            <input
              type="number"
              value={child.dailyGoal}
              onChange={(e) =>
                updateChild(child.id, {
                  dailyGoal: Math.max(5, Number(e.target.value) || 5)
                })
              }
            />
          </label>
        </Card>

        {/* Custom Card Studio */}
        <Card>
          <div className="cardTitle">
            <Sparkles />
            <h2>Add Custom Flashcard</h2>
          </div>
          <form onSubmit={handleAddCustomCard} style={{ display: 'grid', gap: '10px' }}>
            <label className="field">
              Target Word / Topic
              <input
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value)}
                placeholder="e.g. photosynthesis, multiply, perimeter"
                required
              />
            </label>
            <label className="field">
              Definition / Explanation
              <input
                value={customDef}
                onChange={(e) => setCustomDef(e.target.value)}
                placeholder="Clear meaning or clue for the child"
              />
            </label>
            <label className="field">
              Example Sentence (Optional)
              <input
                value={customSentence}
                onChange={(e) => setCustomSentence(e.target.value)}
                placeholder="Use the word in a sentence"
              />
            </label>
            <button type="submit" className="primary small" style={{ marginTop: '8px' }}>
              <Plus size={14} /> Add to Learning Library
            </button>
          </form>

          {customList.length > 0 && (
            <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
              <small style={{ fontWeight: 800, color: '#6e8199' }}>Active Custom Cards ({customList.length}):</small>
              {customList.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div>
                    <strong>{c.word}</strong>: <span style={{ color: '#64748b' }}>{c.definition}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCustomCard(c.id)}
                    style={{ border: 0, background: 'none', color: '#ef4444', cursor: 'pointer' }}
                    title="Remove card"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="cardTitle">
            <ShieldCheck />
            <h2>Safety, Privacy & Offline</h2>
          </div>
          <div className="security">
            <b>Child-safe defaults enabled</b>
            <br />
            No public profiles · No 3rd party trackers · 100% offline-capable PWA · Encrypted local
            storage boundary for all progress data.
          </div>
        </Card>
      </div>

      {addingChild && (
        <div className="modal">
          <div className="modalPanel compact">
            <h2>Create Learner Profile</h2>
            <label className="field">
              Child's name
              <input
                autoFocus
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Enter learner's name"
              />
            </label>

            <div className="sectionTitle">
              <h2>Select Grade</h2>
            </div>
            <div className="gradeChoose">
              {grades.map((g) => (
                <button
                  key={g}
                  className={newChildGrade === g ? 'selected' : ''}
                  onClick={() => setNewChildGrade(g)}
                >
                  Grade {g}
                </button>
              ))}
            </div>

            <div className="modalActions">
              <button
                className="secondary"
                onClick={() => {
                  playPop();
                  setAddingChild(false);
                }}
              >
                Cancel
              </button>
              <button className="primary" onClick={handleAddChild}>
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
