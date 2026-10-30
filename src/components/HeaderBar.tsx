import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Activity, QrCode, User, ChevronDown, Check } from 'lucide-react';
import { UserRole } from '../types';

export const HeaderBar: React.FC = () => {
  const { mode, setMode, userRole, setUserRole, setShowQrModal } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'child', label: '어린이 탐구자', desc: '감감이와 친구처럼 대화하고 관찰' },
    { id: 'parent', label: '학부모 집사', desc: '온실 관리 및 아이와 함께 일기 지도' },
  ];

  return (
    <header className="relative z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-sm font-bold text-sm">
            감
          </div>
          <div className="leading-tight">
            <span className="font-bold text-sm text-stone-900 tracking-tight block">
              홍시 온실 KIT
            </span>
            <span className="text-[10px] text-stone-500 font-mono">v2.4 IoT Live</span>
          </div>
        </div>

        {/* Mode Switcher Segmented Control */}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/60 shadow-inner">
          <button
            onClick={() => setMode('education')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[32px] ${
              mode === 'education'
                ? 'bg-white text-orange-600 shadow-sm border border-stone-200/50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>교육용</span>
          </button>
          <button
            onClick={() => setMode('hobbyist')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[32px] ${
              mode === 'hobbyist'
                ? 'bg-white text-emerald-700 shadow-sm border border-stone-200/50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>취미용</span>
          </button>
        </div>

        {/* Action Zone: QR Scanner & User Profile Switcher */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowQrModal(true)}
            className="p-1.5 rounded-lg text-stone-600 hover:text-orange-600 hover:bg-stone-100 transition-colors"
            title="키트 QR코드 재스캔"
          >
            <QrCode className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1 pl-1.5 pr-1 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/70 border border-stone-200/60 transition-colors text-xs font-medium text-stone-700"
            >
              <User className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden xs:inline text-[11px] truncate max-w-[54px]">
                {userRole === 'child' ? '어린이' : '학부모'}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {/* Role Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-stone-200 p-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-stone-100 mb-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    계정 역할 전환
                  </span>
                  <span className="text-xs text-stone-600">원터치로 가족 간 전환 가능</span>
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setUserRole(r.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-start justify-between px-2.5 py-2 rounded-lg text-left transition-colors text-xs ${
                      userRole === r.id ? 'bg-orange-50 text-orange-950 font-semibold' : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-[10px] text-stone-400 leading-tight mt-0.5">{r.desc}</div>
                    </div>
                    {userRole === r.id && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
