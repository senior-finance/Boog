import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';

const FAQScreen = () => {
  const faqs = [
    {
      question: '계좌 잔액은 어디서 볼 수 있나요?',
      answer: '메인 화면에서 “내 계좌 보기”를 누르시면 잔액을 확인할 수 있습니다.',
    },
    {
      question: '비밀번호를 잊어버렸어요.',
      answer: '로그인 화면에서 “비밀번호 찾기”를 눌러 재설정할 수 있습니다.',
    },
    {
      question: '송금은 어떻게 하나요?',
      answer: '하단 메뉴에서 “송금하기”를 선택하고 안내에 따라 진행하시면 됩니다.',
    },
    {
      question: '화면 글씨를 키우고 싶어요.',
      answer: '“내 정보 > 글자 크기 설정”에서 원하는 크기로 조절하실 수 있어요.',
    },
  ];

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <CustomText style={styles.title}>자주 묻는 질문</CustomText>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {faqs.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#4B7BE5" style={styles.icon} />
              <CustomText style={styles.question}>{item.question}</CustomText>
            </View>
            <View style={styles.row}>
              <Ionicons name="information-circle-outline" size={22} color="#999" style={styles.icon} />
              <CustomText style={styles.answer}>{item.answer}</CustomText>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#4B7BE5'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
  question: {
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,
  },
  answer: {
    color: '#555',
    flexShrink: 1,
  },
});

export default FAQScreen;
