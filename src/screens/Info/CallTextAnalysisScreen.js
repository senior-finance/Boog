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
import TextRecognition from 'react-native-text-recognition';
import { launchImageLibrary } from 'react-native-image-picker';
import { ScrollView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';




const phishingKeywords = ['환급', '세금', '보안', '국세청', '계좌번호', '클릭', '인증', '로그인', '앱설치','대출', '지원금', '연체', '미납', '고객센터', '상담원', '공공기관',
  '홈택스', '출금', '송금', '입금', '카카오페이', '토스',
  '팀뷰어', '원격', '다운로드', '설치', '급한일', '개인정보',
  '본인인증', '문자확인', '금일출금', '직접처리', '경찰서', '검찰청',
  '피해보상', '사건번호', '보이스피싱', '불법', '사칭', '문의',
  '앱다운', '앱설치', '공무원', '보증금', '모바일', '차단'];

const CallTextAnalysisScreen = () => {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [audioFileName, setAudioFileName] = useState(null);

  const pickAudioFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      console.log('✅ 오디오 선택됨:', res[0]);
      setAudioFileName(res[0].name);
  
      // 여기서 서버로 업로드하거나 STT 분석을 요청할 수 있음
      // 예시:
      // await uploadAudioToServer(res[0].uri);
  
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('사용자가 파일 선택을 취소했어요.');
      } else {
        console.error('❌ 오류 발생:', err);
      }
    }
  };

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 1,
    };
  
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('사용자가 이미지 선택을 취소했습니다');
      } else if (response.errorCode) {
        console.log('이미지 선택 오류: ', response.errorMessage);
        Alert.alert('이미지 오류', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
  
        try {
          const recognizedText = await TextRecognition.recognize(uri);
          const fullText = recognizedText.join(' ');
          setText(fullText);
        } catch (err) {
          console.error('OCR 실패:', err);
          Alert.alert('문자 인식 오류', '이미지에서 텍스트를 인식할 수 없습니다.');
        }
      }
    });
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
    <LinearGradient colors={['#F8F8F8', '#F8F8F8']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

      <Text style={styles.title}>통화 및 문자 분석</Text>

    {/* ✅ 통화 음성 파일 업로드 버튼 (기능은 나중에 추가) */}
    <TouchableOpacity style={styles.uploadButton} onPress={pickAudioFile}>
    <Text style={styles.uploadButtonText}>📞 통화 음성 파일 업로드</Text>
    </TouchableOpacity>

    {audioFileName && (
    <Text style={styles.audioFileName}>
    🎵 선택된 오디오 파일: {audioFileName}
       </Text>
      )}


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
       </ScrollView>
    </LinearGradient>
  );
};

// 🔁 수정된 스타일
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
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    color: '#333',
  },
  analyzeButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  audioFileName: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666',
  },

  input: {
    height: 120,
    backgroundColor: '#f0f2f5', // 연한 회색
    borderRadius: 10,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  
});

  


export default CallTextAnalysisScreen;
