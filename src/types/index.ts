export type AppMode = 'education' | 'hobbyist';
export type UserRole = 'child' | 'parent';

export type PersimmonStage = 'green' | 'turning' | 'ripe' | 'hongsi';

export const STAGE_LABELS_EDUCATION: Record<PersimmonStage, string> = {
  green: '아기 초록이',
  turning: '주황 성장기',
  ripe: '말랑 성숙기',
  hongsi: '꿀홍시 완전체',
};

export const STAGE_LABELS_HOBBYIST: Record<PersimmonStage, string> = {
  green: '미숙기',
  turning: '착색기',
  ripe: '연화기',
  hongsi: '완숙기',
};

export function getPersimmonStageLabel(stage: PersimmonStage, mode: AppMode = 'education'): string {
  return mode === 'education' ? STAGE_LABELS_EDUCATION[stage] : STAGE_LABELS_HOBBYIST[stage];
}

export const STAGE_COLORS: Record<PersimmonStage, { badge: string; text: string; dot: string }> = {
  green: { badge: 'bg-lime-100 text-lime-800 border-lime-200', text: 'text-lime-700', dot: '#84cc16' },
  turning: { badge: 'bg-orange-100 text-orange-800 border-orange-200', text: 'text-orange-600', dot: '#f97316' },
  ripe: { badge: 'bg-amber-100 text-amber-800 border-amber-200', text: 'text-amber-700', dot: '#ea580c' },
  hongsi: { badge: 'bg-rose-100 text-rose-800 border-rose-200', text: 'text-rose-600', dot: '#dc2626' },
};

export interface SensorTelemetry {
  temperature: number; // °C
  humidity: number;    // %
  lux: number;         // Lux
  co2?: number;        // ppm
  fanActive: boolean;  // Ventilation Fan
  ledActive: boolean;  // Grow LED
  waterLevel: number;  // %
  cameraStatus: 'online' | 'offline';
  lastUpdated: string;
}

export interface PersimmonProfile {
  id: string;
  name: string;
  variety: 'daebong' | 'sweet' | 'bansi' | 'dungsi';
  varietyLabel: string;
  currentStage: PersimmonStage;
  ripeningPercent: number; // 0 to 100
  sugarBrix: number;       // e.g. 14.2 to 21.5 Brix
  daysElapsed: number;     // Days in greenhouse
  avatarMood: 'happy' | 'warm' | 'thirsty' | 'chilly' | 'sleepy';
  notes: string;
}

export interface ObservationDiary {
  id: string;
  persimmonId: string;
  persimmonName: string;
  date: string;
  title: string;
  content: string;
  stage: PersimmonStage;
  imageUrl?: string;
  temp: number;
  humidity: number;
  tags: string[];
}

export interface PostComment {
  id: string;
  author: string;
  authorRole: UserRole;
  text: string;
  date: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorRole: UserRole;
  category: 'observation' | 'recipe' | 'qna';
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: PostComment[];
  date: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gamgami';
  text: string;
  timestamp: string;
  mood?: 'happy' | 'warm' | 'thirsty' | 'chilly' | 'sleepy';
}
