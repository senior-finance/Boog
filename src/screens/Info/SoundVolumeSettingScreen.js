import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Tts from 'react-native-tts';
import SystemSetting from 'react-native-system-setting';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';
import {
  setTtsPitch,
  setTtsRate,
  setTtsVoice,
} from '../../utils/ttsUtils';
import {
  playSound,
  loadSound,
} from '../../utils/soundUtils';
import {
  loadSetting,
  saveSetting,
  STORAGE_KEY,
} from '../../utils/settingStorage';
import { useVolume } from '../../contexts/VolumeContext';

const SoundVolumeSettingScreen = () => {
  const [ttsRate, setRate] = useState(0.5);
  const [ttsPitch, setPitch] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState('ko-KR-language');

  const { systemVolume, setSystemVolume } = useVolume();

  const INITIAL_SETTINGS = {
    ttsRate: 0.5,
    ttsPitch: 1.0,
    systemVolume: 0.5,
    selectedVoice: 'ko-KR-language',
  };

  const voiceOptions = [
    { id: 'ko-KR-language', name: '기본 한국어 음성' },
    { id: 'ko-kr-x-ism-local', name: '여성1 (조용함)' },
    { id: 'ko-kr-x-kob-local', name: '여성2 (차분함)' },
    { id: 'ko-kr-x-kod-local', name: '남성1 (표준)' },
    { id: 'ko-kr-x-koc-local', name: '남성2 (차분함)' },
  ];

  // 1. 시스템 볼륨 슬라이더 초기화
  useEffect(() => {
    const syncSystemVolume = async () => {
      const current = await SystemSetting.getVolume();
      setSystemVolume(current); // ✅ 현재 볼륨 기반으로 슬라이더 설정
    };
    syncSystemVolume();
  }, []);

  // 2. TTS 관련 설정만 로딩
  useEffect(() => {
    loadSound();
    (async () => {
      const saved = await loadSetting();
      if (saved) {
        setRate(saved.ttsRate);
        setPitch(saved.ttsPitch);
        setSelectedVoice(saved.selectedVoice);

        Tts.setDefaultRate(saved.ttsRate);
        Tts.setDefaultPitch(saved.ttsPitch);
        Tts.setDefaultVoice(saved.selectedVoice);
      } else {
        Tts.setDefaultRate(INITIAL_SETTINGS.ttsRate);
        Tts.setDefaultPitch(INITIAL_SETTINGS.ttsPitch);
        Tts.setDefaultVoice(INITIAL_SETTINGS.selectedVoice);
      }
    })();
  }, []);

  const handleTtsTest = () => {
    Tts.speak('안녕하세요. 이 목소리는 설정된 음성입니다.');
  };

  const handleSoundTest = () => {
    playSound(1.0);
  };

  const handleSystemVolumeChange = (value) => {
    setSystemVolume(value);
    SystemSetting.setVolume(value);
    saveSetting({ ttsRate, ttsPitch, selectedVoice, systemVolume: value });
  };

  const handleResetSettings = () => {
    setRate(INITIAL_SETTINGS.ttsRate);
    setPitch(INITIAL_SETTINGS.ttsPitch);
    setSystemVolume(INITIAL_SETTINGS.systemVolume);
    setSelectedVoice(INITIAL_SETTINGS.selectedVoice);

    Tts.setDefaultRate(INITIAL_SETTINGS.ttsRate);
    Tts.setDefaultPitch(INITIAL_SETTINGS.ttsPitch);
    Tts.setDefaultVoice(INITIAL_SETTINGS.selectedVoice);
    SystemSetting.setVolume(INITIAL_SETTINGS.systemVolume);

    saveSetting(INITIAL_SETTINGS);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.sectionRow}>
          <Ionicons name="volume-high-outline" size={22} color="#4B7BE5" />
          <CustomText style={styles.sectionTitle}>전체 볼륨</CustomText>
        </View>
        <Slider
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={systemVolume}
          onValueChange={handleSystemVolumeChange}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.sectionRow}>
          <Ionicons name="mic-outline" size={20} color="#4B7BE5" />
          <CustomText style={styles.sectionTitle}>음성 안내 설정</CustomText>
        </View>

        <CustomText style={styles.label}>음성 선택</CustomText>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedVoice}
            onValueChange={(itemValue) => {
              setSelectedVoice(itemValue);
              setTtsVoice(itemValue);
              saveSetting({ ttsRate, ttsPitch, selectedVoice: itemValue, systemVolume });
            }}
            style={styles.picker}
          >
            {voiceOptions.map((voice) => (
              <Picker.Item key={voice.id} label={voice.name} value={voice.id} />
            ))}
          </Picker>
        </View>

        <CustomText style={styles.label}>속도</CustomText>
        <Slider
          minimumValue={0.3}
          maximumValue={1.5}
          step={0.1}
          value={ttsRate}
          onValueChange={(v) => {
            setRate(v);
            setTtsRate(v);
            saveSetting({ ttsRate: v, ttsPitch, selectedVoice, systemVolume });
          }}
        />

        <CustomText style={styles.label}>높낮이</CustomText>
        <Slider
          minimumValue={0.5}
          maximumValue={2.0}
          step={0.1}
          value={ttsPitch}
          onValueChange={(v) => {
            setPitch(v);
            setTtsPitch(v);
            saveSetting({ ttsRate, ttsPitch: v, selectedVoice, systemVolume });
          }}
        />

        <TouchableOpacity style={styles.testButton} onPress={handleTtsTest}>
          <Ionicons name="play-circle" size={20} color="#fff" />
          <CustomText style={styles.testButtonText}>음성 미리듣기</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionRow}>
          <Ionicons name="musical-notes-outline" size={20} color="#4B7BE5" />
          <CustomText style={styles.sectionTitle}>효과음 테스트</CustomText>
        </View>

        <TouchableOpacity style={styles.testButton} onPress={handleSoundTest}>
          <Ionicons name="play-circle" size={20} color="#fff" />
          <CustomText style={styles.testButtonText}>효과음 재생</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.resetWrapper}>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
          <Ionicons name="refresh-circle" size={24} color="#fff" />
          <CustomText style={styles.resetButtonText}>초기화</CustomText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 25,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#4B7BE5'
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  label: {
    fontWeight: '500',
    marginTop: 16,
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
    marginTop: 18,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  testButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '600',
  },
  resetWrapper: {
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EC4F2A',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
    marginBottom: 40,
  },
  resetButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SoundVolumeSettingScreen;