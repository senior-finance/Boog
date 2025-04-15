import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Tts from 'react-native-tts';
import SystemSetting from 'react-native-system-setting';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { setTtsPitch, setTtsRate, setTtsVoice } from '../../utils/ttsUtils';
import { playSound, setSoundVolume } from '../../utils/soundUtils';

const VoiceSoundSettingScreen = () => {
  const [ttsRate, setRate] = useState(0.5);
  const [ttsPitch, setPitch] = useState(1);
  const [soundVolume, setVolume] = useState(0.5);
  const [systemVolume, setSystemVolume] = useState(0.5);

  const voiceOptions = [
    { id: 'ko-KR-language', name: '기본 한국어 음성'},
    { id: 'ko-kr-x-ism-local', name: '여성1 (조용함)' },
    { id: 'ko-kr-x-kod-local', name: '여성2 (표준)' },
    { id: 'ko-kr-x-kob-local', name: '여성3 (활발함)' },
    { id: 'ko-kr-x-koc-local', name: '남성1 (표준)' }
  ];

  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[0].id);

  useEffect(() => {
    Tts.setDefaultRate(ttsRate);
    Tts.setDefaultPitch(ttsPitch);
    Tts.setDefaultVoice(selectedVoice);
    SystemSetting.getVolume().then(setSystemVolume);
  }, []);

  const handleTtsTest = () => {
    Tts.speak('안녕하세요. 이 목소리는 설정된 음성입니다.');
  };

  const handleSoundTest = () => {
    playSound(soundVolume);
  };

  const handleSystemVolumeChange = (value) => {
    setSystemVolume(value);
    SystemSetting.setVolume(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionRow}>
        <Ionicons name="volume-high-outline" size={22} color="#4B7BE5" />
        <Text style={styles.sectionTitle}>전체 볼륨</Text>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={systemVolume}
        onValueChange={handleSystemVolumeChange}
      />

      <View style={styles.sectionRow}>
        <Ionicons name="mic-outline" size={20} color="#4B7BE5" />
        <Text style={styles.sectionTitle}>음성 안내 설정</Text>
      </View>

      <Text style={styles.label}>음성 선택</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedVoice}
          onValueChange={(itemValue) => {
            setSelectedVoice(itemValue);
            setTtsVoice(itemValue);
          }}
          style={styles.picker}
        >
          {voiceOptions.map(voice => (
            <Picker.Item key={voice.id} label={voice.name} value={voice.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>속도</Text>
      <Slider
        minimumValue={0.3}
        maximumValue={1.5}
        step={0.1}
        value={ttsRate}
        onValueChange={(v) => {
          setRate(v);
          setTtsRate(v);
        }}
      />

      <Text style={styles.label}>높낮이</Text>
      <Slider
        minimumValue={0.5}
        maximumValue={2.0}
        step={0.1}
        value={ttsPitch}
        onValueChange={(v) => {
          setPitch(v);
          setTtsPitch(v);
        }}
      />

      <TouchableOpacity style={styles.testButton} onPress={handleTtsTest}>
        <Ionicons name="play-circle" size={20} color="#fff" />
        <Text style={styles.testButtonText}>음성 미리듣기</Text>
      </TouchableOpacity>

      <View style={styles.sectionRow}>
        <Ionicons name="musical-notes-outline" size={20} color="#4B7BE5" />
        <Text style={styles.sectionTitle}>효과음 설정</Text>
      </View>

      <Text style={styles.label}>효과음 볼륨</Text>
      <Slider
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={soundVolume}
        onValueChange={(v) => {
          setVolume(v);
          setSoundVolume(v);
        }}
      />

      <TouchableOpacity style={styles.testButton} onPress={handleSoundTest}>
        <Ionicons name="play-circle" size={20} color="#fff" />
        <Text style={styles.testButtonText}>효과음 테스트</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VoiceSoundSettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff'
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: 18,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B7BE5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  testButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#fff',
    fontWeight: '600',
  },
});