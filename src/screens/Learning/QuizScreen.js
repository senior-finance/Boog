import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getEasyQuiz, getHardQuiz } from '../../database/mongoDB';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizScreen = ({ navigation, route }) => {
  const {
    level,
    nextQuestionIndex = 0,
    shuffledQuiz: passedQuiz,
    userAnswers: passedAnswers = []
  } = route.params;

  const [shuffledQuiz, setShuffledQuiz] = useState(passedQuiz || []);
  const [userAnswers, setUserAnswers] = useState(passedAnswers);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (passedQuiz) return;
      try {
        const quizData = level === 'easy'
          ? await getEasyQuiz()
          : await getHardQuiz();
        setShuffledQuiz(shuffleArray(quizData));
      } catch (err) {
        console.error('퀴즈 불러오기 실패:', err);
      }
    };

    fetchQuiz();
  }, [level, passedQuiz]);

  if (!shuffledQuiz.length) {
    return (
      <View style={styles.loadingContainer}>
        <CustomText>퀴즈를 불러오는 중입니다...</CustomText>
      </View>
    );
  }

  const questionIndex = nextQuestionIndex;
  const currentQuestion = shuffledQuiz[questionIndex];

  const handleAnswerSelection = (selectedAnswer) => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const nextIndex = questionIndex + 1;

    const updatedAnswers = [
      ...userAnswers,
      { index: questionIndex, isCorrect }
    ];
    setUserAnswers(updatedAnswers);

    navigation.navigate('Answer', {
      isCorrect,
      answer: currentQuestion.correctAnswer,
      explanation: isCorrect
        ? currentQuestion.feedback.correct
        : currentQuestion.feedback.incorrect,
      nextQuestionIndex: nextIndex,
      level,
      shuffledQuiz,
      userAnswers: updatedAnswers
    });
  };

  return (
    <LinearGradient colors={['#D8ECFF', '#E9F4FF']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.questionBox}>
          <CustomText style={styles.questionText}>
            "{currentQuestion.question}"
          </CustomText>
        </View>

        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswerSelection(option)}
            activeOpacity={0.9}
          >
            <CustomText style={styles.optionText}>{option}</CustomText>
          </TouchableOpacity>
        ))}

        <CustomText style={styles.quitGuide}>선택을 그만두고 싶다면</CustomText>

        <TouchableOpacity
          style={styles.quitButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <View style={styles.quitContent}>
            <Ionicons
              name="exit-outline"
              size={26}
              color="#4B7BE5"
              style={styles.quitIcon}
            />
            <CustomText style={styles.quitText}>그만둘래요</CustomText>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionBox: {
    width: '90%',
    backgroundColor: '#F0F5FF',
    padding: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    marginBottom: 50,
  },
  questionText: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
  },
  optionButton: {
    width: '90%',
    height: 120,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 25,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  optionText: {
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
  },
  quitGuide: {
    color: '#999',
    marginTop: 30,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  quitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quitIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  quitText: {
    fontWeight: 'bold',
    color: '#4B7BE5',
  },
});

export default QuizScreen;