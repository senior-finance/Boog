// VoiceInputScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import sendAudioToCSR from './CSRService';
import askClovaAI from './AIService';
import { PermissionsAndroid, Platform } from 'react-native';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function VoiceInputScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');

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

    try {
      const result = await audioRecorderPlayer.startRecorder();
      setIsRecording(true);
      setRecordedPath(result);
    } catch (err) {
      console.error('녹음 시작 오류:', err);
    }
  };

  // 녹음 종료
  const stopRecording = async () => {
    try {
      setIsLoading(true);
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      setRecordedPath(result);

      // CSR 전송
      const text = await sendAudioToCSR(result);
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
      <Text style={styles.title}>🎙️ 음성 비서 테스트</Text>

      <Button
        title={isRecording ? '🛑 녹음 종료' : '🎤 녹음 시작'}
        onPress={isRecording ? stopRecording : startRecording}
      />

<Button
  title="🤖 AI 응답 테스트"
  color="#6c5ce7"
  onPress={async () => {
    const test = await askClovaAI('오늘 날씨 어때?');
    console.log('✅ AI 테스트 응답:', test);
    setAiResponse(test); // 화면에 출력
  }}
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