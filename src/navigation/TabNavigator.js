import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MainScreen from '../screens/Main/MainScreen';
import FunctionScreen from '../screens/Info/FunctionScreen';
import GuideScreen from '../screens/Info/GuideScreen';
import MyInfoScreen from '../screens/Info/MyInfoScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Function') iconName = 'apps';
        else if (route.name === 'Guide') iconName = 'book';
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
  name="Guide"
  component={GuideScreen}
  options={{ tabBarLabel: '사용법' }}
/>
<Tab.Screen
  name="MyInfo"
  component={MyInfoScreen}
  options={{ tabBarLabel: '내 정보' }}
/>

  </Tab.Navigator>
);

export default TabNavigator;
