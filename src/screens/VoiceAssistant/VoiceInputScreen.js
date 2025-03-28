import React, { useState } from 'react';
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
import botImage from '../../assets/bot3.png';

export default function VoiceInputScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [textInput, setTextInput] = useState('');

  const filePath = `${RNFS.CachesDirectoryPath}/sound.wav`;

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
      setRecognizedText(text);

      const reply = await askClovaAI(text);
      setAiResponse(reply);
    } catch (err) {
      console.error('녹음/CSR/AI 처리 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${['일','월','화','수','목','금','토'][today.getDay()]}요일`;

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
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
          {['카드 유효기간', '재발급 신청', '환불 안내', '송금 방법', 'ATM/은행 찾기', '앱 사용방법'].map((item, index) => (
            <TouchableOpacity key={index} style={[styles.topicButton, { width: '30%' }]}>
              <Text style={styles.topicText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

        {recognizedText !== '' && (
          <View style={styles.chatBubbleUser}>
            <Text style={styles.chatText}>{recognizedText}</Text>
          </View>
        )}

        {aiResponse !== '' && (
          <View style={styles.chatBubbleBot}>
            <Text style={styles.chatText}>{aiResponse}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TextInput
          style={styles.input}
          placeholder="궁금한 점을 입력해주세요"
          value={textInput}
          onChangeText={setTextInput}
        />
        <TouchableOpacity
          style={styles.voiceIconButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Icon name={isRecording ? 'stop' : 'mic'} size={24} color="#fff" />
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
    fontSize: 20,
    lineHeight: 24,
    color: '#333',
    marginLeft: 20,
  },
  botImage: {
    width: 80,
    height: 120,
    resizeMode: 'contain',
    marginRight: 20,
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
    fontSize: 13,
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
  voiceIconButton: {
    backgroundColor: '#4B7BE5',
    padding: 14,
    borderRadius: 50,
  },
});
