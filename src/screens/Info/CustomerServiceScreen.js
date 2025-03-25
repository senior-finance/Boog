// src/screens/Info/CustomerServiceScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const CustomerServiceScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#AEEEEE', '#DDA0DD']} style={styles.container}>
      <Text style={styles.title}>고객센터</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FAQ')}>
        <Text style={styles.buttonText}>❓ 자주 묻는 질문</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InquiryForm')}>
        <Text style={styles.buttonText}>📝 1:1 문의하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InquiryList')}>
        <Text style={styles.buttonText}>📋 내 문의 내역</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ffffffaa',
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
});

export default CustomerServiceScreen;
