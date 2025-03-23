import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { KFTC_CLIENT_ID, KFTC_CLIENT_SECRET, REDIRECT_URI } from '../../../.env';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [authCode, setAuthCode] = useState(null);

  // 인증 코드로 access_token을 받는 함수
  const getAccessToken = async (authCode) => {
    try {
      const response = await axios.post('https://api.iamport.kr/oauth/token', {
        grant_type: 'authorization_code',
        code: authCode,
        client_id: KFTC_CLIENT_ID,
        client_secret: KFTC_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      });
      return response.data.access_token;
    } catch (error) {
      console.error('토큰 받기 실패:', error);
      return null;
    }
  };

  // 인증 후 받은 코드로 토큰을 얻고 화면에 표시
  const handleLogin = async () => {
    setLoading(true);

    // env 선언부
    // 오픈뱅킹 로그인 URL로 리다이렉트
    const authUrl = `https://api.iamport.kr/authorize?client_id=${process.env.KFTC__CLIENT_ID}&redirect_uri=${process.env.KFTC_REDIRECT_URI}`;

    // WebView로 인증 페이지 열기
    navigation.navigate('WebView', {
      url: authUrl,
      onTokenReceived: async (authCode) => {
        setAuthCode(authCode);
        const token = await getAccessToken(authCode);
        setToken(token);
        setLoading(false);
      }
    });
  };

  return (
    <View>
      <Button title="로그인" onPress={handleLogin} />
      {loading && <ActivityIndicator size="large" />}
      {token && !loading && <Text>Access Token: {token}</Text>}
      {authCode && !loading && !token && <Text>Auth Code: {authCode}</Text>}
    </View>
  );
};

export default LoginScreen;
