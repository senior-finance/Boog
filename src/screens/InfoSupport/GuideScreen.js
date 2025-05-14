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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

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
    <LinearGradient colors={['rgb(200, 230, 253)', 'rgb(228, 240, 252)']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 타이틀 */}
        <CustomText style={styles.title}>📘 앱 사용법</CustomText>

        {/* 검색창 */}
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
              onPress={() => goToDetail(key)}
              activeOpacity={0.85}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={['rgb(255, 255, 255)', 'rgb(172, 212, 250)']} 
                style={styles.listCard}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              >
                <View style={styles.rowWrap}>
                  <CustomText style={styles.icon}>{item.icon}</CustomText>
                  <CustomText style={styles.cardText}>{item.title}</CustomText>
                </View>
                <Ionicons name="chevron-forward" size={28} color="#1B3C78" />
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
    fontSize: 22,
    color: '#1B3C78',
    textAlign: 'center',
    marginBottom: 18,
  },

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

  cardWrapper: {
    marginBottom: 20,
    borderRadius: 20,
  },

  listCard: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,

     borderWidth: 1.5,
  borderColor: 'rgba(139, 177, 246, 0.2)', 
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 26,
    marginRight: 12,
  },
  cardText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1B3C78',
  },
});
