import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { consultHobbyistAdvisor } from '../services/api';
import { getPersimmonStageLabel } from '../types';
import {
  Thermometer,
  Droplets,
  Sun,
  Camera,
  Fan,
  Lightbulb,
  Sliders,
  Play,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  Radio,
  Clock,
  Sparkles,
  Download,
  Bot,
  Send,
  HelpCircle,
  RotateCw,
} from 'lucide-react';

export const HobbyistModeView: React.FC = () => {
  const {
    sensorData,
    sensorHistory,
    toggleFan,
    toggleLed,
    setSimulatedSensor,
    realArduinoIp,
    setRealArduinoIp,
    activePersimmon,
    persimmons,
    setActivePersimmonId,
    addDiary,
    setActiveTab,
  } = useApp();

  const [timelapseDay, setTimelapseDay] = useState(activePersimmon.daysElapsed || 9);
  const [isPlayingTimelapse, setIsPlayingTimelapse] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [camAngle, setCamAngle] = useState<'3d' | 'top'>('3d');

  // Professional Advisor Chat State (No TTS, Professional Q&A)
  const [advisorMessages, setAdvisorMessages] = useState<Array<{ id: string; sender: 'user' | 'advisor'; text: string; time: string }>>([
    {
      id: 'adv-1',
      sender: 'advisor',
      text: '안녕하세요. 스마트 온실 환경 제어 및 감 후숙·탈삽 전문 Q&A 어드바이저입니다. 탄닌 탈삽 생화학 메커니즘, 수산화칼륨(KOH) 연화제 처리, 온·습도 조절 및 곰팡이 방제, Brix 당도 측정에 대해 문의해 주시기 바랍니다.',
      time: '안내',
    },
  ]);
  const [advisorInput, setAdvisorInput] = useState('');
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);

  // Timelapse playback loop
  const handlePlayTimelapse = () => {
    if (isPlayingTimelapse) {
      setIsPlayingTimelapse(false);
      return;
    }
    setIsPlayingTimelapse(true);
    let current = 1;
    setTimelapseDay(1);
    const timer = setInterval(() => {
      current += 1;
      if (current > 18) {
        clearInterval(timer);
        setIsPlayingTimelapse(false);
      } else {
        setTimelapseDay(current);
      }
    }, 400);
  };

  const handleCaptureSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);

    const snapshotImg = camAngle === '3d'
      ? '/src/assets/images/smart_persimmon_kit_1793277157840.jpg'
      : '/assets/aistudio/image_a036c6f8.png';

    // Save snapshot directly as diary entry
    addDiary({
      persimmonId: activePersimmon.id,
      persimmonName: activePersimmon.name,
      date: new Date().toISOString().split('T')[0],
      title: `[키트 카메라 스냅샷] ${activePersimmon.name} (${getPersimmonStageLabel(activePersimmon.currentStage, 'hobbyist')})`,
      content: `스마트 온실 카메라(${camAngle === '3d' ? '3D 입체뷰' : '4분할 탑뷰'})로 캡처한 고화질 관측 사진입니다. 실시간 온도 ${sensorData.temperature}°C, 습도 ${sensorData.humidity}%, 조도 ${sensorData.lux}Lux에서 1호~4호 감이 안정적으로 후숙 중.`,
      stage: activePersimmon.currentStage,
      imageUrl: snapshotImg,
      temp: sensorData.temperature,
      humidity: sensorData.humidity,
      tags: ['카메라캡처', '4구획키트', getPersimmonStageLabel(activePersimmon.currentStage, 'hobbyist')],
    });
  };

  // Build SVG Path for Sparkline History
  const renderSparkline = (
    key: 'temperature' | 'humidity' | 'lux',
    minVal: number,
    maxVal: number,
    strokeColor: string,
    fillColor: string
  ) => {
    if (!sensorHistory || sensorHistory.length < 2) {
      return <div className="h-16 flex items-center justify-center text-xs text-stone-400">데이터 수집 중...</div>;
    }

    const width = 280;
    const height = 50;
    const points = sensorHistory.map((d, idx) => {
      const x = (idx / (sensorHistory.length - 1)) * width;
      const val = d[key] ?? minVal;
      const normalized = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal)));
      const y = height - normalized * (height - 10) - 5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-12 overflow-visible">
        <defs>
          <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${key})`} />
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Hardware Connection Status Bar */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-3 shadow-md border border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">Arduino IoT Gateway</span>
          <span className="font-mono text-[10px] text-stone-400">({realArduinoIp})</span>
        </div>
        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-medium transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-orange-400" />
          <span>센서 시뮬레이터</span>
        </button>
      </div>

      {/* Sensor Simulator Drawer (슬라이더 조작) */}
      {showSimulator && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-600" />
              가상 환경 시뮬레이터 (브라우저 테스트)
            </h4>
            <span className="text-[10px] text-amber-700 font-mono">Real-time Injection</span>
          </div>
          <p className="text-[11px] text-amber-800">
            슬라이더를 조절하여 온·습도 환경을 변화시키면 감감이의 기분과 그래프가 실시간으로 반응합니다.
          </p>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between font-mono text-stone-700">
                <span>온도 조절:</span>
                <span className="font-bold">{sensorData.temperature}°C</span>
              </div>
              <input
                type="range"
                min="16"
                max="34"
                step="0.5"
                value={sensorData.temperature}
                onChange={(e) => setSimulatedSensor({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-orange-600 h-1.5 bg-amber-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-stone-700">
                <span>습도 조절:</span>
                <span className="font-bold">{sensorData.humidity}%</span>
              </div>
              <input
                type="range"
                min="35"
                max="90"
                step="1"
                value={sensorData.humidity}
                onChange={(e) => setSimulatedSensor({ humidity: parseFloat(e.target.value) })}
                className="w-full accent-sky-600 h-1.5 bg-amber-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-stone-700">
                <span>광량 (조도) 조절:</span>
                <span className="font-bold">{sensorData.lux} Lux</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={sensorData.lux}
                onChange={(e) => setSimulatedSensor({ lux: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-600 h-1.5 bg-amber-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 1호 ~ 4호 Chamber Slot Selector & Ripening Stage Progression Bar */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-stone-900">온실 구획별 관측 대상 (1호~4호)</span>
            <span className="text-[10px] text-stone-500 font-mono">터치하여 전환</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {activePersimmon.varietyLabel}
          </span>
        </div>

        {/* 1호 ~ 4호 Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {persimmons.map((p) => {
            const isSelected = p.id === activePersimmon.id;
            const stageLabel = getPersimmonStageLabel(p.currentStage, 'hobbyist');
            return (
              <button
                key={p.id}
                onClick={() => setActivePersimmonId(p.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-600/30'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div>
                  <div className={`text-[10px] font-bold ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                    {p.name.split(' ')[0]}
                  </div>
                  <div className={`text-xs font-bold leading-tight mt-0.5 ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {p.name.split(' ').slice(1).join(' ') || p.name}
                  </div>
                </div>
                <div className="mt-2 pt-1 border-t border-current/15 flex items-center justify-between">
                  <span className={`text-[9px] font-semibold ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    {stageLabel}
                  </span>
                  <span className={`text-[9px] font-mono ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                    {p.ripeningPercent}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Professional Ripening Stage Progression (미숙기 > 착색기 > 연화기 > 완숙기) */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
            <span className="text-stone-600 font-semibold">
              현재 후숙 단계: <strong className="text-emerald-800">{getPersimmonStageLabel(activePersimmon.currentStage, 'hobbyist')}</strong>
            </span>
            <span className="text-[10px] font-mono text-stone-500">당도 {activePersimmon.sugarBrix} °Bx</span>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center">
            {[
              { stage: 'green' as const, label: '미숙기', desc: '경도 高 · 떫음' },
              { stage: 'turning' as const, label: '착색기', desc: '카로티노이드' },
              { stage: 'ripe' as const, label: '연화기', desc: '펙틴 분해' },
              { stage: 'hongsi' as const, label: '완숙기', desc: '탈삽 완료' },
            ].map((step, idx) => {
              const isCurrent = activePersimmon.currentStage === step.stage;
              const stagesOrder = ['green', 'turning', 'ripe', 'hongsi'];
              const isPassed = stagesOrder.indexOf(activePersimmon.currentStage) >= idx;

              return (
                <div
                  key={step.stage}
                  className={`p-1.5 rounded-xl border text-[10px] transition-all ${
                    isCurrent
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                      : isPassed
                      ? 'bg-stone-100/90 border-stone-300 text-stone-700'
                      : 'bg-stone-50/60 border-stone-200 text-stone-400'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-0.5">
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />}
                    <span>{step.label}</span>
                  </div>
                  <div className="text-[8px] text-stone-500 mt-0.5 leading-none">{step.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Camera Stream & Optical Observation (요구사항 3) */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-xs text-stone-900">온실 내부 카메라 실시간 영상</h3>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                onClick={() => setCamAngle('3d')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  camAngle === '3d' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                3D 입체
              </button>
              <button
                onClick={() => setCamAngle('top')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  camAngle === 'top' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                4분할 탑뷰
              </button>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              LIVE
            </span>
          </div>
        </div>

        {/* Live Video / Optical Frame */}
        <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-950 border border-stone-200 shadow-inner group">
          <img
            src={
              timelapseDay >= 15
                ? '/src/assets/images/ripe_hongsi_persimmon_1793276096985.jpg'
                : camAngle === '3d'
                ? '/src/assets/images/smart_persimmon_kit_1793277157840.jpg'
                : '/assets/aistudio/image_a036c6f8.png'
            }
            alt="온실 내부 카메라 스트림"
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Camera Crosshairs & Telemetry Overlay */}
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between text-white text-[10px] font-mono drop-shadow-md">
            <div className="flex justify-between items-center bg-black/40 backdrop-blur-xs px-2 py-1 rounded-lg">
              <span>{activePersimmon.name} · {getPersimmonStageLabel(activePersimmon.currentStage, 'hobbyist')}</span>
              <span>DAY {timelapseDay} / 18</span>
            </div>

            {/* Snapshot Toast notification */}
            {snapshotTaken && (
              <div className="self-center bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
                스냅샷이 관찰일기에 자동 저장되었습니다!
              </div>
            )}

            <div className="flex justify-between items-end bg-black/40 backdrop-blur-xs px-2 py-1 rounded-lg">
              <div>
                T: {sensorData.temperature}°C · RH: {sensorData.humidity}%
              </div>
              <div>BRIX: {activePersimmon.sugarBrix} °Bx</div>
            </div>
          </div>
        </div>

        {/* Camera Controls & Timelapse Scrub Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-stone-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>후숙 타임랩스 기록 (Day {timelapseDay})</span>
            </div>
            <button
              onClick={handlePlayTimelapse}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Play className={`w-3.5 h-3.5 ${isPlayingTimelapse ? 'fill-emerald-700' : ''}`} />
              {isPlayingTimelapse ? '정지' : '재생'}
            </button>
          </div>

          <input
            type="range"
            min="1"
            max="18"
            value={timelapseDay}
            onChange={(e) => setTimelapseDay(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600 h-1.5 bg-stone-100 rounded-lg cursor-pointer"
          />

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleCaptureSnapshot}
              className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-stone-600" />
              스냅샷 사진 캡처
            </button>
            <button
              onClick={() => setActiveTab('diary')}
              className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              관찰 일기 보기 →
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Precision Sensors (온·습도·조도 그래프 시각화, 요구사항 3) */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-stone-900 px-1">실시간 센서 텔레메트리 & 추이 그래프</h3>

        {/* Temperature Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900">온실 내부 온도</span>
                <span className="text-[10px] text-stone-400 block font-mono">권장: 20 ~ 24°C</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-stone-900">
                {sensorData.temperature}
              </span>
              <span className="text-xs text-stone-500 font-mono ml-0.5">°C</span>
            </div>
          </div>
          {/* Sparkline Graph */}
          {renderSparkline('temperature', 15, 32, '#f43f5e', '#f43f5e')}
        </div>

        {/* Humidity Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900">온실 상대 습도</span>
                <span className="text-[10px] text-stone-400 block font-mono">권장: 55 ~ 70%</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-stone-900">
                {sensorData.humidity}
              </span>
              <span className="text-xs text-stone-500 font-mono ml-0.5">%</span>
            </div>
          </div>
          {/* Sparkline Graph */}
          {renderSparkline('humidity', 30, 90, '#0284c7', '#0284c7')}
        </div>

        {/* Illuminance Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900">광량 (조도 센서)</span>
                <span className="text-[10px] text-stone-400 block font-mono">생육 LED 연동</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-stone-900">
                {sensorData.lux}
              </span>
              <span className="text-xs text-stone-500 font-mono ml-0.5">Lux</span>
            </div>
          </div>
          {/* Sparkline Graph */}
          {renderSparkline('lux', 100, 1000, '#d97706', '#d97706')}
        </div>
      </div>

      {/* Hardware Actuator Remote Control Switches */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm space-y-3">
        <h4 className="font-bold text-xs text-stone-900">아두이노 액추에이터 원격 제어</h4>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Fan Button */}
          <button
            onClick={toggleFan}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between text-left transition-all ${
              sensorData.fanActive
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Fan
                className={`w-5 h-5 ${
                  sensorData.fanActive ? 'text-emerald-600 animate-spin' : 'text-stone-400'
                }`}
              />
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  sensorData.fanActive ? 'bg-emerald-200 text-emerald-900' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {sensorData.fanActive ? '가동 중' : '정지'}
              </span>
            </div>
            <div className="mt-3">
              <span className="font-bold text-xs block">온실 환기팬</span>
              <span className="text-[10px] text-stone-500">배기 & 곰팡이 방지</span>
            </div>
          </button>

          {/* LED Button */}
          <button
            onClick={toggleLed}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between text-left transition-all ${
              sensorData.ledActive
                ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-sm'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Lightbulb
                className={`w-5 h-5 ${sensorData.ledActive ? 'text-amber-500' : 'text-stone-400'}`}
              />
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  sensorData.ledActive ? 'bg-amber-200 text-amber-900' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {sensorData.ledActive ? '점등' : '소등'}
              </span>
            </div>
            <div className="mt-3">
              <span className="font-bold text-xs block">생장 보조 LED</span>
              <span className="text-[10px] text-stone-500">3000K 전구색 스펙트럼</span>
            </div>
          </button>
        </div>
      </div>

      {/* Professional Horticultural & Ripening Q&A Advisor (취미/전문가용 질의응답 챗봇, TTS 미지원) */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-stone-900">전문 후숙·탈삽 연구 Q&A 어드바이저</h4>
              <span className="text-[10px] text-stone-400">학술 연구 및 환경 제어 전문 상담 (음성 TTS 미지원)</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Horticulture AI
          </span>
        </div>

        {/* Advisor Chat Messages Container */}
        <div className="h-64 overflow-y-auto space-y-2.5 p-2 bg-stone-50/70 rounded-2xl border border-stone-100">
          {advisorMessages.map((msg) => {
            const isAdvisor = msg.sender === 'advisor';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAdvisor ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed break-keep shadow-2xs ${
                    isAdvisor
                      ? 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs'
                      : 'bg-emerald-800 text-white rounded-tr-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] mt-1 block font-mono ${
                      isAdvisor ? 'text-stone-400' : 'text-emerald-200 text-right'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
          {isAdvisorLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-400 italic py-1">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
              <span>전문 연구 데이터를 분석하고 있습니다...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            '청도 반시 무핵(씨 없음) 메커니즘',
            '탄닌 탈삽 생화학 원리가 뭐야?',
            '수산화칼륨 연화제 처리법',
            '곰팡이 방지 최적 환기 주기',
            '완숙 당도(Brix) 측정 기준',
            '홍시 장기 냉동 보관법',
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={async () => {
                if (isAdvisorLoading) return;
                const userMsg = {
                  id: `usr-${Date.now()}`,
                  sender: 'user' as const,
                  text: chip,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setAdvisorMessages((prev) => [...prev, userMsg]);
                setIsAdvisorLoading(true);
                try {
                  const res = await consultHobbyistAdvisor(chip, {
                    temperature: sensorData.temperature,
                    humidity: sensorData.humidity,
                    lux: sensorData.lux,
                  });
                  setAdvisorMessages((prev) => [
                    ...prev,
                    {
                      id: `adv-${Date.now()}`,
                      sender: 'advisor' as const,
                      text: res.reply,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                } finally {
                  setIsAdvisorLoading(false);
                }
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-600 transition-colors whitespace-nowrap shrink-0 border border-stone-200"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!advisorInput.trim() || isAdvisorLoading) return;
            const query = advisorInput.trim();
            setAdvisorInput('');

            const userMsg = {
              id: `usr-${Date.now()}`,
              sender: 'user' as const,
              text: query,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setAdvisorMessages((prev) => [...prev, userMsg]);
            setIsAdvisorLoading(true);

            try {
              const res = await consultHobbyistAdvisor(query, {
                temperature: sensorData.temperature,
                humidity: sensorData.humidity,
                lux: sensorData.lux,
              });
              setAdvisorMessages((prev) => [
                ...prev,
                {
                  id: `adv-${Date.now()}`,
                  sender: 'advisor' as const,
                  text: res.reply,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
            } finally {
              setIsAdvisorLoading(false);
            }
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            placeholder="탈삽 메커니즘, 챔버 환경 제어 등 전문 연구 질문 입력..."
            value={advisorInput}
            onChange={(e) => setAdvisorInput(e.target.value)}
            disabled={isAdvisorLoading}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <button
            type="submit"
            disabled={!advisorInput.trim() || isAdvisorLoading}
            className="p-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl shadow-xs transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
