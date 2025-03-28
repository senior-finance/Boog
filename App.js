import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument',
]);

import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { FontSizeProvider } from './src/screens/Info/FontSizeContext';
import TabNavigator from './src/navigation/TabNavigator';

// 학습
import QuizScreen from './src/screens/Learning/QuizScreen';
import AnswerScreen from './src/screens/Learning/AnswerScreen';
import DepositStep1 from './src/screens/Learning/DepositStep1';
import DepositStep2 from './src/screens/Learning/DepositStep2';
import DepositStep3 from './src/screens/Learning/DepositStep3';
import DepositStep4 from './src/screens/Learning/DepositStep4';
import LearningScreen from './src/screens/Learning/LearningScreen';

// 지도
import MapViewScreen from './src/screens/Map/MapViewScreen';
import MapSearchScreen from './src/screens/Map/MapSearchScreen';

// 계정
import LoginScreen from './src/screens/Account/LoginScreen';
import WebViewScreen from './src/screens/Account/WebViewScreen';

// 내 정보
import FontSizeSettingScreen from './src/screens/Info/FontSizeSettingScreen';
import SoundVolumeScreen from './src/screens/Info/SoundVolumeScreen';
import VoicePhishingScreen from './src/screens/Info/VoicePhishingScreen';
import VoicePhishingDetailScreen from './src/screens/Info/VoicePhishingDetailScreen';
import CallTextAnalysisScreen from './src/screens/Info/CallTextAnalysisScreen';
import CustomerServiceScreen from './src/screens/Info/CustomerServiceScreen';
import FAQScreen from './src/screens/Info/FAQScreen';
import InquiryFormScreen from './src/screens/Info/InquiryFormScreen';
import InquiryListScreen from './src/screens/Info/InquiryListScreen';
import NotificationScreen from './src/screens/Info/NotificationScreen';
import ProfileIconSelect from './src/screens/Info/ProfileIconSelect';
import { ProfileProvider } from './src/screens/ProfileContext';

// 기타
import BiometricScreen from './src/screens/Biometric/BiometricScreen';
import VoiceInputScreen from './src/screens/VoiceAssistant/VoiceInputScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <FontSizeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainTabs">
          {/* 탭 내비게이션이 포함된 메인 */}
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />

          {/* 탭 외부로 이동할 화면들 */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="WebView" component={WebViewScreen} />

          <Stack.Screen name="Learning" component={LearningScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Answer" component={AnswerScreen} />
          <Stack.Screen name="DepositStep1" component={DepositStep1} />
          <Stack.Screen name="DepositStep2" component={DepositStep2} />
          <Stack.Screen name="DepositStep3" component={DepositStep3} />
          <Stack.Screen name="DepositStep4" component={DepositStep4} />

          <Stack.Screen name="MapView" component={MapViewScreen} />
          <Stack.Screen name="MapSearch" component={MapSearchScreen} />

          <Stack.Screen name="FontSize" component={FontSizeSettingScreen} />
          <Stack.Screen name="SoundVolume" component={SoundVolumeScreen} />
          <Stack.Screen name="VoicePhishing" component={VoicePhishingScreen} />
          <Stack.Screen name="VoicePhishingDetail" component={VoicePhishingDetailScreen} />
          <Stack.Screen name="CallTextAnalysis" component={CallTextAnalysisScreen} />

          <Stack.Screen name="CustomerService" component={CustomerServiceScreen} />
          <Stack.Screen name="FAQ" component={FAQScreen} />
          <Stack.Screen name="ProfileIconSelect" component={ProfileIconSelect} />

          <Stack.Screen name="InquiryForm" component={InquiryFormScreen} />
          <Stack.Screen name="InquiryList" component={InquiryListScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />   
          <Stack.Screen name="Biometric" component={BiometricScreen} />
          <Stack.Screen name="VoiceInput" component={VoiceInputScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FontSizeProvider>
  );
}
