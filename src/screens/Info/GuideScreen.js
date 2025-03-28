// src/screens/Info/GuideScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GuideScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>앱 사용법</Text>
      <Text>앱 사용법에 대한 내용을 여기에 넣습니다.</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default GuideScreen;
