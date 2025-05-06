import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument',
  'ReactImageView: Image source "null" doesn\'t exist'
]);

import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { FontSizeProvider } from './src/screens/Info/FontSizeContext';
import TabNavigator from './src/navigation/TabNavigator';

// 학습
import SelectLevelScreen from './src/screens/Learning/SelectLevelScreen';
import QuizScreen from './src/screens/Learning/QuizScreen';
import AnswerScreen from './src/screens/Learning/AnswerScreen';
import DepositStep1 from './src/screens/Learning/DepositStep1';
import DepositStep2 from './src/screens/Learning/DepositStep2';
import DepositStep3 from './src/screens/Learning/DepositStep3';
import DepositStep4 from './src/screens/Learning/DepositStep4';
import LearningScreen from './src/screens/Learning/LearningScreen';

// 지도
import MapViewScreen from './src/screens/Map/MapViewScreen';

// 계좌
import AccountScreen from './src/screens/Account/AccountScreen'; // 변경된 로그인 to 계좌목록 파일

// 내 정보
import FontSizeSettingScreen from './src/screens/Info/FontSizeSettingScreen';
import SoundVolumeScreen from './src/screens/Info/SoundVolumeScreen';
import SoundVolumeSettingScreen from './src/screens/Info/SoundVolumeSettingScreen';
import VoicePhishingScreen from './src/screens/Info/VoicePhishingScreen';
import VoicePhishingDetailScreen from './src/screens/Info/VoicePhishingDetailScreen';
import FAQScreen from './src/screens/Info/FAQScreen';
import InquiryFormScreen from './src/screens/Info/InquiryFormScreen';
import InquiryListScreen from './src/screens/Info/InquiryListScreen';
import NotificationScreen from './src/screens/Info/NotificationScreen';
import ProfileIconSelect from './src/screens/Info/ProfileIconSelect';
import { ProfileProvider } from './src/screens/ProfileContext';
import WelfareScreen from './src/screens/Info/WelfareScreen'; 
import WebScreen from './src/screens/Info/WebScreen';
import AutoPhoneAnalysisScreen from './src/screens/Info/AutoPhoneAnalysisScreen'; 
import GuideScreen from './src/screens/Info/GuideScreen';
// 기타
import BiometricScreen from './src/screens/Biometric/BiometricScreen';
import VoiceInputScreen from './src/screens/VoiceAssistant/VoiceInputScreen';
import TTSSettingScreen from './src/screens/VoiceAssistant/TTSSettingScreen';

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
          <Stack.Screen name="Account" component={AccountScreen} />
          {/* <Stack.Screen name="Account2" component={Account2} /> */}
          {/* <Stack.Screen name="WebView" component={WebViewScreen} /> */}

          <Stack.Screen name="Learning" component={LearningScreen} options={{ title: '학습 콘텐츠' }} />
          <Stack.Screen name="QuizLevel" component={SelectLevelScreen} options={{ title: '금융 용어 학습 난이도 선택'}} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: '금융 용어 학습하기' }} />
          <Stack.Screen name="Answer" component={AnswerScreen} options={{ title: ' 정답 확인' }} />
          <Stack.Screen name="DepositStep1" component={DepositStep1} options={{ title: '입금 연습 - 계좌 번호 입력' }} />
          <Stack.Screen name="DepositStep2" component={DepositStep2} options={{ title: '입금 연습 - 은행 선택' }} />
          <Stack.Screen name="DepositStep3" component={DepositStep3} options={{ title: '입금 연습 - 금액 입력' }} />
          <Stack.Screen name="DepositStep4" component={DepositStep4} options={{ title: '입금 연습 - 확인하기' }}/>

          <Stack.Screen name="MapView" component={MapViewScreen} />

          <Stack.Screen name="FontSize" component={FontSizeSettingScreen} />
          <Stack.Screen name="SoundVolume" component={SoundVolumeScreen} />
          <Stack.Screen name="SoundVolumeSetting" component={SoundVolumeSettingScreen} options={{ title: '음성 및 효과음 설정' }} />
          <Stack.Screen name="VoicePhishingScreen" component={VoicePhishingScreen} options={{ presentation: 'modal' }} />

          <Stack.Screen name="VoicePhishingDetail" component={VoicePhishingDetailScreen} />

          <Stack.Screen name="Guide" component={GuideScreen} options={{ title: '앱 사용법' }} />
          <Stack.Screen name="FAQ" component={FAQScreen} />
          <Stack.Screen name="ProfileIconSelect" component={ProfileIconSelect} />
          <Stack.Screen name="Welfare" component={WelfareScreen} />
          <Stack.Screen name="Web" component={WebScreen} />

          <Stack.Screen name="InquiryForm" component={InquiryFormScreen} />
          <Stack.Screen name="InquiryList" component={InquiryListScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />   
          <Stack.Screen name="Biometric" component={BiometricScreen} />
          <Stack.Screen name="VoiceInput" component={VoiceInputScreen} options={{title: 'AI 대화하기'}}/>
          <Stack.Screen name="TTSSetting" component={TTSSettingScreen} options={{title: '음성 설정'}}/>
          <Stack.Screen name="AutoPhoneAnalysis" component={AutoPhoneAnalysisScreen} options={{ title: '자동 통화/문자 분석' }}/>

        </Stack.Navigator>
      </NavigationContainer>
    </FontSizeProvider>
  );
}
