import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  LuMic, LuMicOff, LuVolume2, LuVolumeX, LuRotateCcw, LuArrowRight,
  LuSparkles, LuCheck, LuFlame, LuStar, LuMessageCircle, LuSend,
  LuHelpCircle, LuBookOpen, LuChevronRight, LuSmile, LuBot
} from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { G3_PDF_WORD_ROWS } from '../data/g3ela.js';
import { speak, stopSpeaking, listen, micSupported, ttsSupported } from '../lib/speech.js';
import { confetti, toast } from '../ui/ui.jsx';
import { Link } from '../ui/router.js';

// Keyword mappings to evaluate child's spoken meaning for Grade 3 School Vocabs
const MEANING_KEYWORDS = {
  oppose: ['against', 'disagree', 'fight', 'say no', 'object', 'not like', 'conflict', 'resist', 'deny'],
  snide: ['mean', 'nasty', 'rude', 'unkind', 'hurtful', 'mocking', 'bad way', 'sarcastic', 'disrespectful'],
  heap: ['pile', 'stack', 'collection', 'mess', 'mound', 'lot of things', 'bunch', 'cluster'],
  diverse: ['different', 'unlike', 'not same', 'variety', 'various', 'many kinds', 'mixed'],
  origin: ['beginning', 'start', 'where it comes', 'first', 'birth', 'source', 'root'],
  assemble: ['put together', 'build', 'construct', 'join', 'gather', 'make', 'connect', 'fit together'],
  grumble: ['complain', 'whine', 'quiet voice', 'mutter', 'grump', 'growl', 'unhappy', 'protest'],
  calculate: ['figure out', 'compute', 'answer', 'math', 'numbers', 'solve', 'count', 'determine'],
  elegant: ['fancy', 'high quality', 'graceful', 'stylish', 'beautiful', 'neat', 'classy', 'fine'],
  privilege: ['special benefit', 'honor', 'advantage', 'treat', 'special right', 'favor', 'perk'],
  fragile: ['easily broken', 'breakable', 'delicate', 'weak', 'gentle', 'careful', 'shatter'],
  research: ['study', 'investigate', 'examine', 'look up', 'learn about', 'find facts', 'read about'],
  defend: ['prove', 'evidence', 'protect', 'support', 'stand up', 'justify', 'guard'],
  specific: ['particular', 'precise', 'exact', 'definite', 'detail', 'clear', 'certain'],
  pledge: ['promise', 'vow', 'agreement', 'swear', 'commit', 'word'],
  redundant: ['too much', 'repetitive', 'more than needed', 'repeating', 'extra', 'not needed'],
  gesture: ['movement', 'body movement', 'hand movement', 'sign', 'wave', 'motion'],
  acknowledge: ['recognize', 'notice', 'respond', 'greet', 'admit', 'see', 'answer'],
  clutch: ['hold', 'tight', 'grasp', 'grip', 'squeeze', 'catch'],
  persevere: ['keep trying', 'not give up', 'persist', 'endure', 'keep working', 'try hard', 'continue'],
  literal: ['usual meaning', 'exact', 'actual', 'real meaning', 'not figurative', 'word for word'],
  dialogue: ['conversation', 'talk', 'talking', 'two people', 'chat', 'discussion', 'speaking together'],
  rival: ['competing', 'competitor', 'opponent', 'player against', 'enemy in game', 'win against'],
  passion: ['strong liking', 'love', 'enthusiasm', 'enjoy a lot', 'big interest', 'heart'],
  claim: ['state as fact', 'declare', 'say is true', 'assert', 'tell', 'say for sure'],
};

