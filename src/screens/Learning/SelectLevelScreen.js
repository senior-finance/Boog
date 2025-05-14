import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';

const SelectLevelScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#D8ECFF', '#E9F4FF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <CustomText style={styles.title}>
          문제의 난이도를 선택해주세요
        </CustomText>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Quiz', { level: 'easy' })}
          activeOpacity={0.9}
        >
          <CustomText style={styles.buttonText}>쉬운 문제</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Quiz', { level: 'hard' })}
          activeOpacity={0.9}
        >
          <CustomText style={styles.buttonText}>어려운 문제</CustomText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    backgroundColor: 'rgba(75, 123, 229, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 50,
    textAlign: 'center',
  },
  button: {
    width: '90%',
    height: 130,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    marginBottom: 35,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.3)',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#4B7BE5',
  },
});

export default SelectLevelScreen;