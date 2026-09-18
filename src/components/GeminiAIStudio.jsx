import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  Layers,
  Lightbulb,
  FileText,
  Puzzle,
  Edit3,
  BarChart3,
  Award,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';
import { playPop, playCorrect, fireConfetti, speakText } from '../utils/audio';

export function GeminiAIStudio({ onClose, initialTool = 'planner' }) {
  const [activeTool, setActiveTool] = useState(initialTool); // 'planner' | 'materials' | 'special' | 'paperwork' | 'ideas' | 'differentiate'
  const [grade, setGrade] = useState('3');
  const [topic, setTopic] = useState('Week 5 Vocabulary (Oppose, Snide, Heap, Diverse, Origin)');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const tools = [
    {
      id: 'planner',
      title: '1. Plan Lessons',
      icon: Layers,
      color: '#3b82f6',
      bg: '#eff6ff',
      desc: 'Create structured lesson objectives, warm-ups, core activities, and exit tickets.'
    },
    {
      id: 'materials',
      title: '2. Create Materials',
      icon: Edit3,
      color: '#ec4899',
      bg: '#fdf2f8',
      desc: 'Generate worksheets, mnemonic stories, flashcards, and interactive puzzles.'
    },
    {
      id: 'special',
      title: '3. Special Needs Adaptor',
      icon: Puzzle,
      color: '#10b981',
      bg: '#ecfdf5',
      desc: 'Simplify multi-step instructions, create visual scaffolds, and sensory-friendly tasks.'
    },
    {
      id: 'paperwork',
      title: '4. Progress & Reports',
      icon: FileText,
      color: '#f59e0b',
      bg: '#fffbeb',
      desc: 'Draft mastery celebration certificates, teacher reflections, and parent updates.'
    },
    {
      id: 'ideas',
      title: '5. 10 Instant Ideas',
      icon: Lightbulb,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      desc: 'Need creative inspiration? Generate 10 fun, hands-on learning games right now.'
    },
    {
      id: 'differentiate',
      title: '6. Differentiate (3 Tiers)',
      icon: BarChart3,
      color: '#06b6d4',
      bg: '#ecfeff',
      desc: 'Generate Easy 🟢, Medium 🟡, and Challenging 🔴 tiers for any topic.'
    }
  ];

  const handleGenerate = () => {
    playPop();
    setIsGenerating(true);
    setGeneratedResult(null);

    setTimeout(() => {
      setIsGenerating(false);
      fireConfetti(true);
      playCorrect();

      if (activeTool === 'planner') {
        setGeneratedResult({
          title: `Comprehensive Lesson Plan: ${topic} (Grade ${grade})`,
          badge: '📋 Verified Curriculum Plan',
          sections: [
            {
              heading: '🎯 Learning Objectives',
              content: `• Student will understand, define, and correctly use target vocabulary in context sentences.\n• Student will identify at least 2 synonyms and 1 antonym for each word.\n• Student will apply words to real-world scenarios through interactive roleplay.`
            },
            {
              heading: '🚀 5-Minute Warm-Up (Engage)',
              content: `Mascot Riddle: "I am a verb that means disagreeing with an idea. My name sounds like opposite! What word am I?" (Answer: OPPOSE). Have the student show thumbs-down to oppose a silly idea like "having school on Sunday!"`
            },
            {
              heading: '💡 15-Minute Core Exploration (Teach)',
              content: `1. Story in Action: Read the story aloud with audio speech synthesis.\n2. Mnemonic Anchor: Introduce the visual superpower trick (e.g. "SN in Snide for Sneaky and Nasty!").\n3. Flashcard Flip: Have student practice 3D flip card with pronunciation.`
            },
            {
              heading: '🏁 10-Minute Mastery & Exit Ticket',
              content: `Interactive 4-choice question board. Student completes the 70-question marathon milestone with zero penalty errors.`
            }
          ]
        });
      } else if (activeTool === 'materials') {
        setGeneratedResult({
          title: `Creative Teaching Materials & Story: ${topic}`,
          badge: '✏️ Ready-to-Use Activities',
          sections: [
            {
              heading: '📖 Mnemonic Adventure Story: "The Mystery of the Leaf Heap"',
              content: `One crisp autumn morning, detective Leo and his brave puppy Pip ran into the backyard. In the center of the lawn sat a giant, fluffy HEAP of colorful leaves. Leo proposed jumping right in, but Pip opposed the idea because he heard a tiny squeak! Inside the diverse pile of oak and maple leaves was a baby bunny looking for its burrow origin. Leo gave no snide remarks—instead, he helped the bunny find warm clover!`
            },
            {
              heading: '🧩 Printable Rhyme Worksheet',
              content: `Fill in the missing words:\n1. Dad doesn't like sand, so he will __________ mom's idea to go to the beach. [oppose]\n2. Instead of polite words, the bully gave a __________ giggle. [snide]\n3. Laundry lay in a messy __________ on the bedroom rug. [heap]\n4. The classroom is a __________ community with friends from all over the world. [diverse]`
            }
          ]
        });
      } else if (activeTool === 'special') {
        setGeneratedResult({
          title: `Sensory & Special Needs Adaptive Guide: ${topic}`,
          badge: '🧩 Universal Design for Learning (UDL)',
          sections: [
            {
              heading: '✨ Step-by-Step Visual Simplification',
              content: `1. One Concept at a Time: Introduce only ONE target word per study chunk (5 minutes max).\n2. Color-Coded Cues: Use Green for positive words (Diverse, Kind), Red for opposing ideas (Oppose), and Yellow for caution.\n3. Tactile Multi-Sensory: Have the student trace letter shapes on their desk while repeating the spoken audio sound.`
            },
            {
              heading: '🔊 Auditory & Gentle Feedback Scaffolding',
              content: `• Always provide text-to-speech so decoding difficulties never block conceptual comprehension.\n• In case of errors: Avoid loud failure buzzers. Use gentle neutral cues and immediate AI hints (50/50 strikeout).`
            }
          ]
        });
      } else if (activeTool === 'paperwork') {
        setGeneratedResult({
          title: `Official Learning Mastery Certificate & Progress Report`,
          badge: '📁 Printable Achievement Record',
          sections: [
            {
              heading: '🏆 Star Explorer Certificate of Excellence',
              content: `This certifies that EXPLORER has successfully completed the Curriculum Quest in Grade ${grade} on the topic of "${topic}".\nDemonstrating outstanding effort, critical thinking, and mastery of key vocabulary and concepts.\n\nDate: ${new Date().toLocaleDateString()} · Certified by: Gemini AI & MerolaApp Teacher Hub`
            },
            {
              heading: '📝 Parent Summary Note',
              content: `Great news! Your child spent quality active learning time mastering ${topic}. They maintained high focus, completed interactive practice challenges, and strengthened their verbal vocabulary.`
            }
          ]
        });
      } else if (activeTool === 'ideas') {
        setGeneratedResult({
          title: `10 Creative & Fun Hands-On Learning Games: ${topic}`,
          badge: '💡 10 Instant Ideas',
          sections: [
            {
              heading: '🎲 Active Movement & Roleplay Games',
              content: `1. Act It Out: Student acts out "oppose" by standing like a superhero shield, or "heap" by curling into a ball!\n2. Scavenger Word Hunt: Hide 4 flashcards around the room; student hunts and reads each word aloud.\n3. Flashcard Speed Run: 15-second timed challenge where student taps matching picture before clock runs out.\n4. Secret Word Detective: Give 3 clues about the word without saying it; child guesses the mystery word.`
            },
            {
              heading: '🎨 Creative & Social Games',
              content: `5. Comic Strip Creator: Draw a 3-panel comic where characters use the word.\n6. The Silly Sentence Challenge: Make the most ridiculous sentence possible using target words.\n7. Rhyme Battle: Take turns finding rhyming words.\n8. Word Sculptor: Mold the first letter of the target word using modeling clay.\n9. Voice Changer: Pronounce words using robot voice, whispering mouse voice, and opera voice.\n10. Unboxing Celebration: Unlock their requested gift prize after reaching 70 correct answers!`
            }
          ]
        });
      } else if (activeTool === 'differentiate') {
        setGeneratedResult({
          title: `3-Tier Differentiated Challenge Ladder: ${topic}`,
          badge: '📊 Multi-Level Scaffolding',
          sections: [
            {
              heading: '🟢 Tier 1: Foundation (Easy / Support)',
              content: `• Question: Which picture shows a "heap"? [Picture of messy pile vs single block]\n• Clue: Heap means a big pile of stuff thrown together!\n• Choices: 2 visual choices with audio narration.`
            },
            {
              heading: '🟡 Tier 2: Core Mastery (Grade Level)',
              content: `• Question: Complete the sentence: "Dad doesn't like sand, so he will _________ mom's idea to go to the beach."\n• Choices: A) oppose  B) agree  C) snide  D) diverse\n• Requires understanding of context and definition.`
            },
            {
              heading: '🔴 Tier 3: Challenge Explorer (Advanced)',
              content: `• Question: "Write or speak an original argument where a city council opposes building a noisy highway near a quiet library."\n• Requires synthesizing the definition of "oppose" and justifying opinions with logical reasons.`
            }
          ]
        });
      }
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    const text = `${generatedResult.title}\n\n` + generatedResult.sections.map((s) => `${s.heading}\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    playCorrect();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakAll = () => {
    if (!generatedResult) return;
    const textToSpeak = generatedResult.sections.map((s) => `${s.heading}. ${s.content}`).join('. ');
    speakText(textToSpeak);
  };

  return (
    <div className="modal" style={{ zIndex: 120 }}>
      <div className="modalPanel" style={{ maxWidth: '680px', maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Header with Gemini Robot Mascot */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Cute Gemini Robot Avatar */}
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 6px 18px rgba(59, 130, 246, 0.35)',
                color: '#ffffff',
                fontSize: '28px'
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '99px', fontSize: '10.5px', fontWeight: 900 }}>
                <Sparkles size={12} />
                <span>GEMINI AI ASSISTANT</span>
              </div>
              <h2 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                AI Studio for Teaching & Learning
              </h2>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 650 }}>
                Inspired by modern pedagogy · Empowering parents, teachers & kids
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: 0,
              background: '#f1f5f9',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: '#475569',
              fontWeight: 900
            }}
          >
            ✕
          </button>
        </div>

        {/* 6 AI Tools Grid Switcher (Matching Reference Screenshot 2) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
          {tools.map((t) => {
            const isCurrent = activeTool === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => {
                  playPop();
                  setActiveTool(t.id);
                  setGeneratedResult(null);
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: '16px',
                  border: isCurrent ? `2px solid ${t.color}` : '1.5px solid #e2e8f0',
                  background: isCurrent ? t.bg : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isCurrent ? `0 4px 12px ${t.color}25` : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '10px',
                    background: isCurrent ? t.color : '#f1f5f9',
                    color: isCurrent ? '#ffffff' : t.color,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a' }}>{t.title}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 650, lineHeight: 1.2 }}>
                    {t.desc.slice(0, 36)}...
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Configuration Controls */}
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '12px 14px', border: '1.5px solid #e2e8f0', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '130px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 850, color: '#475569', marginBottom: '4px' }}>
                Grade Level:
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                <option value="K">Kindergarten (Grade K)</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3 (Week 5 Focus)</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
              </select>
            </div>

            <div style={{ flex: 2, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 850, color: '#475569', marginBottom: '4px' }}>
                Topic / Subject:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Week 5 Vocabulary, Fractions, Solar System..."
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 650,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="glossyPillBtn"
              style={{
                marginTop: '18px',
                padding: '10px 18px',
                fontSize: '12.5px',
                whiteSpace: 'nowrap'
              }}
            >
              <Sparkles size={14} />
              <span>{isGenerating ? 'Gemini Thinking…' : 'Generate with Gemini'}</span>
            </button>
          </div>
        </div>

        {/* AI Output Card */}
        {generatedResult && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '2px solid #bfdbfe',
              padding: '16px',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.12)',
              marginBottom: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 900, background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '6px' }}>
                  {generatedResult.badge}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                  {generatedResult.title}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={handleSpeakAll}
                  style={{
                    background: '#eff6ff',
                    border: '1.5px solid #bfdbfe',
                    color: '#1d4ed8',
                    borderRadius: '10px',
                    padding: '6px 10px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Read Aloud"
                >
                  <Volume2 size={13} /> Listen
                </button>

                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? '#ecfdf5' : '#f8fafc',
                    border: `1.5px solid ${copied ? '#10b981' : '#cbd5e1'}`,
                    color: copied ? '#047857' : '#475569',
                    borderRadius: '10px',
                    padding: '6px 10px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {generatedResult.sections.map((sec, idx) => (
                <div key={idx} style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}>
                    {sec.heading}
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.45, whiteSpace: 'pre-line' }}>
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pedagogical Guidance Philosophy Banner (Screenshot 2 Bottom) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            borderRadius: '14px',
            padding: '10px 14px',
            border: '1.5px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div style={{ fontSize: '22px' }}>🌱</div>
          <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 700, lineHeight: 1.35 }}>
            <strong>The Teacher’s Advantage:</strong> AI is your supercharged assistant that helps you work smarter. The educator and parent remain the ones who truly understand and inspire the child.
          </div>
        </div>
      </div>
    </div>
  );
}
