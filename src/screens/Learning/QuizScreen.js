import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import easyQuiz from '../../assets/easyQuiz.json';
import hardQuiz from '../../assets//hardQuiz.json';
import CustomText from '../../components/CustomText';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizScreen = ({ navigation, route }) => {
  const { level } = route.params;
  const allQuiz = level === 'easy' ? easyQuiz : hardQuiz;

  // ✅ 퀴즈 데이터 한 번 섞기
  const [shuffledQuiz, setShuffledQuiz] = useState(() => shuffleArray(allQuiz));
  const [questionIndex, setQuestionIndex] = useState(0);

  const currentQuestion = shuffledQuiz[questionIndex];

  const handleAnswerSelection = (selectedAnswer) => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    navigation.navigate("Answer", {
      isCorrect,
      answer: currentQuestion.correctAnswer,
      explanation: isCorrect
        ? currentQuestion.feedback.correct
        : currentQuestion.feedback.incorrect,
      currentQuestionIndex: questionIndex
    });
  };


  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>금융 용어를 배워볼게요</CustomText>

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
    </View>
  );
};

// 📌 스타일 정의 (각 버튼에 다른 색상 적용)
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
    backgroundColor: '#D9D9D9',
    padding: 50,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 50
  },
  questionText: {
   
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
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
  }
});

export default QuizScreen;