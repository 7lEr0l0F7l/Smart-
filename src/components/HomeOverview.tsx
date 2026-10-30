import React from 'react';
import { useApp } from '../context/AppContext';
import { GamgamiCharacter } from './GamgamiCharacter';
import { getPersimmonStageLabel, PersimmonStage } from '../types';
import {
  Thermometer,
  Droplets,
  Sun,
  Camera,
  Sparkles,
  Activity,
  ArrowRight,
  BookOpen,
  Utensils,
  BellRing,
  ChevronRight,
} from 'lucide-react';

export const HomeOverview: React.FC = () => {
  const {
    activePersimmon,
    setActivePersimmonId,
    sensorData,
    mode,
    setMode,
    setActiveTab,
    diaries,
    communityPosts,
    setShowQrModal,
  } = useApp();

  const featuredRecipe = communityPosts.find((p) => p.category === 'recipe') || communityPosts[0];

  return (
    <div className="space-y-4 pb-4">
      {/* Hero Kit Banner with Real Hardware/Simulator Status */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-stone-900 to-stone-800 text-white p-4 shadow-lg border border-stone-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-mono text-emerald-400 flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            온실 센서 & 카메라 연동됨
          </span>
          <button
            onClick={() => setShowQrModal(true)}
            className="text-[10px] bg-stone-700/80 hover:bg-stone-600 px-2.5 py-1 rounded-full text-stone-200 transition-colors"
          >
            KIT QR: X89
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
              {activePersimmon.varietyLabel}
            </span>
            <h2 className="text-base font-bold leading-tight text-white">
              {activePersimmon.name}
            </h2>
            <p className="text-xs text-stone-300">
              입주 {activePersimmon.daysElapsed}일차 · 당도 {activePersimmon.sugarBrix} °Bx 추정
            </p>
          </div>

          <div className="shrink-0">
            <GamgamiCharacter
              stage={activePersimmon.currentStage}
              mood={activePersimmon.avatarMood}
              ripeningPercent={activePersimmon.ripeningPercent}
              size="sm"
              mode={mode}
              onTap={() => setActiveTab('lab')}
            />
          </div>
        </div>

        {/* Ripening Progress Bar with Mode-Sensitive Stage Label */}
        <div className="mt-3 pt-3 border-t border-stone-700/70">
          <div className="flex justify-between text-[11px] mb-1 font-medium">
            <span className="text-stone-300">
              {mode === 'education' ? '성장 진행률' : '후숙 진행률'} ·{' '}
              <strong className="text-orange-300 font-semibold">
                {getPersimmonStageLabel(activePersimmon.currentStage, mode)}
              </strong>
            </span>
            <span className="font-mono text-orange-400 font-bold">
              {activePersimmon.ripeningPercent}%
            </span>
          </div>
          <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-500 via-orange-500 to-red-500 transition-all duration-500 rounded-full"
              style={{ width: `${activePersimmon.ripeningPercent}%` }}
            />
          </div>
        </div>
      </div>


      {/* Live Sensor Metrics Grid */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-stone-900">실시간 스마트 온실 환경</span>
          <button
            onClick={() => {
              setMode('hobbyist');
              setActiveTab('lab');
            }}
            className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-0.5"
          >
            <span>상세 그래프</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Temperature */}
          <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200/60 text-center">
            <div className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
              <Thermometer className="w-3 h-3 text-rose-500" />
              <span>온도</span>
            </div>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              {sensorData.temperature}°C
            </div>
            <span className="text-[9px] text-emerald-600 font-medium">최적 후숙</span>
          </div>

          {/* Humidity */}
          <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200/60 text-center">
            <div className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
              <Droplets className="w-3 h-3 text-sky-500" />
              <span>습도</span>
            </div>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              {sensorData.humidity}%
            </div>
            <span className="text-[9px] text-sky-600 font-medium">쾌적 다습</span>
          </div>

          {/* Illuminance */}
          <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200/60 text-center">
            <div className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" />
              <span>조도</span>
            </div>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              {sensorData.lux} Lx
            </div>
            <span className="text-[9px] text-amber-600 font-medium">LED 점등</span>
          </div>
        </div>
      </div>

      {/* 4-Compartment Smart Kit Layout (4분할 아크릴 온실 키트 - 1호~4호 통일) */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-stone-900">스마트 온실 1호~4호 배치도</span>
            <span className="text-[10px] text-stone-500 font-mono">실물 아크릴 챔버</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            중앙 수분 솜: 85% 양호
          </span>
        </div>

        {/* 4 Quadrants Grid */}
        <div className="relative bg-amber-50/40 p-3 rounded-2xl border border-amber-200/60">
          {/* Top Arduino Board & Camera Header Indicator */}
          <div className="bg-stone-900 text-stone-200 text-[10px] font-mono py-1 px-2.5 rounded-lg mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ARDUINO PRO MINI + CAM MODULE
            </span>
            <span className="text-stone-400">상단 고정 장착</span>
          </div>

          <div className="grid grid-cols-2 gap-2 relative">
            {/* Center Moisture Pad Well */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-amber-300 shadow-sm flex flex-col items-center justify-center z-10 pointer-events-none">
              <span className="text-[8px] font-bold text-amber-800 leading-none">수분솜</span>
              <Droplets className="w-3 h-3 text-sky-500 mt-0.5" />
            </div>

            {/* 4 Persimmon Chambers (1호 ~ 4호) */}
            {[
              { id: 'persimmon-1', zone: '1호 (좌상)', name: '1호 대봉이', stage: 'turning' as PersimmonStage, color: 'text-orange-600' },
              { id: 'persimmon-2', zone: '2호 (우상)', name: '2호 단감이', stage: 'ripe' as PersimmonStage, color: 'text-amber-600' },
              { id: 'persimmon-3', zone: '3호 (좌하)', name: '3호 말랑이', stage: 'hongsi' as PersimmonStage, color: 'text-red-600' },
              { id: 'persimmon-4', zone: '4호 (우하)', name: '4호 둥시', stage: 'turning' as PersimmonStage, color: 'text-orange-500' },
            ].map((slot) => {
              const isCurrent = slot.id === activePersimmon.id;
              const stageLabel = getPersimmonStageLabel(slot.stage, mode);
              return (
                <div
                  key={slot.id}
                  onClick={() => {
                    setActivePersimmonId(slot.id);
                    setActiveTab('lab');
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-orange-100/80 border-orange-400 shadow-xs'
                      : 'bg-white border-stone-200/80 hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-stone-500">{slot.zone}</span>
                    <span className={`font-bold text-[10px] ${slot.color}`}>{stageLabel}</span>
                  </div>
                  <div className="font-bold text-xs text-stone-900 mt-1 flex items-center justify-between">
                    <span>{slot.name}</span>
                    <span className="text-xs">🍊</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Camera Live Snapshot Preview */}
      <div
        onClick={() => {
          setMode('hobbyist');
          setActiveTab('lab');
        }}
        className="bg-white rounded-3xl p-3 border border-stone-200/80 shadow-sm cursor-pointer hover:border-orange-300 transition-all space-y-2"
      >
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-stone-600" />
            온실 내부 라이브 카메라
          </span>
          <span className="text-[10px] text-emerald-600 font-mono font-semibold">● LIVE 1080p</span>
        </div>
        <div className="rounded-2xl overflow-hidden aspect-16/9 bg-stone-900 relative">
          <img
            src="/src/assets/images/smart_persimmon_kit_1793277157840.jpg"
            alt="스마트 온실 카메라"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5 text-white text-[11px] justify-between">
            <span>아두이노 센서 & 4분할 아크릴 챔버</span>
            <span className="text-orange-400 font-bold">확대 관측 →</span>
          </div>
        </div>
      </div>

      {/* Featured Community Recipe Preview */}
      {featuredRecipe && (
        <div
          onClick={() => setActiveTab('community')}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-3.5 border border-orange-200/70 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex items-center gap-3"
        >
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-orange-200 shadow-xs">
            <img
              src={featuredRecipe.imageUrl}
              alt={featuredRecipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full inline-block mb-1">
              이주의 추천 홍시 레시피
            </span>
            <h4 className="font-bold text-xs text-stone-900 truncate">{featuredRecipe.title}</h4>
            <p className="text-[11px] text-stone-600 line-clamp-1 mt-0.5">{featuredRecipe.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};
