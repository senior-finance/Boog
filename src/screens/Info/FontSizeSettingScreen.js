// src/FontSizeSettingScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import { useFontSize } from './FontSizeContext'; 


const FontSizeSettingScreen = () => {
  const { fontSize, setFontSize } = useFontSize();
  
  return (
    <LinearGradient colors={['#AEEEEE', '#DDA0DD']} style={styles.container}>
      <Text style={styles.title}>글자 크기 설정</Text>
      <Text style={[styles.previewText, { fontSize }]}>
        변경하실 글자 예시입니다
      </Text>
      <Slider
        style={{ width: 250 }}
        minimumValue={12}
        maximumValue={30}
        step={1}
        value={fontSize}
        onValueChange={value => setFontSize(value)}
        minimumTrackTintColor="#8A2BE2"
        maximumTrackTintColor="#ddd"
        thumbTintColor="#FF69B4"
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  previewText: {
    marginBottom: 40,
  },
});

export default FontSizeSettingScreen;
