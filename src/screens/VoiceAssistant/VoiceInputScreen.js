import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  Easing
} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import sendAudioToCSR from './CSRService';
import askClovaAI from './AIService';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import botImage from '../../assets/bot.png';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Tts from 'react-native-tts';
import LottieView from 'lottie-react-native';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import { handleFunctionCalling } from './functionHandler';
import { useVolume } from '../../contexts/VolumeContext';

export default function VoiceInputScreen() {
  const navigation = useNavigation();
  const { setSystemVolume } = useVolume();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const scrollViewRef = useRef(null);

  const screenNameMap = {
    QuizLevel: '금융 용어 학습',
    MapView: 'ATM/은행 찾기',
    Welfare: '복지 혜택',
    DepositStep1: '입금 연습',
    Guide: '앱 사용법'
  };

  const BlinkingDots = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '∙' : ''));
      }, 300);
      return () => clearInterval(interval);
    }, []);

    return (
      <CustomText style={{color: '#000'}}>
        부금이가 답변을 입력 중입니다 {dots}
      </CustomText>
    );
  };

  const filePath = `${RNFS.CachesDirectoryPath}/sound.wav`;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleResetChat}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}
        >
          <Icon name="refresh-outline" size={25} color="#4B7BE5" style={{ marginRight: 4}} />
          <CustomText style={{ color: '#4B7BE5', fontWeight: 'bold' }}>대화 내용 초기화</CustomText>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    return () => {
      Tts.stop(); // unmount 시
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      Tts.stop(); // focus 잃을 때
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({animated: true});
      }
    }, 100); // 100~150ms 정도가 적당함

    return () => clearTimeout(timer);
  }, [chatHistory]);

  const handleResetChat = () => {
    setChatHistory([]);
    setTextInput('');
    setIsLoading(false); 
    setShowConfirmModal(false); 
    setConfirmTarget(null);     
    Tts.stop();
  };

  const onSendText = async (customText) => {
    let input = customText ?? textInput;

    if (typeof input !== 'string') {
      if (typeof input === 'object' && input !== null) {
        input = input.message ?? input.text ?? '';
      } else {
        input = '';
      }
    }

    if (input.trim() === '') return;

    Tts.stop();

    const userMessage = { role: 'user', text: input };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const reply = await askClovaAI(input);

      await handleFunctionCalling({
        reply,
        navigation,
        setChatHistory,
        setConfirmTarget,
        setShowConfirmModal,
        setSystemVolume,
      });
    } catch (err) {
      console.log('텍스트 질문 처리 오류:', err);
    } finally {
      setIsLoading(false);
      setTextInput('');
    }
  };

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startRecording = async () => {
    Tts.stop();

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: 'sound.wav',
    };

    AudioRecord.init(options);
    AudioRecord.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    try {
      setIsLoading(true);
      const audioFile = await AudioRecord.stop();
      setIsRecording(false);
      setRecordedPath(audioFile);

      const text = await sendAudioToCSR(audioFile);
      const userMessage = {role: 'user', text};
      setChatHistory(prev => [...prev, userMessage]);

      const reply = await askClovaAI(text);

      if (reply.type === 'navigate') {
        navigation.navigate(reply.target);
      } else {
        const botMessage = {role: 'bot', text: reply.text};
        setChatHistory(prev => [...prev, botMessage]);

        Tts.stop(); // 이전 TTS 중지
        Tts.speak(reply.text);
      }
    } catch (err) {
      console.log('녹음/CSR/AI 처리 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicClick = async text => {
    setTextInput(text); // 입력창에 보여주기
    await onSendText(text); // 바로 전송 실행
  };

  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${
    today.getMonth() + 1
  }월 ${today.getDate()}일 ${
    ['일', '월', '화', '수', '목', '금', '토'][today.getDay()]
  }요일`;

return (
  <KeyboardAvoidingView
    style={styles.wrapper}
    behavior="padding" // ← 이걸로 고정
    keyboardVerticalOffset={0} // 필요 시 조정
  >
    <View style={{ flex: 1 }}>
      {isRecording && (
        <LottieView
          source={require('../../assets/animeMic.json')}
          autoPlay
          loop
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -50 }, { translateY: -50 }], // 중앙 정렬
            width: 100,
            height: 100,
            zIndex: 10,
            opacity: 0.9,
          }}
        />
      )}
      {/* 대화 스크롤 영역 */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
      >
        
        <CustomText style={styles.dateText}>{formattedDate}</CustomText>

        <View style={styles.botIntroContainer}>
          <Image source={botImage} style={styles.botImage} />
          <View style={styles.botTextWrapper}>
            <CustomText style={styles.botText}>
              안녕하세요!{'\n'}
              <CustomText style={styles.botNameText}>
                상담원 부금이
              </CustomText>
              입니다.{'\n'}
              무엇을 도와드릴까요?
            </CustomText>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          {[
            '문자/통화 분석',
            '입금 방법',
            '금융 퀴즈',
            '복지 혜택',
            'ATM/은행 찾기',
            '앱 사용 방법',
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.topicButton, { width: '30%' }]}
              onPress={() => handleTopicClick(item)}
            >
              <CustomText style={styles.topicText}>{item}</CustomText>
            </TouchableOpacity>
          ))}
        </View>

        {chatHistory.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.chatRow,
              msg.role === 'user' ? styles.chatRowUser : styles.chatRowBot,
            ]}
          >
            {msg.role === 'bot' && (
              <Image source={require('../../assets/bot.png')} style={styles.avatar} />
            )}
            <View
              style={
                msg.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleBot
              }
            >
              <CustomText style={styles.chatText}>{msg.text}</CustomText>
            </View>
          </View>
        ))}

        {/* 챗봇이 응답 중일 때 보여줄 깜빡이는 메시지 */}
        {isLoading && (
          <View style={[styles.chatRow, styles.chatRowBot]}>
            <Image source={require('../../assets/bot.png')} style={styles.avatar} />
            <View style={styles.chatBubbleBot}>
              <BlinkingDots />
            </View>
          </View>
        )}
      </ScrollView>

      {/* 입력창 하단 바 */}
      <View style={styles.bottomBar}>
        <CustomTextInput
          style={styles.input}
          placeholder="궁금한 점을 입력해주세요"
          value={textInput}
          onChangeText={setTextInput}
          onSubmitEditing={onSendText}
          blurOnSubmit={false}
          returnKeyType="send"
          multiline={false}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Enter') {
              onSendText();
            }
          }}
        />

        {/* 입력이 있을 때만 send 버튼 보이게 */}
        {textInput.trim().length > 0 ? (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => onSendText(textInput)}
          >
            <Icon name="send" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24, height: 24, marginLeft: 10 }} /> // 공간 유지용
        )}

        <TouchableOpacity
          style={styles.voiceIconButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Icon name={isRecording ? 'stop' : 'mic'} size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>

    {/* 확인 모달 */}
    {showConfirmModal && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <CustomText style={styles.modalText}>
            '{screenNameMap[confirmTarget] || confirmTarget}' 화면으로 이동할까요?
          </CustomText>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                navigation.navigate(confirmTarget);
                setShowConfirmModal(false);
                setConfirmTarget(null);
              }}
            >
              <CustomText style={styles.modalBtnText}>예</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
              onPress={() => {
                setShowConfirmModal(false);
                setConfirmTarget(null);
                setChatHistory(prev => [
                  ...prev,
                  { role: 'bot', text: '이동을 취소했어요.' },
                ]);
                Tts.speak('이동을 취소했어요.');
              }}
            >
              <CustomText style={styles.modalBtnText}>아니오</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F0F6FD',
  },
  container: {
    padding: 24,
    backgroundColor: '#F0F6FD',
  },
  dateText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 17,
    marginBottom: 10,
  },
  botIntroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  botImage: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    marginRight: 15,
    marginLeft: 30,
  },
  botTextWrapper: {
    flex: 1,
  },
  botText: {
    color: '#555',
    lineHeight: 25,
    fontWeight: 'bold',
  },
  botNameText: {
    color: '#4B7BE5',
    fontWeight: 'bold',
    backgroundColor: 'rgba(75, 123, 229, 0.1)',
  },
  buttonGroup: {
    
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  topicButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    margin: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
   borderWidth: 0.8,
    borderColor: 'rgba(77, 73, 73, 0.4)',
  },
  topicText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#4B7BE5',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalBtnText: {
    color: 'white',
    textAlign: 'center',
  },
  micButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
  },
  micButtonText: {
    color: '#fff',
  },
  start: {
    backgroundColor: '#4B7BE5',
  },
  stop: {
    backgroundColor: '#CB4626',
  },
  chatBubbleUser: {
    backgroundColor: '#D8EAFE',
    alignSelf: 'flex-end',
    padding: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4, // ← 꼬리
    marginVertical: 5,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatBubbleBot: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    padding: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4, // ← 꼬리
    marginVertical: 5,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatText: {
    color: '#333',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  chatRowBot: {
    justifyContent: 'flex-start',
  },
  chatRowUser: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#EEF3F9', 
    borderRadius: 25,          
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#4B7BE5',
    padding: 14,
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIconButton: {
    backgroundColor: '#4B7BE5',
    padding: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
