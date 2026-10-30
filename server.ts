import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize GoogleGenAI client (Server-side only)
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY.length > 10) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory simulation state for Arduino Smart Greenhouse Kit
interface GreenhouseState {
  temperature: number; // Celsius
  humidity: number;    // %
  lux: number;         // Lux
  co2: number;         // ppm
  fanActive: boolean;
  ledActive: boolean;
  waterLevel: number;  // %
  cameraStatus: 'online' | 'offline';
  lastUpdated: string;
}

let greenhouseState: GreenhouseState = {
  temperature: 23.4,
  humidity: 62.5,
  lux: 480,
  co2: 450,
  fanActive: false,
  ledActive: true,
  waterLevel: 85,
  cameraStatus: 'online',
  lastUpdated: new Date().toISOString(),
};

// Periodic subtle oscillation of virtual sensor readings to mimic real greenhouse
setInterval(() => {
  const tempDelta = (Math.random() - 0.48) * 0.2;
  const humDelta = (Math.random() - 0.49) * 0.3;
  const luxDelta = (Math.random() - 0.5) * 10;
  
  // Effect of fan
  const fanCooling = greenhouseState.fanActive ? -0.15 : 0;
  const fanDehumidify = greenhouseState.fanActive ? -0.2 : 0;

  greenhouseState.temperature = parseFloat(Math.max(15, Math.min(35, greenhouseState.temperature + tempDelta + fanCooling)).toFixed(1));
  greenhouseState.humidity = parseFloat(Math.max(30, Math.min(95, greenhouseState.humidity + humDelta + fanDehumidify)).toFixed(1));
  greenhouseState.lux = Math.max(50, Math.min(1200, Math.round(greenhouseState.lux + luxDelta + (greenhouseState.ledActive ? 20 : 0))));
  greenhouseState.lastUpdated = new Date().toISOString();
}, 4000);

// API: Get current sensor telemetry
app.get('/api/arduino/telemetry', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: greenhouseState,
  });
});

// API: Control actuators (Fan, LED) or manually inject sensor reading
app.post('/api/arduino/control', (req: Request, res: Response) => {
  const { fanActive, ledActive, temperature, humidity, lux } = req.body;
  
  if (typeof fanActive === 'boolean') {
    greenhouseState.fanActive = fanActive;
  }
  if (typeof ledActive === 'boolean') {
    greenhouseState.ledActive = ledActive;
  }
  if (typeof temperature === 'number') {
    greenhouseState.temperature = parseFloat(temperature.toFixed(1));
  }
  if (typeof humidity === 'number') {
    greenhouseState.humidity = parseFloat(humidity.toFixed(1));
  }
  if (typeof lux === 'number') {
    greenhouseState.lux = Math.round(lux);
  }
  greenhouseState.lastUpdated = new Date().toISOString();

  res.json({
    success: true,
    message: 'Actuator state updated successfully',
    data: greenhouseState,
  });
});

