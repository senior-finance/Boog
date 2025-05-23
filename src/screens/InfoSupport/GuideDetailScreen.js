import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';

export default function GuideDetailScreen({ route }) {
  const title = route?.params?.title || '기능 설명';
  const sectionKey = route?.params?.key || '';

  const guideSteps = {
    deposit: [
      '1. 입금할 은행을 선택해 주세요.',
      '2. 계좌번호를 정확히 입력해 주세요.',
      '3. 입금할 금액을 입력하고 확인 버튼을 누르면 입금 연습이 완료돼요.',
    ],
    ai: [
      '1. 화면 하단의 마이크 버튼을 눌러 질문을 시작하세요.',
      '2. 예: "잔액 확인 어떻게 해?"처럼 자연스럽게 말하면 돼요.',
      '3. AI가 적절한 기능을 설명하거나 바로 실행해줘요.',
    ],
    voicePhishing: [
      '1. 최근 문자와 통화 내용을 자동 분석해요.',
      '2. 피싱 의심 키워드가 감지되면 경고 메시지가 뜨고,',
      '3. 사용자에게 주의 사항을 안내하거나 신고 기능을 제공해요.',
    ],
    location: [
      '1. 위치 접근 권한을 허용해 주세요.',
      '2. 현재 위치를 기준으로 근처 은행과 ATM이 지도에 표시돼요.',
      '3. 원하는 지점을 클릭하면 길찾기 기능으로 연결돼요.',
    ],
    accessibility: [
      '1. 내 정보 > 글자 크기 설정에서 글자를 크게 볼 수 있어요.',
      '2. 음향 크기 설정에서는 음성 안내 볼륨도 조절할 수 있어요.',
      '3. 모든 기능에 자동 적용되어 사용이 훨씬 편리해져요.',
    ],
    quiz: [
      '1. 주요 금융 용어와 입금 방법을 퀴즈 형식으로 익힐 수 있어요.',
      '2. 문제를 풀면 정답 여부와 해설이 바로 제공돼요.',
      '3. 퀴즈는 반복 학습을 통해 자연스럽게 금융 지식을 쌓을 수 있게 도와줘요.',
    ],
    welfare: [
      '1. 사용자의 지역 기반으로 이용 가능한 복지 혜택을 확인할 수 있어요.',
      '2. 간단한 질문에 답하면 해당되는 복지 항목을 자동으로 추천해줘요.',
      '3. 관련 기관 웹사이트나 전화번호로 바로 연결해주는 기능도 있어요.',
    ],
  };

  const steps = guideSteps[sectionKey] || ['해당 기능에 대한 설명이 없습니다.'];

  return (
    <LinearGradient
      colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <CustomText style={styles.title}>{title}</CustomText>

        <View style={styles.stepWrapper}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepBox}>
              <CustomText style={styles.stepText}>{step}</CustomText>
              {/* <Image source={...} style={styles.stepImage} /> */}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },

  container: {
    padding: 24,
    alignItems: 'center',
  },

  title: {
    fontWeight: '900',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 30,
    color: '#1A4DCC',
  },

  stepWrapper: {
    width: '100%',
    rowGap: 20, // React Native 0.71+; 하위 버전이면 marginBottom으로 대체
  },

  stepBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.5)',
    shadowColor: '#4B7BE5',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },

  stepText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },

  stepImage: {
    width: '100%',
    height: 160,
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: '#EEE',
  },
});
