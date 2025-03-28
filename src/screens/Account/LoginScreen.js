import React, { useState, useEffect } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import queryString from 'query-string';

import { KFTC_CLIENT_ID, KFTC_CLIENT_SECRET, KFTC_REDIRECT_URI, KFTC_STATE } from '@env';

const LoginScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [authCode, setAuthCode] = useState(null);

  // 인증 코드로 access_token을 받는 함수
  const authUrl = `https://testapi.openbanking.or.kr/oauth/2.0/authorize?response_type=code&client_id=${KFTC_CLIENT_ID}&redirect_uri=${KFTC_REDIRECT_URI}&scope=login inquiry transfer&client_info=testa&state=${KFTC_STATE}&auth_type=0`;

  // --------------------------------------
  // [1] authCode 받으면 -> 토큰 요청 후 상태 저장
  // --------------------------------------
  useEffect(() => {
    const newAuthCode = route.params?.authCode; 
    if (newAuthCode && !token) {
      setLoading(true);
      getAccessToken(newAuthCode).then((accessToken) => {
        if (accessToken) {
          setToken(accessToken);
          setAuthCode(newAuthCode);
        } else {
          Alert.alert('토큰 요청 실패', '인증 토큰을 받아오지 못했습니다.');
        }
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
        queryString.stringify({
          grant_type: 'authorization_code',
          code: authCode,
          client_id: KFTC_CLIENT_ID,
          client_secret: KFTC_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
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
    <View style={{ padding: 20 }}>
      <Button title="로그인" onPress={handleLogin} />
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {/* 토큰이 있다면 화면에 표시 */}
      {token && !loading && (
        <Text style={{ marginTop: 20 }}>Access Token: {token}</Text>
      )}
      {/* 인증 코드는 받았지만 토큰이 아직 없다면 (예: 요청 실패 등) */}
      {authCode && !loading && !token && (
        <Text style={{ marginTop: 20 }}>Auth Code: {authCode}</Text>
      )}
    </View>
  );
}

export default LoginScreen;