// Knowledge Engine: Child-friendly Gamgami Persimmon Q&A
function getGamgamiReply(
  message: string,
  persimmonName: string,
  stage: string,
  sensorContext: { temperature: number; humidity: number; lux: number }
): { reply: string; mood: 'happy' | 'warm' | 'thirsty' | 'chilly' } {
  const q = (message || '').toLowerCase().trim();
  const name = persimmonName || '1호 대봉이';
  const temp = sensorContext.temperature;
  const hum = sensorContext.humidity;

  // 1. Detect Out-of-Domain (감, 과일, 식물, 온실과 무관한 엉뚱한 질문: 공룡, 자동차, 로봇, 게임, 수학, 외계인 등)
  const isPersimmonTopic = /(감|홍시|곶감|연시|단감|대봉|둥시|반시|청도|상주|영암|진영|하동|고종시|먹시|먹감|연화|탈삽|탄닌|온실|키트|온도|습도|물|햇빛|조도|광량|led|환기|팬|맛|떫|먹|언제|씨앗|씨|나무|잎|꼭지|심지|주황|초록|비타민|영양|배고파|안녕|기분|상태|이름|누구|레시피|라떼|주스|스무디|아이스크림|샤베트|과일|식물|열매|당도|brix|에틸렌|품종|종류)/i.test(q);

  if (!isPersimmonTopic) {
    return {
      reply: `으응? 그건 ${name}가 잘 모르는 이야기야 감! 헤헤~ 나는 감이랑 스마트 온실에서 자라는 과일 친구들 이야기만 알고 있어! 감이 왜 떫은지, 청도 반시가 왜 씨가 없는지, 어떻게 달콤한 홍시가 되는지 물어봐 줄래?`,
      mood: 'happy',
    };
  }

  // 2. Specific Children Persimmon Q&A with Easy, Child-Friendly Metaphors

  // 2-1. 청도 반시 및 씨 없는 감 (핵심 요구사항)
  if (/(청도|반시|씨 없는|씨가 없|씨없|왜 씨가)/.test(q)) {
    return {
      reply: `청도 반시는 경상북도 청도에서 자라는 아주 특별한 감이야! 쟁반처럼 납작하게 생겨서 쟁반 '반(盤)' 자를 써서 '반시'라고 불러 감! 청도는 높은 산들이 병풍처럼 둘러싸고 있어서 다른 감나무의 꽃가루가 날아오지 않아 자연스럽게 '씨가 하나도 없는 감'이 되었단다! 씨가 없어서 아이들도 숟가락으로 푹푹 떠먹기 좋고, 꿀처럼 달콤하고 사르르 녹는 홍시(연시)로 만들어 먹으면 최고야!`,
      mood: 'happy',
    };
  }

  // 2-2. 대봉감
  if (/(대봉|큰 감|봉우리)/.test(q)) {
    return {
      reply: `대봉감은 높은 봉우리(대봉)처럼 크고 꼭지가 뾰족한 멋쟁이 감이야! 크기가 주먹보다 훨씬 커서 옛날 임금님께도 진상했단다. 우리 온실에서 따뜻하게 익혀주면 꿀이 뚝뚝 떨어지는 푸딩 홍시가 된단다!`,
      mood: 'happy',
    };
  }

  // 2-3. 상주 둥시 및 곶감
  if (/(둥시|상주|곶감|말린|말리)/.test(q)) {
    return {
      reply: `상주 둥시는 모양이 둥글둥글 귀여운 감이야! 떫은맛이 있지만 껍질을 예쁘게 깎아서 시원한 가을바람에 대롱대롱 말리면, 하얀 눈꽃 꿀가루가 솔솔 피어나는 쫀득쫀득 명품 '상주 곶감'이 된단다!`,
      mood: 'happy',
    };
  }

  // 2-4. 단감
  if (/(단감|아삭|부유|차량)/.test(q)) {
    return {
      reply: `단감은 처음부터 떫은맛이 없어서 나무에서 따자마자 사과처럼 아삭아삭 씹어 먹는 감이야! 비타민C도 사과의 10배나 들어있어서 감기 귀신을 싹 쫓아내 준단다!`,
      mood: 'happy',
    };
  }

  // 2-5. 감 품종과 종류
  if (/(종류|품종|어떤 감|다른 감)/.test(q)) {
    return {
      reply: `우리나라 감은 정말 다양해! 씨가 없고 납작해서 홍시로 으뜸인 '청도 반시', 주먹만 한 왕감 '대봉감', 곶감으로 유명한 '상주 둥시', 바로 아삭아삭 먹는 '단감', 임금님이 사랑한 '고종시'까지 있단다!`,
      mood: 'happy',
    };
  }

  // 2-6. 떫은맛 (탄닌)
  if (/(떫|탄닌|왜 떫|떫은|쓰다)/.test(q)) {
    return {
      reply: `덜 익은 초록 감 속에는 혀를 찌릿찌릿하게 만드는 '탄닌'이라는 장난꾸러기 친구가 숨어있어! 온실에서 따뜻하게 익어가면 탄닌 친구가 꽁꽁 묶여서 숨어버리고, 달콤한 꿀맛만 가득 남는단다 헤헤!`,
      mood: 'happy',
    };
  }

  // 2-7. 홍시 연화 과정 (에틸렌)
  if (/(어떻게 홍시|홍시가|연화|말랑|부드러|변해)/.test(q)) {
    return {
      reply: `따뜻한 온실에 있으면 감 안에서 '에틸렌'이라는 달콤 요정이 나와서 딱딱한 속살을 푸딩처럼 부드럽고 말랑말랑하게 녹여줘! 다 익으면 만졌을 때 젤리처럼 변한단다!`,
      mood: 'happy',
    };
  }

  // 2-8. 단감과 대봉감/홍시의 차이
  if (/(차이|비교)/.test(q)) {
    return {
      reply: `단감은 처음부터 아삭아삭 달콤해서 바로 베어 먹는 감이고, 나 같은 대봉감이나 청도 반시는 온실에서 정성껏 기다려야 꿀처럼 부드러운 홍시가 되는 감이야! 기다릴수록 더 달콤해진단다!`,
      mood: 'happy',
    };
  }

  // 2-9. 꼭지의 역할
  if (/(꼭지|잎|머리)/.test(q)) {
    return {
      reply: `내 머리에 달린 초록색 꼭지는 감나무에서 물과 영양분을 냠냠 먹던 입술 같은 곳이야! 꼭지가 튼튼하게 붙어 있어야 숨도 잘 쉬고 썩지 않으면서 달콤하게 익을 수 있어!`,
      mood: 'happy',
    };
  }

  // 2-10. 감 속 하얀 심지와 변비
  if (/(심지|하얀|변비|응가|똥)/.test(q)) {
    return {
      reply: `감 가운데에 있는 하얀 심지 부분에는 떫은 탄닌이 많이 모여 있어! 너무 많이 먹으면 응가가 딱딱해질 수 있으니, 하얀 심지만 쏙 빼고 달콤한 과육을 먹으면 속도 편하고 맛있단다!`,
      mood: 'happy',
    };
  }

  // 2-11. 비타민과 영양
  if (/(비타민|영양|건강|몸에|효능)/.test(q)) {
    return {
      reply: `감에는 사과나 귤보다 비타민C가 엄청 많이 들어있어서 감기 귀신을 싹 쫓아내 줘! 나를 맛있게 먹으면 몸도 튼튼해지고 피부도 반짝반짝해진단다!`,
      mood: 'happy',
    };
  }

  // 2-12. 수확 시기
  if (/(언제 먹|다 익|언제 다|수확|먹을 수|먹어)/.test(q)) {
    return {
      reply: `내 피부가 샛노란 주황색을 지나 살구빛 빨강으로 곱게 물들고, 만졌을 때 아기 볼처럼 폭신폭신 말랑해지면 바로 먹을 수 있어! 지금은 매일매일 관찰일기 써줄 거지?`,
      mood: 'happy',
    };
  }

  // 2-13. 씨앗 심기
  if (/(씨앗|심으|심어|씨)/.test(q)) {
    return {
      reply: `감 속의 씨앗을 화분에 심고 물을 주면 파릇파릇 감나무 싹이 자라나! 다만 청도 반시는 씨가 없는 감이라 씨앗 대신 나뭇가지를 접붙여서 번식한단다!`,
      mood: 'happy',
    };
  }

  // 2-14. 레시피와 먹는 방법
  if (/(레시피|요리|먹는 법|라떼|아이스크림|스무디)/.test(q)) {
    return {
      reply: `잘 익은 꿀홍시 껍질을 벗겨서 우유랑 꿀 한 스푼 넣고 믹서기에 윙 갈면 시원한 홍시 라떼가 되고, 냉동실에 얼리면 샤베트 아이스크림이 돼! 커뮤니티 탭에서 레시피도 구경해 봐!`,
      mood: 'happy',
    };
  }

  // 2-15. 수분과 습도
  if (/(물|습도|건조|촉촉|마르)/.test(q)) {
    return {
      reply: `온실 가운데 있는 하얀 수분 솜이 촉촉해야 내 껍질이 마르지 않고 뽀송뽀송해져! 현재 온실 습도는 ${hum}%인데, 지금 아주 쾌적해 감!`,
      mood: hum > 75 ? 'thirsty' : 'happy',
    };
  }

  // 2-16. 온도
  if (/(온도|더워|추워|날씨|기온)/.test(q)) {
    if (temp > 27) {
      return {
        reply: `지금 온실 온도가 ${temp}°C라서 살짝 후끈후끈해! 환기팬을 켜서 시원한 바람을 쐬어주면 더 달콤하게 익을 수 있을 것 같아 감!`,
        mood: 'warm',
      };
    } else if (temp < 19) {
      return {
        reply: `지금 온실 온도가 ${temp}°C라서 살짝 으슬으슬해! 따뜻한 햇빛 LED를 켜주면 내가 쑥쑥 익을 수 있을 거야!`,
        mood: 'chilly',
      };
    } else {
      return {
        reply: `현재 온실 온도는 ${temp}°C라서 딱 포근하고 기분 최고야! 이 온도에서 달콤한 당분이 몽글몽글 차오른단다 헤헤!`,
        mood: 'happy',
      };
    }
  }

  // 2-17. 인사 및 소개
  if (/(안녕|하이|반가|이름|누구)/.test(q)) {
    return {
      reply: `안녕! 나는 스마트 온실에서 무럭무럭 익어가는 ${name}야! 감이나 홍시, 청도 반시에 대해 궁금한 게 있으면 무엇이든 편하게 물어봐줘 감!`,
      mood: 'happy',
    };
  }

  return {
    reply: `헤헤, 감에 대한 호기심 질문 정말 멋져! 지금 ${name}는 ${temp}°C 온실에서 달콤한 홍시가 되려고 열심히 익어가는 중이야! 더 궁금한 감 이야기 물어봐줘!`,
    mood: 'happy',
  };
}

