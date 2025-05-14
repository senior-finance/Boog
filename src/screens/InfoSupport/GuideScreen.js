import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function GuideScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const sectionDetails = {
    deposit: { icon: '💸', title: '입출금 방법' },
    ai: { icon: '🧠', title: 'AI 대화 사용법' },
    voicePhishing: { icon: '🚨', title: '보이스피싱 탐지법' },
    location: { icon: '🗺️', title: '근처 은행/ATM 찾기' },
    accessibility: { icon: '🔊', title: '글자/음향 크기 조절' },
  };

  const filteredSections = Object.keys(sectionDetails).filter((key) =>
    sectionDetails[key].title.toLowerCase().includes(searchText.toLowerCase())
  );

  const goToDetail = (sectionKey) => {
    const { title } = sectionDetails[sectionKey];
    navigation.navigate('GuideDetail', { title, key: sectionKey });
  };

  return (
    <LinearGradient colors={['#B3D9FF', '#E6F2FF']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 📘 앱 사용법 제목 */}
        <CustomText style={styles.title}>📘 앱 사용법</CustomText>

        {/* 🔍 검색창 (돋보기 아이콘 포함) */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하세요..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#888"
          />
        </View>

        {/* 카드 리스트 */}
        {filteredSections.map((key) => {
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
    marginBottom: 18,
  },

  // 🔍 검색 영역
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
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

  // 카드 스타일
listCard: {
  backgroundColor: 'rgba(255, 255, 255, 0.25)', // 투명도 있는 흰 배경
  borderRadius: 20,
  paddingVertical: 20,
  paddingHorizontal: 20,
  marginBottom: 22,

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  // ✨ 입체적인 그림자 효과
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
  elevation: 10,

  borderWidth: 2,
  borderColor: 'rgba(79, 192, 229, 0.4)',
  backdropFilter: 'blur(10px)', // 웹에선 가능, RN에선 blurred lib 써야함
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
     fontSize: 25,     
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});
