import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, MessageSquareQuote, BookOpen, Users } from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, mode, diaries } = useApp();

  const tabs = [
    {
      id: 'home' as const,
      label: '홈',
      icon: Home,
    },
    {
      id: 'lab' as const,
      label: mode === 'education' ? '감감이 대화' : '센서 관제실',
      icon: MessageSquareQuote,
    },
    {
      id: 'diary' as const,
      label: '관찰 일기',
      icon: BookOpen,
      badge: diaries.length > 0 ? diaries.length : undefined,
    },
    {
      id: 'community' as const,
      label: '커뮤니티',
      icon: Users,
    },
  ];

  return (
    <nav className="relative z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-1.5 pb-2">
      <div className="grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl transition-all ${
                isActive
                  ? mode === 'education'
                    ? 'text-orange-600 font-semibold'
                    : 'text-emerald-700 font-semibold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white font-mono text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
