import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import quizData from '../../assets/quizData.json'; // 📌 JSON 데이터 가져오기

const QuizScreen = ({ navigation }) => {
  const route = useRoute();
  // 현재 문제 인덱스를 route.params로 받되, 기본값을 0으로 설정
  const currentQuestionIndex = route.params?.questionIndex ?? 0;
  const currentQuestion = quizData.quiz[currentQuestionIndex];

  const handleAnswerSelection = (selectedAnswer) => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    navigation.navigate("Answer", { 
      isCorrect, 
      answer: currentQuestion.correctAnswer, 
      explanation: isCorrect 
        ? currentQuestion.feedback.correct 
        : currentQuestion.feedback.incorrect,
      currentQuestionIndex 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>금융 용어를 배워볼게요</Text>

      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{`"${currentQuestion.question}"`}</Text>
      </View>

      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity 
          key={index} 
          style={index === 0 ? styles.optionButton1 : styles.optionButton2} 
          onPress={() => handleAnswerSelection(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
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
    fontSize: 30,
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
    marginBottom: 50,
    borderWidth: 2,
    borderColor: 'black'
  },
  questionText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  optionButton1: {
    backgroundColor: '#F9EA97',
    paddingVertical: 30,
    width: '80%',
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'black'
  },
  optionButton2: {
    backgroundColor: '#C8EAAE',
    paddingVertical: 30,
    width: '80%',
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'black'
  },
  optionText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

export default QuizScreen;