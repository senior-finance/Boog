import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MainScreen from '../screens/Main/MainScreen';
import FunctionScreen from '../screens/Info/FunctionScreen';
import GuideScreen from '../screens/InfoSupport/GuideScreen';
import MyInfoScreen from '../screens/Info/MyInfoScreen';
import MyInfoStack from './MyInfoStack';
import VoiceInputScreen from '../screens/VoiceAssistant/VoiceInputScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarHideOnKeyboard: true, // ✅ 키보드가 올라올 때 하단 탭 숨기기
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Function') iconName = 'apps';
        else if (route.name === 'VoiceInput') iconName = 'mic';
        else if (route.name === 'MyInfo') iconName = 'person';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen
  name="Home"
  component={MainScreen}
  options={{ tabBarLabel: '홈' }}
/>
<Tab.Screen
  name="Function"
  component={FunctionScreen}
  options={{ tabBarLabel: '기능' }}
/>
<Tab.Screen
  name="VoiceInput"
  component={VoiceInputScreen}
  options={{ tabBarLabel: 'AI 대화', title: 'AI 대화하기' }}
/>

<Tab.Screen
  name="MyInfo"
  component={MyInfoStack}
  options={{ tabBarLabel: '내 정보' }}
/>
  </Tab.Navigator>
);

export default TabNavigator;
