import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '../../components/CustomText';
import HelpTooltipButton from '../../components/HelpTooltipButton';

const SelectLevelScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>문제의 난이도를 선택해주세요</CustomText>

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

      <HelpTooltipButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 200,
    marginBottom: 35,
  },
  button: {
    width: '90%',
    height: 130,
    borderRadius: 25,
    backgroundColor: 'white',
    marginBottom: 35,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.5)'
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
  }
});

export default SelectLevelScreen;