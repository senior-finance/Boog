import React, { useState, useEffect } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { KFTC_CLIENT_ID, KFTC_CLIENT_SECRET, REDIRECT_URI } from '@env';

const LoginScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [authCode, setAuthCode] = useState(null);

  // 인증 코드로 access_token을 받는 함수
  const authUrl = `https://testapi.openbanking.or.kr/oauth/2.0/authorize?client_id=${KFTC_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=login`;

  // --------------------------------------
  // [1] authCode 받으면 -> 토큰 요청 후 상태 저장
  // --------------------------------------
  useEffect(() => {
    const newAuthCode = route.params?.authCode; 
    if (newAuthCode && !token) {
      setLoading(true);
      getAccessToken(newAuthCode).then((accessToken) => {
        setToken(accessToken);
        setAuthCode(newAuthCode);
        setLoading(false);
      });
    }
  }, [route.params?.authCode]);

  // --------------------------------------
  // [2] 토큰 요청 함수
  // --------------------------------------
  const getAccessToken = async (authCode) => {
    try {
      const response = await axios.post(
        'https://testapi.openbanking.or.kr/oauth/2.0/token',
        {
          grant_type: 'authorization_code',
          code: authCode,
          client_id: KFTC_CLIENT_ID,
          client_secret: KFTC_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('토큰 받기 실패:', error);
      return null;
    }
  };

  // --------------------------------------
  // [3] 로그인 버튼 → WebView로 이동
  // --------------------------------------
  const handleLogin = () => {
    setLoading(true);

    // 콜백 함수 대신 URL만 넘긴다
    navigation.navigate('WebView', { url: authUrl });
  };

  return (
    <View>
      <Button title="로그인" onPress={handleLogin} />
      {loading && <ActivityIndicator size="large" />}

      {/* 토큰이 있다면 화면에 표시 */}
      {token && !loading && <Text>Access Token: {token}</Text>}

      {/* 인증 코드는 받았지만 토큰이 아직 없다면 (예: 요청 실패 등) */}
      {authCode && !loading && !token && <Text>Auth Code: {authCode}</Text>}
    </View>
  );
}

export default LoginScreen;