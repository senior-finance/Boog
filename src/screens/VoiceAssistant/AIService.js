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
            { role: 'system', content: '당신은 음성 비서입니다.' },
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
  
      // ✅ 응답 원문을 먼저 텍스트로 받기
      const raw = await response.text();
      console.log('🌐 응답 원문:', raw);
  
      // ✅ 그 다음 JSON 파싱
      const data = JSON.parse(raw);
  
      if (data?.result?.message?.content) {
        return data.result.message.content;
      } else {
        console.warn('CLOVA 응답 에러:', data);
        return '(AI 응답 실패)';
      }
    } catch (err) {
      console.error('CLOVA API 호출 오류:', err);
      return '(오류 발생)';
    }
  }