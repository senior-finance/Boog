import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'sound_volume_setting';

export const saveSetting = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.log('설정 저장 실패:', err);
  }
};

export const loadSetting = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (err) {
    console.log('설정 불러오기 실패:', err);
    return null;
  }
};

export const resetSetting = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.log('설정 초기화 실패:', err);
  }
};