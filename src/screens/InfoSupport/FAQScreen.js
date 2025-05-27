import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';

const FAQScreen = () => {
  const faqs = [
  {
    question: '송금은 어떻게 하나요?',
    answer: '메인 화면에서 “송금하기”를 누르고, 받는 사람 정보를 입력한 후 금액을 입력해 보내실 수 있어요.',
  },
  {
    question: '큰 버튼 모드는 어떻게 설정하나요?',
    answer: '메인화면 상단에 큰 버튼 모드에서 설정을 켜면 글씨와 버튼이 더 크게 표시되어 사용하기 편해집니다.',
  },
    
    {
      question: '화면 글씨를 키우고 싶어요.',
      answer: '“내 정보 > 글자 크기”에서 원하는 크기로 조절하실 수 있어요.',
    },
      {
    question: '고객센터에 문의하려면 어떻게 하나요?',
    answer: '“내 정보 >  1:1 문의"를 선택하면 바로 문의를 작성하실 수 있어요.',
  },
  {
  question: '프로필 사진을 변경하고 싶어요.',
  answer: '내 정보 > 프로필 아이콘을 눌러서 갤러리에서 사진을 선택하거나 기본 아이콘으로 변경할 수 있어요.',
},

  ];

  return (
    <LinearGradient colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']} style={styles.container}>
      <CustomText style={styles.title}>자주 묻는 질문</CustomText>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {faqs.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1A4DCC" style={styles.icon} />
              <CustomText style={styles.question}>{item.question}</CustomText>
            </View>
            <View style={styles.row}>
              <Ionicons name="information-circle-outline" size={22} color="#4B7BE5" style={styles.icon} />
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
    color: '#1A4DCC',
    fontSize: 20,
    lineHeight: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.6)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
  question: {
    fontWeight: '600',
    color: '#1A4DCC',
    flexShrink: 1,
    lineHeight: 22,
  },
  answer: {
    color: '#333',
    flexShrink: 1,
    lineHeight: 22,
  },
});

export default FAQScreen;
