import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppMode,
  UserRole,
  SensorTelemetry,
  PersimmonProfile,
  ObservationDiary,
  CommunityPost,
  ChatMessage,
} from '../types';
import { fetchTelemetry, updateActuators, chatWithGamgami } from '../services/api';

// Initial Mock Persimmon Profiles (Reflecting the 4-compartment square acrylic greenhouse kit)
const INITIAL_PERSIMMONS: PersimmonProfile[] = [
  {
    id: 'persimmon-1',
    name: '1호 대봉이',
    variety: 'daebong',
    varietyLabel: '대봉감 (떫은감·좌측 상단)',
    currentStage: 'turning',
    ripeningPercent: 68,
    sugarBrix: 17.5,
    daysElapsed: 9,
    avatarMood: 'happy',
    notes: '초록색에서 고운 주황색으로 변화 중. 온실 안 중앙 수분 패드와 가까워 꼭지 주변부터 부드러워지고 있음.',
  },
  {
    id: 'persimmon-2',
    name: '2호 단감이',
    variety: 'sweet',
    varietyLabel: '부유 단감 (우측 상단)',
    currentStage: 'ripe',
    ripeningPercent: 88,
    sugarBrix: 19.2,
    daysElapsed: 14,
    avatarMood: 'warm',
    notes: '아두이노 카메라 정면 관측 2호. 색상이 진한 홍색으로 빛남.',
  },
  {
    id: 'persimmon-3',
    name: '3호 말랑이',
    variety: 'bansi',
    varietyLabel: '청도 반시 (좌측 하단)',
    currentStage: 'hongsi',
    ripeningPercent: 96,
    sugarBrix: 21.0,
    daysElapsed: 18,
    avatarMood: 'happy',
    notes: '완전한 꿀홍시 상태! 만지면 푸딩처럼 말랑말랑하여 바로 디저트로 섭취 가능.',
  },
  {
    id: 'persimmon-4',
    name: '4호 둥시',
    variety: 'dungsi',
    varietyLabel: '상주 둥시 (우측 하단)',
    currentStage: 'turning',
    ripeningPercent: 54,
    sugarBrix: 16.0,
    daysElapsed: 7,
    avatarMood: 'happy',
    notes: '천연 연화제 용액과 함께 부드럽게 떫은맛이 줄어드는 중.',
  },
];

// Initial Observation Diaries
const INITIAL_DIARIES: ObservationDiary[] = [
  {
    id: 'diary-1',
    persimmonId: 'persimmon-1',
    persimmonName: '1호 대봉이',
    date: '2026-10-28',
    title: '4분할 스마트 키트 속 감들이 예쁘게 익어가요!',
    content: '아이와 함께 스마트 홍시 관찰 키트 뚜껑을 열어 향기를 맡아보았어요. 중앙 수분 패드 덕분에 감 껍질이 마르지 않고, 떫은 냄새 대신 달콤한 과일 향이 솔솔 납니다. 감감이가 온도가 딱 좋다고 방긋 웃었어요.',
    stage: 'turning',
    imageUrl: '/assets/aistudio/image_a036c6f8.png',
    temp: 23.1,
    humidity: 62.4,
    tags: ['4분할키트', '주황성장기', '자연관찰'],
  },
  {
    id: 'diary-2',
    persimmonId: 'persimmon-1',
    persimmonName: '1호 대봉이',
    date: '2026-10-25',
    title: '아두이노 센서 & 카메라 연동 완료',
    content: '아크릴 상단에 장착된 아두이노 보드와 카메라를 켜고 스마트폰 앱과 QR코드로 연동했어요. 내부 온도는 23도, 습도는 62%로 안정적으로 측정됩니다. 감감이와 첫 인사도 나누었습니다!',
    stage: 'green',
    imageUrl: '/src/assets/images/smart_persimmon_kit_1793277157840.jpg',
    temp: 22.0,
    humidity: 60.1,
    tags: ['키트설치', '아두이노연동', '첫관찰'],
  },
];

