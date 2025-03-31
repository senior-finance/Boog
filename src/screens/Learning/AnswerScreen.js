import React from 'react';
import { useLayoutEffect } from 'react';
import CorrectAnswerScreen from './CorrectAnswerScreen';
import WrongAnswerScreen from './WrongAnswerScreen';

const AnswerScreen = ({ route, navigation }) => {
  const { isCorrect, answer, explanation, currentQuestionIndex } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

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

export default AnswerScreen;