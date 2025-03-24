// src/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyInfoScreen from './MyInfoScreen';
import FontSizeSettingScreen from './FontSizeSettingScreen';
import SoundVolumeScreen from './SoundVolumeScreen'; // ✅ 새로 추가한 화면 import
import VoicePhishingScreen from './VoicePhishingScreen';
import VoicePhishingDetailScreen from './VoicePhishingDetailScreen';
import CallTextAnalysisScreen from './CallTextAnalysisScreen';



const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MyInfo">
        <Stack.Screen name="MyInfo" component={MyInfoScreen} options={{ title: '내 정보' }} />
        <Stack.Screen name="FontSize" component={FontSizeSettingScreen} options={{ title: '글자 크기 설정' }} />
        <Stack.Screen name="SoundVolume" component={SoundVolumeScreen} options={{ title: '음향 크기 설정' }} /> {/* ✅ 추가 */}
        <Stack.Screen name="VoicePhishing" component={VoicePhishingScreen} options={{ title: '보이스 피싱 사례' }} />
        <Stack.Screen name="VoicePhishingDetail" component={VoicePhishingDetailScreen} options={{ title: '사례 상세 보기' }} />
        <Stack.Screen name="CallTextAnalysis" component={CallTextAnalysisScreen} options={{ title: '통화 및 문자 분석' }} />    
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
