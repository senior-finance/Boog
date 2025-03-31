import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import quizData from '../../assets/quizData.json';
import wrongImage from '../../assets/wrong.png';

const WrongAnswerScreen = ({ answer, explanation, currentQuestionIndex, navigation }) => {
  const totalQuestions = quizData.quiz.length;
  const [showContent, setShowContent] = useState(false);

  const scaleAnim = useRef(new Animated.Value(4)).current; // 크게 시작
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowContent(true);
    });
  }, []);

  const goToNextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % totalQuestions;
    navigation.navigate("Quiz", { questionIndex: nextIndex });
  };

  const goToPreviousQuestion = () => {
    const prevIndex = (currentQuestionIndex - 1 + totalQuestions) % totalQuestions;
    navigation.navigate("Quiz", { questionIndex: prevIndex });
  };

  return (
    <View style={styles.container}>
      {/* 상단 텍스트 */}
      <Text style={styles.title}>틀렸어요</Text>
      <Text style={styles.answerText}>정답은 "{answer}" 에요!</Text>

      {/* 애니메이션 이미지 */}
      <Animated.Image
        source={wrongImage}
        style={[
          styles.imageOnly,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
          },
        ]}
      />

      {/* 설명 + 버튼 */}
      {showContent && (
        <>
          <View style={styles.explanationBox}>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={goToPreviousQuestion}>
              <Text style={styles.buttonText}>이전 문제</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={goToNextQuestion}>
              <Text style={styles.buttonText}>다음 문제</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate("MainTabs")}>
            <Text style={styles.buttonText}>그만둘래요</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
    },
    title: {
      fontSize: 27,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 10,
    },
    answerText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 20,
      textAlign: 'center',
    },
    imageOnly: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    explanationBox: {
      width: '100%',
      backgroundColor: '#FDD8D8',
      padding: 40,
      borderRadius: 20,
      marginBottom: 30,
    },
    explanationText: {
      fontSize: 23,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 30,
    },
    button: {
      backgroundColor: '#FFFFFF',
      width: '46%',
      paddingVertical: 25,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
    },
    quitButton: {
      backgroundColor: '#FFFFFF',
      width: '100%',
      paddingVertical: 25,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
    },
    buttonText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'black',
    },
  });

export default WrongAnswerScreen;