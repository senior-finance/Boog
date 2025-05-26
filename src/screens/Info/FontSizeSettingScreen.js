import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from 'react-native-slider'; // react-native-slider 사용
import { useFontSize } from './FontSizeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';

const FontSizeSettingScreen = ({ navigation }) => {
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

    setTimeout(() => {
      setApplied(false);
      navigation.navigate('MainTabs', { screen: '내 정보' });
    }, 500);
  };

  return (
    <LinearGradient colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']} style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="text-outline" size={32} color="#1A4DCC" style={{ marginBottom: 12 }} />
        <CustomText style={styles.title}>글자 크기 설정</CustomText>

        <CustomText style={[styles.previewText, { fontSize: tempFontSize }]}>
          변경하실 글자 예시입니다
        </CustomText>

        {/* 슬라이더 Wrapper로 감싸서 너비와 정렬 해결 */}
        <View style={styles.sliderWrapper}>
          <Slider
            value={tempFontSize}
            onValueChange={value => setTempFontSize(value)}
            minimumValue={12}
            maximumValue={23}
            step={1}
            minimumTrackTintColor="#1A4DCC"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#1A4DCC"
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
          />
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, applied && styles.confirmButtonApplied]}
          onPress={handleConfirm}
        >
          <CustomText style={styles.confirmButtonText}>적용하기</CustomText>
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
    width: '90%',
    height: 440,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',

    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.6)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1A4DCC',
    marginBottom: 10,
  },
  previewText: {
    color: '#333',
    marginVertical: 16,
    textAlign: 'center',
    lineHeight: 28,
  },
  sliderWrapper: {
    width: '100%',
    paddingHorizontal: 4,
    alignItems: 'stretch',
    marginTop: 12,
    marginBottom: 28,
  },
  track: {
    height: 7,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  thumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A4DCC',
    borderColor: '#fff',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  confirmButton: {
    backgroundColor: '#4B7BE5',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    elevation: 4,
  },
  confirmButtonApplied: {
    backgroundColor: '#2F5AE5',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FontSizeSettingScreen;