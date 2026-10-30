import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Plus,
  Thermometer,
  Droplets,
  Camera,
  Tag,
  X,
  CheckCircle,
  FileText,
  Sparkles,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { PersimmonStage, getPersimmonStageLabel, STAGE_COLORS } from '../types';

export const DiaryView: React.FC = () => {
  const { diaries, addDiary, activePersimmon, sensorData, mode } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [stage, setStage] = useState<PersimmonStage>(activePersimmon.currentStage);
  const [selectedImage, setSelectedImage] = useState<string>(
    '/src/assets/images/ripe_hongsi_persimmon_1793276096985.jpg'
  );
  const [tagInput, setTagInput] = useState('홍시성장, 센서기록');

  const sampleImages = [
    { label: '4분할 키트 실물', url: '/assets/aistudio/image_a036c6f8.png' },
    { label: '3D 온실 키트', url: '/src/assets/images/smart_persimmon_kit_1793277157840.jpg' },
    { label: '완숙 홍시', url: '/src/assets/images/ripe_hongsi_persimmon_1793276096985.jpg' },
    { label: '홍시 라떼 디저트', url: '/src/assets/images/hongsi_dessert_latte_1793276097126.jpg' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
    // Reset value so same file can be re-selected if desired
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addDiary({
      persimmonId: activePersimmon.id,
      persimmonName: activePersimmon.name,
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      content: content.trim(),
      stage,
      imageUrl: selectedImage,
      temp: sensorData.temperature,
      humidity: sensorData.humidity,
      tags: tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setTitle('');
    setContent('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header & Write Button */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-orange-600" />
            온라인 홍시 관찰 일기장
          </h2>
          <p className="text-[11px] text-stone-500 mt-0.5">
            센서 데이터와 함께 저장되는 우리 아이 생생 관찰 기록 ({diaries.length}편)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>일기 쓰기</span>
        </button>
      </div>

      {/* Diary Entries List */}
      <div className="space-y-3.5">
        {diaries.map((entry) => {
          const stageLabel = getPersimmonStageLabel(entry.stage, mode);
          const stageColor = STAGE_COLORS[entry.stage] || STAGE_COLORS.turning;
          return (
            <article
              key={entry.id}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-3"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stageColor.badge}`}>
                    {stageLabel}
                  </span>
                  <span className="text-xs font-bold text-stone-900">{entry.persimmonName}</span>
                </div>
                <time className="text-[11px] font-mono text-stone-400">{entry.date}</time>
              </div>

              {/* Title */}
              <h3 className="font-bold text-sm text-stone-900 leading-snug">{entry.title}</h3>

              {/* Attached Photo */}
              {entry.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-16/10 bg-stone-100 border border-stone-200/60 shadow-inner">
                  <img
                    src={entry.imageUrl}
                    alt={entry.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content Body */}
              <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>

              {/* Auto Sensor Snapshot & Tags */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Sensor Snapshot Badge */}
                <div className="flex items-center gap-2 text-stone-600 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/60 font-mono text-[11px]">
                  <span className="flex items-center gap-1 text-rose-600">
                    <Thermometer className="w-3 h-3" />
                    {entry.temp}°C
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="flex items-center gap-1 text-sky-600">
                    <Droplets className="w-3 h-3" />
                    {entry.humidity}%
                  </span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1 flex-wrap">
                  {entry.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Write New Diary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-sm max-h-[90vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-sm text-stone-900">새 관찰 일기 작성</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {/* Target Persimmon & Stage */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">관찰 대상 감 & 후숙 단계</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-2 font-medium text-stone-900">
                    {activePersimmon.name}
                  </div>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as PersimmonStage)}
                    className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="green">
                      {getPersimmonStageLabel('green', mode)} {mode === 'education' ? '(풋감·초록)' : '(초기 미숙)'}
                    </option>
                    <option value="turning">
                      {getPersimmonStageLabel('turning', mode)} {mode === 'education' ? '(주황빛 물듦)' : '(착색 발현)'}
                    </option>
                    <option value="ripe">
                      {getPersimmonStageLabel('ripe', mode)} {mode === 'education' ? '(말랑해지는 중)' : '(연화 진행)'}
                    </option>
                    <option value="hongsi">
                      {getPersimmonStageLabel('hongsi', mode)} {mode === 'education' ? '(달콤 꿀홍시)' : '(완숙·탈삽 완료)'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">일기 제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 꼭지가 촉촉해지고 주황빛이 더 진해졌어요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Image Attachment & Camera Capture */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-stone-700 block">관찰 사진 첨부</label>
                  <span className="text-[10px] text-stone-400">직접 촬영 또는 앨범 선택</span>
                </div>

                {/* Hidden File & Camera Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Upload & Camera Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-1.5 font-medium text-stone-700 transition active:scale-[0.98]"
                  >
                    <Upload className="w-3.5 h-3.5 text-stone-600" />
                    <span>사진 파일 첨부</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl border border-orange-300 bg-orange-50 hover:bg-orange-100 flex items-center justify-center gap-1.5 font-semibold text-orange-700 transition active:scale-[0.98]"
                  >
                    <Camera className="w-3.5 h-3.5 text-orange-600" />
                    <span>카메라 직접 촬영</span>
                  </button>
                </div>

                {/* Active Selected Image Preview */}
                <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-stone-100 border border-stone-200">
                  <img
                    src={selectedImage}
                    alt="선택된 관찰 사진"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>일기에 저장될 사진</span>
                  </div>
                </div>

                {/* Preset Kit Photo options */}
                <div>
                  <span className="text-[10px] text-stone-500 block mb-1">또는 키트 기본 사진에서 선택:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {sampleImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img.url)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                          selectedImage === img.url
                            ? 'border-orange-600 ring-2 ring-orange-500/30'
                            : 'border-stone-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">관찰 내용 & 느낌</label>
                <textarea
                  required
                  rows={4}
                  placeholder="오늘 감감이의 표정과 향기, 만졌을 때의 촉감, 온실 환경을 자유롭게 기록해 보세요!"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Auto Attached Sensor Info preview */}
              <div className="bg-orange-50/70 border border-orange-200/70 rounded-xl p-2.5 text-[11px] text-stone-700 space-y-1">
                <span className="font-bold text-orange-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  현재 아두이노 센서 데이터 자동 첨부
                </span>
                <div className="font-mono text-stone-600 flex gap-3">
                  <span>온도: {sensorData.temperature}°C</span>
                  <span>습도: {sensorData.humidity}%</span>
                  <span>조도: {sensorData.lux} Lux</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="예: 홍시관찰, 향기체크, 자연학습"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl text-stone-600 hover:text-stone-900"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  일기 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
