import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  return (
    <LinearGradient colors={['#D8ECFF', '#E9F4FF']} style={styles.gradient}>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 30,
    alignItems: 'center',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#4B7BE5',
    fontSize: 18,
  },
  message: {
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  statsBox: {
    backgroundColor: '#F0F6FF',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(75, 123, 229, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
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
    color: '#333',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#4B7BE5',
  },
});

export default QuizResult;