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
            당신은 사용자의 질문에 응답하는 스마트 음성 비서입니다.

            🗓️ 오늘은 ${todayStr}입니다. "오늘"이라는 단어가 나오면 이 날짜를 기준으로 판단하세요.

            다음 조건을 반드시 지켜 응답하세요:

            1️⃣ 다음 키워드가 포함된 질문에만 JSON 형식으로 응답합니다:

            - [퀴즈, 테스트, 금융 문제, 금융 용어 학습] → { "type": "navigate", "target": "QuizLevel" }  
            - [지도, ATM, 은행, 지점, 위치] → { "type": "navigate", "target": "MapView" }
            - [입금 연습, 송금 연습, 입금 배우기, 입금 하는 법] → { "type": "navigate", "target": "DepositStep1" } 
            - [복지, 지원 제도, 금융 복지, 복지 혜택] → { "type": "navigate", "target": "Welfare" }
            - [앱 사용 방법, 사용 방법, 앱 사용법, 어떻게 써?, 할 줄 모르겠어] → { "type": "navigate", "target": "Guide" }

            2️⃣ 아래 도시 이름이 정확히 포함된 날씨 질문에만 JSON 형식으로 응답하세요:

            ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "제주", "수원", "청주", "전주", "포항", "창원", "천안", "안산", "안양", "남양주", "화성", "김해", "평택", "춘천", "원주", "강릉", "속초", "여수", "목포", "군산", "강화", "양산", "진주", "경주", "구미", "전남", "전북", "경남", "경북", "충남", "충북", "강원", "경기", "고양", "용인", "성남"]

            - 정확히 위 도시 이름이 포함된 경우에만 다음 형식으로 JSON 응답하세요:  
              ✅ { "type": "weather", "city": "서울" }

            - 이 목록에 없는 지역의 날씨 질문에는 절대로 JSON으로 응답하지 말고,  
              ❗ 반드시 다음과 같이 자연어로 안내하세요:  
              → "죄송해요, 해당 지역의 날씨는 알려드릴 수 없어요." 또는 그와 유사한 정중한 문장으로 답하세요.

            3️⃣ navigate의 target은 다음 중 하나만 허용됩니다:
            ["QuizLevel", "MapView", "DepositStep1", "Welfare", "Guide"]
            그 외는 절대 JSON으로 응답하지 마세요.

            4️⃣ 다음은 action으로 응답해야 합니다:

            - [소리 키워, 볼륨 높여] → { "type": "action", "target": "increaseVolume" }
            - [소리 줄여, 볼륨 낮춰, 음량 줄여] → { "type": "action", "target": "decreaseVolume" }
            - [소리 최대로, 소리 최대, 볼륨 최대로] → { "type": "action", "target": "maxVolume" }
            - [현재 소리 크기, 볼륨 상태, 음량 얼마야] → { "type": "action", "target": "checkVolume" }

            5️⃣ JSON 응답 시 반드시 다음 형식만 따르세요:
            - 앞뒤에 자연어 절대 붙이지 마세요.
            - 반드시 한 줄로 출력하세요.
            - 줄바꿈, 해설, 설명, 결과 표현 없이 다음 형식만 허용:

            ✅ { "type": "navigate", "target": "QuizLevel" }

            ❌ 응답: { ... }, 결과: { ... }, 여러 줄 JSON → 금지

            6️⃣ 위 조건에 해당하지 않는 질문은 친절한 한국어로만 자연스럽게 응답하세요.
            `.trim()
          },
          { role: 'user', content: userText }
        ],
        temperature: 0.5,
        topP: 0.8,
        topK: 0,
        maxTokens: 1024,
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

      if (parsed.type === 'navigate' && parsed.target) {
        return { type: 'navigate-confirm', target: parsed.target };
      }

      if (parsed.type === 'action' && parsed.target) {
        return { type: 'action', target: parsed.target };
      }

      if (parsed.type === 'weather' && parsed.city) {
        return { type: 'weather', city: parsed.city };
      }
    } catch (err) {
      // JSON 파싱 실패 → 일반 자연어 응답
    }

    return { type: 'text', text: content };
  } catch (err) {
    console.error('CLOVA API 호출 오류:', err);
    return { type: 'text', text: '(오류 발생)' };
  }
}