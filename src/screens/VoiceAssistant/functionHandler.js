import Tts from 'react-native-tts';
import SystemSetting from 'react-native-system-setting';
import { getWeather } from './getWeather';
import { getWeatherByCurrentLocation } from './getWeather';

export const handleFunctionCalling = async ({
  reply,
  navigation,
  setChatHistory,
  setConfirmTarget,
  setShowConfirmModal,
  setSystemVolume,
}) => {
  if (!reply || typeof reply !== 'object') return;

  if (reply.type === 'navigate-confirm') {
    const screenNameMap = {
      QuizLevel: '금융 용어 학습',
      MapView: 'ATM/은행 찾기',
      Welfare: '복지 혜택',
      DepositStep1: '입금 연습'
    };

    const readableName = screenNameMap[reply.target] || reply.target;
    const visibleText = `'${readableName}' 화면으로 이동할까요?`;
    const spokenText = `'${readableName}' 화면으로 이동할까요?`;

    setConfirmTarget(reply.target);
    setShowConfirmModal(true);
    setChatHistory(prev => [...prev, { role: 'bot', text: visibleText }]);
    Tts.speak(spokenText);
  }

  else if (reply.type === 'navigate') {
    navigation.navigate(reply.target);
  }

  else if (reply.type === 'action') {
    if (reply.target === 'increaseVolume') {
      const current = await SystemSetting.getVolume();
      const newVolume = Math.min(1, current + 0.2);
      await SystemSetting.setVolume(newVolume);

      if (setSystemVolume) {
        setSystemVolume(newVolume);
      }

      const percent = Math.round(newVolume * 100);
      const responseText = `소리를 ${percent}%로 키웠어요.`;

      setChatHistory(prev => [...prev, { role: 'bot', text: responseText }]);
      Tts.speak(responseText);
    }

    else if (reply.target === 'maxVolume') {
      const newVolume = 1.0;
      await SystemSetting.setVolume(newVolume);

      if (setSystemVolume) {
        setSystemVolume(newVolume);
      }

      setChatHistory(prev => [...prev, { role: 'bot', text: '소리를 최대로 키웠어요.' }]);
      Tts.speak('소리를 최대로 키웠어요.');
    }

  else if (reply.target === 'decreaseVolume') {
    const current = await SystemSetting.getVolume();
    const newVolume = Math.max(0, current - 0.2);
    await SystemSetting.setVolume(newVolume);

    if (setSystemVolume) {
      setSystemVolume(newVolume);
    }

    const percent = Math.round(newVolume * 100);
    const responseText = `소리를 ${percent}%로 줄였어요.`;

    setChatHistory(prev => [...prev, { role: 'bot', text: responseText }]);
    Tts.speak(responseText);
  }

  else if (reply.target === 'checkVolume') {
    const current = await SystemSetting.getVolume(); // 0.0 ~ 1.0
    const percent = Math.round(current * 100);

    const responseText = `현재 소리 크기는 ${percent}%입니다.`;
    setChatHistory(prev => [...prev, { role: 'bot', text: responseText }]);
    Tts.speak(responseText);

    console.log('🔎 현재 볼륨 확인됨:', percent);
  }

    else {
      console.log('⚠️ 알 수 없는 액션:', reply.target);
    }
  }

  // ✅ 현재 위치 기반 날씨 처리
  else if (reply.type === 'weather' && reply.city === 'current') {
    const data = await getWeatherByCurrentLocation();

    if (data.error) {
      setChatHistory(prev => [...prev, { role: 'bot', text: data.error }]);
      Tts.speak(data.error);
      return;
    }

    const iconMap = {
      '맑음': '☀️',
      '구름조금': '🌤️',
      '흐림': '☁️',
      '비': '🌧️',
      '눈': '🌨️',
      '비/눈': '🌦️',
      '소나기': '🌦️',
    };

    const emoji = iconMap[data.condition] || '';
    const message = `현재 위치의 날씨는 ${data.condition} ${emoji}, 기온은 ${data.temp}도이고, 습도는 ${data.humidity}%입니다.`;
    setChatHistory(prev => [...prev, { role: 'bot', text: message }]);
    Tts.speak(message);

    console.log('📍 현재 위치 날씨 안내:', message);
    return;
  }

  // ✅ 기존 도시 이름 기반 날씨 처리
  else if (reply.type === 'weather' && reply.city) {
    const normalizeCityName = (name) => name.replace(/(도|시|군)$/, '');
    const cityName = normalizeCityName(reply.city);

    const data = await getWeather(cityName); // 문자열 그대로 넘기면 getWeather 안에서 격자 처리됨

    if (data.error) {
      setChatHistory(prev => [...prev, { role: 'bot', text: data.error }]);
      Tts.speak(data.error);
      return;
    }

    const iconMap = {
      '맑음': '☀️',
      '구름조금': '🌤️',
      '흐림': '☁️',
      '비': '🌧️',
      '눈': '🌨️',
      '비/눈': '🌦️',
      '소나기': '🌦️',
    };

    const emoji = iconMap[data.condition] || '';
    const message = `${cityName}의 현재 날씨는 ${data.condition} ${emoji}, 기온은 ${data.temp}도이고, 습도는 ${data.humidity}%입니다.`;
    setChatHistory(prev => [...prev, { role: 'bot', text: message }]);
    Tts.speak(message);

    console.log('🌤️ 기상청 날씨 안내:', message);
  }

  else if (reply.text) {
    setChatHistory(prev => [...prev, { role: 'bot', text: reply.text }]);
    Tts.speak(reply.text);
  }
};