// src/CallTextAnalysisScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const phishingKeywords = ['환급', '세금', '보안', '국세청', '계좌번호', '클릭', '인증', '로그인', '앱설치'];

const CallTextAnalysisScreen = () => {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const analyze = () => {
    if (!text && !imageUri) {
      Alert.alert('분석 불가', '문자 내용을 입력하거나 캡처 이미지를 업로드해주세요.');
      return;
    }

    let found = [];

    phishingKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matchCount = (text.match(regex) || []).length;
      if (matchCount > 0) {
        found.push({ keyword, count: matchCount });
      }
    });

    if (found.length > 0) {
      setResult({
        message: `⚠️ 보이스피싱 의심 단어 ${found.length}개 발견!`,
        details: found.map(f => `• ${f.keyword} (${f.count}회)`).join('\n'),
      });
    } else {
      setResult({
        message: '✅ 의심 단어가 발견되지 않았습니다.',
        details: '안심하셔도 좋습니다.',
      });
    }
  };

  return (
    <LinearGradient colors={['#AEEEEE', '#DDA0DD']} style={styles.container}>
      <Text style={styles.title}>통화 및 문자 분석</Text>

    {/* ✅ 통화 음성 파일 업로드 버튼 (기능은 나중에 추가) */}
    <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>📞 통화 음성 파일 업로드</Text>
    </TouchableOpacity>

      {/* 이미지 업로드 */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>📸 문자 캡처 이미지 업로드</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      {/* 텍스트 입력 */}
      <TextInput
        style={styles.input}
        placeholder="문자 내용을 여기에 붙여넣어주세요"
        multiline
        value={text}
        onChangeText={setText}
        keyboardType="default"
        autoCapitalize="none"
      />

      {/* 분석 버튼 */}
      <TouchableOpacity style={styles.analyzeButton} onPress={analyze}>
        <Text style={styles.analyzeButtonText}>🔍 분석하기</Text>
      </TouchableOpacity>

      {/* 분석 결과 */}
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>{result.message}</Text>
          <Text style={styles.resultText}>{result.details}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginTop: 40,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#ffffffaa',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginVertical: 15,
  },
  input: {
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
  },
  analyzeButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
    backgroundColor: '#ffffffaa',
    padding: 20,
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default CallTextAnalysisScreen;
