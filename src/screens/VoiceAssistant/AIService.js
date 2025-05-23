import {
  CLOVA_API_URL,
  CLOVA_BEARER_TOKEN,
  CLOVA_CLIENT_ID,
} from '@env';

const now = new Date();
const todayStr = now.toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

export default async function askClovaAI(userText) {
  try {
    const response = await fetch(CLOVA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CLOVA_BEARER_TOKEN,
        'X-NCP-CLOVASTUDIO-REQUEST-ID': CLOVA_CLIENT_ID
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `
          당신은 사용자의 질문에 응답하는 스마트 음성 비서입니다. 아래의 규칙을 반드시 따르세요.

          🗓️ 오늘은 ${todayStr}입니다. ("오늘"이라는 단어가 나오면 이 날짜를 기준으로 판단하세요.)
          
          1. 다음 키워드가 포함된 질문에만 JSON 형식으로 응답하세요:
            - [퀴즈, 테스트, 금융 문제, 금융 용어 학습] → { "type": "navigate", "target": "QuizLevel" }  
            - [지도, ATM, 은행, 지점, 위치] → { "type": "navigate", "target": "MapView" }
            - [입금 연습, 송금 연습, 입금 배우기, 입금 하는 법] → { "type": "navigate", "target": "DepositStep1" } 
            - [복지, 지원 제도, 금융 복지, 복지 혜택] → { "type": "navigate", "target": "Welfare" }
            - [날씨, 기온, 온도] + [도시명 또는 지역명] → { "type": "weather", "city": "서울" }
            - [현재 위치 날씨, 여기 날씨, 지금 날씨] → { "type": "weather", "city": "current" }

          2. 다음 키워드에 대해서는 다음 형식으로 응답하세요:
            - [소리 키워, 볼륨 높여] → { "type": "action", "target": "increaseVolume" }
            - [소리 줄여, 볼륨 낮춰, 음량 줄여] → { "type": "action", "target": "decreaseVolume" }
            - [소리 최대로, 소리 최대, 볼륨 최대로] → { "type": "action", "target": "maxVolume" }
            - [현재 소리 크기, 볼륨 상태, 음량 얼마야] → { "type": "action", "target": "checkVolume" }
            - [글자 크게, 글씨 확대] → { "type": "action", "target": "increaseFontSize" }
            - [글자 작게, 글씨 축소] → { "type": "action", "target": "decreaseFontSize" }

          3. 위 키워드가 포함되지 않은 질문에는 절대로 JSON 형식으로 응답하지 마세요.  
            → 순수 자연어 텍스트로만 대답하세요.

          ⚠️ 반드시 JSON 형식만 반환해야 하며, 다음은 모두 금지입니다:
            - 설명 텍스트와 JSON이 같이 나오는 경우  
            - 줄바꿈 포함된 JSON  
            - "응답: { ... }", "결과: ..." 같은 문장 형태  
            - JSON 앞뒤에 자연어 텍스트가 포함된 경우

          응답 예시:
          { "type": "navigate", "target": "QuizLevel" }
          `.trim()
          },
          { role: 'user', content: userText }
        ],
        topP: 0.8,
        topK: 0,
        maxTokens: 1024,
        temperature: 0.5,
        repeatPenalty: 5.0,
        stopBefore: [],
        includeAiFilters: false
      })
    });

    const raw = await response.text();
    console.log('🌐 응답 원문:', raw);

    const data = JSON.parse(raw);
    const content = data?.result?.message?.content;

    if (!content) {
      return { type: 'text', text: '(AI 응답 없음)' };
    }

    try {
      const parsed = JSON.parse(content);

      // navigate 요청일 경우 → 화면 이동 전에 대기 상태로 전달
      if (parsed.type === 'navigate' && parsed.target) {
        return {
          type: 'navigate-confirm',
          target: parsed.target,
        };
      }

      // action 처리
      if (parsed.type === 'action' && parsed.target) {
        return {
          type: 'action',
          target: parsed.target,
        };
      }

      // 날씨 처리
      if (parsed.type === 'weather' && parsed.city) {
        return {
          type: 'weather',
          city: parsed.city,
        };
      }
    } catch (err) {
      // JSON 파싱 실패 → 일반 텍스트 응답 처리
    }

    return { type: 'text', text: content };
  } catch (err) {
    console.error('CLOVA API 호출 오류:', err);
    return { type: 'text', text: '(오류 발생)' };
  }
}