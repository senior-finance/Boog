// screens/WithdrawBankScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';

export default function WithdrawBankScreen() {
  const { accountNumber } = useRoute().params;
  const nav = useNavigation();
  const [bank, setBank] = useState('');

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text>계좌: {accountNumber}</Text>
      <Picker
        selectedValue={bank}
        onValueChange={(v) => setBank(v)}
        style={{ marginVertical:20 }}
      >
        <Picker.Item label="은행 선택" value="" />
        <Picker.Item label="우리은행" value="Woori" />
        <Picker.Item label="국민은행" value="KB" />
        {/* ... */}
      </Picker>
      <Button
        title="다음"
        disabled={!bank}
        onPress={() => nav.navigate('WithdrawAmount', { accountNumber, bank })}
      />
    </View>
  );
}