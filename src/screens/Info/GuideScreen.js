import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import CustomText from '../../components/CustomText';
import { useNavigation } from '@react-navigation/native';

export default function GuideScreen() {
  const navigation = useNavigation();

  const sectionDetails = {
    deposit: {
      icon: '💸',
      title: '입출금 방법',
      content: '은행, 계좌번호, 금액을 입력해 입출금을 연습해보세요.\n실제 송금은 되지 않아요.',
      borderColor: '#A3D8F4',
    },
    ai: {
      icon: '🧠',
      title: 'AI 대화 사용법',
      content: '말로 질문하면 챗봇이\n송금, 조회, 인증 등 기능을 안내해줘요.',
      borderColor: '#D9CFFF',
    },
    voicePhishing: {
      icon: '🚨',
      title: '보이스피싱 탐지법',
      content: '의심되는 문자나 통화를 자동 분석해서\n위험 내용을 알려줘요.',
      borderColor: '#FFB8B8',
    },
    location: {
      icon: '🗺️',
      title: '근처 은행/ATM 찾기',
      content: '현재 위치 기준으로\n가장 가까운 ATM을 안내해줘요.',
      borderColor: '#FDD974',
    },
    accessibility: {
      icon: '🔊',
      title: '글자/음향 크기 조절',
      content: '글자 크기와 음향 크기를\n자유롭게 설정할 수 있어요.',
      borderColor: '#B7E5B4',
    },
  };

  const goToDetail = (sectionKey) => {
    const { title, content } = sectionDetails[sectionKey];
    navigation.navigate('GuideDetail', { title, content, key: sectionKey });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText style={styles.title}>앱 사용법 가이드</CustomText>

      {Object.keys(sectionDetails).map((key) => {
        const item = sectionDetails[key];
        return (
          <View key={key} style={[styles.card, { borderColor: item.borderColor }]}>
            <CustomText style={styles.icon}>{item.icon}</CustomText>
            <CustomText style={styles.cardTitle}>{item.title}</CustomText>
            <CustomText style={styles.cardDesc}>{item.content}</CustomText>
            <TouchableOpacity style={styles.button} onPress={() => goToDetail(key)}>
              <CustomText style={styles.buttonText}>자세히 보기</CustomText>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontWeight: '900',
    color: '#222',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDesc: {
    color: '#444',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#4B7BE5',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
