import React, { useLayoutEffect } from 'react';
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

  const screenProps = {
    route: { params: { answer, explanation, currentQuestionIndex } },
    navigation,
  };

  return isCorrect ? (
    <CorrectAnswerScreen {...screenProps} />
  ) : (
    <WrongAnswerScreen {...screenProps} />
  );
};

export default AnswerScreen;
