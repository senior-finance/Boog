import {
  CLOVA_API_URL,
  CLOVA_BEARER_TOKEN,
  CLOVA_CLIENT_ID,
} from '@env';

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
          당신은 사용자의 질문을 돕는 스마트 음성 비서입니다.
          
          질문에 따라 응답은 반드시 다음 형식을 따라야 합니다.
          
          ---
          
          1. 다음 키워드가 포함된 질문만 **navigate 형식으로 응답**하세요:
          
          [퀴즈, 테스트] → "QuizLevel"  
          [지도, ATM, 은행, 지점, 위치] → "MapSearch"  
          [복지, 지원 제도, 금융 복지] → "Welfare"
          
          ✅ 예:
          { "type": "navigate", "target": "QuizLevel" }
          
          ---
          
          2. 다음 키워드가 포함된 질문은 **action 형식으로 응답**하세요:
          
          [소리 키워, 볼륨 높여, 음량 줄여] → "increaseVolume" 또는 "decreaseVolume"  
          [글자 크게, 글씨 확대, 글자 작게] → "increaseFontSize" 또는 "decreaseFontSize"
          
          ✅ 예:
          { "type": "action", "target": "increaseFontSize" }
          
          ---
          
          3. 위에 정의되지 않은 질문에는 **절대로 JSON으로 응답하지 마세요.**  
          오직 자연어 텍스트로만 답변하세요.
          
          ❌ 금지된 예:
          "응답: { \"type\": \"navigate\", ... }"  
          "결과: {...}"  
          "다음 화면으로 이동합니다\n{...}"
          `.trim()
          },
          { role: 'user', content: userText }
        ],
        topP: 0.8,
        topK: 0,
        maxTokens: 1024,
        temperature: 0.7,
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

    // content가 JSON 문자열이면 navigate로 처리
    try {
      const parsed = JSON.parse(content);
      if (parsed.type === 'navigate' && parsed.target) {
        return { type: 'navigate', target: parsed.target };
      }
    } catch (err) {
      // JSON 아님 → 텍스트로 처리
    }

    // 일반 텍스트 응답
    return { type: 'text', text: content };
  } catch (err) {
    console.error('CLOVA API 호출 오류:', err);
    return { type: 'text', text: '(오류 발생)' };
  }
}