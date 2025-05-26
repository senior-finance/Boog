import Tts from 'react-native-tts';

// ✅ 속도 설정
export const setTtsRate = (rate) => {
  Tts.setDefaultRate(rate);
};

// ✅ 높낮이 설정
export const setTtsPitch = (pitch) => {
  Tts.setDefaultPitch(pitch);
};

// ✅ 한 번에 설정
export const setTTSDefaults = ({ pitch = 1.0, rate = 0.5 }) => {
  Tts.setDefaultPitch(pitch);
  Tts.setDefaultRate(rate);
};

// ✅ 음성 읽기
export const speakText = (text) => {
  Tts.stop();
  Tts.speak(text);
};