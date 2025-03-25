import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import SystemSetting from 'react-native-system-setting';

const SoundVolumeScreen = () => {
  const [volume, setVolume] = useState(0.5); // 0 ~ 1 사이 값

  // 현재 볼륨 가져오기
  useEffect(() => {
    SystemSetting.getVolume().then((v) => {
      setVolume(v);
    });
  }, []);


  const onVolumeChange = (value) => {
    setVolume(value);
    SystemSetting.setVolume(value); // 실제 볼륨 조절
  };


  return (
    <LinearGradient colors={['#AEEEEE', '#DDA0DD']} style={styles.container}>
      <Text style={styles.title}>음향 크기 설정</Text>

      {/* 음향 아이콘 */}
      <View style={styles.waveContainer}>
        <Text style={{ fontSize: 60 }}>🔊</Text>
      </View>

      {/* 볼륨 조절 슬라이더 */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        step={0.01}
        onValueChange={onVolumeChange}
        minimumTrackTintColor="#ffffff"
        maximumTrackTintColor="#000000"
        thumbTintColor="#fff"
      />

      
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  waveContainer: {
    marginBottom: 40,
  },
  slider: {
    width: '80%',
    height: 40,
    marginBottom: 40,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#ffffffaa',
  },
  navText: {
    fontSize: 16,
    color: '#555',
  },
});

export default SoundVolumeScreen;
