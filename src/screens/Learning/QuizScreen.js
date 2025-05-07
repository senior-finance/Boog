import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '../../components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getEasyQuiz } from '../../database/mongoDB'; // getEasyQuiz 임포트
import { getHardQuiz } from '../../database/mongoDB'; // getHardQuiz 임포트

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
        let quizData;
        if (level === 'easy') {
          quizData = await getEasyQuiz(); // 🔹 쉬운 퀴즈 불러오기
        } else {
          quizData = await getHardQuiz(); // 🔹 어려운 퀴즈 불러오기
        }
        const shuffled = shuffleArray(quizData);
        setShuffledQuiz(shuffled);
      } catch (err) {
        console.error('퀴즈 불러오기 실패:', err);
      }
    };
  
    fetchQuiz();
  }, [level, passedQuiz]);

  if (!shuffledQuiz.length) {
    return <CustomText>퀴즈를 불러오는 중입니다...</CustomText>;
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
    <View style={styles.container}>
      <View style={styles.questionBox}>
        <CustomText style={styles.questionText}>{`"${currentQuestion.question}"`}</CustomText>
      </View>

      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={index === 0 ? styles.optionButton1 : styles.optionButton2}
          onPress={() => handleAnswerSelection(option)}
        >
          <CustomText style={styles.optionText}>{option}</CustomText>
        </TouchableOpacity>
      ))}

      <CustomText style={styles.quitGuide}>선택을 그만두고 싶다면</CustomText>

      <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate('MainTabs')}>
        <View style={styles.quitContent}>
          <Ionicons name="exit-outline" size={26} color="#4B7BE5" style={styles.quitIcon} />
          <CustomText style={styles.buttonText}>그만둘래요</CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: 50
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: 'black',
  },
  questionBox: {
    width: '90%',
    backgroundColor: '#D5D5D5',
    padding: 50,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  questionText: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    lineHeight: 28,
  },
  optionButton1: {
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
  optionButton2: {
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
  optionText: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  quitGuide: {
    color: '#999',
    marginTop: 30,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    paddingVertical: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
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
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
  }
});

export default QuizScreen;