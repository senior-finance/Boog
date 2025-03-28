import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import sendAudioToCSR from './CSRService';
import askClovaAI from './AIService';
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';

export default function VoiceInputScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');

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
      console.log('📁 녹음된 파일 경로:', audioFile);

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

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🎙️ AI 대화하기</Text>

        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recording]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? '🛑 녹음 종료' : '🎤 녹음 시작'}
          </Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

        {/* 항상 보이는 카드들 */}
        <View style={styles.card}>
          <Text style={styles.label}>📝 인식된 텍스트</Text>
          <Text style={styles.result}>
            {recognizedText ? recognizedText : '아직 음성 인식 결과가 없습니다.'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>🤖 AI 응답</Text>
          <Text style={styles.result}>
            {aiResponse ? aiResponse : 'AI 응답이 여기에 표시됩니다.'}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#1A4DCC',
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#0984e3',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 3,
  },
  recording: {
    backgroundColor: '#d63031',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  result: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 4,
  },
});
