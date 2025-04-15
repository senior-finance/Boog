import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';

const InquiryFormScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!title || !content) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    Alert.alert('접수 완료', '고객님의 문의가 접수되었습니다.');
    setTitle('');
    setContent('');
  };

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.gradient}>
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

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <CustomText style={styles.buttonText}>📨 문의 보내기</CustomText>
          </TouchableOpacity>
        </ScrollView>
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
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
 
    marginBottom: 20,
    shadowColor: '#000',
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
    borderRadius: 10,
   
    textAlignVertical: 'top',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    width: '100%',
    backgroundColor: '#4B7BE5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
   
    fontWeight: 'bold',
  },
});

export default InquiryFormScreen;
