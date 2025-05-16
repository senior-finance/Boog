import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WithdrawAccountScreen from './WithdrawAccountScreen';
import WithdrawBankScreen    from './WithdrawBankScreen';
import WithdrawAmountScreen  from './WithdrawAmountScreen';
import WithdrawAuthScreen    from './WithdrawAuthScreen';

const Stack = createStackNavigator();

export default function WithdrawStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WithdrawAccount" component={WithdrawAccountScreen}/>
      <Stack.Screen name="WithdrawBank"    component={WithdrawBankScreen}   />
      <Stack.Screen name="WithdrawAmount"  component={WithdrawAmountScreen} />
      <Stack.Screen name="WithdrawAuth"    component={WithdrawAuthScreen}   />
    </Stack.Navigator>
  );
}