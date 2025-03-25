// src/screens/Info/InquiryFormScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const InquiryFormScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!title || !content) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 실제 저장 로직 연결 예정 (예: Firebase 또는 서버 API)
    Alert.alert('접수 완료', '고객님의 문의가 접수되었습니다.');
    setTitle('');
    setContent('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>1:1 문의하기</Text>

      <TextInput
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="문의 내용"
        value={content}
        onChangeText={setContent}
        style={[styles.input, { height: 120 }]}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>문의 보내기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InquiryFormScreen;
