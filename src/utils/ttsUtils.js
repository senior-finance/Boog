import Tts from 'react-native-tts';

// ✅ 음성 설정
export const setTtsVoice = (voiceId) => {
  Tts.setDefaultVoice(voiceId);
};

// ✅ 속도 설정
export const setTtsRate = (rate) => {
  Tts.setDefaultRate(rate);
};

// ✅ 높낮이 설정
export const setTtsPitch = (pitch) => {
  Tts.setDefaultPitch(pitch);
};

// ✅ 한 번에 설정
export const setTTSDefaults = ({ voice, pitch = 1.0, rate = 0.5 }) => {
  if (voice) Tts.setDefaultVoice(voice);
  Tts.setDefaultPitch(pitch);
  Tts.setDefaultRate(rate);
};

// ✅ 음성 읽기
export const speakText = (text) => {
  Tts.stop();
  Tts.speak(text);
};

// ✅ 한국어 음성 필터링
export const getAvailableKoreanVoices = async () => {
  const voices = await Tts.voices();
  return voices.filter(
    (v) => v.language === 'ko-KR' && !v.networkConnectionRequired
  );
};

// ✅ 사용자 친화적인 음성 이름
export const koreanVoiceNameMap = {
  'ko-kr-x-ism-local': '여성1 (조용함)',
  'ko-kr-x-kod-local': '남성1 (표준)',
  'ko-kr-x-kob-local': '여성2 (차분함)',
  'ko-kr-x-koc-local': '남성2 (차분함)',
  'ko-KR-language': '기본 한국어 음성',
};