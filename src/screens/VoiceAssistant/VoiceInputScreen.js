// VoiceInputScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import sendAudioToCSR from './CSRService';
import askClovaAI from './AIService';
import RNFS from 'react-native-fs';

export default function VoiceInputScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const filePath = `${RNFS.CachesDirectoryPath}/sound.wav`;

  // 안드로이드 권한 요청
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // 녹음 시작
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

  // 녹음 종료
  const stopRecording = async () => {
    try {
      setIsLoading(true);
      const audioFile = await AudioRecord.stop();
      setIsRecording(false);
      setRecordedPath(audioFile);
      console.log('📁 녹음된 파일 경로:', audioFile);

      // CSR 전송
      const text = await sendAudioToCSR(audioFile);
      setRecognizedText(text);

      // AI 응답 받기
      const reply = await askClovaAI(text);
      setAiResponse(reply);
    } catch (err) {
      console.error('녹음/CSR/AI 처리 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎙️ 음성 비서 테스트 (WAV)</Text>

      <Button
        title={isRecording ? '🛑 녹음 종료' : '🎤 녹음 시작'}
        onPress={isRecording ? stopRecording : startRecording}
        color={isRecording ? '#d63031' : '#0984e3'}
      />

      {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      <Text style={styles.label}>📝 인식된 텍스트:</Text>
      <Text style={styles.result}>{recognizedText}</Text>

      <Text style={styles.label}>🤖 AI 응답:</Text>
      <Text style={styles.result}>{aiResponse}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
});
