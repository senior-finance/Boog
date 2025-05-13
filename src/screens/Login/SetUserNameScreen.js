import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../Login/UserContext';
import CustomText from '../../components/CustomText';
import CustomModal from '../../components/CustomModal';

const SetUsernameScreen = ({ navigation }) => {

  // 빈 공간 넣을때 쓰는거
  const Gap = () => <View style={{ height: 100 }} />;

  // 커스텀모달
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    buttons: [],
  });

  const showModal = ({ title, message, buttons }) => {
    setModalConfig({ title, message, buttons });
    setModalVisible(true);
  };

  // 인증 상태 관리
  const [isVerified, setIsVerified] = useState(false);
  const handleVerify = async () => {
    // PASS 인증 처리 로직
    // 인증 성공 후:
    setIsVerified(true);
  };


  const { userInfo, setUserInfo } = useUser();
  const [usernameInput, setUsername] = useState('');

  // 확인 버튼 눌렀을 때 호출되는 함수
  const handleConfirm = () => {
    if (!usernameInput.trim()) {
      showModal({
        title: '알림',
        message: '이름을 입력해주세요.',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
      return;
    }

    showModal({
      title: '이름 설정',
      message: `${usernameInput} 으로 이름을 설정하시겠습니까?`,
      buttons: [
        {
          text: '취소',
          onPress: () => setModalVisible(false),
          color: '#999',
          textColor: 'white',
        },
        {
          text: '확인',
          onPress: () => {
            setModalVisible(false);
            confirmAndSave();
          },
          color: '#4B7BE5',
          textColor: 'white',
        },
      ],
    });
  };

  // 실제 저장 로직
  const confirmAndSave = async () => {
    try {
      // 메인 페이지로 이동하기. 원래는 이거 삭제하고 밑에 DB끝난 다음 메인페이지로 넘어가야함
      // DB가 아닌 로컬에서의 값 변경
      setUserInfo(prev => ({ ...prev, nickname: usernameInput }));
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });

      // DB가 아닌 로컬에서의 값 변경
      setUserInfo(prev => ({ ...prev, nickname: usernameInput }));

      // DB에 이미 고유ID, 실제이름, 사용자지정이름, 플랫폼, 로그인 횟수 총 5가지가 저장되어있을텐데
      // 사용자 지정 이름을 입력받은거로 변경
      await saveUsernameToDB(userInfo.socialId, usernameInput); // 그냥 만든거임

      // 메인 페이지로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      console.log('이름 저장 실패:', error);
      showModal({
        title: '오류',
        message: '이름 저장 중 문제가 발생했습니다.',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>사용자의 이름을 입력해주세요</CustomText>
      <CustomText style={styles.title}>이름은 한번 설정 후 수정이 불가하오니 신중하게 입력 바랍니다.</CustomText>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력해주세요"
        value={usernameInput}
        onChangeText={setUsername}
      />
      <Gap></Gap>

      <CustomText style={styles.title}>여기서 PASS인증으로 토큰값을 받아야 할 것 같음</CustomText>
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <CustomText style={styles.buttonText}>사용자 인증하기</CustomText>
      </TouchableOpacity>

      <Gap></Gap>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isVerified ? '#4B7BE5' : '#ccc' },
        ]}
        onPress={handleConfirm}
        disabled={!isVerified}
      >
        <CustomText style={styles.buttonText}>확인</CustomText>
      </TouchableOpacity>


      <Gap></Gap>

      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '70%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4B7BE5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SetUsernameScreen;
