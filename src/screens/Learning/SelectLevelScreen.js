import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '../../components/CustomText';

const SelectLevelScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>난이도를 선택하세요</CustomText>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Quiz', { level: 'easy' })}
      >
        <CustomText style={styles.buttonText}>쉬운 문제</CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Quiz', { level: 'hard' })}
      >
        <CustomText style={styles.buttonText}>어려운 문제</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    width: '90%',
    height: 125,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 30,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default SelectLevelScreen;