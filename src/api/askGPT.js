// askGPT.js

export default async function askGPT(userText) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // 여기에 발급받은 API 키 입력
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // 기본 모델 사용
          messages: [
            { role: 'user', content: userText }
          ],
          temperature: 0.5,
          max_tokens: 1024,
        })
      });
  
      const data = await response.json();
  
      // OpenAI 응답 구조: data.choices[0].message.content
      const content = data?.choices?.[0]?.message?.content;
  
      if (!content) {
        return { type: 'text', text: '(GPT 응답 없음)' };
      }
  
      // JSON 형식 응답인지 판단
      try {
        const parsed = JSON.parse(content);
        if (parsed.type === 'navigate' && parsed.target) {
          return { type: 'navigate', target: parsed.target };
        } else if (parsed.type === 'navigate-confirm' && parsed.target) {
          return { type: 'navigate-confirm', target: parsed.target };
        } else if (parsed.type === 'action' && parsed.target) {
          return { type: 'action', target: parsed.target };
        }
      } catch {
        // JSON이 아니면 일반 텍스트로 처리
      }
  
      return { type: 'text', text: content };
    } catch (err) {
      console.error('GPT 호출 오류:', err);
      return { type: 'text', text: '(오류 발생)' };
    }
  }
  