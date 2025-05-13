import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '../../components/CustomText';

const dummyWelfareList = [
  {
    title: '기초연금 지원',
    desc: '만 65세 이상 어르신에게 매월 연금 지급',
    link: 'https://www.bokjiro.go.kr',
  },
  {
    title: '국가 건강검진 안내',
    desc: '만 66세 이상 어르신 대상 무료 건강검진 안내',
    link: 'https://www.nhis.or.kr',
  },
  {
    title: '장기요양보험 제도',
    desc: '치매·거동불편 어르신을 위한 요양 서비스 제공',
    link: 'https://www.longtermcare.or.kr',
  },
  {
    title: '국민연금공단',
    desc: '연금 수령 조건, 예상 수령액, 노후 준비 방법 안내',
    link: 'https://www.nps.or.kr',
  },
];

const WelfareScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText fontWeight="900" fontSize={22} style={{ textAlign: 'center', marginBottom: 28 }}>
        노인 혜택 한눈에 보기 👵
      </CustomText>

      {dummyWelfareList.map((item, index) => (
        <View key={index} style={styles.card}>
          <CustomText fontWeight="bold" fontSize={16} style={{ marginBottom: 8 }}>
            {item.title}
          </CustomText>

          <CustomText fontSize={14} style={{ color: '#555', marginBottom: 12, lineHeight: 20 }}>
            {item.desc}
          </CustomText>

          <TouchableOpacity onPress={() => navigation.navigate('Web', { url: item.link })}>
            <CustomText fontWeight="600" fontSize={14} style={{ color: '#4B7BE5' }}>
              🔗 자세히 보기
            </CustomText>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 60,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4B7BE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default WelfareScreen;
