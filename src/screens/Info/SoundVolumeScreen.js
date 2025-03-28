import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import SystemSetting from 'react-native-system-setting';
import Tts from 'react-native-tts';

const SoundVolumeScreen = () => {
  const [volume, setVolume] = useState(0.5);
  const [selectedVoice, setSelectedVoice] = useState('com.google.android.tts:ko-kr-x-ism-local');

  // 미리 정의한 음성 목록
  const voices = [
    { id: 'com.google.android.tts:ko-kr-x-ism-local', name: '여성1 (기본)' },
    { id: 'com.google.android.tts:ko-KR-language', name: '남성1' },
    { id: 'com.google.android.tts:ko-KR', name: '여성2' },
  ];

  useEffect(() => {
    // 현재 볼륨 가져오기
    SystemSetting.getVolume().then((v) => {
      setVolume(v);
    });

    // TTS 초기 설정
    Tts.setDefaultLanguage('ko-KR');
    Tts.setDefaultVoice(selectedVoice);
  }, []);

  const onVolumeChange = (value) => {
    setVolume(value);
    SystemSetting.setVolume(value); // 실제 볼륨 조절
  };

  const handleVoiceSelect = (voiceId) => {
    setSelectedVoice(voiceId);
    Tts.setDefaultVoice(voiceId);
  };

  const handlePreview = () => {
    Tts.stop();
    Tts.speak('안녕하세요. 이 목소리는 미리듣기입니다.');
  };

  return (
    <LinearGradient colors={['#AEEEEE', '#DDA0DD']} style={styles.container}>
      <Text style={styles.title}>음향 크기 설정</Text>

      {/* 음성 선택 */}
      <View style={styles.voiceContainer}>
        <Text style={styles.subtitle}>음성 선택</Text>
        {voices.map((voice) => (
          <TouchableOpacity
            key={voice.id}
            onPress={() => handleVoiceSelect(voice.id)}
            style={[
              styles.voiceOption,
              { backgroundColor: selectedVoice === voice.id ? '#DDA0DD' : '#eee' },
            ]}
          >
            <Text style={{ color: selectedVoice === voice.id ? '#fff' : '#333' }}>
              {voice.name}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
          <Text style={styles.previewText}>🔊 미리듣기</Text>
        </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  voiceContainer: {
    width: '100%',
    marginBottom: 40,
  },
  voiceOption: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  previewButton: {
    backgroundColor: '#008bff',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  previewText: {
    color: 'white',
    fontWeight: 'bold',
  },
  slider: {
    width: '90%',
    height: 40,
  },
});

export default SoundVolumeScreen;
