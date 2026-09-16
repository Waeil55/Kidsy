import React, { useState } from 'react';
import { Camera, Upload, PlusCircle, FileText, Key, X, Lock, Unlock } from 'lucide-react';
import { playPop } from '../utils/audio';
import ParentGate from './parent/ParentGate';
import CameraScanner from './parent/CameraScanner';
import FileUploadTab from './parent/FileUploadTab';
import ManualCardForm from './parent/ManualCardForm';
import CardManager from './parent/CardManager';
import ParentSettings from './parent/ParentSettings';
import { saveStoredCustomCards } from '../utils/storage';

export default function ParentStudio({
  isOpen,
  onClose,
  customCards,
  onUpdateCustomCards
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload' | 'manual' | 'manage' | 'settings'

  if (!isOpen) return null;

  const handleAddCards = (newCards) => {
    const updated = [...customCards, ...newCards];
    onUpdateCustomCards(updated);
    saveStoredCustomCards(updated);
  };

  const handleAddSingleCard = (newCard) => {
    const updated = [...customCards, newCard];
    onUpdateCustomCards(updated);
    saveStoredCustomCards(updated);
  };

  const handleDeleteCard = (id) => {
    const updated = customCards.filter(c => c.id !== id);
    onUpdateCustomCards(updated);
    saveStoredCustomCards(updated);
  };

  const handleAddSamplePack = () => {
    const samplePack = [
      {
        id: `bonus-${Date.now()}-1`,
        subject: "english",
        category: "Character Words",
        word: "determined",
        displayTitle: "Determined",
        definition: "Making a firm decision and not letting anything stop you from succeeding.",
        sentences: ["She was _________ to finish reading her entire chapter book today."],
        image: "🎯",
        hint: "Never giving up!"
      },
      {
        id: `bonus-${Date.now()}-2`,
        subject: "math",
        category: "Geometry",
        word: "quadrilateral",
        displayTitle: "Quadrilateral",
        definition: "Any two-dimensional closed shape that has exactly four straight sides and four corners.",
        sentences: ["A rectangle, square, and trapezoid are all types of a _________."],
        image: "🔷",
        hint: "'Quad' means four!"
      },
      {
        id: `bonus-${Date.now()}-3`,
        subject: "science",
        category: "Earth Science",
        word: "erosion",
        displayTitle: "Erosion",
        definition: "The natural process where rocks and soil are worn away and moved by water, wind, or ice.",
        sentences: ["The crashing ocean waves caused coastal _________ along the cliff."],
        image: "🌊",
        hint: "When wind and water carve away rocks over time."
      }
    ];
    handleAddCards(samplePack);
    alert("Added 3 Grade 3 bonus cards!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 slide-up">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-tealsoft-700 via-tealsoft-600 to-emerald-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              {isUnlocked ? <Unlock className="w-5 h-5 text-emerald-300" /> : <Lock className="w-5 h-5 text-yellow-300" />}
            </div>
            <div>
              <h2 className="font-extrabold text-lg leading-tight flex items-center gap-1.5">
                <span>Parent & Teacher Studio</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase">Control</span>
              </h2>
              <p className="text-xs text-tealsoft-100 font-medium">
                Snap homework photos, upload worksheets, or customize decks
              </p>
            </div>
          </div>

          <button
            onClick={() => { playPop(); onClose(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Gate or Content */}
        {!isUnlocked ? (
          <ParentGate onUnlock={() => setIsUnlocked(true)} />
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/90 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => { playPop(); setActiveTab('camera'); }}
                className={`flex-1 min-w-[110px] py-3 px-3 text-xs font-black flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'camera' ? 'border-tealsoft-600 text-tealsoft-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Snap Camera</span>
              </button>

              <button
                onClick={() => { playPop(); setActiveTab('upload'); }}
                className={`flex-1 min-w-[110px] py-3 px-3 text-xs font-black flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'upload' ? 'border-tealsoft-600 text-tealsoft-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </button>

              <button
                onClick={() => { playPop(); setActiveTab('manual'); }}
                className={`flex-1 min-w-[110px] py-3 px-3 text-xs font-black flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'manual' ? 'border-tealsoft-600 text-tealsoft-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Card</span>
              </button>

              <button
                onClick={() => { playPop(); setActiveTab('manage'); }}
                className={`flex-1 min-w-[110px] py-3 px-3 text-xs font-black flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'manage' ? 'border-tealsoft-600 text-tealsoft-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Manage ({customCards.length})</span>
              </button>

              <button
                onClick={() => { playPop(); setActiveTab('settings'); }}
                className={`flex-1 min-w-[100px] py-3 px-3 text-xs font-black flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'settings' ? 'border-tealsoft-600 text-tealsoft-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>

            {/* Tab View */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeTab === 'camera' && <CameraScanner onAddCards={handleAddCards} />}
              {activeTab === 'upload' && <FileUploadTab onAddCards={handleAddCards} />}
              {activeTab === 'manual' && <ManualCardForm onAddCard={handleAddSingleCard} />}
              {activeTab === 'manage' && (
                <CardManager 
                  customCards={customCards} 
                  onDeleteCard={handleDeleteCard} 
                  onAddSamplePack={handleAddSamplePack} 
                />
              )}
              {activeTab === 'settings' && <ParentSettings />}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
