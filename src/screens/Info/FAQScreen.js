// src/screens/Info/FAQScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FAQScreen = () => {
  const faqs = [
    { question: '계좌 잔액은 어디서 볼 수 있나요?', answer: '메인 화면에서 “내 계좌 보기”를 누르시면 잔액을 확인할 수 있습니다.' },
    { question: '비밀번호를 잊어버렸어요.', answer: '로그인 화면에서 “비밀번호 찾기”를 눌러 재설정할 수 있습니다.' },
    { question: '송금은 어떻게 하나요?', answer: '하단 메뉴에서 “송금하기”를 선택하고 안내에 따라 진행하시면 됩니다.' },
    { question: '화면 글씨를 키우고 싶어요.', answer: '“내 정보 > 글자 크기 설정”에서 원하는 크기로 조절하실 수 있어요.' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>자주 묻는 질문</Text>
      {faqs.map((item, idx) => (
        <View key={idx} style={styles.box}>
          <Text style={styles.question}>Q. {item.question}</Text>
          <Text style={styles.answer}>A. {item.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  box: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  answer: {
    fontSize: 16,
    color: '#333',
  },
});

export default FAQScreen;
