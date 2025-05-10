import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '../../components/CustomText';
import HelpTooltipButton from '../../components/HelpTooltipButton';

const LearningScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>학습 콘텐츠</CustomText>

      {/* 카드형 버튼들 */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('QuizLevel')}>
        <Icon name="school-outline" size={36} color="#4B7BE5" />
        <CustomText style={styles.cardText}>금융 용어 학습하기</CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DepositStep1')}>
        <Icon name="bank-transfer" size={36} color="#4B7BE5" />
        <CustomText style={styles.cardText}>입금 연습하기</CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('VoicePhishingScreen')}>
        <Icon name="alert-circle-outline" size={36} color="#4B7BE5" />
        <CustomText style={styles.cardText}>보이스피싱 사례{'\n'}</CustomText>
      </TouchableOpacity>

      <HelpTooltipButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'black',
  },
  card: {
    width: '90%',
    height: 135,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 40,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  floatingWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    alignItems: 'center',
  },
  tooltip: {
    backgroundColor: '#D9E7F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tooltipText: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4B7BE5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default LearningScreen;