export default function VocabTalk() {
  const { state, dispatch } = useStore();
  const [wordIdx, setWordIdx] = useState(0);
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState('idle'); // 'asking' | 'listening' | 'evaluating' | 'coaching'
  const [interim, setInterim] = useState('');
  const [soundActive, setSoundActive] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [autoListen, setAutoListen] = useState(true);
  const [mastered, setMastered] = useState(new Set());
  const [speakingNow, setSpeakingNow] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);

  const wordRow = G3_PDF_WORD_ROWS[wordIdx] || G3_PDF_WORD_ROWS[0];
  const [word, pos, definition, syns, ants, example] = wordRow;

  const chatEndRef = useRef(null);
  const micHandle = useRef(null);
  const silenceTimer = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interim]);

  // Clean up mic and speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (micHandle.current) micHandle.current.stop();
      clearTimeout(silenceTimer.current);
    };
  }, []);

  // Buddy speech helper
  const buddySay = useCallback((text, onFinish) => {
    setSpeakingNow(true);
    speak(text, {
      rate: state.settings.rate || 0.95,
      onEnd: () => {
        setSpeakingNow(false);
        if (onFinish) onFinish();
      }
    });
  }, [state.settings.rate]);

  // Start listening for child's voice
  const startListening = useCallback(() => {
    stopSpeaking();
    setSpeakingNow(false);
    clearTimeout(silenceTimer.current);
    setInterim('');
    setPhase('listening');
    setSoundActive(false);

    if (micHandle.current) micHandle.current.stop();

    micHandle.current = listen({
      lang: 'en-US',
      continuous: true,
      onText: (final, currentInterim) => {
        const spoken = (final + ' ' + currentInterim).trim();
        setInterim(spoken);
        if (spoken.length > 0) {
          setSoundActive(true);
          // Reset silence timer on every spoken word
          clearTimeout(silenceTimer.current);
          silenceTimer.current = setTimeout(() => {
            // After 2.4s of silence, auto-submit what was heard
            handleStudentSubmit(spoken);
          }, 2400);
        }
      },
      onEnd: (err, final) => {
        setSoundActive(false);
        if (err && err !== 'no-speech' && err !== 'aborted') {
          console.warn('Speech recognition warning:', err);
        }
      }
    });
  }, []);

  const stopListening = useCallback(() => {
    clearTimeout(silenceTimer.current);
    if (micHandle.current) {
      micHandle.current.stop();
      micHandle.current = null;
    }
    setSoundActive(false);
  }, []);

  // Initiate a new word conversation
  const startWordConversation = useCallback((index) => {
    stopSpeaking();
    stopListening();
    const row = G3_PDF_WORD_ROWS[index];
    const targetWord = row[0];
    const targetPos = row[1];

    const greetingVariations = [
      `Hi ${state.profile.name || 'friend'}! Let's talk about our school word: "${targetWord}". What does "${targetWord}" mean?`,
      `Here is a wonderful word from our school list: "${targetWord}"! Can you tell me, what does "${targetWord}" mean?`,
      `Time for our next school vocabulary word: "${targetWord}"! What does the word "${targetWord}" mean?`,
    ];
    const promptText = greetingVariations[index % greetingVariations.length];

    const newMsg = {
      id: Date.now(),
      sender: 'buddy',
      text: promptText,
      word: targetWord,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setPhase('asking');

    buddySay(promptText, () => {
      if (autoListen) {
        startListening();
      } else {
        setPhase('idle');
      }
    });
  }, [state.profile.name, autoListen, buddySay, startListening, stopListening]);

  // Initial mount trigger
  useEffect(() => {
    startWordConversation(0);
    // eslint-disable-next-line
  }, []);

  // Intelligent student response evaluation
  const handleStudentSubmit = (studentSpeech) => {
    const speech = (studentSpeech || typedText || interim).trim();
    if (!speech) return;

    stopListening();
    setInterim('');
    setTypedText('');
    setPhase('evaluating');

    // Add student's speech bubble to chat
    const studentMsg = {
      id: Date.now(),
      sender: 'student',
      text: speech,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, studentMsg]);

    const lower = speech.toLowerCase();
    const keywords = MEANING_KEYWORDS[word.toLowerCase()] || [];
    const defLower = definition.toLowerCase();
    const synList = (syns || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);

    // Check matches
    const isKeywordMatch = keywords.some((kw) => lower.includes(kw));
    const isDefWordMatch = defLower.split(' ').filter((w) => w.length > 3).some((w) => lower.includes(w));
    const isSynMatch = synList.some((syn) => lower.includes(syn));
    const isConfused = /\b(don't know|no idea|what is it|help me|tell me|not sure|i forget)\b/i.test(lower);

    let isCorrect = false;
    let replyText = '';

    if (isConfused) {
      replyText = `That's totally okay! That's why we practice together. "${word}" is a ${pos} that means: ${definition}. For example, "${example}". Now, can you say "${word}" out loud?`;
    } else if (isKeywordMatch || (isDefWordMatch && isSynMatch)) {
      isCorrect = true;
      const cheers = [
        `Spot on, ${state.profile.name || 'superstar'}! That is exactly right! "${word}" means ${definition.toLowerCase()}.`,
        `Brilliant answer! You got it! "${word}" means ${definition.toLowerCase()}. You really know your school words!`,
        `Yes! Excellent explanation! To ${word} means ${definition.toLowerCase()}.`,
      ];
      replyText = `${cheers[Math.floor(Math.random() * cheers.length)]} In our school reading: "${example}"`;
    } else if (isDefWordMatch || lower.includes(word.toLowerCase())) {
      replyText = `You're very close! Remember, in our Grade 3 school words, "${word}" specifically means: ${definition}. For example: "${example}".`;
    } else {
      replyText = `Good effort trying! In our school workbook, "${word}" means: ${definition}. Like in this sentence: "${example}".`;
    }

    if (isCorrect) {
      confetti();
      dispatch({ type: 'answer', grade: 'G3', subject: 'speaking', correct: true });
      setMastered((prev) => new Set([...prev, word]));
      setSessionScore((s) => s + 1);
      toast(`Word mastered: ${word}! ⭐`, '🎉');
    }

    // Buddy responds aloud
    setTimeout(() => {
      const buddyReplyMsg = {
        id: Date.now() + 1,
        sender: 'buddy',
        text: replyText,
        isFeedback: true,
        isCorrect,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, buddyReplyMsg]);
      setPhase('coaching');

      buddySay(replyText, () => {
        setPhase('idle');
      });
    }, 400);
  };

  const handleNextWord = () => {
    stopSpeaking();
    stopListening();
    const nextIdx = (wordIdx + 1) % G3_PDF_WORD_ROWS.length;
    setWordIdx(nextIdx);
    startWordConversation(nextIdx);
  };

  const handleSelectWord = (idx) => {
    stopSpeaking();
    stopListening();
    setWordIdx(idx);
    startWordConversation(idx);
  };

  const repeatLastPrompt = () => {
    const lastBuddyMsg = [...messages].reverse().find((m) => m.sender === 'buddy');
    if (lastBuddyMsg) {
      buddySay(lastBuddyMsg.text);
    }
  };

  return (
    <div className="vocab-talk-screen" style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top Header Card */}
      <section className="card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff', padding: '18px 22px', borderRadius: 20 }}>
        <div className="row wrap" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div className="row gap12" style={{ alignItems: 'center' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 26, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              🦊
            </div>
            <div>
              <span className="pill" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 800, fontSize: '0.75rem' }}>
                GRADE 3 SCHOOL VOCABULARY
              </span>
              <h1 style={{ margin: '2px 0 0 0', color: '#fff', fontSize: '1.4rem' }}>Vocab Talk Buddy 🎙️</h1>
            </div>
          </div>
          <div className="row wrap gap8" style={{ alignItems: 'center' }}>
            <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }}>
              <LuStar style={{ color: '#fbbf24' }} /> {mastered.size} / {G3_PDF_WORD_ROWS.length} Mastered
            </span>
            <button
              className="btn sm"
              style={{ background: autoListen ? '#10b981' : 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', fontWeight: 700 }}
              onClick={() => setAutoListen(!autoListen)}
              title="Automatically listen after buddy speaks"
            >
              {autoListen ? '🎙️ Auto-mic: ON' : '🎙️ Auto-mic: OFF'}
            </button>
          </div>
        </div>
      </section>

      {/* Target Word Strip & Fast Selector */}
      <section className="card" style={{ padding: '12px 16px' }}>
        <div className="row wrap" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div className="row gap8" style={{ alignItems: 'center' }}>
            <span className="pill" style={{ background: 'var(--primary)', color: '#fff', fontWeight: 800 }}>
              Word {wordIdx + 1} of 25
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'capitalize' }}>
              {word}
            </span>
            <span className="pill" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>{pos}</span>
          </div>
          <div className="row gap8">
            <button className="btn soft sm" onClick={repeatLastPrompt} title="Hear buddy speak again">
              <LuVolume2 /> Repeat
            </button>
            <button className="btn pri sm" onClick={handleNextWord}>
              Next Word <LuArrowRight />
            </button>
          </div>
        </div>

        {/* Horizontal scrollable word chips */}
        <div className="row gap6" style={{ overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'thin' }}>
          {G3_PDF_WORD_ROWS.map((r, i) => (
            <button
              key={r[0]}
              onClick={() => handleSelectWord(i)}
              className={`pill ${i === wordIdx ? 'pri' : ''}`}
              style={{
                cursor: 'pointer',
                background: i === wordIdx ? 'var(--primary)' : mastered.has(r[0]) ? '#dcfce7' : 'var(--card-bg, #f1f3f5)',
                color: i === wordIdx ? '#fff' : mastered.has(r[0]) ? '#15803d' : 'var(--ink)',
                border: i === wordIdx ? 'none' : '1px solid var(--border)',
                fontWeight: 600,
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {mastered.has(r[0]) && '✓ '}
              {r[0]}
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Chat Thread Area */}
      <section className="card col" style={{ minHeight: 380, maxHeight: 460, overflowY: 'auto', padding: '16px', gap: 12 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.sender === 'buddy' ? 'flex-start' : 'flex-end',
              width: '100%'
            }}
          >
            <div style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
              maxWidth: '85%',
              flexDirection: m.sender === 'buddy' ? 'row' : 'row-reverse'
            }}>
              <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>
                {m.sender === 'buddy' ? '🦊' : state.profile.avatar || '🧒'}
              </span>
              <div
                style={{
                  background: m.sender === 'buddy'
                    ? (m.isFeedback ? (m.isCorrect ? '#ecfdf5' : '#eff6ff') : '#f8fafc')
                    : 'var(--primary, #ff7a00)',
                  color: m.sender === 'buddy' ? '#1e293b' : '#ffffff',
                  padding: '12px 16px',
                  borderRadius: 18,
                  borderBottomLeftRadius: m.sender === 'buddy' ? 4 : 18,
                  borderBottomRightRadius: m.sender === 'buddy' ? 18 : 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: m.sender === 'buddy' ? (m.isCorrect ? '1.5px solid #10b981' : '1.5px solid #e2e8f0') : 'none',
                  fontSize: '1rem',
                  lineHeight: 1.45,
                  position: 'relative'
                }}
              >
                <div>{m.text}</div>
                {m.sender === 'buddy' && (
                  <button
                    onClick={() => buddySay(m.text)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      fontSize: '0.85rem',
                      color: 'var(--primary)',
                      marginTop: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontWeight: 700
                    }}
                  >
                    <LuVolume2 size={13} /> Listen again
                  </button>
                )}
              </div>
            </div>
            <span className="tiny muted" style={{ marginTop: 2, padding: '0 38px' }}>{m.time}</span>
          </div>
        ))}

        {/* Live Interim Transcript Bubble while Student Speaks */}
        {phase === 'listening' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
            <div style={{
              display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: '85%', flexDirection: 'row-reverse'
            }}>
              <span style={{ fontSize: '1.6rem' }}>{state.profile.avatar || '🧒'}</span>
              <div style={{
                background: '#fff7ed',
                border: '2px dashed var(--primary)',
                color: 'var(--ink)',
                padding: '10px 16px',
                borderRadius: 18,
                fontSize: '0.95rem',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span className="pulse-mic" style={{ color: '#ef4444' }}>🎙️</span>
                <span>{interim || 'Listening to you... Speak your answer aloud!'}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </section>

      {/* Conversational Controls / Sound Detection Bar */}
      <section className="card col gap12" style={{ padding: '16px' }}>
        <div className="row wrap" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          {/* Animated sound detector indicator */}
          <div className="row gap8" style={{ alignItems: 'center' }}>
            {speakingNow ? (
              <div className="row gap6" style={{ alignItems: 'center', color: '#6366f1', fontWeight: 700 }}>
                <span style={{ fontSize: '1.2rem' }}>🦊</span>
                <span>Buddy is speaking...</span>
                <span style={{ display: 'inline-flex', gap: 2 }}>
                  <i style={{ width: 4, height: 16, background: '#6366f1', borderRadius: 2, animation: 'pulse 0.6s infinite' }} />
                  <i style={{ width: 4, height: 22, background: '#6366f1', borderRadius: 2, animation: 'pulse 0.4s infinite' }} />
                  <i style={{ width: 4, height: 14, background: '#6366f1', borderRadius: 2, animation: 'pulse 0.8s infinite' }} />
                </span>
              </div>
            ) : phase === 'listening' ? (
              <div className="row gap6" style={{ alignItems: 'center', color: '#16a34a', fontWeight: 700 }}>
                <span style={{ color: '#ef4444', animation: 'ping 1s infinite' }}>🔴</span>
                <span>{soundActive ? 'Sound detected! Listening...' : 'Waiting for sound... Speak now!'}</span>
              </div>
            ) : (
              <div className="row gap6" style={{ alignItems: 'center', color: 'var(--muted)', fontWeight: 600 }}>
                <span>Ready for your answer</span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="row wrap gap8">
            {phase === 'listening' ? (
              <button
                className="btn pri sm"
                onClick={() => handleStudentSubmit(interim)}
                style={{ fontWeight: 800 }}
              >
                <LuCheck /> I'm Done Speaking
              </button>
            ) : (
              <button
                className="btn pri sm"
                onClick={startListening}
                style={{ fontWeight: 800 }}
              >
                <LuMic /> Tap to Speak
              </button>
            )}

            {speakingNow && (
              <button className="btn soft sm" onClick={stopSpeaking}>
                <LuVolumeX /> Pause Buddy
              </button>
            )}
          </div>
        </div>

        {/* Text Input Option for Quiet Environments */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStudentSubmit(typedText);
          }}
          className="row gap8"
          style={{ width: '100%' }}
        >
          <input
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder={`Say or type: what does "${word}" mean?`}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 14,
              border: '1.5px solid var(--border)',
              fontSize: '0.95rem'
            }}
          />
          <button type="submit" className="btn sm" disabled={!typedText.trim()} style={{ borderRadius: 14 }}>
            <LuSend /> Send
          </button>
        </form>

        {/* Helpful Clue / Meaning Preview Accordion */}
        <details style={{ background: 'var(--card-bg, #f8f9fa)', borderRadius: 12, padding: '8px 12px', border: '1px solid var(--border)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', color: 'var(--muted)' }}>
            💡 Need a hint for "{word}"? (School study card)
          </summary>
          <div className="col gap4" style={{ marginTop: 8, fontSize: '0.9rem' }}>
            <div><b>School Definition:</b> {definition}</div>
            <div><b>Example Sentence:</b> <i>"{example}"</i></div>
            {syns && <div><b>Synonyms:</b> {syns}</div>}
            {ants && <div><b>Antonyms:</b> {ants}</div>}
          </div>
        </details>
      </section>
    </div>
  );
}
