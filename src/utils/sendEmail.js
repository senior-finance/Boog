// src/utils/sendEmail.js
import emailjs from '@emailjs/browser';

export async function sendInquiryEmail({ title, content }) {
  const SERVICE_ID = 'service_xkqutes';
  const TEMPLATE_ID = 'template_9yxvb4w';
  const PUBLIC_KEY = 'hK1K2PVzCk6BcaQ9v';

  const data = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
      title,
      message: content,
      name: 'Boog Inquiry',
      email: 'boog8282@gmail.com',
    },
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log('✅ 이메일 전송 성공!');
      return true;
    } else {
      console.error('❌ 이메일 전송 실패:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('❌ 이메일 전송 중 오류:', error);
    return false;
  }
}
