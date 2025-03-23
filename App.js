import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LearningScreen from './src/screens/Learning/LearningScreen';
import QuizScreen from './src/screens/Learning/QuizScreen';
import AnswerScreen from './src/screens/Learning/AnswerScreen';
import DepositStep1 from './src/screens/Learning/DepositStep1';
import DepositStep2 from './src/screens/Learning/DepositStep2';
import DepositStep3 from './src/screens/Learning/DepositStep3';
import DepositStep4 from './src/screens/Learning/DepositStep4';

import MapTestScreen from './src/screens/MapTestScreen';

import API_TEST from 'react-native-config';
// console.log(API_TEST.CLIENT_VALUE);

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Learning" component={LearningScreen} options={{ title: '학습 콘텐츠 🌱' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: '금융 용어 학습' }} />
        <Stack.Screen name="Answer" component={AnswerScreen} options={{ title: '정답 확인' }} />
        <Stack.Screen name="DepositStep1" component={DepositStep1} options={{ title: '연습 - 계좌 번호 입력' }} />
        <Stack.Screen name="DepositStep2" component={DepositStep2} options={{ title: '연습 - 은행 선택' }} />
        <Stack.Screen name="DepositStep3" component={DepositStep3} options={{ title: '연습 - 금액 입력' }} />
        <Stack.Screen name="DepositStep4" component={DepositStep4} options={{ title: '연습 - 모의 송금' }} />

        <Stack.Screen name="MapTest" component={MapTestScreen} options={{ title: '네이버 지도 확인' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}