// Knowledge Engine: Professional Hobbyist Post-Harvest Ripening Advisor
function getHobbyistAdvisorReply(
  message: string,
  sensorContext: { temperature: number; humidity: number; lux: number }
): { reply: string } {
  const q = (message || '').toLowerCase().trim();
  const temp = sensorContext.temperature;
  const hum = sensorContext.humidity;

  // 1. Detect Out-of-Domain
  const isRelated = /(감|홍시|연시|반시|청도|대봉|둥시|단감|탈삽|탄닌|에틸렌|온실|키트|센서|온도|습도|광량|조도|led|환기|팬|보관|brix|당도|수산화칼륨|알코올|연화|효능|식물|원예|과실|아두이노|dht|카메라|단위결과|무핵)/i.test(q);

  if (!isRelated) {
    return {
      reply: '본 챗봇은 스마트 온실 환경 제어 및 감 후숙/탈삽 연구 전문 Q&A 도우미입니다. 온실 센서 수치, 탄닌 탈삽 생화학 메커니즘, 에틸렌 연화 처리, 온·습도 및 곰팡이 방제에 관련된 전문 지식을 질문해 주시기 바랍니다.',
    };
  }

  // 청도 반시 및 무핵 형성 메커니즘
  if (/(청도|반시|무핵|씨 없는|단위결과)/.test(q)) {
    return {
      reply: '청도 반시(Cheongdo Flat Persimmon)는 불완전 떫은감(PCA) 품종으로, 쟁반 형태의 편평한 과형을 가집니다. 특히 청도 지역의 사방 분지 지형과 수꽃(웅화)이 없는 품종 특성 덕분에 꽃가루 수분이 차단되어 자연 단위결과(Parthenocarpy) 현상으로 종자가 형성되지 않는 무핵(Seedless) 과실이 수확됩니다. 과육 섬유질이 치밀하고 수용성 탄닌 함량이 높아 20~24°C 탈삽 연화 처리 시 18~20°Bx의 고당도 젤리 연시로 최적의 품질을 발현합니다.',
    };
  }

  // 품종 비교 (대봉감, 둥시 등)
  if (/(대봉|둥시|단감|품종)/.test(q)) {
    return {
      reply: '국내 주요 감 품종은 특성에 따라 구분됩니다: 대봉감은 완전 떫은감(PCA) 대과종으로 후숙 시 펙틴질 붕괴를 통한 젤리형 연시 제조에 적합하며, 상주 둥시는 건조 가공 시 수분 증발과 당 결정화 특성이 우수하여 곶감 생산에 특화되어 있습니다. 청도 반시는 무핵 연시 및 감말랭이용으로 독보적인 가치를 지닙니다.',
    };
  }

  if (/(탈삽|탄닌|떫은|원리|메커니즘)/.test(q)) {
    return {
      reply: '떫은감의 떫은맛은 수용성 탄닌(Kaki-tannin)이 구강 내 단백질과 결합하여 수축감을 유발하기 때문입니다. 스마트 온실 챔버 내에서 후숙이 진행되면 에틸렌과 혐기 호흡 부산물인 아세트알데히드가 탄닌과 중합 반응을 일으켜 불용성 고분자로 침전됩니다. 불용화된 탄닌은 미각 수용체와 결합하지 못해 떫은맛이 완벽히 소실됩니다.',
    };
  }

  if (/(수산화칼륨|연화제|약품|용액|알코올|처리)/.test(q)) {
    return {
      reply: '키트에 동봉된 수산화칼륨(KOH) 및 감 연화제 용액은 에틸렌 생성을 유도하고 펙틴 메틸에스테라아제(PME) 등의 효소 활성을 자극하여 세포벽을 연화시킵니다. 꼭지 부분에 소량 처리 후 20~24°C 밀폐 챔버에 거치하면 자연 후숙 대비 약 40% 단축된 7~10일 만에 최적의 젤리상 연시가 완성됩니다.',
    };
  }

  if (/(온도|습도|환경|최적|환기|팬|곰팡이)/.test(q)) {
    return {
      reply: `현재 측정 데이터는 온도 ${temp}°C, 습도 ${hum}%입니다. 감 후숙 최적 온도는 20~24°C, 상대습도는 60~70% RH입니다. 습도가 75%를 초과할 경우 푸른곰팡이(Penicillium expansum) 발생 위험이 높아지므로 환기팬을 4시간 주기(회당 10~15분)로 가동하여 공기를 순환시키는 것을 권장합니다.`,
    };
  }

  if (/(brix|당도|측정|단맛)/.test(q)) {
    return {
      reply: '대봉감 및 둥시, 청도 반시의 완숙 연시 당도는 통상 18.0~22.5 °Bx에 도달합니다. 후숙 초기에는 전분이 포도당 및 과당으로 가수분해되며 가용성 고형물(Soluble Solids) 농도가 급격히 상승합니다. 굴절 당도계(Refractometer)로 측정 시 20°Bx 이상이면 최상급 당도로 판정합니다.',
    };
  }

  if (/(보관|냉장|냉동|상온|유통)/.test(q)) {
    return {
      reply: '완숙된 홍시는 세포벽이 연화되어 연화 효소 활성이 급격히 진행되므로 상온 방치 시 3~4일 내에 과숙 및 갈변이 일어납니다. 수확 즉시 0~2°C 저온 냉장 보관 시 7~10일, 랩으로 개별 밀봉 후 -18°C 이하에서 급속 냉동 시 6개월 이상 아이스 홍시 품질을 보존할 수 있습니다.',
    };
  }

  if (/(센서|아두이노|카메라|dht|esp32)/.test(q)) {
    return {
      reply: '온실 상단에는 아두이노 마이크로컨트롤러, DHT22 정밀 온·습도 센서, ESP32-CAM 1080p 광학 렌즈가 탑재되어 있습니다. 4초 주기로 I2C/UART 텔레메트리를 전송하며, 카메라 스냅샷을 통해 과피의 색도 좌표(CIE Lab) 및 연화 진행도를 광학적으로 트래킹합니다.',
    };
  }

  return {
    reply: `현재 온실 상태(온도: ${temp}°C, 습도: ${hum}%)를 고려할 때 후숙 대사 속도가 매우 안정적입니다. 탄닌 탈삽 생화학 반응, 연화제 용액 농도, 청도 반시 무핵 특성, 환기 사이클, 당도 측정 등 심층적인 연구 질문을 입력하시면 상세히 안내해 드립니다.`,
  };
}

