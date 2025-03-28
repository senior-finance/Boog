import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import { useFontSize } from './FontSizeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FontSizeSettingScreen = () => {
  const { fontSize, setFontSize } = useFontSize();

  return (
    <LinearGradient colors={['#F8F8F8', '#F8F8F8']} style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="text-outline" size={30} color="#4B7BE5" style={{ marginBottom: 16 }} />
        <Text style={styles.title}>글자 크기 설정</Text>

        <Text style={[styles.previewText, { fontSize }]}>
          변경하실 글자 예시입니다
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={12}
          maximumValue={30}
          step={1}
          value={fontSize}
          onValueChange={value => setFontSize(value)}
          minimumTrackTintColor="#4B7BE5"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#4B7BE5"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '88%',
    height: 330, // 🔥 높이 늘림 (원래보다 큼)
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-evenly', // 위-중앙-아래 정렬 분산
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  previewText: {
    color: '#333',
  },
  slider: {
    width: '90%',
    height: 40,
  },
});

export default FontSizeSettingScreen;
