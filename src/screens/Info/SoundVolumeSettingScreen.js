import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Slider from 'react-native-slider';
import Tts from 'react-native-tts';
import SystemSetting from 'react-native-system-setting';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';
import {
  setTtsPitch,
  setTtsRate,
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

  const { systemVolume, setSystemVolume } = useVolume();

  const INITIAL_SETTINGS = {
    ttsRate: 0.5,
    ttsPitch: 1.0,
    systemVolume: 0.5,
  };

  // 시스템 볼륨 초기화
  useEffect(() => {
    const syncSystemVolume = async () => {
      const current = await SystemSetting.getVolume();
      setSystemVolume(current);
    };
    syncSystemVolume();
  }, []);

  useEffect(() => {
    loadSound();
    (async () => {
      const saved = await loadSetting();
      if (saved) {
        setRate(saved.ttsRate);
        setPitch(saved.ttsPitch);

        Tts.setDefaultRate(saved.ttsRate);
        Tts.setDefaultPitch(saved.ttsPitch);
      } else {
        Tts.setDefaultRate(INITIAL_SETTINGS.ttsRate);
        Tts.setDefaultPitch(INITIAL_SETTINGS.ttsPitch);
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
    saveSetting({ ttsRate, ttsPitch, systemVolume: value });
  };

  const handleResetSettings = () => {
    setRate(INITIAL_SETTINGS.ttsRate);
    setPitch(INITIAL_SETTINGS.ttsPitch);
    setSystemVolume(INITIAL_SETTINGS.systemVolume);

    Tts.setDefaultRate(INITIAL_SETTINGS.ttsRate);
    Tts.setDefaultPitch(INITIAL_SETTINGS.ttsPitch);
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
          minimumTrackTintColor="#1A4DCC"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#1A4DCC"
          trackStyle={{ height: 5, borderRadius: 3 }}
          thumbStyle={{
            width: 25,
            height: 25,
            borderRadius: 13,
            backgroundColor: '#1A4DCC',
            borderColor: '#fff',
            borderWidth: 2,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.sectionRow}>
          <Ionicons name="mic-outline" size={20} color="#4B7BE5" />
          <CustomText style={styles.sectionTitle}>음성 안내 설정</CustomText>
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
            saveSetting({ ttsRate: v, ttsPitch, systemVolume });
          }}
          minimumTrackTintColor="#1A4DCC"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#1A4DCC"
          trackStyle={{ height: 5, borderRadius: 3 }}
          thumbStyle={{
            width: 25,
            height: 25,
            borderRadius: 13,
            backgroundColor: '#1A4DCC',
            borderColor: '#fff',
            borderWidth: 2,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
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
            saveSetting({ ttsRate, ttsPitch: v, systemVolume });
          }}
          minimumTrackTintColor="#1A4DCC"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#1A4DCC"
          trackStyle={{ height: 5, borderRadius: 3 }}
          thumbStyle={{
            width: 25,
            height: 25,
            borderRadius: 13,
            backgroundColor: '#1A4DCC',
            borderColor: '#fff',
            borderWidth: 2,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
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
    backgroundColor: 'rgb(208, 224, 241)',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.5)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1A4DCC',
    marginLeft: 8,
  },
  label: {
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B7BE5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 18,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
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
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 5,
    marginBottom: 40,
  },
  resetButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default SoundVolumeSettingScreen;