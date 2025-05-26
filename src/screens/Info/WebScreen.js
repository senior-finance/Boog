import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomText from '../../components/CustomText';

const WebScreen = ({ route }) => {
  const { url } = route.params;
  const [loading, setLoading] = useState(true); // 로딩 상태

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B7BE5" />
          <CustomText style={styles.loadingText}>로딩 중입니다...</CustomText>
        </View>
      )}
      <WebView
        source={{ uri: url }}
        onLoadStart={() => setLoading(true)} // 로딩 시작
        onLoadEnd={() => setLoading(false)} // 로딩 끝
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // WebView 위에 표시
  },
  loadingText: {
    marginTop: 15,
        color: '#333',
  },
});

export default WebScreen;
