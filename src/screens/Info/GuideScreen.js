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
    borderColor: '#2196F3',
  },
  ai: {
    icon: '🧠',
    title: 'AI 대화 사용법',
    borderColor: '#9C27B0',
  },
  voicePhishing: {
    icon: '🚨',
    title: '보이스피싱 탐지법',
    borderColor: '#F44336',
  },
  location: {
    icon: '🗺️',
    title: '근처 은행/ATM 찾기',
    borderColor: '#FFC107',
  },
  accessibility: {
    icon: '🔊',
    title: '글자/음향 크기 조절',
    borderColor: '#4CAF50',
  },
};


  const goToDetail = (sectionKey) => {
    const { title } = sectionDetails[sectionKey];
    navigation.navigate('GuideDetail', { title, key: sectionKey });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText style={styles.title}>앱 사용법 가이드</CustomText>

      {Object.keys(sectionDetails).map((key) => {
        const item = sectionDetails[key];
        return (
          <TouchableOpacity
            key={key}
            style={[styles.card, { borderColor: item.borderColor }]}
            onPress={() => goToDetail(key)}
            activeOpacity={0.8}
          >
            <View style={styles.leftSection}>
              <CustomText style={styles.icon}>{item.icon}</CustomText>
              <CustomText style={styles.cardTitle}>{item.title}</CustomText>
            </View>
            <CustomText style={styles.arrow}>{'>'}</CustomText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    color: '#222',
    textAlign: 'center',
    marginBottom: 50,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 40,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  cardTitle: {
    color: '#111',
    fontWeight: 'bold',
  },
  arrow: {
    color: '#4B7BE5',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
