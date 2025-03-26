import { Platform } from 'react-native';
import { CSR_CLIENT_ID, CSR_CLIENT_SECRET } from '@env';

// CSR API 엔드포인트
const CSR_URL = 'https://clovaspeech-gw.ncloud.com/recognizer/upload';

export default async function sendAudioToCSR(filePath) {
  try {
    // Android 파일 경로 처리
    const cleanPath = Platform.OS === 'android'
      ? filePath.replace('file://', '')
      : filePath;

    const formData = new FormData();
    formData.append('media', {
      uri: filePath,
      type: 'audio/mp4', // 녹음 형식에 따라 변경 가능 (m4a, wav 등)
      name: 'voice.mp4',
    });

    // CSR 요청 (비동기)
    const response = await fetch(CSR_URL, {
      method: 'POST',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': CSR_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': CSR_CLIENT_SECRET,
      },
      body: formData,
    });

    const data = await response.json();

    // 성공 시 텍스트 추출
    if (data.text) {
      return data.text;
    } else {
      console.warn('CSR 응답이 예상과 다릅니다:', data);
      return '(텍스트 인식 실패)';
    }
  } catch (error) {
    console.error('CSR API 오류:', error);
    throw error;
  }
}