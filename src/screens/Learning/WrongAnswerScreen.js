import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing
} from 'react-native';
import Sound from 'react-native-sound';
import Ionicons from 'react-native-vector-icons/Ionicons';
import wrongImage from '../../assets/wrong_rabbit.png';
import CustomText from '../../components/CustomText';

const WrongAnswerScreen = ({ route, navigation }) => {
  const {
    answer,
    explanation,
    nextQuestionIndex,
    level,
    shuffledQuiz,
    userAnswers
  } = route.params;

  const [showContent, setShowContent] = useState(false);
  const scaleAnim = useRef(new Animated.Value(4)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const wrongSound = new Sound(
      require('../../assets/sounds/wrong.mp3'),
      (error) => {
        if (!error) {
          wrongSound.play();
        }
      }
    );

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
      wrongSound.release();
    });

    return () => {
      wrongSound.stop(() => wrongSound.release());
    };
  }, []);

  const goToNextQuestion = () => {
    if (nextQuestionIndex >= shuffledQuiz.length) {
      navigation.navigate("QuizResult", {
        level,
        total: shuffledQuiz.length,
        userAnswers
      });
    } else {
      navigation.navigate("Quiz", {
        level,
        nextQuestionIndex,
        shuffledQuiz,
        userAnswers
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>틀렸어요</CustomText>
      <CustomText style={styles.answerText}>정답은 "{answer}" 에요!</CustomText>

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

      {showContent && (
        <>
          <View style={styles.explanationBox}>
            <CustomText style={styles.explanationText}>{explanation}</CustomText>
          </View>

          <TouchableOpacity style={styles.button} onPress={goToNextQuestion}>
            <CustomText style={styles.buttonText}>다음 문제</CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate('MainTabs')}>
            <View style={styles.quitContent}>
              <Ionicons name="exit-outline" size={26} color="#4B7BE5" style={styles.quitIcon} />
              <CustomText style={styles.buttonText}>그만둘래요</CustomText>
            </View>
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
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  answerText: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageOnly: {
  width: 300,
  height: 300,
  alignSelf: 'center',
  marginVertical: 16,
  resizeMode: 'contain', // 추가
},
  explanationBox: {
    width: '100%',
    backgroundColor: '#FDD8D8',
    padding: 40,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  explanationText: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 30,
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
  },
});

export default WrongAnswerScreen;