// ⚙️ UI만 리팩토링 된 SoundVolumeScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import SystemSetting from 'react-native-system-setting';
import Tts from 'react-native-tts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';

const SoundVolumeScreen = () => {
  const [volume, setVolume] = useState(0.5);
  const [selectedVoice, setSelectedVoice] = useState('com.google.android.tts:ko-kr-x-ism-local');

  const voices = [
    { id: 'com.google.android.tts:ko-kr-x-ism-local', name: '여성1 (기본)' },
    { id: 'com.google.android.tts:ko-KR', name: '여성2' },
    { id: 'com.google.android.tts:ko-KR-language', name: '남성1' },
  ];

  useEffect(() => {
    SystemSetting.getVolume().then(v => setVolume(v));
    Tts.setDefaultLanguage('ko-KR');
    Tts.setDefaultVoice(selectedVoice);
  }, []);

  const onVolumeChange = value => {
    setVolume(value);
    SystemSetting.setVolume(value);
  };

  const handleVoiceSelect = voiceId => {
    setSelectedVoice(voiceId);
    Tts.setDefaultVoice(voiceId);
  };

  const handlePreview = () => {
    Tts.stop();
    Tts.speak('안녕하세요. 이 목소리는 미리듣기입니다.');
  };

  return (
    <LinearGradient colors={['rgb(192, 211, 231)', 'rgb(199, 215, 230)']} style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name="volume-high-outline"
          size={32}
          color="#1A4DCC"
          style={{ marginBottom: 10 }}
        />
        <CustomText style={styles.title}>음향 크기 설정</CustomText>

        <CustomText style={styles.subtitle}>음성 선택</CustomText>
        {voices.map(voice => (
          <TouchableOpacity
            key={voice.id}
            onPress={() => handleVoiceSelect(voice.id)}
            style={[
              styles.voiceOption,
              {
                backgroundColor: selectedVoice === voice.id ? '#4B7BE5' : '#fff',
                borderColor: selectedVoice === voice.id ? '#4B7BE5' : '#ccc',
              },
            ]}
          >
            <CustomText
              style={{
                color: selectedVoice === voice.id ? '#fff' : '#333',
                fontWeight: '600',
              }}
            >
              {voice.name}
            </CustomText>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
          <CustomText style={styles.previewText}>🔊 미리듣기</CustomText>
        </TouchableOpacity>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          step={0.01}
          onValueChange={onVolumeChange}
          minimumTrackTintColor="#1A4DCC"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#1A4DCC"
        />
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
  card: {
    width: '90%',
    paddingVertical: 30,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',

    
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.6)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A4DCC',
    fontSize: 18,
  },
  subtitle: {
    fontWeight: '600',
    marginBottom: 10,
    color: '#1A4DCC',
    alignSelf: 'flex-start',
    fontSize: 15,
  },
  voiceOption: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
  },
  previewButton: {
    backgroundColor: '#4B7BE5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 14,
    elevation: 3,
  },
  previewText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 30,
    transform: [{ scaleY: 1.3 }],
  },
});

export default SoundVolumeScreen;
