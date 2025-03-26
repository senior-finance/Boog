import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'; // 그라데이션 임포트
// npm install react-native-linear-gradient

const MainScreen = ({ navigation }) => {
  const animatedWidth = useRef(new Animated.Value(100)).current; // 초기 높이 100
  const animatedHeight = useRef(new Animated.Value(100)).current; // 초기 높이 100
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(100);

  const toggleHeight = () => {
    const newWidth = width === 200 ? 240 : 200;
    const newHeight = height === 100 ? 120 : 100;
    setWidth(newWidth);
    setHeight(newHeight); // 상태 변경하여 새로운 높이로 설정

    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: newHeight,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedWidth, {
        toValue: newWidth,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const Color1 = ['#c955ff', '#008bff'];
  const [boxHeight, setBoxHeight] = useState(60);

  return (
    <LinearGradient colors={Color1} style={styles.container}>
      <Text style={styles.header}>테스트 화면</Text>

      {/* 라운드 박스: 그라데이션 배경 적용 */}
      <LinearGradient colors={Color1} style={[styles.roundBox, { elevation: 0 }]}>
        <Text style={styles.boxText}>잔액 123,456,789 원</Text>
      </LinearGradient>

      {/* 금융 학습 */}
      <TouchableOpacity
        style={[styles.roundBox, { height: boxHeight }]}
        onPress={() => navigation.navigate('Learning')}>
        <Text style={styles.boxText}>퀴즈 화면 이동</Text>
      </TouchableOpacity>

      {/* 네이버 지도 */}
      <TouchableOpacity
        style={[styles.roundBox, { height: boxHeight }]}
        onPress={() => navigation.navigate('MapView')}>
        <Text style={styles.boxText}>지도 화면 이동</Text>
      </TouchableOpacity>

      {/* 금융결제원 */}
      <TouchableOpacity
        style={[styles.roundBox, { height: boxHeight }]}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.boxText}>사용자 로그인</Text>
      </TouchableOpacity>

      {/* 프로필 화면 */}
      <TouchableOpacity
        style={[styles.roundBox, { height: boxHeight }]}
        onPress={() => navigation.navigate('MyInfo')}>
        <Text style={styles.boxText}>나의 프로필</Text>
      </TouchableOpacity>

      {/* 클로버 기반 AI 음성 대화 */}
      <TouchableOpacity
        style={[styles.roundBox, { height: boxHeight }]}
        onPress={() => navigation.navigate('VoiceInput')}>
        <Text style={styles.boxText}>AI 대화하기</Text>
      </TouchableOpacity>

      {/*지문 인증하기*/}
      <TouchableOpacity
        style={[styles.roundBox, { height: boxHeight }]}
        onPress={() => navigation.navigate('Biometric')}>
        <Text style={styles.boxText}>지문 인증 테스트</Text>
      </TouchableOpacity>

      {/* 메뉴 항목들 */}
      <View style={styles.menuContainer}></View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  roundBox: {
    width: '80%', // 박스 크기
    height: 80,
    backgroundColor: 'white',
    borderRadius: 20, // 라운드 처리
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // 그림자 추가
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10, // 안드로이드 그림자
    marginBottom: 20,
  },
  boxText: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default MainScreen;