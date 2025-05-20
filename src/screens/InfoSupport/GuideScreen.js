import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function GuideScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const sectionDetails = {
    deposit: { icon: '💸', title: '입출금 방법' },
    ai: { icon: '🧠', title: 'AI 대화 사용법' },
    voicePhishing: { icon: '🚨', title: '보이스피싱 탐지법' },
    location: { icon: '🗺️', title: '근처 은행/ATM 찾기' },
    accessibility: { icon: '🔊', title: '글자/음향 크기 조절' },
    quiz: { icon: '❓', title: '금융 퀴즈 이용법' }, // 🆕 추가
    welfare: { icon: '🎁', title: '복지혜택 확인 방법' }, // 🆕 추가
  };


  const filteredSections = Object.keys(sectionDetails).filter((key) =>
    sectionDetails[key].title.toLowerCase().includes(searchText.toLowerCase())
  );

  const goToDetail = (sectionKey) => {
    const { title } = sectionDetails[sectionKey];
    navigation.navigate('GuideDetail', { title, key: sectionKey });
  };

  return (
    <LinearGradient colors={['rgba(140, 182, 222, 0.69)', '#e0f0ff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <CustomText style={styles.title}>📘 앱 사용법</CustomText>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color='rgb(39, 39, 39)' style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하세요..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor='rgb(39, 39, 39)'
          />
        </View>

        {filteredSections.map((key) => {
          const item = sectionDetails[key];
          return (
            <TouchableOpacity
              key={key}
              onPress={() => goToDetail(key)}
              activeOpacity={0.85}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={['#ffffff', '#d6eaff']}
                style={styles.listCard}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              >
                <View style={styles.rowWrap}>
                  <CustomText style={styles.icon}>{item.icon}</CustomText>
                  <CustomText style={styles.cardText}>{item.title}</CustomText>
                </View>
                <Ionicons name="chevron-forward" size={23} color="#1446D8" />
              </LinearGradient>
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
    color: '#1446D8',
    textAlign: 'center',
    marginBottom: 18,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 24,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },

  cardWrapper: {
    marginBottom: 20,
    borderRadius: 20,
  },

  listCard: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,

    borderWidth: 1.5,
    borderColor: 'rgba(21, 70, 216, 0.24)',
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  cardText: {
    fontWeight: '600',
    color: 'rgb(39, 39, 39)',
  },
});
