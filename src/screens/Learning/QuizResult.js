import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CustomText from '../../components/CustomText';
import easyQuiz from '../../assets/easyQuiz.json';
import hardQuiz from '../../assets/hardQuiz.json';
import Icon from 'react-native-vector-icons/Ionicons';

const QuizResult = ({ route, navigation }) => {
  const params = route?.params || {};
  const userAnswers = params.userAnswers || [];
  const total = params.total || 0;
  const level = params.level || 'easy';

  const quizList = level === 'easy' ? easyQuiz : hardQuiz;
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const incorrect = userAnswers.filter(a => !a.isCorrect);
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false, // 제스처로도 뒤로 못 가게
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconTitleRow}>
        <Icon name="sparkles-outline" size={24} color="#4B7BE5" />
        <CustomText style={styles.title}>금융 용어 학습 완료!</CustomText>
      </View>
      <CustomText style={styles.message}>총 {total}문제를 풀었어요.</CustomText>

      <View style={styles.statsBox}>
        <View style={styles.row}>
          <Icon name="checkmark-circle-outline" size={20} color="#4B7BE5" style={styles.icon} />
          <CustomText style={styles.stats}>맞은 문제: {correctCount}개</CustomText>
        </View>
        <View style={styles.row}>
          <Icon name="close-circle-outline" size={20} color="#4B7BE5" style={styles.icon} />
          <CustomText style={styles.stats}>틀린 문제: {total - correctCount}개</CustomText>
        </View>
        <View style={styles.row}>
          <Icon name="bar-chart-outline" size={20} color="#4B7BE5" style={styles.icon} />
          <CustomText style={styles.stats}>정답률: {percentage}%</CustomText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainTabs')}
      >
        <CustomText style={styles.buttonText}>홈으로 돌아가기</CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: 'black',
  },
  message: {
    marginBottom: 30,
    color: 'black',
    textAlign: 'center',
  },
  statsBox: {
    backgroundColor: '#D9E7F9',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  stats: {
    fontWeight: 'bold',
    color: 'black',
  },
  subTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#D9534F',
    textAlign: 'center',
  },
  explanationBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    elevation: 3,
  },
  qText: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  aText: {
    marginBottom: 5,
    color: '#555',
  },
  eText: {
    color: '#333',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginTop: 30,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default QuizResult;