// screens/WithdrawAuthScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
// 실제 지문/Pin 인증 모듈을 연동하세요

export default function WithdrawAuthScreen() {
  const { account, bank, amount } = useRoute().params;
  const nav = useNavigation();

  const handleAuthSuccess = async () => {
    // TODO: 실제 출금 API 호출
    // await withdrawAPI({ account, bank, amount: Number(amount) });
    alert('출금 완료!');
    nav.navigate("MainTabs");
  };

  return (
    <View style={{ flex:1, padding:16, justifyContent:'center', alignItems:'center' }}>
      <Text>인증을 진행해주세요</Text>
      <Button title="모의 인증 성공" onPress={handleAuthSuccess} />
    </View>
  );
}