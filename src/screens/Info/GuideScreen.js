// src/screens/Info/GuideScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomText from '../../components/CustomText';

const GuideScreen = () => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>앱 사용법</CustomText>
      <CustomText>앱 사용법에 대한 내용을 여기에 넣습니다.</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
  
    fontWeight: 'bold',
  },
});

export default GuideScreen;
