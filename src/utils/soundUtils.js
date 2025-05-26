import Sound from 'react-native-sound';

// 사운드 초기화
Sound.setCategory('Playback', true);

let soundInstance = null;
let currentVolume = 1.0;

// 사운드 파일 import (정적 경로)
const soundFile = require('../assets/sounds/correct.mp3');

// 🔊 사운드 로드
export const loadSound = (onLoaded = () => {}) => {
  if (soundInstance) {
    soundInstance.release();
  }

  soundInstance = new Sound(soundFile, (error) => {
    if (error) {
      console.error('🔈 사운드 로드 실패:', error);
      return;
    }
    soundInstance.setVolume(currentVolume);
    onLoaded();
  });
};

// ▶️ 사운드 재생
export const playSound = () => {
  if (!soundInstance) {
    console.warn('사운드가 로드되지 않았습니다.');
    return;
  }

  soundInstance.setVolume(currentVolume);
  soundInstance.play((success) => {
    if (!success) {
      console.error('사운드 재생 실패');
    }
  });
};

// 🔁 반복 재생
export const playLoop = () => {
  if (soundInstance) {
    soundInstance.setNumberOfLoops(-1);
    soundInstance.play();
  }
};

// ⏹️ 정지
export const stopSound = () => {
  if (soundInstance) {
    soundInstance.stop(() => {});
  }
};

// 🔉 음량 설정
export const setSoundVolume = (volume) => {
  currentVolume = volume;
  if (soundInstance) {
    soundInstance.setVolume(volume);
  }
};

// 🔍 음량 확인
export const getSoundVolume = () => currentVolume;