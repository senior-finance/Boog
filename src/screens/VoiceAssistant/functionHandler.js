import Tts from 'react-native-tts';
import SystemSetting from 'react-native-system-setting';

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
      QuizLevel: '퀴즈',
      MapView: '지도',
      Welfare: '복지',
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

  else if (reply.text) {
    setChatHistory(prev => [...prev, { role: 'bot', text: reply.text }]);
    Tts.speak(reply.text);
  }
};