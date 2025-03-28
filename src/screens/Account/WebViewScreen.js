import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import queryString from 'query-string'; // ✅ query-string 패키지 사용

const WebViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  // URL 확인을 위한 console.log
  useEffect(() => {
    console.log('📌 요청한 URL:', route.params?.url); // 여기에서 URL 확인
    if (route.params?.url) {
      setLoading(false);
    }
  }, [route.params?.url]);  // URL이 변경될 때마다 출력

  const onNavigationStateChange = (event) => {
    console.log('Navigation URL:', event.url)
    try {
      if (event.url.includes('redirect_uri')) {
        const parsed = queryString.parseUrl(event.url);
        const authCode = parsed.query.code;

        if (authCode) {
          // 함수가 아니라 "authCode" 데이터만 전달
          navigation.navigate('Login', { authCode });
        }
      }
    } catch (error) {
      console.error('Navigation state change error:', error);
    }
  };

  if (!route.params?.url) {
    return null; // URL이 없으면 렌더링 X
  }

  return (
    <WebView
      source={{ uri: route.params.url }}
      mixedContentMode="always"
      onNavigationStateChange={onNavigationStateChange}
      onLoadEnd={() => setLoading(false)}
      startInLoadingState={true}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('🚨 WebView Error:', nativeEvent);
        alert(`WebView Error: ${nativeEvent.description}`);
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error(`🚨 HTTP Error! 상태 코드: ${nativeEvent.statusCode}`);
        alert(`HTTP Error: ${nativeEvent.statusCode}`);
      }}
    />

  )
};

export default WebViewScreen;