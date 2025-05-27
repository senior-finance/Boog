import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useUser } from './UserContext';
import CustomText from '../../components/CustomText';
import CustomModal from '../../components/CustomModal';
import { updateUsername, upsertSocialLoginUser, mongoDB, addNotification } from '../../database/mongoDB';
import { storeAuthSession } from './AutoLogin';
import { WebView } from 'react-native-webview';
import { LOGIN_URL, KFTC_TRAN_ID_KMJ, KFTC_TRAN_ID_HWC } from '@env'

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
  const [isVerified, setIsVerified] = useState(false);       // 인증 여부
  const [passToken, setPassToken] = useState(null);          // 인증 토큰 관리
  const [showWebView, setShowWebView] = useState(false);     // 웹뷰 띄우기
  useEffect(() => { // 웹뷰 뒤로가기버튼으로 닫기
    if (showWebView) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          setShowWebView(false);  // WebView 닫기
          return true;            // 기본 뒤로가기(앱 종료 등) 막기
        }
      );

      return () => backHandler.remove();
    }
  }, [showWebView]);
  const handleVerify = async () => {
    setShowWebView(true); // WebView 표시

    const mockToken = KFTC_TRAN_ID_HWC;
    setPassToken(mockToken);

    try {
      const existing = await mongoDB('find', 'user', 'info', {
        query: { passToken: mockToken },
        options: { limit: 1 }
      });

      if (Array.isArray(existing) && existing.length > 0) {
        showModal({
          title: '이미 가입된 사용자',
          message: '이미 본인 인증된 사용자가 존재합니다.\n다른 로그인 방법으로 시도해주세요.',
          buttons: [
            {
              text: '확인',
              onPress: () => {
                setModalVisible(false);
                navigation.replace('Login');
              },
              color: '#4B7BE5',
            },
          ],
        });
        return;
      }

      setIsVerified(true); // 통과한 경우만 입력 가능
    } catch (err) {
      console.log('PASS 중복검사 실패:', err);
      showModal({
        title: '오류',
        message: 'PASS 인증 중 문제가 발생했습니다.',
        buttons: [{ text: '확인', onPress: () => setModalVisible(false), color: '#4B7BE5', }]
      });
    }
  };


  const { userInfo, setUserInfo } = useUser();
  const [usernameInput, setUsername] = useState('');         // 입력값
  const [isNameValid, setIsNameValid] = useState(false);     // 이름 입력 여부
  const handleNameChange = (text) => {
    setUsername(text);
    setIsNameValid(text.trim().length > 0);
  };

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

  const saveUsernameToDB = async (socialId, username) => {
    try {
      await updateUsername(socialId, username);
    } catch (err) {
      console.log('닉네임 업데이트 실패:', err);
      throw err;
    }
  };

  // 실제 저장 로직
  const confirmAndSave = async () => {
    try {
      // DB 저장
      const finalUser = {
        provider: userInfo.provider,
        socialId: userInfo.socialId,
        username: usernameInput,
        nickname: userInfo.nickname,
        createdAt: new Date(),
        passToken,
        dbName: 'hwc'
      };

      await upsertSocialLoginUser(finalUser);
      setUserInfo(finalUser); // ← context 최신화

      // 세션 저장
      await storeAuthSession({
        provider: userInfo.provider,
        accessToken: userInfo.accessToken,
        userInfo: finalUser,
      });

      const notifications = [
        {
          icon: 'heart',
          iconColor: '#4CAF50',
          borderColor: '#C8E6C9',
          content: `${usernameInput} 님, 가입을 환영합니다!`,
        },
        {
          icon: 'gift',
          iconColor: '#FFC107',
          borderColor: '#FFE082',
          content: `복지 혜택에서 다양한 혜택을 확인해보세요.`,
        },
        {
          icon: 'school-outline',
          iconColor: '#03A9F4',
          borderColor: '#B3E5FC',
          content: `금융 관련 퀴즈를 통해 금융 지식을 테스트 해보세요.`,
        },
      ];

      // 기본 환영 알림 저장
      await Promise.all(
        notifications.map(noti =>
          addNotification(finalUser.username, noti)
        )
      );

      // 메인 페이지 이동
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
    showWebView ? (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: LOGIN_URL }}
          />
        </View>
      </View>
    ) : (
      <View style={styles.container}>

        <CustomText style={styles.title}>버튼을 눌러 사용자 인증을 완료해주십시오.</CustomText>
        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <CustomText style={styles.buttonText}>사용자 인증하기</CustomText>
        </TouchableOpacity>

        <Gap></Gap>

        {!isVerified && (
          <CustomText style={styles.title}>
            이름은 인증 완료 후 입력할 수 있습니다.
          </CustomText>
        )}
        {/* <CustomText style={styles.title}>사용자의 이름을 입력해주세요</CustomText> */}
        <CustomText style={styles.title}>이름은 한번 설정 후 수정이 불가하오니 신중하게 입력 바랍니다.</CustomText>
        <TextInput
          style={[
            styles.input,
            !isVerified && styles.inputDisabled,
          ]}
          placeholder={isVerified ? '이름을 입력해주세요' : '인증 후 입력 가능'}
          value={usernameInput}
          onChangeText={handleNameChange}
          editable={isVerified}
        />

        <Gap></Gap>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isVerified && isNameValid ? '#4B7BE5' : '#ccc' },
          ]}
          onPress={handleConfirm}
          disabled={!(isVerified && isNameValid)}
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
    )
  );
};

const styles = StyleSheet.create({
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  disabledNotice: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
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
