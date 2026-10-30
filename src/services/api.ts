import { SensorTelemetry, PersimmonStage } from '../types';

export async function fetchTelemetry(): Promise<SensorTelemetry> {
  try {
    const res = await fetch('/api/arduino/telemetry');
    if (!res.ok) throw new Error('Failed to fetch telemetry');
    const json = await res.json();
    return json.data;
  } catch (err) {
    // Fallback simulated sensor telemetry
    return {
      temperature: 23.2,
      humidity: 61.8,
      lux: 520,
      co2: 430,
      fanActive: false,
      ledActive: true,
      waterLevel: 80,
      cameraStatus: 'online',
      lastUpdated: new Date().toISOString(),
    };
  }
}

export async function updateActuators(controls: Partial<SensorTelemetry>): Promise<SensorTelemetry> {
  try {
    const res = await fetch('/api/arduino/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(controls),
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Actuator update API fallback:', err);
    return {
      temperature: controls.temperature ?? 23.2,
      humidity: controls.humidity ?? 61.8,
      lux: controls.lux ?? 520,
      fanActive: controls.fanActive ?? false,
      ledActive: controls.ledActive ?? true,
      waterLevel: 80,
      cameraStatus: 'online',
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Client-side fallback knowledge engine for Gamgami (Cheongdo Bansi, varieties, and persimmon biology)
function getClientGamgamiReply(
  message: string,
  persimmonName: string,
  sensorContext: { temperature: number; humidity: number; lux: number }
): { reply: string; mood: 'happy' | 'warm' | 'thirsty' | 'chilly' | 'sleepy' } {
  const q = (message || '').toLowerCase().trim();
  const name = persimmonName || '1호 대봉이';
  const temp = sensorContext.temperature;
  const hum = sensorContext.humidity;

  // 1. 청도 반시 및 씨 없는 감 (요구사항)
  if (/(청도|반시|씨 없는|씨가 없|씨없|왜 씨가)/.test(q)) {
    return {
      reply: `청도 반시는 경상북도 청도에서 자라는 아주 특별한 감이야! 쟁반처럼 납작하게 생겨서 쟁반 '반(盤)' 자를 써서 '반시'라고 불러 감! 청도는 높은 산들이 병풍처럼 둘러싸고 있어서 다른 감나무의 꽃가루가 날아오지 않아 자연스럽게 '씨가 하나도 없는 감'이 되었단다! 씨가 없어서 아이들도 숟가락으로 푹푹 떠먹기 좋고, 꿀처럼 달콤하고 사르르 녹는 홍시(연시)로 만들어 먹으면 최고야!`,
      mood: 'happy',
    };
  }

  // 2. 대봉감
  if (/(대봉|큰 감|봉우리)/.test(q)) {
    return {
      reply: `대봉감은 높은 봉우리(대봉)처럼 크고 꼭지가 뾰족한 멋쟁이 감이야! 크기가 주먹보다 훨씬 커서 옛날 임금님께도 진상했단다. 우리 온실에서 따뜻하게 익혀주면 꿀이 뚝뚝 떨어지는 푸딩 홍시가 된단다!`,
      mood: 'happy',
    };
  }

  // 3. 상주 둥시 및 곶감
  if (/(둥시|상주|곶감|말린|말리)/.test(q)) {
    return {
      reply: `상주 둥시는 모양이 둥글둥글 귀여운 감이야! 떫은맛이 있지만 껍질을 예쁘게 깎아서 시원한 가을바람에 대롱대롱 말리면, 하얀 눈꽃 꿀가루가 솔솔 피어나는 쫀득쫀득 명품 '상주 곶감'이 된단다!`,
      mood: 'happy',
    };
  }

  // 4. 단감
  if (/(단감|아삭|부유|차량)/.test(q)) {
    return {
      reply: `단감은 처음부터 떫은맛이 없어서 나무에서 따자마자 사과처럼 아삭아삭 씹어 먹는 감이야! 비타민C도 사과의 10배나 들어있어서 감기 귀신을 싹 쫓아내 준단다!`,
      mood: 'happy',
    };
  }

  // 5. 감 품종과 종류
  if (/(종류|품종|어떤 감|다른 감)/.test(q)) {
    return {
      reply: `우리나라 감은 정말 다양해! 씨가 없고 납작해서 홍시로 으뜸인 '청도 반시', 주먹만 한 왕감 '대봉감', 곶감으로 유명한 '상주 둥시', 바로 아삭아삭 먹는 '단감', 임금님이 사랑한 '고종시'까지 있단다!`,
      mood: 'happy',
    };
  }

  // 6. 떫은맛 (탄닌)
  if (/(떫|탄닌|왜 떫|떫은|쓰다)/.test(q)) {
    return {
      reply: `덜 익은 초록 감 속에는 혀를 찌릿찌릿하게 만드는 '탄닌'이라는 장난꾸러기 친구가 숨어있어! 온실에서 따뜻하게 익어가면 탄닌 친구가 꽁꽁 묶여서 숨어버리고, 달콤한 꿀맛만 가득 남는단다 헤헤!`,
      mood: 'happy',
    };
  }

  // 7. 홍시 연화 과정 (에틸렌)
  if (/(어떻게 홍시|홍시가|연화|말랑|부드러|변해)/.test(q)) {
    return {
      reply: `따뜻한 온실에 있으면 감 안에서 '에틸렌'이라는 달콤 요정이 나와서 딱딱한 속살을 푸딩처럼 부드럽고 말랑말랑하게 녹여줘! 다 익으면 만졌을 때 젤리처럼 변한단다!`,
      mood: 'happy',
    };
  }

  // 8. 비타민 / 영양
  if (/(비타민|영양|건강|몸에|효능)/.test(q)) {
    return {
      reply: `감에는 사과나 귤보다 비타민C가 엄청 많이 들어있어서 감기 귀신을 싹 쫓아내 줘! 나를 맛있게 먹으면 몸도 튼튼해지고 피부도 반짝반짝해진단다!`,
      mood: 'happy',
    };
  }

  // 9. 감꼭지
  if (/(꼭지|잎|머리)/.test(q)) {
    return {
      reply: `내 머리에 달린 초록색 꼭지는 감나무에서 물과 영양분을 냠냠 먹던 입술 같은 곳이야! 꼭지가 튼튼하게 붙어 있어야 숨도 잘 쉬고 썩지 않으면서 달콤하게 익을 수 있어!`,
      mood: 'happy',
    };
  }

  // 10. 온도와 온실
  if (/(온도|더워|추워|날씨|기온)/.test(q)) {
    return {
      reply: `현재 우리 온실 온도는 ${temp}°C, 습도는 ${hum}%야! 달콤한 홍시가 되기에 정말 기분 좋은 환경이란다 감!`,
      mood: 'happy',
    };
  }

  // 11. 무관한 질문 필터
  const isPersimmonTopic = /(감|홍시|곶감|연시|단감|대봉|둥시|반시|청도|상주|영암|진영|하동|고종시|먹시|먹감|연화|탈삽|탄닌|온실|키트|온도|습도|물|햇빛|조도|광량|led|환기|팬|맛|떫|먹|언제|씨앗|씨|나무|잎|꼭지|심지|주황|초록|비타민|영양|배고파|안녕|기분|상태|이름|누구|레시피|라떼|주스|스무디|아이스크림|샤베트|과일|식물|열매|당도|brix|에틸렌|품종|종류)/i.test(q);

  if (!isPersimmonTopic) {
    return {
      reply: `으응? 그건 ${name}가 잘 모르는 이야기야 감! 헤헤~ 나는 감이랑 스마트 온실에서 자라는 과일 친구들 이야기만 알고 있어! 청도 반시가 왜 씨가 없는지, 어떻게 달콤한 홍시가 되는지 물어봐 줄래?`,
      mood: 'happy',
    };
  }

  return {
    reply: `안녕! 나는 스마트 온실에서 달콤하게 자라는 ${name}야! 감에 대해 궁금한 점이나 청도 반시, 홍시 이야기를 물어보면 신나게 알려줄게 감!`,
    mood: 'happy',
  };
}

export async function chatWithGamgami(
  message: string,
  persimmonName: string,
  currentStage: PersimmonStage,
  sensorContext: { temperature: number; humidity: number; lux: number }
): Promise<{ reply: string; mood: 'happy' | 'warm' | 'thirsty' | 'chilly' | 'sleepy' }> {
  try {
    const res = await fetch('/api/gemini/gamgami', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        persimmonName,
        currentStage,
        sensorContext,
      }),
    });
    if (!res.ok) throw new Error('Chat API returned error');
    const json = await res.json();
    return {
      reply: json.reply,
      mood: json.mood || 'happy',
    };
  } catch (err) {
    // Intelligent client-side fallback
    return getClientGamgamiReply(message, persimmonName, sensorContext);
  }
}

export async function consultHobbyistAdvisor(
  message: string,
  sensorContext: { temperature: number; humidity: number; lux: number }
): Promise<{ reply: string }> {
  try {
    const res = await fetch('/api/gemini/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sensorContext,
      }),
    });
    if (!res.ok) throw new Error('Advisor API returned error');
    const json = await res.json();
    return {
      reply: json.reply,
    };
  } catch (err) {
    const q = (message || '').toLowerCase();
    if (/(청도|반시|무핵|씨 없는|단위결과)/.test(q)) {
      return {
        reply: '청도 반시(Cheongdo Flat Persimmon)는 불완전 떫은감(PCA) 품종으로, 쟁반 형태의 편평한 과형을 가집니다. 특히 청도 지역의 사방 분지 지형과 수꽃(웅화)이 없는 품종 특성 덕분에 꽃가루 수분이 차단되어 자연 단위결과(Parthenocarpy) 현상으로 종자가 형성되지 않는 무핵(Seedless) 과실이 수확됩니다. 과육 섬유질이 치밀하고 수용성 탄닌 함량이 높아 20~24°C 탈삽 연화 처리 시 18~20°Bx의 고당도 젤리 연시로 최적의 품질을 발현합니다.',
      };
    }
    return {
      reply: `현재 측정 데이터(온도: ${sensorContext.temperature}°C, 습도: ${sensorContext.humidity}%)를 고려할 때 후숙 대사 속도가 매우 안정적입니다. 청도 반시 무핵 메커니즘, 탄닌 탈삽 생화학 반응, 연화제 용액 농도, 환기 사이클, 당도(Brix) 측정 등 전문적인 질문을 입력하시면 상세히 안내해 드립니다.`,
    };
  }
}


// Web Speech API Text-to-Speech (Korean friendly voice)
export function speakText(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop prior speech
    const cleanText = text.replace(/[*#_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.12; // Cheerful, quick childlike cadence
    utterance.pitch = 1.72; // High-pitched, cute young child voice

    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural sounding Korean voices
    const koreanVoice = voices.find((v) => 
      (v.lang.startsWith('ko') || v.lang.includes('Korean')) && 
      (v.name.includes('Yuna') || v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female'))
    ) || voices.find((v) => v.lang.startsWith('ko'));

    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}
