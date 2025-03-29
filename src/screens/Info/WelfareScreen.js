import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const dummyWelfareList = [
  {
    title: '기초연금 지원',
    desc: '만 65세 이상 어르신에게 매월 연금 지급',
    link: 'https://www.bokjiro.go.kr',
  },
  {
    title: "국가 건강검진 안내",
    desc: "만 66세 이상 어르신 대상 무료 건강검진 안내",
    link: "https://www.nhis.or.kr"
  },
  {
    title: "장기요양보험 제도",
    desc: "치매·거동불편 어르신을 위한 요양 서비스 제공",
    link: "https://www.longtermcare.or.kr"
  },
  {
    title: "국민연금공단",
    desc: "연금 수령 조건, 예상 수령액, 노후 준비 방법 안내",
    link: "https://www.nps.or.kr"
  },
];

const WelfareScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>노인 혜택 한눈에 보기 👵</Text>
      {dummyWelfareList.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.desc}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Web', { url: item.link })}>
            <Text style={styles.link}>🔗 자세히 보기</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 15,
    color: '#666',
    marginBottom: 10,
  },
  link: {
    color: '#4B7BE5',
    fontWeight: '500',
  },
});

export default WelfareScreen;
