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
  {
  title: '노인 무임 교통 혜택',
  desc: '만 65세 이상 어르신은 지하철, 버스 무임 승차 가능',
  link: 'https://www.bokjiro.go.kr/ssis-teu/index.do',
},
{
  title: '치매안심센터',
  desc: '치매 조기검진, 맞춤형 상담 및 돌봄 서비스 제공',
  link: 'https://www.nid.or.kr',
},
{
  title: '노인일자리 및 사회활동 지원',
  desc: '어르신에게 사회활동 기회를 제공하고 소득 지원',
  link: 'https://www.kohi.or.kr',
},

];

const WelfareScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
      <CustomText
        fontWeight="900"
        style={{
          fontSize: 22,
          textAlign: 'center',
          marginBottom: 28,
          flexWrap: 'wrap',
          includeFontPadding: false,
          lineHeight: 30,
          color: '#1446D8'
        }}
      >
        어르신을 위한 혜택 정보 모음 👵
      </CustomText>

      {dummyWelfareList.map((item, index) => (
        <View key={index} style={styles.card}>
          <CustomText
            fontWeight="bold"
            style={{
              color: 'rgb(41, 43, 46)',
              marginBottom: 8,
              flexWrap: 'wrap',
              includeFontPadding: false,
              lineHeight: 26,
            }}
          >
            {item.title}
          </CustomText>

          <CustomText
            style={{
              color: 'rgb(91, 98, 106)',
              marginBottom: 12,
              lineHeight: 24,
              flexWrap: 'wrap',
              includeFontPadding: false,
            }}
          >
            {item.desc}
          </CustomText>

          <TouchableOpacity onPress={() => navigation.navigate('Web', { url: item.link })}>
            <CustomText
              fontWeight="600"
              style={{
                color: 'rgb(79, 136, 211)',
                flexWrap: 'wrap',
                includeFontPadding: false,
              }}
            >
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
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
  },
  card: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.6)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'flex-start',
  },
});

export default WelfareScreen;