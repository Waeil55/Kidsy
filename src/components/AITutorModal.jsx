import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Send, 
  Loader2, 
  Sparkles 
} from 'lucide-react';
import { speakText, playPop, createSpeechRecognizer } from '../utils/audio';
import { getGeminiApiKey } from '../utils/storage';

export default function AITutorModal({
  isOpen,
  onClose,
  currentItem,
  activeTab,
  activeSubject
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef(null);

  // Initialize or update conversation context when opened
  useEffect(() => {
    if (isOpen && currentItem) {
      const initGreeting = getInitialGreeting(currentItem, activeTab, activeSubject);
      setMessages([
        {
          role: 'model',
          text: initGreeting,
          contextWord: currentItem.word
        }
      ]);
      if (autoSpeak) {
        speakText(initGreeting.replace(/\*/g, ''));
      }
    }
  }, [isOpen, currentItem?.id, activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function getInitialGreeting(item, tab, subject) {
    if (subject === 'math') {
      return `Hi superstar! Let's solve **${item.displayTitle || item.word}** together! What do you think is the trick here?`;
    }
    if (subject === 'science') {
      return `Hello young scientist! We are discovering **${item.displayTitle || item.word}** (${item.category}). What questions do you have about it?`;
    }
    if (tab === 'sentences') {
      return `Stuck on the sentence puzzle for **${item.word}**? I can give you a sneaky clue!`;
    }
    if (tab === 'spell') {
      return `Need a fun memory rhyme to spell **${item.word}**? Let me know!`;
    }
    return `Hi friend! Let's talk about **${item.word}**! Did you know: *${item.funFact || item.definition}*?`;
  }

  const handleToggleMic = () => {
    playPop();
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsRecording(false);
        setInputText(transcript);
      },
      () => setIsRecording(false),
      () => setIsRecording(false)
    );

    if (recognizer) {
      try {
        setIsRecording(true);
        recognizer.start();
      } catch (e) {
        setIsRecording(false);
      }
    }
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    playPop();

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      // Offline smart friendly responses
      setTimeout(() => {
        let reply = "Great question! Keep practicing and thinking carefully. You are doing amazing!";
        if (text.toLowerCase().includes("hint") || text.toLowerCase().includes("help")) {
          reply = currentItem?.hint || `Clue: Think about ${currentItem?.definition}!`;
        } else if (text.toLowerCase().includes("sentence") || text.toLowerCase().includes("example")) {
          reply = currentItem?.sentences?.[0]?.replace('_________', currentItem.word) || `Here is one: ${currentItem?.definition}`;
        } else if (text.toLowerCase().includes("fact") || text.toLowerCase().includes("why")) {
          reply = currentItem?.funFact || `Because ${currentItem?.definition}!`;
        } else {
          reply = `That is super curious! In Grade 3, remember that **${currentItem?.word}** means ${currentItem?.definition}. (Parents can also enter a Gemini API Key in Parent Studio for unlimited live AI conversations!)`;
        }

        const updated = [...newMessages, { role: 'model', text: reply }];
        setMessages(updated);
        setIsLoading(false);
        if (autoSpeak) speakText(reply.replace(/\*/g, ''));
      }, 700);
      return;
    }

    // Call Gemini API
    try {
      const sysPrompt = `You are a super fun, warm, high-energy, encouraging 3rd-grade tutor named MerolaApp. The student is practicing "${currentItem?.word}" in subject "${activeSubject}" with definition "${currentItem?.definition}". Keep your answers to 1-2 cheerful, simple sentences. Praise them. Format important words with **bold**.`;

      const contentsPayload = newMessages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contentsPayload,
          systemInstruction: { parts: [{ text: sysPrompt }] }
        })
      });

      const data = await response.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "You are doing great! Keep shining!";

      const updated = [...newMessages, { role: 'model', text: botReply }];
      setMessages(updated);
      if (autoSpeak) speakText(botReply.replace(/\*/g, ''));
    } catch (err) {
      const fallback = `I am here to help you learn **${currentItem?.word}**! Remember: ${currentItem?.definition}`;
      setMessages([...newMessages, { role: 'model', text: fallback }]);
      if (autoSpeak) speakText(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-50 w-full h-[88vh] sm:h-[82vh] sm:max-w-md sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden slide-up sm:zoom-in rounded-t-3xl border border-slate-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rosebloom-500 text-white p-4 sm:p-5 flex justify-between items-center shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight flex items-center gap-1.5">
                <span>AI Super Tutor</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </h3>
              <p className="text-[11px] font-bold text-purple-100 uppercase tracking-wider">
                Focus: {currentItem?.displayTitle || currentItem?.word}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { playPop(); setAutoSpeak(!autoSpeak); }}
              className={`p-2 rounded-xl transition-all ${
                autoSpeak ? 'bg-white text-purple-700 shadow-sm' : 'bg-white/20 text-white'
              }`}
              title={autoSpeak ? "Auto-speak enabled" : "Auto-speak muted"}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { playPop(); onClose(); }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-slate-100">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} slide-up`}
              >
                <div
                  className={`max-w-[85%] p-3.5 sm:p-4 rounded-3xl text-sm sm:text-base leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-tr-xs font-semibold'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs font-medium'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-purple-900">$1</strong>')
                  }}
                />
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start slide-up">
              <div className="bg-white border border-slate-200 text-slate-500 rounded-3xl rounded-tl-xs p-3.5 flex items-center gap-2 text-xs font-bold">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>Super Tutor is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Message Input Controls */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex gap-2 items-center shrink-0">
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-3 rounded-2xl transition-colors btn-press ${
              isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:text-purple-600'
            }`}
            title="Speak to Tutor"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            placeholder="Ask your tutor anything..."
            className="flex-1 bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100 rounded-2xl px-4 py-3 text-sm sm:text-base font-bold outline-none transition-all"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-md disabled:opacity-40 btn-press transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
