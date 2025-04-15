import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import { useFontSize } from './FontSizeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';

const FontSizeSettingScreen = () => {
  const { fontSize, setFontSize } = useFontSize();
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [applied, setApplied] = useState(false);

  const handleConfirm = () => {
    setFontSize(tempFontSize);
    setApplied(true);

    if (Platform.OS === 'android') {
      ToastAndroid.show('적용되었습니다!', ToastAndroid.SHORT);
    } else {
      Alert.alert('알림', '적용되었습니다!');
    }

    // 색상 원래대로 복귀
    setTimeout(() => setApplied(false), 1500);
  };

  return (
    <LinearGradient colors={['#F8F8F8', '#F8F8F8']} style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="text-outline" size={30} color="#4B7BE5" style={{ marginBottom: 16 }} />
        <CustomText style={styles.title}>글자 크기 설정</CustomText>

        <CustomText style={[styles.previewText, { fontSize: tempFontSize }]}>
          변경하실 글자 예시입니다
        </CustomText>

        <Slider
          style={styles.slider}
          minimumValue={12}
          maximumValue={30}
          step={1}
          value={tempFontSize}
          onValueChange={value => setTempFontSize(value)}
          minimumTrackTintColor="#4B7BE5"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#4B7BE5"
        />

        <TouchableOpacity
          style={[styles.confirmButton, applied && styles.confirmButtonApplied]}
          onPress={handleConfirm}
        >
          <CustomText style={styles.confirmButtonText}>확인</CustomText>
        </TouchableOpacity>
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
    height: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
 
    fontWeight: 'bold',
    color: '#333',
  },
  previewText: {
    color: '#333',
    marginVertical: 16,
  },
  slider: {
    width: '90%',
    height: 40,
  },
  confirmButton: {
    backgroundColor: '#4B7BE5',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 10,
  },
  confirmButtonApplied: {
    backgroundColor: '#2F5AE5', // 더 진한 색으로 변경
  },
  confirmButtonText: {
    color: '#fff',
  
    fontWeight: 'bold',
  },
});

export default FontSizeSettingScreen;
