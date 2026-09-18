import React, { useState } from 'react';
import { Camera, Upload, Plus, Trash2, Sparkles, Volume2, BookOpen, CheckCircle, FileText, X, AlertCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { aiSpeak, playCorrect, playIncorrect, playPop, fireConfetti } from '../utils/audio';

export function SchoolWordsSection({ onClose }) {
  const { child, addSchoolWords, removeSchoolWord } = useApp();
  const schoolWords = child.schoolWords || [];

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'photo' | 'text' | 'flashcards' | 'spelling'
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Practice state
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingFeedback, setSpellingFeedback] = useState(null);

  // Handle Photo Selection
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    playPop();
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setAiError(null);
    };
    reader.readAsDataURL(file);
  };

  // AI Extraction from Photo using Puter.js Vision AI
  const handleExtractFromPhoto = async () => {
    if (!photoPreview) return;
    setIsAiLoading(true);
    setAiError(null);
    playPop();

    try {
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
        const prompt = `You are an elementary school educator. Look at this worksheet or spelling list and extract all the vocabulary/spelling words.
For each word, return a JSON array of objects with keys:
- "word": string (lowercase)
- "partOfSpeech": string ("noun", "verb", "adjective", etc.)
- "definition": simple kid-friendly definition
- "sentence": example sentence with the word
- "mnemonic": fun memory trick
- "synonyms": array of 1-2 words
- "antonyms": array of 1-2 words

Return ONLY the raw valid JSON array. No explanations, no markdown formatting.`;

        const response = await window.puter.ai.chat(prompt, photoPreview);
        const rawContent = response?.message?.content || String(response || '');
        const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            addSchoolWords(parsed);
            fireConfetti();
            aiSpeak(`Great! Extracted ${parsed.length} school words from your worksheet!`);
            setActiveTab('list');
            setPhotoPreview(null);
            setIsAiLoading(false);
            return;
          }
        }
      }
      throw new Error("Could not automatically parse words. Please enter words in the text tab!");
    } catch (err) {
      console.warn('[AI Vision OCR Error]', err);
      setAiError(err.message || "AI image extraction took too long. Try typing the words below!");
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Organize from Text
  const handleOrganizeTextWords = async () => {
    if (!inputText.trim()) return;
    setIsAiLoading(true);
    setAiError(null);
    playPop();

    const wordsList = inputText
      .split(/[\n,]+/)
      .map(w => w.trim())
      .filter(Boolean);

    if (wordsList.length === 0) {
      setIsAiLoading(false);
      return;
    }

    try {
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
        const prompt = `You are a school teacher. Take these student words: ${wordsList.join(', ')}.
Return ONLY a valid JSON array of objects with keys:
- "word": the exact word
- "partOfSpeech": "noun" | "verb" | "adjective"
- "definition": simple definition for a child
- "sentence": example sentence with the word
- "mnemonic": fun visual memory trick
- "synonyms": array of 1-2 words
- "antonyms": array of 1-2 words
No extra text, no markdown backticks. Just the raw JSON array.`;

        const response = await window.puter.ai.chat(prompt);
        const rawContent = response?.message?.content || String(response || '');
        const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            addSchoolWords(parsed);
            fireConfetti();
            aiSpeak(`Awesome! Organized ${parsed.length} homework words!`);
            setInputText('');
            setActiveTab('list');
            setIsAiLoading(false);
            return;
          }
        }
      }

      // Offline / Simple Fallback
      const simpleWords = wordsList.map(w => ({
        word: w,
        partOfSpeech: 'vocabulary',
        definition: `School study word: ${w}`,
        sentence: `Practice using ${w} in a complete sentence today!`,
        synonyms: [],
        antonyms: [],
        mnemonic: `Remember to spell ${w} carefully!`
      }));
      addSchoolWords(simpleWords);
      fireConfetti();
      aiSpeak(`Added ${simpleWords.length} words to your school bag!`);
      setInputText('');
      setActiveTab('list');
    } catch (err) {
      console.warn('[AI Organize Error]', err);
      setAiError("Could not connect to AI. Saved words directly!");
      const simpleWords = wordsList.map(w => ({
        word: w,
        partOfSpeech: 'vocabulary',
        definition: `School study word: ${w}`,
        sentence: `Practice using ${w} in a complete sentence!`,
        synonyms: [],
        antonyms: []
      }));
      addSchoolWords(simpleWords);
      setActiveTab('list');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Practice Word
  const currentPracticeWord = schoolWords[practiceIndex % Math.max(1, schoolWords.length)];

  const handleSpellingCheck = () => {
    if (!currentPracticeWord) return;
    const isCorrect = spellingInput.trim().toLowerCase() === currentPracticeWord.word.toLowerCase();
    if (isCorrect) {
      setSpellingFeedback('correct');
      playCorrect();
      fireConfetti();
    } else {
      setSpellingFeedback('wrong');
      playIncorrect();
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: '#e0e7ff',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px'
          }}>
            🎒
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
              My School Bag (Homework Words)
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Scan worksheets with Free AI or add weekly spelling words from school!
            </p>
          </div>
        </div>

        {/* Count Badge */}
        <div style={{
          background: '#eff6ff',
          color: '#1d4ed8',
          padding: '6px 14px',
          borderRadius: '99px',
          fontSize: '13px',
          fontWeight: 800
        }}>
          {schoolWords.length} School Words Saved
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'list', label: '📖 Word List', icon: BookOpen },
          { id: 'photo', label: '📸 Upload Worksheet Photo (Free AI)', icon: Camera },
          { id: 'text', label: '✍️ Add / Paste Words', icon: Plus },
          { id: 'flashcards', label: '🃏 School Flashcards', icon: Sparkles, disabled: schoolWords.length === 0 },
          { id: 'spelling', label: '✏️ Spelling Test', icon: FileText, disabled: schoolWords.length === 0 }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => {
                playPop();
                setActiveTab(tab.id);
                setSpellingFeedback(null);
                setSpellingInput('');
                setIsCardFlipped(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                border: isActive ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                background: isActive ? '#eef2ff' : '#ffffff',
                color: isActive ? '#4338ca' : tab.disabled ? '#cbd5e1' : '#475569',
                fontSize: '13px',
                fontWeight: 800,
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: WORD LIST */}
      {activeTab === 'list' && (
        <div>
          {schoolWords.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: '#f8fafc',
              borderRadius: '18px',
              border: '2px dashed #cbd5e1'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📸</div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1e293b', margin: '0 0 6px' }}>
                Your School Bag is Empty
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '400px', margin: '0 auto 16px' }}>
                Snap a photo of your school homework worksheet or type this week's spelling list. Free AI will organize them instantly!
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => { playPop(); setActiveTab('photo'); }}
                  style={{
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  📸 Scan Worksheet Photo
                </button>
                <button
                  onClick={() => { playPop(); setActiveTab('text'); }}
                  style={{
                    background: '#f1f5f9',
                    color: '#1e293b',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  ✍️ Type Words
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px'
            }}>
              {schoolWords.map(w => (
                <div
                  key={w.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '14px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
                          {w.word}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          background: '#e0e7ff',
                          color: '#4338ca',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          {w.partOfSpeech || 'Word'}
                        </span>
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                        {w.definition}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => aiSpeak(w.word)}
                        title="Pronounce Word"
                        style={{
                          background: '#e0f2fe',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px',
                          cursor: 'pointer',
                          color: '#0284c7'
                        }}
                      >
                        <Volume2 size={15} />
                      </button>
                      <button
                        onClick={() => { playPop(); removeSchoolWord(w.id); }}
                        title="Remove Word"
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px',
                          cursor: 'pointer',
                          color: '#dc2626'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {w.sentence && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px',
                      background: '#ffffff',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      fontStyle: 'italic'
                    }}>
                      "{w.sentence}"
                    </div>
                  )}

                  {w.mnemonic && (
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#6366f1', fontWeight: 700 }}>
                      💡 Memory Trick: {w.mnemonic}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PHOTO / FILE UPLOAD */}
      {activeTab === 'photo' && (
        <div style={{
          background: '#f8fafc',
          borderRadius: '18px',
          padding: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
            Scan School Homework Worksheet or Photo
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Upload a photo of your school worksheet, spelling handout, or notebook. Free AI will read and extract the words automatically!
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            id="worksheet-photo-input"
            style={{ display: 'none' }}
          />

          {!photoPreview ? (
            <label
              htmlFor="worksheet-photo-input"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                border: '2px dashed #94a3b8',
                borderRadius: '16px',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📷</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#334155' }}>
                Tap to Take Photo or Choose Worksheet Image
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Supports JPG, PNG, WEBP, or camera capture
              </div>
            </label>
          ) : (
            <div>
              <div style={{
                position: 'relative',
                maxHeight: '260px',
                overflow: 'hidden',
                borderRadius: '14px',
                border: '2px solid #cbd5e1',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <img
                  src={photoPreview}
                  alt="Worksheet Preview"
                  style={{ maxHeight: '260px', maxWidth: '100%', objectFit: 'contain' }}
                />
                <button
                  onClick={() => setPhotoPreview(null)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {aiError && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#991b1b',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '14px'
                }}>
                  {aiError}
                </div>
              )}

              <button
                disabled={isAiLoading}
                onClick={handleExtractFromPhoto}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: isAiLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
                }}
              >
                <Sparkles size={18} />
                {isAiLoading ? 'Scanning with Free AI...' : 'Scan & Extract Words with Free AI 🤖'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TYPE OR PASTE WORDS */}
      {activeTab === 'text' && (
        <div style={{
          background: '#f8fafc',
          borderRadius: '18px',
          padding: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
            Type or Paste This Week's School Words
          </h3>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Enter words separated by commas or lines. Free AI will automatically look up child definitions, sentences, and memory tricks!
          </p>

          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. habitat, adapt, fragile, magnificent"
            style={{
              width: '100%',
              borderRadius: '14px',
              border: '2px solid #cbd5e1',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '14px',
              boxSizing: 'border-box'
            }}
          />

          <button
            disabled={isAiLoading || !inputText.trim()}
            onClick={handleOrganizeTextWords}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 800,
              cursor: isAiLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={18} />
            {isAiLoading ? 'Organizing with Free AI...' : 'Organize with Free AI & Save 🤖'}
          </button>
        </div>
      )}

      {/* TAB 4: SCHOOL FLASHCARDS */}
      {activeTab === 'flashcards' && currentPracticeWord && (
        <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
          <div
            onClick={() => {
              playPop();
              setIsCardFlipped(prev => !prev);
            }}
            style={{
              minHeight: '260px',
              borderRadius: '24px',
              padding: '24px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '16px',
              transition: 'transform 0.2s ease'
            }}
          >
            {!isCardFlipped ? (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>📝</div>
                <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
                  {currentPracticeWord.word}
                </h2>
                <span style={{
                  background: '#e0e7ff',
                  color: '#4338ca',
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '99px'
                }}>
                  {currentPracticeWord.partOfSpeech || 'Word'}
                </span>
                <p style={{ marginTop: '14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                  Tap card to reveal definition & sentence 👆
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>
                  {currentPracticeWord.definition}
                </h3>
                {currentPracticeWord.sentence && (
                  <p style={{ fontSize: '14px', color: '#475569', fontStyle: 'italic', margin: '0 0 10px' }}>
                    "{currentPracticeWord.sentence}"
                  </p>
                )}
                {currentPracticeWord.mnemonic && (
                  <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 700 }}>
                    💡 {currentPracticeWord.mnemonic}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                playPop();
                setPracticeIndex(prev => Math.max(0, prev - 1));
                setIsCardFlipped(false);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                cursor: 'pointer',
                fontWeight: 800
              }}
            >
              ◀ Previous
            </button>
            <button
              onClick={() => aiSpeak(currentPracticeWord.word)}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                background: '#e0f2fe',
                color: '#0284c7',
                cursor: 'pointer',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Volume2 size={16} /> Listen with AI
            </button>
            <button
              onClick={() => {
                playPop();
                setPracticeIndex(prev => prev + 1);
                setIsCardFlipped(false);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 800
              }}
            >
              Next ▶
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: SPELLING TEST */}
      {activeTab === 'spelling' && currentPracticeWord && (
        <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎧</div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
              Listen & Spell the Word
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
              Tap the button to hear the word, then type the correct spelling!
            </p>

            <button
              onClick={() => aiSpeak(`Spell the word: ${currentPracticeWord.word}`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#e0f2fe',
                color: '#0284c7',
                border: 'none',
                borderRadius: '99px',
                padding: '10px 20px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              <Volume2 size={18} /> Listen to Word
            </button>

            <input
              type="text"
              value={spellingInput}
              onChange={(e) => setSpellingInput(e.target.value)}
              placeholder="Type spelling here..."
              style={{
                width: '100%',
                borderRadius: '14px',
                border: spellingFeedback === 'correct'
                  ? '2px solid #10b981'
                  : spellingFeedback === 'wrong'
                  ? '2px solid #ef4444'
                  : '2px solid #cbd5e1',
                padding: '14px',
                fontSize: '18px',
                fontWeight: 800,
                textAlign: 'center',
                color: '#0f172a',
                marginBottom: '14px',
                boxSizing: 'border-box'
              }}
            />

            {spellingFeedback === 'correct' && (
              <div style={{ color: '#10b981', fontWeight: 800, fontSize: '15px', marginBottom: '12px' }}>
                🎉 Superstar! Perfect Spelling!
              </div>
            )}
            {spellingFeedback === 'wrong' && (
              <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
                Not quite! Word: {currentPracticeWord.word}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSpellingCheck}
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '12px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Check Spelling ✓
              </button>
              <button
                onClick={() => {
                  playPop();
                  setPracticeIndex(prev => prev + 1);
                  setSpellingInput('');
                  setSpellingFeedback(null);
                }}
                style={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '12px 18px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Next Word →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
