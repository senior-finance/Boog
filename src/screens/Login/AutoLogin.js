import AsyncStorage from '@react-native-async-storage/async-storage';

// 자동로그인을 하기 위한 토큰 저장

export async function storeAuthSession({ provider, accessToken, userInfo }) {
  try {
    await AsyncStorage.multiSet([
      ['provider', provider],
      ['accessToken', accessToken],
      ['userInfo', JSON.stringify(userInfo)],
    ]);
  } catch (e) {
    console.log('토큰 저장 실패:', e);
  }
}

export async function getStoredAuthSession() {
  try {
    const [provider, accessToken, userInfoRaw] = await AsyncStorage.multiGet([
      'provider',
      'accessToken',
      'userInfo',
    ]);
    if (provider[1] && accessToken[1] && userInfoRaw[1]) {
      return {
        provider: provider[1],
        accessToken: accessToken[1],
        userInfo: JSON.parse(userInfoRaw[1]),
      };
    }
    return null;
  } catch (e) {
    console.log('토큰 불러오기 실패:', e);
    return null;
  }
}

// 로그아웃
export async function logoutSession() {
  try {
    await AsyncStorage.multiRemove(['provider', 'accessToken', 'userInfo']);
  } catch (e) {
    console.log('로그아웃 실패:', e);
  }
}