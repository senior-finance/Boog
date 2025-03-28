import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 알림</Text>
      <Text style={styles.content}>알림이 아직 없습니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B7BE5',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#666',
  },
});

export default NotificationScreen;
