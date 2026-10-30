import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, Sparkles, Activity, CheckCircle2, RefreshCw, X, Radio, ArrowRight } from 'lucide-react';
import { AppMode } from '../types';

export const QRScannerModal: React.FC = () => {
  const { showQrModal, setShowQrModal, setMode, mode } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scannedKit, setScannedKit] = useState<{
    serial: string;
    model: string;
    sensors: string[];
    arduinoIp: string;
  } | null>({
    serial: 'KIT-HONGSI-2026-X89',
    model: '스마트 홍시 관찰 KIT (4개 방 아크릴 챔버)',
    sensors: ['아두이노 마이크로컨트롤러', '실시간 카메라 모듈', '온습도 센서', '중앙 수분 조절 웰'],
    arduinoIp: '192.168.1.120',
  });

  const [selectedBranch, setSelectedBranch] = useState<AppMode>(mode);

  if (!showQrModal) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedKit({
        serial: `KIT-HONGSI-${Math.floor(1000 + Math.random() * 9000)}-VERIDIA`,
        model: '스마트 홍시 관찰 KIT (4개 방 아크릴 챔버)',
        sensors: ['아두이노 마이크로컨트롤러', '실시간 카메라 모듈', '온습도 센서', '중앙 수분 조절 웰'],
        arduinoIp: '192.168.1.120',
      });
    }, 1200);
  };

  const handleConfirmMode = () => {
    setMode(selectedBranch);
    setShowQrModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">제품 QR코드 연동 & 모드 선택</h3>
              <p className="text-[11px] text-stone-500">홍시 관찰 KIT 하단 스티커 인식</p>
            </div>
          </div>
          <button
            onClick={() => setShowQrModal(false)}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* QR Viewfinder Simulation */}
          <div className="relative w-full h-40 bg-stone-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-stone-800">
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-4 border-2 border-dashed border-orange-500/60 rounded-xl pointer-events-none flex items-center justify-center">
              {scanning && (
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2 shadow-lg shadow-orange-500/50" />
              )}
            </div>

            <QrCode className={`w-14 h-14 ${scanning ? 'text-orange-400 animate-spin' : 'text-stone-500'}`} />
            <div className="mt-2 text-center z-10">
              <p className="text-xs font-medium text-stone-200">
                {scanning ? '아두이노 온실 키트 페어링 중...' : '온실 본체 QR코드가 인식되었습니다'}
              </p>
              <button
                onClick={handleSimulateScan}
                disabled={scanning}
                className="mt-1 text-[11px] text-orange-400 hover:text-orange-300 underline flex items-center gap-1 mx-auto"
              >
                <RefreshCw className="w-3 h-3" /> 다른 키트 재스캔
              </button>
            </div>
          </div>

          {/* Scanned Kit Info */}
          {scannedKit && (
            <div className="bg-stone-50 border border-stone-200/70 rounded-2xl p-3 space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-stone-200 shadow-xs">
                  <img
                    src="/assets/aistudio/image_a036c6f8.png"
                    alt="홍시 키트"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 flex items-center gap-1 truncate text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {scannedKit.model}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    {scannedKit.serial} · {scannedKit.arduinoIp}
                  </div>
                  <span className="text-[10px] text-orange-600 font-medium">관찰 일기 & 레시피 북 연동됨</span>
                </div>
              </div>
              <div className="text-[11px] text-stone-600 flex flex-wrap gap-1 pt-1 border-t border-stone-200/50">
                {scannedKit.sensors.map((s, idx) => (
                  <span key={idx} className="bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mode Choice Onboarding Branch (요구사항 1) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 block">
              1. 사용 목적에 따른 모드를 선택하세요:
            </label>

            {/* Education Mode Choice */}
            <div
              onClick={() => setSelectedBranch('education')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedBranch === 'education'
                  ? 'border-orange-500 bg-orange-50/70 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900">교육용 모드 (아동·학부모)</span>
                    {selectedBranch === 'education' && (
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                        선택됨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    AI 반려 과일 '감감이'와 대화하고 표정과 음성으로 홍시가 익어가는 과정을 신나게 배워요.
                  </p>
                </div>
              </div>
            </div>

            {/* Hobbyist Mode Choice */}
            <div
              onClick={() => setSelectedBranch('hobbyist')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedBranch === 'hobbyist'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900">취미용 모드 (성인·전문가)</span>
                    {selectedBranch === 'hobbyist' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        선택됨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    아두이노 온·습·조도 센서 그래프 시각화, 내부 카메라 영상 확인 및 정밀 생육 제어.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
          <button
            onClick={() => setShowQrModal(false)}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            닫기
          </button>
          <button
            onClick={handleConfirmMode}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-stone-900 hover:bg-stone-800 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98]"
          >
            <span>{selectedBranch === 'education' ? '교육용 모드로 시작' : '취미용 모드로 시작'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
