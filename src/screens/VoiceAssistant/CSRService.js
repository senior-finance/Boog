// CSRService.js
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { CSR_CLIENT_ID, CSR_CLIENT_SECRET } from '@env';

// CSR 전용 API 주소
const CSR_URL = 'https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor';

export default async function sendAudioToCSR(filePath) {
  try {
    const cleanPath = Platform.OS === 'android'
      ? filePath.replace('file://', '')
      : filePath;

    console.log('📁 파일 경로:', cleanPath);

    // 🔹 오디오 파일을 base64로 읽고 binary로 변환
    const base64Audio = await RNFS.readFile(cleanPath, 'base64');
    const binaryAudio = Buffer.from(base64Audio, 'base64');

    console.log('오디오 파일 읽기 완료. 바이트 수:', binaryAudio.length);

    // 🔗 CSR API에 raw binary 전송
    const response = await fetch(CSR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-NCP-APIGW-API-KEY-ID': CSR_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': CSR_CLIENT_SECRET,
      },
      body: binaryAudio,
    });

    const result = await response.json();

    if (result.text) {
      return result.text;
    } else {
      console.log('CSR 응답이 예상과 다릅니다:', result);
      return '(텍스트 인식 실패)';
    }
  } catch (err) {
    console.log('CSR API 오류:', err);
    return '(CSR 오류 발생)';
  }
}