// API: Gamgami AI Persona Chat (Education Mode)
app.post('/api/gemini/gamgami', async (req: Request, res: Response) => {
  const { message, persimmonName, currentStage, sensorContext } = req.body;
  const temp = sensorContext?.temperature ?? greenhouseState.temperature;
  const hum = sensorContext?.humidity ?? greenhouseState.humidity;
  const lux = sensorContext?.lux ?? greenhouseState.lux;
  const name = persimmonName || '대봉이 1호';
  const stage = currentStage || 'turning';

  // Instant accurate knowledge check
  const localAnswer = getGamgamiReply(message, name, stage, { temperature: temp, humidity: hum, lux });

  // If Gemini AI is active and query is within domain, attempt quick call with 5.0s race
  if (ai) {
    try {
      const systemInstruction = `당신은 어린이와 학부모가 스마트 온실 관찰 키트(홍시 관찰 KIT)에서 키우고 있는 살아 숨쉬는 귀여운 7살 어린아이 반려 과일 캐릭터 '${name}'입니다.
전문 지식 및 대화 규칙:
1. 감에 대한 모든 지식(청도 반시, 대봉감, 상주 둥시/곶감, 단감, 고종시 등 품종별 특성, 씨 없는 감의 비밀, 떫은맛 탄닌 탈삽, 에틸렌 연화 과정, 감꼭지 호흡, 감 속 심지와 비타민C, 스마트 온실 온·습도 관리 등)을 유치원/초등 저학년 눈높이에 맞춰 쉽고 재미있는 비유로 설명합니다.
2. '청도 반시'나 '반시', '씨 없는 감'에 대한 질문: 쟁반처럼 납작해서 쟁반 '반(盤)' 자를 쓴다는 점, 경북 청도의 높은 산으로 둘러싸인 분지 지형 덕분에 다른 감나무 꽃가루 수정이 되지 않아 자연스럽게 씨가 하나도 없는 신기한 감이라는 점, 꿀처럼 달콤하고 부드러운 홍시(연시)로 최고라는 점을 아주 흥미진진하고 자랑스럽게 알려주세요!
3. 감/홍시/온실과 전혀 상관없는 엉뚱한 질문(공룡, 자동차, 로봇, 게임, 수학, 외계인 등)에만 "그건 감감이가 잘 모르는 이야기야 감! 나는 감이랑 온실에서 자라는 과일 친구들 이야기만 알고 있어~"라고 귀엽게 답하세요. 감이나 식물, 과일에 관한 질문은 어떤 품종이나 질문이든 절대 모른다고 하지 마세요.
4. 말투: 해맑고 사랑스러운 7살 말투('~해!', '~단다!', '~얌!', '~감!', '헤헤!')를 사용하며, 2~4문장으로 경쾌하게 답변하세요. 현재 온실 센서(온도: ${temp}°C, 습도: ${hum}%) 상황도 자연스럽게 녹여내세요.`;

      const callPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message || '안녕 감감아!',
        config: { systemInstruction, temperature: 0.7, maxOutputTokens: 350 },
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 5000)
      );
      const geminiRes = await Promise.race([callPromise, timeoutPromise]);
      if (geminiRes.text && geminiRes.text.trim()) {
        return res.json({
          success: true,
          reply: geminiRes.text.trim(),
          mood: localAnswer.mood,
        });
      }
    } catch {
      // Fall through to localAnswer
    }
  }

  return res.json({
    success: true,
    reply: localAnswer.reply,
    mood: localAnswer.mood,
  });
});