// Initial Community Posts
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: '민준이네 온실',
    authorRole: 'parent',
    category: 'recipe',
    title: '키트에서 완숙된 꿀홍시로 만든 홈메이드 홍시라떼 🍯',
    content: '스마트 키트에서 16일 동안 정성껏 후숙한 대봉 홍시의 껍질과 꼭지를 조심스레 벗겨낸 뒤, 우유 200ml와 꿀 한 스푼을 넣고 블렌더로 20초간 갈아주었어요! 인공 시럽 없이도 입안 가득 꿀맛이 팡팡 터져요. 아이도 엄지척 했습니다!',
    imageUrl: '/src/assets/images/hongsi_dessert_latte_1793276097126.jpg',
    likes: 24,
    comments: [
      { id: 'c1', author: '지우아빠', authorRole: 'parent', text: '저희 집 키트 속 홍시도 곧 완숙될 것 같은데 꼭 따라 해봐야겠어요!', date: '10분 전' },
      { id: 'c2', author: '예은맘', authorRole: 'parent', text: '홍시에 탄닌이 젤화되면서 우유와 부드럽게 섞여 아이 간식으로 최고네요.', date: '5분 전' },
    ],
    date: '2026-10-28',
    tags: ['홍시레시피', '홍시라떼', '건강간식', '아이간식'],
  },
  {
    id: 'post-2',
    author: '지안이네 온실',
    authorRole: 'parent',
    category: 'observation',
    title: '4구획 스마트 키트 아두이노 온·습도 센서 측정 팁 공유',
    content: '아크릴 키트 중앙 수분 솜에 물을 2스푼 적셔주니 내부 습도가 60~65%로 유지되어 감 연화제 효과가 2배 빨라졌어요! 상단 아두이노 보드의 녹색 LED가 정상 깜빡이면 센서가 스마트폰으로 실시간 데이터를 보내줍니다.',
    imageUrl: '/assets/aistudio/image_a036c6f8.png',
    likes: 31,
    comments: [
      { id: 'c3', author: '하율아빠', authorRole: 'parent', text: '중앙 수분 패드 팁 감사합니다! 오늘 바로 물 보충해 줬어요.', date: '1시간 전' },
    ],
    date: '2026-10-27',
    tags: ['스마트키트', '아두이노', '센서팁', '수분관리'],
  },
];

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: 'home' | 'lab' | 'diary' | 'community';
  setActiveTab: (tab: 'home' | 'lab' | 'diary' | 'community') => void;
  persimmons: PersimmonProfile[];
  activePersimmon: PersimmonProfile;
  setActivePersimmonId: (id: string) => void;
  sensorData: SensorTelemetry;
  sensorHistory: SensorTelemetry[];
  toggleFan: () => void;
  toggleLed: () => void;
  setSimulatedSensor: (params: Partial<SensorTelemetry>) => void;
  chatMessages: ChatMessage[];
  sendMessageToGamgami: (text: string) => Promise<void>;
  isChatLoading: boolean;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  diaries: ObservationDiary[];
  addDiary: (diary: Omit<ObservationDiary, 'id'>) => void;
  communityPosts: CommunityPost[];
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'date'>) => void;
  showQrModal: boolean;
  setShowQrModal: (show: boolean) => void;
  realArduinoIp: string;
  setRealArduinoIp: (ip: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('education');
  const [userRole, setUserRole] = useState<UserRole>('child');
  const [activeTab, setActiveTab] = useState<'home' | 'lab' | 'diary' | 'community'>('home');
  const [persimmons, setPersimmons] = useState<PersimmonProfile[]>(INITIAL_PERSIMMONS);
  const [activePersimmonId, setActivePersimmonId] = useState<string>('persimmon-1');

  const [sensorData, setSensorData] = useState<SensorTelemetry>({
    temperature: 23.4,
    humidity: 62.5,
    lux: 480,
    co2: 450,
    fanActive: false,
    ledActive: true,
    waterLevel: 85,
    cameraStatus: 'online',
    lastUpdated: new Date().toISOString(),
  });

  const [sensorHistory, setSensorHistory] = useState<SensorTelemetry[]>([]);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [realArduinoIp, setRealArduinoIp] = useState<string>('192.168.1.120');

  const [diaries, setDiaries] = useState<ObservationDiary[]>(INITIAL_DIARIES);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'gamgami',
      text: '안녕! 나는 스마트 온실에서 달콤하게 자라는 감감이 감! 🍊 오늘 온실 공기가 정말 상쾌해~ 나한테 궁금한 점이나 기분을 물어봐줘!',
      timestamp: '방금',
      mood: 'happy',
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const activePersimmon = persimmons.find((p) => p.id === activePersimmonId) || persimmons[0];

  // Poll sensor telemetry every 4 seconds
  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      const data = await fetchTelemetry();
      if (!isMounted) return;
      setSensorData(data);
      setSensorHistory((prev) => {
        const next = [...prev, data];
        return next.length > 20 ? next.slice(next.length - 20) : next;
      });
    }, 4000);

    // Initial load
    fetchTelemetry().then((data) => {
      if (isMounted) {
        setSensorData(data);
        setSensorHistory([data]);
      }
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const toggleFan = async () => {
    const nextState = !sensorData.fanActive;
    setSensorData((prev) => ({ ...prev, fanActive: nextState }));
    await updateActuators({ fanActive: nextState });
  };

  const toggleLed = async () => {
    const nextState = !sensorData.ledActive;
    setSensorData((prev) => ({ ...prev, ledActive: nextState }));
    await updateActuators({ ledActive: nextState });
  };

  const setSimulatedSensor = async (params: Partial<SensorTelemetry>) => {
    setSensorData((prev) => ({ ...prev, ...params }));
    await updateActuators(params);
  };

  const sendMessageToGamgami = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await chatWithGamgami(
        text,
        activePersimmon.name,
        activePersimmon.currentStage,
        {
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          lux: sensorData.lux,
        }
      );

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'gamgami',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: res.mood,
      };

      setChatMessages((prev) => [...prev, botMsg]);

      // Update avatar mood on active persimmon
      setPersimmons((prev) =>
        prev.map((p) => (p.id === activePersimmon.id ? { ...p, avatarMood: res.mood } : p))
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  const addDiary = (diary: Omit<ObservationDiary, 'id'>) => {
    const newEntry: ObservationDiary = {
      ...diary,
      id: `diary-${Date.now()}`,
    };
    setDiaries((prev) => [newEntry, ...prev]);
  };

  const toggleLikePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: userRole === 'child' ? '어린이 탐구자' : '학부모 집사',
      authorRole: userRole,
      text,
      date: '방금',
    };
    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  const addPost = (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'date'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      likes: 0,
      comments: [],
      date: '오늘',
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        persimmons,
        activePersimmon,
        setActivePersimmonId,
        sensorData,
        sensorHistory,
        toggleFan,
        toggleLed,
        setSimulatedSensor,
        chatMessages,
        sendMessageToGamgami,
        isChatLoading,
        ttsEnabled,
        setTtsEnabled,
        diaries,
        addDiary,
        communityPosts,
        toggleLikePost,
        addComment,
        addPost,
        showQrModal,
        setShowQrModal,
        realArduinoIp,
        setRealArduinoIp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
