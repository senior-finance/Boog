import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const FunctionButton = ({ title, onPress, icon }) => (
  <TouchableOpacity style={styles.functionButton} onPress={onPress}>
    <Ionicons name={icon} size={30} color="#4B7BE5" />
    <Text style={styles.functionText}>{title}</Text>
  </TouchableOpacity>
);

const FunctionScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          <FunctionButton title="퀴즈" icon="school" onPress={() => navigation.navigate('Learning')} />
          <FunctionButton title="지도" icon="map" onPress={() => navigation.navigate('MapView')} />
          <FunctionButton title="장소 검색" icon="search" onPress={() => navigation.navigate('MapSearch')} />
          <FunctionButton title="AI 대화" icon="mic" onPress={() => navigation.navigate('VoiceInput')} />
          <FunctionButton title="지문 인증" icon="finger-print" onPress={() => navigation.navigate('Biometric')} />
          <FunctionButton title="정부 복지 혜택" icon="gift" onPress={() => navigation.navigate('Welfare')} />
          <FunctionButton title="자동 문자/통화 분석" icon="phone-portrait" onPress={() => navigation.navigate('AutoPhoneAnalysis')} />
          <FunctionButton title="보이스 피싱 사례" icon="alert-circle-outline" onPress={() => navigation.navigate('VoicePhishing')} />
          <FunctionButton title="통화 및 문자 분석" icon="document-text-outline" onPress={() => navigation.navigate('CallTextAnalysis')} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // 더 꽉 차 보이게
    width: '90%',
    marginTop: 20,
  },
  functionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 40, // 버튼 키우기
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  functionText: {
    fontSize: 17,
    color: '#333',
    marginTop: 10,
    fontWeight: '600',
  },
});

export default FunctionScreen;
