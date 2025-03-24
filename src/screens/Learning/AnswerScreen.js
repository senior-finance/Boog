import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import quizData from '../../assets/quizData.json'; // 📌 JSON 데이터 가져오기

const AnswerScreen = ({ route, navigation }) => {
  const { isCorrect, answer, explanation, currentQuestionIndex } = route.params;

  return isCorrect ? (
    <CorrectAnswerScreen 
      answer={answer} 
      explanation={explanation} 
      currentQuestionIndex={currentQuestionIndex} 
      navigation={navigation} 
    />
  ) : (
    <WrongAnswerScreen 
      answer={answer} 
      explanation={explanation} 
      currentQuestionIndex={currentQuestionIndex} 
      navigation={navigation} 
    />
  );
};

// ✅ 정답 화면 (CorrectAnswerScreen)
const CorrectAnswerScreen = ({ answer, explanation, currentQuestionIndex, navigation }) => {
  const totalQuestions = quizData.quiz.length;

  // 다음 문제로 이동 (마지막 문제라면 첫 번째 문제로 돌아감)
  const goToNextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % totalQuestions;
    navigation.navigate("Quiz", { questionIndex: nextIndex });
  };

  // 이전 문제로 이동 (첫 번째 문제라면 마지막 문제로 돌아감)
  const goToPreviousQuestion = () => {
    const prevIndex = (currentQuestionIndex - 1 + totalQuestions) % totalQuestions;
    navigation.navigate("Quiz", { questionIndex: prevIndex });
  };

  return (
    <View style={styles.correctContainer}>
      <Text style={styles.correctTitle}>맞았어요</Text>
      <Text style={styles.answerText}>정답은 "{answer}" 에요!</Text>
      
      <View style={styles.correctExplanationBox}>
        <Text style={styles.explanationText}>{explanation}</Text>
      </View>

      {/* 버튼 그룹 (이전 문제 & 다음 문제 한 줄 배치) */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.prevButton} onPress={goToPreviousQuestion}>
          <Text style={styles.buttonText}>이전 문제</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={goToNextQuestion}>
          <Text style={styles.buttonText}>다음 문제</Text>
        </TouchableOpacity>
      </View>

      {/* "그만둘래요" 버튼 */}
      <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate("Main")}>
        <Text style={styles.buttonText}>그만둘래요</Text>
      </TouchableOpacity>
    </View>
  );
};

// ❌ 오답 화면 (WrongAnswerScreen)
const WrongAnswerScreen = ({ answer, explanation, currentQuestionIndex, navigation }) => {
  const totalQuestions = quizData.quiz.length;

  const goToNextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % totalQuestions;
    navigation.navigate("Quiz", { questionIndex: nextIndex });
  };

  const goToPreviousQuestion = () => {
    const prevIndex = (currentQuestionIndex - 1 + totalQuestions) % totalQuestions;
    navigation.navigate("Quiz", { questionIndex: prevIndex });
  };

  return (
    <View style={styles.wrongContainer}>
      <Text style={styles.wrongTitle}>틀렸어요</Text>
      <Text style={styles.answerText}>정답은 "{answer}" 에요!</Text>

      <View style={styles.wrongExplanationBox}>
        <Text style={styles.explanationText}>{explanation}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.prevButton} onPress={goToPreviousQuestion}>
          <Text style={styles.buttonText}>이전 문제</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={goToNextQuestion}>
          <Text style={styles.buttonText}>다음 문제</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate("Main")}>
        <Text style={styles.buttonText}>그만둘래요</Text>
      </TouchableOpacity>
    </View>
  );
};

// 📌 스타일 정의
const styles = StyleSheet.create({
  correctContainer: {
    flex: 1,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    paddingTop: 50
  },
  wrongContainer: {
    flex: 1,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    paddingTop: 50
  },
  correctTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10
  },
  wrongTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10
  },
  answerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 50
  },
  correctExplanationBox: {
    width: '90%',
    backgroundColor: '#D9E7F9',
    padding: 60,
    borderRadius: 20,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'black'
  },
  wrongExplanationBox: {
    width: '90%',
    backgroundColor: '#FDD8D8',
    padding: 60,
    borderRadius: 20,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'black'
  },
  explanationText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 📌 버튼을 좌우 끝으로 배치
    width: '90%', // 📌 버튼이 더 넓게 배치되도록 설정
    paddingHorizontal: 20, // 📌 버튼이 끝쪽으로 이동하도록 추가 여백 설정
    marginBottom: 30
  },
  prevButton: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black'
  },
  nextButton: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black'
  },
  quitButton: {
    backgroundColor: '#F4B183',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
    marginTop: 10
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black'
  }
});

export default AnswerScreen;