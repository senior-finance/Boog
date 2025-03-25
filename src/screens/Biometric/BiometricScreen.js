import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

export default function BiometricScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometryType, setBiometryType] = useState(null);

  // ✅ 생체 인증 실행 함수
  const handleAuthentication = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    // ✅ 생체 인증 가능 여부 확인
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      Alert.alert('에러', '이 기기는 생체 인증을 지원하지 않습니다.');
      return;
    }

    if (!biometryType) {
      Alert.alert('알림', '사용 가능한 생체 인증이 없습니다.');
      return;
    }

    setBiometryType(biometryType);

    const promptMessage =
      biometryType === 'Face ID' ? 'Face ID 인증' : '지문 인증';

    const { success } = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText: '취소',
    });

    if (success) {
      setIsAuthenticated(true);
      Alert.alert('인증 성공', `${biometryType} 인증이 완료되었습니다.`);
    } else {
      Alert.alert(
        '인증 실패',
        '생체 인증이 실패했습니다. 비밀번호 인증을 사용하시겠습니까?',
        [
          { text: '아니요', style: 'cancel' },
          { text: '비밀번호 입력', onPress: () => console.log('비밀번호 입력 실행') },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔒 생체 인증 테스트</Text>

      <TouchableOpacity style={styles.authButton} onPress={handleAuthentication}>
        <Text style={styles.buttonText}>지문 인증 시도하기</Text>
      </TouchableOpacity>

      {isAuthenticated && (
        <Text style={styles.successText}>✅ 인증 완료 ({biometryType})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  authButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  successText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
});