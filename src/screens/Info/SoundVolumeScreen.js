// SoundVolumeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Slider, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 사용 시 필요

const SoundVolumeScreen = () => {
  const [volume, setVolume] = useState(50);

  return (
    <LinearGradient colors={['#AEEEEE', '#DDA0DD']} style={styles.container}>
      <Text style={styles.title}>음향 크기 설정</Text>

      {/* 파형 애니메이션 대신 정적 그림이나 컴포넌트 대체 가능 */}
      <View style={styles.waveContainer}>
        <Text style={{ fontSize: 60 }}>🌊</Text>
      </View>

      {/* 볼륨 조절 슬라이더 */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        value={volume}
        onValueChange={(val) => setVolume(val)}
        minimumTrackTintColor="#ffffff"
        maximumTrackTintColor="#000000"
        thumbTintColor="#fff"
      />

      {/* 하단 네비게이션 바 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Text style={styles.navText}>🏠 확인 화면</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navText}>⭐</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navText}>👤 사용자 정보</Text>
        </TouchableOpacity>
      </View>
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
    bottom: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ffffff88',
  },
  navText: {
    fontSize: 16,
  },
});

export default SoundVolumeScreen;
