import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import CustomText from '../../components/CustomText';
import CustomModal from '../../components/CustomModal';

export default function BiometricScreen() {
  // 커스텀 모달
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState([]);

  const showModal = (title, message, buttons = [{ text: '확인', onPress: () => setModalVisible(false), color: '#4B7BE5' }]) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons);
    setModalVisible(true);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometryType, setBiometryType] = useState(null);

  // 생체 인증 실행 함수
  const handleAuthentication = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    // 생체 인증 가능 여부 확인
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      showModal('에러', '이 기기는 생체 인증을 지원하지 않습니다.');
      return;
    }

    if (!biometryType) {
      showModal('알림', '사용 가능한 생체 인증이 없습니다.');
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
      showModal('인증 성공', `${biometryType} 인증이 완료되었습니다.`);
    } else {
      showModal(
        '인증 실패',
        '생체 인증이 실패했습니다. 비밀번호 인증을 사용하시겠습니까?',
        [
          { text: '아니요', onPress: () => setModalVisible(false), color: '#ccc', textColor: 'black' },
          { text: '비밀번호 입력', onPress: () => console.log('비밀번호 입력 실행'), color: '#4B7BE5' },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>생체 인증 테스트</CustomText>

      <TouchableOpacity style={styles.authButton} onPress={handleAuthentication}>
        <CustomText style={styles.buttonText}>지문 인증 시도하기</CustomText>
      </TouchableOpacity>

      {isAuthenticated && (
        <CustomText style={styles.successText}>인증 완료 ({biometryType})</CustomText>
      )}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        buttons={modalButtons}
      />
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

  authButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  buttonText: {
    //      fontWeight: 'bold',
    color: 'black',
  },
  successText: {
    marginTop: 20,
    //     fontWeight: 'bold',
    color: 'green',
  },
});