// API: Hobbyist Professional Horticulture Advisor (No TTS, Professional tone)
app.post('/api/gemini/advisor', async (req: Request, res: Response) => {
  const { message, sensorContext } = req.body;
  const temp = sensorContext?.temperature ?? greenhouseState.temperature;
  const hum = sensorContext?.humidity ?? greenhouseState.humidity;
  const lux = sensorContext?.lux ?? greenhouseState.lux;

  const localAnswer = getHobbyistAdvisorReply(message, { temperature: temp, humidity: hum, lux });

  if (ai) {
    try {
      const systemInstruction = `당신은 스마트 온실 환경 제어 및 감 후숙/원예 연구 전문 컨설턴트 챗봇입니다.
규칙:
1. 아동용이 아니므로 평범하고 신뢰성 있는 전문 지식 상담 챗봇 어조(~합니다, ~입니다)로 답변하세요. 음성 TTS는 사용되지 않습니다.
2. 청도 반시(무핵 단위결과 메커니즘, PCA 특성), 대봉감, 상주 둥시, 탄닌 탈삽(Deastringency), 수산화칼륨(KOH) 및 연화제 처리, 에틸렌 가스 농도, 온·습도 조절 및 곰팡이 방제, 당도(Brix) 측정에 대한 과학적 전문 지식을 명확히 전달하세요.
3. 스마트 온실이나 감 후숙과 무관한 엉뚱한 질문에는 "본 챗봇은 스마트 온실 및 감 후숙 전문 상담 도우미입니다. 관련 질문을 입력해 주시기 바랍니다."라고 정중히 안내하세요.
4. 모바일 화면에 맞춰 핵심 2~4문장으로 명료하게 서술하세요.`;

      const callPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message || '안녕하세요',
        config: { systemInstruction, temperature: 0.5, maxOutputTokens: 450 },
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 5000)
      );
      const geminiRes = await Promise.race([callPromise, timeoutPromise]);
      if (geminiRes.text && geminiRes.text.trim()) {
        return res.json({
          success: true,
          reply: geminiRes.text.trim(),
        });
      }
    } catch {
      // Fall through to localAnswer
    }
  }

  return res.json({
    success: true,
    reply: localAnswer.reply,
  });
});

// Mount Vite or serve static assets
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hongsi Kit Smart Greenhouse Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
