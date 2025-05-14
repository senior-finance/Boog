import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import { useNavigation } from '@react-navigation/native';

export default function GuideScreen() {
  const navigation = useNavigation();

  const sectionDetails = {
    deposit: { icon: '💸', title: '입출금 방법' },
    ai: { icon: '🧠', title: 'AI 대화 사용법' },
    voicePhishing: { icon: '🚨', title: '보이스피싱 탐지법' },
    location: { icon: '🗺️', title: '근처 은행/ATM 찾기' },
    accessibility: { icon: '🔊', title: '글자/음향 크기 조절' },
  };

  const goToDetail = (sectionKey) => {
    const { title } = sectionDetails[sectionKey];
    navigation.navigate('GuideDetail', { title, key: sectionKey });
  };

  return (
    <LinearGradient colors={['#B3D9FF', '#E6F2FF']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <CustomText style={styles.title}>📘 앱 사용법</CustomText>

        {Object.keys(sectionDetails).map((key) => {
          const item = sectionDetails[key];
          return (
            <TouchableOpacity
              key={key}
              style={styles.listCard}
              onPress={() => goToDetail(key)}
              activeOpacity={0.85}
            >
              <View style={styles.rowWrap}>
                <CustomText style={styles.icon}>{item.icon}</CustomText>
                <CustomText style={styles.cardText}>{item.title}</CustomText>
              </View>
              <CustomText style={styles.arrow}>›</CustomText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontWeight: '900',
    fontSize: 22,
    color: '#1B3C78',
    textAlign: 'center',
    marginBottom: 30,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 22,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 22,
    marginRight: 12,
  },
  cardText: {
    fontWeight: '600',
    color: '#222',
  },
  arrow: {

    fontWeight: 'bold',
    color: '#4A90E2',
  },
});
