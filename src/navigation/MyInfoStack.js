import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyInfoScreen from '../screens/Info/MyInfoScreen';
import ProfileIconSelect from '../screens/Info/ProfileIconSelect';
import { ProfileProvider } from '../screens/Info/ProfileContext';

const Stack = createStackNavigator();

const MyInfoStack = () => {
  return (
    <ProfileProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyInfoScreen" component={MyInfoScreen} />
        <Stack.Screen name="ProfileIconSelect" component={ProfileIconSelect} />
      </Stack.Navigator>
    </ProfileProvider>
  );
};

export default MyInfoStack;