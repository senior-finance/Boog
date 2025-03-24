// VoicePhishingDetailScreen.js
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const VoicePhishingDetailScreen = ({ route }) => {
  const { title, fullContent, images } = route.params;

  return (
    <LinearGradient colors={['#AEEEEE', '#DDA0DD']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{title}</Text>
        {images.map((img, idx) => (
          <Image key={idx} source={img} style={styles.image} />
        ))}
        <Text style={styles.content}>{fullContent}</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  image: { width: '100%', height: 220, borderRadius: 10, marginBottom: 15 },
  content: { fontSize: 16, lineHeight: 24, color: '#333' },
});

export default VoicePhishingDetailScreen;
