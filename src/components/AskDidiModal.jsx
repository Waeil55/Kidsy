import React, { useState } from 'react';
import { Volume2, Sparkles, X, MessageSquare, Send } from 'lucide-react';
import { speakText, playPop, playCorrect } from '../utils/audio';

const DIDI_PROMPTS = [
  {
    q: 'What does "oppose" mean?',
    a: 'Oppose means to be against something or disagree with an idea, like voting no on a new rule!'
  },
  {
    q: 'What is 7 × 8 in math?',
    a: '7 × 8 is 56! A fun trick to remember is 5, 6, 7, 8: 56 = 7 × 8!'
  },
  {
    q: 'What is a habitat in science?',
    a: 'A habitat is an animal\'s natural home that provides food, clean water, and safe shelter.'
  },
  {
    q: 'Cheer me on, Didi!',
    a: 'You are an absolute superstar explorer! Keep being curious and your brain will grow stronger every day!'
  }
];

export function AskDidiModal({ onClose }) {
  const [activeAnswer, setActiveAnswer] = useState(
    'Hi there, explorer! I am Didi! What would you like to discover today?'
  );
  const [customQuery, setCustomQuery] = useState('');

  const handleAsk = (answerText) => {
    setActiveAnswer(answerText);
    playCorrect();
    speakText(answerText);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    const response = `Great question about "${customQuery}"! Exploring new ideas makes you a brilliant learner!`;
    handleAsk(response);
    setCustomQuery('');
  };

  return (
    <div className="modal">
      <div className="modalPanel compact">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '32px' }}>🦖</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Ask Didi the Explorer</h2>
              <small style={{ color: '#64748b' }}>Your friendly AI learning companion</small>
            </div>
          </div>
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            style={{ border: 0, background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Didi Speech Bubble */}
        <div
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
            border: '1.5px solid #bae6fd',
            borderRadius: '20px',
            padding: '16px',
            margin: '16px 0',
            position: 'relative'
          }}
        >
          <p style={{ margin: 0, fontSize: '15px', color: '#0369a1', fontWeight: 650, lineHeight: 1.4 }}>
            "{activeAnswer}"
          </p>
          <button
            onClick={() => speakText(activeAnswer)}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: '#0284c7',
              color: '#ffffff',
              border: 0,
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
            title="Listen again"
          >
            <Volume2 size={14} />
          </button>
        </div>

        {/* Suggested Questions */}
        <div style={{ margin: '14px 0 8px', fontSize: '13px', fontWeight: 800, color: '#334155' }}>
          Try asking Didi:
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {DIDI_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(item.a)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#1e293b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MessageSquare size={14} color="#0284c7" />
              <span>{item.q}</span>
            </button>
          ))}
        </div>

        {/* Custom Question Input */}
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <input
            style={{
              flex: 1,
              padding: '12px 14px',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              fontSize: '13.5px',
              outline: 'none'
            }}
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Ask anything..."
          />
          <button
            type="submit"
            className="primary small"
            style={{ borderRadius: '14px', padding: '0 16px' }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
