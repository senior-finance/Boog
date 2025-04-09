import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import sendAudioToCSR from './CSRService';
import askClovaAI from './AIService';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import botImage from '../../assets/bot5.png';
import { useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';

export default function VoiceInputScreen() {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const filePath = `${RNFS.CachesDirectoryPath}/sound.wav`;

  useEffect(() => {
    return () => {
      Tts.stop();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('TTSSetting')}>
          <Icon name="settings-outline" size={30} color="#000" style={{ marginRight: 20 }} />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  const [pendingNavigation, setPendingNavigation] = useState(null);

  const onSendText = async (customText) => {
    const input = customText ?? textInput;
    if (input.trim() === '') return;
  
    Tts.stop();
  
    const userMessage = { role: 'user', text: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);
  
    try {
      // ✅ navigate-confirm 처리
      if (pendingNavigation) {
        const positive = ['응', '네', '좋아', '맞아', '예', '그래'];
        const negative = ['아니', '아니요', '싫어', '노'];
        const lowerText = input.toLowerCase();
  
        if (positive.some(word => lowerText.includes(word))) {
          navigation.navigate(pendingNavigation);
          setPendingNavigation(null);
          return;
        } else if (negative.some(word => lowerText.includes(word))) {
          setChatHistory(prev => [...prev, { role: 'bot', text: '이동을 취소했어요.' }]);
          Tts.speak('이동을 취소했어요.');
          setPendingNavigation(null);
          return;
        }
      }
  
      // ✅ AI에게 질문 보내기
      const reply = await askClovaAI(input);
  
      if (reply.type === 'navigate-confirm') {
        setPendingNavigation(reply.target);
  
        const screenNameMap = {
          QuizLevel: '퀴즈',
          MapSearch: '지도',
          Welfare: '복지'
        };
  
        const readableName = screenNameMap[reply.target] || reply.target;
  
        const visibleText = `👉 '${readableName}' 화면으로 이동할까요?`;
        const spokenText = `'${readableName}' 화면으로 이동할까요?`;
  
        setChatHistory((prev) => [...prev, { role: 'bot', text: visibleText }]);
        Tts.speak(spokenText);
  
      } else if (reply.type === 'navigate') {
        navigation.navigate(reply.target);
      } else if (reply.type === 'action') {
        // TODO: 액션 처리
      } else {
        setChatHistory((prev) => [...prev, { role: 'bot', text: reply.text }]);
        Tts.speak(reply.text);
      }
  
      setTextInput('');
    } catch (err) {
      console.error('텍스트 질문 처리 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
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
      const userMessage = { role: 'user', text };
      setChatHistory((prev) => [...prev, userMessage]);

      const reply = await askClovaAI(text);

      if (reply.type === 'navigate') {
        navigation.navigate(reply.target);
      } else {
        const botMessage = { role: 'bot', text: reply.text };
        setChatHistory((prev) => [...prev, botMessage]);

        Tts.stop(); // 이전 TTS 중지
        Tts.speak(reply.text);
      }
    } catch (err) {
      console.error('녹음/CSR/AI 처리 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicClick = async (text) => {
    setTextInput(text);        // 입력창에 보여주기
    await onSendText(text);    // 바로 전송 실행
  };

  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${['일','월','화','수','목','금','토'][today.getDay()]}요일`;

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.dateText}>{formattedDate}</Text>

        <View style={styles.botIntroContainer}>
          <View style={styles.botTextWrapper}>
            <Text style={styles.botText}>
              안녕하세요!{"\n"}
              <Text style={{ color: '#4B7BE5', fontWeight: 'bold' }}>상담원 부금이</Text>입니다.{"\n"}
              무엇을 도와드릴까요?
            </Text>
          </View>
          <Image source={botImage} style={styles.botImage} />
        </View>

        <View style={styles.buttonGroup}>
          {["카드 유효기간", "재발급 신청", "환불 안내", "입금 방법", "ATM/은행 찾기", "앱 사용 방법"].map((item, index) => (
            <TouchableOpacity key={index} 
              style={[styles.topicButton, { width: '30%' }]}
              onPress={() => handleTopicClick(item)}>
              <Text style={styles.topicText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

        {chatHistory.map((msg, idx) => (
          <View
            key={idx}
            style={msg.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleBot}
          >
            <Text style={styles.chatText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
      <TextInput
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
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSendText}
        >
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.voiceIconButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Icon name={isRecording ? 'stop' : 'mic'} size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  botIntroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  botTextWrapper: {
    flex: 1,
    marginRight: 12,
  },
  botText: {
    fontSize: 21,
    lineHeight: 24,
    color: '#333',
    marginLeft: 30,
  },
  botImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginRight: 30,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  topicText: {
    fontSize: 15,
    color: '#333',
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
    fontSize: 16,
    marginLeft: 10,
  },
  start: {
    backgroundColor: '#4B7BE5',
  },
  stop: {
    backgroundColor: '#CB4626',
  },
  chatBubbleUser: {
    backgroundColor: '#f1f2f6',
    alignSelf: 'flex-end',
    padding: 12,
    borderRadius: 16,
    marginVertical: 5,
    maxWidth: '80%',
  },
  chatBubbleBot: {
    backgroundColor: '#D2D2D2',
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 16,
    marginVertical: 5,
    maxWidth: '80%',
  },
  chatText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
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
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    marginRight: 12,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#4B7BE5',
    padding: 14,
    borderRadius: 50,
    marginRight: 12
  },
  voiceIconButton: {
    backgroundColor: '#4B7BE5',
    padding: 14,
    borderRadius: 50,
  },
});
