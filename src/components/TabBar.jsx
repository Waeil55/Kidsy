import React from 'react';
import { Map, Gamepad2, BarChart2, Smile } from 'lucide-react';
import { playPop } from '../utils/audio';

export default function TabBar({
  activeTab,
  onSelectTab
}) {
  const tabs = [
    { id: 'path', label: 'PATH', icon: Map, color: 'text-duo-green' },
    { id: 'practice', label: 'PRACTICE', icon: Gamepad2, color: 'text-duo-blue' },
    { id: 'progress', label: 'PROGRESS', icon: BarChart2, color: 'text-duo-orange' },
    { id: 'mascot', label: 'MASCOT', icon: Smile, color: 'text-duo-purple' },
  ];

  return (
    <nav className="shrink-0 z-40 bg-white border-t-2 border-duo-gray-100 px-3 py-1.5 pb-safe select-none">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playPop();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                isActive 
                  ? 'text-duo-blue border-2 border-duo-blueLight bg-duo-blueLight/50' 
                  : 'text-duo-gray-400 hover:text-duo-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-fredoka font-bold tracking-wider mt-0.5 ${
                isActive ? 'text-duo-blueDark' : 'text-duo-gray-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
