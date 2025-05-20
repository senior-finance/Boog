import React, { useState } from 'react';
import {
  View,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import { sendInquiry } from './Inquiry';
import { FIREBASE_FUNCTION_URL } from '@env';

const InquiryFormScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true); // 로딩 시작

    try {
      await sendInquiry({ title, content });

      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          userName: "홍길동",
          userEmail: "hwoochhh@gmail.com",
        }),
      });

      const text = await response.text();
      console.log('이메일 응답:', response.status, text);

      if (!response.ok) throw new Error(text);

      Alert.alert('접수 완료', '문의가 저장되고 이메일이 전송되었습니다.');
      setTitle('');
      setContent('');
    } catch (err) {
      Alert.alert('전송 실패', '네트워크 또는 시스템 오류가 발생했습니다.');
      console.error('문의 처리 오류:', err.message || err);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <LinearGradient colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <CustomText style={styles.title}>1:1 문의하기</CustomText>

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
            <ActivityIndicator size="large" color="#4B7BE5" />
          </View>
        )}
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
});

export default InquiryFormScreen;
