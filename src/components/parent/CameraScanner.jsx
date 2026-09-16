import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { playPop, playCorrect } from '../../utils/audio';
import { getGeminiApiKey } from '../../utils/storage';

export default function CameraScanner({ onAddCards }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedCards, setExtractedCards] = useState([]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError("");
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError("Camera permission denied or camera not available. You can also upload a photo under 'Upload File'!");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    playPop();
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setExtractedCards([]);
    startCamera();
  };

  const extractFromImage = async (base64DataUrl) => {
    setIsExtracting(true);
    playPop();
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      setTimeout(() => {
        const sampleCards = [
          {
            id: `custom-${Date.now()}-1`,
            subject: "english",
            category: "Worksheet Vocab",
            word: "explore",
            displayTitle: "Explore",
            definition: "To search or travel through an unfamiliar area in order to learn about it.",
            sentences: ["Astronauts continue to _________ outer space.", "We love to _________ new hiking trails."],
            image: "🧭",
            imageUrl: base64DataUrl,
            hint: "To travel and discover new things!"
          },
          {
            id: `custom-${Date.now()}-2`,
            subject: "science",
            category: "Science Notes",
            word: "evaporation",
            displayTitle: "Evaporation",
            definition: "The process of liquid water turning into water vapor gas when heated by the sun.",
            sentences: ["The puddle dried up quickly due to _________.", "Heat speeds up _________."],
            image: "☀️",
            imageUrl: base64DataUrl,
            hint: "When sunbeams dry up a water puddle!"
          }
        ];
        setExtractedCards(sampleCards);
        setIsExtracting(false);
      }, 900);
      return;
    }

    try {
      const pureBase64 = base64DataUrl.split(',')[1];
      const prompt = `Analyze this homework or textbook worksheet photo. Extract all vocabulary words, definitions, math questions, or science facts into a JSON array for 3rd grade.
Respond ONLY with a JSON array without markdown formatting:
[
  {
    "word": "target word or answer",
    "displayTitle": "Word or Question",
    "subject": "english" or "math" or "science",
    "category": "Topic Name",
    "definition": "Simple 3rd grade explanation",
    "sentence": "Sentence with blank marked by _________",
    "image": "single relevant emoji",
    "hint": "helpful clue"
  }
]`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: pureBase64 } }
            ]
          }]
        })
      });

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const formatted = parsed.map((item, idx) => ({
        id: `custom-${Date.now()}-${idx}`,
        subject: item.subject || "english",
        category: item.category || "Worksheet Scan",
        word: item.word,
        displayTitle: item.displayTitle || item.word,
        definition: item.definition,
        sentences: [item.sentence || `The answer is _________.`],
        image: item.image || "🌟",
        imageUrl: base64DataUrl,
        hint: item.hint || `Clue: ${item.definition}`
      }));

      setExtractedCards(formatted);
    } catch (err) {
      console.error("Camera OCR extraction error:", err);
      alert("Could not automatically extract. You can add the card manually using the snapped photo!");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveAll = () => {
    playCorrect();
    onAddCards(extractedCards);
    setExtractedCards([]);
    setCapturedImage(null);
    alert(`Successfully added ${extractedCards.length} cards to your deck!`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3.5 bg-tealsoft-50/80 rounded-2xl border border-tealsoft-200 text-tealsoft-900 text-xs">
        <p className="font-extrabold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-tealsoft-600" />
          Live Camera Homework Scanner
        </p>
        <p className="mt-0.5 text-slate-600 font-medium leading-relaxed">
          Align your textbook page or homework flashcard in front of the camera and snap a photo to extract cards!
        </p>
      </div>

      {cameraError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Camera / Photo Canvas Viewport */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-200 shadow-inner">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured worksheet" className="w-full h-full object-contain" />
        ) : cameraStream ? (
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
        ) : (
          <div className="text-center p-6 text-slate-400">
            <Camera className="w-12 h-12 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold">Camera is idle</p>
            <p className="text-xs">Click Start Camera below to begin scanning</p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        {!capturedImage ? (
          !cameraStream ? (
            <button
              onClick={startCamera}
              className="flex-1 py-3 px-4 rounded-xl bg-tealsoft-600 hover:bg-tealsoft-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 btn-press"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          ) : (
            <button
              onClick={capturePhoto}
              className="flex-1 py-3 px-4 rounded-xl bg-rosebloom-500 hover:bg-rosebloom-600 text-white font-black text-sm flex items-center justify-center gap-2 btn-press shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Photo!</span>
            </button>
          )
        ) : (
          <>
            <button
              onClick={retakePhoto}
              className="py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 btn-press"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake</span>
            </button>

            <button
              onClick={() => extractFromImage(capturedImage)}
              disabled={isExtracting}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-tealsoft-600 to-emerald-600 hover:from-tealsoft-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md btn-press"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isExtracting ? "Extracting Cards..." : "Extract Cards with AI"}</span>
            </button>
          </>
        )}
      </div>

      {/* Extracted Cards Preview */}
      {extractedCards.length > 0 && (
        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 pop">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Extracted {extractedCards.length} Cards</span>
            </h4>
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm btn-press"
            >
              Save All to Deck
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {extractedCards.map((card, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 capitalize font-extrabold">{card.displayTitle || card.word}</strong>
                  <span className="ml-2 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">{card.subject}</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{card.definition}</p>
                </div>
                <span className="text-xl">{card.image || "🌟"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
