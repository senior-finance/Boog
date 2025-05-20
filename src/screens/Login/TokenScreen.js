import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStoredAuthSession, storeAuthSession } from './AutoLogin';
import { useUser } from './UserContext';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import { NativeModules } from 'react-native';
import { mongoDB } from '../../database/mongoDB';

// 토큰이 있으면 자동 로그인

const NaverLogin = NativeModules.NaverLoginModule || require('@react-native-seoul/naver-login').default;

// MongoDB에서 user 데이터 가져오기
const getUserInfoFromDB = async (socialId) => {
  const result = await mongoDB('find', 'user', 'info', {
    query: { socialId },
    options: { limit: 1 },
  });

  const user = Array.isArray(result) ? result[0] : result?.documents?.[0];
  return user || null;
};

export default function TokenScreen() {
  const navigation = useNavigation();
  const { setUserInfo } = useUser();

  useEffect(() => {
    const tryAutoLogin = async () => {
      const session = await getStoredAuthSession();

      if (!session) {
        navigation.replace('Login');
        return;
      }

      const { provider, accessToken, userInfo } = session;

      try {
        if (provider === 'kakao') {
          await KakaoLogin.getProfile();
        } else if (provider === 'naver') {
          await NaverLogin.getProfile(accessToken);
        }

        const dbUser = await getUserInfoFromDB(userInfo.socialId);
        if (dbUser) {
          setUserInfo(dbUser);
          console.log('[자동 로그인] DB 사용자 정보 반영됨:', dbUser);
        } else {
          setUserInfo(userInfo);
          console.log('[자동 로그인] DB 조회 실패, 기존 userInfo 사용');
        }

        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } catch (err) {
        console.log('자동 로그인 실패:', err);
        navigation.replace('Login');
      }
    };

    tryAutoLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#4B7BE5" />
    </View>
  );
}