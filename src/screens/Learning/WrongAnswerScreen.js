import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing
} from 'react-native';
import wrongImage from '../../assets/wrong.png';
import CustomText from '../../components/CustomText';

const WrongAnswerScreen = ({ route, navigation }) => {
  const { answer, explanation, currentQuestionIndex } = route.params;
  const [showContent, setShowContent] = useState(false);

  const scaleAnim = useRef(new Animated.Value(4)).current;
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
    navigation.navigate("Quiz", { questionIndex: currentQuestionIndex + 1 });
  };

  const goToPreviousQuestion = () => {
    navigation.navigate("Quiz", { questionIndex: currentQuestionIndex - 1 });
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

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={goToPreviousQuestion}>
              <CustomText style={styles.buttonText}>이전 문제</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={goToNextQuestion}>
              <CustomText style={styles.buttonText}>다음 문제</CustomText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate("MainTabs")}>
            <CustomText style={styles.buttonText}>그만둘래요</CustomText>
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
     //       fontWeight: 'bold',
      color: 'black',
      marginBottom: 10,
    },
    answerText: {
     //       fontWeight: 'bold',
      color: 'black',
      marginBottom: 20,
      textAlign: 'center',
    },
    imageOnly: {
      width: 120,
      height: 120,
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
     //       fontWeight: 'bold',
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
    //        fontWeight: 'bold',
      color: 'black',
    },
  });

export default WrongAnswerScreen;