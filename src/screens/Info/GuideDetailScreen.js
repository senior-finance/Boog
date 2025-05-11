import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
  };

  const steps = guideSteps[sectionKey] || ['해당 기능에 대한 설명이 없습니다.'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText style={styles.title}>{title}</CustomText>
      <View style={styles.stepWrapper}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepBox}>
            <CustomText style={styles.stepText}>{step}</CustomText>
            {/* 나중에 이미지 들어갈 자리 */}
            {/* <Image source={...} style={styles.stepImage} /> */}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F5F6FA',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 28,
    color: '#111',
  },
  stepWrapper: {
    gap: 24,
  },
  stepBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  stepText: {
    color: '#333',
    lineHeight: 22,
    fontWeight: '500',
  },
  stepImage: {
    width: '100%',
    height: 160,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
});
