import React, { useState, useEffect } from 'react';
import {
  View,
  Platform,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import { sendInquiry } from './Inquiry';
import { FIREBASE_FUNCTION_URL } from '@env';
import CustomModal from '../../components/CustomModal';
import { useUser } from '../Login/UserContext';
import PushNotification from 'react-native-push-notification';
import { addNotification } from '../../database/mongoDB';
import LottieView from 'lottie-react-native';


const InquiryFormScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 이메일 전송 후 로딩 화면
  const [loading, setLoading] = useState(false);

  // 커스텀모달
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', buttons: [] });
  const showModal = ({ title, message, buttons }) => {
    setModalConfig({ title, message, buttons });
    setModalVisible(true);
  };

  const { userInfo } = useUser(); // 로그인 시 setUserInfo로 저장된 값

  useEffect(() => {
    // 1. 푸시 알림 설정 (한 번만)
    PushNotification.configure({
      // (필요 시) 토큰 받기
      onRegister: function (token) {
        // console.log('TOKEN:', token);
      },
      // 알림 탭/닫기 시
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotification.FetchResult.NoData);
      },
      // Android 권한 요청
      requestPermissions: true,
    });

    // 2. Android용 채널 생성 (Android 8.0+)
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // 채널 ID
        channelName: '부금이 알람 채널',  // 채널 이름
        // importance: 3,                   // (optional) 중요도
      },
      // (created) => console.log(`createChannel returned '${created}'`)
    );
  }, []);

  const sendHiNotification = () => {
    PushNotification.localNotification({
      /* Android & iOS 공통 */
      channelId: 'default-channel-id', // Android는 필수
      title: '1:1 문의',                   // 제목
      message: '이메일이 성공적으로 전송되었어요!',                 // 본문

      /* iOS 전용 옵션 (필요 시) */
      // soundName: 'default',
      // playSound: true,
    });
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      showModal({
        title: '입력 오류',
        message: '제목과 내용을 모두 입력해주세요.',
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

    setLoading(true); // 로딩 시작

    try {
      const userName = userInfo?.username || 'Guest';
      console.log(userName)
      await sendInquiry({ userName, title, content });

      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          userName,
          userEmail: "hwoochhh@gmail.com",
        }),
      });

      const text = await response.text();
      console.log('이메일 응답:', response.status, text);

      if (!response.ok) throw new Error(text);

      showModal({
        title: '접수 완료',
        message: '문의해주신 내용이 이메일로 전송되었어요!',
        buttons: [
          {
            text: '확인',
            onPress: () => {
              setModalVisible(false);
              setTitle('');
              setContent('');
            },
            color: '#4B7BE5',
          },
        ],
      });
      setTitle('');
      setContent('');
      sendHiNotification()
      await addNotification(userName, {
        icon: 'alert-circle',
        iconColor: '#F44336',
        borderColor: '#FFCDD2',
        content: '문의 이메일을 보냈어요',
      });
    } catch (err) {
      showModal({
        title: '전송 실패',
        message: '네트워크 또는 시스템 오류가 발생했습니다.',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
      console.log('문의 처리 오류:', err.message || err);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <LinearGradient colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <CustomText style={styles.title}>문의할 내용을 적어주세요</CustomText>

          <CustomTextInput
            placeholder="제목"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <CustomTextInput
            placeholder="문의 내용을 입력해주세요"
            value={content}
            onChangeText={setContent}
            style={styles.textArea}
            multiline
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <CustomText style={styles.buttonText}>📨 문의 보내기</CustomText>
          </TouchableOpacity>
        </ScrollView>
       {loading && (
  <View style={styles.loadingOverlay}>
    <LottieView
      source={require('../../assets/loadingg.json')} // 로티 파일 경로
      autoPlay
      loop
      style={styles.loadingAnimation}
    />
  </View>
)}

        <CustomModal
          visible={modalVisible}
          title={modalConfig.title}
          message={modalConfig.message}
          buttons={modalConfig.buttons}
        />
      </KeyboardAvoidingView>
    </LinearGradient>

  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 30,
    color: '#1A4DCC',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.5)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  textArea: {
    width: '100%',
    height: 140,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.5)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    width: '100%',
    backgroundColor: '#4B7BE5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  loadingAnimation: {
  width: 200,
  height: 200,
  marginBottom: 100
},

});

export default InquiryFormScreen;
