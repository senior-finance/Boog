import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MainScreen from '../screens/Main/MainScreen';
import GuideScreen from '../screens/InfoSupport/GuideScreen';
import MyInfoStack from './MyInfoStack';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const CustomHomeButton = ({ children, onPress }) => (
  <View style={styles.centerWrapper}>
    <TouchableOpacity style={styles.homeButton} onPress={onPress}>
      {children}
    </TouchableOpacity>
  </View>
);

const TabNavigator = () => (
  <View style={{ flex: 1 }}>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === '사용법') iconName = 'book';
          else if (route.name === '내 정보') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="사용법"
        component={GuideScreen}
        options={{ tabBarLabel: '사용법' }}
      />
      <Tab.Screen
        name="Home"
        component={MainScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => (
            <CustomHomeButton {...props}>
              <Ionicons name="home-outline" size={28} color="#fff" />
            </CustomHomeButton>
          ),
        }}
      />
      <Tab.Screen
        name="내 정보"
        component={MyInfoStack}
        options={{ tabBarLabel: '내 정보' }}
      />
    </Tab.Navigator>
  </View>
);

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 70,
    borderTopWidth: 0,
    elevation: 5,
  },
centerWrapper: {
  position: 'absolute',
  top: -25,
  left: '50%',
  transform: [{ translateX: -35 }], 
  width: 70,
  height: 70,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
},

  homeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4B7BE5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
});

export default TabNavigator;
