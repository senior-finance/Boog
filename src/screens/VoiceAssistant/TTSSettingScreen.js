import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/Ionicons';
import botImage from '../../assets/bot6.png';
import CustomText from '../../components/CustomText';

export default function TTSSettingScreen() {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(0.5);

  const voiceNameMap = {
    'ko-kr-x-ism-local': '여성1 (조용함)',
    'ko-kr-x-kod-local': '남성1 (표준)',
    'ko-kr-x-kob-local': '여성2 (차분함)',
    'ko-kr-x-koc-local': '남성2 (차분함)',
    'ko-KR-language': '기본 한국어 음성',
  };

  useEffect(() => {
    Tts.voices().then(voicesList => {
      const koreanLocalVoices = voicesList.filter(
        v => v.language === 'ko-KR' && !v.networkConnectionRequired
      );
      setVoices(koreanLocalVoices);
      if (koreanLocalVoices.length > 0) {
        setSelectedVoice(koreanLocalVoices[0].id);
        Tts.setDefaultVoice(koreanLocalVoices[0].id);
      }
    });
    Tts.setDefaultPitch(pitch);
    Tts.setDefaultRate(rate);
  }, []);

  const handleVoiceChange = (voiceId) => {
    setSelectedVoice(voiceId);
    Tts.setDefaultVoice(voiceId);
    Tts.speak('이 목소리는 어떠신가요?');
  };

  const handlePitchChange = (value) => {
    setPitch(value);
    Tts.setDefaultPitch(value);
    Tts.speak('음성 높이를 조절했습니다.');
  };

  const handleRateChange = (value) => {
    setRate(value);
    Tts.setDefaultRate(value);
    Tts.speak('말하는 속도를 조절했습니다.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View>
          <CustomText style={styles.title}>
            <CustomText style={styles.blueText}>상담원 부금이</CustomText>{'\n'}
            <CustomText style={styles.blackText}>   음성 설정</CustomText>
          </CustomText>
        </View>
        <Image source={botImage} style={styles.botImage} />
      </View>

      <View style={styles.labelRow}>
        <Icon name="volume-high-outline" size={20} color="#000" style={styles.iconSpacing} />
        <CustomText style={styles.label}>음성 종류 선택</CustomText>
      </View>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedVoice}
          onValueChange={handleVoiceChange}
          style={styles.picker}
        >
          {voices.map((voice) => (
            <Picker.Item
              key={voice.id}
              label={voiceNameMap[voice.id] || voice.id}
              value={voice.id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.labelRow}>
        <Icon name="musical-notes-outline" size={20} color="#000" style={styles.iconSpacing} />
        <CustomText style={styles.label}>말하는 속도</CustomText>
      </View>
      <View style={styles.sliderWrapper}>
        <Slider
          minimumValue={0.3}
          maximumValue={1.5}
          value={rate}
          onValueChange={handleRateChange}
          step={0.1}
        />
      </View>

      <View style={styles.labelRow}>
        <Icon name="mic-outline" size={20} color="#000" style={styles.iconSpacing} />
        <CustomText style={styles.label}>음성 높이</CustomText>
      </View>
      <View style={styles.sliderWrapper}>
        <Slider
          minimumValue={0.5}
          maximumValue={2.0}
          value={pitch}
          onValueChange={handlePitchChange}
          step={0.1}
        />
      </View>

      <TouchableOpacity
        style={styles.testButton}
        onPress={() => Tts.speak('안녕하세요! 이 목소리는 어떠신가요?')}
      >
        <View style={styles.buttonContent}>
          <Icon name="megaphone-outline" size={20} color="#4B7BE5" style={styles.iconSpacing} />
          <CustomText style={styles.testButtonText}>설정된 음성 들어보기</CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  titleRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
   //     fontWeight: 'bold',
    marginLeft: 55
  },
  blueText: {
    color: '#4B7BE5',
  },
  blackText: {
    color: '#333',
  },
  botImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginRight: 50
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 30,
  },
  label: {
    //    fontWeight: '600',
    color: '#333',
  },
  iconSpacing: {
    marginRight: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 40,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  sliderWrapper: {
    marginBottom: 40,
  },
  testButton: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButtonText: {
    color: '#4B7BE5',
    //    fontWeight: 'bold',
  },
});