import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { PICTURE_CARDS } from '../data/pictureBookCategories';
import { playPop, playCorrect, playIncorrect, fireConfetti, speakText } from '../utils/audio';

export function WordPictureMatchGame({ onRoundComplete }) {
  const [round, setRound] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
  const [shuffledPics, setShuffledPics] = useState([]);

  // Curate 4 items per round, explicitly starting with Screenshot 4 items (Ruler, Chalk, Folder, Apple)
  useEffect(() => {
    const pool = [
      PICTURE_CARDS.find((c) => c.word === 'Ruler') || PICTURE_CARDS[0],
      PICTURE_CARDS.find((c) => c.word === 'Chalk') || PICTURE_CARDS[1],
      PICTURE_CARDS.find((c) => c.word === 'Folder') || PICTURE_CARDS[2],
      PICTURE_CARDS.find((c) => c.word === 'Rabbit') || PICTURE_CARDS[3],
      ...PICTURE_CARDS
    ];
    // Remove duplicates
    const uniquePool = Array.from(new Set(pool.map((c) => c.id))).map((id) => pool.find((c) => c.id === id));
    const startIdx = (round * 4) % (uniquePool.length - 4);
    const chosen = uniquePool.slice(startIdx, startIdx + 4);

    setActiveItems(chosen);
    // Shuffle the picture cards on the right
    setShuffledPics([...chosen].sort(() => 0.5 - Math.random()));
    setMatchedIds([]);
    setSelectedWordId(null);
  }, [round]);

  const handleSelectWord = (id) => {
    playPop();
    if (matchedIds.includes(id)) return;
    setSelectedWordId(id);
  };

  const handleSelectPic = (id) => {
    if (matchedIds.includes(id) || !selectedWordId) return;

    if (selectedWordId === id) {
      playCorrect();
      const nextMatched = [...matchedIds, id];
      setMatchedIds(nextMatched);
      setSelectedWordId(null);

      if (nextMatched.length === activeItems.length) {
        fireConfetti(true);
        if (onRoundComplete) onRoundComplete(25);
      }
    } else {
      playIncorrect();
      setSelectedWordId(null);
    }
  };

  const isRoundFinished = matchedIds.length === activeItems.length && activeItems.length > 0;

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, marginBottom: '4px' }}>
          <Sparkles size={13} />
          <span>TACTILE MATCH ARENA</span>
        </div>
        <h3 style={{ margin: '2px 0 4px', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
          Word-to-Picture Match
        </h3>
        <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
          Tap a word on the left, then tap its matching photo on the right!
        </p>
      </div>

      {/* 2-Column Matching Arena (Directly matching Screenshot 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center' }}>
        {/* Left Column: Words */}
        <div style={{ display: 'grid', gap: '10px' }}>
          {activeItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedWordId === item.id;

            let border = '#cbd5e1';
            let bg = '#ffffff';
            let text = '#0f172a';

            if (isMatched) {
              border = '#10b981';
              bg = '#ecfdf5';
              text = '#047857';
            } else if (isSelected) {
              border = '#0284c7';
              bg = '#e0f2fe';
              text = '#0369a1';
            }

            return (
              <div
                key={item.id}
                onClick={() => handleSelectWord(item.id)}
                style={{
                  background: bg,
                  border: `2.5px solid ${border}`,
                  borderRadius: '18px',
                  padding: '16px 14px',
                  textAlign: 'center',
                  cursor: isMatched ? 'default' : 'pointer',
                  boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.2)' : '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '85px'
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 900, color: text }}>
                  {item.word}
                </div>
                <div style={{ fontSize: '11px', color: isMatched ? '#059669' : '#64748b', fontWeight: 700, marginTop: '2px' }}>
                  {item.phonetic}
                </div>
                {isMatched && (
                  <span style={{ position: 'absolute', top: '8px', right: '8px', color: '#10b981' }}>
                    <Check size={16} strokeWidth={3} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Pictures */}
        <div style={{ display: 'grid', gap: '10px' }}>
          {shuffledPics.map((item) => {
            const isMatched = matchedIds.includes(item.id);

            let border = '#cbd5e1';
            let bg = '#ffffff';

            if (isMatched) {
              border = '#10b981';
              bg = '#ecfdf5';
            }

            return (
              <div
                key={item.id}
                onClick={() => handleSelectPic(item.id)}
                style={{
                  background: bg,
                  border: `2.5px solid ${border}`,
                  borderRadius: '18px',
                  padding: '8px',
                  textAlign: 'center',
                  cursor: isMatched ? 'default' : selectedWordId ? 'pointer' : 'default',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '85px'
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.word}
                  style={{
                    width: '100%',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
                {isMatched && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(236, 253, 245, 0.85)',
                      borderRadius: '16px',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#047857',
                      fontSize: '13px',
                      fontWeight: 900
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={18} strokeWidth={3} />
                      <span>{item.word}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls / Next Round */}
      {isRoundFinished && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            onClick={() => {
              playPop();
              setRound((r) => r + 1);
            }}
            className="glossyPillBtn"
            style={{ width: '100%', padding: '12px', fontSize: '13.5px' }}
          >
            <span>Round Cleared! Next 4 Words →</span>
          </button>
        </div>
      )}
    </div>
  );
}
