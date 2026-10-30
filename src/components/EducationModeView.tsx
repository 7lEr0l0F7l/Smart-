import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GamgamiCharacter } from './GamgamiCharacter';
import {
  Send,
  Plus,
  Sparkles,
  Thermometer,
  Droplets,
  Sun,
  Award,
  BellRing,
  HelpCircle,
  CheckCircle2,
  Circle,
  RotateCw,
  Check,
} from 'lucide-react';

export const EducationModeView: React.FC = () => {
  const {
    activePersimmon,
    persimmons,
    setActivePersimmonId,
    sensorData,
    chatMessages,
    sendMessageToGamgami,
    isChatLoading,
    diaries,
    toggleFan,
    userRole,
    setUserRole,
    setActiveTab,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [showAddPersimmon, setShowAddPersimmon] = useState(false);
  const [newPersimmonName, setNewPersimmonName] = useState('');

  // Daily mini-missions automatically completed based on real actions (요구사항: 직접 체크 X, 완료 시 즉시 체크, 밑줄 제거)
  const isTempChecked = sensorData.temperature >= 19 && sensorData.temperature <= 26;
  const isChatCompleted = chatMessages.some((m) => m.sender === 'user');
  const isDiaryCompleted = diaries.length > 0;
  const isActuatorChecked = sensorData.fanActive || sensorData.ledActive;

  const missions = [
    {
      id: 1,
      text: '온실 적정 온도(20~24°C) 확인하기',
      done: isTempChecked,
      reward: '새싹 배지',
      actionLabel: '센서 체크됨',
      onAction: undefined,
    },
    {
      id: 2,
      text: '감감이에게 "오늘 기분 어때?" 말 걸기',
      done: isChatCompleted,
      reward: '햇빛 도장',
      actionLabel: '말 걸기',
      onAction: () => handleQuickQuestion('오늘 온실 기분은 어때?'),
    },
    {
      id: 3,
      text: '오늘의 감 사진 찍고 관찰일기 쓰기',
      done: isDiaryCompleted,
      reward: '탐구자 훈장',
      actionLabel: '일기 쓰기',
      onAction: () => setActiveTab('diary'),
    },
    {
      id: 4,
      text: '온실 환경 제어(환기팬 또는 조명) 확인하기',
      done: isActuatorChecked,
      reward: '스마트 가드너',
      actionLabel: '환기 켜기',
      onAction: () => toggleFan(),
    },
  ];

  const quickQuestions = [
    '청도 반시는 어떤 감이야?',
    '씨 없는 감은 왜 생겨?',
    '떫은맛은 왜 달콤하게 변해?',
    '홍시는 언제 다 익어?',
    '오늘 온실 기분은 어때?',
  ];

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;
    const msg = inputMessage;
    setInputMessage('');
    await sendMessageToGamgami(msg);
  };

  const handleQuickQuestion = (q: string) => {
    sendMessageToGamgami(q);
  };

  // Status message based on temperature and ripening
  const getStatusAdvice = () => {
    if (sensorData.temperature > 26) {
      return {
        title: '온실이 조금 더워요!',
        desc: '감감이가 후끈후끈해하고 있어요. 취미용 관제실에서 환기팬을 틀어주세요~',
        badge: '주의',
        badgeColor: 'bg-amber-100 text-amber-800',
      };
    }
    if (sensorData.humidity < 50) {
      return {
        title: '공기가 건조해요!',
        desc: '온실 바닥 수분 패드를 살짝 적셔주면 감 껍질이 더 촉촉해져요.',
        badge: '체크',
        badgeColor: 'bg-sky-100 text-sky-800',
      };
    }
    return {
      title: '감감이에게 최고의 환경이에요!',
      desc: `현재 ${sensorData.temperature}°C, ${sensorData.humidity}%로 당도가 맛있게 차오르고 있어요!`,
      badge: '최적',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    };
  };

  const status = getStatusAdvice();

  return (
    <div className="space-y-4 pb-4">
      {/* Persimmon Multi-Profile Switcher (요구사항 2: 여러 개의 감 상태 번갈아 관찰) */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-900">관찰 중인 우리집 감</span>
            <span className="text-[10px] text-stone-500 font-mono">({persimmons.length}과실)</span>
          </div>
          <button
            onClick={() => setShowAddPersimmon(!showAddPersimmon)}
            className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" /> 새 감 등록
          </button>
        </div>

        {/* Persimmon Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {persimmons.map((p) => {
            const isSelected = p.id === activePersimmon.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersimmonId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 min-h-[36px] ${
                  isSelected
                    ? 'bg-orange-500 text-white font-semibold shadow-sm shadow-orange-500/20'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                <span>{p.name}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-orange-100' : 'text-stone-400'}`}>
                  {p.ripeningPercent}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Add New Persimmon Form (collapsible) */}
        {showAddPersimmon && (
          <div className="mt-2.5 pt-2.5 border-t border-stone-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="예: 우리집 둥시 4호"
              value={newPersimmonName}
              onChange={(e) => setNewPersimmonName(e.target.value)}
              className="flex-1 text-xs px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              onClick={() => {
                if (!newPersimmonName.trim()) return;
                // Add new mock persimmon
                persimmons.push({
                  id: `persimmon-${Date.now()}`,
                  name: newPersimmonName,
                  variety: 'dungsi',
                  varietyLabel: '상주 둥시 (곶감/홍시용)',
                  currentStage: 'green',
                  ripeningPercent: 20,
                  sugarBrix: 14.0,
                  daysElapsed: 1,
                  avatarMood: 'happy',
                  notes: '새로 입주한 둥시 감.',
                });
                setActivePersimmonId(persimmons[persimmons.length - 1].id);
                setNewPersimmonName('');
                setShowAddPersimmon(false);
              }}
              className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800"
            >
              추가
            </button>
          </div>
        )}
      </div>

      {/* Gamgami Companion Card & Ripening Stage (반려 과일 컨셉) */}
      <div className="relative bg-gradient-to-b from-orange-50/80 via-white to-amber-50/40 rounded-3xl p-5 border border-orange-100 shadow-sm text-center overflow-hidden">
        {/* Top Badges */}
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-900 text-sm">{activePersimmon.name}</span>
            <span className="text-[11px] text-stone-500">· {activePersimmon.daysElapsed}일째 자라는 중</span>
          </div>
          {/* Companion Live Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100/80 border border-orange-200/80 text-[11px] font-semibold text-orange-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>반려과일 대화방</span>
          </div>
        </div>

        {/* Center Gamgami Vector Character */}
        <div className="py-2 flex justify-center">
          <GamgamiCharacter
            stage={activePersimmon.currentStage}
            mood={activePersimmon.avatarMood}
            ripeningPercent={activePersimmon.ripeningPercent}
            onTap={() => {
              sendMessageToGamgami('감감아 톡톡! 오늘 상태는 어때?');
            }}
          />
        </div>

        {/* Push Alert / Condition Card (요구사항 2: 감이 자신의 상태를 아이에게 친근하게 알림) */}
        <div className="mt-4 bg-white/95 rounded-2xl p-3 border border-stone-200/70 shadow-sm text-left flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
            <BellRing className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-stone-900">{status.title}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.badgeColor}`}>
                {status.badge}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">{status.desc}</p>
          </div>
        </div>

        {/* Quick Micro-Environmental Stats */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-stone-700">
          <div className="bg-white/90 rounded-xl p-2 border border-stone-200/60">
            <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
              <Thermometer className="w-3 h-3 text-rose-500" /> 온실 온도
            </div>
            <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
              {sensorData.temperature}°C
            </div>
          </div>
          <div className="bg-white/90 rounded-xl p-2 border border-stone-200/60">
            <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
              <Droplets className="w-3 h-3 text-sky-500" /> 온실 습도
            </div>
            <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
              {sensorData.humidity}%
            </div>
          </div>
          <div className="bg-white/90 rounded-xl p-2 border border-stone-200/60">
            <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" /> 일조량
            </div>
            <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
              {sensorData.lux} Lx
            </div>
          </div>
        </div>
      </div>

      {/* AI Gamgami Live Chat Window (Gemini 3.8 Flash 연동) */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm flex flex-col h-[380px]">
        {/* Chat Title */}
        <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-xs text-stone-900">감감이 AI 친구 대화방</span>
          </div>
          <span className="text-[10px] text-stone-400 font-mono">Gemini AI Engine</span>
        </div>

        {/* Message Scroll Container */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {chatMessages.map((msg) => {
            const isBot = msg.sender === 'gamgami';
            return (
              <div key={msg.id} className={`flex items-start gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
                {isBot && (
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    감
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm break-keep ${
                    isBot
                      ? 'bg-orange-50/80 border border-orange-100 text-stone-800 rounded-tl-sm'
                      : 'bg-stone-900 text-white rounded-tr-sm'
                  }`}
                >
                  <p className="break-keep">{msg.text}</p>
                  <span className={`text-[9px] mt-1 block text-right font-mono ${isBot ? 'text-orange-400' : 'text-stone-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          {isChatLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-400 italic py-1">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
              <span>감감이가 열심히 생각하고 있어요...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 no-scrollbar border-t border-stone-100">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              disabled={isChatLoading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-100 hover:text-orange-800 text-stone-600 transition-colors whitespace-nowrap shrink-0 border border-stone-200/50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="감감이에게 궁금한 점을 물어보세요..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isChatLoading}
            className="flex-1 bg-stone-100 border border-stone-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isChatLoading}
            className="w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Daily Observation Quest Missions (교육용 몰입 장치 - 자동 달성 체크 & 깔끔한 완료 배지) */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-600" />
            <h4 className="font-bold text-xs text-stone-900">오늘의 온실 탐구 미션</h4>
          </div>
          <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
            {missions.filter((m) => m.done).length}/{missions.length} 완료
          </span>
        </div>
        <p className="text-[11px] text-stone-500">
          온실 센서를 확인하고 대화나 일기를 작성하면 자동으로 완료 처리돼요!
        </p>

        <div className="space-y-1.5">
          {missions.map((m) => (
            <div
              key={m.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors gap-2 ${
                m.done
                  ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950 shadow-2xs'
                  : 'bg-stone-50/80 border-stone-200/60 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {m.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-300 shrink-0" />
                )}
                <span className={`text-xs ${m.done ? 'text-stone-900 font-semibold' : 'text-stone-700 font-medium'}`}>
                  {m.text}
                </span>
              </div>

              {m.done ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 border border-emerald-200/60">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>완료</span>
                  <span className="text-emerald-500">·</span>
                  <span>{m.reward}</span>
                </span>
              ) : m.onAction ? (
                <button
                  type="button"
                  onClick={m.onAction}
                  className="text-[10px] font-semibold text-orange-700 bg-orange-100/90 hover:bg-orange-200/80 px-2.5 py-1 rounded-lg border border-orange-200/70 shrink-0 transition-all flex items-center gap-1 active:scale-95"
                >
                  <span>{m.actionLabel}</span>
                  <span>→</span>
                </button>
              ) : (
                <span className="text-[10px] font-medium text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                  {m.reward}
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setActiveTab('diary')}
          className="w-full mt-1 py-2 text-center text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 rounded-xl transition-colors"
        >
          오늘의 관찰일기 쓰러 가기 →
        </button>
      </div>
    </div>
  );
};
