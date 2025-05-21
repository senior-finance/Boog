import React from 'react';
import { LogBox, View, Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { FontSizeProvider } from './src/screens/Info/FontSizeContext';
import TabNavigator from './src/navigation/TabNavigator';

// 학습
import SelectLevelScreen from './src/screens/Learning/SelectLevelScreen';
import QuizScreen from './src/screens/Learning/QuizScreen';
import AnswerScreen from './src/screens/Learning/AnswerScreen';
import QuizResultScreen from './src/screens/Learning/QuizResult';
import DepositStep1 from './src/screens/Learning/DepositStep1';
import DepositStep2 from './src/screens/Learning/DepositStep2';
import DepositStep3 from './src/screens/Learning/DepositStep3';
import DepositStep4 from './src/screens/Learning/DepositStep4';
import LearningScreen from './src/screens/Learning/LearningScreen';

// 지도
import MapViewScreen from './src/screens/Map/MapViewScreen';

// 로그인
import LoginScreen from './src/screens/Login/LoginScreen';
import { UserProvider } from './src/screens/Login/UserContext';
import SetUserNameScreen from './src/screens/Login/SetUserNameScreen';
import TokenScreen from './src/screens/Login/TokenScreen';

// 계좌
import AccountScreen from './src/screens/Account/AccountScreen'; // 금결원 사용자 PASS 인증 ~ 계좌 생성하는 함수들
import AccountDetailScreen from './src/screens/Account/AccountDetailScreen'; // 
import WithdrawAccountScreen from './src/screens/Account/WithdrawAccountScreen';
import WithdrawBankScreen from './src/screens/Account/WithdrawBankScreen';
import WithdrawAmountScreen from './src/screens/Account/WithdrawAmountScreen';
import WithdrawAuthScreen from './src/screens/Account/WithdrawAuthScreen';

// 내 정보
import MyInfoScreen from './src/screens/Info/MyInfoScreen';
import FontSizeSettingScreen from './src/screens/Info/FontSizeSettingScreen';
import SoundVolumeScreen from './src/screens/Info/SoundVolumeScreen';
import SoundVolumeSettingScreen from './src/screens/Info/SoundVolumeSettingScreen';
import NotificationScreen from './src/screens/Info/NotificationScreen';
import { ProfileProvider } from './src/screens/Info/ProfileContext';
import WebScreen from './src/screens/Info/WebScreen';

// 내 정보 관련된 서포트 (사용법 가이드, 문의 및 질문답변, 보이스피싱, 전화문자 분석, 복지)
import VoicePhishingScreen from './src/screens/InfoSupport/VoicePhishingScreen';
import VoicePhishingDetailScreen from './src/screens/InfoSupport/VoicePhishingDetailScreen';
import GuideScreen from './src/screens/InfoSupport/GuideScreen';
import FAQScreen from './src/screens/InfoSupport/FAQScreen';
import InquiryFormScreen from './src/screens/InfoSupport/InquiryFormScreen';
import InquiryListScreen from './src/screens/InfoSupport/InquiryListScreen';
import ProfileIconSelect from './src/screens/Info/ProfileIconSelect';
import WelfareScreen from './src/screens/InfoSupport/WelfareScreen';
import AutoPhoneAnalysisScreen from './src/screens/InfoSupport/AutoPhoneAnalysisScreen';
import GuideDetailScreen from './src/screens/InfoSupport/GuideDetailScreen';

// 기타
import BiometricScreen from './src/screens/Biometric/BiometricScreen';
import VoiceInputScreen from './src/screens/VoiceAssistant/VoiceInputScreen';
import TTSSettingScreen from './src/screens/VoiceAssistant/TTSSettingScreen';
import QuizResult from './src/screens/Learning/QuizResult';
import FunctionScreen from './src/screens/Info/FunctionScreen';

import HelpTooltipButton from './src/components/HelpTooltipButton';

import { SeniorModeProvider } from './src/components/SeniorModeContext';
import { VolumeProvider } from './src/contexts/VolumeContext';

// 가로모드
import PortraitWrapper from './src/utils/portraitWrapper';  // 파일 경로에 맞춰 수정

const Stack = createStackNavigator();

export default function App() {
  return (
    // <PortraitWrapper>
    <FontSizeProvider>
      <UserProvider>
        <SeniorModeProvider>
          <VolumeProvider>
            <NavigationContainer>
              <>
                <Stack.Navigator initialRouteName="Token">
                  {/* 탭 내비게이션이 포함된 메인 */}
                  <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                  />

                  {/* 탭 외부로 이동할 화면들 */}
                  <Stack.Screen name="Token" component={TokenScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Login" component={LoginScreen} options={{ title: '환영합니다 로그인' }} />
                  <Stack.Screen name="SetUserNameScreen" component={SetUserNameScreen} options={{ title: '환영합니다 로그인' }} />

                  <Stack.Screen name="Account" component={AccountScreen} options={{ title: '내 계좌 정보' }} />
                  <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={{ title: '상세 계좌 정보' }} />
                  <Stack.Screen name="WithdrawAccount" component={WithdrawAccountScreen} />
                  <Stack.Screen name="WithdrawBank" component={WithdrawBankScreen} />
                  <Stack.Screen name="WithdrawAmount" component={WithdrawAmountScreen} />
                  <Stack.Screen name="WithdrawAuth" component={WithdrawAuthScreen} />

                  <Stack.Screen name="Learning" component={LearningScreen} options={{ title: '학습 콘텐츠' }} />
                  <Stack.Screen name="QuizLevel" component={SelectLevelScreen} options={{ title: '금융 용어 학습 난이도 선택' }} />
                  <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: '금융 용어 학습' }} />
                  <Stack.Screen name="Answer" component={AnswerScreen} options={{ title: '정답 확인' }} />
                  <Stack.Screen name="QuizResult" component={QuizResult} options={{ title: ' 금융 용어 학습 결과' }} />
                  <Stack.Screen name="DepositStep1" component={DepositStep1} options={{ title: '입금 연습 - 계좌 번호 입력' }} />
                  <Stack.Screen name="DepositStep2" component={DepositStep2} options={{ title: '입금 연습 - 은행 선택' }} />
                  <Stack.Screen name="DepositStep3" component={DepositStep3} options={{ title: '입금 연습 - 금액 입력' }} />
                  <Stack.Screen name="DepositStep4" component={DepositStep4} options={{ title: '입금 연습 - 확인하기' }} />

                  <Stack.Screen name="MapView" component={MapViewScreen} options={{ title: '지도 화면' }} />
                  <Stack.Screen name="FunctionScreen" component={FunctionScreen} />

                  <Stack.Screen name="FontSize" component={FontSizeSettingScreen} />
                  <Stack.Screen name="SoundVolume" component={SoundVolumeScreen} />
                  <Stack.Screen name="SoundVolumeSetting" component={SoundVolumeSettingScreen} options={{ title: '음성 및 효과음 설정' }} />
                  <Stack.Screen name="VoicePhishingScreen" component={VoicePhishingScreen} options={{ title: '보이스피싱 사례 안내', presentation: 'modal' }} />

                  <Stack.Screen name="VoicePhishingDetail" component={VoicePhishingDetailScreen} />

                  <Stack.Screen name="Guide" component={GuideScreen} options={{ title: '앱 사용법' }} />
                  <Stack.Screen name="GuideDetail" component={GuideDetailScreen} options={{ title: '상세 설명' }} />

                  <Stack.Screen name="FAQ" component={FAQScreen} />
                  <Stack.Screen name="ProfileIconSelect" component={ProfileIconSelect} />
                  <Stack.Screen name="Welfare" component={WelfareScreen} />
                  <Stack.Screen name="Web" component={WebScreen} />

                  <Stack.Screen name="InquiryForm" component={InquiryFormScreen} />
                  <Stack.Screen name="InquiryList" component={InquiryListScreen} />
                  <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
                  <Stack.Screen name="Biometric" component={BiometricScreen} />
                  <Stack.Screen name="VoiceInput" component={VoiceInputScreen} options={{ title: 'AI 챗봇' }} />
                  <Stack.Screen name="TTSSetting" component={TTSSettingScreen} options={{ title: '음성 설정' }} />
                  <Stack.Screen name="AutoPhoneAnalysis" component={AutoPhoneAnalysisScreen} options={{ title: '자동 통화/문자 분석' }} />

                  <Stack.Screen name="MyInfo" component={MyInfoScreen} options={{ title: '내 정보 테스트' }} />

                </Stack.Navigator>
                <HelpTooltipButton />
              </>
            </NavigationContainer>
          </VolumeProvider>
        </SeniorModeProvider>
      </UserProvider>
    </FontSizeProvider>
    // </PortraitWrapper>
  );
}
