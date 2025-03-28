import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyInfoScreen from '../screens/Info/MyInfoScreen';
import ProfileIconSelect from '../screens/Info/ProfileIconSelect';

const Stack = createStackNavigator();

const MyInfoStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyInfoScreen" component={MyInfoScreen} />
      <Stack.Screen name="ProfileIconSelect" component={ProfileIconSelect} />
    </Stack.Navigator>
  );
};

export default MyInfoStack;
