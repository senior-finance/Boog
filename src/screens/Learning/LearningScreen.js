import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LearningScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>학습 콘텐츠 🌱</Text>

      {/* 학습 콘텐츠 버튼 */}
      <TouchableOpacity style={[styles.button, styles.yellow]} onPress={() => navigation.navigate('Quiz')}>
        <Text style={styles.buttonText}>금융 용어 학습하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.green]} onPress={() => navigation.navigate('DepositStep1')}>
        <Text style={styles.buttonText}>송금 연습하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.blue]}>
        <Text style={styles.buttonText}>사기 사례 대비하기{'\n'}(보이스피싱, 금융 피해 등)</Text>
      </TouchableOpacity>

      {/* 도움 요청 버튼만 남김 */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.help]}>
          <Text style={styles.footerText}>도움</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // 연한 하늘색 배경
    alignItems: 'center',
    justifyContent: 'flex-start', // 화면 상단으로 정렬
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'black',
  },
  button: {
    width: '90%',  // 버튼 크기 조정
    height: 125,
    paddingVertical: 25,
    borderRadius: 25,
    marginBottom: 40,  // 버튼 간격 늘림
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, // 테두리 추가
    borderColor: '#555',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  yellow: { backgroundColor: '#F9EA97' },
  green: { backgroundColor: '#C8EAAE' },
  blue: { backgroundColor: '#A0CAF9' },

  // 하단 도움 버튼 스타일
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerButton: {
    width: '40%', // 버튼 크기 조정
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2, // 검은색 테두리 추가
    borderColor: '#555',
  },
  help: { backgroundColor: '#F9CB97' },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default LearningScreen;