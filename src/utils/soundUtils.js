import Sound from 'react-native-sound';

// 사운드 초기화 시 enableInSilenceMode도 true로 하면 무음 모드에서도 재생됨
Sound.setCategory('Playback', true);

let soundInstance = null;
let currentVolume = 1.0; // 기본 100%

// 🔊 사운드 로드 및 캐싱
export const loadSound = (fileName, onLoaded = () => {}) => {
  if (soundInstance) {
    soundInstance.release(); // 이전 사운드 정리
  }

  soundInstance = new Sound(fileName, Sound.MAIN_BUNDLE, (error) => {
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
    console.warn('⚠️ 사운드가 로드되지 않았습니다.');
    return;
  }

  soundInstance.setVolume(currentVolume);
  soundInstance.play((success) => {
    if (!success) {
      console.error('❌ 사운드 재생 실패');
    }
  });
};

// 🔁 반복 재생
export const playLoop = () => {
  if (soundInstance) {
    soundInstance.setNumberOfLoops(-1); // 무한 반복
    soundInstance.play();
  }
};

// ⏹️ 정지
export const stopSound = () => {
  if (soundInstance) {
    soundInstance.stop(() => {});
  }
};

// 🔉 음량 설정 (0.0 ~ 1.0)
export const setSoundVolume = (volume) => {
  currentVolume = volume;
  if (soundInstance) {
    soundInstance.setVolume(volume);
  }
};

// 🔍 현재 음량 확인
export const getSoundVolume = () => {
  return currentVolume;
};