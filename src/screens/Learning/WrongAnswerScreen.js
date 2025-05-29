import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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

  useEffect(() => {
    // 뒤로가기 버튼 무시
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );

    return () => backHandler.remove();
  }, []);

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
    <LinearGradient colors={['#FEEEEE', '#FFF6F6']} style={styles.container}>
      <CustomText style={styles.resultTitle}>틀렸어요!</CustomText>
      <CustomText style={styles.resultAnswer}>정답은 "{answer}" 에요!</CustomText>

      <Animated.Image
        source={wrongImage}
        style={[
          styles.rabbitImage,
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
              <CustomText style={styles.quitText}>그만둘래요</CustomText>
            </View>
          </TouchableOpacity>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  resultTitle: {
    fontWeight: 'bold',
    color: '#E55353',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  resultAnswer: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  rabbitImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 5,
  },
  explanationBox: {
    width: '100%',
    backgroundColor: '#FDD8D8',
    padding: 40,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(229, 83, 83, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  explanationText: {
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#4B7BE5',
  },
  quitButton: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.2)',
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

export default WrongAnswerScreen;