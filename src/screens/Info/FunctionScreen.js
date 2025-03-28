import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

// 버튼 컴포넌트 (MainScreen 스타일과 동일)
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
        <Text style={styles.title}>기능 선택</Text>

        <View style={styles.gridContainer}>
          <FunctionButton
            title="퀴즈"
            icon="school"
            onPress={() => navigation.navigate('Learning')}
          />
          <FunctionButton
            title="지도"
            icon="map"
            onPress={() => navigation.navigate('MapView')}
          />
          <FunctionButton
            title="검색"
            icon="search"
            onPress={() => navigation.navigate('MapSearch')}
          />
          <FunctionButton
            title="AI 대화"
            icon="mic"
            onPress={() => navigation.navigate('VoiceInput')}
          />
          <FunctionButton
            title="지문 인증"
            icon="finger-print"
            onPress={() => navigation.navigate('Biometric')}
          />
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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
  },
  functionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  functionText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    fontWeight: '600',
  },
});

export default FunctionScreen;
