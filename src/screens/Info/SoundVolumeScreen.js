import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import SystemSetting from 'react-native-system-setting';
import Tts from 'react-native-tts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SoundVolumeScreen = () => {
  const [volume, setVolume] = useState(0.5);
  const [selectedVoice, setSelectedVoice] = useState('com.google.android.tts:ko-kr-x-ism-local');

  const voices = [
    { id: 'com.google.android.tts:ko-kr-x-ism-local', name: '여성1 (기본)' },
     { id: 'com.google.android.tts:ko-KR', name: '여성2' },
    { id: 'com.google.android.tts:ko-KR-language', name: '남성1' },
   
  ];

  useEffect(() => {
    SystemSetting.getVolume().then((v) => setVolume(v));
    Tts.setDefaultLanguage('ko-KR');
    Tts.setDefaultVoice(selectedVoice);
  }, []);

  const onVolumeChange = (value) => {
    setVolume(value);
    SystemSetting.setVolume(value);
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
    <LinearGradient colors={['#F8F8F8', '#F8F8F8']} style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="volume-high-outline" size={32} color="#4B7BE5" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>음향 크기 설정</Text>

        {/* 음성 선택 */}
        <Text style={styles.subtitle}>음성 선택</Text>
        {voices.map((voice) => (
          <TouchableOpacity
            key={voice.id}
            onPress={() => handleVoiceSelect(voice.id)}
            style={[
              styles.voiceOption,
              {
                backgroundColor: selectedVoice === voice.id ? '#4B7BE5' : '#fff',
              },
            ]}
          >
            <Text style={{
              color: selectedVoice === voice.id ? '#fff' : '#333',
              fontWeight: '600',
            }}>
              {voice.name}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
          <Text style={styles.previewText}>🔊 미리듣기</Text>
        </TouchableOpacity>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          step={0.01}
          onValueChange={onVolumeChange}
          minimumTrackTintColor="#4B7BE5"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#4B7BE5"
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
    width: '88%',
    paddingVertical: 30,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    alignSelf: 'flex-start',
  },
  voiceOption: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  previewButton: {
    backgroundColor: '#4B7BE5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  previewText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 30,
  },
});

export default SoundVolumeScreen;
