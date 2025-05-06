import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../../components/CustomText';

export default function GuideDetailScreen({ route }) {
  const { title, content } = route.params;

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>{title}</CustomText>
      <CustomText style={styles.content}>{content}</CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B7BE5',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
